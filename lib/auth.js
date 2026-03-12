import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "Please define the JWT_SECRET environment variable in .env.local",
  );
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export function getUserFromRequest(request) {
  try {
    // 1. Try Authorization Bearer header
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      if (token && token !== "null" && token !== "undefined") {
        const decoded = verifyToken(token);
        if (decoded) return decoded;
      }
    }

    // 2. Try query string token (used by EventSource which can't set headers)
    const { searchParams } = new URL(request.url);
    const queryToken = searchParams.get("token");
    if (queryToken && queryToken !== "null" && queryToken !== "undefined") {
      const decoded = verifyToken(queryToken);
      if (decoded) return decoded;
    }

    return null;
  } catch (err) {
    console.error("getUserFromRequest error:", err);
    return null;
  }
}
