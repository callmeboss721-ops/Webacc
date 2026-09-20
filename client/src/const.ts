export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL?.trim();
  const appId = import.meta.env.VITE_APP_ID?.trim();
  const redirectUri = `${window.location.origin}/api/oauth/callback`;

  if (!oauthPortalUrl || !appId) {
    console.warn("[v0] OAuth preview configuration is missing VITE_OAUTH_PORTAL_URL or VITE_APP_ID");
    return "#auth-config-missing";
  }

  try {
    const state = btoa(redirectUri);
    const url = new URL(`${oauthPortalUrl.replace(/\/$/, "")}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");
    return url.toString();
  } catch {
    console.warn("[v0] OAuth preview configuration contains an invalid portal URL");
    return "#auth-config-invalid";
  }
};
