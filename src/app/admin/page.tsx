import { redirect } from 'next/navigation';

/**
 * /admin is now served from the dedicated admin subdomain.
 * Redirect all visits to admin.takeone-nexus.net.in
 */
export default function AdminRedirectPage() {
  redirect('https://admin.takeone-nexus.net.in');
}
