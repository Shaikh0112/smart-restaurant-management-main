// RESPONSIBILITY: Admin route shell at `/admin` --- redirects cleanly to `/admin/dashboard`.

import { redirect } from "next/navigation";
import { ADMIN_ROUTES } from "./admin_url_config";

export default function AdminRootPage() {
  redirect(ADMIN_ROUTES.DASHBOARD);
}
