import React, { useRef, useState } from 'react';
import { UploadCloud, X } from 'lucide-react';
import { AmbientAsset } from '../../types';
import { GlassButton } from '../ui/GlassButton';
import { AmbientAssetPreview } from './AmbientAssetPreview';

interface AmbientAssetUploaderProps {
  value?: AmbientAsset;
  fallbackUrl?: string;
  onChange: (asset?: AmbientAsset) => void;
  onError?: (message: string) => void;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/svg+xml'];

const readFileAsDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(new Error('Unable to read file.'));
  reader.readAsDataURL(file);
});

const readFileAsText = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result));
  reader.onerror = () => reject(new Error('Unable to read SVG.'));
  reader.readAsText(file);
});

const isSafeSvg = (text: string) => {
  const lower = text.toLowerCase();
  return !lower.includes('<script') && !lower.includes('javascript:') && !/on\w+\s*=/.test(lower);
};

export const AmbientAssetUploader: React.FC<AmbientAssetUploaderProps> = ({ value, fallbackUrl, onChange, onError }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const applyFile = async (file?: File) => {
    if (!file) {
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      onError?.('Unsupported ambient asset. Upload PNG, JPG, JPEG, WEBP, GIF, or a safe SVG.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onError?.('Ambient asset is too large. Please upload a file under 2 MB for smooth performance.');
      return;
    }

    try {
      let url = '';

      if (file.type === 'image/svg+xml') {
        const svgText = await readFileAsText(file);
        if (!isSafeSvg(svgText)) {
          onError?.('This SVG contains script-like content and was blocked for safety.');
          return;
        }
        url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
      } else {
        url = await readFileAsDataUrl(file);
      }

      onChange({
        url,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      });
    } catch {
      onError?.('Could not read this ambient asset. Try a different image.');
    }
  };

  return (
    <div className="space-y-3">
      <AmbientAssetPreview asset={value} fallbackUrl={fallbackUrl} title={value ? 'Uploaded ambient asset' : 'Selected ambient fallback'} />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          applyFile(event.dataTransfer.files[0]);
        }}
        className={`rounded-2xl border border-dashed p-4 text-center transition-all duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-500/10'
            : 'border-slate-300 bg-white/55 dark:border-slate-700 dark:bg-slate-950/35'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(event) => applyFile(event.target.files?.[0])}
        />
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
          <UploadCloud className="h-4 w-4" />
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">Drop a custom ambient asset</p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">PNG, JPG, WEBP, GIF, or safe SVG. Max 2 MB.</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          <GlassButton type="button" variant="secondary" className="px-4 py-2 text-sm" onClick={() => inputRef.current?.click()}>
            Choose File
          </GlassButton>
          {value && (
            <GlassButton type="button" variant="danger" className="px-4 py-2 text-sm" onClick={() => onChange(undefined)}>
              <X className="h-4 w-4" />
              Remove
            </GlassButton>
          )}
        </div>
      </div>
    </div>
  );
};
