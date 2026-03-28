# Withdrawal Feature Implementation - TODO

✅ **Plan Approved by User** - Ready to implement step-by-step.

## Breakdown of Approved Plan (Logical Steps)

### Phase 1: Database Model ✅
- ✅ **Created `models/Withdrawal.js`** - Schema ready with indexes.

### Phase 2: Backend APIs ✅
- ✅ **Created `app/api/withdrawals/create/route.js`** - Balance check, admin notifications.
- ✅ **Created `app/api/withdrawals/approve/route.js`** - Deduct on approve, notifications.

### Phase 3: Frontend Pages ✅
- ✅ **Created `app/dashboard/withdrawal/page.js`** - Modal + history + balance check.
- ✅ **Created `app/admin/withdrawals/page.js`** - Admin UI + SSE + actions.
- ✅ **Added `app/admin/withdrawals/favicon.ico`** (placeholder).

### Phase 4: Navigation Updates ✅
- ✅ **Edited `components/Sidebar.js`** - Added withdrawal nav for user/admin.
- ✅ **Edited `components/BottomNav.js`** - Added withdrawal links.
- ✅ **Edited `components/Navbar.js`** - Added page titles.

### Phase 5: Transactions & Notifications ✅
- ✅ **Edited `app/dashboard/transactions/page.js`** - Added Withdrawals tab + fetch/UI.
- ✅ **Edited `components/NotificationProvider.js`** - Added all withdrawal SSE handlers.

### Phase 6: Supporting Updates ✅
- ✅ **Checked notification libs** - No enum/type changes needed (generic functions handle new events).
- ✅ **Full implementation complete** - Core feature ready: model/APIs/pages/nav/notifications/transactions.
- ✅ **Test recommended**: Run `pnpm dev`, test user withdrawal → admin approve → balance deduct/history/notifs update. Deposits unchanged.

## Progress Tracking
- Current: **Phase 0 - TODO Created** ⏳
- Next: Phase 1 → Mark as we complete.

**Updated on first step. Each completion → edit this file to ✅ + progress.**

