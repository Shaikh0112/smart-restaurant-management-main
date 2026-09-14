// RESPONSIBILITY: cashier_url_config module logic and UI.
export const CASHIER_ROUTES = {
  HOME: "/cashier",
  BILLING: "/cashier",
  REPORTS: "/cashier/reports",
  SHIFT: "/cashier/shift",
} as const;

export const cashierUrlBuilder = {
  billing: (tableId?: string) => {
    if (tableId) {
      const params = new URLSearchParams({ table: tableId });
      return `${CASHIER_ROUTES.BILLING}?${params.toString()}`;
    }
    return CASHIER_ROUTES.BILLING;
  },
  reports: (page?: number, sort?: string) => {
    const params = new URLSearchParams();
    if (page) params.set("page", page.toString());
    if (sort) params.set("sort", sort);
    return `${CASHIER_ROUTES.REPORTS}?${params.toString()}`;
  },
  shift: () => CASHIER_ROUTES.SHIFT,
};
