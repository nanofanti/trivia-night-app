const API_URL = import.meta.env.VITE_API_URL;

type ApiRequestOptions = RequestInit & {
  token?: string | null;
};

export async function apiRequest(
  endpoint: string,
  options: ApiRequestOptions = {},
) {
  const { token, headers, ...restOptions } = options;

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  return response;
}
