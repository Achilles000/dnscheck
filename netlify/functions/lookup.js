const dns = require('dns').promises;

const mailServices = {
  'aspmx.l.google.com.': 'Google',
  'alt1.aspmx.l.google.com.': 'Google',
  'alt2.aspmx.l.google.com.': 'Google',
  'alt3.aspmx.l.google.com.': 'Google',
  'alt4.aspmx.l.google.com.': 'Google',
  // Add entries for other providers like Outlook, Yahoo, etc.
  'mail.protection.outlook.com.': 'Outlook',
  // ... more providers

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
