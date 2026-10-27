// Server-side proxy naar de Anthropic API. De API-sleutel blijft hier, nooit in de browser.
const ALLOWED_MODELS = (process.env.ALLOWED_MODELS || 'claude-sonnet-4-5,claude-haiku-4-5').split(',').map(s => s.trim());
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || 'claude-sonnet-4-5';
const MAX_TOKENS_CAP = 2000;

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return Response.json({ error: 'ANTHROPIC_API_KEY ontbreekt' }, { status: 500 });

  let body;
  try { body = await req.json(); } catch { return Response.json({ error: 'Ongeldige JSON' }, { status: 400 }); }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-60) : [];
  if (!messages.length) return Response.json({ error: 'Geen berichten' }, { status: 400 });

  const model = ALLOWED_MODELS.includes(body.model) ? body.model : DEFAULT_MODEL;
  const payload = {
    model,
    max_tokens: Math.min(Number(body.max_tokens) || 800, MAX_TOKENS_CAP),
    messages,
  };
  if (typeof body.system === 'string') payload.system = body.system;

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await r.json();
  if (!r.ok) return Response.json({ error: data?.error?.message || 'API-fout' }, { status: r.status });

  const text = (data.content || []).filter(c => c.type === 'text').map(c => c.text).join('');
  return Response.json({ text });
};
