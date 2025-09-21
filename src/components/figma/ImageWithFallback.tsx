import React, { useState, useRef } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

export function ImageWithFallback({ 
  src, 
  fallback = '/placeholder.png',
  alt = '',
  ...props 
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleError = () => {
    setImgSrc(fallback);
  };

  return (
    <img
      ref={imgRef}
      src={imgSrc}
      alt={alt}
      onError={handleError}
      {...props}
    />
  );
}
