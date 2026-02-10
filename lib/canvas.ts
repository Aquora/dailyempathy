/**
 * Canvas API helpers: token refresh and paginated fetches.
 * Access tokens expire in 1 hour; use refresh_token to get a new access_token.
 */

export async function refreshCanvasToken(
  baseUrl: string,
  clientId: string,
  clientSecret: string,
  refreshToken: string
): Promise<{ access_token: string; expires_in: number }> {
  const url = `${baseUrl.replace(/\/$/, "")}/login/oauth2/token`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Canvas token refresh failed: ${res.status} ${text}`);
  }
  const data = (await res.json()) as {
    access_token: string;
    expires_in?: number;
  };
  return {
    access_token: data.access_token,
    expires_in: data.expires_in ?? 3600,
  };
}

export async function canvasFetch<T>(
  url: string,
  accessToken: string
): Promise<{ data: T[]; nextPage: string | null }> {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    throw new Error(`Canvas API ${url}: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as T[];
  const link = res.headers.get("Link");
  let nextPage: string | null = null;
  if (link) {
    const match = link.match(/<([^>]+)>;\s*rel="next"/);
    if (match) nextPage = match[1];
  }
  return { data: Array.isArray(data) ? data : [], nextPage };
}
