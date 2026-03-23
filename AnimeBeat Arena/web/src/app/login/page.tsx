import { LoginForm } from "./login-form";

type Search = { registered?: string; error?: string; email?: string; callbackUrl?: string };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const callbackUrl = sp.callbackUrl?.startsWith("/") ? sp.callbackUrl : "/dashboard";
  const defaultEmail =
    sp.email?.trim() ||
    (process.env.NODE_ENV === "development" ? (process.env.ADMIN_EMAIL?.trim() ?? "") : "");
  const registered = sp.registered === "1";
  const serverError = sp.error === "1";
  const authServerError = sp.error === "server";

  return (
    <LoginForm
      callbackUrl={callbackUrl}
      defaultEmail={defaultEmail}
      registered={registered}
      serverError={serverError}
      authServerError={authServerError}
    />
  );
}
