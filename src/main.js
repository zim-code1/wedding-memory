import './style.css'

// --- 1. GALLERY DATA ---
const galleryItems = [
    { src: '/polar1.jpeg', caption: 'Official Wedding Photo' },
    { src: '/polar2.jpeg', caption: 'During the Wedding' },
    { src: '/polar3.jpeg', caption: 'The Official Picture' },
    { src: '/polar4.jpeg', caption: 'Bridesmaids & The Bride' },
    { src: '/polar5.jpeg', caption: 'Groomsmen & The Groom' },
    { src: '/polar6.jpeg', caption: 'Full View' },
    { src: '/polar7.jpeg', caption: 'The Wedding Showdown' },
    { src: '/polar8.jpeg', caption: 'The Vows' },
    { src: '/polar9.jpeg', caption: 'Family of the Groom' },
    { src: '/polar10.jpeg', caption: 'Family of the Bride' },
];

const track = document.getElementById('gallery-track');
const container = document.getElementById('gallery-container');

// --- 2. RENDER GALLERY ---
if (track && container) {
    const rotations = ['rotate-2', '-rotate-2', 'rotate-1', '-rotate-1', 'rotate-3'];
    
    const createCard = (item, index) => {
        const rotation = rotations[index % rotations.length];
        return `
        <div class="gallery-item shrink-0 pr-6 md:pr-10 polaroid ${rotation} hover:rotate-0 hover:scale-110 hover:z-50 transition-all duration-500 ease-out select-none">
            <div class="bg-white p-3 md:p-4 pb-12 md:pb-16 shadow-xl transform origin-center rounded-sm">
                <img src="${item.src}" class="w-48 md:w-72 aspect-[3/4] object-cover gallery-img grayscale-[20%] transition pointer-events-none">
                <p class="font-wedding text-gray-900 text-lg md:text-2xl absolute bottom-4 md:bottom-6 left-0 w-full text-center">
                    ${item.caption}
                </p>
            </div>
        </div>`;
    };

    const singleSet = galleryItems.map((item, i) => createCard(item, i)).join('');
    track.innerHTML = singleSet + singleSet + singleSet;
}

// --- 3. AUTO-SCROLL ENGINE ---
let isHovered = false;
let isDragging = false;
let startX;
let scrollLeft;
let animationId;
const baseSpeed = 0.5; 

const scrollLoop = () => {
    if (!container) return;

    const singleSetWidth = track.scrollWidth / 3;
    
    if (!isHovered && !isDragging) {
        container.scrollLeft += baseSpeed;
    }

    if (container.scrollLeft >= singleSetWidth * 2) {
        container.scrollLeft = singleSetWidth + (container.scrollLeft - singleSetWidth * 2);
    } 
    else if (container.scrollLeft <= 0) {
        container.scrollLeft = singleSetWidth; 
    }

    animationId = requestAnimationFrame(scrollLoop);
};

if (container && track) {
    cancelAnimationFrame(animationId);
    setTimeout(() => {
        container.scrollLeft = track.scrollWidth / 3;
        scrollLoop();
    }, 100);
}


// --- 4. MOUSE DRAG LOGIC ---
if (container) {
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        isHovered = true; 
        container.style.cursor = 'grabbing'; 
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    const stopDrag = () => {
        isDragging = false;
        isHovered = false; 
        container.style.cursor = 'grab';
    };

    window.addEventListener('mouseup', () => {
        if (isDragging) stopDrag();
    });
    
    container.addEventListener('mouseleave', () => {
        if (!isDragging) isHovered = false;
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); 
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2; 
        container.scrollLeft = scrollLeft - walk;
    });
    
    container.addEventListener('mouseenter', () => { 
        isHovered = true; 
        container.style.cursor = 'grab'; 
    });
}


// --- 5. EXTRAS ---

// Mobile Menu
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            setTimeout(() => { mobileMenu.classList.remove('opacity-0'); }, 10);
            mobileBtn.textContent = '✕';
        } else {
            mobileMenu.classList.add('opacity-0');
            setTimeout(() => { mobileMenu.classList.add('hidden'); }, 300);
            mobileBtn.textContent = '≡';
        }
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('opacity-0');
            setTimeout(() => { mobileMenu.classList.add('hidden'); }, 300);
            mobileBtn.textContent = '≡';
        });
    });
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('close-btn');

