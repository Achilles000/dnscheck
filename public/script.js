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

    resultDiv.textContent = `Mail service provider: ${data.serviceProvider}`;
    if (data.serviceProvider && data.serviceProvider !== "Unknown") {
        // Set the logo based on the service provider
        switch(data.serviceProvider) {
            case 'Google':
                logoImg.src = 'path/to/google-logo.png'; // Ensure the correct path to your logo
                break;
            case 'Outlook':
                logoImg.src = 'path/to/microsoft-logo.png'; // Ensure the correct path to your Microsoft logo
                break;
            case 'Apple':
                logoImg.src = 'path/to/apple-logo.png'; // Ensure the correct path to your logo
                break;
            // Add more cases as needed
            default:
                logoImg.style.display = 'none'; // Hide logo if not available
                break;
        }
        logoImg.style.display = 'block';
        logoImg.style.maxWidth = '100px'; // Control the size of the logo
        logoImg.style.maxHeight = '100px';

        // Trigger confetti
        if (typeof window.confetti === "function") {
            window.confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            console.error("Confetti function not found.");
        }
    } else {
        resultDiv.textContent = 'Mail service provider: Unknown';
        logoImg.style.display = 'none';
    }
});
