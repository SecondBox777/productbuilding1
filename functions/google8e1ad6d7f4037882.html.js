const VERIFICATION_BODY = "google-site-verification: google8e1ad6d7f4037882.html";

export function onRequest() {
  return new Response(VERIFICATION_BODY, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
