/* ==========================================================================
   ViVoo - Client-Side Prototype Logic
   Features: TikTok Feed, Smart Seating POV, Apple Pay, Split Payment,
             Dynamic QR Wallet, UGC Curation Loop, and Simulation Engine.
   ========================================================================== */

// Register PWA Service Worker with auto-reload on update
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('[PWA] Service Worker registered:', reg.scope);
        
        // Force update check immediately on app startup
        reg.update();
        
        reg.addEventListener('updatefound', () => {
          const installingWorker = reg.installing;
          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New update installed. Reloading...');
            }
          });
        });
      })
      .catch(err => console.error('[PWA] Service Worker registration failed:', err));
  });

  // Automatically reload when a new service worker claims the page
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      console.log('[PWA] Controller changed, refreshing page...');
      window.location.reload();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {

  
  // --------------------------------------------------------------------------
  // 1. MOCK DATA & STATE MANAGEMENT
  // --------------------------------------------------------------------------
  
  // Global App State
  const state = {
    credit: 400, // Starting platform credit
    activeScreen: 'feed-screen',
    currentVibe: 'all',
    currentPlayingIndex: 0,
    selectedEvent: null,
    selectedSeat: null,
    groupBuyCount: 3,
    splitSession: null,
    tickets: [], // Purchased tickets
    isMuted: true
  };

  // Mock Events Database with local, range-request optimized video files
  const eventsData = [
    {
      id: 'derby',
      title: 'Prague Football Derby: Sparta vs Slavia',
      tag: 'Adrenalin',
      vibe: 'adrenalin',
      location: 'epet ARENA, Prague',
      date: 'Saturday, Oct 14 • 18:00',
      lineup: 'AC Sparta Praha vs SK Slavia Praha',
      weather: { temp: '16°C', text: 'Clear Sky', icon: 'clear' },
      videoUrl: './videos/derby.mp4',
      bgImg: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop',
      priceMin: 300,
      priceMax: 1200,
      sectors: [
        { name: 'Sektor C (Upper Gallery)', price: 350, povType: 'far-stadium' },
        { name: 'Sektor B (Mid Tier)', price: 650, povType: 'mid-stadium' },
        { name: 'Sektor A (Lower Pitchside)', price: 1100, povType: 'near-stadium' }
      ]
    },
    {
      id: 'techno',
      title: 'Basement Syndicate: Warehouse Techno Night',
      tag: 'Party',
      vibe: 'party',
      location: 'Hala 13, Holešovice',
      date: 'Friday, Oct 20 • 22:00',
      lineup: 'Boris Brejcha, Amelie Lens, DJ Shadow, Charlotte de Witte',
      weather: { temp: '18°C', text: 'Indoor Event', icon: 'indoor' },
      videoUrl: './videos/techno.mp4',
      bgImg: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop',
      priceMin: 400,
      priceMax: 1600,
      sectors: [
        { name: 'Warehouse General Admission', price: 450, povType: 'dancefloor-back' },
        { name: 'VIP Boiler Deck', price: 850, povType: 'dancefloor-front' },
        { name: 'Backstage Access Pass', price: 1500, povType: 'backstage' }
      ]
    },
    {
      id: 'basketball',
      title: 'Red Bull Half Court Basketball Finals',
      tag: 'Adrenalin',
      vibe: 'adrenalin',
      location: 'Riegrovy Sady, Prague',
      date: 'Sunday, Oct 15 • 15:00',
      lineup: 'Prague Streetball Elite & Guest Dunkers',
      weather: { temp: '19°C', text: 'Sunny Day', icon: 'clear' },
      videoUrl: './videos/basketball.mp4',
      bgImg: 'https://images.unsplash.com/photo-1544698310-74ea9d1c8258?w=800&auto=format&fit=crop',
      priceMin: 150,
      priceMax: 500,
      sectors: [
        { name: 'Grandstand Bleachers', price: 180, povType: 'dancefloor-back' },
        { name: 'Courtside VIP Bench', price: 450, povType: 'dancefloor-front' }
      ]
    },
    {
      id: 'summerbeats',
      title: 'Summer Beats Open Air Festival',
      tag: 'Party',
      vibe: 'party',
      location: 'Žluté lázně, Prague',
      date: 'Saturday, Aug 19 • 14:00',
      lineup: 'Solomun, Tale of Us, Adriatique, Keinemusik',
      weather: { temp: '26°C', text: 'Warm & Sunny', icon: 'clear' },
      videoUrl: './videos/summerbeats.mp4',
      bgImg: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop',
      priceMin: 490,
      priceMax: 1490,
      sectors: [
        { name: 'General Admission Beach Area', price: 550, povType: 'dancefloor-back' },
        { name: 'VIP Main Deck VIP Seating', price: 1200, povType: 'dancefloor-front' }
      ]
    },
    {
      id: 'ballet',
      title: 'Magical Water Fountain Light Show',
      tag: 'Klid',
      vibe: 'klid',
      location: 'Křižík Fountain, Exhibition Grounds',
      date: 'Sunday, Oct 22 • 19:30',
      lineup: 'Laterna Magika Dance Ensemble & Prague Symphony Orchestra',
      weather: { temp: '14°C', text: 'Light Breeze', icon: 'windy' },
      videoUrl: './videos/ballet.mp4',
      bgImg: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop',
      priceMin: 250,
      priceMax: 900,
      sectors: [
        { name: 'Grandstand Balcony C', price: 300, povType: 'fountain-far' },
        { name: 'Premium Terrace B', price: 550, povType: 'fountain-mid' },
        { name: 'Front VIP Row A', price: 850, povType: 'fountain-near' }
      ]
    },
    {
      id: 'flora',
      title: 'Flora Acoustic: Garden Symphony Concert',
      tag: 'Klid',
      vibe: 'klid',
      location: 'Flora Exhibition Grounds, Olomouc',
      date: 'Saturday, Oct 28 • 16:00',
      lineup: 'Olomouc Symphonic Soloists & Flora Acoustic Trio',
      weather: { temp: '15°C', text: 'Sunny Day', icon: 'clear' },
      videoUrl: './videos/flora.mp4',
      bgImg: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop',
      priceMin: 200,
      priceMax: 700,
      sectors: [
        { name: 'Sektor Garden A (Acoustic Pitch)', price: 250, povType: 'fountain-near' },
        { name: 'Sektor Terraces B (Elevated View)', price: 450, povType: 'fountain-mid' },
        { name: 'General Admission Balcony C', price: 650, povType: 'fountain-far' }
      ]
    }
  ];

  // Make a working copy of events for the feed
  let activeFeedEvents = [...eventsData];

  // --------------------------------------------------------------------------
  // 2. VIEW ROUTER (SPA navigation with View Transitions support)
  // --------------------------------------------------------------------------
  
  function navigateTo(screenId) {
    if (state.activeScreen === screenId) return;

    // Track previous screen before switching to detail views
    if (screenId === 'detail-screen') {
      state.previousScreen = state.activeScreen;
    }

    const oldScreen = document.getElementById(state.activeScreen);
    const newScreen = document.getElementById(screenId);

    const updateDOM = () => {
      oldScreen.classList.remove('active');
      newScreen.classList.add('active');
      
      // Bottom navigation capsule visibility
      const mainTabs = ['feed-screen', 'grid-screen', 'ticket-screen', 'profile-screen'];
      const capsuleNav = document.querySelector('.bottom-nav-capsule');
      if (mainTabs.includes(screenId)) {
        capsuleNav.classList.remove('hidden');
        syncCapsuleNav(screenId);
      } else {
        capsuleNav.classList.add('hidden');
      }

      // Screen specific entrance logic
      if (screenId === 'feed-screen') {
        playCurrentVideo();
      } else {
        pauseAllVideos();
      }

      if (screenId === 'grid-screen') {
        renderDiscoveryGrid();
      }

      if (screenId === 'ticket-screen') {
        renderTicketsList();
      }

      if (screenId === 'profile-screen') {
        renderProfileScreen();
      }

      state.activeScreen = screenId;
    };

    // Use view transitions API if supported
    if (document.startViewTransition) {
      document.startViewTransition(() => updateDOM());
    } else {
      updateDOM();
    }
  }

  function syncCapsuleNav(screenId) {
    const navButtons = document.querySelectorAll('.capsule-nav-item');
    navButtons.forEach(btn => {
      if (btn.dataset.screen === screenId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Back button routing
  document.getElementById('detail-back-btn').addEventListener('click', () => navigateTo(state.previousScreen || 'feed-screen'));
  document.getElementById('checkout-back-btn').addEventListener('click', () => navigateTo('detail-screen'));
  document.getElementById('ugc-back-btn').addEventListener('click', () => navigateTo('profile-screen'));

  // Global bottom nav capsule click bindings
  document.querySelectorAll('.capsule-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      navigateTo(btn.dataset.screen);
    });
  });

  // Feed profile badge navigates to profile
  const feedProfileBtn = document.getElementById('feed-header-profile-btn');
  if (feedProfileBtn) {
    feedProfileBtn.addEventListener('click', () => navigateTo('profile-screen'));
  }

  // --------------------------------------------------------------------------
  // 3. DISCOVERY FEED ENGINE
  // --------------------------------------------------------------------------
  
  const videoFeed = document.getElementById('video-feed');

  function renderFeed() {
    videoFeed.innerHTML = '';
    
    if (activeFeedEvents.length === 0) {
      videoFeed.innerHTML = `
        <div class="empty-tickets-view">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 12c0 5.52-4.48 10-10 10S3 17.52 3 12 7.48 2 13 2s10 4.48 10 10z"/><line x1="13" y1="8" x2="13" y2="12"/><line x1="13" y1="16" x2="13.01" y2="16"/></svg>
          <p>No vibe clips match this nálada filter.</p>
        </div>`;
      return;
    }

    activeFeedEvents.forEach((ev, idx) => {
      const isUGC = ev.isUGC ? ' (Social UGC Proof)' : '';
      const feedItem = document.createElement('div');
      feedItem.className = 'feed-item';
      feedItem.dataset.index = idx;
      
      state.savedEventIds = state.savedEventIds || [];
      const isSaved = state.savedEventIds.includes(ev.id);

      feedItem.innerHTML = `
        <video class="feed-video" loop playsinline autoplay muted poster="${ev.bgImg}">
          <source src="${ev.videoUrl}" type="video/mp4">
        </video>
        
        <!-- Video State Indicator -->
        <div class="video-state-overlay">
          <svg class="overlay-icon" width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>

        <div class="feed-overlay">
          <div class="feed-meta" id="meta-cta-${idx}">
            <div class="feed-meta-header-row">
              <span class="feed-meta-tag tag-${ev.vibe}">${ev.tag}${isUGC}</span>
              <span class="feed-meta-organizer">viVoo • <span class="follow-label">Follow</span></span>
            </div>
            <h2>${ev.title}</h2>
            <div class="feed-quick-details">
              <span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"/><circle cx="12" cy="10" r="3"/></svg>
                ${ev.location.split(',')[0]}
              </span>
              <span class="meta-dot">•</span>
              <span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                ${ev.date.split('•')[0].trim()}
              </span>
            </div>
            <div class="feed-music-row">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="music-icon"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              <div class="music-ticker">
                <span class="music-ticker-inner">${ev.lineup} • Original Audio</span>
              </div>
            </div>
          </div>
          
          <div class="feed-actions">
            <!-- Like Button -->
            <button class="action-item btn-like-feed">
              <svg class="heart-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span class="action-label">2.4K</span>
            </button>

            <!-- Save Bookmark -->
            <button class="action-item btn-save-feed ${isSaved ? 'saved' : ''}">
              <svg class="save-icon" width="24" height="24" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              <span class="action-label">Save</span>
            </button>

            <!-- Direct Ticket Buy Checkout -->
            <button class="action-item btn-ticket-feed">
              <svg class="ticket-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><line x1="9" y1="5" x2="9" y2="19"/><line x1="15" y1="5" x2="15" y2="19"/></svg>
              <span class="action-label">Ticket</span>
            </button>

            <!-- Sound Toggle -->
            <button class="action-item btn-sound">
              <svg class="sound-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                ${state.isMuted 
                  ? '<line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z"/>' 
                  : '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>'}
              </svg>
              <span class="action-label">${state.isMuted ? 'Muted' : 'Sound'}</span>
            </button>

            <!-- Spinning Vinyl Record Album Art -->
            <div class="music-disc-spinner" id="disc-${idx}">
              <img src="${ev.bgImg}" alt="album art">
            </div>
          </div>
        </div>

        <!-- Progress bar tracking timeline -->
        <div class="video-progress-bar-outer">
          <div class="video-progress-bar-inner" id="progress-${idx}"></div>
        </div>
      `;
      
      const video = feedItem.querySelector('.feed-video');
      const soundBtn = feedItem.querySelector('.btn-sound');
      const saveBtn = feedItem.querySelector('.btn-save-feed');
      const likeBtn = feedItem.querySelector('.btn-like-feed');
      const ticketBtn = feedItem.querySelector('.btn-ticket-feed');
      const metaCta = feedItem.querySelector('.feed-meta');
      const overlay = feedItem.querySelector('.video-state-overlay');
      const overlayIcon = feedItem.querySelector('.overlay-icon');
      const discSpinner = feedItem.querySelector(`#disc-${idx}`);

      // Click video: Toggle Play/Pause
      video.addEventListener('click', () => {
        if (video.paused) {
          video.play();
          overlayIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon
        } else {
          video.pause();
          overlayIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; // Pause icon
        }
        overlay.classList.remove('trigger-anim');
        void overlay.offsetWidth; // Trigger reflow
        overlay.classList.add('trigger-anim');
      });

      // Sound button click
      soundBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMuteAll();
      });

      // Like button click
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const likeIcon = likeBtn.querySelector('.heart-icon');
        const likeLbl = likeBtn.querySelector('.action-label');
        const isLiked = likeBtn.classList.toggle('liked');
        if (isLiked) {
          likeIcon.setAttribute('fill', 'var(--color-accent-crimson)');
          likeIcon.setAttribute('stroke', 'var(--color-accent-crimson)');
          likeLbl.textContent = '2.5K';
        } else {
          likeIcon.setAttribute('fill', 'none');
          likeIcon.setAttribute('stroke', 'currentColor');
          likeLbl.textContent = '2.4K';
        }
      });

      // Save Bookmark button click
      saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.savedEventIds = state.savedEventIds || [];
        const index = state.savedEventIds.indexOf(ev.id);
        const saveIcon = saveBtn.querySelector('.save-icon');
        if (index > -1) {
          state.savedEventIds.splice(index, 1);
          saveBtn.classList.remove('saved');
          saveIcon.setAttribute('fill', 'none');
        } else {
          state.savedEventIds.push(ev.id);
          saveBtn.classList.add('saved');
          saveIcon.setAttribute('fill', 'currentColor');
        }
      });

      // Ticket button click (Instantly opens detail checkout page)
      ticketBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEventDetails(ev);
      });

      // Clicking bottom left details opens detail page
      metaCta.addEventListener('click', (e) => {
        e.stopPropagation();
        openEventDetails(ev);
      });

      // Progress bar updater
      video.addEventListener('timeupdate', () => {
        if (!isNaN(video.duration)) {
          const percent = (video.currentTime / video.duration) * 100;
          const progressBar = feedItem.querySelector(`#progress-${idx}`);
          if (progressBar) {
            progressBar.style.width = `${percent}%`;
          }
        }
      });

      video.addEventListener('play', () => {
        if (discSpinner) discSpinner.classList.remove('paused');
      });

      video.addEventListener('pause', () => {
        if (discSpinner) discSpinner.classList.add('paused');
      });

      videoFeed.appendChild(feedItem);
    });

    // Start checking scroll to play videos
    setupFeedScrollListener();
    playCurrentVideo();
  }

  function setupFeedScrollListener() {
    videoFeed.addEventListener('scroll', debounce(() => {
      const items = videoFeed.querySelectorAll('.feed-item');
      let currentVisibleIndex = 0;
      let maxVisibleHeight = 0;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const containerRect = videoFeed.getBoundingClientRect();
        
        // Calculate intersection height
        const visibleHeight = Math.max(0, Math.min(rect.bottom, containerRect.bottom) - Math.max(rect.top, containerRect.top));
        if (visibleHeight > maxVisibleHeight) {
          maxVisibleHeight = visibleHeight;
          currentVisibleIndex = parseInt(item.dataset.index);
        }
      });

      if (state.currentPlayingIndex !== currentVisibleIndex) {
        state.currentPlayingIndex = currentVisibleIndex;
        playCurrentVideo();
      }
    }, 100));
  }

  function playCurrentVideo() {
    const items = videoFeed.querySelectorAll('.feed-item');
    if (items.length === 0) return;

    items.forEach((item, idx) => {
      const video = item.querySelector('.feed-video');
      if (!video) return;

      // Sync mute status
      video.muted = state.isMuted;

      if (idx === state.currentPlayingIndex) {
        if (video.paused) {
          // Play matching video element
          video.play().catch(err => {
            console.log('[PWA] Autoplay blocked, trying muted play:', err);
            video.muted = true;
            video.play().catch(e => console.error('[PWA] Failed to play muted video:', e));
          });
        }
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }

  function pauseAllVideos() {
    const videos = videoFeed.querySelectorAll('.feed-video');
    videos.forEach(v => v.pause());
  }

  function toggleMuteAll() {
    state.isMuted = !state.isMuted;
    const videos = videoFeed.querySelectorAll('.feed-video');
    videos.forEach(v => v.muted = state.isMuted);

    // Update sound icons in the feed DOM
    renderFeedSoundIcons();
  }

  function renderFeedSoundIcons() {
    const items = videoFeed.querySelectorAll('.feed-item');
    items.forEach(item => {
      const soundBtn = item.querySelector('.btn-sound');
      if (soundBtn) {
        soundBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            ${state.isMuted 
              ? '<line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v6a3 3 0 0 0 3 3h1.586l4.707 4.707A1 1 0 0 0 20 22V4a1 1 0 0 0-1.707-.707L13.586 8H12a3 3 0 0 0-3 3z"/>' 
              : '<path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/>'}
          </svg>
        `;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3.1 DYNAMIC TIKTOK-STYLE HEADER TABS & SWIPE RECOGNITION
  // --------------------------------------------------------------------------
  
  const videoFeedContainer = document.getElementById('video-feed');
  const vibes = ['all', 'party', 'adrenalin', 'klid'];

  // Switch vibe function
  function switchVibe(selectedVibe) {
    state.currentVibe = selectedVibe;
    state.gridVibeFilter = selectedVibe;
    state.currentPlayingIndex = 0;

    // 1. Sync TikTok Tab highlights
    document.querySelectorAll('.tiktok-tab').forEach(tab => {
      if (tab.dataset.vibe === selectedVibe) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    // 2. Sync Search Grid fast filter pills
    document.querySelectorAll('.fast-filter-pill').forEach(pill => {
      if (pill.dataset.vibe === selectedVibe) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // 3. Filter feed content
    if (selectedVibe === 'all') {
      activeFeedEvents = [...eventsData];
    } else {
      activeFeedEvents = eventsData.filter(e => e.vibe === selectedVibe);
    }

    // 4. Re-render views
    renderFeed();
    renderDiscoveryGrid();
  }

  // Bind tap events on TikTok Tab headers
  document.querySelectorAll('.tiktok-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      switchVibe(tab.dataset.vibe);
    });
  });

  // Bind swipe gestures on the vertical feed container
  if (videoFeedContainer) {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    videoFeedContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    videoFeedContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Swipe threshold requirements:
      // deltaX > 60: swipe right (move to previous vibe)
      // deltaX < -60: swipe left (move to next vibe)
      // Math.abs(deltaY) < 40: ensures gesture is mostly horizontal to not block vertical scrolls
      if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 45) {
        const currentActive = state.currentVibe || 'all';
        const currentIndex = vibes.indexOf(currentActive);
        
        if (deltaX < 0) {
          // Swipe Left -> Next Vibe
          if (currentIndex < vibes.length - 1) {
            switchVibe(vibes[currentIndex + 1]);
          }
        } else {
          // Swipe Right -> Previous Vibe
          if (currentIndex > 0) {
            switchVibe(vibes[currentIndex - 1]);
          }
        }
      }
    }, { passive: true });
  }

  // Fast filter pills on discovery grid
  document.querySelectorAll('.fast-filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      switchVibe(pill.dataset.vibe);
    });
  });

  // Search input typing handler
  const searchInput = document.getElementById('grid-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.gridSearchQuery = e.target.value;
      renderDiscoveryGrid();
    });
  }

  // Render Discovery Grid lists (Zábava v Praze & Zábava v Olomouci)
  function renderDiscoveryGrid() {
    const pragueWrapper = document.getElementById('cards-prague');
    const olomoucWrapper = document.getElementById('cards-olomouc');
    
    if (!pragueWrapper || !olomoucWrapper) return;

    pragueWrapper.innerHTML = '';
    olomoucWrapper.innerHTML = '';

    const query = (state.gridSearchQuery || '').toLowerCase().trim();
    const vibe = state.gridVibeFilter || 'all';

    // Filter events
    let filtered = [...eventsData];
    if (vibe !== 'all') {
      filtered = filtered.filter(ev => ev.vibe === vibe);
    }
    if (query) {
      filtered = filtered.filter(ev => 
        ev.title.toLowerCase().includes(query) || 
        ev.lineup.toLowerCase().includes(query) ||
        ev.location.toLowerCase().includes(query)
      );
    }

    // Split by location
    const pragueEvents = filtered.filter(ev => 
      ev.location.toLowerCase().includes('prague') || 
      ev.location.toLowerCase().includes('praha') ||
      ev.location.toLowerCase().includes('holesovice')
    );

    const olomoucEvents = filtered.filter(ev => 
      ev.location.toLowerCase().includes('olomouc')
    );

    // Populate Prague row
    if (pragueEvents.length === 0) {
      pragueWrapper.innerHTML = `<span class="empty-cards-msg">Žádné akce v Praze</span>`;
    } else {
      pragueEvents.forEach(ev => {
        pragueWrapper.appendChild(createEventCardElement(ev));
      });
    }

    // Populate Olomouc row
    if (olomoucEvents.length === 0) {
      olomoucWrapper.innerHTML = `<span class="empty-cards-msg">Žádné akce v Olomouci</span>`;
    } else {
      olomoucEvents.forEach(ev => {
        olomoucWrapper.appendChild(createEventCardElement(ev));
      });
    }
  }

  // Helper to construct event card (image4.png)
  function createEventCardElement(ev) {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    card.innerHTML = `
      <div class="card-thumbnail-wrapper">
        <img src="${ev.bgImg}" alt="${ev.title}" class="card-image" loading="lazy">
        <div class="card-play-icon">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
        </div>
      </div>
      <div class="card-details">
        <span class="card-title">${ev.title}</span>
        <span class="card-desc">${ev.date.split('•')[0].trim()} • ${ev.priceMin} CZK+</span>
        <span class="card-venue">${ev.location.split(',')[0]}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      openEventDetails(ev);
    });

    return card;
  }

  // Render Profile/Cashless wallet page details
  function renderProfileScreen() {
    const balance = document.getElementById('profile-wallet-credit');
    if (balance) {
      balance.textContent = state.credit;
    }
  }

  // Debouncer helper
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Initialize feed
  renderFeed();

  // --------------------------------------------------------------------------
  // 4. ACTION DETAIL & SMART SEATING ENGINE
  // --------------------------------------------------------------------------
  
  const budgetSlider = document.getElementById('seating-budget-slider');
  const budgetValueDisp = document.getElementById('seating-budget-value');
  const allocatedSeatName = document.getElementById('allocated-seat-name');
  const allocatedSeatPrice = document.getElementById('allocated-seat-price');
  const stickyCtaSeat = document.getElementById('sticky-cta-seat');

  function openEventDetails(eventObj) {
    state.selectedEvent = eventObj;
    
    // Set text elements
    document.getElementById('detail-event-title').textContent = eventObj.title;
    document.getElementById('detail-event-tag').textContent = eventObj.tag.replace(/⚡|🎉|🍃/g, '').trim();
    document.getElementById('detail-event-tag').className = `event-tag tag-${eventObj.vibe}`;
    document.getElementById('detail-event-location').textContent = eventObj.location;
    document.getElementById('detail-event-date').textContent = eventObj.date;
    document.getElementById('detail-event-lineup').textContent = eventObj.lineup;
    document.getElementById('detail-event-weather').textContent = `${eventObj.weather.temp} — ${eventObj.weather.text}`;
    
    // Set weather icon
    renderWeatherIcon(eventObj.weather.icon);

    // Set Hero Background Image
    document.getElementById('detail-hero-bg').style.backgroundImage = `url(${eventObj.bgImg})`;

    // Reset budget slider range constraints based on event pricing
    budgetSlider.min = eventObj.priceMin;
    budgetSlider.max = eventObj.priceMax;
    budgetSlider.value = Math.round((eventObj.priceMin + eventObj.priceMax) / 2);
    
    updateSeatSelection();
    navigateTo('detail-screen');
  }

  function renderWeatherIcon(iconType) {
    const weatherIconContainer = document.getElementById('detail-weather-icon');
    let svgContent = '';
    
    if (iconType === 'clear') {
      svgContent = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    } else if (iconType === 'windy') {
      svgContent = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/></svg>`;
    } else {
      // Indoor / House icon
      svgContent = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
    }
    
    weatherIconContainer.innerHTML = svgContent;
  }

  // Seat Allocator matching budget
  function updateSeatSelection() {
    if (!state.selectedEvent) return;

    const budget = parseInt(budgetSlider.value);
    budgetValueDisp.textContent = budget;

    // Find best sector matching budget limits
    // We want the most premium sector that has price <= budget
    // If all are more expensive, assign cheapest. If budget allows multiple, choose most expensive <= budget.
    const sectors = state.selectedEvent.sectors;
    let selectedSector = sectors[0]; // Default cheapest
    
    sectors.forEach(sec => {
      if (sec.price <= budget) {
        selectedSector = sec;
      }
    });

    state.selectedSeat = {
      name: `${selectedSector.name}, Řada ${Math.floor(Math.random() * 8) + 1}, Sedadlo ${Math.floor(Math.random() * 20) + 1}`,
      price: selectedSector.price,
      povType: selectedSector.povType
    };

    // Update UI elements
    allocatedSeatName.textContent = state.selectedSeat.name.split(',')[0] + ', ' + state.selectedSeat.name.split(',')[1];
    allocatedSeatPrice.textContent = state.selectedSeat.price;
    stickyCtaSeat.textContent = `${state.selectedSeat.name.split(',')[0]} (Price: ${state.selectedSeat.price} CZK)`;
    
    // Draw POV stadium representation
    drawSeatPOV(state.selectedSeat.povType);
  }

  budgetSlider.addEventListener('input', updateSeatSelection);

  // SVG POV visual stadium generator
  function drawSeatPOV(povType) {
    const canvas = document.getElementById('seat-pov-canvas');
    let svgMarkup = '';

    // Main coordinates / elements of stadium representation
    if (povType.includes('stadium')) {
      // Football Field
      const opacityC = povType === 'near-stadium' ? 1.0 : (povType === 'mid-stadium' ? 0.6 : 0.3);
      const strokeW = povType === 'near-stadium' ? 3 : (povType === 'mid-stadium' ? 2 : 1.5);
      const stageScale = povType === 'near-stadium' ? 1.3 : (povType === 'mid-stadium' ? 1.0 : 0.7);
      
      svgMarkup = `
        <!-- Background Dark Gradient -->
        <rect width="100%" height="100%" fill="#06060a"/>
        
        <!-- Stadium Lights Glow -->
        <circle cx="50" cy="20" r="100" fill="rgba(211, 16, 53, 0.15)" filter="blur(20px)"/>
        <circle cx="250" cy="20" r="100" fill="rgba(138, 15, 74, 0.15)" filter="blur(20px)"/>

        <!-- Football Pitch lines drawn in perspective -->
        <g transform="translate(150, 140) scale(${stageScale})" stroke="rgba(255, 255, 255, 0.25)" stroke-width="${strokeW}" fill="none">
          <!-- Outer border -->
          <polygon points="-70,-40 70,-40 100,10 -100,10" fill="rgba(16, 185, 129, ${0.1 + (opacityC*0.1)})"/>
          <!-- Halfway line -->
          <line x1="0" y1="-40" x2="0" y2="10" stroke="rgba(255, 255, 255, 0.3)"/>
          <!-- Penalty box near -->
          <polygon points="-40,10 -30,-15 30,-15 40,10" stroke="rgba(255,255,255,0.4)"/>
          <!-- Center Circle -->
          <ellipse cx="0" cy="-15" rx="20" ry="8" stroke="rgba(255, 255, 255, 0.3)"/>
          
          <!-- Crowd / Stadium walls behind -->
          <path d="M-90,-60 L90,-60 L80,-48 L-80,-48 Z" fill="rgba(255, 255, 255, 0.05)"/>
        </g>
        
        <!-- Spectator Hand Silhouettes in VIP rows -->
        ${povType === 'near-stadium' ? `
          <g fill="rgba(255,255,255,0.12)">
            <path d="M10,160 Q20,130 35,160 M70,160 Q75,135 90,160 M220,160 Q235,120 250,160 M270,160 Q280,140 290,160"/>
          </g>
        ` : ''}

        <!-- Seating sector viewpoint label overlay -->
        <text x="15" y="25" fill="#a0a0ab" font-size="9" font-family="'Outfit', sans-serif" font-weight="600" letter-spacing="0.5">VIEW FROM SEAT</text>
        <text x="15" y="42" fill="#fff" font-size="14" font-family="'Outfit', sans-serif" font-weight="700">
          ${povType === 'near-stadium' ? 'Pitchside VIP (Row 2)' : (povType === 'mid-stadium' ? 'Lower Grandstand' : 'Sky Gallery Section C')}
        </text>
      `;
    } else if (povType.includes('dancefloor') || povType === 'backstage') {
      // Concert venue stage POV
      const scaleS = povType === 'backstage' ? 1.5 : (povType === 'dancefloor-front' ? 1.1 : 0.7);
      const isBackstage = povType === 'backstage';
      
      svgMarkup = `
        <rect width="100%" height="100%" fill="#050508"/>
        
        <!-- Lasers rays -->
        <line x1="0" y1="10" x2="300" y2="150" stroke="rgba(211, 16, 53, 0.2)" stroke-width="2"/>
        <line x1="300" y1="10" x2="0" y2="150" stroke="rgba(138, 15, 74, 0.2)" stroke-width="2"/>
        <line x1="150" y1="10" x2="70" y2="160" stroke="rgba(211, 16, 53, 0.25)" stroke-width="3"/>
        <line x1="150" y1="10" x2="230" y2="160" stroke="rgba(211, 16, 53, 0.25)" stroke-width="3"/>

        <!-- Concert Stage -->
        <g transform="translate(150, ${isBackstage ? 130 : 90}) scale(${scaleS})">
          <!-- Stage floor -->
          <polygon points="-80,20 80,20 60,-10 -60,-10" fill="#0c0c0f" stroke="#222" stroke-width="1"/>
          <!-- DJ Booth / Deck -->
          <rect x="-20" y="-5" width="40" height="18" fill="#15151c" stroke="var(--color-accent-crimson)" stroke-width="1.5"/>
          <circle cx="-10" cy="0" r="3" fill="var(--color-accent-crimson)"/>
          <circle cx="10" cy="0" r="3" fill="#fff"/>
          
          <!-- Stage Background screens -->
          <rect x="-55" y="-35" width="110" height="25" fill="rgba(211, 16, 53, 0.1)"/>
          <!-- LED graphic simulator circles -->
          <circle cx="-30" cy="-22" r="6" fill="rgba(211, 16, 53, 0.3)"/>
          <circle cx="0" cy="-22" r="8" fill="rgba(138, 15, 74, 0.4)"/>
          <circle cx="30" cy="-22" r="6" fill="rgba(211, 16, 53, 0.3)"/>
        </g>
        
        <!-- Audience crowd silhouettes (foreground) -->
        ${!isBackstage ? `
          <g fill="rgba(255,255,255,${povType === 'dancefloor-front' ? 0.08 : 0.2})">
            <!-- Heads and raised hands -->
            <path d="M0,160 Q10,135 25,160 M40,160 Q48,138 58,160 M80,160 Q95,120 110,160 M140,160 Q150,130 162,160 M200,160 Q215,125 230,160 M260,160 Q272,135 285,160"/>
            <!-- Raised hands -->
            <line x1="90" y1="135" x2="85" y2="120" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="210" y1="135" x2="215" y2="118" stroke="rgba(255,255,255,0.2)" stroke-width="2.5" stroke-linecap="round"/>
          </g>
        ` : `
          <!-- Backstage perspective: artists in front of crowds -->
          <g fill="rgba(211, 16, 53, 0.12)">
            <ellipse cx="150" cy="140" rx="90" ry="12"/>
          </g>
          <text x="150" y="143" fill="rgba(255,255,255,0.4)" font-size="6" text-anchor="middle" font-weight="700">STAGE BACKSTAGE ZONE</text>
        `}

        <text x="15" y="25" fill="#a0a0ab" font-size="9" font-family="'Outfit', sans-serif" font-weight="600" letter-spacing="0.5">VIEW FROM SEAT</text>
        <text x="15" y="42" fill="#fff" font-size="14" font-family="'Outfit', sans-serif" font-weight="700">
          ${isBackstage ? 'Backstage VIP deck' : (povType === 'dancefloor-front' ? 'Front Pitch Area' : 'Main Arena General Admission')}
        </text>
      `;
    } else {
      // Fountain / Theatre setup
      const zoom = povType === 'fountain-near' ? 1.4 : (povType === 'fountain-mid' ? 1.0 : 0.65);
      svgMarkup = `
        <rect width="100%" height="100%" fill="#040406"/>
        <circle cx="150" cy="110" r="80" fill="rgba(211, 16, 53, 0.05)" filter="blur(16px)"/>
        
        <!-- Water jets vector -->
        <g transform="translate(150, 110) scale(${zoom})" stroke="var(--color-accent-crimson)" stroke-width="1.5" fill="none">
          <!-- Center vertical jet -->
          <path d="M0,20 C-10,-40 10,-40 0,-60" stroke-width="2.5"/>
          <!-- Curved jets sides -->
          <path d="M-30,20 C-60,-20 -20,-20 -10,-40"/>
          <path d="M30,20 C60,-20 20,-20 10,-40"/>
          <!-- Stage floor -->
          <ellipse cx="0" cy="20" rx="60" ry="10" fill="#09090c" stroke="rgba(255,255,255,0.1)"/>
        </g>
        
        <!-- Stage Lights beams -->
        <polygon points="20,10 90,110 50,110" fill="rgba(211, 16, 53, 0.06)"/>
        <polygon points="280,10 210,110 250,110" fill="rgba(138, 15, 74, 0.06)"/>

        <text x="15" y="25" fill="#a0a0ab" font-size="9" font-family="'Outfit', sans-serif" font-weight="600" letter-spacing="0.5">VIEW FROM SEAT</text>
        <text x="15" y="42" fill="#fff" font-size="14" font-family="'Outfit', sans-serif" font-weight="700">
          ${povType === 'fountain-near' ? 'Front Rows Section A' : (povType === 'fountain-mid' ? 'Middle Tier Section B' : 'Upper Grandstand Section C')}
        </text>
      `;
    }

    canvas.innerHTML = svgMarkup;
  }

  // Handle click of "Get Ticket" CTA on detail view
  document.getElementById('detail-buy-btn').addEventListener('click', () => {
    if (!state.selectedEvent || !state.selectedSeat) return;

    // Populate checkout screen text elements
    document.getElementById('checkout-event-title').textContent = state.selectedEvent.title;
    document.getElementById('checkout-event-seat').textContent = state.selectedSeat.name;
    document.getElementById('checkout-event-price').textContent = `${state.selectedSeat.price} CZK`;
    
    // Group configuration update
    document.getElementById('group-single-price').textContent = state.selectedSeat.price;

    // Direct mode check by default
    document.getElementById('pay-direct').checked = true;
    document.getElementById('group-buy-config').classList.add('hidden');
    document.querySelector('label[for="pay-direct"]').classList.add('selected');
    document.querySelector('label[for="pay-group"]').classList.remove('selected');
    
    // Apple Pay checkout button text update
    document.getElementById('checkout-pay-btn').innerHTML = `<span class="btn-apple-logo"></span> Pay with Apple Pay`;

    navigateTo('checkout-screen');
  });

  // --------------------------------------------------------------------------
  // 5. ZERO-FRICTION CHECKOUT & SPLIT PAYMENT
  // --------------------------------------------------------------------------
  
  const payModeRadios = document.querySelectorAll('input[name="checkout-mode"]');
  const groupConfig = document.getElementById('group-buy-config');
  const payBtn = document.getElementById('checkout-pay-btn');

  payModeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      // Toggle selected class on parent elements
      document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
      radio.closest('.payment-option').classList.add('selected');

      if (radio.value === 'group') {
        groupConfig.classList.remove('hidden');
        payBtn.innerHTML = ` Set Group Booking & Pay ${state.selectedSeat.price} CZK`;
      } else {
        groupConfig.classList.add('hidden');
        payBtn.innerHTML = `<span class="btn-apple-logo"></span> Pay with Apple Pay`;
      }
    });
  });

  // Split Seats buttons selector click handler
  const grpBtns = document.querySelectorAll('.grp-btn');
  grpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      grpBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.groupBuyCount = parseInt(btn.dataset.count);
    });
  });

  // Trigger Apple Pay Sheet Open
  payBtn.addEventListener('click', () => {
    const isGroup = document.getElementById('pay-group').checked;
    
    // Populate Apple Pay sheet values
    document.getElementById('apple-pay-desc').textContent = isGroup ? `Group Booking Deposit (${state.selectedEvent.title})` : state.selectedEvent.title;
    document.getElementById('apple-pay-amount').textContent = `${state.selectedSeat.price} CZK`;

    // Reset Biometrics UI
    const bioIcon = document.getElementById('bio-touch');
    const bioText = document.getElementById('bio-text');
    bioIcon.closest('.biometric-icon-wrapper').classList.remove('success');
    bioIcon.setAttribute('stroke', '#E02041');
    bioText.textContent = 'Double-press side button to pay';

    // Show Sheet Drawer
    document.getElementById('apple-pay-sheet').classList.remove('hidden');
  });

  // Close Apple Pay Sheet
  document.getElementById('apple-pay-close').addEventListener('click', () => {
    document.getElementById('apple-pay-sheet').classList.add('hidden');
  });

  // Handle biometric fingerprint click simulation
  document.querySelector('.biometric-icon-wrapper').addEventListener('click', () => {
    const bioIcon = document.getElementById('bio-touch');
    const bioText = document.getElementById('bio-text');
    const isGroup = document.getElementById('pay-group').checked;

    bioText.textContent = 'Verifying Relatoo Profile...';
    
    // Simulate biometric matching
    setTimeout(() => {
      bioIcon.closest('.biometric-icon-wrapper').classList.add('success');
      bioIcon.setAttribute('stroke', '#10b981'); // Change to green
      bioText.textContent = 'Payment Authorized! Processing ticket...';
      
      // Delay screen redirection
      setTimeout(() => {
        // Hide Apple Pay Sheet
        document.getElementById('apple-pay-sheet').classList.add('hidden');

        if (isGroup) {
          // Initialize Split Payment dashboard
          startSplitPaymentFlow();
        } else {
          // Complete direct booking: create ticket
          createMockTicket(state.selectedEvent, state.selectedSeat, false);
          navigateTo('ticket-screen');
        }
      }, 1000);
    }, 1500);
  });

  // --------------------------------------------------------------------------
  // 6. SPLIT PAYMENT LIVE COUNTDOWN DASHBOARD
  // --------------------------------------------------------------------------
  
  let splitTimerInterval = null;

  function startSplitPaymentFlow() {
    // Generate split session details
    state.splitSession = {
      event: state.selectedEvent,
      seat: state.selectedSeat,
      totalFriends: state.groupBuyCount - 1,
      friendsPaid: 0,
      secondsRemaining: 45, // Demo accelerated timer (15 minutes simulation in 45s)
      friends: [
        { name: 'Honza (Friend 1)', status: 'waiting', avatar: 'H' },
        { name: 'Karel (Friend 2)', status: 'waiting', avatar: 'K' }
      ]
    };

    if (state.groupBuyCount === 4) {
      state.splitSession.friends.push({ name: 'David (Friend 3)', status: 'waiting', avatar: 'D' });
    } else if (state.groupBuyCount === 2) {
      state.splitSession.friends = [{ name: 'Honza (Friend 1)', status: 'waiting', avatar: 'H' }];
    }

    // Enable tester panel friend triggers
    document.getElementById('sim-friend-pay-1').disabled = false;
    if (state.groupBuyCount >= 3) {
      document.getElementById('sim-friend-pay-2').disabled = false;
    }
    document.getElementById('sim-trigger-expiry').disabled = false;

    // Set Dashboard labels
    document.getElementById('paid-count').textContent = '1';
    document.getElementById('total-count').textContent = state.groupBuyCount;
    document.getElementById('share-link-url').value = `https://vivoo.cz/split/${Math.random().toString(36).substring(7)}`;

    renderSplitFriendsList();
    startSplitTimer();
    navigateTo('split-dashboard-screen');
  }

  function renderSplitFriendsList() {
    const container = document.getElementById('friends-list-container');
    container.innerHTML = `
      <!-- User row -->
      <div class="friend-row">
        <div class="friend-info">
          <div class="friend-avatar" style="background:var(--color-accent-crimson)">ME</div>
          <span class="friend-name">You (Organizer)</span>
        </div>
        <div class="friend-status status-check">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Paid</span>
        </div>
      </div>
    `;

    state.splitSession.friends.forEach(f => {
      const isPaid = f.status === 'paid';
      const statusHtml = isPaid 
        ? `<div class="friend-status status-check">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
             <span>Paid</span>
           </div>`
        : `<div class="friend-status status-waiting">
             <span class="loading-dots">Waiting</span>
           </div>`;

      const row = document.createElement('div');
      row.className = 'friend-row';
      row.innerHTML = `
        <div class="friend-info">
          <div class="friend-avatar">${f.avatar}</div>
          <span class="friend-name">${f.name}</span>
        </div>
        ${statusHtml}
      `;
      container.appendChild(row);
    });
  }

  function startSplitTimer() {
    if (splitTimerInterval) clearInterval(splitTimerInterval);

    const timerDisp = document.getElementById('split-timer');
    const progressBar = document.getElementById('split-progress-bar');
    const totalDuration = state.splitSession.secondsRemaining;

    splitTimerInterval = setInterval(() => {
      if (!state.splitSession) {
        clearInterval(splitTimerInterval);
        return;
      }

      state.splitSession.secondsRemaining--;
      const rem = state.splitSession.secondsRemaining;

      // Translate 45 seconds total timer to a ticking 15:00 mock display
      // 45 seconds remaining = 15:00 minutes. 1 second of clock = 20 seconds.
      const mockMinutes = Math.floor((rem * 20) / 60);
      const mockSeconds = (rem * 20) % 60;
      
      timerDisp.textContent = `${mockMinutes.toString().padStart(2, '0')}:${mockSeconds.toString().padStart(2, '0')}`;
      
      // Update progress bar width
      const percentage = (rem / totalDuration) * 100;
      progressBar.style.width = `${percentage}%`;

      // Warning color triggers under 5 seconds left (approx 1:40 min mock remaining)
      if (rem <= 5) {
        timerDisp.classList.add('pulse-red');
      }

      if (rem <= 0) {
        clearInterval(splitTimerInterval);
        handleSplitTimeout();
      }
    }, 1000);
  }

  // Handle Split timer expiring (Release Seats back to inventory)
  function handleSplitTimeout() {
    clearInterval(splitTimerInterval);
    const session = state.splitSession;
    if (!session) return;

    // Release states and notify
    disableSplitSimButtons();
    
    // Check if friends paid or not
    const allPaid = session.friends.every(f => f.status === 'paid');
    
    if (allPaid) {
      // Completed group purchase successfully
      alert(`Success! Group booking complete. All ${state.groupBuyCount} tickets added to your wallet!`);
      // Add organizer ticket + friend tickets to the wallet
      for (let i = 0; i < state.groupBuyCount; i++) {
        createMockTicket(session.event, session.seat, true, i === 0 ? 'Organizer' : `Friend Guest ${i}`);
      }
    } else {
      // Timeout triggered without all paying. Release unpaid seats
      const paidNum = session.friends.filter(f => f.status === 'paid').length + 1; // organizers + paid friends
      
      alert(`Split Booking Expired!\nUnpaid seats released back to public inventory.\nYour single ticket was finalized and added to your wallet.`);
      
      // Add only organizer ticket to wallet
      createMockTicket(session.event, session.seat, false, 'Organizer');
    }

    state.splitSession = null;
    navigateTo('ticket-screen');
  }

  // Copy link action button
  document.getElementById('share-copy-btn').addEventListener('click', () => {
    const input = document.getElementById('share-link-url');
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value);
    
    // visual feedback (temporary hover state)
    const btn = document.getElementById('share-copy-btn');
    const oldIcon = btn.innerHTML;
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    setTimeout(() => { btn.innerHTML = oldIcon; }, 1500);
  });

  // Organizer decides to close split dashboard and wait in background
  document.getElementById('split-close-btn').addEventListener('click', () => {
    // We add organizer's pending ticket directly to wallet and let split run in background
    if (state.splitSession) {
      createMockTicket(state.splitSession.event, state.splitSession.seat, true, 'Organizer (Pending Group)');
    }
    navigateTo('ticket-screen');
  });

  function disableSplitSimButtons() {
    document.getElementById('sim-friend-pay-1').disabled = true;
    document.getElementById('sim-friend-pay-2').disabled = true;
    document.getElementById('sim-trigger-expiry').disabled = true;
  }

  // --------------------------------------------------------------------------
  // 7. SMART TICKETING & WALLET ENGINE (Animated QR Code & Apple Wallet)
  // --------------------------------------------------------------------------
  
  let qrRotationInterval = null;

  function createMockTicket(eventObj, seatObj, isGroupBooking = false, holderName = 'Organizer') {
    const newTicket = {
      id: `TICK-${Math.floor(100000 + Math.random() * 900000)}`,
      event: eventObj,
      seat: seatObj,
      holderName: holderName,
      isGroup: isGroupBooking,
      isScanned: false
    };

    state.tickets.push(newTicket);
  }

  function renderTicketsList() {
    const wrapper = document.getElementById('tickets-list-wrapper');
    wrapper.innerHTML = '';

    if (state.tickets.length === 0) {
      wrapper.innerHTML = `
        <div class="empty-tickets-view">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="6" x2="6" y2="18"/></svg>
          <h3>Your Wallet is Empty</h3>
          <p>Go back to the Discovery Feed to browse events and purchase tickets.</p>
        </div>`;
      return;
    }

    state.tickets.forEach(ticket => {
      const card = document.createElement('div');
      card.className = 'wallet-card scroll-child';
      card.id = `ticket-card-${ticket.id}`;
      
      card.innerHTML = `
        <div class="wallet-card-header">
          <span class="wallet-brand">VIVOO SECURE DIGI-ID</span>
          <button class="wallet-apple-wallet-btn">
            <!-- Mini Apple Logo -->
            <svg width="10" height="12" viewBox="0 0 170 170" fill="white"><path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.13-1.92-14.35-6.14-3.57-2.83-7.53-7.53-11.87-14.1-8.59-12.87-14.59-26.65-17.98-41.34-3.4-14.7-5.1-28.02-5.1-39.98 0-16.7 4.16-29.85 12.48-39.46 8.32-9.62 18.51-14.51 30.56-14.68 5.7.13 11.72 1.76 18.06 4.88 6.34 3.12 11.1 4.7 14.3 4.7 2.68 0 7.2-1.56 13.56-4.7 6.35-3.11 12.61-4.78 18.77-5 12.53-.25 22.86 4.22 30.99 13.43-10.15 6.13-17.15 14.28-21 24.47-3.85 10.18-3.41 20.73 1.3 31.64 4.71 10.9 11.72 18.8 21.02 23.68-2.68 7.37-5.69 13.62-9.04 18.74zM119.22 30.12c0-8.08 2.82-15.42 8.46-22.02 6.64-7.73 14.59-11.89 23.86-12.48.16 1.03.24 2 .24 2.92 0 7.82-2.92 15.17-8.77 22.05-3.05 3.52-6.9 6.44-11.57 8.76-4.66 2.32-9.14 3.6-13.43 3.84-.52-1.03-.79-2.06-.79-3.07z"/></svg>
            Add to Apple Wallet
          </button>
        </div>

        <div class="wallet-card-body">
          <h3 class="wallet-event-name">${ticket.event.title}</h3>
          
          <!-- Animated Rotate QR Code Container -->
          <div class="wallet-qr-container">
            <svg class="wallet-qr-svg" id="qr-svg-${ticket.id}" viewBox="0 0 100 100">
              <!-- Rendered via loop in js -->
            </svg>
            <div class="wallet-qr-indicator">
              <div class="qr-spinner"></div>
              <span>Secured: Auto-refreshing</span>
            </div>
          </div>

          <div class="wallet-info-row">
            <div class="wallet-info-cell">
              <span>Holder</span>
              <strong>${ticket.holderName}</strong>
            </div>
            <div class="wallet-info-cell">
              <span>Seat Coordinate</span>
              <strong>${ticket.seat.name.split(',')[0]}</strong>
            </div>
            <div class="wallet-info-cell">
              <span>Gate Access</span>
              <strong>${ticket.isScanned ? '<span style="color:var(--color-accent-green)">Scanned</span>' : 'Wait at Gate'}</strong>
            </div>
          </div>
        </div>

        <div class="wallet-card-footer">
          <div class="wallet-action-row">
            <button class="btn btn-outline-danger btn-block btn-resale" data-id="${ticket.id}">
              1-Click Resale (Refund)
            </button>
          </div>
        </div>
      `;

      wrapper.appendChild(card);
      
      // Start ticking QR Code draw logic
      drawSecureQRCode(ticket.id);
    });

    // Start background QR Code updater interval
    startQRCodeRotation();

    // Hook Resale refund buttons
    document.querySelectorAll('.btn-resale').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tId = btn.dataset.id;
        processTicketResaleRefund(tId);
      });
    });
  }

  // Generates randomized SVG blocks simulating QR code encryption changing
  function drawSecureQRCode(ticketId) {
    const svg = document.getElementById(`qr-svg-${ticketId}`);
    if (!svg) return;

    // Generate random mock QR block components
    let rects = `<rect width="100" height="100" fill="#fff" />`;
    
    // Standard Finder patterns (corners)
    rects += `
      <!-- Top-left finder -->
      <rect x="5" y="5" width="25" height="25" fill="#000" />
      <rect x="8" y="8" width="19" height="19" fill="#fff" />
      <rect x="12" y="12" width="11" height="11" fill="#000" />
      
      <!-- Top-right finder -->
      <rect x="70" y="5" width="25" height="25" fill="#000" />
      <rect x="73" y="8" width="19" height="19" fill="#fff" />
      <rect x="77" y="12" width="11" height="11" fill="#000" />

      <!-- Bottom-left finder -->
      <rect x="5" y="70" width="25" height="25" fill="#000" />
      <rect x="8" y="73" width="19" height="19" fill="#fff" />
      <rect x="12" y="77" width="11" height="11" fill="#000" />
    `;

    // Dynamic random filler pixels
    for (let r = 0; r < 14; r++) {
      for (let c = 0; c < 14; c++) {
        // Skip finder pattern coordinates (Top-left, top-right, bottom-left)
        if (r < 5 && c < 5) continue;
        if (r < 5 && c >= 9) continue;
        if (r >= 9 && c < 5) continue;

        if (Math.random() > 0.45) {
          const x = 5 + (c * 6.4);
          const y = 5 + (r * 6.4);
          rects += `<rect x="${x}" y="${y}" width="4" height="4" fill="#000" />`;
        }
      }
    }

    // Dynamic scanning line sweeping across the QR
    const scanY = (Date.now() / 30) % 100;
    rects += `<line x1="0" y1="${scanY}" x2="100" y2="${scanY}" stroke="rgba(255, 42, 84, 0.45)" stroke-width="2.5" />`;

    svg.innerHTML = rects;
  }

  function startQRCodeRotation() {
    if (qrRotationInterval) clearInterval(qrRotationInterval);
    
    qrRotationInterval = setInterval(() => {
      state.tickets.forEach(ticket => {
        drawSecureQRCode(ticket.id);
      });
    }, 1500); // Regenerate every 1.5 seconds for visual feedback
  }

  // 1-Click resale refund process
  function processTicketResaleRefund(ticketId) {
    const idx = state.tickets.findIndex(t => t.id === ticketId);
    if (idx === -1) return;
    
    const ticket = state.tickets[idx];
    const refundValue = Math.round(ticket.seat.price * 0.8);

    if (confirm(`Resell this ticket?\nWe will return it to inventory and credit your cashless balance +${refundValue} CZK (80% value refund).`)) {
      // Visual feedback transition
      const ticketCard = document.getElementById(`ticket-card-${ticketId}`);
      if (ticketCard) {
        ticketCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
        ticketCard.style.transform = 'scale(0.8) translateY(-100px)';
        ticketCard.style.opacity = '0';
      }

      setTimeout(() => {
        // Add credit refund
        updateCashlessCredits(refundValue);
        
        // Remove ticket
        state.tickets.splice(idx, 1);
        
        // Refresh ticket wallet screen
        renderTicketsList();
        
        // Float fly animation simulation on credit badge
        animateCreditUpdate(refundValue);
      }, 500);
    }
  }

  // --------------------------------------------------------------------------
  // 8. UGC LOOP & RETENTION FLOW (Post-Event UGC Curation)
  // --------------------------------------------------------------------------
  
  const notificationBanner = document.getElementById('notification-banner');
  const closeNotification = document.getElementById('close-notification');
  const simNotificationBtn = document.getElementById('sim-send-notification');
  const simScanBtn = document.getElementById('sim-scan-ticket');
  const prefilledClipBtns = document.querySelectorAll('.prefilled-clip-btn');
  const ugcFileInput = document.getElementById('ugc-file-input');
  const dragZone = document.getElementById('ugc-drag-zone');
  const submitUgcBtn = document.getElementById('ugc-submit-btn');

  let selectedUgcType = null;

  // Gate Scan Click Simulator
  simScanBtn.addEventListener('click', () => {
    // Requires a ticket to scan
    if (state.tickets.length === 0) {
      alert('Please purchase a ticket first before simulating gate scan entry!');
      return;
    }

    // Mark tickets as scanned
    state.tickets.forEach(t => t.isScanned = true);
    renderTicketsList();

    alert('Security Gate: Ticket scanned successfully. Geofence activated: User has entered the venue.');
    
    // Advance simulation controls
    simNotificationBtn.disabled = false;
  });

  // Next-day UGC reminder notification click
  simNotificationBtn.addEventListener('click', () => {
    notificationBanner.classList.remove('hidden');
    
    // Automatically close notification after 15 seconds
    setTimeout(() => {
      notificationBanner.classList.add('hidden');
    }, 15000);
  });

  closeNotification.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationBanner.classList.add('hidden');
  });

  // Clicking push notification opens UGC upload flow
  notificationBanner.addEventListener('click', () => {
    notificationBanner.classList.add('hidden');
    
    // Open UGC Screen
    resetUgcUploadZone();
    navigateTo('ugc-upload-screen');
  });

  // UGC select clip triggers
  prefilledClipBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      prefilledClipBtns.forEach(b => b.classList.remove('btn-primary'));
      btn.classList.add('btn-primary');
      
      selectedUgcType = btn.dataset.type;
      submitUgcBtn.disabled = false;
    });
  });

  // Upload Zone trigger drag properties
  dragZone.addEventListener('click', () => {
    ugcFileInput.click();
  });

  ugcFileInput.addEventListener('change', () => {
    if (ugcFileInput.files.length > 0) {
      selectedUgcType = 'party'; // default fallback clip simulation
      submitUgcBtn.disabled = false;
      dragZone.querySelector('span').textContent = ugcFileInput.files[0].name;
    }
  });

  // Drag over states
  dragZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragZone.classList.add('dragover');
  });

  dragZone.addEventListener('dragleave', () => {
    dragZone.classList.remove('dragover');
  });

  dragZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dragZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      selectedUgcType = 'party';
      submitUgcBtn.disabled = false;
      dragZone.querySelector('span').textContent = e.dataTransfer.files[0].name;
    }
  });

  // UGC Video Upload execution
  submitUgcBtn.addEventListener('click', () => {
    if (!selectedUgcType) return;

    // Show uploading progression UI
    document.getElementById('ugc-upload-idle').classList.add('hidden');
    document.getElementById('ugc-upload-running').classList.remove('hidden');
    submitUgcBtn.disabled = true;

    let progress = 0;
    const progressEl = document.getElementById('ugc-upload-progress');
    
    const interval = setInterval(() => {
      progress += 10;
      progressEl.style.width = `${progress}%`;
      progressEl.textContent = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
        
        // Show success
        document.getElementById('ugc-upload-running').classList.add('hidden');
        document.getElementById('ugc-upload-success').classList.remove('hidden');

        // Execute UGC Loop logic: Reward User and Curate Video back into feed
        handleUgcUploadSuccess();
      }
    }, 150);
  });

  function handleUgcUploadSuccess() {
    // 1. Reward credit
    updateCashlessCredits(100);
    animateCreditUpdate(100);

    // 2. Add video UGC event block to top of discovery feed list
    let sampleUgcVid = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4';
    let vibeTitle = 'Concert Crowds Vibe check';
    
    if (selectedUgcType === 'adrenalin') {
      sampleUgcVid = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4';
      vibeTitle = 'Epic Sector B goal celebration';
    }

    const ugcFeedItem = {
      id: `ugc-${Date.now()}`,
      title: vibeTitle,
      tag: selectedUgcType === 'adrenalin' ? 'Adrenalin' : 'Party',
      vibe: selectedUgcType,
      location: selectedUgcType === 'adrenalin' ? 'epet ARENA Prague' : 'Hala 13 Prague',
      date: 'Simulated UGC Vibe Loop',
      lineup: 'Fan Video Upload',
      weather: { temp: '20°C', text: 'Crowd Vibe', icon: 'clear' },
      videoUrl: sampleUgcVid,
      bgImg: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800&auto=format&fit=crop',
      priceMin: 300,
      priceMax: 1200,
      isUGC: true,
      sectors: []
    };

    // Prepend to database
    eventsData.unshift(ugcFeedItem);
    
    // Re-filter active feed
    if (state.currentVibe === 'all' || state.currentVibe === selectedUgcType) {
      activeFeedEvents = [...eventsData];
      if (state.currentVibe !== 'all') {
        activeFeedEvents = eventsData.filter(e => e.vibe === state.currentVibe);
      }
    }

    // Refresh discovery feed screen elements
    renderFeed();
  }

  function resetUgcUploadZone() {
    document.getElementById('ugc-upload-idle').classList.remove('hidden');
    document.getElementById('ugc-upload-running').classList.add('hidden');
    document.getElementById('ugc-upload-success').classList.add('hidden');
    submitUgcBtn.disabled = true;
    selectedUgcType = null;
    prefilledClipBtns.forEach(btn => btn.classList.remove('btn-primary'));
    dragZone.querySelector('span').textContent = 'Select event video clip (MP4)';
  }

  // --------------------------------------------------------------------------
  // 9. INTERACTIVE SIMULATOR (Side control deck dashboard)
  // --------------------------------------------------------------------------
  
  const testCreditVal = document.getElementById('tester-credit');
  const headerCreditBadge = document.getElementById('header-credit-badge');

  function updateCashlessCredits(amountChange) {
    state.credit += amountChange;
    if (testCreditVal) {
      testCreditVal.textContent = state.credit;
    }
    const feedHeaderCredit = document.getElementById('feed-header-credit-badge');
    if (feedHeaderCredit) {
      feedHeaderCredit.textContent = `${state.credit} CZK`;
    }
    const profileWalletCredit = document.getElementById('profile-wallet-credit');
    if (profileWalletCredit) {
      profileWalletCredit.textContent = state.credit;
    }
  }

  // Credit Badge Init
  updateCashlessCredits(0);

  // Sim Button: Add Credit
  document.getElementById('sim-add-credit-btn').addEventListener('click', () => {
    updateCashlessCredits(200);
    animateCreditUpdate(200);
  });

  // Sim Button: Friend 1 Pays
  document.getElementById('sim-friend-pay-1').addEventListener('click', () => {
    if (!state.splitSession) return;
    
    // Mark friend as paid
    const friend = state.splitSession.friends.find(f => f.avatar === 'H');
    if (friend && friend.status !== 'paid') {
      friend.status = 'paid';
      state.splitSession.friendsPaid++;
      document.getElementById('paid-count').textContent = state.splitSession.friendsPaid + 1;
      
      renderSplitFriendsList();
      checkAllSplitPaid();
    }
  });

  // Sim Button: Friend 2 Pays
  document.getElementById('sim-friend-pay-2').addEventListener('click', () => {
    if (!state.splitSession) return;
    
    // Mark friend as paid
    const friend = state.splitSession.friends.find(f => f.avatar === 'K');
    if (friend && friend.status !== 'paid') {
      friend.status = 'paid';
      state.splitSession.friendsPaid++;
      document.getElementById('paid-count').textContent = state.splitSession.friendsPaid + 1;
      
      renderSplitFriendsList();
      checkAllSplitPaid();
    }
  });

  function checkAllSplitPaid() {
    const allPaid = state.splitSession.friends.every(f => f.status === 'paid');
    if (allPaid) {
      clearInterval(splitTimerInterval);
      disableSplitSimButtons();
      
      setTimeout(() => {
        alert('All friends paid! Group buy completed successfully. Adding tickets to wallet...');
        
        // Add tickets to wallet
        for (let i = 0; i < state.groupBuyCount; i++) {
          createMockTicket(state.splitSession.event, state.splitSession.seat, true, i === 0 ? 'Organizer' : `Guest Friend ${i}`);
        }
        
        state.splitSession = null;
        navigateTo('ticket-screen');
      }, 1000);
    }
  }

  // Sim Button: Expiry split timeout trigger
  document.getElementById('sim-trigger-expiry').addEventListener('click', () => {
    if (!state.splitSession) return;
    state.splitSession.secondsRemaining = 1;
  });

  // Sim Button: Backstage pass lottery trigger
  document.getElementById('sim-trigger-lottery').addEventListener('click', () => {
    const roll = Math.random();
    if (roll > 0.7) {
      alert('🎟️ CONGRATULATIONS!\nYou won a Backstage VIP Pass upgrade for your next event!');
    } else {
      alert('Better luck next time! Try uploading more UGC memories clips to earn entry tickets.');
    }
  });

  // Sim Reset states
  document.getElementById('sim-reset-all').addEventListener('click', () => {
    if (confirm('Reset simulator to default starting values?')) {
      // Clear split timer
      if (splitTimerInterval) clearInterval(splitTimerInterval);
      
      state.credit = 400;
      updateCashlessCredits(0);

      state.tickets = [];
      state.splitSession = null;
      state.currentPlayingIndex = 0;
      
      // Reset database events to original 3
      activeFeedEvents = [...eventsData.filter(e => !e.isUGC)];
      
      // UI resets
      disableSplitSimButtons();
      resetUgcUploadZone();
      renderFeed();
      
      navigateTo('feed-screen');
      alert('Simulator reset successful.');
    }
  });

  // Custom visual micro-animation helper for flying coins/refunding values
  function animateCreditUpdate(amount) {
    const badge = document.getElementById('feed-header-profile-btn');
    if (!badge) return;
    badge.style.transform = 'scale(1.2)';
    badge.style.borderColor = 'var(--color-accent-crimson)';
    
    setTimeout(() => {
      badge.style.transform = 'scale(1)';
      badge.style.borderColor = 'rgba(255, 255, 255, 0.05)';
    }, 800);
  }

});
