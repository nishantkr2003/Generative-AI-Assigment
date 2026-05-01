// UI REDESIGNED - logic unchanged
import { useState } from "react";
import { uploadDocument, storeDocument } from "../services/api";
import toast from "react-hot-toast";

export default function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Unsupported file type.");
      return;
    }
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size exceeds 10MB.");
      return;
    }
    setSelectedFile(file);
    setStatus("");
    toast.success("File selected successfully.");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first.");
      return;
    }
    try {
      setLoading(true);
      setStatus("Uploading document...");
      toast.loading("Uploading document...", { id: "uploadDoc" });
      const uploadResponse = await uploadDocument(selectedFile);
      const filename = uploadResponse.filename;
      setStatus("Processing and storing document...");
      toast.loading("Processing and storing document...", { id: "uploadDoc" });
      await storeDocument(filename);
      setStatus("success");
      toast.success("Document uploaded successfully!", { id: "uploadDoc" });
      setUploadedDocs((prev) => [
        ...prev,
        { name: filename, type: selectedFile.type },
      ]);
      setSelectedFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed.", {
        id: "uploadDoc",
      });
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (type) => {
    if (type?.includes("pdf")) return "📄";
    if (type?.includes("word")) return "📝";
    if (type?.includes("markdown")) return "🗒️";
    return "📃";
  };

  const formatSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Drop zone */}
      <label
        className={`relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 py-8 px-4
          ${dragging ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]" : "border-white/10 bg-white/[0.02] hover:border-cyan-500/40 hover:bg-white/[0.04]"}
          ${selectedFile ? "border-cyan-500/40" : ""}`}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={() => setDragging(false)}
      >
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl mb-3 transition-all duration-200
          ${dragging ? "bg-cyan-500/20" : "bg-white/5"}`}
        >
          <svg
            className={`h-6 w-6 transition-colors duration-200 ${dragging ? "text-cyan-400" : "text-gray-500"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {selectedFile ? (
          <div className="text-center">
            <p className="text-sm font-medium text-cyan-400">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatSize(selectedFile.size)}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-300">
              <span className="font-semibold text-white">Click to upload</span>{" "}
              or drag & drop
            </p>
            <p className="text-xs text-gray-500 mt-1">Max 10MB</p>
          </div>
        )}

        {/* Format badges */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {["PDF", "DOCX", "TXT", "MD"].map((fmt) => (
            <span
              key={fmt}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-400 font-medium"
            >
              {fmt}
            </span>
          ))}
        </div>

        <input
          type="file"
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={loading || !selectedFile}
        className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200
          ${
            loading || !selectedFile
              ? "bg-white/5 text-gray-600 cursor-not-allowed border border-white/5"
              : "bg-gradient-to-r from-cyan-400 to-sky-500 text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110 hover:shadow-cyan-500/30 hover:scale-[1.01]"
          }`}
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
            {status === "Uploading document..."
              ? "Uploading..."
              : "Processing..."}
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload & Store
          </>
        )}
      </button>

      {/* Uploaded docs list */}
      {uploadedDocs.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500 mb-2">
            Uploaded
          </p>
          <ul className="space-y-2">
            {uploadedDocs.map((doc, index) => (
              <li
                key={index}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base">{getFileIcon(doc.type)}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {doc.type?.split("/")[1]?.toUpperCase()}
                    </p>
                  </div>
                </div>
                <span className="ml-2 shrink-0 flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400">
                  <span className="h-1 w-1 rounded-full bg-green-400" />
                  Ready
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
