Yesterday 12:31 AM
smart-restaurant-management-main(1).zip
Zip Archive
nahi abhi autit nahi karna is me zip file me tum my ap project ke ander se src ke ander se app ke ander se manger folder ko deep me analyz karna he or jo mene rull ki or design ki file di thi mujhe ye bata kya vo design and rull mere manger folder ke har ak file me pafect he ya kuch missing or jo bhi missing he har ak missing part ko ase descirbe karna jese like manger ke ye folder me is file ye deisigne ye rull ye part miss sab deteal me ok abhi sirf tume sab detail do bas baki me kar lunga

Haan. Maine uploaded smart-restaurant-management-main(1).zip ke actual source ko extract karke src/app/kitchen/ ka deep static audit kiya hai — sirf surface-level nahi. ZIP aapke current conversation me uploaded source hai.

Maine har Kitchen file, folder structure, line count, imports, hooks, forms, localStorage flow, colors, Tailwind classes, accessibility attributes, pagination/filtering, modals, error/loading states, docs, naming, state architecture aur design-system compliance check kiya.

Code modify nahi kiya hai. Ye sirf audit/report hai.

🔥 KITCHEN MODULE — DEEP AUDIT
Overall Result
Area	Status
Folder isolation	🟡 Mostly good
Naming	🟡 Mostly good
Micro-modularization	🔴 Major issues
Page Server/Client architecture	🔴 Failing
State architecture	🔴 Failing
Backend/API readiness	🔴 Major gap
React Query	🔴 Missing
Zustand	🔴 Missing
Forms	🟡 Partial
Validation	🟡 Partial
URL state	🔴 Missing
Centralized constants	🔴 Partial
Theme independence	🔴 Major violations
Accessibility	🟡 Partial
Loading UI	🔴 Violates rule
Error handling	🟡 Partial
Error monitoring	🔴 Missing
Tests	🔴 0 tests
Context menu	🔴 Missing
Tooltips	🔴 Almost completely missing
Empty states	🔴 Missing dedicated components
Sensitive-data masking	🟡 Needs architecture
Print architecture	🔴 Partial
Security	🔴 Major
Feature documentation	🔴 Inaccurate/incomplete

Kitchen module ka sabse bada problem UI nahi hai.
Sabse bada problem hai ki architecture document ek enterprise/backend-ready architecture claim karta hai, lekin actual implementation abhi bhi largely localStorage-based frontend mock architecture hai.

Aapke rules specifically micro-modularization, Server/Client boundaries, API/state separation, backend-driven messages, tests, URL state, accessibility etc. demand karte hain.

1. KITCHEN FOLDER STRUCTURE

Current structure:

kitchen/
│
├── KitchenErrorBoundary.tsx
├── error.tsx
├── loading.tsx
├── not-found.tsx
├── page.tsx
│
├── inventory/
│   └── page.tsx
│
├── menu/
│   └── page.tsx
│
├── kitchen_components/
│   ├── KitchenAddInventoryModal.tsx
│   ├── KitchenAnalyticsModal.tsx
│   ├── KitchenComboEditor.tsx
│   ├── KitchenCompletedOrdersView.tsx
│   ├── KitchenConsolidatedItemsModal.tsx
│   ├── KitchenInventoryTable.tsx
│   ├── KitchenKotCard.tsx
│   ├── KitchenKotGrid.tsx
│   ├── KitchenKpiSummaryBar.tsx
│   ├── KitchenLowStockSlaTracker.tsx
│   ├── KitchenMenuFormModal.tsx
│   ├── KitchenMenuTable.tsx
│   ├── KitchenPrepTimeInput.tsx
│   ├── KitchenRecipeEditor.tsx
│   ├── KitchenRecipeModal.tsx
│   ├── KitchenStatusPipeline.tsx
│   ├── KitchenStockToggle.tsx
│   ├── KitchenSupplierPoModal.tsx
│   ├── KitchenTicketModal.tsx
│   └── KitchenWasteLogModal.tsx
│
├── kitchen_hooks/
│   ├── useKitchenInventory.ts
│   ├── useKitchenKds.ts
│   ├── useKitchenMenu.ts
│   └── useKitchenStock.ts
│
├── kitchen_types/
│   └── KitchenTypes.ts
│
├── kitchen_features.md
├── kitchen_forbidden.md
├── kitchen_theme_contract.md
└── kitchen_url_config.ts
Structure ka positive part

Ye achha hai ki:

kitchen_components/
kitchen_hooks/
kitchen_types/
module docs
URL config

already exist.

Ye AI isolation ke direction me correct hai.

Lekin problem

Aapke own rule ke according internal folders ko feature-based subfolders me logically group karna hai, flat 20+ component directory nahi. Rule explicitly kehta hai feature folders ke andar related files group hone chahiye.

Current:

kitchen_components/
  20+ files

AI ko KitchenStockToggle.tsx, KitchenWasteLogModal.tsx, KitchenLowStockSlaTracker.tsx etc. ek hi flat namespace me mil rahe hain.

Missing logical feature grouping

For example conceptually:

kitchen_components/
├── kds/
├── inventory/
├── menu/
├── stock/
├── recipes/
├── waste/
├── analytics/
└── printing/

Current implementation me ye grouping missing hai.

2. FILE SIZE AUDIT

Rule:

.tsx max ~300
hooks max 150
utils max 120
types max 200

Ye explicit rule hai.

🔴 Components over limit
File	Lines	Problem
KitchenStockToggle.tsx	502	🔴 Huge
KitchenMenuTable.tsx	342	🔴 Over
KitchenKotCard.tsx	307	🔴 Over
KitchenInventoryTable.tsx	319	🔴 Over
KitchenMenuFormModal.tsx	287	🟡 Near limit
KitchenComboEditor.tsx	273	🟡 Near limit
🔴 Hooks over limit
Hook	Lines
useKitchenKds.ts	476
useKitchenMenu.ts	165
useKitchenStock.ts	156

useKitchenInventory.ts at 114 is okay.

🔴 Type file
KitchenTypes.ts = 290 lines

Limit = 200.

So ye bhi fail.

🔴 Page
page.tsx = 377

Page root ko waise bhi Server Component hona chahiye; iske andar itni orchestration hona architecture ko aur heavy bana raha hai.

3. ROOT page.tsx
kitchen/page.tsx
🔴 Issue 1 — "use client"

Sabse major architectural violation:

"use client";

Root page Client Component hai.

Rule ke according top-level page.tsx Server Component hona chahiye; interactive pieces leaf client components hone chahiye.

🔴 Issue 2 — AuthGuard cross-module
import { AuthGuard } from "@/app/auth/auth_components/AuthGuard";

Kitchen forbidden file explicitly cross-module imports forbid karta hai.

Ye kitchen isolation tod raha hai.

Same issue menu/page.tsx aur inventory/page.tsx me bhi hai.

🔴 Issue 3 — page is doing too much

Page khud handle karta hai:

station tab
stock tab
completed tab
search
status filter
modal state
analytics state
recipe modal
ticket modal
stock filter
mute state
audio
KOT counting
filtering
rendering orchestration

Ye AI-friendly architecture ke against hai.

🔴 Issue 4 — local search
filteredKots.filter(...)

Search backend/API par nahi ja raha.

Rule server-side filtering/pagination/sorting demand karta hai.

🔴 Issue 5 — search URL me nahi

useSearchParams() / URL sync nahi.

Rule:

searchable/filterable/paginated list → URL query parameters.

🔴 Issue 6 — status filter local
statusFilter

local state hai, URL/API parameter nahi.

🔴 Issue 7 — hardcoded station data
All
Kitchen
Bar
Bakery

UI/page-level constants me hain.

Ye backend-ready centralization ke stricter interpretation ke according feature constants me hone chahiye. Rules specifically dropdown/filter/preset arrays ko centralized constants me rakhne bolte hain.

🔴 Issue 8 — audio warning console
console.warn(...)

Production console ban.

Rule centralized logger demand karta hai.

🔴 Issue 9 — status UI colors
bg-white/20

Theme rule violation.

🔴 Issue 10 — arbitrary values

Examples:

text-[12px]
text-[10px]
...

Aapke design rules arbitrary Tailwind values prohibit karte hain.

🔴 Issue 11 — KPI filter architecture

KPI cards click karke related table/filter state change karne ka behavior partial hai only stock side.

Design rule says KPI cards directly above data tables should act as filters where applicable.

4. inventory/page.tsx
🔴 Root Client Component
"use client";

Again Server Component violation.

🔴 Cross-module AuthGuard
@/app/auth/...
🟡 Hydration workaround
const [isMounted, setIsMounted] = useState(false)

Ye localStorage SSR mismatch solve karne ke liye use kiya gaya hai, but correct architecture me page ko client banane ke bajay server/client boundary properly design karni chahiye.

🔴 Alert lists are not truncated
lowStockItems.map(...).join(", ")

Agar 100 items ho gaye to alert banner huge ho sakta hai.

Rule says constrained dynamic text should truncate + tooltip.

🔴 No dedicated AlertBanner component

Low-stock and expiry alert page ke andar inline hain.

🔴 No API

Inventory completely localStorage based.

🔴 No URL filters

Inventory search/filter component ke andar local hai.

🔴 Page CTA icons
<Plus size={16} />
<ShoppingCart size={16} />

Design standard 18px hai.

5. menu/page.tsx
🔴 "use client"

Root page violation.

🔴 AuthGuard cross-module
🟡 Page contains business orchestration

It manages:

add
edit
delete
active tab
modal
combo CRUD

Ye hook/feature controller level par aur cleanly isolate hona chahiye.

🔴 Inline MenuPageHeader

Same file me page + header.

Rule says one component per file.

🔴 Tab state URL me nahi
menu / combos

URL-sync missing.

🔴 No dedicated constants file

Tabs centralized module/feature constants me hone chahiye.

🔴 No tests
6. KitchenAddInventoryModal.tsx

148 lines

Size okay.

But:

🔴 No RESPONSIBILITY comment

Strict component responsibility rule says every component file should have it.

🔴 Inline interface
interface KitchenAddInventoryModalProps

Component file me defined hai.

Aapka architecture says types centralized.

🔴 Form does not use RHF + Zod

Ye non-trivial form hai:

name
category
unit
current stock
threshold
expiry

But plain useState.

Rule says all non-trivial forms:

React Hook Form
Zod
@hookform/resolvers

🔴 Hardcoded options
RAW_MATERIALS
DAIRY
PRODUCE
MEAT
BEVERAGES
PACKAGING
kg
ltr
pcs
gm
ml

Feature constants file missing.

🔴 Number input not hardened

type="number" hai but complete min + onKeyDown invalid character prevention missing.

Rule explicitly -, e, + blocking demand karta hai.

🔴 Accessibility

Labels exist, but:

explicit htmlFor/id association not consistently present
no aria-invalid
no aria-describedby
no validation error UI
no focus-visible

Design requires these states.

🔴 Modal z-index
z-50

Required modal = z-40.

🟡 max-w-md

Acceptable-ish but modal design says max-width 480px and radius-xl/padding 28.

Current styling is not consistently mapped to those exact specs.

🔴 Unsaved changes

No beforeunload.

Rule requires modified forms/modals to warn.

7. KitchenAnalyticsModal.tsx

142 lines

Size okay.

🔴 Fake/static analytics

Values are hardcoded:

94.2%
11.4 mins
7 PM - 8 PM
42 KOTs

Also:

STATION_SPEEDS
RUSH_HOURS

are local constants.

For backend-ready ERP, analytics should originate from API/query data.

🔴 No API
🔴 No loading state
🔴 No error boundary around analytics section

Global rule explicitly says independently loaded sections such as dashboard charts/analytics should have section-level Error Boundary.

🔴 Wrong z-index
z-50

Required z-40.

🔴 Emoji

There are emoji indicators.

Design says actual implementation must use Lucide icons, not emoji.

🔴 Many arbitrary font sizes

text-[11px], text-[10px], etc.

🔴 No focus-visible
🔴 No focus trap/autofocus
8. KitchenComboEditor.tsx

273 lines

🟡 Near component limit
🔴 TWO components in one file
ComboRow
KitchenComboEditor

Rule says one React component per file.

🔴 Inline ComboRowProps

Should be centralized.

🔴 Inline form state type

Form shape lives inside component.

🔴 Hardcoded Happy Hours logic

happyHoursEnabled etc. UI-level state but no backend architecture.

🔴 Delete lacks proper destructive confirmation

There is delete action, but global destructive confirmation rules require confirmation; highly destructive operations may additionally require type-to-confirm.

🔴 Number input

Combo price uses number input but hardening needs verification.

🔴 Dynamic itemNames

No truncation/tooltip.

🔴 Icon sizes

13px etc., while standard is 18px.

🔴 Focus-visible missing.
9. KitchenCompletedOrdersView.tsx

89 lines

One of cleaner components.

Good
small
focused
stable key
explicit responsibility
data passed via props
Missing

🔴 dedicated empty-state component

🔴 tooltip/truncation

🔴 copy KOT/order ID

🔴 context menu

🔴 mobile/card-stack behavior

🔴 accessibility/focus-visible consistency

🔴 no test

🔴 recall operation should be backend authoritative.

10. KitchenConsolidatedItemsModal.tsx

139 lines

🔴 Uses useLocalStorage

This component should be view-only according to its responsibility, but it reads orders/menu itself.

That creates data-flow duplication.

🔴 Business data inside UI

Aggregation should live in hook/query selector, not modal.

🔴 No dedicated API/query
🔴 Modal z-index
z-[9990]

Major violation.

Required:

z-40
🔴 Hardcoded status colors

Amber/blue etc.

🔴 No tooltip
🔴 No focus trap
🔴 No tests
11. KitchenInventoryTable.tsx

319 lines

🔴 Over component limit
🔴 Contains multiple components
StatusBadge
EditableStockCell
EditableExpiryCell
KitchenInventoryTable

Four components in one file.

🔴 Inline props interfaces
EditableCellProps
EditableExpiryProps
🔴 Client-side search
inventoryItems.filter(...)
🔴 Client-side pagination
slice(...)

Design requires server-side pagination/filtering/sorting for backend lists.

🔴 No sorting

Table should support sortable columns where applicable.

🔴 Search not URL synced
🔴 Empty state inline
No inventory items found

Dedicated:

KitchenInventoryEmptyState.tsx

missing.

🔴 No mobile card-stack

Current:

overflow-x-auto

but design says mobile tables should become card-stack under 768px.

🔴 Dynamic item name not truncated
🔴 No tooltip
🔴 Delete icon-only button lacks full design behavior

No:

tooltip
focus-visible
32×32 standardized action container
context menu
mobile persistent action handling
🔴 Number input incomplete hardening

It has:

min={0}

but invalid keyboard characters aren't fully blocked.

🔴 Status mapping inside component
styles: Record<StockStatus, string>

Global design says status-to-color mapping should be centralized.

🔴 Date logic repeated

new Date().toISOString() logic is component-level utility logic.

Should be centralized formatter/status utility.

🟡 AppPagination

Good that shared pagination exists.

But data source is still client-side.

12. KitchenKotCard.tsx

307 lines

🔴 Over limit
🔴 Relative imports
./KitchenStatusPipeline
./KitchenPrepTimeInput

Your absolute-import rule explicitly forbids relative imports.

🔴 Complex responsibility

This one component handles:

KOT header
station
priority
timer
items
status pipeline
prep time
bulk actions
void request
waiter notification
recipe
ticket
alerts

Too much.

🔴 Multiple UI micro-functions inside one file

Should be split into feature subcomponents.

🔴 Hardcoded urgency values
450
600
900

Constants are there, which is good, but should live in feature constants if shared.

🔴 Hardcoded Tailwind border widths
border-l-[6px]
border-l-[5px]

Arbitrary Tailwind violation.

🔴 Hardcoded colors
red-600
orange-500
amber-500
red-500

Theme violation.

🔴 Emoji in responsibility/UX

RUSH/VIP shorthand comments okay, but actual UI must use icons.

🔴 Icon sizes not standard

Several 13/14/16px.

🔴 Dynamic data lacks truncation/tooltip

KOT/table/item text can overflow.

🔴 No context menu

KOT is an operational card; design calls for right-click context menu on tables/Kanban-style cards.

🔴 No test
🟡 Timer cleanup is present

That part is good.

13. KitchenKotGrid.tsx

57 lines

Good and focused.

Missing

🔴 relative import:

./KitchenKotCard

🔴 inline empty state likely:

Need dedicated:

KitchenKotEmptyState.tsx

🔴 no context menu wrapper

🔴 no section error boundary

🔴 no test

14. KitchenKpiSummaryBar.tsx

150 lines

🟡 At exact hook/component boundary
Good
KPI data comes through props
clickable stock KPI
icons
compact
Missing

🔴 KPI trend information

Design expects meaningful KPI visualization/trend where appropriate.

🔴 hardcoded colors in class combinations

🔴 arbitrary values

text-[11px]
...
scale-[1.02]
🔴 No URL filter propagation

Clicking KPI changes parent local state, not URL/query/backend state.

🔴 Icon sizes inconsistent

Some 18, others not.

🔴 Accessibility

Need better button semantics/focus-visible.

15. KitchenLowStockSlaTracker.tsx

