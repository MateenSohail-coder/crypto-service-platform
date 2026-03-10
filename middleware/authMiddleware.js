import { getUserFromRequest } from "@/lib/auth";

/**
 * Middleware to protect API routes.
 * Returns the decoded user if authenticated, or sends a 401 response.
 *
 * Usage inside a route handler:
 *   const { user, response } = await requireAuth(request);
 *   if (response) return response;
 *
 * @param {Request} request
 * @returns {{ user: Object|null, response: Response|null }}
 */
export async function requireAuth(request) {
  const user = getUserFromRequest(request);

  if (!user) {
    return {
      user: null,
      response: new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized. Please log in.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      ),
    };
  }

  return { user, response: null };
}

/**
 * Middleware to protect admin-only API routes.
 * Returns the decoded user if authenticated and is an admin,
 * otherwise returns a 401 or 403 response.
 *
 * Usage inside a route handler:
 *   const { user, response } = await requireAdmin(request);
 *   if (response) return response;
 *
 * @param {Request} request
 * @returns {{ user: Object|null, response: Response|null }}
 */
export async function requireAdmin(request) {
  const user = getUserFromRequest(request);

  if (!user) {
    return {
      user: null,
      response: new Response(
        JSON.stringify({
          success: false,
          message: "Unauthorized. Please log in.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      ),
    };
  }

  if (user.role !== "admin") {
    return {
      user: null,
      response: new Response(
        JSON.stringify({ success: false, message: "Forbidden. Admins only." }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      ),
    };
  }

  return { user, response: null };
}
