Hey, I want you to deeply analyze the @[app/(app)/[MODULE_NAME]] folder and refactor it into an Enterprise-Grade, Highly Scalable, and strictly "AI-Friendly" architecture. 

Currently, no one writes code manually; AI writes it. Because of this, my primary goal is extreme isolation. Tomorrow, if I ask an AI to fix a specific bug, I should only need to provide ONE exact file to the AI, completely eliminating the risk of the AI hallucinating and breaking other working functionalities. However, the folder architecture must remain highly organized and visually logical so that human developers can easily navigate it without getting lost in a flat directory of 50+ files.

Please follow these strict architectural rules:

1. **Micro-Modularization, Feature-Based Sub-folders & File Size Ceilings (Crucial)**: 
Break down all large or mixed files. Every file must contain only one React component and handle only one specific micro-functionality. **CRITICAL:** Do not dump all these micro-files into a single flat directory. Group them logically into cohesive sub-folders within the module. 
**IMPORTANT FOLDER NAMING:** Always prefix the main internal folders with the module name (e.g., use `[moduleName]_components/`, `[moduleName]_context/`, `[moduleName]_utils/` instead of generic names like `components/`). This ensures that when providing context to an AI (using `@`), the AI only loads the exact folder for this module, avoiding cross-module hallucinations. Inside these prefixed folders, group files logically (e.g., `[moduleName]_components/Header/`).
**File Size Ceiling:** Component files should not exceed ~250-350 lines; if a component's JSX grows beyond that, extract sub-sections into their own child component files inside the same feature folder to force real component-level granularity.

### Extended File Size Ceilings

The component size limit alone is insufficient. AI agents also lose context in large hooks, stores, schemas, and utility files.

- React Component (`.tsx`): maximum 300 lines
- Custom Hook (`use*.ts`): maximum 150 lines
- Utility / formatter (`*.utils.ts`): maximum 120 lines
- Zustand Store (`*.store.ts`): maximum 180 lines
- Zod Schema / type file (`*.types.ts`, `*.schema.ts`): maximum 200 lines
- API service file (`*.api.ts`): maximum 200 lines

If a file exceeds its limit:
- Split by feature responsibility, not randomly by line count.
- Do not create generic dumping folders such as `helpers/`, `common/`, or `misc/`.
- Keep extracted files inside the same feature folder wherever possible.
Next.js App Router uses Server Components by default, so you MUST explicitly include `"use client";` at the top of any file that uses hooks (`useState`, `useEffect`) or event listeners.

2. **Total Role Isolation (No Shared Business Components)**:
To completely eliminate the risk of cross-role AI hallucinations, there is no unified `/erp` folder. Each role gets a completely isolated root folder (e.g., `/admin`, `/manager`, `/trainer`). Business components (like `MembersTable`) must be duplicated into each role's folder (`AdminMembersTable.tsx`, `ManagerMembersTable.tsx`). Only dumb UI components (like `Button`) are shared in `src/components/ui`.

3. **Hyper-Descriptive Naming & Mandatory Module Prefix**: 
Rename all components, files, and folders to be extremely descriptive based on exactly what they do. **It does not matter if a filename becomes exceptionally long** (e.g., `AdminMembersSubscriptionRenewalForm.tsx`). Meaningfulness and convenience are the only priorities. 
- **Module Name Prefixing (CRITICAL):** Every file name (not just the containing folder) MUST begin with the module name as a prefix. Example: `AdminBillingInvoiceSearchBox.tsx`.
- **Component Name Matching:** The exported component/class/function name inside the file MUST exactly match the filename (minus extension).
- **No Abbreviations**: Never use `Btn`, `Nav`, `Utils`. Use `Button`, `Navigation`, `Utilities`.
- **Strict Suffixing**: Component names must end with their exact UI structural type (e.g., `...Modal.tsx`, `...Table.tsx`, `...Form.tsx`, `...Card.tsx`, `...Dropdown.tsx`).
- **Prop Naming**: Do not export generic `Props` or `Data` interfaces. Always prefix them (e.g., `export interface InquiriesTableProps`).

3. **Backend-Ready Centralized Data (Single Source of Truth)**: 
Find all hardcoded UI data (dropdown options, filter lists, default preset arrays, payment modes, etc.) scattered across the UI components. Extract them into feature-specific constant files alongside their components (e.g., `HeaderConstants.ts` inside the `/Header` folder) or a module-level `[ModuleName]SharedConstants.ts` for data used across multiple sub-folders.
*Why?* Because tomorrow, this hardcoded data will be replaced by a Backend API call. By keeping it all in one file today, I will only have to change one file tomorrow to integrate the API, without touching the UI components. Derive your TypeScript types directly from these central arrays.

4. **Theme Independence & Portability Contract (No Inline Colors)**: 
Remove all hardcoded Tailwind color utilities from the JSX. Map all CSS variables (e.g., `--bg-card`, `--text-primary`) in `tailwind.config.ts` as named tokens so you can use standard Tailwind classes like `bg-card` or `text-primary` **without** arbitrary bracket values. **The one canonical pattern is: define the variable in `globals.css`, map it in `tailwind.config.ts`, and use the Tailwind class name (e.g., `bg-card`) in JSX. Never use `bg-[var(--bg-card)]` or `bg-[#1A1A2E]` directly in JSX.**
- **Theme Portability Contract:** Every module must have a small `[moduleName]_theme_contract.md` or a dedicated comment listing exactly which CSS variables it depends on (e.g., `--bg-card`, `--text-primary`, `--danger`). This ensures that when copying the module into a new project, we know exactly what variables need to be defined in the new `globals.css`.

