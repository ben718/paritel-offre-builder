
import React from 'react';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderClassName?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  placeholderClassName,
  loadingComponent,
  errorComponent,
  ...props
}: OptimizedImageProps) => {
  const { src: optimizedSrc, isLoading, hasError } = useOptimizedImage(src, { width, height });
  
  if (isLoading && loadingComponent) {
    return <>{loadingComponent}</>;
  }
  
  if (hasError && errorComponent) {
    return <>{errorComponent}</>;
  }
  
  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={cn(
        'object-contain transition-opacity',
        isLoading ? 'opacity-0' : 'opacity-100',
        hasError ? placeholderClassName : className
      )}
      width={width}
      height={height}
      loading="lazy"
      {...props}
    />
  );
};

export default OptimizedImage;
