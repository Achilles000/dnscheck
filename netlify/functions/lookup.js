const dns = require('dns').promises;

const mailServices = {
  'aspmx.l.google.com.': 'Google',
  'alt1.aspmx.l.google.com.': 'Google',
  // Add other known mail service provider records
};

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { domain } = JSON.parse(event.body);
    const addresses = await dns.resolveMx(domain);
    const mxRecord = addresses.sort((a, b) => a.priority - b.priority)[0].exchange;
    const serviceProvider = mailServices[mxRecord] || 'Unknown';

    return {
      statusCode: 200,
      body: JSON.stringify({ serviceProvider }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    return { statusCode: 500, body: 'Server Error' };
  }
};
