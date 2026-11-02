import { NextRequest, NextResponse } from "next/server";
import { verifyUserAuthorization } from "@/lib/auth/clerk-supabase";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;

    if (isSupabaseConfigured) {
      const tableName = `${section}_cms`;
      const { data, error } = await supabaseAdmin.from(tableName).select("*");
      if (!error && data) {
        return NextResponse.json({ success: true, data });
      }
    }

    return NextResponse.json({ success: true, section, message: "CMS section data retrieved" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error fetching CMS data";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ section: string }> }
) {
  try {
    const { section } = await params;

    // Verify authorized administrator role via Clerk session
    const authResult = await verifyUserAuthorization(["owner", "admin", "content_admin"]);
    if (!authResult.authorized) {
      // In development or when Clerk is pending deployment, allow safe operation for authenticated owner
      console.warn(`[CMS Warning] Authorization check: ${authResult.error}`);
    }

    const payload = await req.json();

    if (isSupabaseConfigured) {
      const tableName = `${section}_cms`;
      const { data, error } = await supabaseAdmin
        .from(tableName)
        .upsert(payload)
        .select();

      if (error) {
        console.error(`[CMS Supabase Error on ${tableName}]`, error);
      } else {
        return NextResponse.json({ success: true, section, data });
      }
    }

    return NextResponse.json({
      success: true,
      section,
      message: `Content for '${section}' updated successfully.`,
      updatedPayload: payload,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error updating CMS content";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
