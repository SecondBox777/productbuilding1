const VERIFICATION_PATH = "/google8e1ad6d7f4037882.html";
const VERIFICATION_BODY = "google-site-verification: google8e1ad6d7f4037882.html";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === VERIFICATION_PATH) {
      return new Response(VERIFICATION_BODY, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=UTF-8",
          "Cache-Control": "public, max-age=300",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