170 lines

This one has serious architecture issues.

🔴 Cross-module import
import { useAuth } from "@/app/auth/auth_hooks/useAuth";

Forbidden.

🔴 Direct localStorage hook usage in UI component

It uses useLocalStorage directly.

The architecture says business/server data should not be owned by UI components.

🔴 Notifications managed inside UI

Cashier/Admin notifications are created directly.

This is business logic.

🔴 Toasts hardcoded
🔴 Emoji
🚨
etc.
🔴 Hardcoded colors

Many red/amber/blue.

🔴 Timer logic in component

Should be isolated.

🔴 Security/authorization

useAuth is being used directly rather than centralized permission capability model.

🔴 No API
🔴 No backend SLA authority

24-hour SLA must not be trusted from client timer/localStorage.

🔴 No test
16. KitchenMenuFormModal.tsx

287 lines

This is one of the better architecture files, because it actually uses:

react-hook-form
zod
zodResolver
useFieldArray

That is correct direction.

But:

🔴 Schema inside component
variantSchema
menuItemSchema

should be separate:

KitchenMenuItemForm/
  KitchenMenuItemForm.tsx
  useKitchenMenuItemForm.ts
  kitchenMenuItem.form.schema.ts
  KitchenMenuItemForm.test.tsx

The architecture explicitly gives this form structure.

🔴 watch + setValue manually overriding RHF

Example:

{...register("name")}
value={watch("name")}
onChange={...setValue(...)}

This creates unnecessary controlled/uncontrolled complexity.

🔴 type="number" incomplete hardening
🔴 Error accessibility incomplete

Errors rendered but:

aria-invalid
aria-describedby

missing.

🔴 Unsaved changes warning missing
🔴 Modal focus management missing
🟡 Escape exists

Good.

🔴 Modal overlay black/60

Design wants semantic overlay strategy, and z-40 is correct here.

🔴 Arbitrary Tailwind values

19 occurrences.

🟡 RecipeEditor inside form

This is another responsibility boundary issue.

17. KitchenMenuTable.tsx

342 lines

🔴 Over limit
🔴 Multiple components
DeleteDialog
KitchenMenuTable
🔴 Inline DeleteDialog props
🔴 Delete dialog itself is not sufficiently compliant

Need:

standard modal
z-40
danger icon
focus trap
focus restore
proper focus-visible
backend confirmation
type-to-confirm if product considers deletion irreversible
🔴 Search client-side
🔴 Pagination client-side
🔴 No sorting
🔴 URL state missing
🔴 Dynamic categories generated client-side

Could be backend-filterable.

🔴 Empty state inline
🔴 Mobile table does not card-stack
🔴 Variants dynamic text no truncate/tooltip
🔴 Station mapping local
STATION_COLORS

should be centralized status/config.

🔴 Arbitrary Tailwind values

14 occurrences.

🔴 Icons 14/15px rather than standard 18.
18. KitchenPrepTimeInput.tsx

73 lines

Small and focused.

Good
dedicated component
Enter handling
Escape handling
local UI state
Missing

🔴 number input invalid key blocking

🔴 min/max business constraints

🔴 focus-visible

🔴 backend mutation state should come from network state, not parent local assumption

🔴 no test

🔴 no tooltip if value constrained

19. KitchenRecipeEditor.tsx

134 lines

Good

Focused.

Problems

🔴 Inline state/business transformations.

🔴 Number input lacks hardened keyboard handling.

🔴 AppMenuRecipeItem comes from global app types, not Kitchen-owned types.

🔴 No RHF/Zod despite being a non-trivial form-like editor.

🔴 No dirty-state warning.

🔴 No backend API.

🔴 No test.

🔴 Dynamic ingredient selection is localStorage-driven through parent architecture.

20. KitchenRecipeModal.tsx

181 lines

🔴 Reads localStorage itself
useLocalStorage(...)

A modal should not become a data access layer.

🔴 Missing query/server-state architecture
🔴 Hardcoded recipe data assumptions
🔴 No API
🔴 No loading/error state for recipe
🔴 No section error boundary
🔴 Modal accessibility incomplete
🔴 arbitrary Tailwind values
🔴 no tooltip/truncation for long instructions/allergens
21. KitchenStatusPipeline.tsx

89 lines

Pretty good micro-component.

Good
focused
dedicated
simple state transition
Missing

🔴 status mapping should be centralized

🔴 icons likely not consistently 18px

🔴 focus-visible

🔴 keyboard semantics need stronger review

🔴 no test

🔴 mutation should be API/backend-authoritative

22. KitchenStockToggle.tsx
🚨 MOST PROBLEMATIC COMPONENT

502 lines

This is the biggest component in Kitchen.

Responsibilities currently combined
search
stock filter
station filter
pagination
counts
localStorage
notifications
low-stock alerts
restock
undo
toast
stock toggle
batch toggle
recipe opening
waste opening
item rendering
status badges
SLA state
UI pagination

This is absolutely too much for one file.

🔴 Should be split by feature

Conceptually:

KitchenStock/
├── KitchenStockPanel.tsx
├── KitchenStockSearchBar.tsx
├── KitchenStockFilterTabs.tsx
├── KitchenStockStationFilter.tsx
├── KitchenStockItemCard.tsx
├── KitchenStockAvailabilitySwitch.tsx
├── KitchenStockAlertActions.tsx
├── KitchenStockPagination.tsx
├── KitchenStockEmptyState.tsx
└── useKitchenStock...
🔴 Direct useLocalStorage

UI component itself owns:

stockAlerts
notifications

Business state should be API/query layer.

🔴 Hardcoded notifications

Cashier/Admin notification messages are created here.

Violates backend-driven message rule.

🔴 Hardcoded toast messages

Many.

🔴 Emoji

Examples:

🚨
🟢
🔴
🚚
📦
↩
✓
✕

Actual UI should use Lucide.

🔴 Hardcoded colors

Massive violation:

emerald-500
red-500
blue-500
amber-500
purple-500
black/20
white/20

Theme contract explicitly forbids these.

🔴 Arbitrary Tailwind

13+ occurrences.

🔴 Hardcoded station config
STATION_BADGE_CLASS

should be centralized.

🔴 Client-side filtering

Again.

🔴 Client-side pagination

Again.

🔴 No URL state

Again.

🔴 No dedicated EmptyState

Two different empty states inline.

🔴 No tooltip

Only one truncate occurrence, but no actual Tooltip architecture.

🔴 No context menu
🔴 No test
🔴 Accessibility

Switch has:

role="switch"
aria-checked

Good.

But still needs:

focus-visible
accessible status announcement
keyboard interaction verification
standardized icon/indicator rather than text symbols
23. KitchenSupplierPoModal.tsx

193 lines

Good
relatively focused
print functionality
currency formatter used
🔴 No backend PO creation

It only generates/prints a PO.

No actual procurement API.

🔴 Hardcoded supplier data

Supplier name/contact are defaults inside frontend.

🔴 No backend source
🔴 window.print()

Okay for print, but print architecture is incomplete.

🔴 No PrintableWrapper

Design explicitly requires reusable PrintableWrapper.

🔴 z-50

Should be z-40.

🔴 arbitrary values

14 occurrences.

🔴 Table mobile strategy missing
🔴 Dynamic supplier/item text not protected with tooltip/truncate.
24. KitchenTicketModal.tsx

107 lines

Good
focused
print-specific
uses Lucide
simple
🔴 z-50
🔴 Hardcoded print content
SMART RESTAURANT KDS

Restaurant identity should be tenant/backend configuration.

🔴 Hardcoded white/black/gray

Print is legitimately white/black territory, but the implementation should be separated into print-specific architecture rather than mixing general theme classes.

🔴 No PrintableWrapper
🔴 Dynamic item notes not truncate/tooltip.
🔴 no focus trap
25. KitchenWasteLogModal.tsx

213 lines

🔴 Non-trivial form without RHF/Zod

This is a clear form architecture violation.

Fields:

ingredient
quantity
reason
notes

Should use RHF + Zod.

🔴 Hardcoded REASON_CHIPS
Spoiled
Burnt
Expired
Order Cancelled

Should be feature constants / backend-configurable.

🔴 Hardcoded colors

Amber/orange/red/blue.

🔴 z-[9990]

Major z-index violation.

🔴 Toast messages hardcoded
🔴 Number input not fully hardened
🔴 No aria-invalid
🔴 No aria-describedby
🔴 No dirty-state warning
🔴 No backend transaction

Waste logging should likely atomically:

create waste record
update inventory
create audit

Current flow is local frontend state mutation.

🔴 No test.
26. useKitchenInventory.ts

114 lines

This is one of the better hooks by size.

Good
under 150
JSDoc
useMemo
useCallback
no direct window.localStorage
isolated responsibility
But major architecture problem
useLocalStorage

is the primary source of truth.

This violates your backend-ready server-state architecture.

Rule says API responses, loading, caching, pagination, mutations etc. belong to TanStack Query.

Missing
API layer
React Query
query keys
mutations
error state
network state enum
tests
server-side filtering
server-side pagination
Date issue

Uses:

toISOString()

for business date comparisons.

Timezone behavior should be explicitly defined before production.

27. useKitchenKds.ts
🚨 Biggest hook problem

476 lines

Limit = 150.

This one hook contains:

KOT flattening
filtering
completed orders
KPI calculation
menu mapping
inventory deduction
audio
status mutation
batch mutation
void approval
waiter notification
completed recall
prep time
localStorage state

This is not AI-friendly.

🔴 Business logic mixing

The hook is basically an entire Kitchen backend simulator.

🔴 LocalStorage as database

Orders, menu, inventory, audit logs, notifications all handled here.

🔴 Fake inventory deduction

This is particularly concerning:

find matching inventory ingredient

based on dish name.

Then:

currentStock - 0.2

That is not a real recipe-based inventory deduction.

It should derive ingredient consumption from recipe/BOM data.

🔴 Dangerous fallback

It starts with:

targetId = prevInv[0].id

Meaning if no ingredient name matches, it can deduct from the first inventory item.

That is a serious functional/data-integrity bug.

🔴 Batch mutation inside setOrders

Calling inventory mutation while mapping orders creates deeply coupled state mutation.

🔴 No transaction

A KOT status change can affect:

order
inventory
audit
notification
audio

but there's no backend transaction.

🔴 Hardcoded avgPrepTimeMins: 12

Fake metric.

🔴 Hardcoded completedAt
kot.timestamp + 300000

That is artificial data, not actual completion timestamp.

🔴 Notifications directly written

Again violates backend-driven architecture.

🔴 No tests for core business logic

This hook absolutely needs unit tests.

28. useKitchenMenu.ts

165 lines

Slightly over limit.

🔴 Uses localStorage
🔴 isSubmitting boolean

Architecture requires typed network state:

idle | loading | success | error

instead of boolean flags.

🔴 Fake pessimistic UI

It does:

setIsSubmitting(true)
setMenuItems(...)
setIsSubmitting(false)

immediately.

That's not pessimistic network mutation.

🔴 No API
🔴 No React Query
🔴 No error state
🔴 ID generation frontend-side
Date.now()

Backend should own persistent entity IDs.

🔴 No tests.
29. useKitchenStock.ts

156 lines

Slightly over limit.

🔴 localStorage source of truth
🔴 Boolean-style async state

togglingId is UI state, but there is no actual network state.

🔴 Audit log generated frontend-side

Security/audit records should be backend authoritative.

🔴 userRole: "KITCHEN"

Frontend can manufacture audit role.

Security issue.

🔴 Hardcoded action strings

Should be centralized enum/constants/API contract.

🔴 No backend validation
🔴 No tests.
30. KitchenTypes.ts
🚨 Type architecture problem

290 lines

Limit = 200.

🔴 Too many responsibilities in one type file

It contains:

station types
pipeline
KOT
completed KOT
KPI
recipe
component props
stock props
waste form
hook return
menu form
combo types

This should be feature-local types.

🔴 Imports global app types
@/types/appTypes

This means Kitchen isn't actually self-contained.

🔴 WasteLogFormValues

Should be near its form schema.

🔴 KitchenMenuFormValues

Same.

🔴 No API response types

No:

ApiResponse<T>
🔴 No network-state type

Need something like:

FetchState
MutationState

according to rule.

31. kitchen_url_config.ts

Only:

BASE
MENU
INVENTORY
🔴 Incomplete

Rule says all internal page routes AND external API routes used by Kitchen belong here.

But current module has no API routes at all.

Future expected things missing:

KDS
orders
inventory
menu
recipes
stock
waste
notifications
PO
analytics

And potentially API endpoint builders.

🔴 Other module routes are hardcoded elsewhere

Even worse, Kitchen currently cross-references other role flows.

32. kitchen_features.md
🚨 Documentation is not describing actual code

This is very important.

It claims:

localized Zustand stores

But project has no Zustand dependency.

It claims pages are Server Components.

Actual pages are Client Components.

It claims hardcoded data isn't deeply in UI.

Actual code has many hardcoded:

stock statuses
reason chips
analytics
supplier info
notifications
toast messages
station colors
emoji
thresholds
fake metrics

So this document is currently more like desired architecture, not actual architecture.

That is dangerous for AI.

An AI reading:

Kitchen Features

may assume Zustand/API/Server Components already exist and generate code on top of false assumptions.

Mandatory Feature Map sections missing

Your required template includes:

Feature Inventory
Data & State Architecture
API Contract
Permissions & Security
Loading/Empty/Error states
Edge Cases / AI Warnings
Rule Compliance Checklist

Current kitchen_features.md does not contain the full mandatory structure.

33. kitchen_forbidden.md

This file itself is actually good.

It explicitly prohibits:

cross-module imports
magic colors
client page roots
UI logic
inline types
hardcoded URLs
direct localStorage
any
console logs
But implementation violates its own rules.

This is a major signal.

For example:

No Cross-Module Imports

but:

AuthGuard
useAuth

are imported from auth.

No "use client" on Page Roots

but all three route pages have it.

No Hardcoded URLs

yet architecture currently isn't fully centralized.

No Console Logs

yet Kitchen has console.error/warn.

So the forbidden document is correct, but compliance is poor.

34. kitchen_theme_contract.md
Good

The contract defines semantic variables:

primary
primary-hover
primary-subtle
bg-page
bg-card
bg-input
border
border-focus
text-primary
text-secondary
text-disabled
success
warning
danger
info

Good foundation.

🔴 But actual implementation violates it heavily

Actual Kitchen uses:

bg-red-500
text-red-500
bg-emerald-500
text-emerald-500
bg-blue-500
text-blue-500
bg-amber-500
text-amber-500
bg-orange-500
text-orange-500
bg-purple-500
text-purple-400
bg-white
text-black

The design system says hardcoded Tailwind colors should not be used for theme-dependent UI.

🔴 Contract doesn't describe all semantic tokens actually used

Actual code uses:

danger-bg
success-bg
warning-bg
info-bg
surface
surface-hover
header
text-muted

but these aren't properly documented in the contract.

So AI has incomplete theme context.

35. loading.tsx
🔴 Direct design-system violation

It contains:

<Loader2 ... animate-spin />
Loading data...

Your design explicitly says:

Never use a generic spinning circle for full-page loading.

Instead use layout-matching skeleton.

There is a skeleton, which is good, but the generic spinner is still present.

🔴 Skeleton isn't route-specific

Kitchen KDS should mimic:

header
KPI bar
station tabs
filter bar
KOT cards

Inventory should mimic table rows.

Menu should mimic menu table.

Current global loading is generic.

36. not-found.tsx
🔴 Wrong destination
href="/"

Design says:

Back to Dashboard

but for Kitchen it should route to Kitchen dashboard, not application root.

🔴 Hardcoded route

Should use:

KITCHEN_ROUTES.BASE
🔴 arbitrary:
min-h-[400px]
🟡 icon size

10 w/h etc. not standard 18 for standard UI icons.

37. KitchenErrorBoundary.tsx
Good

Actual error boundary exists.

🔴 Raw error exposed
this.state.error?.message

Users should not see internal exception messages.

Rule explicitly says never expose raw internal errors.

🔴 console.error

Forbidden.

🔴 No monitoring provider
🔴 No route/module/request ID metadata

Required monitoring metadata is absent.

🔴 Hardcoded red colors
🔴 No focus-visible
🔴 Inline props/state types
38. error.tsx
Good
Next route-level error boundary exists
reset button exists
🔴 console.error
🔴 No real monitoring provider

Comment says:

Log the error to an error reporting service

but implementation only does:

console.error

So documentation and implementation don't match.

🔴 arbitrary:
min-h-[400px]
🔴 generic error copy

Module-specific fallback is supposed to be more tailored.

39. CROSS-MODULE IMPORT AUDIT

Found:

🔴 page.tsx
@/app/auth/auth_components/AuthGuard
🔴 inventory/page.tsx
@/app/auth/auth_components/AuthGuard
🔴 menu/page.tsx
@/app/auth/auth_components/AuthGuard
🔴 KitchenLowStockSlaTracker.tsx
@/app/auth/auth_hooks/useAuth

These directly violate Kitchen's own isolation rules.

40. RELATIVE IMPORT AUDIT

Found:

