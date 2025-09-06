export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Prepares an image for PDF embedding.
 *
 * Scales the image down to fit its longer side within the specified maximum dimension, preserving aspect ratio.
 * Outputs the resized image as a JPEG Blob.
 *
 * @param image The image Blob
 */
export function preprocessImage(image: Blob, maxSize: number): Promise<Blob> {
  const img = document.createElement('img');
  img.src = URL.createObjectURL(image);

  return new Promise((resolve, reject) => {
    img.onload = () => {
      const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);

      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        blob => (blob ? resolve(blob) : reject('Failed to resize image')),
        'image/jpeg',
        0.95
      );
    };
  });
}

/**
 * Calculates the scaling factor and rotation requirement to fit an image within a given maximum size.
 *
 * Determines whether the image should be rotated to best fit the target dimensions, and computes the appropriate scale factor
 * to ensure the image fits within the specified maximum width and height, preserving aspect ratio.
 *
 * @param imgSize - The original size of the image.
 * @param maxSize - The maximum allowed size for the image.
 * @returns An object containing:
 *   - `scale`: The scaling factor to fit the image within the maximum size (never greater than 1).
 *   - `rotate`: Whether the image should be rotated to best fit the target dimensions.
 */
export function fitImage(
  imgSize: ImageSize,
  maxSize: ImageSize
): { scale: number; rotate: boolean } {
  const rotate =
    imgSize.width > imgSize.height != maxSize.width > maxSize.height;

  const imgHeight = rotate ? imgSize.width : imgSize.height;
  const imgWidth = rotate ? imgSize.height : imgSize.width;

  const xScale = maxSize.width / imgWidth;
  const yScale = maxSize.height / imgHeight;

  return {
    scale: Math.min(xScale, yScale, 1),
    rotate
  };
}
