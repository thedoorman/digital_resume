async function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const statusMessage = document.getElementById('contact-status');
    
    try {
        submitButton.disabled = true;
        statusMessage.textContent = 'Sending...';
        statusMessage.className = 'status-message';
        
        const data = {
            name: sanitizeInput(form.name.value),
            email: sanitizeInput(form.email.value),
            message: sanitizeInput(form.message.value)
        };
        
        const response = await fetch('https://api.jesseclark.io/contactMe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (!response.ok) throw new Error(result.error || 'Failed to send message');
        
        statusMessage.textContent = 'Message sent successfully!';
        statusMessage.classList.add('success');
        form.reset();
    } catch (error) {
        console.error('Error sending message:', error);
        statusMessage.textContent = error.message || 'Failed to send message. Please try again later.';
        statusMessage.classList.add('error');
    } finally {
        submitButton.disabled = false;
    }
}

// Add sanitization function
function sanitizeInput(input) {
    if (!input) return '';
    
    // Convert special characters to HTML entities
    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
        // Remove any potentially problematic characters
        .replace(/[^\w\s.,!?@-]/g, '')
        .trim();
}

function showNotification(message, type = 'success') {
    // Create notification container if it doesn't exist
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    // Add icon based on type
    const icon = document.createElement('span');
    icon.className = 'notification-icon';
    icon.innerHTML = type === 'success' 
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

    const text = document.createElement('span');
    text.textContent = message;

    notification.appendChild(icon);
    notification.appendChild(text);
    container.appendChild(notification);

    // Remove notification after delay
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            container.removeChild(notification);
            if (container.children.length === 0) {
                document.body.removeChild(container);
            }
        }, 300);
    }, 5000);
}

// Add this test function
async function testLambdaConnection() {
    try {
        const response = await fetch('https://api.jesseclark.dev/contactMe', {
            method: 'OPTIONS'
        });
        console.log('Lambda connection test:', response.status);
        return response.ok;
    } catch (error) {
        console.error('Lambda connection test failed:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('contact-form');
    const statusMessage = document.getElementById('contact-status');
    
    if (form) {
        // Test Lambda connection
        const isConnected = await testLambdaConnection();
        if (!isConnected) {
            statusMessage.textContent = 'Contact form temporarily unavailable';
            statusMessage.style.color = 'red';
        }
        
        form.addEventListener('submit', handleContactForm);
    }
}); 