export const onRequestGet = async () => {
  return new Response("google-site-verification: google16b02f5db235c8dd.html", {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache"
    }
  });
};
