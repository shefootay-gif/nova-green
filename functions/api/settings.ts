interface Env {
  NOVA_GREEN_KV: KVNamespace;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const raw = await context.env.NOVA_GREEN_KV?.get('global_settings');
    if (raw) {
      return new Response(raw, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    return new Response(JSON.stringify({ found: false }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = await context.request.json();
    await context.env.NOVA_GREEN_KV?.put('global_settings', JSON.stringify(body));
    return new Response(JSON.stringify({ success: true, message: 'Settings saved globally to Cloudflare KV' }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