KitchenKotCard.tsx
./KitchenStatusPipeline
./KitchenPrepTimeInput
KitchenKotGrid.tsx
./KitchenKotCard

Absolute-import-only rule violation.

41. LOCALSTORAGE AUDIT

There isn't much direct:

window.localStorage

inside Kitchen itself.

That's good.

But there is widespread:

useLocalStorage(...)

through:

useKitchenKds
useKitchenMenu
useKitchenInventory
useKitchenStock
KitchenStockToggle
KitchenRecipeModal
KitchenConsolidatedItemsModal
KitchenLowStockSlaTracker
Important distinction

Technically they're avoiding direct window.localStorage.

Architecturally, they are still using localStorage as the application's database.

That is the bigger issue.

42. API ARCHITECTURE
🚨 Almost completely missing

Kitchen currently has:

0 API service files
0 *.api.ts
0 React Query
0 Zustand

Package inspection confirms the project dependencies include React Hook Form/Zod/ApexCharts etc., but no @tanstack/react-query and no zustand.

There is also:

0 kitchen_api/
Expected architecture missing

Something conceptually like:

kitchen_api/
├── kitchenKds.api.ts
├── kitchenInventory.api.ts
├── kitchenMenu.api.ts
├── kitchenStock.api.ts
├── kitchenRecipe.api.ts
├── kitchenWaste.api.ts
└── kitchenAnalytics.api.ts

plus query/mutation architecture.

Your rules explicitly separate API layer from form and UI responsibilities.

43. REACT QUERY
🔴 Missing completely

Your rule requires TanStack Query for:

API response
loading
error
caching
pagination
background refetch
mutations
invalidation

Kitchen currently does none of this.

44. ZUSTAND
🔴 Missing completely

kitchen_features.md claims localized Zustand, but actual project has no Zustand package.

This is a documentation/code mismatch.

45. NETWORK STATE

Current architecture uses:

isSubmitting
togglingId
isMuted

But no unified:

idle
loading
success
error

network state.

Your rule explicitly prohibits boolean async loading flags.

46. FORMS AUDIT
Forms needing RHF + Zod

At minimum:

KitchenAddInventoryModal
KitchenWasteLogModal
KitchenRecipeEditor
KitchenComboEditor
KitchenMenuFormModal

Current status:

Form	RHF	Zod
Add Inventory	❌	❌
Waste	❌	❌
Recipe	❌	❌
Combo	❌	❌
Menu	✅	✅

So only Menu is architecturally aligned.

47. FORM ACCESSIBILITY

Across Kitchen forms, missing/inconsistent:

aria-invalid
aria-describedby
focus-visible
error announcement
semantic required state
disabled/read-only/loading states

The design system requires all these field states.

48. UNSAVED CHANGES

Search found no proper:

beforeunload

implementation in Kitchen.

Rule requires it for modified forms/modals.

So:

🔴 Add Inventory
🔴 Menu Form
🔴 Waste Form
🔴 Combo editing
🔴 Recipe editing

all need review.

49. TOOLTIP AUDIT

Kitchen has essentially no real Tooltip architecture.

Rule:

Dynamic constrained text → truncate + Tooltip.

Missing around:

KOT IDs
table numbers if constrained
item names
ingredient names
recipe instructions
variants
supplier data
alert descriptions
long notes
50. CONTEXT MENU

Search found:

onContextMenu

➡️ none

Global design requires context menus for tables/Kanban cards, with:

Edit
Delete
Copy ID

and no View action.

Kitchen has:

🔴 Inventory table — missing
🔴 Menu table — missing
🔴 KOT cards — missing

51. EMPTY STATE ARCHITECTURE

Search shows inline empty states instead of dedicated components.

Missing examples:

KitchenKotEmptyState.tsx
KitchenInventoryEmptyState.tsx
KitchenMenuEmptyState.tsx
KitchenComboEmptyState.tsx
KitchenCompletedOrdersEmptyState.tsx
KitchenStockEmptyState.tsx

Rule explicitly requires dedicated empty-state components.

52. MOBILE RESPONSIVENESS
🔴 Tables

Inventory/Menu use:

overflow-x-auto

But design says:

<768px → card stack

not just horizontal scrolling.

🟡 Filters

Some use:

flex-wrap

which is good.

🔴 KOT cards

Need explicit tablet/mobile behavior audit.

🔴 Action buttons

Hover-dependent patterns must remain visible on touch devices.

53. ICON SYSTEM

The design standard says:

Lucide
18px
strokeWidth 2

Kitchen has many:

10px
11px
12px
13px
14px
15px
16px
20px

So icon system is inconsistent.

Also actual emoji are used:

🚨
🟢
🔴
🚚
📦
✓
✕
★

Actual implementation should use Lucide icons, not emoji.

54. Z-INDEX AUDIT

Required:

z-10 → sticky table/action
z-20 → header
z-30 → tooltip/dropdown
z-40 → modal
z-50 → toast

Kitchen currently has:

z-50
z-[9990]
z-[9995]

Examples:

KitchenAddInventoryModal → z-50
KitchenAnalyticsModal → z-50
KitchenSupplierPoModal → z-50
KitchenRecipeModal → z-50
KitchenTicketModal → z-50
KitchenWasteLogModal → z-[9990]
KitchenConsolidatedItemsModal → z-[9990]
🔴 Major global violation

Modal should be z-40.

55. TAILWIND / THEME AUDIT

Major violations across Kitchen:

bg-red-500
text-red-500
bg-emerald-500
text-emerald-500
bg-blue-500
text-blue-500
bg-amber-500
text-amber-500
bg-orange-500
text-orange-500
bg-purple-500
text-white
text-black

Plus arbitrary:

text-[10px]
text-[11px]
text-[12px]
text-[13px]
text-[14px]
border-l-[5px]
border-l-[6px]
scale-[1.02]
z-[9990]

Theme independence is therefore not currently real, despite the existence of kitchen_theme_contract.md.

56. HARD-CODED DATA AUDIT

Important hardcoded values:

KDS
15 min urgent
450 sec
600 sec
900 sec
Fake KPI
avgPrepTimeMins: 12
Fake completed timestamp
timestamp + 300000
Inventory deduction
0.2
Stock categories
RAW_MATERIALS
DAIRY
PRODUCE
MEAT
BEVERAGES
PACKAGING
Units
kg
ltr
pcs
gm
ml
Waste reasons
Spoiled
Burnt
Expired
Order Cancelled
Stations
Kitchen
Bar
Bakery
Analytics
94.2%
11.4 mins
7 PM - 8 PM
42 KOTs
Supplier

Hardcoded default supplier information.

Notifications

Hardcoded role/message/title.

All of these need to be categorized into:

backend data
feature constants
system constants
configuration

instead of randomly living inside UI.

57. BACKEND-DRIVEN MESSAGES

Huge violation.

Kitchen contains hardcoded messages such as:

Low stock alert already sent...
Please select an ingredient...
Waste Logged
Marked IN STOCK
Marked OUT OF STOCK
Full Stock Received
Stock Supplied

Rule says frontend must display backend-provided message from standardized response.

58. PRINT ARCHITECTURE

Kitchen has:

window.print()

in:

KitchenSupplierPoModal
KitchenTicketModal

But missing reusable:

PrintableWrapper

Design explicitly requires it.

59. SECURITY / DATA INTEGRITY

This is one of the most important areas.

🔴 Client controls audit role
userRole: "KITCHEN"

Frontend should not be authority for audit identity.

🔴 Client creates notifications

Kitchen can fabricate:

role: ADMIN
role: CASHIER
role: WAITER

This must be backend-controlled.

🔴 Client controls stock

Stock changes are localStorage writes.

🔴 Client controls KOT state

KOT state should be backend authoritative.

🔴 Client controls inventory deduction

Especially dangerous because current deduction is heuristic.

🔴 No transactional mutation

For example KOT READY could require:

update KOT
consume recipe ingredients
create inventory movement
create audit
notify waiter

This should be handled transactionally server-side.

60. TESTING
🚨 ZERO Kitchen tests

Search found:

0 *.test.ts
0 *.test.tsx
0 *.spec.ts
0 *.spec.tsx

But rules explicitly require co-located tests for custom hooks/utilities.

Critical tests missing for:

useKitchenKds
useKitchenInventory
useKitchenMenu
useKitchenStock

And component tests for forms.

61. ERROR MONITORING

Current:

console.error
console.warn

But required architecture says approved monitoring provider with:

route
module
user ID where safe
error digest/request ID
timestamp

None of this is actually wired.

62. GLOBAL SHORTCUTS

Required:

Ctrl + K
Esc
Ctrl + S
?

Kitchen has some Escape behavior and audio/KDS interaction, but no evidence of a complete Kitchen-compatible implementation of the full global shortcut contract.

63. PERFORMANCE
🔴 No server-side pagination
🔴 No server-side filtering
🔴 No server-side sorting
🟡 Some search fields could eventually use debounce

Current local filtering doesn't solve the backend requirement.

🟢 Some dynamic/complex UI is reasonably separated

But no React Query/Suspense data architecture.

64. BIGGEST FUNCTIONAL ARCHITECTURE BUG

This deserves separate attention.

In useKitchenKds, inventory deduction is based on:

dishNameOrId

then searches ingredient name.

And if no match:

targetId = prevInv[0].id

So theoretically:

Dish doesn't match any inventory ingredient → first inventory item gets deducted.

This is not just an architecture problem.

This is a data-integrity bug.

A restaurant production system cannot use:

"if name contains ingredient → deduct 0.2"

The correct business relationship needs to come from recipe/BOM:

Menu Item
   ↓
Recipe
   ↓
Ingredient
   ↓
Required Quantity
   ↓
Inventory Movement
65. KDS STATUS FLOW

Current status flow:

PENDING
   ↓
COOKING
   ↓
READY

plus:

VOID_REQUESTED
VOIDED

Conceptually good.

But the state transition authority is currently client-side.

Missing:

server transition validation
allowed transition matrix
concurrency handling
conflict response
audit event
idempotency
mutation retry behavior
query invalidation
realtime synchronization
66. REALTIME KDS

KDS naturally needs realtime.

Current implementation detects changes through localStorage state.

Missing actual:

WebSocket / Socket.IO / SSE

architecture.

The design rules explicitly mention WebSocket-driven UI as a Client Component use case.

For production KDS, this is a major missing architectural layer.

67. DOCUMENTATION VS ACTUAL CODE — SCORE

This is important for AI context.

kitchen_forbidden.md

~8/10

Rules are clear.

kitchen_theme_contract.md

~6/10

Good variables, incomplete actual token inventory.

kitchen_features.md

~3/10

Because it currently claims architecture that isn't implemented.

68. WHAT IS ACTUALLY GOOD

Main report negative hai, but kuch things genuinely achhi hain.

🟢 Good:
kitchen_components/ exists
kitchen_hooks/ exists
kitchen_types/ exists
kitchen_features.md exists
kitchen_forbidden.md exists
kitchen_theme_contract.md exists
kitchen_url_config.ts exists
no any found
many components have responsibility comments
many hooks have DATA FLOW comments
several components are reasonably focused
KitchenStatusPipeline is nicely isolated
KitchenPrepTimeInput is small
KitchenKotGrid is small
useKitchenInventory is under hook size limit
KitchenMenuFormModal uses RHF + Zod
KitchenInventoryTable uses stable entity IDs
KitchenMenuTable uses stable entity IDs
AppPagination is reused
ApexCharts isn't being incorrectly introduced into Kitchen
no raw <img> issue was found in Kitchen
direct window.localStorage calls are avoided in most business files
some dependency comments are already present
Escape handling exists in multiple interactive areas

So foundation completely bad nahi hai. Problem ye hai ki architecture half-refactored state me hai.

🔥 FINAL PRIORITY ORDER

Agar aap mujhe bolenge "ab isko fix karna hai", to main random file-by-file changes nahi karunga.

Correct order ye hona chahiye:

🔴 PHASE 1 — Architecture
1.

Root pages:

page.tsx
menu/page.tsx
inventory/page.tsx

→ Server Components.

2.

Auth/permissions architecture isolate.

3.

API layer introduce.

4.

TanStack Query introduce.

5.

Network state architecture.

6.

Backend-driven messages.

🔴 PHASE 2 — KDS

Break:

useKitchenKds.ts

476 lines into feature-specific logic.

Especially separate:

KOT query
KOT filtering
KOT status mutation
KOT batch mutation
void decision
inventory consumption
notifications
completed KOT
metrics
audio
🔴 PHASE 3 — Inventory

Break:

KitchenInventoryTable

and implement:

server filtering
server pagination
sorting
URL state
empty state
mobile card stack
tooltip
context menu
🔴 PHASE 4 — Stock

KitchenStockToggle.tsx 502 lines ko completely split karna zaroori hai.

🔴 PHASE 5 — Forms

Convert:

Add Inventory
Waste
Recipe
Combo

to:

RHF
Zod
schema
form hook
API
tests
🔴 PHASE 6 — Type architecture

KitchenTypes.ts 290 lines ko feature-level types me split.

🔴 PHASE 7 — Design system

Global cleanup:

hardcoded colors
arbitrary Tailwind
z-[9990]
z-50 modal
emoji
icon sizes
focus-visible
tooltips
empty states
mobile tables
🔴 PHASE 8 — Reliability

Add:

unit tests
component tests
API tests/MSW
error monitoring
regression tests

Rule-driven tests should cover business-critical changes; your source rules explicitly call for regression coverage where reasonably testable.

🔴 PHASE 9 — AI CONTEXT DOCUMENTATION

Finally update:

kitchen_features.md
kitchen_forbidden.md
kitchen_theme_contract.md

so documentation describes actual implemented architecture, not future architecture.

🧠 Kitchen ka honest assessment

Agar main isko Enterprise Grade / AI-Friendly / Production Ready scale par rate karun:

Category	Score
Folder organization	7/10
Naming	7/10
Component modularity	4/10
State architecture	2/10
API readiness	1/10
Backend integration	1/10
Security/data integrity	3/10
Design-system compliance	4/10
Accessibility	4/10
Error handling	5/10
Testing	0/10
Documentation	4/10
AI-friendliness	4/10
Overall:
~3.5–4 / 10 for the architecture you defined

Lekin important point:

Ye project fundamentally unusable nahi hai.
Actually folder skeleton aur feature separation ki foundation already hai. Sabse zyada kaam architecture ko actual rules ke saath align karne me hai.

Aur Kitchen me 3 sabse dangerous files hain:

1. useKitchenKds.ts          → 476 lines
2. KitchenStockToggle.tsx    → 502 lines
3. page.tsx                  → 377 lines

Aur 3 sabse dangerous architectural concepts:

1. localStorage as database
2. client-side financial/inventory/business mutations
3. fake/inaccurate feature documentation

Ye teen pehle solve hone chahiye; warna baaki UI cleanup karne ka zyada fayda nahi hoga.

ab ase hi waiter  ke ok har ak file har choti se choti chije ok chack karo dekho hamri design or rull ke hisab se kya miissing he konse folder me konsi file me kya missing sab detail me deep me scan analyz karo ko

Haan. Is baar bhi maine uploaded Smart Restaurant Management ZIP ke actual src/app/waiter/ source ko deep static scan karke audit kiya hai. Maine code modify nahi kiya.

Maine Waiter ke root, dashboard, reservations, booking flow, components, hooks, types, utils, error/loading/not-found, feature docs, forbidden rules, theme contract aur URL config sab check kiye hain.

Aapke architecture ka main objective hai ki AI ko future me ek exact file dekar bug fix karaya ja sake, bina unrelated functionality ko touch kiye. Rules micro-modularization, role isolation, type isolation, Server/Client boundary, API/state separation etc. explicitly demand karte hain.

🔥 WAITER MODULE — DEEP AUDIT REPORT
Overall status
Area	Status
Folder isolation	🟡 Good foundation
Naming	🟡 Mostly good
Micro-modularization	🔴 Major problems
Server/Client architecture	🔴 Failing
State architecture	🔴 Failing
Backend/API readiness	🔴 Failing
React Query	🔴 Missing
Zustand	🔴 Missing despite docs claiming it
Forms	🟡 Partial
Type isolation	🟡 Partial
Theme compliance	🔴 Major violations
URL state	🔴 Missing
Loading architecture	🔴 Partial
Error architecture	🟡 Partial
Accessibility	🟡 Partial
Tooltip	🔴 Missing
Context menu	🔴 Missing
Empty states	🔴 Missing dedicated architecture
Mobile tables	🔴 Needs work
Testing	🔴 0 tests
Security	🔴 Major issues
Documentation accuracy	🔴 Poor
AI-friendliness	🔴 Low
Overall architecture score:
~4 / 10

Foundation achhi hai, lekin actual implementation aapke defined Enterprise/AI rules se kaafi peeche hai.

1. COMPLETE WAITER INVENTORY

Current files:

