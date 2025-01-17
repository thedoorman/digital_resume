document.addEventListener('DOMContentLoaded', () => {
	// Mobile menu functionality
	const menuButton = document.querySelector('.menu-button');
	const mainNav = document.querySelector('.main-nav');
	
	menuButton?.addEventListener('click', () => {
		mainNav.classList.toggle('active');
		menuButton.setAttribute('aria-expanded', 
			mainNav.classList.contains('active').toString()
		);
	});

	// Close menu when clicking outside
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.header') && mainNav.classList.contains('active')) {
			mainNav.classList.remove('active');
			menuButton.setAttribute('aria-expanded', 'false');
		}
	});

	// Close menu when clicking nav links
	document.querySelectorAll('.nav-list a').forEach(link => {
		link.addEventListener('click', () => {
			mainNav.classList.remove('active');
			menuButton.setAttribute('aria-expanded', 'false');
		});
	});

	// Scroll reveal
	const observerOptions = {
		root: null,
		rootMargin: '0px',
		threshold: 0.1
	};

	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.animation = `revealFromBottom var(--transition-slow) ease forwards`;
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Observe all major elements
	const elements = document.querySelectorAll('.content-card, .experience-card, .education-card, .skills-grid, .social-links');
	elements.forEach(el => observer.observe(el));

	// Smooth scroll
	document.querySelectorAll('a[href^="#"]').forEach(anchor => {
		anchor.addEventListener('click', function (e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				target.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				});
			}
		});
	});

	// Custom cursor (optional)
	const cursor = document.createElement('div');
	cursor.classList.add('custom-cursor');
	document.body.appendChild(cursor);

	document.addEventListener('mousemove', (e) => {
		cursor.style.left = e.clientX + 'px';
		cursor.style.top = e.clientY + 'px';
	});

	// Generate grid cells for decoration
	const gridCells = document.querySelector('.grid-cells');
	if (gridCells) {
		for (let i = 0; i < 64; i++) {
			const cell = document.createElement('div');
			cell.className = 'grid-cell';
			gridCells.appendChild(cell);
		}
	}
});

// Link Preview Handler
async function fetchLinkPreview(url) {
	try {
		const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error('Error fetching link preview:', error);
		return null;
	}
}

// Initialize link previews
document.addEventListener('DOMContentLoaded', async () => {
	const previews = document.querySelectorAll('.portfolio-preview');
	
	for (const preview of previews) {
		const url = preview.href;
		const imageEl = preview.querySelector('img');
		
		imageEl.closest('.preview-image').classList.add('loading');
		
		const data = await fetchLinkPreview(url);
		if (data && data.image && data.image.url) {
			imageEl.src = data.image.url;
		}
		
		imageEl.onload = () => {
			imageEl.closest('.preview-image').classList.remove('loading');
		};
	}
});

