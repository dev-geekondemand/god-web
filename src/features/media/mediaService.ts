// services/mediaService.ts
import api from '@/utils/api';
import axios, {  CancelTokenSource } from 'axios';

let cancelTokenSource: CancelTokenSource | null = null;

export const uploadMedia = async (
    requestId: string,
  formData: FormData,
  onProgress: (percent: number) => void
) => {
  if (cancelTokenSource) {
    cancelTokenSource.cancel("Upload canceled");
  }

  cancelTokenSource = axios.CancelToken.source();

  try {
    const res = await api.put(
      `request/${requestId}/complete`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) /( progressEvent.total ?? 0));
          onProgress(percent);
        },
        cancelToken: cancelTokenSource.token,
        withCredentials: true,
      }
    );
    return res.data;
  } catch (err) {
    if (axios.isCancel(err)) {
      throw new Error('Upload canceled');
    }
    throw err;
  }
};

export const cancelUpload = () => {
  if (cancelTokenSource) {
    cancelTokenSource.cancel('User cancelled upload');
  }
};