5. **Smart & Isolated State Management (The Canonical Decision Boundary)**: 
Because the components will be heavily micro-modularized, avoid creating a massive web of prop drilling. Do NOT bloat the global app state; keep the state architecture isolated to the feature.
**The Canonical Decision Boundary:**
- **React Context:** ONLY for synchronous, rarely-changing UI state (theme, sidebar open/close, locale). Never put API data or loading states in Context. You MUST implement proper memoization (`useMemo`, `useCallback`) to prevent massive re-render chains.
- **Zustand (module-scoped store):** For UI-only shared state within a module (active filters, selected rows, wizard progress, table column preferences, local draft state). Do NOT store API response data or loading states here — see Rule 15C for the canonical Server State vs Client State decision matrix (TanStack Query is the single source of truth for all server/async data).
- **Local `useState`:** Only for state that is strictly private to a single component and never needs to be shared.

6. **Separation of Logic and UI (Custom Hooks for Extreme Isolation)**: 
Do not mix complex React logic (`useEffect`, multi-step state calculations, data transformations) with JSX markup.
Extract all heavy logic into an adjacent custom hook file (e.g., `use[ComponentName].ts`). The actual `.tsx` file should act purely as a "View" layer that consumes the hook.
*Why?* If there is a bug in the calculation logic, you feed the AI only the `use...` file. It fixes the logic with zero risk of accidentally deleting a `<div>` or altering the UI structure.

7. **Interface & Type Isolation (The Prop Blueprint)**: 
Never define complex `Interfaces` or `Types` directly inside the component files. Extract all TypeScript definitions (Component Props, API Payloads, State Shapes) into a dedicated `[moduleName]_types.ts` file or folder.
- **No Inline String Type Unions:** Never hardcode string type unions or any values as string literals (e.g., `'idle' | 'loading' | 'success' | 'error'`) inline inside interfaces or hook declarations. Always extract these into a named type inside the module's `_constants.ts` or `_types.ts` file.

### TypeScript Strictness and Runtime Contract Validation

The project MUST enforce the following `tsconfig.json` settings:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUncheckedIndexedAccess": true,
  "verbatimModuleSyntax": true
}
```

Rules:
- `any` is strictly forbidden. Use `unknown` and narrow it safely.
- `@ts-ignore` and `@ts-nocheck` are forbidden.
- All API response payloads must be validated at the API boundary using Zod before application code consumes them.
- Prefer backend-generated OpenAPI types where an OpenAPI/Swagger contract exists.
- Generated API types must remain separate from domain/UI types.

Recommended structure:
```text
[moduleName]_types/
  api.generated.ts
  [moduleName].schema.ts
  [moduleName].types.ts
```

8. **Strict Server vs. Client Component Boundaries (Next.js Specific)**: 
Respect the Next.js App Router architecture. Keep top-level files like `page.tsx` or `layout.tsx` strictly as **Server Components** (no `"use client"`). Use these to fetch initial data securely. Pass this data downwards as props into your micro-modularized **Client Components**.
*Why?* It creates a clean separation of concerns. Data fetching issues are solved in the Server Component; interactivity issues are solved in the Client Component. You will never need to feed an AI both files at the same time.

### Server Data vs Client Data Rule

Use Server Components for:
- Initial page-level data required to render the route.
- Secure server-only operations. (See Rule 15C for server state policy).
- SEO-relevant content.
- Reading server-only environment variables.

Use Client Components for:
- Forms, filters, live search, table interactions, modals, dropdowns, charts, and browser APIs.
- Client-side mutation workflows.
- WebSocket-driven UI updates.

Do not duplicate the same endpoint fetch in both `page.tsx` and a client hook without an explicit hydration strategy.

If initial server data is passed into a Client Component:
- Document the query key.
- Hydrate/cache it through the approved server-state library.
- Avoid maintaining an unrelated duplicate local state copy.

9. **Leverage Next.js Native Features & Typed Error Boundaries**: 
Ensure that the module properly utilizes Next.js native routing features for a great user experience.
- **`loading.tsx` (Skeleton UI):** You MUST extract loading states into a `loading.tsx` file wherever applicable in the module's directory. Never use a generic spinning circle for a full page load. Instead, design a premium Skeleton UI that mimics the actual layout of the page (using `bg-skeleton-base` and `bg-skeleton-highlight`).
- **`error.tsx` (Error Boundaries):** Beyond the global `error.tsx`, every module must have a typed React Error Boundary component (`[ModuleName]ErrorBoundary.tsx` or a standard Next.js `error.tsx`) that wraps the module's root client component. It must display a module-specific fallback UI matching the app shell (not a generic "Something went wrong" browser error) and include a primary "Retry" button that calls `reset()`.

### Granular Error Boundary and Error Reporting Rules

Route-level `error.tsx` is mandatory but not enough.

Every independently loaded or independently fetched UI section must be wrapped in a section-level Error Boundary where failure should not crash the entire route.

Examples:
- Dashboard chart
- Analytics widget
- Data table
- Payment summary panel
- WebSocket activity feed

Requirements:
- Use a standard shared `ErrorBoundary` implementation.
- Display a module-specific fallback matching the global design system.
- Provide a Retry action where retrying is meaningful.
- Never expose raw stack traces, backend errors, tokens, or internal error details to users.
- Log caught errors to the approved monitoring provider with:
  - route
  - module name
  - user ID if safely available
  - error digest / request ID
  - timestamp

Error fallback hierarchy:
1. Component/section boundary
2. Module-level boundary
3. Route-level `error.tsx`
4. Global application boundary
- **`not-found.tsx` (404 Handling):** Handle missing dynamic routes gracefully by defining a `not-found.tsx` file. It should be beautifully branded and offer a clear "Back to Dashboard" button.

10. **Absolute Imports Only (No Relative Paths)**: 
Never use relative imports (like `../../` or `./`) for importing components, contexts, utilities, or types. Always use absolute imports starting with `@/` (e.g., `@/app/(erp)/workout/workout_context/WorkoutContext`).
*Why?* This allows files to be moved around easily without breaking import paths and makes it much easier to copy-paste code snippets or have an AI generate standalone code without worrying about relative directory depth.

11. **Centralized URL Configuration (No Hardcoded URLs)**: 
Never hardcode URLs (e.g., `/api/auth/refresh`, `/login`, etc.) directly into API wrappers or React components. Each module must have exactly one centralized URL configuration file, named exactly `[moduleName]_url_config.ts` (e.g., `auth_url_config.ts`). This file must export all internal page routes and external API routes used by that module as named constants. Any file in the module or global utilities that needs to call an endpoint or navigate to a page must import the URL from this specific config file.

12. **No Hardcoded HTTP Status Codes**: 
Never hardcode numeric HTTP status codes (e.g., `401`, `500`, `200`) in API routes, proxies, or fetch wrappers. Always use standard enums/constants from libraries like `http-status-codes` (e.g., `StatusCodes.UNAUTHORIZED`). This improves code readability and prevents silly typos in status codes.

13. **Update AI-Context Documentation (The Feature Map)**: 
Once the entire refactor is complete, generate or update a `[moduleName]_features.md` documentation file inside the module's root folder. This document MUST serve as a master map for future AI sessions and human developers.

### Mandatory `[moduleName]_features.md` Template

Every module feature map MUST use this minimum structure:

```markdown
# [Module Name] Feature Map