waiter/
│
├── WaiterErrorBoundary.tsx
├── error.tsx
├── loading.tsx
├── not-found.tsx
├── page.tsx                         534
│
├── dashboard/
│   └── page.tsx                     267
│
├── reservations/
│   ├── WaiterReservationsErrorBoundary.tsx
│   ├── page.tsx                     181
│   │
│   ├── book/
│   │   └── page.tsx                 517
│   │
│   ├── waiter_reservations_components/
│   │   ├── WaiterReservationsFormModal.tsx 230
│   │   └── WaiterReservationsTable.tsx     256
│   │
│   ├── waiter_reservations_hooks/
│   │   └── useWaiterReservations.ts         188
│   │
│   └── waiter_reservations_types/
│       └── WaiterReservationsTypes.ts        48
│
├── waiter_components/
│   ├── WaiterCartSummary.tsx                 197
│   ├── WaiterMenuItemCard.tsx                151
│   ├── WaiterOrderModal.tsx                  304
│   ├── WaiterReadyQueue.tsx                  188
│   ├── WaiterServiceRequestsDrawer.tsx       172
│   ├── WaiterTableActionsDrawer.tsx          547
│   ├── WaiterTableCard.tsx                   167
│   ├── WaiterTableGrid.tsx                    92
│   ├── WaiterTableQrModal.tsx                297
│   ├── WaiterTableTransferModal.tsx          178
│   └── WaiterVoidRequestModal.tsx            201
│
├── waiter_hooks/
│   ├── useWaiterOrder.ts                    321
│   └── useWaiterTableActions.ts              217
│
├── waiter_types/
│   └── WaiterTypes.ts                       145
│
├── waiter_utils/
│   ├── waiter_orderEventService.ts           65
│   └── waiter_serviceRequestService.ts      167
│
├── waiter_features.md
├── waiter_forbidden.md
├── waiter_theme_contract.md
└── waiter_url_config.ts
2. FILE SIZE AUDIT

Your rule:

Component max 300 lines
Hook max 150
Utility max 120
Types/schema max 200

🔴 Components over limit
File	Lines
WaiterTableActionsDrawer.tsx	547
reservations/book/page.tsx	517
WaiterOrderModal.tsx	304

WaiterTableQrModal.tsx at 297 is dangerously close.

🔴 Hooks over limit
File	Lines
useWaiterOrder.ts	321
useWaiterTableActions.ts	217
useWaiterReservations.ts	188

All three custom hooks violate the 150-line ceiling.

🟢 Types

WaiterTypes.ts = 145, so size-wise okay.

WaiterReservationsTypes.ts = 48, good.

🔴 Utility

waiter_serviceRequestService.ts = 167, over 120.

3. ROOT waiter/page.tsx
🚨 534 lines

This is one of the biggest problems.

It currently handles:

table state
order state
service request state
notification state
section filter
status filter
search
view mode
table click routing
order modal
table drawer
transfer/merge modal
QR modal
cleaning
notification acknowledgement
service requests
KPI calculations
language toggle
ready queue
toast

This is far too much responsibility for a route page.

Your own rule says heavy logic should be extracted into hooks and .tsx should act as View layer.

🔴 Issue: "use client"

Root page begins with:

"use client";

But your own waiter_forbidden.md says:

No "use client" on Page Roots.

And global architecture explicitly says top-level page.tsx should remain Server Components.

🔴 Cross-module import
@/app/auth/auth_components/AuthGuard

Waiter is supposed to be isolated.

This directly violates role isolation.

🔴 localStorage as application data source

Page directly uses:

useLocalStorage(TABLES)
useLocalStorage(ORDERS)
useLocalStorage(SERVICE_REQUESTS)
useLocalStorage(NOTIFICATIONS)

Using useLocalStorage instead of direct window.localStorage technically satisfies the old storage rule, but architecturally this is still using browser storage as the database.

The rule only permits useLocalStorage for persisted UI preferences and explicitly says access/refresh tokens, payment data, permission grants etc. must not be stored there.

For restaurant operational data:

tables
orders
service requests
notifications

this is not production-ready.

🔴 Client-side table filtering
tables.filter(...)

for:

section
search
status

This should eventually become server-side filtering.

Your performance rule explicitly requires server-side pagination/filtering/sorting.

🔴 Search not URL-synced

No useSearchParams / useRouter for table filters.

Rule says filterable/searchable/paginated list state must sync to URL.

🔴 Hardcoded UI messages

Examples:

Table Cleaned 🧹
Table ... cleaned and now Available 🟢
Click Dismiss when picked up
Click Acknowledge when served

These should not become frontend-owned backend operation messages.

Backend-driven UI message rule says frontend should display backend message.

🔴 Raw colors

Examples:

bg-white/10
amber-500
bg-amber-500/10
text-amber-500

Theme contract violation.

🔴 Arbitrary typography

Many:

text-[10px]
text-[11px]
text-[12px]
text-[14px]

Your rule prohibits arbitrary Tailwind values.

🔴 Inline business notification logic

Waiter page itself modifies notifications.

That belongs in a service/API/query/mutation layer.

🔴 Inline KPI calculations

Occupied tables, billing pending etc. should be derived in a dedicated hook/query selector rather than route.

🟡 Good

It uses:

absolute imports for most internal Waiter imports
useMemo
useLanguage
stable table IDs
dedicated child components

But overall it is still a major monolith.

4. dashboard/page.tsx
267 lines
🔴 Root Client Component
"use client"

again.

🔴 Cross-module AuthGuard
@/app/auth/auth_components/AuthGuard
🔴 localStorage as server-state substitute

Reads:

ORDERS
SALES_HISTORY
TABLES
SHIFT_REGISTER

from localStorage.

🔴 Fake “live” dashboard

Comment literally describes it as:

6 live KPI cards from localStorage

That is not live backend data.

🔴 isMounted workaround
const [isMounted, setIsMounted] = useState(false)

This exists because the page is incorrectly client-side coupled to localStorage.

Correct architecture should allow server-rendered initial state and then client hydration/query.

🔴 Fake loading detection
orders.length === 0 &&
salesHistory.length === 0 &&
tables.length === 0 &&
shiftRegister === null

This cannot distinguish:

loading
empty restaurant
real zero data
failed request

So it's not a valid async state architecture.

🔴 Boolean-style loading

isLoading is manually derived.

Your rules require typed network state rather than boolean async state.

🔴 Six KPI cards

Global design normally expects around 3–5 cards. Six is not necessarily a hard failure, but it's denser than the defined pattern.

🔴 DashboardKpiCard in same file

Two components:

DashboardKpiCard
DashboardKpiCardSkeleton
WaiterDashboardPage
DashboardPageHeader

in one file.

Violates one-component-per-file.

🔴 Inline Props interface
DashboardKpiCardProps

inside page.

Rule says component props should be centralized.

🟢 Good
currency formatter is used
KPI values are memoized
skeleton exists
no direct window.localStorage
5. WaiterErrorBoundary.tsx
50 lines
🟢 Exists

Good.

🔴 console.error
console.error(...)

Production console logging is forbidden.

🔴 Hardcoded red Tailwind
bg-red-500/10
border-red-500/30
text-red-500
bg-red-500

Theme violation.

🔴 Raw error architecture

Need safe user-facing error message and monitoring metadata.

🔴 Monitoring provider missing

Required:

route
module
user ID where safe
request/error ID
timestamp

None implemented.

6. error.tsx
36 lines
🟢 Exists.
🔴 useEffect

It logs the error using console.error.

🔴 No approved monitoring

Comment/intent may exist, but actual implementation is console-based.

🔴 Generic error handling

Should be module-specific and safe.

🟡 Retry

The reset behavior exists, which is good.

7. loading.tsx
24 lines
🔴 Generic spinner problem

It uses:

Loader2
animate-spin

for route loading.

Your rule specifically says full-page loading should use layout-matching skeleton, not generic spinner.

Missing

Waiter-specific skeleton should represent:

header
table controls
table grid
ready queue

rather than just generic loading.

8. not-found.tsx
🟡 Exists.

But should verify:

proper Waiter dashboard route
URL config usage
standard sizing
branded empty/404 state

Global rule requires branded 404 with clear “Back to Dashboard”.

Current implementation is much simpler than the required module-specific architecture.

9. WaiterCartSummary.tsx
197 lines
🟢 Relatively good

Responsibility is clearly documented.

No data fetching.

Cart data comes through props.

🔴 QUICK_TAGS inside component file
QUICK_TAGS

is hardcoded UI data.

Your centralized-data rule requires dropdown/filter/preset arrays to live in feature constants.

🔴 Icon sizes

Examples:

size={10}
size={11}
size={13}

Design standard is 18px / stroke 2.

🔴 Arbitrary font sizes

Many text-[...].

🔴 Buttons below standard touch target

Cart quantity buttons are 24×24-ish.

Global interaction policy expects 44×44 where practical.

🔴 Tooltip missing

Item names use truncate, but no Tooltip.

Rule explicitly says truncate + Tooltip.

10. WaiterMenuItemCard.tsx
151 lines
🟢 Good size
🟢 Responsibility comment
🟢 Countdown cleanup exists
🔴 Countdown business logic inside component

This is more than pure View.

Could be isolated to a dedicated hook if complexity grows.

🔴 Icon sizes
9px
10px
12px

instead of 18px.

🔴 Focus-visible incomplete

Select:

focus:outline-none

but no proper focus-visible ring.

🔴 Dynamic item name

No truncate + Tooltip.

🔴 Special/unavailable state

Status communicated partially through text/color. Need icon/semantic signal so color isn't sole indicator.

🔴 No test
11. WaiterOrderModal.tsx
🚨 304 lines

Over component limit.

Responsibilities
menu fetching
category tabs
search
debounce
keyboard handling
priority selection
KOT submit
modal layout
menu filtering
cart rendering

Too much.

🔴 localStorage
useLocalStorage(MENU)

Data access inside component.

🔴 Search is local
menu.filter(...)

No backend search.

🟡 Debounce

300ms debounce exists.

That part aligns with the requirement.

But it is only debouncing local filtering, not an API request.

🔴 Category tabs hardcoded
CATEGORY_TABS

should be centralized feature constants.

🔴 Priority inline union
"NORMAL" | "RUSH" | "VIP"

Your rule says inline string unions should not be used; named types should live in module types.

🔴 Relative imports
./WaiterMenuItemCard
./WaiterCartSummary

Absolute-import-only rule violation.

🔴 Modal

It does use:

z-40

which is good.

But:

bg-black/60

and:

shadow-black/50

are hardcoded visual values.

🔴 Focus trap

No true focus trap/autofocus/restore-focus architecture.

The rules require dialogs to trap focus and restore focus.

🔴 Loading state

isSubmitting exists, but submitKOT itself is synchronous localStorage mutation.

So the “loading” is artificial.

🔴 Empty state

Inline:

No items found

No dedicated WaiterMenuEmptyState.

12. WaiterReadyQueue.tsx
188 lines
🔴 Data logic in component

It directly:

reads orders
reads menu
builds menu Map
filters KOTs
updates orders
creates order events
shows toast

This violates the View-only direction.

🔴 localStorage

Both order and menu are localStorage.

🔴 Business mutation inside component

markItemServed() and markTableAllServed() mutate the data directly.

Should be hook/API mutation.

🔴 Hardcoded actor
actorRole: "WAITER"

Frontend should not be trusted as authority for audit identity.

🔴 Hardcoded messages
Item marked as SERVED!
All ready dishes served to table!

Backend message architecture missing.

🔴 Relative import
../waiter_utils/waiter_orderEventService

Absolute import violation.

🔴 Stable key issue
key={`${item.kotId}-${item.itemId}-${idx}`}

This unnecessarily uses idx.

Rule says stable unique backend IDs for reorderable/filterable lists.

🔴 Raw colors

Many emerald colors.

🔴 No Tooltip
🔴 No EmptyState

It returns null when empty.

That's not the same as a dedicated entity empty-state component.

13. WaiterServiceRequestsDrawer.tsx
172 lines
🟢 Responsibility clear.
🔴 localStorage in component

Reads service requests directly.

🔴 Business sorting/filtering in component
.filter(...)
.sort(...)
🔴 Direct mutation service
updateServiceRequestStatus(...)

is called from UI.

🔴 Relative import
../waiter_utils/waiter_serviceRequestService
🔴 Hardcoded colors
red
amber
emerald
blue
purple
🔴 z-index
z-[9990]

Major violation.

Required modal/drawer layering should follow:

z-30 popover
z-40 modal/drawer
z-50 toast

🔴 Icon sizes

5× icons etc. not standard.

🔴 No focus trap
🔴 No Tooltip
🔴 No dedicated empty state
🟡 SLA timer

Five-second timer is reasonable operationally, but should ultimately derive from server timestamps and backend status, not client-local storage.

14. WaiterTableActionsDrawer.tsx
🚨 547 LINES

This is the biggest Waiter component.

It contains multiple subcomponents:

PrepCountdown
KotItemRow
main drawer
order details
table actions
transfer
bill
void
service-related behavior
🔴 One file contains multiple components

Direct violation.

🔴 localStorage in UI

Reads:

TABLES
ORDERS
MENU

directly.

🔴 Complex business logic in component

It calculates:

elapsed time
order data
KOT state
item state
action availability
billing state

Should be extracted.

🔴 Relative import
./WaiterVoidRequestModal

Absolute import violation.

🔴 z-index architecture

Drawer uses:

z-50

and then Void modal claims it is above drawer.

But your official scale says modal = z-40, toast = z-50.

The component's local assumption:

z-50 so it sits above z-40 drawer

doesn't align with the global z-index contract.

🔴 Arbitrary text sizes

Huge number of text-[...].

🔴 PrepCountdown in same file

Should become:

WaiterTablePrepCountdown.tsx
🔴 KotItemRow in same file

Should become:

WaiterKotItemRow.tsx
🔴 Dynamic item names

Some truncation exists, but no Tooltip.

🔴 No context menu

Table is one of the exact places where context menu should exist.

🔴 No copy ID

Order/KOT IDs are shown but no copy button.

Rule requires copy-to-clipboard on unique IDs.

🔴 No proper mobile drawer audit

Need touch targets, keyboard, viewport-safe behavior.

15. WaiterTableCard.tsx
167 lines

This is relatively good.

🟢 Good
role="button"
tabIndex={0}
keyboard handling
aria-label
focus-visible
stable table identity
clear responsibility
QR action
🔴 Dynamic text issue
truncate

is used for order ID, but no Tooltip.

🔴 Icon sizes

10–13px.

🔴 Hardcoded color
bg-emerald-600
hover:bg-emerald-500

Theme violation.

🔴 Emoji
Mark Cleaned 🟢

Actual implementation should use Lucide icon rather than emoji.

🔴 Small touch target

QR button is around 24×24, below preferred 44×44 touch target.

🔴 title used instead of actual Tooltip

title="View Table QR Code" is not the defined enterprise Tooltip pattern.

🟡 Good focus implementation

This is one of the better accessibility implementations in Waiter.

16. WaiterTableGrid.tsx
92 lines
🟢 Small.
🔴 Relative import
./WaiterTableCard
🔴 No dedicated empty state
🔴 No context menu wrapper
🔴 No virtualization

Not necessarily mandatory for current scale, but important if table count grows substantially.

17. WaiterTableQrModal.tsx
297 lines
🔴 Very close to component limit
🔴 Cross-module import
@/app/auth/auth_hooks/useAuth

Waiter should not directly consume Auth module according to isolation rules.

🔴 Browser URL construction inside UI

Uses:

window.location.origin

and creates customer URL.

This should be centralized/configured.

🔴 Custom QR implementation

It manually draws QR patterns on canvas.

This is a production concern because it is not a robust standards-compliant QR generation architecture.

🔴 window.open

Browser behavior inside UI is okay, but should be isolated.

🔴 window download logic

Again browser-specific code mixed into large modal.

🔴 z-50

Should be z-40.

🔴 Sparkles icon 14px
🔴 Focus management incomplete

No real focus trap/restore.

🔴 No Tooltip
🔴 Dynamic URL has no copy component architecture beyond button

Copy exists, which is good.

🔴 No backend QR configuration

Table/customer URL generation should eventually be backend/tenant aware.

18. WaiterTableTransferModal.tsx
178 lines
🟢 Reasonably focused.
🔴 Relative? No major import issue here.
🔴 Uses native form handling
handleSubmit(e)

This is a non-trivial operational form.

Your form architecture expects RHF + Zod for non-trivial forms.

🔴 No Zod
🔴 No RHF
🔴 No confirmation architecture

Transfer/merge can affect active orders and tables.

Should have strong confirmation before mutation.

🔴 No backend transaction

A transfer involves:

source table
target table
order
merged table state
audit

This must be atomic backend logic.

🔴 Modal z-50

Should be z-40.

🔴 No focus trap
🔴 No unsaved-change handling
🔴 Hardcoded union
"TRANSFER" | "MERGE"

should be named type.

19. WaiterVoidRequestModal.tsx
201 lines

This is one of the better components.

🟢 Good
RHF
Zod
aria-describedby
semantic form
loading button
error message
Escape handling
responsibility comment
🔴 Schema inline

Comment itself says:

schema in types/utils, not inline

but the actual Zod schema is still inside the component file.

That's a direct documentation/code mismatch.

🔴 z-50

Should be z-40.

🔴 Icon 14px
🔴 focus:outline-none

Need explicit focus-visible.

🔴 No true focus trap
🔴 No beforeunload
🔴 No backend API

The “pessimistic” behavior is fake because underlying requestVoid only changes localStorage.

🟡 Type-to-confirm?

