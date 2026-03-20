export type ErrorData = {
  type: string;
  errors: Array<{
    code: string;
    detail: string;
    attr: string | null;
  }>;
};

function getCSRFToken(): string | null {
  const cookie = document.cookie.split("; ").find((row) => row.startsWith("csrftoken="));
  return cookie ? cookie.split("=")[1] : null;
}

export async function makeApiRequest<T = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  payload: Record<string, unknown> | null = null,
): Promise<{ ok: true; data: T } | { ok: false; data: ErrorData }> {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_BASE_URL!}${endpoint}`;
    const csrfToken = getCSRFToken();
    const headers: HeadersInit = { "Content-Type": "application/json" };

    if (csrfToken && !["GET", "HEAD", "OPTIONS"].includes(method)) {
      headers["X-CSRFToken"] = csrfToken;
    }

    const response = await fetch(url, {
      headers,
      method: method,
      credentials: "include",
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (response.status === 429) {
      let waitSeconds = 60;

      const retryAfter = response.headers.get("Retry-After");
      if (retryAfter) {
        waitSeconds = parseInt(retryAfter, 10) || 60;
      }

      return {
        ok: false,
        data: {
          type: "rate_limit_exceeded",
          errors: [
            {
              code: "rate_limit",
              detail: `Too many attempts. Please try again in ${waitSeconds} second${waitSeconds > 1 ? "s" : ""}.`,
              attr: null,
            },
          ],
        },
      };
    }

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      return { ok: false, data: responseData };
    }

    return { ok: true, data: responseData };
  } catch {
    return {
      ok: false,
      data: {
        type: "server_error",
        errors: [
          {
            code: "error",
            detail: "We are having some issues; please try again later.",
            attr: null,
          },
        ],
      },
    };
  }
}
