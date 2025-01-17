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
	const container = document.querySelector('.carousel-container');
	if (!container) return;

	const track = container.querySelector('.carousel-track');
	const slides = container.querySelectorAll('.carousel-slide');
	const dots = container.querySelectorAll('.carousel-dot');
	
	let currentIndex = 0;
	let slidesPerView = 1;
	let startX = 0;
	let currentX = 0;
	let isDragging = false;

	function updateSlidesPerView() {
		const width = window.innerWidth;
		if (width >= 1200) {
			slidesPerView = 3;
		} else if (width >= 768) {
			slidesPerView = 2;
		} else {
			slidesPerView = 1;
		}

		// Update slide widths
		const slideWidth = 100 / slidesPerView;
		slides.forEach(slide => {
			slide.style.flex = `0 0 ${slideWidth}%`;
			slide.style.width = `${slideWidth}%`;
		});
		
		// Set track width to accommodate all slides
		track.style.width = `${(slides.length / slidesPerView) * 100}%`;
		
		const totalPages = Math.ceil(slides.length / slidesPerView);
		currentIndex = Math.min(currentIndex, totalPages - 1);
		
		updateNavigation();
		updateCarousel();
	}

	function updateNavigation() {
		const totalPages = Math.ceil(slides.length / slidesPerView);
		
		dots.forEach((dot, i) => {
			dot.style.display = i < totalPages ? 'block' : 'none';
			dot.classList.toggle('active', i === currentIndex);
			dot.style.cursor = 'pointer';
			
			dot.removeEventListener('click', dot.clickHandler);
			dot.clickHandler = () => {
				if (i !== currentIndex) {
					currentIndex = i;
					updateCarousel(true);
				}
			};
			dot.addEventListener('click', dot.clickHandler);
		});
	}

	function updateCarousel(animate = true) {
		const slideWidth = 100 / slidesPerView;
		const offset = currentIndex * -slideWidth;
		track.style.transition = animate ? 'transform 0.3s ease' : 'none';
		track.style.transform = `translateX(${offset}%)`;
		updateNavigation();
	}

	// Touch/Mouse drag handlers
	function handleDragStart(e) {
		isDragging = true;
		startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
		currentX = startX;
		track.style.transition = 'none';
	}

	function handleDragMove(e) {
		if (!isDragging) return;
		
		e.preventDefault();
		currentX = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
		const diff = currentX - startX;
		const totalPages = Math.ceil(slides.length / slidesPerView);
		const maxOffset = -(100 / slidesPerView) * (totalPages - 1);
		
		let offset = (currentIndex * -(100 / slidesPerView)) + (diff / track.offsetWidth * 100);
		offset = Math.max(maxOffset, Math.min(0, offset));
		
		track.style.transform = `translateX(${offset}%)`;
	}

	function handleDragEnd() {
		if (!isDragging) return;
		
		isDragging = false;
		const diff = currentX - startX;
		const threshold = track.offsetWidth * 0.2;
		const totalPages = Math.ceil(slides.length / slidesPerView);
		
		if (Math.abs(diff) > threshold) {
			if (diff > 0 && currentIndex > 0) {
				currentIndex--;
			} else if (diff < 0 && currentIndex < totalPages - 1) {
				currentIndex++;
			}
		}
		
		updateCarousel(true);
	}

	// Touch and mouse events
	track.addEventListener('mousedown', handleDragStart);
	track.addEventListener('touchstart', handleDragStart);
	
	window.addEventListener('mousemove', handleDragMove);
	window.addEventListener('touchmove', handleDragMove, { passive: false });
	
	window.addEventListener('mouseup', handleDragEnd);
	window.addEventListener('touchend', handleDragEnd);

	// Keyboard navigation
	document.addEventListener('keydown', (e) => {
		const totalPages = Math.ceil(slides.length / slidesPerView);
		
		if (e.key === 'ArrowLeft' && currentIndex > 0) {
			currentIndex--;
			updateCarousel();
		}
		if (e.key === 'ArrowRight' && currentIndex < totalPages - 1) {
			currentIndex++;
			updateCarousel();
		}
	});

	// Handle resize
	let resizeTimer;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(updateSlidesPerView, 100);
	});

	// Initialize
	updateSlidesPerView();
}