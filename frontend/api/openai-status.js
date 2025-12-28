const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { message: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY || '';
  if (!apiKey) {
    return json(res, 200, {
      configured: false,
      ok: false,
      error: 'OPENAI_API_KEY is not set.',
    });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      return json(res, 200, {
        configured: true,
        ok: false,
        error: payload?.error?.message || 'OpenAI request failed.',
      });
    }

    const payload = await response.json().catch(() => ({}));
    return json(res, 200, {
      configured: true,
      ok: true,
      modelCount: Array.isArray(payload?.data) ? payload.data.length : null,
    });
  } catch (err) {
    return json(res, 200, {
      configured: true,
      ok: false,
      error: 'Network error while reaching OpenAI.',
    });
  }
}
