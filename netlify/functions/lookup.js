const dns = require('dns').promises;

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { domain } = JSON.parse(event.body);
        const addresses = await dns.resolveMx(domain);

        let serviceProvider = 'Unknown';

        // Check each MX record against known patterns
        for (const record of addresses) {
            const exchange = record.exchange.toLowerCase();

            if (exchange.includes('google.com') || exchange.includes('googlemail.com')) {
                serviceProvider = 'Google';
                break;
            } else if (exchange.includes('protection.outlook.com')) {
                serviceProvider = 'Outlook';
                break;
            } else if (exchange.includes('apple.com')) {
                serviceProvider = 'Apple';
                break;
            } else {
                // Extract the provider name from the MX record for generic handling
                const parts = exchange.split('.');
                const secondLast = parts.length >= 2 ? parts[parts.length - 2] : null;
                if (secondLast) {
                    serviceProvider = secondLast.charAt(0).toUpperCase() + secondLast.slice(1);
                    break;
                }
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ serviceProvider }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    } catch (error) {
        console.error("Error resolving MX records:", error);
        return { statusCode: 500, body: JSON.stringify({ error: "Error resolving MX records" }) };
    }
};
