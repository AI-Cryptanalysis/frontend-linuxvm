export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // To prevent timeouts for slow scans, we use a 120s timeout in AbortController if available
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000);

  try {
    const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint.replace(/^\//, "")}`;
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    if (!res.ok) {
      if (res.status === 401) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          window.dispatchEvent(new Event("auth:unauthorized"));
        }
      }

      let message = "An error occurred";
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        message = errorData.message || errorData.error || "An error occurred";
      }
      
      const isDuplicate = res.status === 500 && typeof message === "string" && message.includes("duplicate");
      throw new ApiError(res.status, isDuplicate ? "Username is already taken. Please choose another." : message);
    }



    // Some endpoints may return empty response body
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return (await res.json()) as T;
    }
    
    return {} as T;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. The operation is taking longer than expected.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
