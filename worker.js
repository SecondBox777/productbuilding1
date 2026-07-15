const VERIFICATION_RESPONSES = {
  "/google8e1ad6d7f4037882.html":
    "google-site-verification: google8e1ad6d7f4037882.html",
  "/naver8c57345239d00813fcb9a96ada5cffba.html":
    "naver-site-verification: naver8c57345239d00813fcb9a96ada5cffba.html",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (VERIFICATION_RESPONSES[url.pathname]) {
      return new Response(VERIFICATION_RESPONSES[url.pathname], {
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
