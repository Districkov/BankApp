const https = require('https');

export default async function handler(req, res) {
  const rawCookie = req.headers.cookie || '';

  const cookieParts = rawCookie.split(';').map(c => c.trim());
  const sessCookies = cookieParts.filter(c => c.startsWith('YAA_SESS_ID='));
  const lastSessCookie = sessCookies.length > 0 ? sessCookies[sessCookies.length - 1] : '';
  const otherCookies = cookieParts.filter(c => !c.startsWith('YAA_SESS_ID='));
  const cookie = [...otherCookies, lastSessCookie].join('; ').replace(/%3A/g, ':').replace(/%2F/g, '/');

  const { path: pathSegments } = req.query;
  const apiPath = '/api/auth/v1/' + (Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments || '');

  console.log(`[AUTH PROXY] ${req.method} ${apiPath} cookie=${rawCookie ? 'present' : 'missing'}`);

  const options = {
    hostname: 'bank.korzik.space',
    path: apiPath,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie,
    },
  };

  const makeRequest = (extraBody) => {
    return new Promise((resolve, reject) => {
      if (extraBody) {
        options.headers['Content-Length'] = Buffer.byteLength(extraBody);
      }
      const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
          resolve({ status: response.statusCode, headers: response.headers, body: data });
        });
      });
      request.on('error', reject);
      if (extraBody) request.write(extraBody);
      request.end();
    });
  };

  try {
    let apiRes;

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const body = JSON.stringify(req.body);
      apiRes = await makeRequest(body);
    } else {
      apiRes = await makeRequest();
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
        return res.status(apiRes.status).json(JSON.parse(apiRes.body));
      } catch {
        return res.status(apiRes.status).send(apiRes.body);
      }
    }
    return res.status(apiRes.status).end();
  } catch (error) {
    console.error('Proxy auth error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
