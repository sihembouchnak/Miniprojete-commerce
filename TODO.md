# Dashboard Admin Professionnel - Plan d'implémentation

## Phase 1 — Backend NestJS (Sécurité & Données)
- [x] Créer `orders/schemas/order.schema.ts`
- [x] Créer `orders/orders.service.ts`
- [x] Créer `orders/orders.controller.ts`
- [x] Créer `orders/orders.module.ts`
- [ ] Créer `admin/admin.service.ts`
- [ ] Créer `admin/admin.controller.ts`
- [ ] Créer `admin/admin.module.ts`
- [x] Créer `auth/jwt.strategy.ts`
- [x] Créer `auth/roles.guard.ts` (incomplete - needs fix)
- [ ] Créer `auth/roles.decorator.ts`
- [ ] Modifier `auth/auth.service.ts` — retourner user avec token
- [ ] Modifier `auth/auth.controller.ts` — retourner user dans login
- [ ] Modifier `auth/auth.module.ts` — ajouter PassportModule, JwtStrategy
- [ ] Modifier `app.module.ts` — importer OrdersModule + AdminModule
- [ ] Modifier `main.ts` — ajouter prefix global `/api`
- [x] Créer `seed.ts` — seeder admin + données de test
- [ ] Modifier `users/users.service.ts` — ajouter findById, findAll

## Phase 2 — Frontend (AuthContext & API)
- [ ] Modifier `frontend/src/contexts/AuthContext.jsx` — connexion API réelle
- [ ] Modifier `frontend/src/utils/api.js` — endpoints backend + auth headers

## Phase 3 — Dashboard Admin Professionnel
- [ ] Modifier `frontend/src/pages/admin/dashboard/Dashboard.jsx` — dashboard dynamique complet
- [ ] Modifier `frontend/src/pages/dashboard/Charts.jsx` — données dynamiques
- [ ] Modifier `frontend/src/pages/dashboard/Tables.jsx` — données dynamiques

