import { fitImage } from './image-processing';

describe('fitImage', () => {
  it('should not scale or rotate an image that already fits', () => {
    expect(
      fitImage({ width: 400, height: 300 }, { width: 800, height: 600 }),
    ).toEqual({ scale: 1, rotate: false });
  });

  it('should scale down a larger image with the same orientation', () => {
    expect(
      fitImage({ width: 800, height: 600 }, { width: 400, height: 300 }),
    ).toEqual({ scale: 0.5, rotate: false });
  });

  it('should scale by the more restrictive side', () => {
    const { scale, rotate } = fitImage(
      { width: 1000, height: 100 },
      { width: 500, height: 400 },
    );
    expect(rotate).toBe(false);
    expect(scale).toBe(0.5);
  });

  it('should rotate a landscape image to fit a portrait page', () => {
    const { scale, rotate } = fitImage(
      { width: 4000, height: 3000 },
      { width: 595, height: 842 },
    );
    expect(rotate).toBe(true);
    // rotated image is 3000 wide, limited by the width of the page
    expect(scale).toBeCloseTo(595 / 3000);
  });

  it('should rotate a portrait image to fit a landscape page', () => {
    const { scale, rotate } = fitImage(
      { width: 3000, height: 4000 },
      { width: 842, height: 595 },
    );
    expect(rotate).toBe(true);
    expect(scale).toBeCloseTo(595 / 3000);
  });

  it('should rotate but never upscale a small image', () => {
    expect(
      fitImage({ width: 100, height: 50 }, { width: 595, height: 842 }),
    ).toEqual({ scale: 1, rotate: true });
  });

  it('should not rotate square images on a portrait page', () => {
    expect(
      fitImage({ width: 1000, height: 1000 }, { width: 500, height: 800 }),
    ).toEqual({ scale: 0.5, rotate: false });
  });
});
