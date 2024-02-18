const dns = require('dns').promises;

const mailServices = {
  'aspmx.l.google.com.': 'Google',
  'alt1.aspmx.l.google.com.': 'Google',
  'alt2.aspmx.l.google.com.': 'Google',
  'alt3.aspmx.l.google.com.': 'Google',
  'alt4.aspmx.l.google.com.': 'Google',
  // Add entries for other providers like Outlook, Yahoo, etc.
  'mail.protection.outlook.com.': 'Outlook',
  'mx-in-hfd.apple.com.': 'Apple',
  'mx-in-vib.apple.com': 'Apple',
  'mx-in.g.apple.com': 'Apple',
  'mx-in-mdn.apple.com': 'Apple',
  'mx-in-rno.apple.com': 'Apple',
  // ... more providers

};

exports.handler = async function(event, context) {
  try {
    const { domain } = JSON.parse(event.body);
    const addresses = await dns.resolveMx(domain);
    console.log("Resolved addresses:", addresses); // Log resolved addresses for debugging
    const mxRecord = addresses.sort((a, b) => a.priority - b.priority)[0].exchange;
    const serviceProvider = mailServices[mxRecord] || 'Unknown';

    // For debugging: return the resolved MX records along with the service provider
    return {
      statusCode: 200,
      body: JSON.stringify({ serviceProvider, resolvedMX: addresses }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error("Error resolving MX records:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Error resolving MX records" }) };
  }
};

