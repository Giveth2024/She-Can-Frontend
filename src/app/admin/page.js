import { redirect } from 'next/navigation';

export default function AdminRootRedirectPage() {
  // Triggers an immediate, clean server-side 371/307 redirection route hook
  redirect('/admin/sign-in');
}