## Module Purpose
Brief business explanation of what this module does.

## Directory Structure
Explain each module-prefixed folder and its responsibility.

## Feature Inventory
| Feature | Path | Purpose | Main API Calls | Owner |
|---|---|---|---|---|

## Data and State Architecture
- Server-state query keys:
- Zustand stores:
- Context providers:
- Local-storage keys:
- MSW handler file:

## API Contract
List all endpoint builders and expected response types.

## Permissions and Security
Document protected actions, roles, and CODEOWNERS paths.

## Loading, Empty, Error States
Document corresponding components/files for each main feature.

## Edge Cases / AI Warnings
List known product constraints, destructive actions, and common regression risks.

## Rule Compliance Checklist
- [ ] Rule 1: Micro-modularization
- [ ] Rule 7: Type isolation
- [ ] Rule 8: Server/client boundary
- [ ] Rule 9: Loading/error/not-found handling
- [ ] Rule 14: Backend-driven messages
- [ ] Rule 15A: Tests present
- [ ] Rule 15B: Forms use React Hook Form + Zod
- [ ] Rule 15C: State placed per Server/Client decision matrix
- [ ] Rule 15D: Env vars validated centrally, none exposed unsafely
- [ ] Rule 15E: Error monitoring wired for critical flows
- [ ] Rule 74: Security scan gates passed (SCA + secrets)
- [ ] Rule 76: CODEOWNERS covers security-critical paths
- [ ] Rule 79: MSW handler present where needed
```

14. **Backend-Driven UI Messages (No Hardcoded Toasts/Alerts)**: 
Never hardcode success or error messages (e.g., "User created successfully" or "Invalid credentials") in the frontend components, hooks, or toast notifications. The frontend must strictly display the `message` string provided by the backend's standardized JSON response envelope.

15. **Performance & Optimization Architecture**:
- **Debounce API Calls**: Any search input or filter that triggers backend API calls MUST be debounced (e.g., using a custom `useDebounce` hook or a library like `lodash.debounce`) with at least a 300ms delay.
- **Server-Side Pagination & Filtering**: Do not fetch thousands of records and paginate/filter them on the client. Always implement robust server-side pagination, sorting, and filtering.
- **Lazy Loading & Suspense**: For heavy components that are not immediately visible on initial load, use React's `lazy()` or Next.js `next/dynamic` to code-split them.
- **Strict Memoization for Contexts**: If using Context, ensure Provider values are strictly memoized using `useMemo` and `useCallback`.
- **Pessimistic UI Updates (Cache Mutation)**: This applies universally to ALL mutations. Do NOT trigger a full page refresh after mutating data. Await the successful response, then manually mutate the Zustand store. **Strict Pessimistic UI for Financial/Destructive Actions:** For any action involving money or irreversible operations (delete, suspend), the submit button MUST transition to a disabled loading state. The UI must only mutate the store after `2xx` confirmation. Optimistic updates are completely forbidden for these actions.

### Additional Performance Requirements

- Use `next/image` for all content images. Raw `<img>` tags are forbidden unless there is a documented technical exception.
- Above-the-fold images must have explicit dimensions and appropriate priority behavior.
- Heavy charts, editors, maps, PDF viewers, and rich media components must use dynamic import/code splitting.
- Every asynchronous data section must show a skeleton matching its final layout.
- Use a spinner only for short button-level loading states.
- Do not apply `React.memo`, `useMemo`, or `useCallback` blindly.
  - Use `React.memo` only for frequently re-rendering presentational children.
  - Use `useMemo` only for measurably expensive calculations.
  - Use `useCallback` only when necessary for memoized child props or dependency stability.
- Bundle impact must be checked for large dependency additions or major feature releases.
- Avoid importing full libraries where tree-shakable or lighter alternatives exist.


15A. **Mandatory Testing Architecture**:
AI-generated code is not considered complete until the required tests exist.

Approved stack:
- Unit tests: Vitest
- React component tests: React Testing Library
- E2E tests: Playwright
- API/network mocking: MSW

Co-location rule:
- `MemberTable.tsx` → `MemberTable.test.tsx`
- `useMembers.ts` → `useMembers.test.ts`
- `member.utils.ts` → `member.utils.test.ts`

Minimum expectations:
- Utilities: 90% branch coverage
- Custom hooks: 80% coverage
- Core components: interaction tests for loading, success, empty, error, and disabled states
- Critical journeys: Playwright E2E coverage

Mandatory E2E flows:
- Login/logout/session expiry
- Permission-denied states
- Create/edit/delete workflows
- Type-to-confirm destructive action flows
- Billing or payment workflows
- Important table filtering, pagination, and export workflows

Testing rules:
- Test user-visible behavior, not internal implementation details.
- Do not use snapshots for dynamic, complex UI as a substitute for assertions.
- Reuse Rule 79 MSW handlers in unit/component tests.
- A bug fix must include a regression test if reasonably testable.

15B. **Form Management, Validation, and Submission Architecture**:
All non-trivial forms MUST use:
- React Hook Form
- Zod
- `@hookform/resolvers`

Form structure:
```text
[Feature]Form/
  [Feature]Form.tsx
  use[Feature]Form.ts
  [feature].form.schema.ts
  [Feature]Form.test.tsx
