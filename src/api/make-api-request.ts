type ErrorData = {
  type: string;
  errors: Array<{
    code: string;
    detail: string;
    attr: string | null;
  }>;
};

export async function makeApiRequest<T = unknown>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  payload: Record<string, unknown> | null = null,
): Promise<{ ok: true; data: T } | { ok: false; data: ErrorData }> {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/v1/${endpoint}`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: payload ? JSON.stringify(payload) : undefined,
    });
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
