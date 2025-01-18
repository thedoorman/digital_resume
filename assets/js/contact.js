document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    let isSubmitting = false; // Flag to prevent duplicate submissions

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (isSubmitting) return;
        isSubmitting = true;

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

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Failed to send message');
            }

            showNotification('Message sent successfully!', 'success');
            contactForm.reset();

        } catch (error) {
            console.error('Full error:', error);
            showNotification(error.message || 'Failed to send message', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
            isSubmitting = false; // Reset submission flag
        }
    });
});

function showNotification(message, type = 'success') {
    // Ensure notification is removed if script runs before CSS loads
    requestAnimationFrame(() => {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite'); // Add for accessibility
        notification.innerHTML = `
            <div class="notification-content">
                ${message}
            </div>
        `;

        document.body.appendChild(notification);
        
        // Force reflow and ensure CSS is loaded
        void notification.offsetHeight;
        
        // Add show class in next frame
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    });
} 