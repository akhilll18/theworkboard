// src/components/Kanban/AttachmentUploader.tsx
import { useRef } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  InsertDriveFile as FileIcon,
  Close as CloseIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

export interface AttachmentFile {
  id: string;
  file: File;
  preview?: string;
}

interface AttachmentUploaderProps {
  files: AttachmentFile[];
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (id: string) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  accept?: string;
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function AttachmentUploader({
  files,
  onFilesAdd,
  onFileRemove,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  accept = 'image/*,.pdf,.csv,.doc,.docx,.xlsx',
  error,
}: AttachmentUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpen = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles: File[] = [];
    const currentCount = files.length;

    Array.from(fileList).forEach((file) => {
      if (currentCount + newFiles.length >= maxFiles) return;
      if (file.size > maxSize) return;
      newFiles.push(file);
    });

    if (newFiles.length > 0) {
      onFilesAdd(newFiles);
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Upload picker */}
      <Paper
        elevation={0}
        onClick={handleOpen}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 1.5,
          border: '2px dashed',
          borderColor: error ? '#FCA5A5' : '#E5E7EB',
          borderRadius: 1.5,
          bgcolor: '#FFFFFF',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          '&:hover': {
            borderColor: error ? '#FCA5A5' : '#9CA3AF',
            bgcolor: '#FAFAFA',
          },
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1,
            bgcolor: '#F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <UploadIcon sx={{ fontSize: 18, color: '#6B7280' }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.8rem',
              fontWeight: 500,
              color: '#111827',
            }}
          >
            Choose files
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Poppins, sans-serif !important',
              fontSize: '0.65rem',
              color: '#6B7280',
            }}
          >
            Images, PDF or CSV, up to 10 MB each
          </Typography>
        </Box>
        <input
          ref={inputRef}
          type="file"
          multiple
          hidden
          accept={accept}
          onChange={handleChange}
        />
      </Paper>

      {/* Error message */}
      {error && (
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            fontSize: '0.7rem',
            color: '#DC2626',
            mt: 0.75,
          }}
        >
          {error}
        </Typography>
      )}

      {/* File list */}
      {files.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 1 }}>
          {files.map((entry) => {
            const isImage = entry.file.type.startsWith('image/');
            return (
              <Paper
                key={entry.id}
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  p: 1,
                  border: '1px solid #E5E7EB',
                  borderRadius: 1.5,
                  bgcolor: '#FFFFFF',
                }}
              >
                {/* Preview or Icon */}
                {isImage && entry.preview ? (
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      overflow: 'hidden',
                      flexShrink: 0,
                      bgcolor: '#F3F4F6',
                    }}
                  >
                    <img
                      src={entry.preview}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 1,
                      bgcolor: '#F3F4F6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isImage ? (
                      <ImageIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                    ) : (
                      <FileIcon sx={{ fontSize: 18, color: '#6B7280' }} />
                    )}
                  </Box>
                )}

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins, sans-serif !important',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: '#111827',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {entry.file.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Poppins, sans-serif !important',
                      fontSize: '0.65rem',
                      color: '#6B7280',
                    }}
                  >
                    {formatBytes(entry.file.size)}
                  </Typography>
                </Box>

                {/* Remove */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFileRemove(entry.id);
                  }}
                  sx={{
                    p: 0.5,
                    color: '#6B7280',
                    '&:hover': {
                      color: '#DC2626',
                      bgcolor: '#FEF2F2',
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Paper>
            );
          })}
        </Box>
      )}

      {files.length === 0 && (
        <Typography
          sx={{
            fontFamily: 'Poppins, sans-serif !important',
            fontSize: '0.7rem',
            color: '#9CA3AF',
            mt: 0.75,
            textAlign: 'center',
          }}
        >
          No files chosen yet.
        </Typography>
      )}
    </Box>
  );
}