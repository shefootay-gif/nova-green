// Cloudflare Pages Function: /api/products
// Works on Cloudflare Edge with D1 Database (Free Tier)

interface Env {
  DB?: any;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;

  if (env.DB) {
    try {
      const { results } = await env.DB.prepare(
        'SELECT * FROM products WHERE is_active = 1 ORDER BY created_at DESC'
      ).all();

      return new Response(JSON.stringify(results), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
        },
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  }

  // Fallback if D1 is not bound
  return new Response(JSON.stringify({ status: 'ok', message: 'Local client storage active' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