Void request is destructive-ish, but it is a request for approval, not direct irreversible execution. So type-to-confirm may not be necessary. Standard confirmation is appropriate.

20. useWaiterOrder.ts
🚨 321 LINES
Responsibilities combined
menu state
combos
cart
active table
item add/remove
quantity
notes
combo detection
happy-hour discount
KOT grouping
KOT creation
order creation
table mutation

Too much.

🔴 localStorage database
MENU
COMBOS
ORDERS
TABLES
🔴 Frontend-generated IDs
kot-${now}-${station}
ord-${now}

Backend should own entity IDs.

🔴 No API
🔴 No React Query
🔴 No transactional KOT submission

Current flow:

create order
update table
clear cart

all in browser state.

Production needs atomic backend mutation.

🔴 stationMap business logic

Should be isolated utility.

🔴 No test

This hook absolutely needs tests.

🔴 No network state

No proper:

idle/loading/success/error
🔴 No API response contract
21. useWaiterTableActions.ts
217 lines
🔴 Too large
Responsibilities:
merge
move
send-to-bill
void
audit logs
order mutation
table mutation

Should be split.

🔴 localStorage

Three operational collections:

TABLES
ORDERS
AUDIT_LOGS
🔴 Fake audit log
userRole: "WAITER"

Frontend is deciding actor role.

🔴 Client-generated audit ID
log-${Date.now()}-${Math.random()}

Backend should own audit IDs.

🔴 No API transaction

Merge should atomically update:

source table
target table
source order
target order
audit

Current code does multiple independent localStorage updates.

🔴 Void request wrapped in fake Promise
return new Promise((resolve) => {... resolve();})

This is not asynchronous network behavior.

So comments claiming pessimistic async operation are misleading.

🔴 No tests
22. WaiterTypes.ts
145 lines
🟢 Size okay.
🔴 Global app types

Imports:

AppTable
AppMenuItem
AppCombo
KotPriority

from:

@/types/appTypes

This weakens strict role isolation.

🔴 Inline unions

Examples:

WaiterViewMode = "grid" | "floor-map"
WaiterTableSection = ...

Some unions are legitimate domain types, but your strict rule says string unions should be named centrally—which they are—but other inline unions inside props/hooks still need extraction.

🔴 Hook return types mixed with UI types

UseWaiterOrderReturn, component props, void types, table types all coexist.

Better feature-level separation.

23. waiter_orderEventService.ts
65 lines
🟢 Size okay.
🔴 Direct browser storage
window.localStorage

This is a service rather than component, so the specific component ban doesn't technically apply, but architecturally it still means the event store is localStorage.

🔴 console.error

Forbidden production logging.

🔴 Global app type dependency
AppOrderEvent
UserRole
🔴 No API
🔴 No response contract
🔴 No tests
24. waiter_serviceRequestService.ts
167 lines
🔴 Utility size violation

Limit = 120.

🔴 Direct localStorage
🔴 Notification side effects

It calls:

dispatchNotification

from local service logic.

🔴 Multi-entity mutation

Creating service request also updates table state.

This should be one backend transaction.

🔴 Hardcoded business statuses
🔴 console.error
🔴 No API
🔴 No canonical ApiResponse<T>

The required API envelope is:

{
  success,
  message,
  data,
  meta?,
  error?,
  statusCode?
}

Nothing like this exists here.

25. RESERVATIONS MODULE

Now the second major feature inside Waiter.

26. reservations/page.tsx
181 lines
🔴 Root Client Component

No Server Component architecture.

🔴 Cross-module AuthGuard
🔴 Inline header component

Multiple components in same file.

🔴 Tabs not URL synced
UPCOMING
PAST

are local state.

Should be query params.

🔴 Uses hook with localStorage

So the whole reservation table is client-state based.

🟢 Uses feature-specific folder structure

This part is good.

27. reservations/book/page.tsx
🚨 517 LINES

This is arguably the most problematic Waiter route after the main page.

It handles:

tenant lookup
authentication
booking date
booking time
guest count
customer profile
advance deposit
payment modal
transaction ID
reservation creation
pre-order menu
quantity changes
confirmation
tenant fallback
login redirect
UI rendering
payment simulation
🔴 Huge route component

517 lines.

🔴 "use client"
🔴 Cross-module Auth hook
@/app/auth/auth_hooks/useAuth
🔴 Cross-module service
@/lib/tenantService

Depending on your strict role-isolation interpretation, tenant service is cross-module/global business logic. This needs an explicit allowed-boundary decision.

🔴 Direct localStorage

Uses menu from localStorage.

🔴 Hardcoded tenant fallback
tenant-royal-spice-01
🔴 Hardcoded advance rate
ADVANCE_RATE_PER_PERSON = 100

This should be backend/configuration data.

🔴 Hardcoded booking date
2026-08-16

Extremely suspicious for production.

🔴 Hardcoded booking time
19:30
🔴 Fake payment

This is the biggest functional concern.

It generates:

TXN_RES_${Date.now()}

and immediately treats:

paymentStatus: "PAID"

as successful.

There is no payment gateway verification.

So the frontend can manufacture a “paid” reservation.

🔴 No backend transaction

Reservation + payment + pre-order should have clear backend boundaries.

🔴 No RHF/Zod

This is a complex booking/payment form but uses useState.

🔴 Naked number input

Guest count uses type="number".

Need min plus mechanical invalid-key blocking.

🔴 <img> used
<img src={tenant.logoUrl} ...>

Global performance rule requires next/image, unless documented technical exception.

🔴 Broken/incorrect encoded currency text

The source contains malformed strings like:

â‚¹

instead of proper ₹.

This is a real source/content encoding issue.

🔴 Emoji

Address uses location emoji.

🔴 Hardcoded colors

Massive use of:

emerald-500
amber-500
white
🔴 Arbitrary Tailwind values

Many.

🔴 z-50 modal

Should be z-40.

🔴 Modal architecture

Payment modal is embedded in this giant page rather than isolated.

🔴 No focus trap
🔴 No unsaved changes warning
🔴 No backend payment verification
🔴 No loading/error state for tenant fetch

tenant starts null and then a client effect fetches it.

🔴 No dedicated booking form files

Ideal structure should have:

booking/
  page.tsx
  waiter_booking_components/
  waiter_booking_hooks/
  waiter_booking_types/
  waiter_booking_schemas/
  waiter_booking_api/
28. WaiterReservationsFormModal.tsx
230 lines
🟢 RHF + Zod

Good.

🟢 Escape

Good.

🟢 Loading button

Good.

🔴 Schema still inline

Although comment says schema is defined there.

Your strict architecture says schemas/types should be isolated.

🔴 No aria-invalid

Error text exists but input doesn't consistently expose invalid state.

🔴 No aria-describedby

Unlike WaiterVoidRequestModal, this form doesn't consistently associate errors.

🔴 Number input

Guest count:

type="number"

without complete hardened keyboard handling.

🔴 focus:outline-none

Need focus-visible.

🔴 Modal design

Uses:

z-40

Good.

But:

max-w-md
rounded-2xl

is not exactly the defined modal contract of 480px/radius-xl/padding 28.

🔴 No beforeunload
🔴 No focus trap
🔴 Hardcoded message
No available tables right now

Backend-driven message architecture absent.

29. WaiterReservationsTable.tsx
256 lines
🟢 Semantic <table>

Good.

🟢 Stable reservation ID

Good.

🟢 Pagination UI

Good.

🔴 Pagination is client-side
filtered.slice(...)

This violates server-side pagination requirement.

🔴 Search client-side
🔴 Status filter client-side
🔴 URL state missing
🔴 Sorting missing

Table should support sorting where relevant.

🔴 Empty state inline
CalendarX
No waiter_reservations

Need dedicated:

WaiterReservationsEmptyState.tsx
🔴 Headers array uses key={i}

This is a list that doesn't need to be dynamic, but under your strict key rule it should still avoid index keys where possible.

🔴 colSpan={7}

Currently appears aligned with seven columns, so no immediate mismatch found. Good.

🔴 Dynamic customer phone

Phone is displayed unmasked.

Your rule says sensitive fields should be masked by default:

98****2310

🔴 Cancel confirmation is inline

Global rule says destructive actions should show confirmation modal.

Current confirmation is an inline table row, not the defined confirmation dialog.

🔴 No type-to-confirm

For reservation cancellation, normal confirmation may be enough; type-to-confirm isn't necessarily required.

🔴 No Tooltip
🔴 No mobile card-stack

It only uses:

overflow-x-auto

But mobile rule requires card-stack below 768px.

🔴 Arbitrary typography

Many text-[...].

🔴 No context menu
30. useWaiterReservations.ts
188 lines
🔴 Over hook limit
🔴 localStorage data source
🔴 Client-generated reservation IDs
generateId(...)
🔴 Client-side date filtering/sorting
🔴 Date.now() dependency bug risk

The now value is calculated on render, but useMemo dependencies only include reservation data.

So:

upcoming
past

may not update merely because time crosses a reservation boundary if reservation data doesn't change.

This is a subtle but real functional issue.

🔴 Fake pessimistic UI
setIsSubmitting(true)
...
setIsSubmitting(false)

There is no network operation.

🔴 No API
🔴 No React Query
🔴 No mutation response
🔴 No error state
🔴 No tests
31. WaiterReservationsTypes.ts
48 lines
🟢 Good size.
🟢 Dedicated reservation types.
🔴 Global AppReservation, AppTable dependency

Again role boundary isn't completely isolated.

🟡 Could split

Form values and table props are different responsibilities, but size is small enough that this is not urgent.

32. waiter_features.md
🚨 Documentation is inaccurate

This is one of the biggest AI-context problems.

It says:

localized Zustand stores

But actual project does not implement Zustand.

It says:

page.tsx acting as a Server Component

But actual:

waiter/page.tsx → Client
dashboard/page.tsx → Client
reservations/page.tsx → Client
book/page.tsx → Client

It says:

No data is hardcoded deeply inside UI

But actual code has:

ADVANCE_RATE_PER_PERSON = 100
bookingDate = 2026-08-16
bookingTime = 19:30
CATEGORY_TABS
QUICK_TAGS
hardcoded messages
hardcoded colors

So the document is describing a target architecture, not the actual architecture.

That is dangerous for AI.

33. waiter_forbidden.md

The rules themselves are good.

It correctly prohibits:

cross-module imports
arbitrary Tailwind
Client page roots
UI business logic
inline types
hardcoded URLs
direct localStorage
any
console logs

But implementation violates several of them.

Example:

Rule says:

No cross-module imports

Actual:

AuthGuard
useAuth
Rule says:
No use client on Page Roots

Actual:

waiter/page.tsx
dashboard/page.tsx
reservations/page.tsx
book/page.tsx

all client.

Rule says:
No console logs

Actual error boundaries/services use console.

So the forbidden document is correct, but compliance is poor.

34. waiter_theme_contract.md
🟢 Good foundation

It defines:

--primary
--primary-hover
--primary-subtle
--bg-page
--bg-card
--bg-sidebar
--bg-header
--bg-input
--border
--border-focus
--text-primary
--text-secondary
--text-disabled
--skeleton-base
--skeleton-highlight
--success
--warning
--danger
--info
🔴 Actual implementation violates it

Examples:

emerald-500
emerald-600
amber-500
red-500
blue-500
purple-500
white
black

So the theme contract exists but isn't actually enforced.

35. waiter_url_config.ts

Current:

DASHBOARD
RESERVATIONS
BASE
🔴 Incomplete

Your rule says all module internal routes and external API routes should be centralized.

But actual code contains:

/auth/login
/waiter_reservations/book

etc.

There is a particularly suspicious inconsistency:

reservations/book/page.tsx

Uses:

/waiter_reservations/book

while actual folder is:

/waiter/reservations/book

That needs to be treated as a potential broken-route bug.

This is exactly the type of issue a centralized URL config would prevent.

36. ABSOLUTE IMPORT AUDIT

Found relative imports:

WaiterOrderModal.tsx
./WaiterMenuItemCard
./WaiterCartSummary
WaiterReadyQueue.tsx
../waiter_utils/waiter_orderEventService
WaiterServiceRequestsDrawer.tsx
../waiter_utils/waiter_serviceRequestService
WaiterTableActionsDrawer.tsx
./WaiterVoidRequestModal
WaiterTableGrid.tsx
./WaiterTableCard

These violate absolute-import-only.

37. CROSS-MODULE IMPORTS

Found:

@/app/auth/auth_components/AuthGuard
@/app/auth/auth_hooks/useAuth

in Waiter.

This violates the strict role-isolation objective.

The goal is that Waiter can be supplied to AI independently without dragging unrelated role context.

38. API ARCHITECTURE
🚨 Missing

No:

waiter_api/

No:

*.api.ts

No:

ApiResponse<T>

No:

query keys

No:

mutations

No:

React Query

No:

MSW handlers

This is the largest architecture gap.

39. STATE ARCHITECTURE

Current:

localStorage
   ↓
useLocalStorage
   ↓
React component/hook
   ↓
manual mutation

Desired according to your rules:

Server Component
       ↓
API
       ↓
TanStack Query
       ↓
Client component
       ↓
module-scoped UI state if necessary

Your state rule explicitly distinguishes server state from client state and says API response/loading/caching should not live in Context/Zustand.

Waiter currently doesn't have that separation.

40. ZUSTAND

waiter_features.md claims Zustand.

Actual project:

🔴 No Zustand

This is a direct documentation mismatch.

41. REACT QUERY
🔴 No TanStack Query

Therefore missing:

caching
invalidation
stale state
retry
background refetch
mutation lifecycle
query keys
server pagination
proper loading/error states
42. TESTING
🚨 Zero Waiter tests

No:

*.test.ts
*.test.tsx
*.spec.ts
*.spec.tsx

Critical missing tests:

useWaiterOrder
useWaiterTableActions
useWaiterReservations
waiter_orderEventService
waiter_serviceRequestService

Your rule requires co-located tests for custom hooks/utilities.

43. TOOLTIP AUDIT

There is no proper Tooltip architecture.

Missing for:

order IDs
KOT IDs
customer names
phone numbers
item names
long notes
service request content
reservation data
table metadata

Rule requires truncate + Tooltip for constrained dynamic content.

44. CONTEXT MENU
🔴 Completely missing

No:

onContextMenu

found.

But Waiter has ideal context-menu candidates:

Table Card
Reservations Table
Ready Queue
Order/KOT details

Design requires right-click context menu with:

Edit
Delete
Copy ID

and no View action.

45. EMPTY STATES
🔴 No dedicated Waiter empty-state architecture

Missing:

WaiterTableEmptyState.tsx
WaiterMenuEmptyState.tsx
WaiterReadyQueueEmptyState.tsx
WaiterServiceRequestsEmptyState.tsx
WaiterReservationsEmptyState.tsx
WaiterOrderEmptyState.tsx

Every list/table should have a dedicated entity-specific empty state.

46. ACCESSIBILITY

Some good work exists.

For example WaiterTableCard:

role="button"
tabIndex={0}
aria-label
onKeyDown
focus-visible

That's good.

But overall:

🔴 Missing/inconsistent
focus-visible
aria-invalid
aria-describedby
dialog focus trap
autofocus
restore focus
semantic required
status not solely color-based
44×44 touch target

The design explicitly requires these.

47. NUMBER INPUTS

Found number inputs especially in:

reservations/book/page.tsx
WaiterReservationsFormModal.tsx

They lack the complete hardened pattern:

min
onKeyDown
block -
block e
block +

The rule explicitly requires this.

48. SENSITIVE DATA MASKING

Reservation table displays:

customer phone

fully.

The rule requires masking sensitive data by default in list views.

Expected:

98****2310

There is also no dedicated:

maskSensitiveData()

architecture.

49. COPY ID

Waiter displays IDs:

order ID
KOT ID
reservation ID

but there is no universal copy-ID pattern.

Rule requires copy button for unique IDs/tracking codes.

50. MODAL/DRAWER Z-INDEX

Current Waiter has:

z-50
z-[9990]

in multiple places.

Required:

z-10 sticky
z-20 header
z-30 tooltip/dropdown
z-40 modal
z-50 toast/critical alert

Specific problematic files
WaiterServiceRequestsDrawer → z-[9990]
WaiterVoidRequestModal → z-50
WaiterTableTransferModal → z-50
WaiterTableQrModal → z-50
reservations/book payment modal → z-50
51. ICON SYSTEM

Global rule:

size=18
strokeWidth=2
Lucide only

Waiter uses many:

9
10
11
12
13
14
15
16
20
24
32
36

Some larger sizes are legitimate for empty-state/hero icons, but many small operational icons are below the standard.

Also actual UI uses emojis:

🧹
🟢
📍

The design explicitly says emojis in documentation are shorthand; implementation should use Lucide icons.

52. THEME VIOLATIONS

Major offenders:

waiter/page.tsx
bg-white/10
amber-500
WaiterTableCard.tsx
bg-emerald-600
bg-emerald-500
WaiterServiceRequestsDrawer.tsx
red-500
amber-500
emerald-500
blue-500
purple-500
reservations/book/page.tsx

Heavy:

emerald-500
amber-500
white

The theme rule explicitly prohibits hardcoded Tailwind colors for theme-dependent UI.

