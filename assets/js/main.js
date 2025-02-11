// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
	initMenu();
	initScrollEffects();
	initCarousel();
	initContactForm();
});

// Menu functionality
function initMenu() {
	const menuButton = document.querySelector('.menu-button');
	const nav = document.querySelector('.main-nav');
	const backdrop = document.querySelector('.nav-backdrop');
	
	if (!menuButton || !nav) {
		console.warn('Menu elements not found');
		return;
	}

	function toggleMenu(show) {
		const isShowing = show ?? !nav.classList.contains('show');
		menuButton.setAttribute('aria-expanded', String(isShowing));
		nav.classList.toggle('show', isShowing);
		backdrop?.classList.toggle('show', isShowing);
		document.body.style.overflow = isShowing ? 'hidden' : '';
	}

	// Toggle menu on button click
	menuButton.addEventListener('click', () => toggleMenu());

	// Close menu on navigation item click
	nav.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', () => {
			if (link.getAttribute('href').startsWith('#')) {
				toggleMenu(false);
			}
		});
	});

	// Close menu on backdrop click
	backdrop?.addEventListener('click', () => toggleMenu(false));

	// Close menu on escape key
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') toggleMenu(false);
	});

	// Close menu on resize
	window.addEventListener('resize', () => {
		if (window.innerWidth > 640) toggleMenu(false);
	});
}

// Scroll effects with Intersection Observer
function initScrollEffects() {
	const observer = new IntersectionObserver(
		entries => entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.animation = 'revealFromBottom var(--transition-slow) ease forwards';
				observer.unobserve(entry.target);
			}
		}),
		{ threshold: 0.1 }
	);

	document.querySelectorAll('.content-card, .experience-card, .education-card, .skills-grid, .social-links')
		.forEach(el => observer.observe(el));
}

