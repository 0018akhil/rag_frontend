import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import api from '../utils/api';

interface DocumentUploadProps {
  onUploadSuccess: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadSuccess }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);
      setError(null);

      setIsUploading(true);
      try {
        await api.post("/documents/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        onUploadSuccess();
      } catch (error) {
        console.error("Upload failed", error);
        setError("Failed to upload the document. Please try again or documet is corrupted.");
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadSuccess]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #eeeeee",
        borderRadius: 2,
        p: 2,
        textAlign: "center",
        cursor: isUploading ? "default" : "pointer",
        backgroundColor: isUploading ? "#f5f5f5" : "transparent",
      }}
    >
      {error !== null && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}
      <input {...getInputProps()} disabled={isUploading} />
      {isUploading ? (
        <CircularProgress />
      ) : (
        <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main" }} />
      )}
      <Typography variant="body1">
        {isUploading
          ? "Uploading..."
          : isDragActive
          ? "Drop the file here"
          : "Drag & drop a file here, or click to select"}
      </Typography>
      <Button 
        variant="contained" 
        sx={{ mt: 2 }} 
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Upload Document"}
      </Button>
    </Box>
  );
};

export default DocumentUpload;
