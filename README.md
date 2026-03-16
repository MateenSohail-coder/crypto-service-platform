# 🚀 Crypto-Service-Platform

**Next.js Crypto Investment Dashboard** - User deposits → subscribe services → earn commissions. Admin approves deposits + manages services.

## ✨ Features
```
🔐 Complete Auth: Register/Login/Reset + JWT + bcrypt
💰 Deposit System: Crypto txHash → admin approve/reject
📈 Services: Create/subscribe → daily limits (24/day)
🔔 Real-time Notifications: SSE (Server-Sent Events)
👑 Admin Dashboard: Users/Services/Deposits/Articles
📱 Responsive: Mobile/Desktop + dark theme
📧 Password Reset: OTP + email (Gmail)
```

## 🏗️ Tech Stack
```
Frontend: Next.js 14 App Router + React Context + TailwindCSS
Backend: MongoDB + Mongoose (indexed!)
Real-time: SSE + EventEmitter (memory-safe)
Validation: Zod schemas
Security: Rate-limit ready (Upstash Redis)
Auth: Custom JWT + middleware
Email: Nodemailer Gmail
```

## 🚀 Quick Start
```bash
# Clone & Install
git clone <repo>
cd crypto-service-platform
pnpm install

# Env (.env.local)
MONGODB_URI=your-mongo-uri
JWT_SECRET=your-64-char-secret
GMAIL_USER=your@gmail.com
GMAIL_APP_PASSWORD=your-app-pass

# Optional Rate Limit
UPSTASH_REDIS_URL=...
UPSTASH_REDIS_TOKEN=...

# Dev
pnpm dev

# Build/Prod
pnpm build && pnpm start
```

## 📱 User Flow
```
1. /register → Login
2. /dashboard → View services
3. Subscribe service (24/day limit)
4. /deposit → Submit crypto txHash
5. Admin approves → Real-time notification
6. Earn commissions!
```

## 👑 Admin Flow (/admin)
```
Users list (paginated)
Pending deposits → Approve/Reject
Services CRUD
Articles publish
Subscriptions overview
```

## 🔧 Production Hardening (Already Done!)
```
✅ DB Indexes: No dupes + fast queries
✅ API Limits: .limit(50).lean()
✅ SSE Safe: 1000 max clients + timeout
✅ Zod: All inputs validated
✅ Rate-limit: Ready (add Upstash env)
```

## 🧪 Testing
```bash
# Invalid deposit → Zod 400
curl POST /api/deposits/create '{"amount":"abc"}'

# Admin APIs fast
curl /api/admin/users

# Build test
pnpm build
```

## 📁 Structure
```
app/                 Next.js routes
components/          UI
lib/                 Utils (validators.js, auth.js)
middleware/          authMiddleware.js + rateLimitMiddleware.js
models/              Mongoose schemas (indexed!)
```

## 🤝 Usage Rights
MIT License - Deploy, modify, commercial use OK!

**Live Demo**: localhost:3000 → Production ready! 🎉