53. ARBITRARY TAILWIND

Waiter contains a lot of:

text-[10px]
text-[11px]
text-[12px]
text-[13px]
text-[14px]
text-[15px]
text-[17px]
text-[22px]

and other arbitrary values.

This directly violates:

No arbitrary Tailwind values.

54. FORM ARCHITECTURE
Good:
WaiterVoidRequestModal
WaiterReservationsFormModal

use:

React Hook Form
Zod
Bad:
WaiterTableTransferModal
reservations/book/page.tsx

use manual state/form handling.

Needs architectural review:
WaiterOrderModal

isn't a traditional form but KOT submission is a significant mutation workflow and should still use a proper mutation state.

55. BACKEND-DRIVEN MESSAGES

Waiter contains many frontend-owned messages:

Table Cleaned
Item marked as SERVED
All ready dishes served
No available tables
No items found
Saving
Confirm Reservation

Static UI labels are fine.

But operation success/failure messages should come from backend response.

Your rule explicitly prohibits hardcoded success/error messages in components/hooks/toasts.

56. PESSIMISTIC UI

A lot of code claims:

pessimistic

but isn't actually pessimistic.

For example:

setIsSubmitting(true)
localStorage mutation
setIsSubmitting(false)

There is no server request to await.

True pessimistic flow should be:

click
 ↓
loading
 ↓
API
 ↓
2xx
 ↓
update query/cache
 ↓
backend message

Your rules explicitly require financial/destructive mutations to update state only after successful 2xx confirmation.

57. TABLE DESIGN

Reservations table is structurally okay.

But missing:

🔴 Server-side pagination
🔴 Server-side filtering
🔴 Sorting
🔴 URL query state
🔴 Dedicated empty state
🔴 Tooltip
🔴 Mobile card-stack
🔴 Context menu
🔴 Copy ID
🔴 Masked phone

Global table rules define pagination, semantic table structure, sorting and mobile behavior.

58. MICRO-ANIMATION

Some files have:

transition-all
active:scale-95
hover

Good.

But not consistently.

Global design requires universal transition behavior and active/hover treatment.

59. MOBILE
Tables

Reservations:

overflow-x-auto

not card-stack.

Table grid

Grid itself can respond.

Drawer

Needs explicit viewport-safe/mobile behavior.

Buttons

Many operational buttons are smaller than recommended touch target.

Global mobile policy says 44×44 where practical.

60. PRINT

Waiter has no major print feature like Cashier, so this is less critical.

But if QR/order/reservation printing is added later, it should use the required:

PrintableWrapper

architecture.

61. REALTIME ARCHITECTURE

Waiter is highly realtime by nature:

READY KOT
service request
table state
order status
customer call

Current architecture is localStorage polling/reactivity.

Missing real:

Socket.IO
WebSocket
SSE

or equivalent server-state subscription.

This is a major production gap.

62. CRITICAL BUSINESS FLOW — WAITER ORDER

Current:

Waiter
 ↓
Cart
 ↓
useWaiterOrder
 ↓
localStorage
 ↓
Order/KOT created
 ↓
Table changed

Production should be:

Waiter
 ↓
KOT mutation
 ↓
Backend validation
 ↓
DB transaction
 ├── Order
 ├── KOT
 ├── Table
 ├── Audit
 └── event
 ↓
2xx response
 ↓
React Query invalidation/update
 ↓
Realtime KDS

Current architecture does not provide this.

63. CRITICAL BUSINESS FLOW — TABLE MERGE

Current:

source table
target table
source order
target order
localStorage updates
audit

There is no atomic transaction.

Potential failure scenario:

Order updated
↓
Table update fails

Then system becomes inconsistent.

This is a major backend requirement.

64. CRITICAL BUSINESS FLOW — TABLE TRANSFER

Same problem.

Needs atomic:

source table
target table
order tableNumber
audit
notifications/events

Current frontend performs independent mutations.

65. CRITICAL BUSINESS FLOW — VOID

Current:

Waiter
 ↓
requestVoid()
 ↓
localStorage status = VOID_REQUESTED
 ↓
audit log

Missing:

backend authorization
server validation
KOT status transition rules
immutable audit
manager approval event
realtime update
retry/error state
66. CRITICAL BUSINESS FLOW — RESERVATION PAYMENT

This is the most serious functional/security concern in reservation booking.

Current frontend effectively does:

generate transaction ID
↓
paymentStatus = "PAID"
↓
create reservation

That means frontend can declare payment successful.

For production this must become:

Create payment order
↓
Payment provider
↓
Provider callback/webhook
↓
Backend verifies signature/status
↓
Backend marks PAID
↓
Reservation confirmed

Frontend must never be the authority for payment success.

67. DOCUMENTATION / CODE MISMATCH SCORE
Document	Accuracy
waiter_features.md	🔴 3/10
waiter_forbidden.md	🟢 8/10 rules, 🔴 implementation compliance
waiter_theme_contract.md	🟡 6/10
waiter_url_config.ts	🟡 5/10
68. WHAT IS ACTUALLY GOOD

Waiter isn't all bad.

🟢 Strong parts

WaiterTableCard:

keyboard accessible
ARIA label
focus-visible
stable ID
clear responsibility

WaiterVoidRequestModal:

RHF
Zod
aria-describedby
validation
loading state
Escape handling

WaiterReservationsFormModal:

RHF
Zod
Escape
loading state

WaiterTableGrid:

small
focused

WaiterCartSummary:

pure-ish presentation
props-driven
stable cart keys

WaiterMenuItemCard:

focused
timer cleanup
no cart ownership

WaiterTypes:

manageable size

waiter_url_config:

at least exists

waiter_forbidden:

rules are clearly written

So foundation exists. Problem is architecture enforcement.

🔥 TOP 15 PROBLEMS TO FIX FIRST

Agar priority deni ho, main exactly ye order rakhunga:

P0 — Critical
1. Payment security
reservations/book/page.tsx

Frontend must not mark payment as PAID.

2. localStorage database architecture

Replace operational data source:

orders
tables
reservations
service requests
notifications

with backend/API.

3. KOT/order transaction
useWaiterOrder.ts
4. Table merge/transfer transaction
useWaiterTableActions.ts
5. Realtime KDS ↔ Waiter

Ready items/service requests/table state need realtime architecture.

P1 — Architecture
6.

Split:

page.tsx 534
7.

Split:

WaiterTableActionsDrawer.tsx 547
8.

Split:

reservations/book/page.tsx 517
9.

Split:

useWaiterOrder.ts 321
10.

Split:

useWaiterTableActions.ts 217
useWaiterReservations.ts 188
P2 — AI architecture
11.

Introduce:

waiter_api/
12.

Introduce:

TanStack Query
13.

Correct waiter_features.md

It must describe actual implementation, not future implementation.

14.

Split types by feature.

15.

Add co-located tests.

P3 — Design/UX

Then fix:

z-[9990]
z-50 modals
hardcoded colors
arbitrary Tailwind
small icons
emoji
Tooltip
EmptyState
ContextMenu
mobile card-stack
focus-visible
aria-invalid
aria-describedby
copy ID
phone masking

The design system explicitly defines modal layering, tooltips, accessibility, mobile tables, icon sizing and empty-state requirements.

🧠 FINAL WAITER ARCHITECTURE VERDICT

Current Waiter architecture is basically:

                    WAITER
                       │
        ┌──────────────┼───────────────┐
        ↓              ↓               ↓
      Pages       Components        Hooks
        │              │               │
        └──────────────┼───────────────┘
                       ↓
                 localStorage
                       ↓
                Fake database

Your target should be:

                     WAITER
                        │
             ┌──────────┴──────────┐
             ↓                     ↓
       Server Pages          Client Features
             │                     │
             ↓                     ↓
      Initial Server Data     UI / Interaction
             │                     │
             └──────────┬──────────┘
                        ↓
                  TanStack Query
                        ↓
                   Waiter API
                        ↓
                 Backend / DB
                        │
                 ┌──────┴──────┐
                 ↓             ↓
             Transactions   Realtime
                 │             │
                 └──────┬──────┘
                        ↓
                 Waiter + KDS
Sabse important conclusion:

Waiter me UI foundation Kitchen se thodi better hai, especially WaiterTableCard, WaiterVoidRequestModal, reservation form, etc.

Lekin architecture level par Waiter bhi production/backend-ready nahi hai.

Sabse dangerous files:
1. WaiterTableActionsDrawer.tsx    → 547
2. reservations/book/page.tsx     → 517
3. waiter/page.tsx                → 534
4. useWaiterOrder.ts              → 321
5. WaiterOrderModal.tsx           → 304
6. useWaiterTableActions.ts       → 217
7. useWaiterReservations.ts       → 188
Sabse dangerous concepts:
1. Frontend/localStorage as database
2. Frontend-authoritative payment = PAID
3. Non-transactional table/order mutations
4. No realtime architecture
5. Client page roots
6. Cross-module Auth imports
7. Documentation claiming Zustand/Server Components that don't exist

Aur ek specific potential bug jo main definitely backlog me rakhunga:

Actual route:
 /waiter/reservations/book

But booking page login redirect uses:
 /waiter_reservations/book

Ye centralized WAITER_ROUTES se automatically avoid ho sakta tha.

Is audit me maine code me koi modification nahi kiya hai.

hamne abh customer ko deep me scan kar har ak folder har file ok hamri design and rul ke hisab se hona chaiye sab miising find karo deep analyz karo jesebaki sare kiye vese hi ok 

Haan. Maine Customer module ko Kitchen aur Waiter ki tarah deep static audit kiya hai — folder structure, har file, line counts, imports, state/data flow, backend-readiness, multi-tenant isolation, security, UX, accessibility, responsive behavior, theme, naming, loading/error states, URLs, forms, payment flow, QR flow, testing aur documentation sab check kiya.

Important: Maine koi code modify nahi kiya hai. Ye sirf audit hai.

🔎 CUSTOMER MODULE — DEEP AUDIT

Current structure:

customer/
├── CustomerErrorBoundary.tsx
├── error.tsx
├── loading.tsx
├── not-found.tsx
├── page.tsx
├── profile/
│   └── page.tsx
├── hotel/
│   └── [tenantId]/
│       └── page.tsx
├── reservations/
│   ├── CustomerReservationsErrorBoundary.tsx
│   ├── page.tsx
│   ├── book/
│   │   └── page.tsx
│   ├── customer_reservations_components/
│   │   ├── CustomerReservationsFormModal.tsx
│   │   └── CustomerReservationsTable.tsx
│   ├── customer_reservations_hooks/
│   │   └── useCustomerReservations.ts
│   └── customer_reservations_types/
│       └── CustomerReservationsTypes.ts
├── customer_components/
│   ├── CustomerAdvanceBookingModal.tsx
│   ├── CustomerBillRequestModal.tsx
│   ├── CustomerCartDrawer.tsx
│   ├── CustomerFeedbackForm.tsx
│   ├── CustomerFloatingServiceButton.tsx
│   ├── CustomerMenuBrowser.tsx
│   ├── CustomerOrderStatus.tsx
│   └── CustomerQrUploadModal.tsx
├── customer_home_components/
│   └── HomeRoleAccessPanel.tsx
├── customer_hooks/
│   └── useCustomerOrder.ts
├── customer_types/
│   └── CustomerTypes.ts
├── customer_utils/
│   └── customer_serviceRequestService.ts
├── customer_features.md
├── customer_forbidden.md
├── customer_theme_contract.md
└── customer_url_config.ts

Total Customer module: ~5,559 lines.

🚨 Overall Rating
Area	Rating
Folder organization	7/10
Micro-modularization	4/10
Role isolation	3/10
Server/Client architecture	2/10
Backend readiness	2/10
Multi-tenant safety	3/10
Security	2/10
Theme compliance	4/10
Accessibility	3/10
Responsive/mobile	5/10
Form architecture	4/10
Error/loading architecture	4/10
Testing	0/10
Documentation accuracy	3/10
Overall: ~3.5/10

Customer module mein UI kaafi developed hai, lekin enterprise/backend-ready architecture abhi bahut door hai.

Sabse serious problems:

🔴 Client-side pages everywhere
🔴 Customer data/localStorage ko backend database ki jagah use kiya gaya hai
🔴 Payment ko frontend PAID bana raha hai
🔴 Customer QR flow authentication architecture ke against hai
🔴 Multi-tenant isolation fragile hai
🔴 hardcoded tenant/data/config
🔴 huge components/hooks
🔴 no API layer
🔴 no TanStack Query
🔴 no tests
🔴 hardcoded URLs
🔴 theme violations
🔴 accessibility violations
🔴 documentation actual implementation se match nahi karti

Aapke architecture rule mein page roots Server Components hone chahiye, heavy logic hooks/API layer mein hona chahiye, aur server-state ke liye TanStack Query use hona chahiye.

1. ROOT customer/ ARCHITECTURE
❌ customer/page.tsx — 219 lines
Problems
🔴 1. Page root "use client"
customer/page.tsx

Page directly client component hai.

Rule ke according page root:

Server Component
   ↓
Client leaf components

hona chahiye.

Aapke forbidden document mein bhi explicitly:

No "use client" on Page Roots.

hai.

🔴 2. Multiple components ek hi file mein

Is file mein:

ThankYouScreen
NoTableScreen
CustomerPage

teen components hain.

Rule:

One React component per file.

Violation.

Expected architecture conceptually:

customer/
├── customer_components/
│   ├── CustomerThankYouScreen.tsx
│   └── CustomerNoTableScreen.tsx
└── page.tsx
🔴 3. Auth dependency in zero-friction QR flow

Customer requirements ke according QR customer ko:

signup/login ki bilkul zarurat nahi.

Customer QR pathway specifically no-login/no-signup hai.

Lekin page.tsx:

useAuth()
router.push("/auth/login")
logout()

use kar raha hai.

Ye architecture ko unnecessary authentication dependency deta hai.

🔴 4. Hardcoded /auth/login
router.push("/auth/login")

customer_url_config.ts bana hua hai, lekin use nahi ho raha.

Forbidden rule ke according URLs centralized hone chahiye.

🔴 5. Loading spinner

Hydration ke liye:

animate-spin

full page par use hua hai.

Design system layout-matching skeleton prefer karta hai; full-page generic spinner avoid karna hai.

🟠 6. ThankYouScreen aur NoTableScreen mein UI + auth logic mix

Ye reusable micro-components hone chahiye.

🟠 7. Emoji
🙏

Design system actual Lucide icons require karta hai; emojis documentation shorthand hain, implementation nahi.

2. customer_components/

Yahan sabse zyada problems hain.

🔴 CustomerMenuBrowser.tsx — 524 lines

Ye major violation hai.

Rule:

React component <= 300 lines

Current:

524 lines

Also file mein:

MenuItemCardBox
CustomerMenuBrowser

do components hain.

Problems
524 lines
2 components
filtering logic inside component
dietary classification logic inside component
pagination logic inside component
category derivation inside component
cart calculations inside component
auth/logout inside menu UI
hardcoded dietary data
hardcoded preparation time 15-20m
hardcoded dietary keywords
raw colors
tiny icons
no Tooltip
no dedicated empty state
no backend search
no backend pagination
no debounced server query
no API layer
Hardcoded data
NON_VEG_KEYWORDS
JAIN_SAFE_KEYWORDS
DIETARY_TABS
ITEMS_PER_PAGE = 8
15-20m

Rule ke according backend-replaceable UI data/constants centralized honi chahiye.

🔴 Theme violations

Examples:

emerald-500
red-500
amber-500
bg-white
text-white

Design explicitly hardcoded Tailwind colors prohibit karta hai.

🔴 Accessibility

No explicit:

focus-visible

Menu ke buttons ko explicit keyboard focus styling chahiye.

Design rule:

all interactive elements must explicitly define focus-visible state.

🔴 Touch target

Quantity buttons:

h-7 w-7

~28×28.

Rule:

44×44 minimum where practical

🔴 Dynamic text

Dish names/category/variants dynamic hain.

Kuch jagah truncate/line-clamp hai, lekin proper Tooltip implementation nahi hai.

Rule says truncated dynamic text should have Tooltip.

🔴 CustomerOrderStatus.tsx — 406 lines

Maximum 300 ke against:

406
Responsibilities bahut zyada:
auth
menu storage
menu lookup
order transformation
bill calculation
tax calculation
status derivation
service requests
bill modal
UI
status badge styling

Ye ek component ke liye bahut zyada hai.

🔴 Business calculation UI file mein
CGST = subtotal * 0.025
SGST = subtotal * 0.025

Customer UI ko tax calculate nahi karna chahiye.

Backend authoritative amount/tax return kare.

Especially financial data ke liye.

🔴 Hardcoded tax
2.5%
2.5%

Central config/backend se aana chahiye.

🔴 Hardcoded prep time
15–20 Mins

Actual KDS/backend estimate hona chahiye.

🔴 Status-to-color mapping inline
READY → emerald
SERVED → primary
else → amber

Global rule says status mapping central constants file mein hona chahiye, individual component mein nahi.

🔴 Wrong source of truth

Menu:

useLocalStorage()

Order:

prop

Tax:

frontend calculation

Ye consistent backend response model nahi hai.

🔴 Order ID copy missing

