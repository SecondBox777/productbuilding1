const VERIFICATION_RESPONSES = {
  "/google8e1ad6d7f4037882.html":
    "google-site-verification: google8e1ad6d7f4037882.html",
  "/naver8c57345239d00813fcb9a96ada5cffba.html":
    "naver-site-verification: naver8c57345239d00813fcb9a96ada5cffba.html",
};

const CANONICAL_PATHS = {
  "/index.html": "/",
  "/about.html": "/about",
  "/contact.html": "/contact",
  "/privacy.html": "/privacy",
  "/terms.html": "/terms",
};

const PAGE_ASSETS = {
  "/": "/index.html",
  "/about": "/about.html",
  "/contact": "/contact.html",
  "/privacy": "/privacy.html",
  "/terms": "/terms.html",
};

const HSTS_VALUE = "max-age=31536000; includeSubDomains";

function redirectToCanonical(requestUrl) {
  const canonicalUrl = new URL(requestUrl);
  let shouldRedirect = false;

  if (canonicalUrl.protocol !== "https:") {
    canonicalUrl.protocol = "https:";
    shouldRedirect = true;
  }

  if (canonicalUrl.hostname === "www.egentest.online") {
    canonicalUrl.hostname = "egentest.online";
    shouldRedirect = true;
  }

  const normalizedPath = canonicalUrl.pathname.replace(/\/{2,}/g, "/");
  if (normalizedPath !== canonicalUrl.pathname) {
    canonicalUrl.pathname = normalizedPath;
    shouldRedirect = true;
  }

  const preferredPath = CANONICAL_PATHS[canonicalUrl.pathname];
  if (preferredPath) {
    canonicalUrl.pathname = preferredPath;
    shouldRedirect = true;
  } else if (canonicalUrl.pathname.length > 1 && canonicalUrl.pathname.endsWith("/")) {
    canonicalUrl.pathname = canonicalUrl.pathname.slice(0, -1);
    shouldRedirect = true;
  }

  return shouldRedirect ? canonicalUrl : null;
}

function withSecurityHeaders(response, requestMethod) {
  const headers = new Headers(response.headers);
  headers.set("Strict-Transport-Security", HSTS_VALUE);
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return new Response(requestMethod === "HEAD" ? null : response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const canonicalUrl = redirectToCanonical(url);
    if (canonicalUrl) {
      return new Response(null, {
        status: 308,
        headers: {
          Location: canonicalUrl.toString(),
          "Strict-Transport-Security": HSTS_VALUE,
        },
      });
    }

    if (VERIFICATION_RESPONSES[url.pathname]) {
      return new Response(VERIFICATION_RESPONSES[url.pathname], {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          "Cache-Control": "public, max-age=300",
          "Strict-Transport-Security": HSTS_VALUE,
        },
      });
    }

    const assetPath = PAGE_ASSETS[url.pathname];
    const assetRequest = assetPath ? new URL(assetPath, url) : request;
    const response = await env.ASSETS.fetch(assetRequest);
    return withSecurityHeaders(response, request.method);
  },
};
