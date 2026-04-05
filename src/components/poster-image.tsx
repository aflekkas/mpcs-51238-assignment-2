"use client";

import { useState } from "react";
import Image from "next/image";

interface PosterImageProps {
  posterUrl?: string;
  posterGradient: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  gradientClassName?: string;
  imageClassName?: string;
}

export function PosterImage({
  posterUrl,
  posterGradient,
  alt,
  sizes,
  priority,
  gradientClassName = "absolute inset-0",
  imageClassName = "object-cover",
}: PosterImageProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <div className={gradientClassName} style={{ background: posterGradient }} />
      {posterUrl && !imgError && (
        <Image
          src={posterUrl}
          alt={alt}
          fill
          className={imageClassName}
          sizes={sizes}
          priority={priority}
          onError={() => setImgError(true)}
        />
      )}
    </>
  );
}
