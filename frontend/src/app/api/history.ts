import { APIResponse, ProcessResult } from '../../../shared/types';

export async function getHistory(token: string): Promise<APIResponse<ProcessResult[]>> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
