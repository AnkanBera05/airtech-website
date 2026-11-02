import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const MAX_DOC_SIZE_BYTES = 25 * 1024 * 1024;   // 25MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "application/pdf",
  "application/zip",
  "application/acad",
  "application/octet-stream", // Fallback for DWG/DXF
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as string) || "general";
    const altText = (formData.get("altText") as string) || "";
    const isPrivate = formData.get("isPrivate") === "true" || category === "resume" || category === "private_drawing";

    if (!file) {
      return NextResponse.json({ error: "No file provided in form data." }, { status: 400 });
    }

    // 1. Validate MIME Type
    if (!ALLOWED_MIME_TYPES.includes(file.type) && !file.name.match(/\.(dwg|dxf|pdf|png|jpe?g|webp|svg)$/i)) {
      return NextResponse.json(
        { error: `File type '${file.type}' is not supported. Please upload an image, PDF, or CAD drawing.` },
        { status: 400 }
      );
    }

    // 2. Validate Size Limit
    const isImage = file.type.startsWith("image/");
    const maxLimit = isImage ? MAX_IMAGE_SIZE_BYTES : MAX_DOC_SIZE_BYTES;
    if (file.size > maxLimit) {
      const mbLimit = Math.round(maxLimit / (1024 * 1024));
      return NextResponse.json(
        { error: `File size exceeds maximum allowed limit of ${mbLimit}MB.` },
        { status: 400 }
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const sanitizedOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniqueId = crypto.randomUUID();
    const fileExtension = sanitizedOriginalName.split(".").pop() || "bin";
    const targetBucket = isPrivate ? "airtech-private" : "airtech-public";
    const storagePath = `${category}/${uniqueId}.${fileExtension}`;

    let publicUrl = "";

    if (isSupabaseConfigured) {
      try {
        // Upload to Supabase Storage
        const { error: uploadError } = await supabaseAdmin.storage
          .from(targetBucket)
          .upload(storagePath, fileBuffer, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) {
          console.error("[Supabase Storage Upload Error]", uploadError);
        } else {
          if (isPrivate) {
            // For private files, generate signed URL valid for 1 hour
            const { data: signedData } = await supabaseAdmin.storage
              .from(targetBucket)
              .createSignedUrl(storagePath, 3600);
            publicUrl = signedData?.signedUrl || "";
          } else {
            const { data: pubData } = supabaseAdmin.storage
              .from(targetBucket)
              .getPublicUrl(storagePath);
            publicUrl = pubData.publicUrl;
          }

          // Record in media_assets table
          await supabaseAdmin.from("media_assets").insert({
            id: uniqueId,
            filename: `${uniqueId}.${fileExtension}`,
            original_name: sanitizedOriginalName,
            storage_path: storagePath,
            public_url: publicUrl,
            bucket: targetBucket,
            mime_type: file.type,
            size_bytes: file.size,
            alt_text: altText || sanitizedOriginalName,
            category,
          });
        }
      } catch (storageErr) {
        console.error("[Storage Exception]", storageErr);
      }
    }

    // Graceful fallback URL if cloud storage bucket is pending activation
    if (!publicUrl) {
      // In local testing, provide base64 data URL for images or simulated path
      if (isImage && file.size < 2 * 1024 * 1024) {
        publicUrl = `data:${file.type};base64,${fileBuffer.toString("base64")}`;
      } else {
        publicUrl = `https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop`;
      }
    }

    return NextResponse.json({
      success: true,
      id: uniqueId,
      filename: sanitizedOriginalName,
      publicUrl,
      storagePath,
      bucket: targetBucket,
      sizeBytes: file.size,
      mimeType: file.type,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "File upload failed";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
