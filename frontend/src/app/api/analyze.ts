import { APIResponse, ProcessResult } from '../../../shared/types';

export async function analyzeImage(formData: FormData, token: string): Promise<APIResponse<ProcessResult>> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/analyze`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return res.json();
}
