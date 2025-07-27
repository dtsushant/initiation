import React from "react";

// Core Xingine-style ImageMeta interface
export interface ImageMeta {
  // Core image properties
  src: string;
  alt?: string;

  // Dimensions
  width?: number | string;
  height?: number | string;

  // Display properties
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  objectPosition?: string;

  // Loading behavior
  loading?: "eager" | "lazy";
  placeholder?: string;
  fallbackSrc?: string;

  // Responsive properties
  srcSet?: string;
  sizes?: string;

  // Styling (Xingine pattern)
  className?: string;
  style?: React.CSSProperties;

  // Interaction
  draggable?: boolean;
  crossOrigin?: "anonymous" | "use-credentials";

  // Event handlers (Xingine pattern)
  onClick?: (event: React.MouseEvent<HTMLImageElement>) => void;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;

  // Accessibility
  title?: string;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;

  // Xingine meta properties
  id?: string;
  "data-testid"?: string;
  "data-component"?: string;

  // Xingine-style conditional rendering
  visible?: boolean;
  condition?: () => boolean;

  // Xingine animation support
  animation?: {
    type: "fade" | "slide" | "zoom" | "none";
    duration?: number;
    delay?: number;
  };
}

// Xingine-style renderer component
export const ImageRenderer: React.FC<ImageMeta> = (meta) => {
  // State management (Xingine pattern)
  const [imageSrc, setImageSrc] = React.useState<string>(meta.src);
  const [loadingState, setLoadingState] = React.useState<
    "loading" | "loaded" | "error"
  >("loading");
  const [isVisible, setIsVisible] = React.useState<boolean>(
    meta.visible !== false,
  );

  // Refs for Xingine-style DOM access
  const imageRef = React.useRef<HTMLImageElement>(null);

  // Effect for visibility control (Xingine pattern)
  React.useEffect(() => {
    if (meta.condition) {
      setIsVisible(meta.condition());
    } else {
      setIsVisible(meta.visible !== false);
    }
  }, [meta.visible, meta.condition]);

  // Effect for src changes (Xingine pattern)
  React.useEffect(() => {
    setImageSrc(meta.src);
    setLoadingState("loading");
  }, [meta.src]);

  // Event handlers (Xingine pattern)
  const handleLoad = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoadingState("loaded");
      meta.onLoad?.(event);
    },
    [meta],
  );

  const handleError = React.useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setLoadingState("error");

      // Fallback handling
      if (meta.fallbackSrc && imageSrc !== meta.fallbackSrc) {
        setImageSrc(meta.fallbackSrc);
        setLoadingState("loading");
        return;
      }

      meta.onError?.(event);
    },
    [meta, imageSrc],
  );

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLImageElement>) => {
      meta.onClick?.(event);
    },
    [meta],
  );

  // Xingine-style class computation
  const computedClassName = React.useMemo(() => {
    const classes: string[] = [];

    // Base classes
    classes.push("xingine-image");

    // Loading state classes
    if (loadingState === "loading") {
      classes.push("xingine-image--loading");
    } else if (loadingState === "error") {
      classes.push("xingine-image--error");
    } else {
      classes.push("xingine-image--loaded");
    }

    // Animation classes (Xingine pattern)
    if (meta.animation?.type && meta.animation.type !== "none") {
      classes.push(`xingine-animation--${meta.animation.type}`);
    }

    // Interactive classes
    if (meta.onClick) {
      classes.push("xingine-image--interactive");
    }

    // Custom classes
    if (meta.className) {
      classes.push(meta.className);
    }

    return classes.join(" ");
  }, [loadingState, meta.animation, meta.onClick, meta.className]);

  // Xingine-style style computation
  const computedStyle = React.useMemo(() => {
    const styles: React.CSSProperties = {
      ...meta.style,
    };

    // Dimension styles
    if (meta.width) styles.width = meta.width;
    if (meta.height) styles.height = meta.height;

    // Object fit styles
    if (meta.objectFit) styles.objectFit = meta.objectFit;
    if (meta.objectPosition) styles.objectPosition = meta.objectPosition;

    // Animation styles (Xingine pattern)
    if (meta.animation?.duration) {
      styles.animationDuration = `${meta.animation.duration}ms`;
    }
    if (meta.animation?.delay) {
      styles.animationDelay = `${meta.animation.delay}ms`;
    }

    // Visibility
    if (!isVisible) {
      styles.display = "none";
    }

    return styles;
  }, [meta, isVisible]);

  // Xingine-style data attributes
  const dataAttributes = React.useMemo(() => {
    const attrs: Record<string, string> = {};

    attrs["data-component"] = meta["data-component"] || "ImageRenderer";

    if (meta["data-testid"]) {
      attrs["data-testid"] = meta["data-testid"];
    }

    attrs["data-loading-state"] = loadingState;

    return attrs;
  }, [meta, loadingState]);

  // Early return for invisible components (Xingine pattern)
  if (!isVisible) {
    return null;
  }

  // Placeholder rendering (Xingine pattern)
  if (loadingState === "loading" && meta.placeholder) {
    return (
      <div
        className={`${computedClassName} xingine-image-placeholder`}
        style={computedStyle}
        {...dataAttributes}
      >
        <div className="xingine-image-placeholder__content">
          {typeof meta.placeholder === "string" ? (
            <span className="xingine-image-placeholder__text">
              {meta.placeholder}
            </span>
          ) : (
            meta.placeholder
          )}
        </div>
      </div>
    );
  }

  // Error state rendering (Xingine pattern)
  if (loadingState === "error" && !meta.fallbackSrc) {
    return (
      <div
        className={`${computedClassName} xingine-image-error`}
        style={computedStyle}
        {...dataAttributes}
      >
        <div className="xingine-image-error__content">
          <svg
            className="xingine-image-error__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span className="xingine-image-error__text">
            Image failed to load
          </span>
        </div>
      </div>
    );
  }

  // Main image rendering (Xingine pattern)
  return <div>image is rendered here </div>;
};

