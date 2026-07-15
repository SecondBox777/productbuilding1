const VERIFICATION_PATH = "google8e1ad6d7f4037882.html";
const VERIFICATION_BODY = `google-site-verification: ${VERIFICATION_PATH}`;

export function onRequest({ params }) {
  if (params.verification !== VERIFICATION_PATH) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(VERIFICATION_BODY, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}
