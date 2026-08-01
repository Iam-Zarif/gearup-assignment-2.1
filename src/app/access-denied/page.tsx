import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold">Access denied</h1>
      <p className="mt-3 text-muted-foreground">You do not have permission to access this page.</p>
      <Link className="mt-6 text-primary underline" href="/">Return to home</Link>
    </main>
  );
}
