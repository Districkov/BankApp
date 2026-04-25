const https = require('https');

export const config = { api: { bodyParser: true } };

function proxyRequest(req, res, servicePath) {
  const rawCookie = req.headers.cookie || '';
  const cookie = rawCookie.replace(/%3A/g, ':').replace(/%2F/g, '/');

  const { path: pathSegments } = req.query;
  const apiPath = servicePath + (Array.isArray(pathSegments) && pathSegments.length ? '/' + pathSegments.join('/') : pathSegments || '');

  const options = {
    hostname: 'bank.korzik.space',
    path: apiPath,
    method: req.method,
    headers: {
      'Content-Type': req.headers['content-type'] || 'application/json',
      'Cookie': cookie,
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      const setCookies = response.headers['set-cookie'];
      if (setCookies) {
        const modified = (Array.isArray(setCookies) ? setCookies : [setCookies]).map(c =>
          c.replace(/Domain=[^;]+;?\s*/i, '')
        );
        res.setHeader('Set-Cookie', modified);
      }

      res.writeHead(response.statusCode, { 'Content-Type': response.headers['content-type'] || 'application/json' });
      response.pipe(res);
    });
    request.on('error', reject);

    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) && req.body) {
      const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      request.write(body);
    }
    request.end();
  });
}

export default async function handler(req, res) {
  try {
    await proxyRequest(req, res, '/api/accounts/v1/');
  } catch (error) {
    console.error('Accounts proxy error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
