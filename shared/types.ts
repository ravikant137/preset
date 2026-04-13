export interface ImageAnalysis {
  main_subject: string;
  scene_description: string;
  mood: string;
  lighting_type: string;
  color_tone: string;
  activity: string;
  environment: string;
  aesthetics: string;
}

export interface PresetAdjustments {
  brightness: number;   // -100 to 100
  contrast: number;     // -100 to 100
  saturation: number;   // -100 to 100
  temperature: number;  // -100 to 100
  highlights: number;   // -100 to 100
  shadows: number;      // -100 to 100
  sharpness: number;    // 0 to 100
}

export interface Preset {
  preset_name: string;
  adjustments: PresetAdjustments;
}

export interface ProcessResult {
  image_analysis: ImageAnalysis;
  preset: Preset;
  caption: string;
  hashtags: string[];
  processed_image_url: string;
  original_image_url: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
