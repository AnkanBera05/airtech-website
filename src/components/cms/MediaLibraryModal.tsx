"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon, Check, RefreshCw, AlertCircle, FileText } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  url: string;
  category: string;
  size: string;
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  targetCategory?: string;
}

export function MediaLibraryModal({
  isOpen,
  onClose,
  onSelectImage,
  targetCategory = "general",
}: MediaLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [uploading, setUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-cataloged verified engineering media assets
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: "media-1",
      name: "Chiller Plant & Ductwork",
      url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop",
      category: "services",
      size: "1.2 MB",
    },
    {
      id: "media-2",
      name: "Modern Glass Facade",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop",
      category: "about",
      size: "1.8 MB",
    },
    {
      id: "media-3",
      name: "Commercial Office Complex",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      category: "projects",
      size: "950 KB",
    },
    {
      id: "media-4",
      name: "Hospital Super-Speciality Facility",
      url: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=800&auto=format&fit=crop",
      category: "projects",
      size: "1.1 MB",
    },
    {
      id: "media-5",
      name: "Fire Fighting Pump Station",
      url: "https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?q=80&w=800&auto=format&fit=crop",
      category: "services",
      size: "1.4 MB",
    },
    {
      id: "media-6",
      name: "Electrical Transformer Substation",
      url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop",
      category: "services",
      size: "820 KB",
    },
  ]);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", targetCategory);

    try {
      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      const newItem: MediaItem = {
        id: data.id || crypto.randomUUID(),
        name: data.filename || file.name,
        url: data.publicUrl,
        category: targetCategory,
        size: `${Math.round(file.size / 1024)} KB`,
      };

      setMediaItems((prev) => [newItem, ...prev]);
      setSelectedUrl(newItem.url);
      setActiveTab("library");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading file";
      setErrorMessage(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedUrl) {
      onSelectImage(selectedUrl);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-sm border border-steel-300 max-w-3xl w-full flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-navy-950 text-white px-6 py-4 flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blueprint-400" />
            <h2 className="font-bold text-base tracking-tight">Universal Media Library</h2>
          </div>
          <button onClick={onClose} className="text-steel-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-steel-200 bg-steel-50 px-6 pt-3 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-3 border-b-2 uppercase tracking-wider transition-colors ${
              activeTab === "upload"
                ? "border-navy-950 text-navy-950 font-bold"
                : "border-transparent text-steel-500 hover:text-navy-950"
            }`}
          >
            Upload New Asset
          </button>
          <button
            onClick={() => setActiveTab("library")}
            className={`pb-3 border-b-2 uppercase tracking-wider transition-colors ${
              activeTab === "library"
                ? "border-navy-950 text-navy-950 font-bold"
                : "border-transparent text-steel-500 hover:text-navy-950"
            }`}
          >
            Media Library ({mediaItems.length})
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-airtech-red text-xs rounded-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {activeTab === "upload" ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-steel-300 hover:border-airtech-blue rounded-sm p-12 text-center cursor-pointer transition-all bg-steel-50/50 hover:bg-blue-50/20"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />

              {uploading ? (
                <div className="flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-airtech-blue animate-spin" />
                  <span className="text-xs font-semibold text-navy-950">Uploading to Supabase Storage...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 bg-white rounded-full border border-steel-300 flex items-center justify-center text-steel-500 shadow-sm mb-2">
                    <Upload className="w-6 h-6 text-airtech-blue" />
                  </div>
                  <h3 className="text-sm font-bold text-navy-950">
                    Click to browse or drag and drop image here
                  </h3>
                  <p className="text-xs text-steel-500 max-w-sm">
                    Supports JPG, PNG, WebP, SVG, and engineering PDFs up to 10MB.
                  </p>
                  <span className="mt-2 text-[10px] font-mono bg-steel-200 text-steel-700 px-2 py-0.5 rounded-sm">
                    Target Category: {targetCategory.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mediaItems.map((item) => {
                const isSelected = selectedUrl === item.url;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedUrl(item.url)}
                    className={`border-2 rounded-sm overflow-hidden cursor-pointer transition-all relative group bg-steel-50 ${
                      isSelected
                        ? "border-airtech-blue ring-2 ring-airtech-blue/20"
                        : "border-steel-200 hover:border-steel-400"
                    }`}
                  >
                    <div className="relative h-28 w-full bg-steel-200 overflow-hidden">
                      <Image
                        src={item.url}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-airtech-blue/40 flex items-center justify-center text-white">
                          <Check className="w-6 h-6 drop-shadow" />
                        </div>
                      )}
                    </div>
                    <div className="p-2 text-left">
                      <div className="text-[11px] font-bold text-navy-950 truncate">{item.name}</div>
                      <div className="text-[10px] text-steel-400 font-mono flex justify-between">
                        <span>{item.category}</span>
                        <span>{item.size}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-steel-50 px-6 py-3.5 border-t border-steel-200 flex items-center justify-between text-xs">
          <span className="text-steel-500 font-mono text-[11px] truncate max-w-xs">
            {selectedUrl ? `Selected: ${selectedUrl.slice(0, 45)}...` : "Select an image to attach"}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-steel-600 hover:text-navy-950 px-4 py-2 font-medium"
            >
              Cancel
            </button>
            <button
              disabled={!selectedUrl}
              onClick={handleConfirmSelection}
              className="bg-navy-950 hover:bg-navy-900 text-white font-semibold px-5 py-2 rounded-sm disabled:opacity-50 transition-colors"
            >
              Attach to CMS →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
