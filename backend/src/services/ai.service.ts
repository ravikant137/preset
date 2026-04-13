import OpenAI from 'openai';
import dotenv from 'dotenv';
import { Preset } from '../../../shared/types';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const analyzeImage = async (imageBuffer: Buffer, mimeType: string): Promise<any> => {
  const base64Image = imageBuffer.toString('base64');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `You are an advanced AI social media assistant.

Analyze the uploaded image and generate:
1. Image understanding
2. Best preset for editing
3. Viral Instagram caption
4. 20 optimized hashtags

Requirements:
- Deeply analyze the image (subject, mood, lighting, environment)
- Caption must be engaging and human-like
- Hashtags must be relevant and optimized
- Preset must enhance the image professionally

Return ONLY JSON in this structure:

{
  "image_analysis": {
    "main_subject": "",
    "scene_description": "",
    "mood": "",
    "lighting_type": "",
    "color_tone": "",
    "activity": "",
    "environment": "",
    "aesthetics": ""
  },
  "preset": {
    "preset_name": "",
    "adjustments": {
      "brightness": 0,
      "contrast": 0,
      "saturation": 0,
      "temperature": 0,
      "highlights": 0,
      "shadows": 0,
      "sharpness": 0
    }
  },
  "caption": "",
  "hashtags": []
}`
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:${mimeType};base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error('Failed to get response from AI');

  return JSON.parse(content);
};
