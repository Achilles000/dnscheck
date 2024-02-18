document.getElementById('lookupBtn').addEventListener('click', async function() {
    const domainName = document.getElementById('domainInput').value;
    if (!domainName) {
        alert("Please enter a domain name.");
        return;
    }

    const response = await fetch('/.netlify/functions/lookup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: domainName }),
    });
    const data = await response.json();

    const resultDiv = document.getElementById('result');
    const logoImg = document.getElementById('logo');

    if (data.serviceProvider && data.serviceProvider !== "Unknown") {
        resultDiv.textContent = `Mail service provider: ${data.serviceProvider}`;
        logoImg.style.display = 'block';

        // Display logo based on the service provider
        switch(data.serviceProvider) {
            case 'Google':
                logoImg.src = 'path/to/google-logo.png'; // Update path
                break;
            case 'Outlook':
                logoImg.src = 'path/to/outlook-logo.png'; // Update path
                break;
            case 'Apple':
                logoImg.src = 'path/to/apple-logo.png'; // Update path
                break;
            // Add more cases as needed
            default:
                logoImg.style.display = 'none'; // Hide logo if not available
        }

        // Trigger confetti
        window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        resultDiv.textContent = 'Mail service provider: Unknown';
        logoImg.style.display = 'none';
    }
});
