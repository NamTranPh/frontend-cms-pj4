export interface StartUploadRequest {
  fileName: string;
  fileSizeBytes: number;
}

export interface PresignedUrlResult {
  partNumber: number;
  url: string;
}

export interface RecordPartRequest {
  etag: string;
  sizeBytes: number;
}

export interface UploadPartResult {
  partNumber: number;
  etag: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface UploadSessionResult {
  id: string;
  targetId: string;
  uploadId: string;
  rawFileKey: string;
  bucket: string;
  fileSizeBytes: number;
  fileName: string;
  partSizeBytes: number;
  status: string;
  parts: UploadPartResult[];
  expiresAt: string;
  createdAt: string;
}
