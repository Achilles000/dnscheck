const dns = require('dns').promises;

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { domain } = JSON.parse(event.body);
        const addresses = await dns.resolveMx(domain);
        console.log("Resolved addresses:", addresses); // Log resolved addresses for debugging

        let serviceProvider = 'Unknown';
        // Generalized matching logic
        for (const record of addresses) {
            if (record.exchange.endsWith('google.com.')) {
                serviceProvider = 'Google';
                break;
            } else if (record.exchange.endsWith('outlook.com.')) {
                serviceProvider = 'Outlook';
                break;
            } else if (record.exchange.endsWith('apple.com')) {
                serviceProvider = 'Apple';
                break;
            }
            // Extend with more conditions as needed
        }

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
