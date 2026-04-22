const https = require('https');

export default async function handler(req, res) {
  const rawCookie = req.headers.cookie || '';
  
  const cookieParts = rawCookie.split(';').map(c => c.trim());
  const sessCookies = cookieParts.filter(c => c.startsWith('YAA_SESS_ID='));
  const lastSessCookie = sessCookies.length > 0 ? sessCookies[sessCookies.length - 1] : '';
  const otherCookies = cookieParts.filter(c => !c.startsWith('YAA_SESS_ID='));
  const cookie = [...otherCookies, lastSessCookie].join('; ').replace(/%3A/g, ':').replace(/%2F/g, '/');

  const options = {
    hostname: 'bank.korzik.space',
    path: '/api/auth/v1/whoami',
    method: 'GET',
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

    if (apiRes.body) {
      try {
        return res.status(apiRes.status).json(JSON.parse(apiRes.body));
      } catch {}
    }
    return res.status(apiRes.status).end();
  } catch (error) {
    console.error('Proxy whoami error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