Display:

Order ID: #XXXXXX

Lekin copy button nahi.

Global rule unique IDs ke liye copy-to-clipboard pattern demand karta hai.

🔴 Index key
key={`${item.itemId}-${idx}`}

Index-based key avoid karna chahiye jab stable identity available ho.

🔴 Service request side effect component mein
createServiceRequest()

directly UI component se call ho raha hai.

Expected:

Component
 ↓
Hook
 ↓
API
 ↓
Query invalidation
🔴 CustomerQrUploadModal.tsx — 427 lines

Huge component.

Responsibilities:

upload
drag/drop
image preview
QR decoding
table lookup
URL parsing
quick select
scanner simulation
routing
localStorage
UI tabs
Violations
427 lines
multiple responsibilities
QR parser logic in UI
localStorage operational data
direct window
direct URL manipulation
no focus trap
no explicit focus-visible
no Tooltip
no dedicated error state component
raw colors
arbitrary shadow color
animate-bounce
animate-spin
z-index violations
🔴 z-index
z-[9990]

Actually this file has modal-style architecture.

Global scale:

z-10 sticky
z-20 header
z-30 dropdown/tooltip
z-40 modal
z-50 toast

So 9990 is directly against rule.

🔴 Raw image <img>

Use of:

<img>

instead of Next image architecture.

Not necessarily functional bug, but enterprise Next architecture mein review-worthy.

🟠 QR filename parsing is brittle
QR-Table-T-01.png

filename se table identify karna fallback ho sakta hai, authoritative identity nahi.

Actual QR payload/backend table identity authoritative honi chahiye.

🔴 Security

QR payload se:

table
tenant

frontend trust kar raha hai.

Backend should validate:

tenantId
tableId
QR token/signature

Otherwise customer URL manipulate kar sakta hai.

🔴 CustomerAdvanceBookingModal.tsx — 331 lines
Problems
331 lines
inline props interface
inline SelectedPreOrderItem
direct window.localStorage
direct JSON.parse/stringify
frontend reservation creation
frontend generated reservation ID
frontend generated booking code
no RHF
no Zod
no API
no server validation
no availability transaction
no focus trap
z-50
no focus-visible
no Tooltip
hardcoded default time 19:00
Security
Math.random()

for booking code.

Booking/reference codes should be backend-generated.

🔴 Direct localStorage

This violates even its own Customer forbidden rule:

No Direct localStorage.

🔴 Financial/business mutation in UI

Reservation directly saved in browser.

Enterprise architecture mein impossible to trust.

🟠 CustomerBillRequestModal.tsx — 269 lines

Better size-wise, but architecture weak.

Problems
localStorage CRM customer data
localStorage order mutation
localStorage phone storage
direct speech API
service request mutation
business logic in component
relative import
hardcoded loyalty offer 10%
raw emerald/amber colors
z-50
no focus trap
no focus-visible
no aria-describedby
no aria-invalid
🔴 Sensitive phone storage
table_phone_XX

browser localStorage mein customer phone persist ho raha hai.

Phone customer-sensitive data hai.

🔴 Loyalty message mismatch

Customer requirement/documentation mein billing loyalty cashback 5% described hai, while this UI says:

10% Instant Loyalty Cashback

This is a product-rule inconsistency that should be resolved centrally.

🟢 CustomerCartDrawer.tsx — 205 lines

Ye comparatively better file hai.

Good:

focused responsibility
drawer component
async submit state
cart calculations simple
Escape handling present
aria-modal
close action

But:

Problems
quantity buttons 28×28
no focus-visible explicit
no focus trap
z-50 drawer conflicts with strict modal/toast scale
arbitrary max-h-[85vh]
animation not motion-safe
animate-spin not motion-safe
no dedicated EmptyState component
hardcoded ₹ display rather than centralized formatter
notes field lacks proper label
no Tooltip for long item names
🟠 CustomerFeedbackForm.tsx — 177 lines

Size okay.

Good:

constants
rating limits
comment max
loading state
focused responsibility

Problems:

imports auth module
logout/auth inside feedback UI
no Zod/RHF despite being a form
no backend API
no error state
feedback persisted by parent/local state architecture
no explicit focus-visible
star buttons need better accessible semantics
status/loading icon animation not motion-safe
hardcoded route /auth/login
🔴 CustomerFloatingServiceButton.tsx — 153 lines

Size okay.

But:

🔴 z-index
z-[9990]

Major violation.

🔴 Raw colors
blue-500
emerald-500
amber-500
purple-500
🔴 Motion
animate-bounce
animate-in
transition-all

without proper motion-safe strategy.

Your motion rule requires motion-safe guarding.

🔴 Modal accessibility

No focus trap.

🔴 No explicit label

Custom message input has placeholder but no programmatically associated label.

🔴 Service mutation directly in component

Should be hook/API mutation.

3. customer_hooks/

Only:

useCustomerOrder.ts
🔴 useCustomerOrder.ts — 356 lines

This is one of the biggest architectural problems.

Rule:

Hook max 150 lines

Current:

356

More than 2× limit.

It currently handles:
tenant detection
URL parsing
localStorage
menu state
orders
tables
feedback
cart
order lifecycle
KOT creation
station routing
order status
polling
table occupancy
feedback creation
IDs
navigation state

This should be split into multiple feature hooks/services.

🔴 Direct localStorage outside hook

There is even:

window.localStorage.setItem("active_tenant_id", ...)

at module level.

This is worse because it's executed outside React lifecycle.

🔴 Tenant switching side effect at module evaluation
if (typeof window !== "undefined") {
   ...
   window.localStorage.setItem(...)
}

This is a dangerous architectural pattern.

🔴 Client-generated order IDs
cust-ord
cust-kot
fb

using:

Date.now()
Math.random()

Backend should generate authoritative IDs.

🔴 Customer creates KOT

Customer frontend constructs:

KOT
station
status=PENDING
timestamp

This is a serious backend authority problem.

Customer should submit:

order DTO

Backend should create:

order
KOTs
station routing
timestamps
IDs
initial statuses
🔴 Customer directly changes table status
OCCUPIED
currentOrderId

Customer browser should never be authoritative for table occupancy.

🔴 Polling isn't real polling

It polls the local orders array every 3 seconds.

Actual network request nahi hai.

So comment:

Live status polling

is misleading.

Actual architecture needs:

TanStack Query refetch

or:

Socket.IO/SSE

for realtime.

🔴 No Query infrastructure

Project package mein:

@tanstack/react-query

hi nahi hai.

Server-state rules require TanStack Query for API responses, loading, errors, pagination, caching and mutations.

4. customer_utils/
🔴 customer_serviceRequestService.ts — 167 lines

Utility limit:

120

Current:

167
Problems
direct localStorage
JSON parsing
ID generation
notification dispatch
Cashier notification
Waiter notification
table mutation
business rules
error handling
console.error
relative responsibility mixing

This is not really a clean "service" layer.

It is simultaneously:

repository
business service
notification service
table mutation service
🔴 API architecture absent

Expected:

customer_serviceRequest.api.ts

with predictable functions:

fetchServiceRequests()
createServiceRequest()
updateServiceRequest()

The API naming contract explicitly requires verb-based naming.

🔴 Hardcoded role
role: "WAITER"
role: "CASHIER"

Notification routing should be backend/business configuration.

🔴 Hardcoded route
/waiter
/billing

Customer URL config doesn't contain these.

🔴 Returns raw error
message: String(err)

Never expose raw technical errors to user.

Rule says backend error message should be shown safely; raw API error objects should not be shown.

5. customer_types/
🟢 CustomerTypes.ts — 89 lines

Size okay.

But:

🟠 Imports global business types
@/types/appTypes

This weakens strict Customer isolation.

Your architecture explicitly wants role-specific domain types isolated.

🟠 Component props + domain types + hook return types mixed

Better separation:

customer_types/
├── CustomerOrderTypes.ts
├── CustomerMenuTypes.ts
├── CustomerCartTypes.ts
├── CustomerFeedbackTypes.ts
└── CustomerServiceRequestTypes.ts

Not mandatory if small, but much better for AI isolation.

6. customer_home_components/
🔴 HomeRoleAccessPanel.tsx — 148 lines

This file has a major security issue.

It contains:

superadmin@smartpos.com
superadmin123
customer
customer123

Credentials inside frontend source.

Even demo credentials should not be mixed into Customer production module.

🔴 Wrong responsibility

This component isn't really Customer business functionality.

It handles:

SUPER_ADMIN
CUSTOMER

role login cards.

And imports:

useAuth

This should belong to public/demo/auth area, not Customer module.

🔴 Cross-role business

Customer module contains Super Admin login information.

This directly defeats your AI role isolation goal.

🔴 Inline interface
RoleCardInfo

should be in types.

🔴 Hardcoded routes
/super-admin/dashboard
/manager/dashboard
/admin/dashboard
/billing
/waiter
/kitchen
/customer

Customer module should not know all role routes.

This is a huge isolation violation.

7. reservations/
🔴 reservations/page.tsx — 181 lines
Problems
"use client" page root
AuthGuard from /auth
inline CustomerReservationsPageHeader
inline props interface
page UI contains logic
active tab local state
no URL query state
no backend query
localStorage-backed hook
hardcoded text
no dedicated empty state
no permission state
no error state
🔴 Incorrect AuthGuard roles
["ADMIN", "WAITER", "CUSTOMER"]

inside Customer module.

Customer reservations page should not become a shared Admin/Waiter business route merely because it sits under /customer.

This is a role-isolation smell.

🔴 useCustomerReservations.ts — 188 lines

Limit:

150

Actual:

188
Problems
localStorage
client-generated IDs
client-side reservation mutation
table status mutation
client filtering
client sorting
fake submitting state
no API
no Query
no backend validation
no transaction
🔴 Critical reservation race condition

Flow:

Customer A
  ↓
checks table AVAILABLE

Customer B
  ↓
checks table AVAILABLE

A reserves
B reserves

No backend transaction/locking.

Real reservation system must have backend authoritative availability.

🔴 Time bug

Date.now() is calculated during render, but useMemo only depends on reservations.

So a reservation can cross from:

UPCOMING

to:

PAST

while page remains mounted without reservation data changing.

🟠 CustomerReservationsTypes.ts — 48 lines

Size okay.

But global:

AppReservation
AppTable

imports weaken isolation.

🟢 CustomerReservationsFormModal.tsx — 230 lines

This is one of better Customer files.

Good:

React Hook Form
Zod
resolver
reset
Escape
validation
loading button
semantic form

This matches your form architecture direction.

But still:

Missing
focus trap
autofocus
focus restore
explicit focus-visible
aria-invalid
aria-describedby
separate schema file
separate form hook
backend mutation
API layer
backend error message handling
async response handling

Your form structure rule actually expects:

FeatureForm/
  FeatureForm.tsx
  useFeatureForm.ts
  feature.form.schema.ts
  FeatureForm.test.tsx

Current architecture does not reach that level.

🟠 CustomerReservationsTable.tsx — 256 lines

Good:

semantic table
pagination
filtering
stable reservation ID
status mapping exists

But:

🔴 Client-side pagination
slice()

Backend-ready architecture requires server-side pagination/filtering/sorting.

🔴 Search not debounced

No proper:

300ms debounce

for backend query.

🔴 Phone exposed
{res.phone}

Customer-sensitive phone data should be masked where applicable.

Design explicitly gives phone masking examples.

🔴 No Tooltip

Dynamic:

customer name
phone
table
reservation ID

but no Tooltip architecture.

🔴 No Copy ID

Reservation ID should have copy action.

🔴 No context menu

No:

onContextMenu

Global table rule requires context menu with:

Edit
Delete
Copy ID

and no View.

🔴 Mobile table strategy missing

Current:

overflow-x-auto

Mobile rule says:

<768px
table → card stack

not simply horizontal scroll.

🔴 Cancellation confirmation pattern wrong

Inline confirmation row use hua hai.

Global design says destructive actions need confirmation dialog.

8. reservations/book/page.tsx
🚨 MOST CRITICAL CUSTOMER FILE

Current:

517 lines

Limit:

300

and page root is Client Component.

This file is a huge monolith.

🔴 Critical payment security flaw

This code does:

paymentStatus: "PAID"

from frontend.

And generates:

TXN_RES_${Date.now()}

before any actual payment provider verification.

Meaning frontend effectively decides:

payment = successful

This is not acceptable for production.

Backend must verify:

payment provider
payment order
payment signature/webhook
amount
currency
tenant
reservation

and only then set:

PAID
🔴 Hardcoded date
2026-08-16
🔴 Hardcoded time
19:30
🔴 Hardcoded deposit
₹100/person

Should be backend/tenant configuration.

🔴 Hardcoded tenant fallback
tenant-royal-spice-01

This is dangerous in multi-tenant architecture.

🔴 Wrong route in login redirect

The actual folder:

/customer/reservations/book

but redirect contains:

/customer_reservations/book

This is a route inconsistency/bug.

Central route config would prevent it.

🔴 Wrong architecture for forms

Complex booking/payment form uses:

useState

instead of:

React Hook Form
Zod
form hook
API mutation
🔴 Reservation ID generated from response but backend still local
reservationId

is just local state after local service result.

🔴 Pre-order mutation is frontend-only

Customer selects dishes, but backend needs to own:

reservation
preOrder
menu snapshot
price snapshot
availability
tenant
payment relationship
🔴 Huge responsibilities

One file handles:

tenant lookup
auth
profile prefill
booking form
deposit calculation
payment
reservation creation
pre-order cart
stepper
confirmation
UI

Definitely needs feature decomposition.

9. profile/page.tsx — 174 lines

Size okay, but architecture weak.

🔴 Client page root

Again "use client".

🔴 Cross-module AuthGuard
@app/auth/...
🔴 Local data
getStoredAdvanceReservations()

Customer profile should query backend.

🔴 Filtering by phone
r.customerPhone === currentUser.phone

This is frontend authorization logic.

Backend should return only current customer's reservations.

Otherwise client receives potentially all reservations and filters locally.

🔴 Tenant lookup per reservation
getTenantById()

client-side.

🔴 Status mapping inline
CONFIRMED → emerald
COMPLETED → blue
CANCELLED → red

should use centralized status config.

🔴 Phone/profile security

Current architecture uses phone as identity filter.

Phone is not a secure authorization boundary.

🟠 No copy reservation ID

Again missing.

10. hotel/[tenantId]/page.tsx
🔴 231 lines
Biggest issue:

Page root is Client Component.

This should be a public Server Component if possible.

🔴 localStorage menu
useLocalStorage(STORAGE_KEYS.MENU)

Restaurant menu is server/business data.

It should come from:

tenantId → API → Query

not browser storage.

🔴 Multi-tenant menu risk

Menu is not explicitly fetched by:

tenantId

This can result in one restaurant's menu appearing under another restaurant page.

This is a major SaaS data-isolation concern.

🔴 Hardcoded fallback image URL
https://images.unsplash.com/...

Business UI fallback asset should be centralized.

🔴 Wrong booking route

Button:

/reservations/book?tenant=...

Actual customer route:

/customer/reservations/book

Again route config problem.

🔴 <img>

Featured/gallery images use raw <img>.

🔴 Arbitrary sizes

Examples:

h-[50vh]
min-h-[400px]
aspect-[4/3]
sm:w-[320px]

Your forbidden rule explicitly discourages arbitrary bracket utilities.

🔴 Raw shadow colors
shadow-[...rgba(...)]

violates theme independence.

🔴 Animation

Many:

animate-in
duration-700
hover:-translate-y-1
duration-500

without motion-safe guard.

🔴 Icon sizes

Uses 22px/24px etc., while global icon rule targets 18px.

11. Error boundaries
CustomerErrorBoundary.tsx

Exists — good.

But:

🔴 console.error

Production logging rule violated.

🔴 Raw error message shown
error.message

Potential technical information exposure.

🔴 raw red colors
bg-red-500
text-red-500
🔴 no approved logger metadata

Should capture safe metadata such as:

module
route
request ID
timestamp
user/session identifier where appropriate

Same problems in:

CustomerReservationsErrorBoundary.tsx
12. error.tsx

Exists — good.

But:

generic error UI
no module-specific recovery UX
console logging
raw-ish error handling
no monitoring abstraction
13. loading.tsx

Current:

animate-pulse
Loader2 animate-spin

Problems:

generic spinner
not route-specific skeleton
not motion-safe
skeleton should resemble actual Customer page structure

Global async UI rule requires layout-matching skeletons.

14. not-found.tsx

Basic implementation exists.

But:

Missing
Customer-specific messaging
centralized route
stronger navigation context
theme contract consistency
explicit focus styling
15. customer_url_config.ts

Current:

QR
RESERVATIONS

only.

This is insufficient.

Customer actually uses:

/customer
/customer/reservations
/customer/reservations/book
/auth/login
/
/reservations/book
/waiter
/billing

etc.

So central URL config is incomplete and effectively unused.

16. customer_features.md
🔴 Documentation is inaccurate

It claims:

localized Zustand stores

but project has:

NO ZUSTAND

It claims:

page.tsx Server Component

but actual major pages are Client Components.

It claims:

No hardcoded data deeply inside UI

but actual code contains:

