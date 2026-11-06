/**
 * Mellstroy Interactive & Responsive Engine
 */

const PROVIDERS_MAP = {
  v_pragmatic: "Pragmatic Play",
  v_hacksawgaming: "Hacksaw Gaming",
  v_pgsoft: "PG Soft",
  v_belatra: "Belatra",
  v_endorphina: "Endorphina",
  v_melloriginals: "Mell Originals",
  v_3oaks: "3 Oaks Gaming",
  v_bgmng: "BGaming",
  v_smartsoft: "SmartSoft",
  v_platipus: "Platipus",
  v_amusnet: "Amusnet",
  v_winfinity: "Winfinity",
  v_livevegas: "Live Vegas",
  v_mascotgaming: "Mascot Gaming",
  v_galaxsysgames: "Galaxsys",
  v_clawbuster: "Clawbuster",
  v_100hp: "100HP Gaming",
  v_evolutionm: "Evolution",
};

function initApp() {
  initMobileDrawer();
  initBottomNavbar();
  initGameDetailsModal();
  initLoginBottomSheet();
  initBannerSlider();
  initCategoryTabs();
  initCardLikeButtons();
  attachGlobalEventDelegation();

  // URL query parameters and hash triggers for direct testing/deep linking
  const urlParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash;
  const gameParam = urlParams.get("game");
  const loginParam = urlParams.get("login");
  const reasonParam = urlParams.get("reason");

  if (gameParam) {
    const raw = decodeURIComponent(gameParam).replace(/^v_[^:]*:/, "").replace(/_/g, " ").replace(/-/g, " ");
    const title = raw.charAt(0).toUpperCase() + raw.slice(1);
    openGameDetails({
      id: gameParam,
      title: title,
      provider: "Mell Originals",
      poster: "./images/en-001.svg"
    });
  } else if (hash === "#test-game" || hash === "#test-mines") {
    openGameDetails({
      id: "v_melloriginals:mines_l",
      title: "Mines",
      provider: "Mell Originals",
      poster: "./images/resources_v1_optimizeimages_unsafe_casino_game_card_x1_plain_https-_v1.bundlecdn.com_casino-images_v_b2045a3e-dda3-4e0a-904d-3f6c1079be05_vertical.jpg.webp"
    });
  } else if (hash === "#test-login" || hash === "#login" || loginParam === "1" || reasonParam) {
    openLoginModal(reasonParam || "required");
  } else if (hash === "#test-pc-login") {
    openGameDetails({
      id: "v_pragmatic:gatesofmellstroysuperscatter",
      title: "Gates of Mellstroy Super Scatter",
      provider: "Pragmatic Play",
      poster: "./images/resources_v1_optimizeimages_unsafe_casino_game_card_x1_plain_https-_v1.bundlecdn.com_casino-images_v_9b001e1c-cd59-4d43-9454-3ee7be3f2598_vertical.png.webp"
    });
    setTimeout(() => openLoginModal("required"), 150);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

/**
 * 1. Top Mobile App Banner
 */
function initMobileAppBanner() {
  // Removed top app banner
}

/**
 * 2. Mobile Drawer (Menu Tab)
 */
function initMobileDrawer() {
  if (document.getElementById("mobile-drawer")) return;

  const backdrop = document.createElement("div");
  backdrop.id = "mobile-drawer-backdrop";
  backdrop.className = "mobile-drawer-backdrop";

  const drawer = document.createElement("div");
  drawer.id = "mobile-drawer";
  drawer.className = "mobile-drawer";
  drawer.innerHTML = `
    <div class="mobile-drawer-header">
      <div class="mobile-drawer-logo">
        <span style="font-weight: 800; font-size: 20px; color: #fff; letter-spacing: 0.5px;">MELL<span style="color: #b633fe;">STROY</span></span>
      </div>
      <button class="mobile-drawer-close" id="btn-close-drawer" aria-label="Close">✕</button>
    </div>
    <div class="mobile-drawer-content">
      <div class="mobile-drawer-auth-box">
        <button class="drawer-auth-btn drawer-btn-login" id="drawer-login-btn">Log In</button>
        <button class="drawer-auth-btn drawer-btn-reg" id="drawer-reg-btn">Registration</button>
      </div>
      <div class="mobile-drawer-nav">
        <a href="#" class="drawer-nav-item active" data-nav="casino">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2.5C9.5 5.5 4.5 10 4.5 14a5.5 5.5 0 0 0 9.5 3.65c-.3 1.25-1.1 2.6-2.5 3.1h5c-1.4-.5-2.2-1.85-2.5-3.1A5.5 5.5 0 0 0 19.5 14c0-4-5-8.5-7.5-11.5z"></path>
          </svg>
          <span>Casino</span>
        </a>
        <a href="#" class="drawer-nav-item" data-nav="sports">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polygon points="12 7.5 15.3 9.9 14 13.8 10 13.8 8.7 9.9" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"></polygon>
            <line x1="12" y1="2" x2="12" y2="7.5"></line>
            <line x1="15.3" y1="9.9" x2="20.5" y2="8.5"></line>
            <line x1="14" y1="13.8" x2="17.8" y2="18.2"></line>
            <line x1="10" y1="13.8" x2="6.2" y2="18.2"></line>
            <line x1="8.7" y1="9.9" x2="3.5" y2="8.5"></line>
          </svg>
          <span>Sports</span>
        </a>
        <a href="#" class="drawer-nav-item" data-nav="bonuses">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 12v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20.5V12"></path>
            <rect x="2.5" y="7" width="19" height="5" rx="1.5"></rect>
            <line x1="12" y1="22" x2="12" y2="7"></line>
            <path d="M12 7H7.8a2.3 2.3 0 0 1 0-4.6C10.5 2.4 12 7 12 7z"></path>
            <path d="M12 7h4.2a2.3 2.3 0 0 0 0-4.6C13.5 2.4 12 7 12 7z"></path>
          </svg>
          <span>Bonuses & Promotions</span>
        </a>
        <a href="#" class="drawer-nav-item" data-nav="vip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>VIP Club</span>
        </a>
        <a href="#" class="drawer-nav-item" data-nav="support">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
          <span>Live Support 24/7</span>
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(drawer);

  backdrop.addEventListener("click", closeMobileMenu);
  drawer.querySelector("#btn-close-drawer").addEventListener("click", closeMobileMenu);
  drawer.querySelector("#drawer-login-btn").addEventListener("click", () => {
    closeMobileMenu();
    openLoginModal();
  });
  drawer.querySelector("#drawer-reg-btn").addEventListener("click", () => {
    closeMobileMenu();
    openLoginModal();
  });

  drawer.querySelectorAll(".drawer-nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const navTarget = item.getAttribute("data-nav");
      closeMobileMenu();
      if (navTarget === "casino") {
        setActiveNavTab("casino");
      } else {
        openLoginModal("required");
      }
    });
  });
}

function openMobileMenu() {
  const backdrop = document.getElementById("mobile-drawer-backdrop");
  const drawer = document.getElementById("mobile-drawer");
  if (!backdrop || !drawer) return;
  backdrop.classList.add("is-visible");
  drawer.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  const backdrop = document.getElementById("mobile-drawer-backdrop");
  const drawer = document.getElementById("mobile-drawer");
  if (!backdrop || !drawer) return;
  backdrop.classList.remove("is-visible");
  drawer.classList.remove("is-open");
  document.body.style.overflow = "";
}

function toggleMobileMenu() {
  const drawer = document.getElementById("mobile-drawer");
  if (drawer && drawer.classList.contains("is-open")) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

/**
 * 3. Mobile Bottom Navigation Bar
 */
function initBottomNavbar() {
  if (document.getElementById("mobile-bottom-navbar")) return;

  const nav = document.createElement("div");
  nav.id = "mobile-bottom-navbar";
  nav.className = "mobile-bottom-navbar";
  nav.innerHTML = `
    <div class="bottom-nav-pill">
      <button class="nav-tab-btn" data-tab="menu" id="btn-nav-menu" aria-label="Menu">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
          <line x1="4" y1="7" x2="20" y2="7"></line>
          <line x1="4" y1="12" x2="20" y2="12"></line>
          <line x1="4" y1="17" x2="20" y2="17"></line>
        </svg>
      </button>
      <button class="nav-tab-btn active" data-tab="casino" id="btn-nav-casino" aria-label="Casino">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2.5C9.5 5.5 4.5 10 4.5 14a5.5 5.5 0 0 0 9.5 3.65c-.3 1.25-1.1 2.6-2.5 3.1h5c-1.4-.5-2.2-1.85-2.5-3.1A5.5 5.5 0 0 0 19.5 14c0-4-5-8.5-7.5-11.5z"></path>
        </svg>
      </button>
      <div class="nav-deposit-wrap">
        <button class="nav-deposit-btn" data-tab="deposit" id="btn-nav-deposit" aria-label="Deposit">
          <svg class="deposit-wallet-icon" viewBox="0 0 24 24" fill="none" stroke="#091a10" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="6" width="20" height="13" rx="2.5"></rect>
            <path d="M16 10h4.5a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H16a1.5 1.5 0 0 1-1.5-1.5v-.5a1.5 1.5 0 0 1 1.5-1.5z"></path>
            <circle cx="18" cy="12.25" r="0.9" fill="#091a10"></circle>
          </svg>
        </button>
      </div>
      <button class="nav-tab-btn" data-tab="bonuses" id="btn-nav-bonuses" aria-label="Bonuses">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 12v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20.5V12"></path>
          <rect x="2.5" y="7" width="19" height="5" rx="1.5"></rect>
          <line x1="12" y1="22" x2="12" y2="7"></line>
          <path d="M12 7H7.8a2.3 2.3 0 0 1 0-4.6C10.5 2.4 12 7 12 7z"></path>
          <path d="M12 7h4.2a2.3 2.3 0 0 0 0-4.6C13.5 2.4 12 7 12 7z"></path>
        </svg>
      </button>
      <button class="nav-tab-btn" data-tab="sports" id="btn-nav-sports" aria-label="Sports">
        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="12 7.5 15.3 9.9 14 13.8 10 13.8 8.7 9.9" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1.5"></polygon>
          <line x1="12" y1="2" x2="12" y2="7.5"></line>
          <line x1="15.3" y1="9.9" x2="20.5" y2="8.5"></line>
          <line x1="14" y1="13.8" x2="17.8" y2="18.2"></line>
          <line x1="10" y1="13.8" x2="6.2" y2="18.2"></line>
          <line x1="8.7" y1="9.9" x2="3.5" y2="8.5"></line>
        </svg>
      </button>
    </div>
    <div class="bottom-nav-labels">
      <div class="nav-label-item" data-tab="menu">Menu</div>
      <div class="nav-label-item active" data-tab="casino">Casino</div>
      <div class="nav-label-item" data-tab="deposit">Deposit</div>
      <div class="nav-label-item" data-tab="bonuses">Bonuses</div>
      <div class="nav-label-item" data-tab="sports">Sports</div>
    </div>
  `;
  document.body.appendChild(nav);

  // Floating Support Bubble
  const chatBubble = document.createElement("div");
  chatBubble.className = "floating-chat-bubble";
  chatBubble.id = "floating-chat-bubble";
  chatBubble.setAttribute("title", "Live Support");
  chatBubble.innerHTML = `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff">
      <path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.65 1.45 5.03 3.73 6.55-.17.95-.74 2.42-1.71 3.45-.16.17-.06.45.17.48 1.83.2 3.8-.4 5.04-1.22.9.27 1.85.42 2.82.42 5.5 0 10-3.8 10-8.5S17.5 3 12 3z"/>
    </svg>
  `;
  chatBubble.addEventListener("click", () => {
    alert("Live Support is available 24/7. Connecting to an agent...");
  });
  document.body.appendChild(chatBubble);

  // Tab click listeners
  nav.addEventListener("click", (e) => {
    const target = e.target.closest("[data-tab]");
    if (target) {
      const tabName = target.getAttribute("data-tab");
      setActiveNavTab(tabName);
    }
  });
}

function setActiveNavTab(tabName) {
  const tabs = document.querySelectorAll("#mobile-bottom-navbar .nav-tab-btn, #mobile-bottom-navbar .nav-label-item");
  tabs.forEach((el) => {
    if (el.getAttribute("data-tab") === tabName) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  });

  if (tabName === "casino") {
    closeGameDetails();
    closeLoginModal();
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (tabName === "menu") {
    toggleMobileMenu();
  } else {
    closeMobileMenu();
    openLoginModal("required");
  }
}

/**
 * 3. Game Details Screen (Image 3)
 */
function initGameDetailsModal() {
  if (document.getElementById("game-details-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "game-details-overlay";
  overlay.className = "game-details-overlay";
  overlay.innerHTML = `
    <!-- Header matching lobby -->
    <div class="game-details-header">
      <div class="game-header-logo-wrap">
        <img src="./images/11aa.png" alt="Mellstroy" class="game-header-logo-img" />
      </div>
      <div class="game-header-actions">
        <button class="header-login-btn btn-trigger-login" type="button">Login</button>
        <button class="header-reg-btn btn-trigger-register" type="button">Registration</button>
      </div>
    </div>

    <!-- Subbar with only < Back button (Image 3) -->
    <div class="game-details-back-bar">
      <button class="game-back-btn" id="game-details-back" type="button">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
        </svg>
        <span>Back</span>
      </button>
    </div>

    <div class="game-details-body">
      <div class="game-details-card">
        <div class="game-card-top-row">
          <img class="game-card-poster" id="game-modal-poster" src="" alt="Game Poster" />
          <div class="game-card-meta">
            <h2 class="game-card-title" id="game-modal-title">Game Title</h2>
            <div class="game-card-provider" id="game-modal-provider">
              <span id="game-modal-provider-icon">
                <img src="./images/11aa.png" style="width: 16px; height: 16px; object-fit: contain; vertical-align: middle;" alt="Provider" />
              </span>
              <span id="game-modal-provider-name">Mell Originals</span>
            </div>
            <p class="game-card-demo-text">You can play in demo mode</p>
          </div>
        </div>

        <button class="game-btn-login" id="game-btn-play-login" type="button">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span>Log in</span>
        </button>

        <button class="game-btn-demo" id="game-btn-play-demo" type="button">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
          </svg>
          <span>Demo mode</span>
        </button>

        <button class="game-btn-like" id="game-btn-like" type="button">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#ba49fb" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>Like / Add to Favorites</span>
        </button>

        <div class="game-fullscreen-row">
          <span class="game-fullscreen-label">Fullscreen mode</span>
          <label class="ios-switch">
            <input type="checkbox" id="game-fullscreen-toggle" />
            <span class="ios-slider"></span>
          </label>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById("game-details-back").addEventListener("click", closeGameDetails);

  document.getElementById("game-btn-play-demo").addEventListener("click", () => {
    const title = document.getElementById("game-modal-title").innerText;
    alert(`Starting Demo Mode for: ${title}!\nVirtual balance: 1,000.00 FUN credited.`);
  });

  document.getElementById("game-btn-like").addEventListener("click", () => {
    openLoginModal("like");
  });
}

function openGameDetails(gameData) {
  const overlay = document.getElementById("game-details-overlay");
  if (!overlay) return;

  document.getElementById("game-modal-poster").src = gameData.poster;
  document.getElementById("game-modal-title").innerText = gameData.title;
  document.getElementById("game-modal-provider-name").innerText = gameData.provider;

  const iconEl = document.getElementById("game-modal-provider-icon");
  if (iconEl) {
    if (gameData.provider && gameData.provider.toLowerCase().includes("mell")) {
      iconEl.innerHTML = '<img src="./images/11aa.png" style="width: 16px; height: 16px; object-fit: contain; vertical-align: middle;" alt="Mell Originals" />';
    } else {
      iconEl.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style="vertical-align: middle;"><circle cx="12" cy="12" r="10"/></svg>';
    }
  }

  const bubble = document.getElementById("floating-chat-bubble");
  if (bubble) bubble.style.display = "none";

  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeGameDetails() {
  const overlay = document.getElementById("game-details-overlay");
  if (overlay) {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";

    const bubble = document.getElementById("floating-chat-bubble");
    if (bubble) bubble.style.display = "";
  }
}

/**
 * 4. Login Bottom Sheet Modal (Image 5 & LoginModal Supabase System)
 */
function initLoginBottomSheet() {
  if (document.getElementById("login-bottom-sheet")) return;

  const backdrop = document.createElement("div");
  backdrop.id = "login-backdrop";
  backdrop.className = "login-backdrop";

  const sheet = document.createElement("div");
  sheet.id = "login-bottom-sheet";
  sheet.className = "login-bottom-sheet";
  sheet.innerHTML = `
    <div class="login-sheet-header">
      <h3 class="login-sheet-title" id="sheet-auth-title">Login</h3>
      <button class="login-sheet-close" id="btn-login-close" aria-label="Close">✕</button>
    </div>

    <div class="login-sheet-body">
      <div class="login-sheet-info-banner" id="login-sheet-info-banner" style="display: none;"></div>

      <!-- SUCCESS SCREEN (CURRENT TOGGLE WHEN DATA GOES TO SUPABASE) -->
      <div class="party-ticket-container" id="sheet-success-card" style="display: none;">
        <div class="party-success-card">
          <h3>Server Error</h3>
          <br />
          <p class="success-message-text">Something went wrong on our end. Please try again later.</p>
        </div>
      </div>

      <!-- ERROR SCREEN (NETWORK ERROR ON OUR SIDE WHEN DATA FAILS TO GO TO SUPABASE) -->
      <div class="party-ticket-container" id="sheet-error-card" style="display: none;">
        <div class="party-success-card" style="border-color: rgba(239, 68, 68, 0.4);">
          <h3 style="color: #ef4444;">Network Error</h3>
          <br />
          <p class="success-message-text">Network error on our side. Please check your connection and try again.</p>
          <button type="button" class="btn-claim-ticket" id="btn-sheet-tryagain" style="background: #ef4444; margin-top: 16px;">
            Try Again
          </button>
        </div>
      </div>

      <!-- MAIN FORM CONTENT -->
      <div id="sheet-main-form-content">
        <!-- Tabs -->
        <div class="login-tabs-wrap">
          <button class="login-tab-btn" id="tab-btn-phone" type="button">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            <span>Phone</span>
          </button>
          <button class="login-tab-btn active" id="tab-btn-email" type="button">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span>Email</span>
          </button>
        </div>

        <!-- Phone Form -->
        <form id="form-phone-sheet" class="sheet-auth-form" noValidate style="display: none;">
          <div class="login-form-group">
            <div class="login-input-row" id="row-sheet-phone">
              <div class="login-country-select" id="btn-sheet-country-select" role="button" tabindex="0" title="Select Country">
                <span class="country-row-flag-circle" id="sheet-country-flag" style="margin-right: 4px; font-size: 16px;">🇮🇳</span>
                <span id="sheet-country-dial">+91</span>
                <span style="font-size: 10px; color: #8c8299; margin-left: 2px;">▼</span>
              </div>
              <input type="tel" class="login-input-field" placeholder="00000 00000" id="sheet-phone" autocomplete="tel" />
            </div>
            <span class="form-error-text" id="sheet-phone-error" style="display: none;"></span>
          </div>

          <div class="login-form-group">
            <div class="login-input-row" id="row-sheet-phone-pwd">
              <div class="login-input-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <input type="password" class="login-input-field" placeholder="Password" id="sheet-phone-pwd" autocomplete="current-password" />
              <button type="button" class="form-password-toggle" id="btn-toggle-sheet-phone-pwd" aria-label="Toggle password visibility">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
            <span class="form-error-text" id="sheet-phone-pwd-error" style="display: none;"></span>
            <a class="login-forgot-link" onclick="alert('Password reset link sent to your registered contact!')">Forgot your password?</a>
          </div>

          <button type="submit" class="login-submit-btn" id="btn-submit-sheet-phone">Log in</button>
        </form>

        <!-- Email Form -->
        <form id="form-email-sheet" class="sheet-auth-form" noValidate>
          <div class="login-form-group">
            <div class="login-input-row" id="row-sheet-email">
              <div class="login-input-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <input type="email" class="login-input-field" placeholder="Email" id="sheet-email" autocomplete="email" />
            </div>
            <span class="form-error-text" id="sheet-email-error" style="display: none;"></span>
          </div>

          <div class="login-form-group">
            <div class="login-input-row" id="row-sheet-email-pwd">
              <div class="login-input-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </div>
              <input type="password" class="login-input-field" placeholder="Password" id="sheet-email-pwd" autocomplete="current-password" />
              <button type="button" class="form-password-toggle" id="btn-toggle-sheet-email-pwd" aria-label="Toggle password visibility">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
            <span class="form-error-text" id="sheet-email-pwd-error" style="display: none;"></span>
            <a class="login-forgot-link" onclick="alert('Password reset link sent to your registered contact!')">Forgot your password?</a>
          </div>

          <button type="submit" class="login-submit-btn" id="btn-submit-sheet-email">Log in</button>
        </form>

        <!-- Divider -->
        <div class="login-divider-row">
          <div class="login-divider-line"></div>
          <span>or</span>
          <div class="login-divider-line"></div>
        </div>

        <!-- Social Logins -->
        <div class="login-social-row">
          <button class="social-btn social-btn-google" title="Google" type="button" onclick="alert('Login with Google...')">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </button>
          <button class="social-btn social-btn-yandex" title="Yandex" type="button" onclick="alert('Login with Yandex...')">Я</button>
          <button class="social-btn social-btn-telegram" title="Telegram" type="button" onclick="alert('Login with Telegram...')">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
          </button>
          <button class="social-btn social-btn-mailru" title="Mail.ru" type="button" onclick="alert('Login with Mail.ru...')">@</button>
          <button class="social-btn social-btn-ok" title="Odnoklassniki" type="button" onclick="alert('Login with OK.ru...')">OK</button>
        </div>

        <p class="login-footer-text">
          <span id="sheet-auth-switch-label">Don't have an account?</span>
          <a id="link-register">Register</a>
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(sheet);

  // Tab switching: Phone vs Email (Default: Email)
  let activeTab = "email";
  let sheetCountry = { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" };

  const tabPhone = document.getElementById("tab-btn-phone");
  const tabEmail = document.getElementById("tab-btn-email");
  const formPhone = document.getElementById("form-phone-sheet");
  const formEmail = document.getElementById("form-email-sheet");

  const phoneInput = document.getElementById("sheet-phone");
  const phonePwdInput = document.getElementById("sheet-phone-pwd");
  const phoneErr = document.getElementById("sheet-phone-error");
  const phonePwdErr = document.getElementById("sheet-phone-pwd-error");
  const rowPhoneInput = document.getElementById("row-sheet-phone");
  const rowPhonePwd = document.getElementById("row-sheet-phone-pwd");
  const btnSubmitPhone = document.getElementById("btn-submit-sheet-phone");

  const sheetCountryBtn = document.getElementById("btn-sheet-country-select");
  const sheetCountryFlag = document.getElementById("sheet-country-flag");
  const sheetCountryDial = document.getElementById("sheet-country-dial");

  if (sheetCountryBtn) {
    sheetCountryBtn.addEventListener("click", () => {
      if (typeof window.openCountryPicker === "function") {
        window.openCountryPicker({
          currentDial: sheetCountry.dial,
          onSelect: (c) => {
            sheetCountry = c;
            if (sheetCountryFlag) sheetCountryFlag.innerText = c.flag;
            if (sheetCountryDial) sheetCountryDial.innerText = c.dial;
            phoneInput.focus();
          }
        });
      }
    });
  }

  const emailInput = document.getElementById("sheet-email");
  const emailPwdInput = document.getElementById("sheet-email-pwd");
  const emailErr = document.getElementById("sheet-email-error");
  const emailPwdErr = document.getElementById("sheet-email-pwd-error");
  const rowEmailInput = document.getElementById("row-sheet-email");
  const rowEmailPwd = document.getElementById("row-sheet-email-pwd");
  const btnSubmitEmail = document.getElementById("btn-submit-sheet-email");

  const successCard = document.getElementById("sheet-success-card");
  const errorCard = document.getElementById("sheet-error-card");
  const mainFormContent = document.getElementById("sheet-main-form-content");
  const btnTryAgain = document.getElementById("btn-sheet-tryagain");

  function clearSheetErrors() {
    phoneErr.style.display = "none";
    phoneErr.innerText = "";
    rowPhoneInput.classList.remove("login-input-row--error");

    phonePwdErr.style.display = "none";
    phonePwdErr.innerText = "";
    rowPhonePwd.classList.remove("login-input-row--error");

    emailErr.style.display = "none";
    emailErr.innerText = "";
    rowEmailInput.classList.remove("login-input-row--error");

    emailPwdErr.style.display = "none";
    emailPwdErr.innerText = "";
    rowEmailPwd.classList.remove("login-input-row--error");
  }

  tabPhone.addEventListener("click", () => {
    activeTab = "phone";
    tabPhone.classList.add("active");
    tabEmail.classList.remove("active");
    formPhone.style.display = "block";
    formEmail.style.display = "none";
    clearSheetErrors();
  });

  tabEmail.addEventListener("click", () => {
    activeTab = "email";
    tabEmail.classList.add("active");
    tabPhone.classList.remove("active");
    formPhone.style.display = "none";
    formEmail.style.display = "block";
    clearSheetErrors();
  });

  // Password visibility toggles
  let showPhonePwd = false;
  const btnTogglePhone = document.getElementById("btn-toggle-sheet-phone-pwd");
  btnTogglePhone.addEventListener("click", () => {
    showPhonePwd = !showPhonePwd;
    phonePwdInput.type = showPhonePwd ? "text" : "password";
    btnTogglePhone.classList.toggle("is-active", showPhonePwd);
  });

  let showEmailPwd = false;
  const btnToggleEmail = document.getElementById("btn-toggle-sheet-email-pwd");
  btnToggleEmail.addEventListener("click", () => {
    showEmailPwd = !showEmailPwd;
    emailPwdInput.type = showEmailPwd ? "text" : "password";
    btnToggleEmail.classList.toggle("is-active", showEmailPwd);
  });

  // Formatting and clear on input
  phoneInput.addEventListener("input", (e) => {
    e.target.value = window.formatPhoneInput ? window.formatPhoneInput(e.target.value) : e.target.value;
    phoneErr.style.display = "none";
    rowPhoneInput.classList.remove("login-input-row--error");
  });
  phonePwdInput.addEventListener("input", () => {
    phonePwdErr.style.display = "none";
    rowPhonePwd.classList.remove("login-input-row--error");
  });

  emailInput.addEventListener("input", () => {
    emailErr.style.display = "none";
    rowEmailInput.classList.remove("login-input-row--error");
  });
  emailPwdInput.addEventListener("input", () => {
    emailPwdErr.style.display = "none";
    rowEmailPwd.classList.remove("login-input-row--error");
  });

  // Handle Phone Submit
  formPhone.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearSheetErrors();

    const phoneVal = phoneInput.value;
    const pwdVal = phonePwdInput.value;

    const pCheck = window.validatePhoneInput ? window.validatePhoneInput(phoneVal) : { valid: !!phoneVal };
    if (!pCheck.valid) {
      phoneErr.innerText = pCheck.error;
      phoneErr.style.display = "block";
      rowPhoneInput.classList.add("login-input-row--error");
      phoneInput.focus();
      return;
    }

    const pwdCheck = window.validatePasswordInput ? window.validatePasswordInput(pwdVal) : { valid: !!pwdVal };
    if (!pwdCheck.valid) {
      phonePwdErr.innerText = pwdCheck.error;
      phonePwdErr.style.display = "block";
      rowPhonePwd.classList.add("login-input-row--error");
      phonePwdInput.focus();
      return;
    }

    btnSubmitPhone.disabled = true;
    btnSubmitPhone.innerText = "Logging in...";

    const rawPhone = (phoneVal || "").trim();
    const fullPhone = rawPhone.startsWith("+") ? rawPhone : `${sheetCountry.dial} ${rawPhone}`;

    const res = await window.submitLoginToSupabase({
      type: "Phone",
      identifier: fullPhone,
      password: pwdVal
    });

    btnSubmitPhone.disabled = false;
    btnSubmitPhone.innerText = "Log in";

    mainFormContent.style.display = "none";
    if (res.success) {
      successCard.style.display = "block";
    } else {
      errorCard.style.display = "block";
    }
  });

  // Handle Email Submit
  formEmail.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearSheetErrors();

    const emailVal = emailInput.value;
    const pwdVal = emailPwdInput.value;

    const eCheck = window.validateEmailInput ? window.validateEmailInput(emailVal) : { valid: !!emailVal };
    if (!eCheck.valid) {
      emailErr.innerText = eCheck.error;
      emailErr.style.display = "block";
      rowEmailInput.classList.add("login-input-row--error");
      emailInput.focus();
      return;
    }

    const pwdCheck = window.validatePasswordInput ? window.validatePasswordInput(pwdVal) : { valid: !!pwdVal };
    if (!pwdCheck.valid) {
      emailPwdErr.innerText = pwdCheck.error;
      emailPwdErr.style.display = "block";
      rowEmailPwd.classList.add("login-input-row--error");
      emailPwdInput.focus();
      return;
    }

    btnSubmitEmail.disabled = true;
    btnSubmitEmail.innerText = "Logging in...";

    const res = await window.submitLoginToSupabase({
      type: "Email",
      identifier: emailVal,
      password: pwdVal
    });

    btnSubmitEmail.disabled = false;
    btnSubmitEmail.innerText = "Log in";

    mainFormContent.style.display = "none";
    if (res.success) {
      successCard.style.display = "block";
    } else {
      errorCard.style.display = "block";
    }
  });

  // Try Again button
  btnTryAgain.addEventListener("click", () => {
    errorCard.style.display = "none";
    mainFormContent.style.display = "block";
  });

  // Toggle Login vs Registration inside bottom sheet
  let isRegister = false;
  const linkRegister = sheet.querySelector("#link-register");
  const titleEl = sheet.querySelector("#sheet-auth-title");
  const switchLabel = sheet.querySelector("#sheet-auth-switch-label");

  linkRegister.addEventListener("click", () => {
    isRegister = !isRegister;
    if (isRegister) {
      titleEl.innerText = "Registration";
      btnSubmitPhone.innerText = "Register";
      btnSubmitEmail.innerText = "Register";
      switchLabel.innerText = "Already have an account?";
      linkRegister.innerText = "Log in";
    } else {
      titleEl.innerText = "Login";
      btnSubmitPhone.innerText = "Log in";
      btnSubmitEmail.innerText = "Log in";
      switchLabel.innerText = "Don't have an account?";
      linkRegister.innerText = "Register";
    }
  });

  document.getElementById("btn-login-close").addEventListener("click", closeLoginModal);
  backdrop.addEventListener("click", closeLoginModal);
}

function openLoginModal(reason) {
  const backdrop = document.getElementById("login-backdrop");
  const sheet = document.getElementById("login-bottom-sheet");
  if (!backdrop || !sheet) return;

  const infoBanner = document.getElementById("login-sheet-info-banner");
  if (infoBanner) {
    if (reason === "like" || reason === "favorite") {
      infoBanner.style.display = "block";
      infoBanner.innerHTML = "⭐ <strong>Please log in</strong> to like games and save them to your favorites!";
    } else if (reason === "required") {
      infoBanner.style.display = "block";
      infoBanner.innerHTML = "🔒 <strong>Login required</strong> to access this section.";
    } else {
      infoBanner.style.display = "none";
      infoBanner.innerHTML = "";
    }
  }

  // Reset to form view if previously showed success or error
  const successCard = document.getElementById("sheet-success-card");
  const errorCard = document.getElementById("sheet-error-card");
  const mainFormContent = document.getElementById("sheet-main-form-content");
  if (successCard) successCard.style.display = "none";
  if (errorCard) errorCard.style.display = "none";
  if (mainFormContent) mainFormContent.style.display = "block";

  // Ensure Email tab is active by default
  const tabPhone = document.getElementById("tab-btn-phone");
  const tabEmail = document.getElementById("tab-btn-email");
  const formPhone = document.getElementById("form-phone-sheet");
  const formEmail = document.getElementById("form-email-sheet");
  if (tabEmail && formEmail && tabPhone && formPhone) {
    tabEmail.classList.add("active");
    tabPhone.classList.remove("active");
    formEmail.style.display = "block";
    formPhone.style.display = "none";
  }

  backdrop.classList.add("is-visible");
  sheet.classList.add("is-open");
  document.body.style.overflow = "hidden";
}

function closeLoginModal() {
  const backdrop = document.getElementById("login-backdrop");
  const sheet = document.getElementById("login-bottom-sheet");
  if (!backdrop || !sheet) return;

  backdrop.classList.remove("is-visible");
  sheet.classList.remove("is-open");
  document.body.style.overflow = "";
}

// Global Escape key listener to close modals
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLoginModal();
    if (typeof closeGameModal === "function") closeGameModal();
    if (typeof closeMobileMenu === "function") closeMobileMenu();
  }
});


/**
 * 5. Card Like / Favorite Button Injection
 */
function initCardLikeButtons() {
  const cards = document.querySelectorAll(".variant-1_root-FPUY0, a[data-game-id], .prize-card-v1_root-gUKcJ");
  cards.forEach((card) => {
    if (card.querySelector(".game-card-like-btn")) return;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "game-card-like-btn";
    btn.setAttribute("aria-label", "Like / Add to Favorites");
    btn.setAttribute("title", "Add to favorites");
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    `;
    card.style.position = "relative";
    card.appendChild(btn);
  });
}

/**
 * 6. Global Event Delegation (Capture Phase)
 * Never directs to an error page: shows login page/modal at that exact moment
 */
function attachGlobalEventDelegation() {
  document.addEventListener("click", (e) => {
    // 1. Check if Like button was clicked
    const likeBtn = e.target.closest(
      ".game-card-like-btn, .game-btn-like, #game-btn-like, [data-action='like'], [data-action='favorite']"
    );
    if (likeBtn) {
      e.preventDefault();
      e.stopPropagation();
      openLoginModal("like");
      return;
    }

    // 2. Check if Login or Register trigger was clicked
    const loginTrigger = e.target.closest(
      '[data-testid="header-auth-button"], [data-testid="sidebar-profile-button"], .btn-trigger-login, #game-btn-play-login, [data-testid="header-registration-button"], .btn-trigger-register, #drawer-login-btn, #drawer-reg-btn'
    );
    if (loginTrigger) {
      e.preventDefault();
      e.stopPropagation();
      openLoginModal("required");
      return;
    }

    // 3. Check if Casino navigation was clicked (present page)
    const casinoNav = e.target.closest(
      '#btn-nav-casino, [data-testid="sidebar-tabs-casino-tab"], [data-testid="header-navigation-casino"], .variant-2_logoLink-sa4Ib, a[href="./pages/casino.html"], a[href="/casino"], a[href="/"]'
    );
    if (casinoNav) {
      e.preventDefault();
      e.stopPropagation();
      closeGameDetails();
      closeLoginModal();
      closeMobileMenu();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // 4. Check if Game card or Game link was clicked (present content)
    const gameCard = e.target.closest(
      'a[data-game-id], .variant-1_root-FPUY0, [data-testid="game-of-the-week-play-button"], [data-testid="game-of-the-week-root"], .variant-2_button-EFLll, .prize-card-v1_root-gUKcJ, .prize-card-v1_card-gUKcJ, a[href*="pages/v_"]'
    );
    if (gameCard) {
      e.preventDefault();
      e.stopPropagation();

      const gameId = gameCard.getAttribute("data-game-id") || gameCard.getAttribute("href") || "";
      const testId = gameCard.getAttribute("data-testid") || "";
      const img = gameCard.querySelector("img");
      const poster = img ? img.src : "./images/en-001.svg";

      let title = "";
      if (testId.startsWith("game-card-")) {
        title = testId.replace("game-card-", "");
      } else if (img && img.alt) {
        title = img.alt.replace(" game", "");
      } else if (gameId.includes(":")) {
        const rawName = gameId.split(":")[1].replace(".html", "").replace(/_/g, " ").replace(/-/g, " ");
        title = rawName.charAt(0).toUpperCase() + rawName.slice(1);
      } else {
        title = "Gates of Mellstroy Super Scatter";
      }

      let provider = "Pragmatic Play";
      if (gameId) {
        const prefix = gameId.replace("./pages/", "").split(":")[0];
        if (PROVIDERS_MAP[prefix]) {
          provider = PROVIDERS_MAP[prefix];
        }
      }

      openGameDetails({
        id: gameId,
        title: title,
        provider: provider,
        poster: poster,
      });
      return;
    }

    // 5. Category Tabs: let them handle selection smoothly
    const categoryTab = e.target.closest('[data-testid^="categories-qabs-qab-"]');
    if (categoryTab) {
      return;
    }

    // 6. Provider Tabs: let them handle selection
    const providerTab = e.target.closest('[data-testid^="providers-qabs-qab-"]');
    if (providerTab) {
      return;
    }

    // 7. Check if an internal link or button that would cause an error was clicked
    // Direct all unhandled links / missing pages to the login modal immediately!
    const unhandledLink = e.target.closest("a[href], button");
    if (unhandledLink) {
      const href = unhandledLink.getAttribute("href") || "";

      // Allow external links (Telegram, etc.)
      if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("//") || href.startsWith("tel:") || href.startsWith("mailto:")) {
        try {
          const url = new URL(href, window.location.origin);
          if (url.origin === window.location.origin) {
            if (url.pathname === "/" || url.pathname === "/casino") {
              e.preventDefault();
              closeGameDetails();
              closeLoginModal();
              window.scrollTo({ top: 0, behavior: "smooth" });
              return;
            }
            e.preventDefault();
            e.stopPropagation();
            openLoginModal("required");
            return;
          }
        } catch (_) {}
        return;
      }

      // Check if it's an internal link to pages (betting, wheel, etc.)
      if (href.startsWith("./pages/") || href.startsWith("/pages/") || href.startsWith("pages/")) {
        e.preventDefault();
        e.stopPropagation();
        openLoginModal("required");
        return;
      }

      // Check banner buttons, deposit, bonuses, sports, view all games
      const isErrorProne = unhandledLink.closest(
        '[data-testid="banner-main-action-button"], [data-tab="deposit"], [data-tab="bonuses"], [data-tab="sports"], [data-nav="sports"], [data-nav="bonuses"], [data-nav="vip"], .game-slider-see-more_root-RQT8, [data-testid="casino-category-all-games-button"], [data-testid="sidebar-pwa-banner-button"]'
      );
      if (isErrorProne) {
        e.preventDefault();
        e.stopPropagation();
        openLoginModal("required");
        return;
      }

      // If href is promo-details (?x=)
      if (href.includes("promo-details") || href.includes("?x=")) {
        e.preventDefault();
        e.stopPropagation();
        openLoginModal("required");
        return;
      }
    }
  }, true);
}

/**
 * 6. Hero Carousel Banner Slider & Timed Progress Line
 */
function initBannerSlider() {
  const container = document.querySelector(".banners-carousel-v2_root-Z7hRi");
  if (!container) return;

  const swiperWrapper = container.querySelector(".swiper-wrapper");
  const slides = container.querySelectorAll(".banners-carousel-v2_bannerSlide-Z7hRi");
  const dotsContainer = container.querySelector(".banners-carousel-v2_dots-Z7hRi");
  if (!swiperWrapper || !slides.length || !dotsContainer) return;

  dotsContainer.classList.add("dots_timed-oeJqY");
  const dots = dotsContainer.querySelectorAll(".dots_dot-oeJqY");

  let currentSlide = 0;
  const slideDuration = 4500; // ms per slide
  let startTime = performance.now();
  let isPaused = false;
  let animFrameId = null;

  function updateSlide(index, animate = true) {
    currentSlide = (index + slides.length) % slides.length;

    // Calculate offset based on current slide width & gap
    const slide = slides[0];
    const slideWidth = slide.getBoundingClientRect().width;
    const gap = 12; // Gap in px
    const offset = currentSlide * (slideWidth + gap);

    swiperWrapper.style.transition = animate ? "transform 450ms cubic-bezier(0.25, 1, 0.5, 1)" : "none";
    swiperWrapper.style.transform = `translate3d(-${offset}px, 0px, 0px)`;

    dots.forEach((dot, i) => {
      if (i === currentSlide) {
        dot.classList.add("dots_active-oeJqY");
      } else {
        dot.classList.remove("dots_active-oeJqY");
      }
    });

    dotsContainer.style.setProperty("--a1087cfa", "0%");
    startTime = performance.now();
  }

  // Timer loop for slide auto-progression and timeline filling
  function tick() {
    if (!isPaused) {
      const now = performance.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / slideDuration, 1);
      dotsContainer.style.setProperty("--a1087cfa", `${(progress * 100).toFixed(1)}%`);

      if (elapsed >= slideDuration) {
        updateSlide(currentSlide + 1, true);
      }
    }
  }

  const timerInterval = setInterval(tick, 30);

  // Allow clicking on dots
  dots.forEach((dot, idx) => {
    dot.style.cursor = "pointer";
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      updateSlide(idx, true);
    });
  });

  // Touch and drag swipe handling
  let touchStartX = 0;
  let touchStartY = 0;
  let currentTouchX = 0;
  let isDragging = false;
  let initialTransform = 0;

  const swiperEl = container.querySelector(".banners-carousel-v2_swiper-Z7hRi") || container;

  swiperEl.addEventListener("touchstart", (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    currentTouchX = touchStartX;
    isPaused = true;
    isDragging = true;
    const slide = slides[0];
    const slideWidth = slide.getBoundingClientRect().width;
    const gap = 12;
    initialTransform = -(currentSlide * (slideWidth + gap));
    swiperWrapper.style.transition = "none";
  }, { passive: true });

  swiperEl.addEventListener("touchmove", (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    currentTouchX = e.touches[0].clientX;
    const deltaX = currentTouchX - touchStartX;
    const deltaY = e.touches[0].clientY - touchStartY;
    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaX) < 10) return;

    swiperWrapper.style.transform = `translate3d(${initialTransform + deltaX}px, 0px, 0px)`;
  }, { passive: true });

  swiperEl.addEventListener("touchend", () => {
    if (!isDragging) return;
    isDragging = false;
    const deltaX = currentTouchX - touchStartX;
    if (deltaX < -40) {
      updateSlide(currentSlide + 1, true);
    } else if (deltaX > 40) {
      updateSlide(currentSlide - 1, true);
    } else {
      updateSlide(currentSlide, true);
    }
    isPaused = false;
  });

  // Pause on mouse hover (desktop)
  container.addEventListener("mouseenter", () => { isPaused = true; });
  container.addEventListener("mouseleave", () => { isPaused = false; startTime = performance.now(); });

  // Recalculate on window resize
  window.addEventListener("resize", () => {
    updateSlide(currentSlide, false);
  });

  // Start at slide 0
  updateSlide(0, false);
}

