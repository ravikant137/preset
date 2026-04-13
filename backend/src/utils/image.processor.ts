import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { PresetAdjustments } from '../../../shared/types';

export const processImage = async (
  inputBuffer: Buffer,
  adjustments: PresetAdjustments,
  outputDir: string,
  filename: string
): Promise<string> => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, `processed_${filename}`);

  let image = sharp(inputBuffer);

  // Apply adjustments
  // Brightness: val is -100 to 100. Native factor is 1.0 (no change)
  const brightnessFactor = 1 + (adjustments.brightness / 100);
  const saturationFactor = 1 + (adjustments.saturation / 100);
  
  image = image.modulate({
    brightness: brightnessFactor,
    saturation: saturationFactor,
  });

  // Contrast: val is -100 to 100.
  // linear(multiplier, offset)
  const contrastMultiplier = 1 + (adjustments.contrast / 100);
  const contrastOffset = -(0.5 * contrastMultiplier) + 0.5;
  image = image.linear(contrastMultiplier, contrastOffset);

  // Temperature (Warmth/Coolness)
  const temp = adjustments.temperature / 100; // -1 to 1
  // Simple color matrix for temperature
  image = image.recomb([
    [1 + temp, 0, 0], // Red
    [0, 1, 0],        // Green
    [0, 0, 1 - temp]  // Blue
  ]);

  // Sharpness
  if (adjustments.sharpness > 0) {
    image = image.sharpen({
      sigma: adjustments.sharpness / 20,
    });
  }

  // Highlights/Shadows (Simple approximation using gamma)
  // High highlights adjustment -> lower gamma
  if (adjustments.highlights !== 0) {
    const highlightGamma = 1 - (adjustments.highlights / 200); // 0.5 to 1.5
    image = image.gamma(highlightGamma);
  }
  
  // Shadows (Simple approximation using linear offset)
  if (adjustments.shadows !== 0) {
    const shadowOffset = (adjustments.shadows / 100) * 0.1;
    image = image.linear(1, shadowOffset);
  }

  await image.toFile(outputPath);

  return outputPath;
};
