export default {
  async fetch(request, env) {
    const assets = env.ASSETS;
    if (!assets) return new Response("Grammar Coach assets are unavailable.", { status: 503 });
    return assets.fetch(request);
  },
};
