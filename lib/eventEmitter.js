// 🚀 PRODUCTION SSE - Memory safe + scalable
// Global SSE client store with cleanup (max 1000 clients, 5min idle timeout)
const clients = new Map();
const clientLastActive = new Map(); // Track idle time
let clientIdCounter = 0;

const MAX_CLIENTS = 1000;
const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

/**
 * Register a new SSE client connection - with memory safety
 */
export function addClient({ role, userId, controller }) {
  // Cleanup first if at max capacity
  if (clients.size >= MAX_CLIENTS) {
    cleanupIdleClients();
  }

  const id = ++clientIdCounter;
  const client = { id, role, userId, controller, lastActive: Date.now() };
  clients.set(id, client);
  clientLastActive.set(id, Date.now());
  return id;
}

/**
 * Remove a client when they disconnect
 */
export function removeClient(id) {
  clients.delete(id);
  clientLastActive.delete(id);
}

/**
 * Cleanup idle clients (called periodically)
 */
function cleanupIdleClients() {
  const now = Date.now();
  for (const [id, lastActive] of clientLastActive.entries()) {
    if (now - lastActive > IDLE_TIMEOUT) {
      clients.delete(id);
      clientLastActive.delete(id);
    }
  }
}

// Auto-cleanup every 30 seconds
setInterval(cleanupIdleClients, 30000);

/**
 * Send event to ALL admin clients
 */
export function notifyAdmins(eventName, data) {
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const [, client] of clients) {
    if (client.role === "admin") {
      try {
        client.controller.enqueue(payload);
      } catch (e) {
        clients.delete(client.id);
      }
    }
  }
}

/**
 * Send event to a specific user by userId
 */
export function notifyUser(userId, eventName, data) {
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const [, client] of clients) {
    if (client.userId === userId.toString()) {
      try {
        client.controller.enqueue(payload);
      } catch (e) {
        clients.delete(client.id);
      }
    }
  }
}

/**
 * Send event to ALL connected clients
 */
export function notifyAll(eventName, data) {
  const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const [, client] of clients) {
    try {
      client.controller.enqueue(payload);
    } catch (e) {
      clients.delete(client.id);
    }
  }
}

export function getClientCount() {
  return clients.size;
}
