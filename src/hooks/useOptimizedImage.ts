
import { useState, useEffect } from 'react';

interface ImageOptions {
  placeholder?: string;
  quality?: 'low' | 'medium' | 'high';
  width?: number;
  height?: number;
}

const defaultOptions: ImageOptions = {
  placeholder: '/placeholder.svg',
  quality: 'high',
};

export function useOptimizedImage(
  src: string | null | undefined,
  options: ImageOptions = {}
) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>(options.placeholder || defaultOptions.placeholder || '');
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  useEffect(() => {
    if (!src) {
      setError(true);
      return;
    }
    
    setLoaded(false);
    setError(false);
    
    // Reset to placeholder while loading
    setImageSrc(mergedOptions.placeholder || defaultOptions.placeholder || '');
    
    // Create a new image to preload
    const img = new Image();
    
    // Build URL with parameters if needed
    let imageUrl = src;
    
    // This is where we would add transformations for a real image service
    // For demo purposes, we'll just use the original image
    
    img.src = imageUrl;
    
    img.onload = () => {
      setImageSrc(imageUrl);
      setLoaded(true);
    };
    
    img.onerror = () => {
      setError(true);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, mergedOptions.placeholder]);
  
  return {
    src: imageSrc,
    isLoading: !loaded && !error,
    hasError: error,
    isLoaded: loaded,
  };
}