// Xingine-style builder pattern
export class ImageMetaBuilder {
  private meta: ImageMeta;

  constructor(src: string) {
    this.meta = { src };
  }

  static create(src: string): ImageMetaBuilder {
    return new ImageMetaBuilder(src);
  }

  alt(alt: string): this {
    this.meta.alt = alt;
    return this;
  }

  dimensions(width: number | string, height?: number | string): this {
    this.meta.width = width;
    this.meta.height = height || width;
    return this;
  }

  objectFit(fit: ImageMeta["objectFit"]): this {
    this.meta.objectFit = fit;
    return this;
  }

  className(className: string): this {
    this.meta.className = className;
    return this;
  }

  placeholder(placeholder: string): this {
    this.meta.placeholder = placeholder;
    return this;
  }

  fallback(fallbackSrc: string): this {
    this.meta.fallbackSrc = fallbackSrc;
    return this;
  }

  onClick(handler: ImageMeta["onClick"]): this {
    this.meta.onClick = handler;
    return this;
  }

  animation(
    type: ImageMeta["animation"]["type"],
    duration?: number,
    delay?: number,
  ): this {
    this.meta.animation = { type, duration, delay };
    return this;
  }

  condition(condition: () => boolean): this {
    this.meta.condition = condition;
    return this;
  }

  testId(testId: string): this {
    this.meta["data-testid"] = testId;
    return this;
  }

  build(): ImageMeta {
    return { ...this.meta };
  }
}

// Xingine-style presets
export const XingineImagePresets = {
  avatar: (src: string, size: number = 40): ImageMeta =>
    ImageMetaBuilder.create(src)
      .dimensions(size)
      .objectFit("cover")
      .className("xingine-avatar rounded-full")
      .alt("User avatar")
      .build(),

  hero: (src: string): ImageMeta =>
    ImageMetaBuilder.create(src)
      .className("xingine-hero w-full h-64 md:h-96")
      .objectFit("cover")
      .alt("Hero image")
      .animation("fade", 300)
      .build(),

  thumbnail: (src: string): ImageMeta =>
    ImageMetaBuilder.create(src)
      .dimensions(120)
      .className("xingine-thumbnail rounded-lg shadow-sm")
      .objectFit("cover")
      .placeholder("Loading...")
      .build(),

  product: (src: string): ImageMeta =>
    ImageMetaBuilder.create(src)
      .className("xingine-product w-full aspect-square rounded-lg")
      .objectFit("cover")
      .placeholder("Loading product image...")
      .alt("Product image")
      .build(),

  logo: (src: string): ImageMeta =>
    ImageMetaBuilder.create(src)
      .className("xingine-logo h-8 w-auto")
      .objectFit("contain")
      .alt("Logo")
      .build(),
};

// Export types for Xingine integration
export type { ImageMeta };
export default ImageRenderer;

// Xingine-style CSS classes (to be moved to Xingine library)
/*
.xingine-image {
  @apply transition-all duration-300;
}

.xingine-image--loading {
  @apply opacity-75;
}

.xingine-image--error {
  @apply opacity-50 grayscale;
}

.xingine-image--loaded {
  @apply opacity-100;
}

.xingine-image--interactive {
  @apply cursor-pointer hover:opacity-80 focus:ring-2 focus:ring-blue-500 focus:outline-none;
}

.xingine-animation--fade {
  @apply animate-fade-in;
}

.xingine-animation--slide {
  @apply animate-slide-in;
}

.xingine-animation--zoom {
  @apply animate-zoom-in;
}

.xingine-image-placeholder {
  @apply bg-gray-100 flex items-center justify-center;
}

.xingine-image-placeholder__content {
  @apply text-center;
}

.xingine-image-placeholder__text {
  @apply text-gray-500 text-sm;
}

.xingine-image-error {
  @apply bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center;
}

.xingine-image-error__content {
  @apply text-center text-gray-500;
}

.xingine-image-error__icon {
  @apply w-8 h-8 mx-auto mb-2;
}

.xingine-image-error__text {
  @apply text-xs;
}
*/
