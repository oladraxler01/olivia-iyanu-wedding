"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Image as ImageIcon, Video, UploadCloud, X, Loader2, CheckCircle2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function GuestUploads() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if it's the wedding date or later (Dec 18, 2026)
  useEffect(() => {
    const weddingDate = new Date("2026-12-18T00:00:00").getTime();
    const now = new Date().getTime();
    if (now >= weddingDate) {
      setIsUnlocked(true);
    } else {
      // For testing, uncomment the next line to bypass the lock
      // setIsUnlocked(true);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setError("Please enter your name so the couple knows who took these!");
      return;
    }
    if (files.length === 0) {
      setError("Please select at least one photo or video to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    let completed = 0;

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const mediaType = file.type.startsWith("video/") ? "video" : "image";

        // 1. Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("guest-uploads")
          .upload(fileName, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw new Error("Failed to upload " + file.name + ": " + uploadError.message);

        // 2. Get public URL
        const { data: publicUrlData } = supabase.storage
          .from("guest-uploads")
          .getPublicUrl(fileName);
        
        const mediaUrl = publicUrlData.publicUrl;

        // 3. Save to database
        const { error: dbError } = await supabase
          .from("guest_media")
          .insert([{ guest_name: guestName.trim(), media_url: mediaUrl, media_type: mediaType }]);

        if (dbError) throw new Error("Failed to save record for " + file.name);

        completed++;
        setUploadProgress(Math.round((completed / files.length) * 100));
      }

      setUploadComplete(true);
      setFiles([]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isUnlocked) {
    return (
      <section className="py-24 px-4 bg-[#F5EFEF]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-6 shadow-sm border border-[#E3D3DA]">
            <Lock className="w-8 h-8 text-[#6B5A63]" />
          </div>
          <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }} className="text-4xl font-light text-[#0E5C52] mb-4">
            Digital Disposable Camera
          </h2>
          <p className="text-[#6B5A63] text-sm sm:text-base leading-relaxed">
            This section is currently locked. Check back on our wedding day (December 18, 2026) to upload the photos and videos you take!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 bg-[#F5EFEF]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Camera className="w-10 h-10 text-[#B23A6B] mx-auto mb-4" />
          <h2 style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }} className="text-4xl sm:text-5xl font-light text-[#0E5C52] mb-3">
            Upload Memories
          </h2>
          <p className="text-sm sm:text-base text-[#6B5A63]">
            Be our guest photographers! Upload the candid photos and videos you've taken today.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-[#E3D3DA]">
          {uploadComplete ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-16 h-16 text-[#0E5C52] mx-auto mb-4" />
              <h3 style={{ fontFamily: "var(--font-cormorant), Georgia, serif" }} className="text-3xl text-[#0E5C52] mb-2">
                Upload Successful!
              </h3>
              <p className="text-[#6B5A63] text-sm mb-8">
                Thank you, {guestName}! We can't wait to look through these.
              </p>
              <button
                onClick={() => setUploadComplete(false)}
                className="px-6 py-2 border border-[#E3D3DA] rounded-full text-sm font-semibold text-[#0E5C52] hover:bg-[#F5EFEF] transition-colors"
              >
                Upload more
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5A63] mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. John Doe"
                  disabled={isUploading}
                  className="w-full px-4 py-3 border border-[#E3D3DA] rounded-lg text-sm focus:outline-none focus:border-[#0E5C52]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6B5A63] mb-2">
                  Photos & Videos
                </label>
                
                <div 
                  className={`border-2 border-dashed border-[#E3D3DA] rounded-xl p-8 text-center transition-colors ${
                    isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#FDFBF7] cursor-pointer"
                  }`}
                  onClick={() => !isUploading && fileInputRef.current?.click()}
                >
                  <UploadCloud className="w-10 h-10 text-[#0E5C52] mx-auto mb-3" />
                  <p className="text-sm font-medium text-[#241B22] mb-1">Click to browse files</p>
                  <p className="text-xs text-[#6B5A63]">Supports JPG, PNG, MP4, MOV</p>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden" 
                    disabled={isUploading}
                  />
                </div>

                {/* Selected Files Preview */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#FDFBF7] border border-[#F3E7EB] rounded-lg">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {file.type.startsWith("video/") ? (
                            <Video className="w-5 h-5 text-[#B23A6B] shrink-0" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-[#0E5C52] shrink-0" />
                          )}
                          <p className="text-sm text-[#241B22] truncate">{file.name}</p>
                        </div>
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => removeFile(idx)}
                          className="p-1 text-[#6B5A63] hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isUploading || files.length === 0}
                className="w-full py-4 bg-[#0E5C52] text-white text-sm font-bold rounded-lg hover:bg-[#0A4A42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                    <span className="relative z-10">Uploading... {uploadProgress}%</span>
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-[#0A4A42] z-0 transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </>
                ) : (
                  `Upload ${files.length} ${files.length === 1 ? 'file' : 'files'}`
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
