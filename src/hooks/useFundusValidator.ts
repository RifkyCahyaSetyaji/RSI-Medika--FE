import { useState, useCallback } from 'react';
import { validateFundusImage, ValidationResponse } from '../api';

export function useFundusValidator() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<ValidationResponse | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const processFile = useCallback(async (file: File) => {
    setValidationError(null);
    setValidationResult(null);

    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setValidationError('Format file tidak didukung. Harap unggah citra fundus dalam format JPG atau PNG.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setValidationError('Ukuran file terlalu besar (maksimal 10 MB).');
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    setIsValidating(true);
    try {
      const res = await validateFundusImage(file);
      setValidationResult(res);
      if (!res.valid) {
        setValidationError(`Citra Tidak Terdeteksi Sebagai Retina: ${res.reason}`);
      }
    } catch (err: any) {
      console.warn('Verifikasi awal citra fundus gagal terhubung:', err);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const loadSample = useCallback(async (samplePath: string, sampleName: string) => {
    try {
      const res = await fetch(samplePath);
      const blob = await res.blob();
      const file = new File([blob], sampleName, { type: 'image/jpeg' });
      await processFile(file);
    } catch (err) {
      console.error(err);
      setValidationError('Gagal memuat citra sampel klinis');
    }
  }, [processFile]);

  const reset = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationResult(null);
    setValidationError(null);
    setIsValidating(false);
  }, []);

  return {
    selectedFile,
    previewUrl,
    isValidating,
    validationResult,
    validationError,
    processFile,
    loadSample,
    reset,
  };
}