// Enhanced carousel functionality
function initCarousel() {
	const container = document.querySelector('.carousel-container');
	if (!container) return;

	const track = container.querySelector('.carousel-track');
	const slides = document.querySelectorAll('.carousel-slide');
	const dots = document.querySelectorAll('.carousel-dot');
	const progressBar = container.querySelector('.progress-bar');
	
	let currentIndex = 0;
	let startX = 0;
	let currentTranslate = 0;
	let prevTranslate = 0;
	let isDragging = false;
	let animationID = 0;

	// Prevent default behavior on touch
	slides.forEach(slide => {
		slide.addEventListener('dragstart', (e) => e.preventDefault());
		
		// Prevent click during swipe
		slide.addEventListener('click', (e) => {
			if (Math.abs(currentTranslate - prevTranslate) > 5) {
				e.preventDefault();
			}
		});
	});

	function getPositionX(event) {
		return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
	}

	function setSliderPosition() {
		track.style.transform = `translateX(${currentTranslate}px)`;
	}

	function animation() {
		setSliderPosition();
		if (isDragging) requestAnimationFrame(animation);
	}

	function updateProgress() {
		const progress = (currentIndex / (slides.length - 1)) * 100;
		progressBar.style.width = `${progress}%`;
	}

	function updateDots() {
		dots.forEach((dot, index) => {
			dot.classList.toggle('active', index === currentIndex);
		});
	}

	function setPositionByIndex() {
		const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
		currentTranslate = currentIndex * -slideWidth;
		prevTranslate = currentTranslate;
		setSliderPosition();
		updateProgress();
		updateDots();
	}

	// Touch handlers
	function touchStart(event) {
		isDragging = true;
		startX = getPositionX(event);
		animationID = requestAnimationFrame(animation);
		track.style.cursor = 'grabbing';
	}

	function touchMove(event) {
		if (!isDragging) return;
		
		const currentX = getPositionX(event);
		const diff = currentX - startX;
		currentTranslate = prevTranslate + diff;
	}

	function touchEnd() {
		isDragging = false;
		cancelAnimationFrame(animationID);
		track.style.cursor = 'grab';

		const movedBy = currentTranslate - prevTranslate;
		
		// Determine if slide should advance
		if (Math.abs(movedBy) > 100) {
			if (movedBy < 0 && currentIndex < slides.length - 1) {
				currentIndex += 1;
			} else if (movedBy > 0 && currentIndex > 0) {
				currentIndex -= 1;
			}
		}

		setPositionByIndex();
	}

	// Event Listeners
	track.addEventListener('touchstart', touchStart);
	track.addEventListener('touchmove', touchMove);
	track.addEventListener('touchend', touchEnd);
	track.addEventListener('mousedown', touchStart);
	track.addEventListener('mousemove', touchMove);
	track.addEventListener('mouseup', touchEnd);
	track.addEventListener('mouseleave', touchEnd);

	// Dot navigation
	dots.forEach((dot, index) => {
		dot.addEventListener('click', () => {
			currentIndex = index;
			setPositionByIndex();
		});
	});

	// Keyboard navigation
	document.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowLeft' && currentIndex > 0) {
			currentIndex -= 1;
			setPositionByIndex();
		}
		if (e.key === 'ArrowRight' && currentIndex < slides.length - 1) {
			currentIndex += 1;
			setPositionByIndex();
		}
	});

	// Window Resize
	window.addEventListener('resize', setPositionByIndex);

	// Initial setup
	setPositionByIndex();
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', initCarousel);

async function fetchGameDetails(url) {
	try {
		const response = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`, {
			timeout: 10000 // 10 second timeout
		});
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
		return await response.json();
	} catch (error) {
		console.error('Error fetching game details:', error);
		return null;
	}
}

// Menu functionality
function initMenu() {
	const menuButton = document.querySelector('.menu-button');
	const mainNav = document.querySelector('.main-nav');
	const navLinks = document.querySelectorAll('.nav-list a');

	if (menuButton && mainNav) {
		// Toggle menu
		menuButton.addEventListener('click', (e) => {
			e.stopPropagation();
			mainNav.classList.toggle('active');
			menuButton.setAttribute('aria-expanded', 
				mainNav.classList.contains('active').toString()
			);
			document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
		});

		// Close menu when clicking links
		navLinks.forEach(link => {
			link.addEventListener('click', () => {
				mainNav.classList.remove('active');
				menuButton.setAttribute('aria-expanded', 'false');
				document.body.style.overflow = '';
			});
		});

		// Close menu when clicking outside
		document.addEventListener('click', (e) => {
			if (mainNav.classList.contains('active') && !e.target.closest('.header')) {
				mainNav.classList.remove('active');
				menuButton.setAttribute('aria-expanded', 'false');
				document.body.style.overflow = '';
			}
		});

		// Handle escape key
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && mainNav.classList.contains('active')) {
				mainNav.classList.remove('active');
				menuButton.setAttribute('aria-expanded', 'false');
				document.body.style.overflow = '';
			}
		});
	}
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMenu);