import { useState } from "react";
import { uploadDocument, storeDocument } from "../services/api";
import toast from "react-hot-toast";

export default function FileUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);

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

    const maxSize = 10 * 1024 * 1024; // 10MB

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

      toast.loading("Uploading document...", {
        id: "uploadDoc",
      });

      // Step 1: Upload
      const uploadResponse = await uploadDocument(selectedFile);

      const filename = uploadResponse.filename;

      setStatus("Processing and storing document...");

      toast.loading("Processing and storing document...", {
        id: "uploadDoc",
      });

      // Step 2: Store
      await storeDocument(filename);

      setStatus("Document uploaded and stored successfully!");

      toast.success("Document uploaded successfully!", {
        id: "uploadDoc",
      });
      setUploadedDocs((prev) => [
        ...prev,
        {
          name: filename,
          type: selectedFile.type,
        },
      ]);

      setSelectedFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed.", {
        id: "uploadDoc",
      });

      setStatus(
        error.response?.data?.message || "Upload failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Upload Document</h2>

      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer bg-gray-800 hover:bg-gray-700 transition mb-4">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <p className="mb-2 text-sm text-gray-300">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500">PDF, DOCX, TXT, MD (Max 10MB)</p>

          {selectedFile && (
            <p className="mt-3 text-sm text-green-400">
              Selected: {selectedFile.name}
            </p>
          )}
        </div>

        <input
          type="file"
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-6 py-3 bg-white text-black rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? "Processing..." : "Upload & Store"}
      </button>

      {status && <p className="mt-4 text-sm text-gray-300">{status}</p>}
      {uploadedDocs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Uploaded Documents</h3>

          <ul className="space-y-2">
            {uploadedDocs.map((doc, index) => (
              <li
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-medium text-white">{doc.name}</p>

                  <p className="text-xs text-gray-400">{doc.type}</p>
                </div>

                <span className="text-green-400 text-sm font-semibold">
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
