import { useEffect, useRef, useState } from 'react';

/** The use image options */
export interface UseImageOptions {
  /** The alt of the image */
  alt?: string;
  /** The class of the image */
  class?: string;
  /** The crossorigin of the image */
  crossorigin?: string;
  /** The loading of the image */
  loading?: HTMLImageElement['loading'];
  /** The referrer policy of the image */
  referrerPolicy?: HTMLImageElement['referrerPolicy'];
  /** The sizes of the image */
  sizes?: string;
  /** The srcset of the image */
  srcset?: string;
  /** The callback function to be invoked on error */
  onError?: (error: Error) => void;
  /** The callback function to be invoked on success */
  onSuccess?: (data: HTMLImageElement) => void;
}

/** The use image return type */
export interface UseImageReturn {
  /** The image loading error */
  error?: Error;
  /** The error state of the image */
  isError: boolean;
  /** Is image loading? */
  isLoading: boolean;
  /** The success state of the image */
  isSuccess: boolean;
  /** The image element */
  value?: HTMLImageElement;
}

/**
 * @name useImage
 * @description - Hook that load an image in the browser
 * @category Elements
 * @usage low
 *
 * @browserapi Image https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/Image
 *
 * @param {string} src The source of the image
 * @param {string} [options.srcset] The srcset of the image
 * @param {string} [options.sizes] The sizes of the image
 * @param {string} [options.alt] The alt of the image
 * @param {string} [options.class] The class of the image
 * @param {HTMLImageElement['loading']} [options.loading] The loading of the image
 * @param {string} [options.crossorigin] The crossorigin of the image
 * @param {HTMLImageElement['referrerPolicy']} [options.referrerPolicy] The referrerPolicy of the image
 * @param {(data: HTMLImageElement) => void} [options.onSuccess] The callback function to be invoked on success
 * @param {(error: Error) => void} [options.onError] The callback function to be invoked on error
 * @returns {UseImageReturn} An object with the image loading state
 *
 * @example
 * const { value, isLoading, isError, isSuccess, error } = useImage('https://example.com/image.png');
 */
export const useImage = (src: string, options: UseImageOptions = {}): UseImageReturn => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [value, setValue] = useState<HTMLImageElement | undefined>(undefined);

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const { alt, class: className, crossorigin, loading, referrerPolicy, sizes, srcset } = options;

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setError(undefined);
    setValue(undefined);

    const image = new Image();

    if (alt) image.alt = alt;
    if (srcset) image.srcset = srcset;
    if (sizes) image.sizes = sizes;
    if (className) image.className = className;
    if (loading) image.loading = loading;
    if (crossorigin) image.crossOrigin = crossorigin;
    if (referrerPolicy) image.referrerPolicy = referrerPolicy;

    const onLoad = () => {
      setValue(image);
      setIsSuccess(true);
      setIsLoading(false);
      setError(undefined);
      setIsError(false);
      optionsRef.current.onSuccess?.(image);
    };

    const onError = () => {
      const error = new Error(`Failed to load image: ${src}`);
      setValue(undefined);
      setIsSuccess(false);
      setIsLoading(false);
      setError(error);
      setIsError(true);
      optionsRef.current.onError?.(error);
    };

    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);

    image.src = src;

    if (image.complete) {
      if (image.naturalWidth > 0) onLoad();
      else onError();
    }

    return () => {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
    };
  }, [alt, className, crossorigin, loading, referrerPolicy, sizes, src, srcset]);

  return {
    value,
    error,
    isLoading,
    isError,
    isSuccess
  };
};
