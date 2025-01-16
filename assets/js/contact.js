async function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Sanitize form data
        const formData = new FormData(form);
        const data = {
            name: sanitizeInput(formData.get('name')),
            email: sanitizeInput(formData.get('email')),
            message: sanitizeInput(formData.get('message')),
            subject: 'New Contact Form Submission from Portfolio',
            to: 'jesseclark@duck.com'
        };

        const response = await fetch('https://api.jesseclark.dev/contactMe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to send message');
        }

        form.reset();
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification(
            'Unable to send message. Please try reaching out via email directly.',
            'error'
        );
        
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
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

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', handleContactForm);
    }
}); 