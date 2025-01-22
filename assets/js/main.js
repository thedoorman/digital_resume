document.addEventListener('DOMContentLoaded', () => {
	initMenu();
	initCarousel();
	initImageHandling();
	initScrollEffects();
});

// Menu functionality
function initMenu() {
	const menuButton = document.querySelector('.menu-button');
	const mainNav = document.querySelector('.main-nav');
	const body = document.body;
	
	if (!menuButton || !mainNav) {
		console.warn('Menu elements not found');
		return;
	}

	function toggleMenu(show) {
		const isExpanded = show === undefined ? !mainNav.classList.contains('active') : show;
		
		// Debug log
		console.log('Toggling menu:', isExpanded);
		
		mainNav.classList.toggle('active', isExpanded);
		menuButton.setAttribute('aria-expanded', isExpanded);
		body.classList.toggle('menu-open', isExpanded);

		// Force a reflow to ensure transitions work
		mainNav.offsetHeight;
	}

	// Handle resize
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
				toggleMenu(false);
			}
				}, 100);
			});

	// Toggle menu on button click
	menuButton.addEventListener('click', (e) => {
		e.preventDefault();
		e.stopPropagation();
		toggleMenu();
		
		// Debug log
		console.log('Menu button clicked');
	});

	// Close menu when clicking links
	mainNav.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', () => {
			toggleMenu(false);
			// Debug log
			console.log('Menu link clicked');
		});
	});

	// Close menu when clicking outside
	document.addEventListener('click', (e) => {
		if (mainNav.classList.contains('active') && !e.target.closest('.header')) {
			toggleMenu(false);
		}
	});

	// Close menu on escape key
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && mainNav.classList.contains('active')) {
			toggleMenu(false);
		}
	});
}

// Image handling
function initImageHandling() {
	function handleImageLoad(img) {
		const container = img.closest('.preview-image');
		if (container) {
			container.classList.remove('loading');
		}
	}

	function handleImageError(img) {
		img.classList.add('error');
		const container = img.closest('.preview-image');
		if (container) {
			container.classList.add('error');
			container.classList.remove('loading');
		}
	}

	document.querySelectorAll('.preview-image img').forEach(img => {
		if (img.complete) {
			handleImageLoad(img);
		} else {
			img.addEventListener('load', () => handleImageLoad(img));
			img.addEventListener('error', () => handleImageError(img));
		}
	});
}

// Scroll effects
function initScrollEffects() {
	const observerOptions = {
		root: null,
		rootMargin: '0px',
		threshold: 0.1
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.animation = 'revealFromBottom var(--transition-slow) ease forwards';
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	const elements = document.querySelectorAll('.content-card, .experience-card, .education-card, .skills-grid, .social-links');
	elements.forEach(el => observer.observe(el));
}

// Carousel functionality
function initCarousel() {
	const carousels = document.querySelectorAll('.carousel');
	
	carousels.forEach(carousel => {
		const track = carousel.querySelector('.carousel-track');
		const slides = Array.from(track.children);
		const container = carousel.closest('.carousel-container');
		const progress = container.querySelector('.progress-bar');
		const dots = container.querySelectorAll('.carousel-dot');
		
		let isDragging = false;
		let startPos = 0;
		let currentTranslate = 0;
		let prevTranslate = 0;
		let currentIndex = 0;
		let animationID = 0;

		// Initialize touch events
		slides.forEach((slide, index) => {
			// Prevent dragging images
			const slideImg = slide.querySelector('img');
			if (slideImg) slideImg.addEventListener('dragstart', (e) => e.preventDefault());
			
			// Touch events
			slide.addEventListener('touchstart', touchStart(index));
			slide.addEventListener('touchend', touchEnd);
			slide.addEventListener('touchmove', touchMove);
			
			// Mouse events
			slide.addEventListener('mousedown', touchStart(index));
			slide.addEventListener('mouseup', touchEnd);
			slide.addEventListener('mouseleave', touchEnd);
			slide.addEventListener('mousemove', touchMove);
		});

		// Disable context menu
		window.oncontextmenu = function(event) {
			if (event.target.closest('.carousel-track')) {
				event.preventDefault();
				event.stopPropagation();
				return false;
			}
		}

		function touchStart(index) {
			return function(event) {
				isDragging = true;
				currentIndex = index;
				startPos = getPositionX(event);
				animationID = requestAnimationFrame(animation);
				track.style.cursor = 'grabbing';
			}
		}

		function touchEnd() {
			isDragging = false;
			cancelAnimationFrame(animationID);
			track.style.cursor = 'grab';
			
			const movedBy = currentTranslate - prevTranslate;
			
			// Determine if slide should advance
			if (movedBy < -100 && currentIndex < slides.length - 1) {
				currentIndex += 1;
			}
			if (movedBy > 100 && currentIndex > 0) {
				currentIndex -= 1;
			}
			
			setPositionByIndex();
			updateDots();
			updateProgress();
		}

		function touchMove(event) {
			if (!isDragging) return;
			
			const currentPosition = getPositionX(event);
			currentTranslate = prevTranslate + currentPosition - startPos;
		}

		function getPositionX(event) {
			return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
		}

		function animation() {
			setSliderPosition();
			if (isDragging) requestAnimationFrame(animation);
		}

		function setSliderPosition() {
			track.style.transform = `translateX(${currentTranslate}px)`;
		}

		function setPositionByIndex() {
			const slideWidth = slides[0].offsetWidth + 16; // Include gap
			currentTranslate = currentIndex * -slideWidth;
			prevTranslate = currentTranslate;
			setSliderPosition();
		}

		function updateDots() {
			dots.forEach((dot, index) => {
				dot.classList.toggle('active', index === currentIndex);
			});
		}

		function updateProgress() {
			if (progress) {
				const progressWidth = (currentIndex / (slides.length - 1)) * 100;
				progress.style.width = `${progressWidth}%`;
			}
		}

		// Add click handlers to dots
		dots.forEach((dot, index) => {
			dot.addEventListener('click', () => {
				currentIndex = index;
				setPositionByIndex();
				updateDots();
				updateProgress();
			});
		});

		// Initial setup
		setPositionByIndex();
		updateDots();
		updateProgress();

		// Handle resize
		window.addEventListener('resize', () => {
			setPositionByIndex();
		});
	});
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', initCarousel);