# Crypto Service Platform - Production Fix TODO

## Current Task: Fix Build Errors & Production-Ready
- [x] 1. ✅ Create this TODO.md
- [x] 2. Fix models/Deposit.js (add model export)
- [x] 3. Audit other models (Notification.js, OTP.js, Subscription.js, Article.js) - ✅ All exports already correct, no changes needed
- [x] 4. Run `pnpm lint` - ✅ Passed (no errors)
- [x] 5. Run `pnpm build` - ✅ Production build passes
- [ ] 6. Test runtime: `pnpm dev`, check deposits flow
- [ ] 7. Production hardening: Add rate limits, security headers, env validation

## Next Enhancements
- Add Redis caching for admin dashboard
- Implement webhook for auto-deposit approval
- Add wallet connect integration
- Performance: Add more indexes, query optimization
