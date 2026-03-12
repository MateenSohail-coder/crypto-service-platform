// Global SSE client store
// Each entry: { id, role, userId, controller }
const clients = new Map();

let clientIdCounter = 0;

/**
 * Register a new SSE client connection
 */
export function addClient({ role, userId, controller }) {
  const id = ++clientIdCounter;
  clients.set(id, { id, role, userId, controller });
  return id;
}

/**
 * Remove a client when they disconnect
 */
export function removeClient(id) {
  clients.delete(id);
}

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
