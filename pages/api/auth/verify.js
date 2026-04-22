const https = require('https');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ message: 'Code is required' });
  }

  const body = JSON.stringify({ code });

  const options = {
    hostname: 'bank.korzik.space',
    path: '/api/auth/v1/simple/yandex/callback',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  try {
    const apiRes = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
          resolve({ status: response.statusCode, headers: response.headers, body: data });
        });
      });
      request.on('error', reject);
      request.write(body);
      request.end();
    });

    if (apiRes.status === 300 && apiRes.body) {
      try {
        return res.status(300).json(JSON.parse(apiRes.body));
      } catch {
        return res.status(300).send(apiRes.body);
      }
    }

    const setCookies = apiRes.headers['set-cookie'];
    if (setCookies) {
      const modified = (Array.isArray(setCookies) ? setCookies : [setCookies]).map(c =>
        c.replace(/Domain=[^;]+;?\s*/i, '')
      );
      res.setHeader('Set-Cookie', modified);
    }

    if (apiRes.body) {
      try {
        const parsed = JSON.parse(apiRes.body);
        return res.status(apiRes.status).json({ ...parsed, status: apiRes.status });
      } catch {
        return res.status(apiRes.status).json({ success: true, status: apiRes.status });
      }
    }

    return res.status(apiRes.status).json({ success: true, status: apiRes.status });
  } catch (error) {
    console.error('Proxy verify error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
