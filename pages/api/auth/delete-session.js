const https = require('https');

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const rawCookie = req.headers.cookie || '';
  const cookie = rawCookie.replace(/%3A/g, ':').replace(/%2F/g, '/');
  const { sessionId } = req.query;

  const urlPath = `/api/auth/v1/sessions?sessionId=${encodeURIComponent(sessionId)}`;

  const options = {
    hostname: 'bank.korzik.space',
    path: urlPath,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
    },
  };

  try {
    const apiRes = await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let body = '';
        response.on('data', (chunk) => { body += chunk; });
        response.on('end', () => {
          resolve({ status: response.statusCode, headers: response.headers, body });
        });
      });
      request.on('error', reject);
      request.end();
    });

    const setCookies = apiRes.headers['set-cookie'];
    if (setCookies) {
      const modified = (Array.isArray(setCookies) ? setCookies : [setCookies]).map(c =>
        c.replace(/Domain=[^;]+;?\s*/i, '')
      );
      res.setHeader('Set-Cookie', modified);
    }

    if (apiRes.body) {
      try {
        return res.status(apiRes.status).json(JSON.parse(apiRes.body));
      } catch {}
    }
    return res.status(apiRes.status).end();
  } catch (error) {
    console.error('Proxy delete-session error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
