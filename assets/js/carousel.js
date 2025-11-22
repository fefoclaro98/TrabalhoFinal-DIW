// ===== CONFIGURATION =====
const CAROUSEL_CONFIG = {
    banner: {
        autoPlayInterval: 5000
    },
    vitrine: {
        cardWidth: 280,
        cardsPerPage: 4,
        cardsPerSet: 8,
        duplicationFactor: 5,
        transitionDuration: '0.8s',
        transitionTiming: 'cubic-bezier(0.77, 0, 0.175, 1)'
    }
};

// ===== BANNER CAROUSEL =====
const bannerSlides = document.querySelector('.banner-container .slides');
const bannerDots = document.querySelectorAll('.banner-nav .banner-dot');
let currentBannerSlide = 0;
const totalBannerSlides = document.querySelectorAll('.banner-container .slide').length;
let bannerInterval;

function changeBannerSlide(index) {
    currentBannerSlide = index;
    bannerSlides.style.transform = `translateX(-${currentBannerSlide * 100}%)`;
    bannerDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentBannerSlide);
    });
}

function startBannerAutoPlay() {
    clearInterval(bannerInterval);
    bannerInterval = setInterval(() => {
        currentBannerSlide = (currentBannerSlide + 1) % totalBannerSlides;
        changeBannerSlide(currentBannerSlide);
    }, CAROUSEL_CONFIG.banner.autoPlayInterval);
}

function stopBannerAutoPlay() {
    clearInterval(bannerInterval);
}

// Event Listeners for Banner
bannerDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        changeBannerSlide(index);
        startBannerAutoPlay(); // Reset timer on manual interaction
    });
});

const bannerContainer = document.querySelector('.banner-container');
if (bannerContainer) {
    bannerContainer.addEventListener('mouseenter', stopBannerAutoPlay);
    bannerContainer.addEventListener('mouseleave', startBannerAutoPlay);
}

// Initialize Banner
changeBannerSlide(0);
startBannerAutoPlay();


// ===== VITRINE CAROUSEL =====
const topTrack = document.querySelector('.top-track');
const botTrack = document.querySelector('.bot-track');
const prevBtn = document.querySelector('.vitrine-nav .prev-btn');
const nextBtn = document.querySelector('.vitrine-nav .next-btn');

// Populate tracks with data
if (typeof popularTrack === 'function' && typeof linha1 !== 'undefined' && typeof linha2 !== 'undefined') {
    popularTrack(topTrack, linha1);
    popularTrack(botTrack, linha2);
}

// Infinite Loop Logic
const topCardsOriginal = topTrack.innerHTML;
const botCardsOriginal = botTrack.innerHTML;

// Duplicate content for infinite scroll illusion
topTrack.innerHTML = topCardsOriginal.repeat(CAROUSEL_CONFIG.vitrine.duplicationFactor);
botTrack.innerHTML = botCardsOriginal.repeat(CAROUSEL_CONFIG.vitrine.duplicationFactor);

// Calculations
const { cardWidth, cardsPerPage, cardsPerSet, transitionDuration, transitionTiming } = CAROUSEL_CONFIG.vitrine;
const jumpDistance = cardWidth * cardsPerPage;
const setWidth = cardsPerSet * cardWidth;

// Initial Positions (Start in the middle set)
let topPosition = -setWidth * 2;
let botPosition = -setWidth * 2 - jumpDistance;

// Apply Initial Styles
const setTrackStyles = (track, position) => {
    track.style.transform = `translateX(${position}px)`;
    track.style.transition = `transform ${transitionDuration} ${transitionTiming}`;
};

setTrackStyles(topTrack, topPosition);
setTrackStyles(botTrack, botPosition);

// Reset Logic boundaries
const minPosition = -setWidth * 3.5;
const maxPosition = -setWidth * 0.5;

function updateVitrinePosition() {
    topTrack.style.transform = `translateX(${topPosition}px)`;
    botTrack.style.transform = `translateX(${botPosition}px)`;
}

function performSilentReset(track, currentPos, adjustment) {
    track.style.transition = 'none';
    const newPos = currentPos + adjustment;
    track.style.transform = `translateX(${newPos}px)`;
    
    // Force reflow
    track.offsetHeight; 
    
    track.style.transition = `transform ${transitionDuration} ${transitionTiming}`;
    return newPos;
}

function resetIfNeeded() {
    // Reset Top Track
    if (topPosition <= minPosition) {
        topPosition = performSilentReset(topTrack, topPosition, setWidth);
    } else if (topPosition >= maxPosition) {
        topPosition = performSilentReset(topTrack, topPosition, -setWidth);
    }

    // Reset Bottom Track
    if (botPosition <= minPosition) {
        botPosition = performSilentReset(botTrack, botPosition, setWidth);
    } else if (botPosition >= maxPosition) {
        botPosition = performSilentReset(botTrack, botPosition, -setWidth);
    }
}

// Navigation Events
if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
        topPosition -= jumpDistance;
        botPosition += jumpDistance;
        updateVitrinePosition();
        setTimeout(resetIfNeeded, 900);
    });

    prevBtn.addEventListener('click', () => {
        topPosition += jumpDistance;
        botPosition -= jumpDistance;
        updateVitrinePosition();
        setTimeout(resetIfNeeded, 900);
    });
}
