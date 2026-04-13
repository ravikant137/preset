import { useState } from 'react';

export function useImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    const img = acceptedFiles[0];
    setFile(img);
    setPreview(URL.createObjectURL(img));
  };

  const clear = () => {
    setFile(null);
    setPreview(null);
  };

  return { file, preview, onDrop, clear };
}
