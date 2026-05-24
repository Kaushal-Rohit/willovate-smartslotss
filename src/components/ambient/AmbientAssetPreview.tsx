import React from 'react';
import { ImageIcon } from 'lucide-react';
import { AmbientAsset } from '../../types';

interface AmbientAssetPreviewProps {
  asset?: AmbientAsset;
  fallbackUrl?: string;
  title?: string;
}

const formatSize = (size?: number) => {
  if (!size) {
    return '';
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

export const AmbientAssetPreview: React.FC<AmbientAssetPreviewProps> = ({ asset, fallbackUrl, title = 'Ambient preview' }) => {
  const src = asset?.url || fallbackUrl;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm dark:border-slate-800/70 dark:bg-slate-950/45">
      <div className="relative aspect-[16/10] bg-slate-100 dark:bg-slate-900">
        {src ? (
          <img src={src} alt={title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <ImageIcon className="h-7 w-7" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="truncate text-sm font-bold text-white">{asset?.name || title}</p>
          {asset && <p className="text-xs text-white/75">{asset.type} - {formatSize(asset.size)}</p>}
        </div>
      </div>
    </div>
  );
};
