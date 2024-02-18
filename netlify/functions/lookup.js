const dns = require('dns').promises;

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { domain } = JSON.parse(event.body);
        const addresses = await dns.resolveMx(domain);
        console.log("Resolved addresses:", addresses); // Useful for debugging

        let serviceProvider = 'Unknown';

        // Check each MX record against known patterns
        for (const record of addresses) {
            const exchange = record.exchange.toLowerCase();

            // Match Google MX records
            if (exchange.includes('google.com') || exchange.includes('googlemail.com')) {
                serviceProvider = 'Google';
                break;
            }
            // Match Outlook MX records
            else if (exchange.includes('protection.outlook.com')) {
                serviceProvider = 'Outlook';
                break;
            }
            // Match Apple MX records (assuming 'apple.com' is a placeholder for actual Apple MX patterns)
            else if (exchange.includes('apple.com')) {
                serviceProvider = 'Apple';
                break;
            }
            // Extend with more conditions as needed
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
