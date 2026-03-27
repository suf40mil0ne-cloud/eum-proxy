import type { VercelRequest, VercelResponse } from '@vercel/node';

const EUM_BASE = 'https://www.eum.go.kr';

export default async function handler(req: VercelRequest, res: VercelResponse) {
 const path = (req.query.path as string) || '';
const pageNo = (req.query.pageNo as string) || '';

if (!path.startsWith('/')) {
  return res.status(400).json({ error: 'invalid path' });
}

const targetUrl = new URL(`https://www.eum.go.kr${path}`);
if (pageNo) targetUrl.searchParams.set('pageNo', pageNo);
  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Referer: 'https://www.eum.go.kr/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
      },
      redirect: 'follow',
    });

    const contentType = upstream.headers.get('content-type') || '';
    const body = await upstream.arrayBuffer();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', contentType);
    res.status(upstream.status).send(Buffer.from(body));
  } catch (e: any) {
    res.status(502).json({ error: e?.message ?? 'upstream fetch failed' });
  }
}