// Carousel functionality
function initCarousel() {
	const carousels = document.querySelectorAll('.carousel');
	
	carousels.forEach(carousel => {
		const track = carousel.querySelector('.carousel-track');
		if (!track) return;

		const container = carousel.closest('.carousel-container');
		const slides = Array.from(track.children);
		const progress = container?.querySelector('.carousel-progress');
		const dots = container?.querySelectorAll('.carousel-dot');
		const prevButton = container?.querySelector('.carousel-arrow.prev');
		const nextButton = container?.querySelector('.carousel-arrow.next');
		
		let isDragging = false;
		let startPos = 0;
		let currentTranslate = 0;
		let prevTranslate = 0;
		let currentIndex = 0;
		let lastDragTime = 0;
		let lastDragPos = 0;
		let dragVelocity = 0;
		let isMobile = window.innerWidth < 1024;

		function getPositionX(event) {
			return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
		}

		function setSliderPosition(position, animate = false) {
			if (animate) {
				track.style.transition = 'transform 0.3s ease-out';
				requestAnimationFrame(() => {
					track.style.transform = `translateX(${position}px)`;
				});
				setTimeout(() => {
					track.style.transition = '';
				}, 300);
			} else {
				track.style.transform = `translateX(${position}px)`;
			}
		}

		function getSlideWidth() {
			const slide = slides[0];
			const style = getComputedStyle(slide);
			const width = slide.offsetWidth;
			const marginRight = parseInt(style.marginRight) || 0;
			return width + marginRight;
		}

		function setPositionByIndex(animate = true) {
			const slideWidth = getSlideWidth();
			currentTranslate = currentIndex * -slideWidth;
			prevTranslate = currentTranslate;
			setSliderPosition(currentTranslate, animate);
			updateDots();
			updateProgress();
			updateArrowButtons();
		}

		function updateDots() {
			dots?.forEach((dot, index) => {
				dot.classList.toggle('active', index === currentIndex);
				dot.setAttribute('aria-selected', index === currentIndex);
			});
		}

		function updateProgress() {
			if (!progress) return;
			const progressPercent = (currentIndex / (slides.length - 1)) * 100;
			progress.style.width = `${progressPercent}%`;
		}

		function updateArrowButtons() {
			if (prevButton) {
				prevButton.disabled = currentIndex === 0;
				prevButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
			}
			if (nextButton) {
				nextButton.disabled = currentIndex === slides.length - 1;
				nextButton.style.opacity = currentIndex === slides.length - 1 ? '0.5' : '1';
			}
		}

		function moveToSlide(index) {
			if (index < 0) {
				currentIndex = 0;
			} else if (index >= slides.length) {
				currentIndex = slides.length - 1;
			} else {
				currentIndex = index;
			}
			setPositionByIndex(true);
		}

		function handleDragStart(event) {
			// Only prevent default for touch events
			if (event.type === 'touchstart') {
				event.preventDefault();
			}
			
			isDragging = true;
			startPos = getPositionX(event);
			lastDragTime = Date.now();
			lastDragPos = startPos;
			dragVelocity = 0;
			
			track.style.cursor = 'grabbing';
		}

		function handleDragMove(event) {
			if (!isDragging) return;
			
			const currentPosition = getPositionX(event);
			const currentTime = Date.now();
			const timeDelta = currentTime - lastDragTime;
			
			if (timeDelta > 0) {
				dragVelocity = (currentPosition - lastDragPos) / timeDelta;
			}
			
			const delta = currentPosition - startPos;
			
			// Add resistance at boundaries
			if (currentIndex === 0 && delta > 0 || 
				currentIndex === slides.length - 1 && delta < 0) {
				currentTranslate = prevTranslate + delta * 0.2;
			} else {
				currentTranslate = prevTranslate + delta;
			}
			
			setSliderPosition(currentTranslate);
			
			lastDragPos = currentPosition;
			lastDragTime = currentTime;
		}

		function handleDragEnd() {
			if (!isDragging) return;
			
			isDragging = false;
			track.style.cursor = 'grab';
			
			const slideWidth = getSlideWidth();
			const movedBy = currentTranslate - prevTranslate;
			const velocityThreshold = 0.5;
			const moveThreshold = slideWidth * 0.2;
			
			if (Math.abs(dragVelocity) > velocityThreshold) {
				// Move based on velocity
				if (dragVelocity < 0 && currentIndex < slides.length - 1) {
					currentIndex++;
				} else if (dragVelocity > 0 && currentIndex > 0) {
					currentIndex--;
				}
			} else {
				// Move based on distance
				if (movedBy < -moveThreshold && currentIndex < slides.length - 1) {
					currentIndex++;
				} else if (movedBy > moveThreshold && currentIndex > 0) {
					currentIndex--;
				}
			}
			
			setPositionByIndex(true);
		}

		// Initialize event listeners
		if (isMobile) {
			track.addEventListener('touchstart', handleDragStart, { passive: false });
			track.addEventListener('touchmove', handleDragMove);
			track.addEventListener('touchend', handleDragEnd);
		} else {
			track.addEventListener('mousedown', handleDragStart);
			track.addEventListener('mousemove', handleDragMove);
			track.addEventListener('mouseup', handleDragEnd);
			track.addEventListener('mouseleave', handleDragEnd);
		}

		// Prevent images from being dragged
		slides.forEach(slide => {
			const slideImg = slide.querySelector('img');
			if (slideImg) {
				slideImg.addEventListener('dragstart', e => e.preventDefault());
			}
		});

		// Arrow navigation
		prevButton?.addEventListener('click', () => {
			if (currentIndex > 0) {
				moveToSlide(currentIndex - 1);
			}
		});

		nextButton?.addEventListener('click', () => {
			if (currentIndex < slides.length - 1) {
				moveToSlide(currentIndex + 1);
			}
		});

		// Dot navigation
		dots?.forEach((dot, index) => {
			dot.addEventListener('click', () => {
				moveToSlide(index);
			});
		});

		// Keyboard navigation
		container?.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowLeft') {
				moveToSlide(currentIndex - 1);
			} else if (e.key === 'ArrowRight') {
				moveToSlide(currentIndex + 1);
			}
		});

		// Handle window resize
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				isMobile = window.innerWidth < 1024;
				setPositionByIndex(false);
			}, 100);
		});

		// Initial setup
		setPositionByIndex(false);
		
		// Prevent context menu
		carousel.addEventListener('contextmenu', e => e.preventDefault());
	});
}

// Contact form functionality
function initContactForm() {
	const contactForm = document.getElementById('contact-form');
	if (!contactForm) return;

	let isSubmitting = false;

	contactForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		if (isSubmitting) return;
		
		isSubmitting = true;
		const submitButton = contactForm.querySelector('button[type="submit"]');
		submitButton.disabled = true;
		submitButton.innerHTML = 'Sending...';

		try {
			const formData = {
				name: contactForm.querySelector('input[name="name"]').value,
				email: contactForm.querySelector('input[name="email"]').value,
				message: contactForm.querySelector('textarea[name="message"]').value
			};

			const response = await fetch('https://api.jesseclark.io/contactMe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				},
				mode: 'cors',
				body: JSON.stringify(formData)
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error || data.message || 'Failed to send message');

			showNotification('Message sent successfully!', 'success');
			contactForm.reset();
		} catch (error) {
			console.error('Contact form error:', error);
			showNotification(error.message || 'Failed to send message', 'error');
		} finally {
			submitButton.disabled = false;
			submitButton.innerHTML = 'Send Message';
			isSubmitting = false;
		}
	});
}

// Notification system
function showNotification(message, type = 'success') {
	requestAnimationFrame(() => {
		document.querySelectorAll('.notification').forEach(n => n.remove());

		const notification = document.createElement('div');
		notification.className = `notification ${type}`;
		notification.setAttribute('role', 'alert');
		notification.setAttribute('aria-live', 'polite');
		notification.innerHTML = `<div class="notification-content">${message}</div>`;

		document.body.appendChild(notification);
		requestAnimationFrame(() => notification.classList.add('show'));

		setTimeout(() => {
			notification.classList.remove('show');
			setTimeout(() => notification.remove(), 300);
		}, 3000);
	});
}