if (track && lightbox) {
    track.addEventListener('click', (e) => {
        if (isDragging) return;

        const card = e.target.closest('.gallery-item');
        if (card) {
            const img = card.querySelector('img');
            lightboxImg.src = img.src;
            lightbox.classList.remove('hidden');
            setTimeout(() => {
                lightbox.classList.remove('opacity-0');
                lightboxImg.classList.remove('scale-95');
                lightboxImg.classList.add('scale-100');
            }, 10);
        }
    });

    const closeLightbox = () => {
        lightbox.classList.add('opacity-0');
        lightboxImg.classList.add('scale-95');
        lightboxImg.classList.remove('scale-100');
        setTimeout(() => { lightbox.classList.add('hidden'); }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

// --- MUSIC AUTO-PLAY ENGINE (UPDATED) ---
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

if (musicBtn && bgMusic) {
    
    // Helper to update UI
    const updateMusicUI = (isPlaying) => {
        if (isPlaying) {
            playIcon.classList.add('hidden');   
            pauseIcon.classList.remove('hidden'); 
            musicBtn.classList.add('bg-white/20', 'border-white', 'animate-pulse');
        } else {
            playIcon.classList.remove('hidden'); 
            pauseIcon.classList.add('hidden');   
            musicBtn.classList.remove('bg-white/20', 'border-white', 'animate-pulse');
        }
    };

    // 1. Manual Toggle
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Don't trigger auto-play listeners
        if (bgMusic.paused) {
            bgMusic.play().then(() => updateMusicUI(true));
        } else {
            bgMusic.pause();
            updateMusicUI(false);
        }
    });

    // 2. Auto-Play Trap
    const attemptAutoPlay = () => {
        bgMusic.volume = 0.4; // Set reasonable volume
        const playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    // Success!
                    updateMusicUI(true);
                    // Clean up listeners
                    document.removeEventListener('click', attemptAutoPlay);
                    document.removeEventListener('scroll', attemptAutoPlay);
                })
                .catch(error => {
                    // Blocked by browser. Wait for user interaction.
                    console.log("Autoplay waiting for interaction...");
                    updateMusicUI(false);
                });
        }
    };

    // Try immediately
    attemptAutoPlay();

    // Try again on first interaction
    document.addEventListener('click', attemptAutoPlay, { once: true });
    document.addEventListener('scroll', attemptAutoPlay, { once: true });
}

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('loaded');
});

// Dossier Switcher
const btnGroom = document.getElementById('btn-groom');
const btnBride = document.getElementById('btn-bride');
const fileGroom = document.getElementById('file-groom');
const fileBride = document.getElementById('file-bride');

if (btnGroom && btnBride && fileGroom && fileBride) {
    btnGroom.addEventListener('click', () => {
        btnGroom.classList.add('border-white', 'text-white');
        btnGroom.classList.remove('border-transparent', 'text-gray-400');
        btnBride.classList.add('border-transparent', 'text-gray-400');
        btnBride.classList.remove('border-white', 'text-white');
        fileGroom.classList.remove('opacity-0', 'translate-x-[-20px]', 'absolute', 'pointer-events-none');
        fileGroom.classList.add('opacity-100', 'translate-x-0', 'relative', 'z-20');
        fileBride.classList.remove('opacity-100', 'translate-x-0', 'relative', 'z-20');
        fileBride.classList.add('opacity-0', 'translate-x-10', 'absolute', 'pointer-events-none');
    });

    btnBride.addEventListener('click', () => {
        btnBride.classList.add('border-white', 'text-white');
        btnBride.classList.remove('border-transparent', 'text-gray-400');
        btnGroom.classList.add('border-transparent', 'text-gray-400');
        btnGroom.classList.remove('border-white', 'text-white');
        fileBride.classList.remove('opacity-0', 'translate-x-10', 'absolute', 'pointer-events-none');
        fileBride.classList.add('opacity-100', 'translate-x-0', 'relative', 'z-20');
        fileGroom.classList.remove('opacity-100', 'translate-x-0', 'relative', 'z-20');
        fileGroom.classList.add('opacity-0', 'translate-x-[-20px]', 'absolute', 'pointer-events-none');
    });
}

// --- 6. OPTIMIZED ENTOURAGE LOGIC ---
window.openEnvelope = () => {
    const flap = document.getElementById('envelope-flap');
    const seal = document.getElementById('wax-seal');
    const label = document.getElementById('envelope-label');
    const letter = document.getElementById('opened-letter');
    
    seal.style.opacity = '0';
    seal.style.transform = 'translate(-50%, -50px) scale(1.5)';
    label.style.opacity = '0';

    flap.style.transform = 'rotateX(180deg)';
    flap.style.zIndex = '10';

    setTimeout(() => {
        letter.classList.remove('hidden');
        requestAnimationFrame(() => {
            letter.classList.remove('opacity-0');
            letter.classList.add('opacity-100');
        });
    }, 150); 
};

window.closeEnvelope = () => {
    const letter = document.getElementById('opened-letter');
    const flap = document.getElementById('envelope-flap');
    const seal = document.getElementById('wax-seal');
    const label = document.getElementById('envelope-label');

    letter.classList.remove('opacity-100');
    letter.classList.add('opacity-0');
    
    setTimeout(() => {
        letter.classList.add('hidden');
        
        flap.style.transform = 'rotateX(0deg)';
        flap.style.zIndex = '30';

        setTimeout(() => {
            label.style.opacity = '1';
            seal.style.opacity = '1';
            seal.style.transform = ''; 
        }, 300);

    }, 300); 
};

window.flipPage = (toPage) => {
    const p1 = document.getElementById('page-1');
    const p2 = document.getElementById('page-2');
    const contentContainer = document.getElementById('letter-content');

    contentContainer.scrollTop = 0;
    if (toPage === 2) {
        p1.classList.add('hidden');
        p2.classList.remove('hidden');
    } else {
        p2.classList.add('hidden');
        p1.classList.remove('hidden');
    }
};