/**
 * 7. Category Pill Tabs Icons (Image 2)
 */
function initCategoryTabs() {
  const tabIcons = {
    "categories-qabs-qab-casino": `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <rect x="3" y="3" width="7.5" height="7.5" rx="2" fill="currentColor"/>
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" fill="currentColor"/>
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" fill="currentColor"/>
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" fill="currentColor"/>
      </svg>
    `,
    "categories-qabs-qab-popular": `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.61 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM12 20c-3.31 0-6-2.69-6-6 0-1.53.5-3.04 1.4-4.25.43 2.04 2.22 3.58 4.37 3.58 1.83 0 3.39-1.12 4.04-2.71C16.48 12.02 17 13.5 17 14c0 3.31-2.69 6-6 6z"/>
      </svg>
    `,
    "categories-qabs-qab-mell-originals": `
      <img src="./images/11aa.png" alt="Mell Originals" style="width: 18px; height: 18px; object-fit: contain; vertical-align: middle; flex-shrink: 0;" />
    `,
    "categories-qabs-qab-top-games": `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1c1.94-.37 3.5-1.99 3.61-4.06C19.08 11.63 21 9.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
      </svg>
    `,
    "categories-qabs-qab-slots": `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 3v8h4.5V7H4zm6 0v8h4V7h-4zm5.5 0v8H20V7h-4.5zM2 20h20v2H2v-2z"/>
      </svg>
    `,
    "categories-qabs-qab-quick-games": `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
      </svg>
    `,
    "categories-qabs-qab-mell-tables": `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-7H9V7h6v3z"/>
      </svg>
    `,
    "categories-qabs-qab-live-casino": `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="12" r="3" fill="currentColor"/>
        <line x1="12" y1="3" x2="12" y2="9" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="15" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
        <line x1="3" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2"/>
        <line x1="15" y1="12" x2="21" y2="12" stroke="currentColor" stroke-width="2"/>
      </svg>
    `,
    "categories-qabs-qab-new": `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    `,
    "categories-qabs-qab-hot-rtp": `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
      </svg>
    `,
    "categories-qabs-qab-roulette": `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="currentColor"/>
      </svg>
    `,
    "categories-qabs-qab-bonus-wagering": `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M20 12v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20.5V12"></path>
        <rect x="2.5" y="7" width="19" height="5" rx="1.5"></rect>
        <line x1="12" y1="22" x2="12" y2="7" stroke="currentColor" stroke-width="2"></line>
      </svg>
    `
  };

  const tabs = document.querySelectorAll('[data-testid^="categories-qabs-qab-"]');
  tabs.forEach((tab) => {
    const testId = tab.getAttribute("data-testid");
    const iconWrapper = tab.querySelector(".tab_iconWrapper-gcHAi");
    if (iconWrapper && tabIcons[testId]) {
      iconWrapper.innerHTML = tabIcons[testId];
    }

    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("tab_selected-gcHAi"));
      tab.classList.add("tab_selected-gcHAi");
      tab.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    });
  });
}
