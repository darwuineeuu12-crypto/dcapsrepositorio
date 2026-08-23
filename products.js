export default async function handler(req, res) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    res.status(500).json({ error: 'Falta configurar KV_REST_API_URL y KV_REST_API_TOKEN en Vercel.' });
    return;
  }

  const key = 'dcaps-products';

  try {
    if (req.method === 'GET') {
      const r = await fetch(url + '/get/' + key, {
        headers: { Authorization: 'Bearer ' + token }
      });
      const data = await r.json();
      res.status(200).json({ value: data.result || null });
      return;
    }

    if (req.method === 'POST') {
      const value = req.body && req.body.value ? req.body.value : '';
      const r = await fetch(url + '/set/' + key, {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + token },
        body: value
      });
      const data = await r.json();
      res.status(200).json({ ok: true, result: data.result });
      return;
    }

    res.status(405).json({ error: 'Método no permitido' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
