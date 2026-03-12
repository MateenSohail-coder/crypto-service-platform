import { addClient, removeClient } from "@/lib/eventEmitter";
import { getUserFromRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  // Authenticate the SSE connection
  const user = getUserFromRequest(request);

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  let clientId;

  const stream = new ReadableStream({
    start(controller) {
      // Register this client
      clientId = addClient({
        role: user.role,
        userId: user.id.toString(),
        controller,
      });

      // Send initial connection confirmation
      const connected = `event: connected\ndata: ${JSON.stringify({
        message: "SSE connected",
        userId: user.id,
        role: user.role,
      })}\n\n`;

      controller.enqueue(connected);

      // Keep-alive ping every 25 seconds to prevent timeout
      const keepAlive = setInterval(() => {
        try {
          controller.enqueue(`: ping\n\n`);
        } catch (e) {
          clearInterval(keepAlive);
        }
      }, 25000);

      // Cleanup on disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(keepAlive);
        removeClient(clientId);
        try {
          controller.close();
        } catch (e) {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
