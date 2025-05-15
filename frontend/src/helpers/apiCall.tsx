export default async function apiCall({ url, method, body }: { url: string; method: string; body?: any }) {
  const defaultUrl = 'http://localhost:5000/';
  const token = localStorage.getItem('user-token');

  const options = {
    method: method.toUpperCase(),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  } as any; // Explicitly set type to 'any' to avoid RequestInit

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(defaultUrl + url, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Something went wrong');
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message || 'Unknown error occurred');
  }
}
