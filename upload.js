import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  try {
    const dataUrl = req.body && req.body.dataUrl;
    if (!dataUrl) {
      res.status(400).json({ error: 'Falta la imagen' });
      return;
    }

    const match = dataUrl.match(/^data:(.+);base64,(.*)$/);
    if (!match) {
      res.status(400).json({ error: 'Formato de imagen inválido' });
      return;
    }

    const contentType = match[1];
    const buffer = Buffer.from(match[2], 'base64');
    const ext = contentType.split('/')[1] || 'jpg';
    const filename = 'productos/gorra-' + Date.now() + '.' + ext;

    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: contentType,
      addRandomSuffix: true
    });

    res.status(200).json({ url: blob.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