```

Responsibilities:
- Form component: layout and field composition only.
- Custom form hook: form setup, submit orchestration, mutation state.
- Zod schema: validation and typed input/output contract.
- API layer: request/response communication only.

Validation rules:
- Validate client-side for immediate UX.
- Backend remains the final authority for validation.
- Display field validation errors inline below fields.
- Display backend response `message` for server-level errors as per Rule 14.
- Never show raw API error objects to users.

Submission rules:
- Disable submit button while the request is pending.
- Prevent duplicate submission.
- Reset only after confirmed successful response.
- Preserve entered data after failed requests unless product requirements say otherwise.
- All destructive form actions must follow the global Type-to-Confirm design rule.

File upload rules:
- Validate MIME type, extension, and max file size before upload.
- Show upload progress where supported.
- Never trust client validation alone; backend validation remains mandatory.

15C. **State Management Decision Matrix**:
State must be placed according to its ownership and lifecycle.

1. **Server State — TanStack Query / React Query**
Use for:
- API responses
- Loading/error states from APIs
- Caching
- Pagination
- Background refetching
- Mutations and invalidation

Rules:
- Backend data MUST NOT be stored as the primary source of truth in Zustand or Context.
- Every query key must be namespaced by module:
  `['members', 'list', filters]`
  `['members', 'detail', memberId]`
- After mutations, invalidate or update the relevant query cache intentionally.
- Do not refetch the whole application after a small mutation.

2. **Zustand — Module-Level Shared Client State**
Use for:
- Active filter UI state
- Selected rows
- Table column preferences
- Multi-step wizard progress
- Local draft state shared by multiple client components

Rules:
- Stores should remain module-scoped.
- Avoid one giant global store.
- Do not put API response data into a Zustand store unless there is a documented offline/realtime requirement.

3. **React Context**
Use only for stable cross-tree concerns:
- Theme
- Locale
- Auth session shell
- App-wide feature flags

4. **Local State**
Use `useState` or `useReducer` for component-private UI state:
- Modal open/close
- Input visibility
- Hover/focus state
- Local tab selection

Before creating a new global state container, document why local state, props, URL parameters, or React Query cannot solve the need.

15D. **Environment Variable and Runtime Configuration Management**:
Required files:
- `.env.example` — committed; contains every required key with empty/sample values.
- `.env.local` — local secrets; never committed.
- `.env.development` — non-secret development configuration where needed.
- `.env.production` — non-secret production configuration where platform policy permits.

Rules:
- Variables prefixed with `NEXT_PUBLIC_` are public browser-visible values.
- Never place secrets, private API keys, database URLs, token signing keys, or payment secrets in `NEXT_PUBLIC_` variables.
- Do not access `process.env` directly from arbitrary components/hooks.
- Validate environment variables in one central configuration module using Zod.
- Fail fast at startup if required configuration is missing or malformed.
- Document every environment variable in `.env.example`.

Recommended structure:
```text
src/config/env.ts
src/config/app-config.ts
```

15E. **Frontend Observability and Diagnostics**:
Production frontend errors must be observable without exposing sensitive information to users.

Requirements:
- Integrate an approved error-monitoring solution.
- Capture route, module, anonymized user/session context where allowed, request ID, and error digest.
- Never send passwords, tokens, full payment data, or sensitive personal data in logs.
- Use structured frontend events for critical business workflows:
  - login failure
  - payment failure
  - failed export
  - destructive action failure
  - repeated API error
- Use `console.log` only in local development where allowed by Rule 65; it must not remain in production code.
- Define an owner and alert policy for critical failures.

16. **Robust Form Handling & Validation**:
For any forms with more than two inputs, strictly avoid using individual `useState` hooks. Use a robust form management library (like **React Hook Form**) paired with a schema validation library (like **Zod**). Define the validation schema in your `_types` or `_utils` folder.

17. **Centralized API Error Interception**:
Never handle generic global errors (like `401 Unauthorized` or `500 Server Errors`) inside individual UI components. Implement a centralized API wrapper or interceptor (in your `api.ts`) that catches these global status codes, triggers a global toast/redirect, and smoothly refreshes tokens.

18. **Enterprise Accessibility (a11y)**:
Ensure UI components are accessible. Use semantic HTML, include `aria-label` tags for icon-only buttons, and ensure modals and dropdowns can be navigated via keyboard (Tab trapping, Esc to close).

19. **Interactive Data Tables (Clickable Rows)**:
Whenever displaying a list of entities in a table, the entire row MUST be clickable. Add `cursor-pointer` to the `<tr>` element. Remove redundant "View/Eye" buttons. Action buttons (Edit, Delete) must have `e.stopPropagation()`.

20. **Searchable Dropdowns for Large Datasets**:
Whenever presenting a dropdown for a large dataset, you MUST NOT use a native HTML `<select>` element. You must implement a custom popover/dropdown component that includes a search `<input>` field at the top.

21. **Real-Time Communication (In-House WebSocket Architecture)**:
For any real-time in-app communication, the project strictly uses an in-house WebSocket architecture (using `socket.io-client`). Do NOT rely on long-polling, SSE, or external managed services like Pusher/Supabase.

22. **Tenant Context & Centralized Headers (Multi-Tenancy)**:
The backend utilizes a strict Database-per-Tenant architecture. The frontend MUST NOT rely on components to manually send tenant info. A centralized API fetch wrapper must automatically intercept and inject `x-tenant-id`.

23. **Password Visibility Toggle**:
Whenever there is a password input field, you MUST include an eye icon (visibility toggle) to switch between `password` and `text`. Use standard icons from lucide-react.

24. **Date & Time Standardization (Timezone Safety)**:
Frontend UI components must never send raw `new Date()` objects. The backend must receive dates in **UTC (ISO 8601 format)**. When displaying, convert UTC strings to local time using `date-fns` or `dayjs`.

25. **Role-Based UI Hiding (RBAC)**:
Never rely solely on the backend to block unauthorized actions while leaving the action button visible. The frontend must implement a centralized `usePermissions()` hook. Destructive/restricted UI elements MUST be completely hidden or safely disabled.

26. **Skeleton Loaders over Generic Spinners**:
When fetching complex layout data or lists, implement **Skeleton Loaders** (using Tailwind's `animate-pulse` or a library) that mimic the shape of incoming data instead of full-page spinning circles.

27. **Strict TypeScript (No `any` Rule)**:
The use of the `any` type is strictly forbidden. If a payload is unknown, use the `unknown` type and assert/validate safely via Zod. (Mechanically enforced via ESLint, see Rule 65).

28. **Icon-Driven Action Columns**:
Whenever displaying action buttons in data tables/lists, prioritize using semantic icons (e.g., from `lucide-react`) instead of bulky text labels. Include descriptive tooltips and `aria-label`s.

29. **Multi-Medium Sending Selection (Radio Buttons)**:
Whenever the user performs an action that sends a proof/document, present an option to choose between mediums (e.g., WhatsApp vs. Email) using Radio Buttons. Do NOT use checkboxes if only one is to be selected.

30. **Mandatory Table Controls (Pagination, Sorting, & Filtering)**:
Whenever displaying tabular data, you MUST always implement pagination, column sorting, and relevant filtering directly above the table.

31. **Modularized API Clients (No Centralized API Blob)**:
Do not define module-specific API routes in a giant global file. Every module MUST have its own API file inside a dedicated folder (e.g., `[moduleName]_api/[moduleName]_api.ts`) importing the core base fetcher.

32. **The "No Barrel File" Rule (Avoid `index.ts`)**:
Strictly avoid using `index.ts` or `index.js` files to re-export modules. Always import directly from the explicitly named file to prevent circular dependencies.

33. **Framework-Specific Media Optimization**:
Make Next.js `<Image>` component (`next/image`) default and mandatory. Permit documented exceptions for third-party controlled markup, emails, SVG assets, or technically incompatible external content where standard `<img>` tags are needed.

34. **Environment Variable Segregation & Security**:
Strictly segregate public and private environment variables. Prefix public variables with `NEXT_PUBLIC_`. Never leak secret keys.

35. **Strict Prohibition of Magic Strings & Numbers**:
Never use raw strings or numbers directly in logic/UI. All magic values must be defined as TypeScript `enums` or `const` objects. (Mechanically enforced via ESLint, see Rule 65).

36. **No Arbitrary Tailwind Values (Strict Design System)**:
Never use arbitrary, hardcoded pixel/hex values in Tailwind (e.g., `w-[325px]`). Adhere to standard framework scales (e.g., `w-80`). (Mechanically enforced via ESLint, see Rule 65).

37. **JSDoc for Complex Logic (AI Context Enhancer)**:
Every custom hook, utility function, and complex data transformation MUST be prefixed with a short, descriptive JSDoc block detailing its intent.

38. **Strict Component Responsibility Contract**:
Every component file must have a single-line comment at the very top declaring its exact responsibility:
`// RESPONSIBILITY: Renders the read-only member profile header. Receives data via props. No API calls.`

