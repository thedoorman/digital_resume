document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form elements
        const nameInput = contactForm.querySelector('input[name="name"]');
        const emailInput = contactForm.querySelector('input[name="email"]');
        const messageInput = contactForm.querySelector('textarea[name="message"]');
        const submitButton = contactForm.querySelector('button[type="submit"]');
        
        // Disable form while submitting
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';

        try {
            const response = await fetch('https://api.jesseclark.io/contactMe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify({
                    name: nameInput.value,
                    email: emailInput.value,
                    message: messageInput.value
                })
            });

            const data = await response.json();
            console.log('Response:', data); // Debug response

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Failed to send message');
            }

            showNotification('Message sent successfully!', 'success');
            contactForm.reset();

        } catch (error) {
            console.error('Full error:', error); // More detailed error logging
            let errorMessage = 'Failed to send message';
            
            if (error.message.includes('SES')) {
                errorMessage = 'Email service error. Please try again later.';
            } else if (error.message.includes('Invalid')) {
                errorMessage = error.message;
            }
            
            showNotification(errorMessage, 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }
    });
});

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            ${message}
        </div>
    `;

    document.body.appendChild(notification);

    // Fade in
    setTimeout(() => notification.classList.add('show'), 100);

    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
} 