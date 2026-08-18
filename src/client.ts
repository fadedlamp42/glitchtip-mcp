/**
 * GlitchTip API HTTP client.
 *
 * Handles authentication, base URL resolution, and request execution
 * for every GlitchTip REST endpoint. Used by all tool modules.
 */

export interface GlitchTipConfig {
  baseUrl: string;
  token: string;
}

let config: GlitchTipConfig | null = null;

export function configure(cfg: GlitchTipConfig): void {
  config = {
    baseUrl: cfg.baseUrl.replace(/\/+$/, ""),
    token: cfg.token,
  };
}

export function getConfig(): GlitchTipConfig {
  if (!config) {
    throw new Error(
      "GlitchTip client not configured. Set GLITCHTIP_BASE_URL and GLITCHTIP_API_TOKEN environment variables.",
    );
  }
  return config;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  /**
   * query string parameters. an array value is emitted as a REPEATED key
   * (`?id=1&id=2`), which is how GlitchTip's bulk endpoints expect to receive
   * a list of issue ids.
   */
  query?: Record<string, string | number | boolean | string[] | undefined>;
  /** For multipart uploads. */
  formData?: FormData;
}

export async function request<T = unknown>(
  path: string,
  opts: RequestOptions = {},
): Promise<T> {
  const { baseUrl, token } = getConfig();
  const method = opts.method ?? "GET";

  let url = `${baseUrl}${path}`;
  if (opts.query) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(opts.query)) {
      const isPresent = value !== undefined && value !== "";
      // arrays repeat the key so the server sees a list, never a stringified array.
      if (isPresent && Array.isArray(value)) {
        for (const item of value) params.append(key, String(item));
      }
      if (isPresent && !Array.isArray(value)) {
        params.set(key, String(value));
      }
    }
    const qs = params.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  let requestBody: BodyInit | undefined;

  if (opts.formData) {
    requestBody = opts.formData;
    // Let fetch set Content-Type with boundary for multipart.
  } else if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
    requestBody = JSON.stringify(opts.body);
  }

  const res = await fetch(url, {
    method,
    headers,
    body: requestBody,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `GlitchTip API ${method} ${path} returned ${res.status}: ${text}`,
    );
  }

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  return (await res.text()) as T;
}
