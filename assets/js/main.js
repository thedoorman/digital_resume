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
	const track = container.querySelector('.carousel-track');
	const slides = document.querySelectorAll('.carousel-slide');
	const dots = document.querySelectorAll('.carousel-dot');
	const progressBar = container.querySelector('.progress-bar');
	
	let currentIndex = 0;
	let startX = 0;
	let scrollLeft = 0;
	let isDragging = false;

	// Initialize link previews
	slides.forEach(slide => {
		const url = slide.href;
		const imageEl = slide.querySelector('img');
		const previewContainer = imageEl.closest('.preview-image');
		
		previewContainer.classList.add('loading');
		
		fetchLinkPreview(url).then(data => {
			if (data?.image?.url) {
				imageEl.src = data.image.url;
			} else {
				imageEl.src = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
			}
		}).catch(() => {
			imageEl.src = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
		}).finally(() => {
			imageEl.onload = () => previewContainer.classList.remove('loading');
		});
	});

	function updateProgress() {
		const progress = (currentIndex / (slides.length - 1)) * 100;
		progressBar.style.width = `${progress}%`;
	}

	function updateDots() {
		dots.forEach((dot, index) => {
			dot.classList.toggle('active', index === currentIndex);
		});
	}

	function scrollToSlide(index) {
		currentIndex = Math.max(0, Math.min(index, slides.length - 1));
		const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
		
		track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
		updateProgress();
		updateDots();
	}

	// Dot navigation
	dots.forEach((dot, index) => {
		dot.addEventListener('click', () => scrollToSlide(index));
	});

	// Touch/mouse handlers
	function startDragging(e) {
		isDragging = true;
		startX = e.type === 'mousedown' ? e.pageX : e.touches[0].pageX;
		scrollLeft = track.scrollLeft;
		track.style.cursor = 'grabbing';
	}

	function stopDragging() {
		if (!isDragging) return;
		isDragging = false;
		track.style.cursor = 'grab';
		
		const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
		const newIndex = Math.round(track.scrollLeft / slideWidth);
		scrollToSlide(newIndex);
	}

	function whileDragging(e) {
		if (!isDragging) return;
		e.preventDefault();
		const x = e.type === 'mousemove' ? e.pageX : e.touches[0].pageX;
		const dist = x - startX;
		track.scrollLeft = scrollLeft - dist;
	}

	// Event listeners
	track.addEventListener('mousedown', startDragging);
	track.addEventListener('touchstart', startDragging);
	track.addEventListener('mousemove', whileDragging);
	track.addEventListener('touchmove', whileDragging);
	track.addEventListener('mouseup', stopDragging);
	track.addEventListener('mouseleave', stopDragging);
	track.addEventListener('touchend', stopDragging);

	// Keyboard navigation
	document.addEventListener('keydown', (e) => {
		if (e.key === 'ArrowLeft') scrollToSlide(currentIndex - 1);
		if (e.key === 'ArrowRight') scrollToSlide(currentIndex + 1);
	});

	// Initial setup
	updateProgress();
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', initCarousel);