39. **Explicit Data Flow Direction Comments**:
In every Context file and custom hook, document the data flow direction at the top:
`// DATA FLOW: API → useMembersTable.ts → MembersContext → MembersTable`

40. **Forbidden Patterns File (`[moduleName]_forbidden.md`)**:
Every module must have a tiny markdown file listing what is explicitly NOT allowed in that module.

41. **URL as State for Shareable Views**:
Any filterable, searchable, or paginated list page MUST sync its state to the URL as query parameters using `useSearchParams` / `useRouter`.

42. **Network State Enum (No Boolean `isLoading` Flags)**:
Never use multiple boolean flags for async state. Use a single typed enum defined in `_types.ts`: `type FetchState = 'idle' | 'loading' | 'success' | 'error'`.

43. **Sensitive Data Masking in UI**:
Any field displaying sensitive data must be masked by default in list views (e.g., `98****2310`). Use a dedicated `maskSensitiveData()` utility.

44. **No `console.log` in Production**:
All `console.log` calls are strictly forbidden in committed code. Use a centralized logger utility (`src/lib/logger.ts`). (Mechanically enforced via ESLint, see Rule 65).

45. **Co-located Test Files**:
Every custom hook and utility function must have a co-located test file (`use[X].test.ts`).

46. **Unsaved Changes Warning**:
Any modified form/modal must intercept `beforeunload` to warn the user: "You have unsaved changes."

47. **Copy-to-Clipboard on Sensitive IDs**:
Any field displaying a unique ID/tracking code must have a small copy icon next to it.

48. **Consistent Empty State per Entity**:
Every list/table must have a dedicated empty state component (`[Module]EmptyState.tsx`) with an icon, message, and CTA.

49. **Strict Import Order Convention**:
Enforce a strict order using ESLint `import/order`: React core, Third-party, Absolute internal (`@/lib`), Module-specific (`@/app/(erp)/...`), Types-only.

50. **Prop Spreading is Forbidden (`...props` ban)**:
Never write `<Component {...props} />`. All props must be explicitly named, except for primitive HTML wrappers.

51. **Conditional Rendering Pattern (No Inline Ternary Hell)**:
Deeply nested ternaries are forbidden. For 3+ conditions, use an early return pattern or `renderContent()` helper.

52. **Event Handler Naming Convention**:
Props must use the `on` prefix (`onSubmit`), internal handlers use `handle` prefix (`handleSubmit`).

53. **`useEffect` Dependency Array Audit Comment**:
Every `useEffect` must have a comment above explaining EXACTLY why those variables are in the dependency array.

54. **Global Shared Components Strict Scope**:
`src/components/ui/` is ONLY for generic, zero-business-logic primitives. Global components must NEVER contain module-specific API calls.

55. **`key` Prop Rules for Lists**:
Using `key={index}` is strictly forbidden for lists that can reorder/filter. Always use stable unique backend IDs.

56. **`next/font` for Font Loading**:
Never use Google Fonts CDN (`@import`). Always use `next/font/google`.

57. **Strict `tsconfig.json` Enforcement**:
Run with `strict: true`. No `@ts-ignore` or `@ts-nocheck`. (Mechanically enforced via pre-commit, see Rule 65).

58. **No Direct Browser Storage Access in Components**:
Never call `window.localStorage`, `sessionStorage`, or `document.cookie` directly inside React components.

Use approved isolated hooks/services:
- `useLocalStorage` for non-sensitive persisted UI preferences.
- Secure HTTP-only cookies for authentication/session tokens.
- Never store access tokens, refresh tokens, passwords, payment data, or permission grants in localStorage.

All storage keys must:
- Be defined in a centralized constants file.
- Be namespaced by application and module.
- Have a documented schema/version where persisted object data is used.

Example:
`APP_MODULE_FILTERS_V1`
`APP_DASHBOARD_LAYOUT_V1`

59. **Standardized `ApiResponse<T>` Generic (The API Contract)**:
Every API call must be typed using a global `ApiResponse<T>` generic interface that perfectly matches the backend response envelope (Backend Rule 28). Both Success and Error responses must share this exact canonical shape:
`{ success: boolean, message: string, data: T | null, meta?: PaginationMeta, error?: string, statusCode?: number }`

60. **No Direct `router.push('/login')` in Components**:
Handle unauthenticated redirects centrally in `middleware.ts` or an API interceptor.

61. **Enforced Tooling Gates (Mechanical Blocking)**:
Rules against arbitrary Tailwind (Rule 36), `any` types (Rule 27), `console.log` (Rule 46), magic strings (Rule 35), and TS ignores (Rule 60) are not just "trust-based suggestions". 
You MUST implement **ESLint plugins** (`eslint-plugin-tailwindcss`, `@typescript-eslint/no-explicit-any`, `no-console`) and a **pre-commit hook** (`husky` + `lint-staged`) that runs `tsc --noEmit` and linters before any commit. These rules must be physically blocked by tooling to ensure extreme safety in an AI-driven codebase. Detailed test practices should reside in Rule 15A.

### Required CI Quality Gates

Every pull request must run:

1. Type Check
   - `tsc --noEmit`

2. Lint and Formatting
   - ESLint
   - Tailwind class validation
   - Prettier formatting check

3. Tests
   - Unit and component tests
   - Coverage threshold validation

4. Build
   - Production build must succeed

5. Security
   - Dependency vulnerability scan
   - Secret detection scan

6. E2E Tests
   - Mandatory for authentication, billing, permissions, destructive actions, and critical CRUD flows.

No PR may merge if a required gate fails.

62. **Dependency-Addition Guardrail**:
AI agents frequently install redundant packages. **An AI cannot add a new dependency without checking `package.json` first.** Before adding a new library, you must explicitly flag why an existing approved library (e.g., React Hook Form, Zod, date-fns, Zustand, socket.io-client, lucide-react, react-apexcharts (canonical chart library — see global_design_system.md §10; Recharts and Chart.js are forbidden)) does not suffice for the task.

63. **Zero Cross-Module Imports & Full Self-Containment (The Portable Folder Rule)**:
- **Zero Cross-Module Imports:** Module A (e.g., `billing`) is explicitly FORBIDDEN from importing anything from Module B (e.g., `attendance`) — no components, no hooks, no types, no constants. This must be mechanically enforced using ESLint (`no-restricted-imports` or `eslint-plugin-boundaries`).
- **Full Self-Containment:** Every feature module must be a completely self-contained unit. It may depend ONLY on: (a) npm packages, (b) generic zero-business-logic primitives from `src/components/ui/`, and (c) its own internal files. This guarantees the entire module folder can be deleted, copied, and pasted into a different project with zero broken imports.

64. **Strict Mobile-First Enforcement (Tailwind is not magic)**:
Tailwind does not automatically make things responsive. Every component must be built **mobile-first**: base Tailwind classes must target mobile (`<768px`), then overridden with `md:` (tablet) and `lg:/xl:` (desktop) prefixes as needed.
- No component is considered complete unless explicitly checked at all three breakpoints (375px, 768px, 1280px+). 
- Specific Mobile Patterns: KPI card rows must switch to horizontal scrolling or a 2-column grid on mobile. Charts must have reduced height and simplified/collapsed legends on mobile.
- **Button Containers & Filters**: Any flex container holding multiple buttons or filter inputs (like date ranges) MUST use `flex-col sm:flex-row` or `flex-wrap` so they stack natively on mobile rather than bleeding off the edge of the card.
- **Persistent Mobile Table Actions**: Table action buttons (Edit, Delete, etc.) MUST NOT use `opacity-0` globally to hide behind hover states, as mobile devices have no mouse hover. You must use `opacity-100 lg:opacity-0 lg:group-hover:opacity-100` so actions are permanently visible on touch devices.
- **Dropdown Auto-Close**: Any custom filter dropdown menu MUST automatically close (`setShowFilter(false)`) immediately after the user makes a selection.

65. **Hardened Numeric Inputs (Prevent Negative/Invalid Inputs)**:
Never use a naked `<input type="number">` for quantities, prices, or ages without explicit validation. You MUST add a `min="0"` (or appropriate lower bound) AND an `onKeyDown` handler to mechanically block invalid characters like `-`, `e`, and `+` if they don't make business sense (e.g., `onKeyDown={(e) => { if (e.key === '-' || e.key === 'e') e.preventDefault(); }}`).

66. **Strict Optimistic UI Data Replacement (No Undefined Rows)**:
When implementing optimistic UI updates (adding a new row to a table before the API returns), you MUST use the backend's response (`res.data`) to finalize the state. Never permanently rely on the raw frontend form data for the new row, as it lacks backend-generated IDs, timestamps, and default fields. Failing to replace the optimistic row with `res.data` upon success will result in "undefined" columns and broken subsequent edit/delete actions.

67. **Explicit API Parameter Propagation (Filters & Pagination)**:
Never assume UI state magically filters backend data. Custom hooks (`use[Module]Logic`) MUST explicitly extract all relevant values (e.g., `debouncedSearch`, `page`, `limit`, `statusFilter`) from state or URL query parameters, construct a `params` object, and pass it directly to the API wrapper. If you forget to pass `params` to the API call, the UI search box will appear broken to the user.

68. **Table Header & Column Alignment Integrity**:
You MUST ensure that the length of the headers array (e.g., `TABLE_HEADERS`) EXACTLY matches the number of rendered `<td>` columns in the `<tbody>` row. This includes custom `<td>`s for avatars, checkboxes, or badges. Any empty state `colSpan` values (e.g., `colSpan={9}`) MUST also statically or dynamically match this exact column count. Mismatched columns will completely break the table alignment across all rows.

69. **Hardcoded Standard Social Brand Colors (No Missing Variables)**:
Never use undefined CSS variables (e.g., `var(--members-whatsapp)`) for standard social action buttons. Use direct standard brand hex codes for Social Action buttons (e.g., WhatsApp: `bg-[#25D366]`, Email: `bg-[#3B82F6]`) unless they are rigorously defined in `globals.css`. Relying on undefined variables will cause the buttons to become transparent with white text, making them completely invisible in Light Mode.

70. **Interactive KPI Cards as Filters**:
Whenever displaying KPI cards (like "Active Coupons" or "Total Redeemed") directly above a data table, they MUST function as interactive filters. Clicking a KPI card should filter the table below to show only the relevant rows. Include a visual indicator (e.g., a primary colored border or ring) to show which KPI filter is currently active, and always ensure there is a clear way to reset the filter (such as a "Total" card or toggling off).

71. **Double Verification for Critical Actions (Destructive/Financial)**:
Whenever presenting an action button that triggers a destructive or critical financial mutation (e.g., deleting a record, suspending a user, or marking an invoice/payroll as paid), you MUST implement a double verification confirmation dialog. Never execute these actions instantly on a single click. Utilize a global `useConfirm` hook or a similar custom modal to explicitly ask the user (e.g., "Are you sure you want to mark this as paid?").

72. **Strict API Client Function Naming Convention (The Verb Contract)**:
Every function defined inside a module's `[moduleName]_api.ts` file MUST follow a strict, predictable verb-based naming convention. AI agents must never invent arbitrary function names like `loadMembers()`, `getData()`, or `handleFetch()`. The standard is:
- `fetch[Entities](params)` — For fetching a list (e.g., `fetchMembers(params)`)
- `fetch[Entity]ById(id)` — For fetching a single entity (e.g., `fetchMemberById(id)`)
- `create[Entity](dto)` — For POST creation (e.g., `createMember(dto)`)
- `update[Entity](id, dto)` — For PATCH/PUT updates (e.g., `updateMember(id, dto)`)
- `delete[Entity](id)` — For DELETE (e.g., `deleteMember(id)`)
- `export[Entity]Report(params)` — For report/export generation
- This naming MUST exactly mirror Backend Rule 86's method naming table. When a backend AI agent writes `createMember()` on the service, the frontend AI agent must write `createMember()` in the API client — **1:1 verb symmetry, zero ambiguity**.