Royal Spice Bistro
100/person
2026-08-16
19:30
15-20m
dietary keywords
10% cashback
tenant-royal-spice-01
routes
payment labels

This is dangerous for AI-generated development.

AI will read the documentation and assume architecture exists when it doesn't.

17. customer_forbidden.md

Rules themselves are good.

But implementation violates almost every major one:

Forbidden Rule	Actual
No cross-module	❌ auth imports
No magic colors	❌ many
No client page roots	❌ almost all
No UI logic	❌ heavy logic
No inline types	❌ multiple
No shared business	⚠️ HomeRoleAccess
No hardcoded URLs	❌
No direct localStorage	❌
No any	Customer itself mostly okay
No console	❌

So this file currently describes desired architecture, not actual architecture.

18. customer_theme_contract.md

Contract exists — good.

But actual implementation heavily violates it.

The contract says:

Never use hardcoded Tailwind color strings.

Yet Customer has:

emerald-500
emerald-600
red-500
amber-500
blue-500
purple-500
black
white

etc.

19. Global theme infrastructure problem

globals.css itself currently uses Tailwind v4 @theme.

But your architecture documentation expects:

globals.css
+
tailwind.config.ts

and maps semantic tokens through Tailwind config.

Current project has no tailwind.config.ts.

This isn't necessarily a Tailwind-v4 functionality failure, but it is a documentation/architecture mismatch.

More importantly required elevation tokens:

--bg-floating
--bg-overlay
--bg-popover

are missing.

The design system explicitly requires those for inputs, modals, drawers, dropdowns and tooltips.

20. Global font mismatch

Design says:

Inter
next/font/google

But globals.css currently uses:

system-ui

and body:

var(--font-inter), system-ui

while root layout doesn't actually load Inter through next/font/google.

So typography requirement is not properly implemented.

21. Reduced-motion architecture missing

Global CSS has:

@keyframes skeleton-shimmer
animation: skeleton-shimmer

but no proper:

@media (prefers-reduced-motion: reduce)

override.

Customer additionally has many:

animate-spin
animate-bounce
animate-pulse
animate-in
transition-all
hover:-translate

Design specifically requires motion-safe handling.

22. Accessibility — GLOBAL CUSTOMER STATUS

Customer has almost no explicit:

focus-visible
aria-invalid
aria-describedby

Search showed essentially zero meaningful implementation.

This is a major gap.

Rule requires:

focus-visible
keyboard navigation
focus trap
autofocus
focus restore
aria-invalid
aria-describedby
44×44 touch target

23. Modal architecture

Customer modals:

CustomerAdvanceBookingModal
CustomerBillRequestModal
CustomerQrUploadModal
CustomerCartDrawer
payment modal in booking page

Most lack:

focus trap
autofocus
focus restoration
proper labelledby/describedby

Some have aria-modal, which is good, but that's only one part of accessible dialog behavior.

24. Context menu

Customer:

onContextMenu

search = none.

So:

CustomerReservationsTable

doesn't support required right-click actions.

25. Tooltip system

Customer:

Tooltip

search = none.

This is a global missing feature.

26. Copy ID system

Only booking confirmation has:

navigator.clipboard

But normal IDs:

Order ID
Reservation ID
Request ID
Transaction ID

do not consistently support copy.

27. PrintableWrapper

Customer:

PrintableWrapper

= missing.

Customer doesn't directly print bills, but reservation/payment confirmation/booking receipts may eventually need printable artifacts.

More importantly the global architecture has a reusable print requirement.

28. Testing
🚨 ZERO CUSTOMER TEST FILES

No:

*.test.ts
*.test.tsx
*.spec.ts

inside Customer.

No:

Vitest
Testing Library
Playwright
MSW

in package dependencies either.

This means:

useCustomerOrder
useCustomerReservations
customer_serviceRequestService
QR decoder
booking payment flow
reservation cancellation
cart
feedback

have no automated regression protection.

Your architecture explicitly says a bug fix should include regression coverage where reasonably testable.

29. API Layer
🚨 Completely missing

Customer has:

customer_utils/

but no:

customer_api/

or:

customer_services/

with actual HTTP methods.

Expected eventually:

customer/
├── customer_api/
│   ├── customerMenu.api.ts
│   ├── customerOrder.api.ts
│   ├── customerReservation.api.ts
│   ├── customerServiceRequest.api.ts
│   ├── customerFeedback.api.ts
│   └── customerPayment.api.ts

with predictable verbs.

30. TanStack Query
🚨 Missing completely

No:

@tanstack/react-query

dependency.

Therefore missing:

query keys
cache
pagination
refetch
mutation
invalidation
server loading
server error
background refetch

This is one of the biggest architecture gaps.

31. Zustand

Docs claim Zustand exists.

Actual project:

NO zustand

For Customer specifically this is actually less serious than Query because server state should be Query anyway.

But documentation must be corrected.

32. Backend response envelope

No Customer API exists, so there is no consistent usage of:

{
  success,
  message,
  data,
  meta,
  error,
  statusCode
}

This means Customer currently has no standardized backend response contract.

33. Server-state source of truth

Customer currently has:

localStorage
props
useState
frontend calculations
frontend generated IDs
frontend status changes

instead of:

Backend
 ↓
API
 ↓
TanStack Query
 ↓
Customer UI

This is the biggest architecture transformation required.

34. Multi-tenant isolation

This needs special attention.

Customer QR URL:

/customer?table=T-01&tenant=tenant-1

is correct conceptually according to the SaaS requirement.

But implementation then stores:

active_tenant_id

globally in localStorage.

Problems:

🔴 Global browser tenant state

One browser tab/customer can change active tenant context.

🔴 Customer menu reads generic storage key

Tenant scoping isn't explicitly visible at every business operation.

🔴 Booking fallback hardcodes one tenant
tenant-royal-spice-01
🔴 Hotel menu isn't tenant-aware enough
🔴 Customer order lookup matches table, not robust tenant + table scope

This can create cross-restaurant collisions.

Expected business key:

tenantId + tableId

not only:

tableNumber
35. Customer QR requirement mismatch

The official project requirement says:

Walk-in QR Customer
↓
NO signup
NO login
↓
menu
↓
order
↓
status
↓
service request
↓
bill request

Current implementation unnecessarily has:

useAuth()
logout
login route
Auth dependency

through multiple Customer components.

So the QR pathway should be treated as a separate guest session architecture, not normal authenticated Customer account architecture.

36. Advance booking requirement

The documentation requires:

Customer account
↓
date/time/guest count
↓
profile prefill
↓
deposit
↓
payment provider
↓
successful payment
↓
pre-order

and explicitly says profile data should be saved for future booking.

Current implementation has the UI flow, but:

payment verification ❌
backend reservation ❌
profile persistence backend ❌
tenant-specific availability ❌
server-side pricing ❌
pre-order backend ❌

So UX flow exists, enterprise implementation doesn't.

37. Financial authority

Customer currently calculates:

subtotal
CGST
SGST
deposit

and even decides:

paymentStatus = PAID

This is the most important business architecture issue.

Correct authority:

Customer UI
    ↓
Create payment order
    ↓
Payment provider
    ↓
Webhook / signature verification
    ↓
Backend
    ↓
reservation = PAID

Never:

button click
 ↓
PAID
38. Notification architecture

Customer service request currently directly dispatches:

WAITER notification
CASHIER notification

from browser.

This is not secure/reliable.

Correct:

Customer
 ↓
POST /service-requests
 ↓
Backend
 ↓
DB transaction
 ↓
Realtime event
 ↓
Waiter/Cashier
39. Realtime

Customer comments say:

live
polling

but actual source is localStorage.

There is no:

Socket.IO
SSE
WebSocket
TanStack refetch

for Customer.

So "live order tracking" is currently only simulated browser state synchronization.

40. Hardcoded data inventory

Customer contains hardcoded:

Royal Spice Bistro
₹100/person
2026-08-16
19:30
15–20m
10% cashback
dietary keywords
Kitchen
Bar
Bakery
ADV-
cust-kot
cust-ord
CGST 2.5%
SGST 2.5%
tenant-royal-spice-01
/auth/login
/reservations/book
/waiter
/billing

Some constants are legitimate UI constants, but business/config values should move to appropriate config/backend.

41. Naming architecture

Good:

CustomerMenuBrowser
CustomerOrderStatus
CustomerCartDrawer
CustomerQrUploadModal
CustomerFeedbackForm

This follows descriptive naming fairly well.

But violations:

HomeRoleAccessPanel
CustomerTypes.ts
customer_serviceRequestService.ts

The HomeRoleAccessPanel particularly breaks Customer module semantics because it is actually a cross-role demo access component.

42. Folder architecture missing feature subfolders

Current:

customer_components/
   8 large components

But your architecture goal is micro-feature isolation.

For Customer, better conceptual target:

customer/
├── customer_features/
│   ├── menu/
│   ├── cart/
│   ├── order/
│   ├── service-request/
│   ├── feedback/
│   ├── qr-session/
│   └── advance-booking/

Not necessarily this exact naming, but the important point is feature-level isolation, not one giant component folder.

Your rules explicitly say extracted files should remain inside cohesive feature folders rather than generic dumping folders.

43. Customer-specific missing folders

For the target enterprise architecture, these are currently missing:

customer_api/
customer_constants/
customer_schemas/
customer_query/
customer_hooks/
customer_features/
customer_stores/        (only if client shared state actually needs it)
customer_empty_states/
customer_permissions/
customer_components/    (existing, but needs feature subdivision)

And likely:

customer_repositories/

if your architecture uses repository abstraction.

44. Missing permission architecture

There is no Customer-specific:

useCustomerPermissions

or permission map.

For a public QR guest flow, permission model should be different from authenticated Customer account.

Need distinguish:

CUSTOMER_AUTHENTICATED
CUSTOMER_GUEST_QR

rather than treating all Customer behavior as one session model.

45. Missing session architecture

This is important.

Customer actually has two completely different identities:

Path A
Guest QR session

No account.

Path B
Authenticated Customer

for advance booking/profile.

Current architecture mixes them.

They should have separate session boundaries.

46. Empty states

Customer has inline empty states.

But no dedicated:

CustomerEmptyState
CustomerMenuEmptyState
CustomerCartEmptyState
CustomerReservationEmptyState
CustomerOrderEmptyState

Global rule requires contextual empty states with useful CTA.

47. Error states

Most components don't have feature-level:

loading
empty
error
permission denied
offline

Global async system requires all these states for data-driven features.

48. Offline state

No Customer offline/connection indicator.

This matters because:

QR order
service request
payment
live order status

are network-dependent workflows.

49. Mobile

Some Customer UI is actually mobile-friendly.

Good:

grid-cols-1
sm:grid-cols-2
responsive buttons
bottom drawer

But missing enterprise requirement:

reservation table → card stack <768

Current is horizontal scroll.

Also many buttons:

28px
32px
36px

below recommended touch size.

50. Animation

Customer has extensive animation, but architecture isn't motion-safe.

Examples:

animate-bounce
animate-pulse
animate-spin
animate-in
duration-700
duration-500
hover:-translate-y-1
transition-all

Design requires reduced-motion handling and defined duration tokens.

51. Design-system color violations summary

Customer frequently uses:

emerald-500
emerald-600
red-500
amber-500
blue-500
purple-500
black
white

Instead of semantic:

primary
success
warning
danger
info
text-primary
text-secondary
bg-card
bg-page
bg-input

This makes light/dark theme portability poor.

52. Icon system violations

Design:

18px
strokeWidth=2
Lucide

Customer frequently uses:

9
10
12
13
14
15
16
20
22
24
28
36
40
48

Some may be visually appropriate, but they violate the strict universal icon-size rule.

Also emojis are used directly in UI:

💧
🧾
🛎️
🧹
🙏
🟢
🔴

Design says actual Lucide icons should be used.

53. Status system

No central Customer status config.

Current status styles appear inline in:

CustomerOrderStatus
CustomerReservationsTable
profile/page

This violates the centralized status-to-color mapping requirement.

54. Currency

Some places use:

₹{value}

instead of:

formatCurrency(value)

CustomerOrderStatus does use formatter in some places, which is good.

But it isn't consistently centralized.

55. Logging

Found:

console.error

in:

CustomerErrorBoundary
CustomerReservationsErrorBoundary
customer_serviceRequestService
error.tsx

No approved logger.

56. Hardcoded error messages

There are many frontend-authored messages like:

Request already pending
Booking Confirmed
Could not auto-detect table
Restaurant Not Found

Some UI copy is fine, but operation result/error messages should generally come from backend where business-operation outcomes are involved.

Rule explicitly says backend message should be shown for server-level operation messages.

57. Duplicate business concepts

Customer has two reservation systems:

CustomerAdvanceBookingModal

and:

reservations/book/page.tsx

This is a major architecture smell.

One appears legacy/dead/unreferenced.

CustomerAdvanceBookingModal.tsx does not appear to be used by the actual Customer page.

So you effectively have two booking implementations.

That creates huge AI confusion.

58. Dead/legacy code risk

CustomerAdvanceBookingModal.tsx appears unused in the active Customer flow.

This should be resolved before further AI work because an AI could inspect it and think it is the canonical booking implementation.

59. Route duplication/confusion

You currently have:

/customer/reservations/book

but code references:

/customer_reservations/book

and:

/reservations/book

This is exactly why customer_url_config.ts needs to become authoritative.

60. Biggest AI-friendly architecture problem

Your goal is:

AI ko ek exact file do aur wo sirf us functionality ko safely modify kare.

Current Customer architecture doesn't guarantee that.

Example:

To modify "Customer order":

AI currently needs to understand:

page.tsx
useCustomerOrder.ts
CustomerMenuBrowser.tsx
CustomerCartDrawer.tsx
CustomerOrderStatus.tsx
CustomerTypes.ts
localStorageSeeder
useLocalStorage
appTypes
notificationService
auth

That's exactly what your AI-isolation architecture was supposed to prevent.

🚨 FINAL PRIORITY LIST
P0 — Fix before calling Customer "enterprise-ready"
🔴 P0-1

reservations/book/page.tsx

Payment security / frontend PAID

🔴 P0-2

useCustomerOrder.ts

Customer can create orders/KOT/table state entirely client-side

🔴 P0-3

customer_serviceRequestService.ts

Service/Bill requests are browser-local and notification side effects happen client-side

🔴 P0-4

Multi-tenant isolation

tenantId + tableId

must be authoritative everywhere.

🔴 P0-5

Remove frontend credentials from:

customer_home_components/HomeRoleAccessPanel.tsx

Especially Super Admin credentials.

🔴 P0-6

Separate:

Guest QR Customer

from:

Authenticated Customer
P1 — Architecture
Customer page roots → Server
API → Customer API layer
Server state → TanStack Query
Forms → RHF + Zod + form hooks
Business logic → feature hooks/services
Types → feature-specific types
Constants → customer constants
Routes → customer URL config
Status → central status config
P2 — Micro-modularization

Must split:

CustomerMenuBrowser.tsx          524
reservations/book/page.tsx       517
CustomerOrderStatus.tsx         406
useCustomerOrder.ts              356
CustomerAdvanceBookingModal.tsx  331
CustomerQrUploadModal.tsx       427

These are the biggest AI-context problems.

P3 — Design system

Fix globally:

raw colors
raw shadows
z-[9990]
z-50 modal
tiny icons
emoji
arbitrary sizes
motion-safe
Tooltip
focus-visible
44×44 buttons
P4 — Data UX

Add:

loading
empty
error
permission denied
offline
mobile card-stack
server pagination
server filtering
debounced search
copy IDs
context menu
masked phone
P5 — Quality

Add:

Customer unit tests
Customer component tests
API mock tests
booking/payment regression tests
order regression tests
reservation regression tests
QR parsing tests
service request tests
🧠 Most important conclusion

Customer ka visual/UI layer Kitchen aur Waiter se kuch jagah better organized hai, especially:

descriptive naming
dedicated Customer folders
reservation form using RHF/Zod
cart drawer
QR flow
customer-specific types
theme contract
feature documentation

Lekin backend/enterprise architecture ke level par Customer sabse risky modules mein se ek hai, because customer browser currently business authority ban raha hai.

Sabse dangerous flow:

Customer Browser
      ↓
localStorage
      ↓
Order / KOT / Table Status / Reservation
      ↓
"PAID"
      ↓
Notifications

Enterprise architecture mein ye hona chahiye:

Customer Browser
      ↓
Customer API
      ↓
Backend Authorization
      ↓
Tenant Validation
      ↓
Database Transaction
      ↓
Payment Verification
      ↓
Order / Reservation / Service Request
      ↓
Realtime Events
      ↓
TanStack Query / Socket
      ↓
Customer UI

Aur Customer ke do separate pathways rehne chahiye:

PATH A — Guest QR
QR → Guest Session → Menu → Order → Status → Service → Bill

PATH B — Account Customer
Login → Profile → Restaurant → Reservation → Payment → Pre-order

Ye separation project ke original SaaS/customer requirements ke saath bhi align karta hai.

Is audit mein maine code change nahi kiya hai. Aapke current Customer module mein sabse pehle P0 security/data-authority issues ko treat karna chahiye; uske baad micro-modularization aur design cleanup karna safest order hoga.