73. **`import type` Mandate for Type-Only Imports**:
Whenever importing a TypeScript type, interface, or enum that is used purely for type-checking (not as a runtime value), you MUST use the `import type` syntax. Never use a regular `import` for type-only constructs.
- ❌ **BAD:** `import { MemberTableProps } from '@/app/admin/members/members_types/member.types'`
- ✅ **GOOD:** `import type { MemberTableProps } from '@/app/admin/members/members_types/member.types'`
- **Why:** `import type` statements are completely erased at compile time, reducing bundle size, preventing accidental runtime usage of type definitions, and eliminating a major category of circular dependency errors. TypeScript's `verbatimModuleSyntax` compiler option can mechanically enforce this. This mirrors Backend Rule 88's `import type` mandate for the backend.

74. **Security Scanning in Frontend CI/CD Tooling Gates (Extending Rule 65)**:
Rule 65 mandates ESLint, `tsc --noEmit`, and pre-commit hooks. This rule adds mandatory **security gates** to the frontend CI/CD pipeline, mirroring Backend Rules 90 & 91:
- **Gate 1 — SCA (Dependency Vulnerability Scan):** Run `npm audit --audit-level=high` or an approved SCA tool on every PR. Any `Critical` or `High` severity CVE in a frontend dependency MUST block the merge. Frontend packages (including `react`, `axios`, `next`) have real CVEs that AI agents will never proactively check for.
- **Gate 2 — Secrets Detection:** Run `gitleaks detect` on every PR diff. Frontend code frequently contains accidentally committed API keys, Stripe public keys, or environment variables. This gate is non-negotiable.
- **Gate 3 — Pre-Commit Secret Scan:** Add `gitleaks detect --no-git` (staged files only) to the existing `husky + lint-staged` pre-commit hook so secrets are caught locally before pushing.
- **Why:** An AI agent configuring a new third-party SDK (e.g., a payment widget) may accidentally commit a test API key directly into a component file. Automated scanning catches this before it enters source control history.

75. **MSW (Mock Service Worker) for Stub-First Frontend Development**:
When a backend API endpoint does not yet exist (the stub-first phase of Backend Rule 81), the frontend MUST use **MSW (Mock Service Worker)** to intercept HTTP requests and return realistic mock responses. It is strictly forbidden to hardcode fake data directly inside hooks, components, or constants.
- ❌ **BAD:** `const members = [{ id: '1', name: 'Test User' }]; // TODO: replace with API`
- ✅ **GOOD:** An MSW handler in `src/mocks/handlers/members.handlers.ts` that intercepts `GET /api/v1/members` and returns a realistic typed payload matching the `ApiResponse<Member[]>` envelope.
- **Required Structure:** All mock handlers must live in `src/mocks/handlers/[moduleName].handlers.ts`. A central `src/mocks/browser.ts` file registers all handlers. MSW is enabled only in `development` and `test` environments — never in production builds.
- **Why:** Hardcoded fake data scattered in hooks creates a massive cleanup burden. An AI agent can forget to remove it, or worse, the fake data can shadow the real API call silently. MSW intercepts at the network level, meaning the same `useEffect`/`fetch` code runs in both development and production — only the response source changes. The transition from mock to real API is a one-line change in the MSW handler, not a hunt across 10 component files.

76. **`CODEOWNERS` Human Review Gate for Security-Critical Frontend Code**:
Just as Backend Rule 93 mandates human review for `auth/`, `billing/`, and `permissions/` backend modules, the frontend MUST implement a `CODEOWNERS` file requiring mandatory human reviewer approval on PRs that touch security-critical frontend paths. AI agents cannot self-certify security-critical UI changes.
- **Mandatory Human Review Required For:**
  1. **Auth UI** — Any changes to `src/app/auth/` (login form, logout, refresh logic).
  2. **API Interceptor & Token Logic** — Any changes to the centralized `api.ts` wrapper, the token refresh interceptor, or `middleware.ts`.
  3. **Permission Hooks** — Any changes to `usePermissions()` or any hook that conditionally hides/shows restricted UI elements.
  4. **Payment UI** — Any component that triggers a payment, displays financial data, or handles billing actions.
- **PR Description Mandate:** Any PR touching these paths MUST include a `## Security Impact Analysis` section explaining what changed and why it's safe.
- **Why:** A subtle bug in the frontend's token refresh logic or a missing `usePermissions()` check can expose restricted data to unauthorized users — purely a client-side authorization bypass. Automated ESLint and TypeScript checks cannot catch semantic security flaws. A human review is the final gate.

77. **CI/CD Merge Policy and Branch Protection**:
Every pull request must pass the following pipeline before merge:

1. **Quality**
   - ESLint
   - Prettier check
   - Tailwind linting
   - TypeScript type check

2. **Security**
   - Dependency vulnerability scan
   - Secret scan
   - License/compliance scan if required by the organization

3. **Tests**
   - Vitest unit/component tests
   - Coverage thresholds
   - Playwright E2E tests for applicable critical flows

4. **Build**
   - Production Next.js build
   - Bundle analysis for major changes

5. **Review**
   - Mandatory CODEOWNERS approval for auth, permissions, billing, payment, and security-sensitive paths.
   - AI-generated PR descriptions must list files changed, tests run, risk areas, and rollback impact.

Branch protection requirements:
- No direct push to `main`.
- No merge with failing checks.
- No bypass for CODEOWNERS on security-sensitive files.
- Require at least one human approval for all AI-generated changes.

---
Think step-by-step. Create a detailed implementation plan first so I can review it, and then execute it perfectly without breaking existing data flows!
