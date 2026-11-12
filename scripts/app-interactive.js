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
  initSupportBottomSheet();
  initRegistrationBottomSheet();
  initBannerSlider();
  initBannerDetailsModal();
  initCategoryTabs();
  initCardLikeButtons();
  attachGlobalEventDelegation();
  updateHeaderAuthState();

  // URL query parameters and hash triggers for direct testing/deep linking
  const urlParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash;
  const gameParam = urlParams.get("game");
  const loginParam = urlParams.get("login");
  const reasonParam = urlParams.get("reason");
  const categoryParam = urlParams.get("category");
  const currencyParam = urlParams.get("currency");
  const openParam = urlParams.get("open");
  const registeredParam = urlParams.get("registered");

  if (currencyParam) {
    const found = APP_CURRENCIES.find(c => c.code.toLowerCase() === currencyParam.toLowerCase());
    if (found) {
      setActiveUserCurrency(found);
    }
  }

  if (registeredParam === "true") {
    localStorage.setItem("user_registered", "true");
    updateHeaderAuthState();
    setTimeout(() => openCurrencyStatusModal(), 200);
  } else if (openParam === "currency" || hash === "#currency") {
    setTimeout(() => window.openCurrencyPicker(), 150);
  } else if (openParam === "currency-status" || hash === "#currency-status") {
    setTimeout(() => openCurrencyStatusModal(), 150);
  } else if (openParam === "country" || hash === "#country") {
    setTimeout(() => {
      if (typeof window.openCountryPicker === "function") window.openCountryPicker();
    }, 150);
  }

  if (categoryParam) {
    switchCategory(categoryParam);
  } else if (hash.startsWith("#category-")) {
    switchCategory(hash.replace("#category-", ""));
  } else if (hash === "#popular") {
    switchCategory("popular");
  } else if (hash === "#mell-originals" || hash === "#originals") {
    switchCategory("mell-originals");
  } else {
    switchCategory("lobby");
  }

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
  } else if (hash === "#bonus-details" || hash === "#banner-details" || hash === "#hearts-and-spins") {
    openBannerDetailsModal();
  } else if (hash === "#register" || hash === "#bonus" || urlParams.get("mode") === "register") {
    openRegistrationModal();
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
 * 0. Modal & Back Button History Manager ("Cut It Once" on Phone)
 */
const modalHistoryStack = [];
let isNavigatingBack = false;

window.pushModalHistory = function(modalId, closeFn) {
  const existingIdx = modalHistoryStack.findIndex(m => m.id === modalId);
  if (existingIdx !== -1) {
    modalHistoryStack.splice(existingIdx, 1);
  }
  modalHistoryStack.push({ id: modalId, close: closeFn });
  try {
    history.pushState({ modalOpen: true, modalId: modalId, t: Date.now() }, "");
  } catch (_) {}
};

window.popModalHistory = function(modalId, isFromPopstate = false) {
  const idx = modalHistoryStack.findIndex(m => m.id === modalId);
  if (idx !== -1) {
    modalHistoryStack.splice(idx, 1);
  }
  if (!isFromPopstate) {
    if (history.state && history.state.modalId === modalId) {
      isNavigatingBack = true;
      try { history.back(); } catch (_) {}
      setTimeout(() => { isNavigatingBack = false; }, 120);
    }
  }
};

window.addEventListener("popstate", () => {
  if (isNavigatingBack) {
    isNavigatingBack = false;
    return;
  }
  // Mobile Back Button: cut/close the topmost modal once without leaving page
  if (modalHistoryStack.length > 0) {
    const top = modalHistoryStack.pop();
    if (top && typeof top.close === "function") {
      top.close(true);
    }
  }
});

/**
 * 1. Demo Mode & Action Click Tracker (1st Click = Demo/Preview, 2nd Click = Prompt Login)
 */
const actionClickTracker = new Map();

function trackActionClick(actionKey) {
  const current = (actionClickTracker.get(actionKey) || 0) + 1;
  actionClickTracker.set(actionKey, current);
  return current;
}

function showDemoFeedbackToast(msg) {
  const el = document.getElementById("demo-feedback-toast");
  if (el) el.remove();
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function updateBottomNavMenuIcon(isOpen) {
  const btn = document.getElementById("btn-nav-menu");
  const label = document.querySelector('.bottom-nav-labels .nav-label-item[data-tab="menu"]');
  if (!btn) return;
  if (isOpen) {
    btn.innerHTML = `
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round">
        <line x1="6" y1="6" x2="18" y2="18"></line>
        <line x1="6" y1="18" x2="18" y2="6"></line>
      </svg>
    `;
    btn.classList.add("menu-active");
    if (label) label.classList.add("menu-active");
  } else {
    btn.innerHTML = `
      <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="4" y1="7" x2="20" y2="7"></line>
        <line x1="4" y1="12" x2="20" y2="12"></line>
        <line x1="4" y1="17" x2="20" y2="17"></line>
      </svg>
    `;
    btn.classList.remove("menu-active");
    if (label) label.classList.remove("menu-active");
  }
}

/**
 * 2. Mobile Drawer (Menu Tab) - Matching Image 1
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
    <!-- Top Stats (Image 1) -->
    <div class="drawer-top-stats">
      <span class="drawer-online-label">Players online</span>
      <span class="drawer-online-val">
        <span class="drawer-online-dot"></span>
        <span id="drawer-online-count">5,092</span>
      </span>
    </div>

    <div class="mobile-drawer-content">
      <!-- User / Log In Row (Image 1) -->
      <div class="drawer-profile-card" id="drawer-login-row" role="button" tabindex="0">
        <div class="drawer-profile-left">
          <div class="drawer-avatar-circle">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <span class="drawer-profile-title">Log in</span>
        </div>
        <div class="drawer-profile-arrow">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
          </svg>
        </div>
      </div>

      <!-- Segment Tabs: Casino vs Sports (Image 1) -->
      <div class="drawer-segments-row">
        <button type="button" class="drawer-segment-btn active" id="drawer-tab-casino" data-segment="casino">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2.5C9.5 5.5 4.5 10 4.5 14a5.5 5.5 0 0 0 9.5 3.65c-.3 1.25-1.1 2.6-2.5 3.1h5c-1.4-.5-2.2-1.85-2.5-3.1A5.5 5.5 0 0 0 19.5 14c0-4-5-8.5-7.5-11.5z"></path>
          </svg>
          <span>Casino</span>
        </button>
        <button type="button" class="drawer-segment-btn" id="drawer-tab-sports" data-segment="sports">
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
        </button>
      </div>

      <!-- Fortune Wheel Card (Image 1) -->
      <div class="drawer-wheel-card" id="drawer-wheel-btn" role="button" tabindex="0">
        <span class="drawer-wheel-title">Fortune Wheel</span>
        <img src="./images/wheel-compact.png" alt="Wheel" class="drawer-wheel-thumb" onerror="this.style.display='none'" />
      </div>

      <!-- Navigation List Items (Image 1) -->
      <div class="drawer-nav-list">
        <!-- Bonuses -->
        <a href="#bonuses" class="drawer-nav-link" data-nav="bonuses">
          <div class="drawer-nav-left">
            <span class="drawer-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 12v8.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 20.5V12"></path>
                <rect x="2.5" y="7" width="19" height="5" rx="1.5"></rect>
                <line x1="12" y1="22" x2="12" y2="7"></line>
                <path d="M12 7H7.8a2.3 2.3 0 0 1 0-4.6C10.5 2.4 12 7 12 7z"></path>
                <path d="M12 7h4.2a2.3 2.3 0 0 0 0-4.6C13.5 2.4 12 7 12 7z"></path>
              </svg>
            </span>
            <span>Bonuses</span>
          </div>
        </a>

        <!-- Promotions (Selected Purple Indicator in Image 1) -->
        <a href="#promotions" class="drawer-nav-link has-indicator" data-nav="promotions">
          <div class="drawer-nav-left">
            <span class="drawer-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
            </span>
            <span>Promotions</span>
          </div>
        </a>

        <!-- Tournaments with Badge 2 in Image 1 -->
        <a href="#tournaments" class="drawer-nav-link" data-nav="tournaments">
          <div class="drawer-nav-left">
            <span class="drawer-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"></path>
              </svg>
            </span>
            <span>Tournaments</span>
          </div>
          <span class="drawer-badge-green">2</span>
        </a>

        <!-- Slots -->
        <a href="#slots" class="drawer-nav-link" data-nav="slots">
          <div class="drawer-nav-left">
            <span class="drawer-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <line x1="6" y1="9" x2="6" y2="15"></line>
                <line x1="12" y1="9" x2="12" y2="15"></line>
                <line x1="18" y1="9" x2="18" y2="15"></line>
                <circle cx="22" cy="12" r="1.5" fill="currentColor"></circle>
              </svg>
            </span>
            <span>Slots</span>
          </div>
        </a>

        <!-- Live Casino -->
        <a href="#live-casino" class="drawer-nav-link" data-nav="live-casino">
          <div class="drawer-nav-left">
            <span class="drawer-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
              </svg>
            </span>
            <span>Live Casino</span>
          </div>
        </a>

        <!-- Bonus buy -->
        <a href="#bonus-buy" class="drawer-nav-link" data-nav="bonus-buy">
          <div class="drawer-nav-left">
            <span class="drawer-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="8" width="18" height="13" rx="2"></rect>
                <path d="M16 8V6a4 4 0 0 0-8 0v2"></path>
              </svg>
            </span>
            <span>Bonus buy</span>
          </div>
        </a>

        <!-- New -->
        <a href="#new" class="drawer-nav-link" data-nav="new">
          <div class="drawer-nav-left">
            <span class="drawer-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </span>
            <span>New</span>
          </div>
        </a>

        <!-- Terms and conditions -->
        <a href="#terms" class="drawer-nav-link" data-nav="terms">
          <div class="drawer-nav-left">
            <span class="drawer-nav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </span>
            <span>Terms and conditions</span>
          </div>
        </a>
      </div>

      <!-- Install App Card (Image 1) -->
      <div class="drawer-install-card" id="drawer-install-app-btn">
        <div class="drawer-install-left">
          <img src="./images/11aa.png" alt="App" class="drawer-install-thumb" onerror="this.style.display=\'none\'" />
          <div class="drawer-install-info">
            <span class="drawer-install-title">Install app</span>
            <span class="drawer-install-subtitle">+200 Points</span>
          </div>
        </div>
        <button type="button" class="drawer-install-btn" aria-label="Download app">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
        </button>
      </div>

      <!-- Social & Language row (Image 1) -->
      <div class="drawer-social-lang-row">
        <!-- Telegram -->
        <a href="https://t.me" target="_blank" rel="noopener noreferrer" class="drawer-social-btn drawer-social-tg" aria-label="Telegram">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
          </svg>
        </a>

        <!-- VK -->
        <a href="https://vk.com" target="_blank" rel="noopener noreferrer" class="drawer-social-btn drawer-social-vk" aria-label="VK">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M15.684 0H8.316C2.792 0 0 2.792 0 8.316v7.368C0 21.208 2.792 24 8.316 24h7.368C21.208 24 24 21.208 24 15.684V8.316C24 2.792 21.208 0 15.684 0zm3.602 17.201h-2.138c-.81 0-1.057-.643-2.513-2.102-1.268-1.233-1.832-1.39-2.146-1.39-.44 0-.566.126-.566.729v1.942c0 .515-.164.821-1.533.821-2.261 0-4.768-1.37-6.529-3.918-2.651-3.729-3.379-6.541-3.379-7.119 0-.314.126-.603.741-.603h2.137c.553 0 .767.251.98.842 1.08 3.128 2.89 5.867 3.631 5.867.276 0 .402-.126.402-.817V10.74c-.088-1.47-.867-1.595-.867-2.122 0-.251.213-.503.565-.503h3.367c.465 0 .641.251.641.791v4.283c0 .465.201.628.339.628.277 0 .503-.163.993-.653 1.533-1.721 2.626-4.308 2.626-4.308.151-.314.415-.553.967-.553h2.137c.641 0 .779.327.641.791-.251 1.156-2.676 4.585-2.776 4.748-.226.352-.314.515 0 .942.226.314.967 1.018 1.483 1.621 1.03 1.206 1.834 2.21 2.048 2.914.226.703-.126 1.068-.766 1.068z"/>
          </svg>
        </a>

        <!-- Language Picker -->
        <button type="button" class="drawer-lang-btn" id="drawer-lang-btn">
          <span style="font-size: 16px;">🇬🇧</span>
          <span>EN</span>
          <span style="font-size: 10px; opacity: 0.7;">▼</span>
        </button>
      </div>

      <!-- Support Bar (Image 1) -->
      <div class="drawer-support-bar" id="drawer-support-btn" role="button" tabindex="0">
        <span class="drawer-support-title">Support</span>
        <span class="drawer-support-badge">24/7</span>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(drawer);

  // Close when tapping backdrop
  backdrop.addEventListener("click", () => closeMobileMenu());

  // Log in row -> opens login
  drawer.querySelector("#drawer-login-row").addEventListener("click", () => {
    closeMobileMenu();
    openLoginModal("required");
  });

  // Support row -> opens support chat (Image 2)
  drawer.querySelector("#drawer-support-btn").addEventListener("click", () => {
    closeMobileMenu();
    openSupportModal();
  });

  // Casino / Sports segment tabs
  const tabCasino = drawer.querySelector("#drawer-tab-casino");
  const tabSports = drawer.querySelector("#drawer-tab-sports");

  tabCasino.addEventListener("click", () => {
    tabCasino.classList.add("active");
    tabSports.classList.remove("active");
    closeMobileMenu();
    setActiveNavTab("casino");
  });

  tabSports.addEventListener("click", () => {
    closeMobileMenu();
    openLoginModal("required");
  });

  // Fortune Wheel: opens login
  drawer.querySelector("#drawer-wheel-btn").addEventListener("click", () => {
    closeMobileMenu();
    openLoginModal("required");
  });

  // Install app: opens login
  drawer.querySelector("#drawer-install-app-btn").addEventListener("click", () => {
    closeMobileMenu();
    openLoginModal("required");
  });

  // Language switcher toast
  drawer.querySelector("#drawer-lang-btn").addEventListener("click", () => {
    // English active
  });

  // Nav list links: 1st click demo preview, 2nd click opens login
  drawer.querySelectorAll(".drawer-nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const navTarget = link.getAttribute("data-nav") || "page";
      const nameEl = link.querySelector(".drawer-nav-left span:last-child");
      const name = nameEl ? nameEl.innerText : navTarget;
      closeMobileMenu();
      if (navTarget === "bonuses" || navTarget === "promotions" || navTarget === "bonus-buy") {
        openRegistrationModal();
        return;
      }
      openLoginModal("required");
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

  updateBottomNavMenuIcon(true);
  window.pushModalHistory("mobile-drawer", (fromPop) => closeMobileMenu(fromPop));
}

function closeMobileMenu(isFromPopstate = false) {
  const backdrop = document.getElementById("mobile-drawer-backdrop");
  const drawer = document.getElementById("mobile-drawer");
  if (!backdrop || !drawer) return;
  backdrop.classList.remove("is-visible");
  drawer.classList.remove("is-open");
  document.body.style.overflow = "";

  updateBottomNavMenuIcon(false);
  window.popModalHistory("mobile-drawer", isFromPopstate);
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
 * 3. Mobile Bottom Navigation Bar (Image 1)
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
          <line x1="12" y1="22" x2="12" y2="7.5"></line>
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

  // Floating Support Bubble -> opens Support Bottom Sheet
  const chatBubble = document.createElement("div");
  chatBubble.className = "floating-chat-bubble";
  chatBubble.id = "floating-chat-bubble";
  chatBubble.setAttribute("title", "Live Support 24/7");
  chatBubble.innerHTML = `
    <svg viewBox="0 0 24 24" width="22" height="22" fill="#ffffff">
      <path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.65 1.45 5.03 3.73 6.55-.17.95-.74 2.42-1.71 3.45-.16.17-.06.45.17.48 1.83.2 3.8-.4 5.04-1.22.9.27 1.85.42 2.82.42 5.5 0 10-3.8 10-8.5S17.5 3 12 3z"/>
    </svg>
  `;
  chatBubble.addEventListener("click", () => {
    openSupportModal();
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
    closeSupportModal();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else if (tabName === "menu") {
    toggleMobileMenu();
  } else {
    closeMobileMenu();
    if (tabName === "bonuses") {
      openRegistrationModal();
    } else {
      openLoginModal("required");
    }
  }
}

/**
 * 4. Support Chat Bottom Sheet (Matching Image 2)
 */
function initSupportBottomSheet() {
  if (document.getElementById("support-bottom-sheet")) return;

  const backdrop = document.createElement("div");
  backdrop.id = "support-backdrop";
  backdrop.className = "support-backdrop";

  const sheet = document.createElement("div");
  sheet.id = "support-bottom-sheet";
  sheet.className = "support-bottom-sheet";
  sheet.innerHTML = `
    <div class="support-sheet-header">
      <h3 class="support-sheet-title">Welcome to support!👋</h3>
      <p class="support-sheet-subtitle">
        We’re available for you 24/7!<br>
        Ask your question — we’re already here 💜
      </p>
      <button class="support-sheet-close" id="btn-support-close" aria-label="Close">✕</button>
    </div>

    <div class="support-sheet-body">
      <!-- Initial Form (Image 2) -->
      <form id="support-initial-form" onsubmit="return false;">
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <input type="text" class="support-input-field" id="support-input-name" placeholder="Your name (optional)" autocomplete="name" />
          
          <div class="support-message-wrap">
            <textarea class="support-input-field" id="support-input-msg" placeholder="Message" rows="3" required></textarea>
            <span class="support-smiley-icon" id="support-smiley" title="Insert smiley">😊</span>
          </div>

          <button type="submit" class="support-submit-btn" id="btn-submit-support">
            <span>Send message</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </form>

      <!-- Interactive Conversation Thread (Switched on Send) -->
      <div id="support-chat-view" style="display: none; flex-direction: column; gap: 12px;">
        <div class="support-chat-thread" id="support-chat-thread"></div>
        <div style="display: flex; gap: 8px; align-items: center; margin-top: 4px;">
          <input type="text" class="support-input-field" id="support-chat-reply-input" placeholder="Type a message..." style="margin: 0;" />
          <button type="button" class="support-submit-btn" id="btn-support-chat-reply" style="width: 48px; height: 48px; flex-shrink: 0; padding: 0;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(sheet);

  // Close listeners
  backdrop.addEventListener("click", () => closeSupportModal());
  sheet.querySelector("#btn-support-close").addEventListener("click", () => closeSupportModal());

  // Smiley inserter
  sheet.querySelector("#support-smiley").addEventListener("click", () => {
    const textarea = sheet.querySelector("#support-input-msg");
    textarea.value += " 💜";
    textarea.focus();
  });

  // Submit initial message
  const initialForm = sheet.querySelector("#support-initial-form");
  initialForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = sheet.querySelector("#support-input-name");
    const msgInput = sheet.querySelector("#support-input-msg");
    const name = nameInput.value.trim() || "Guest";
    const msg = msgInput.value.trim();
    if (!msg) return;

    // Switch to interactive chat view
    initialForm.style.display = "none";
    const chatView = sheet.querySelector("#support-chat-view");
    chatView.style.display = "flex";

    const thread = sheet.querySelector("#support-chat-thread");
    thread.innerHTML = `
      <div class="support-msg-bubble support-msg-user">${escapeHtml(msg)}</div>
      <div class="support-typing-indicator" id="support-agent-typing">
        <span>Support agent is typing...</span>
      </div>
    `;

    setTimeout(() => {
      const typing = sheet.querySelector("#support-agent-typing");
      if (typing) typing.remove();

      const agentReply = document.createElement("div");
      agentReply.className = "support-msg-bubble support-msg-agent";
      agentReply.innerHTML = `Hello ${escapeHtml(name)}! 👋 Welcome to Mellstroy support. We're available 24/7! An agent has received your message and will assist you right now. 💜`;
      thread.appendChild(agentReply);
      thread.scrollTop = thread.scrollHeight;
    }, 800);
  });

  // Follow-up reply
  const replyInput = sheet.querySelector("#support-chat-reply-input");
  const replyBtn = sheet.querySelector("#btn-support-chat-reply");

  function sendFollowUp() {
    const text = replyInput.value.trim();
    if (!text) return;
    replyInput.value = "";
    const thread = sheet.querySelector("#support-chat-thread");

    const userBubble = document.createElement("div");
    userBubble.className = "support-msg-bubble support-msg-user";
    userBubble.innerText = text;
    thread.appendChild(userBubble);
    thread.scrollTop = thread.scrollHeight;

    setTimeout(() => {
      const agentReply = document.createElement("div");
      agentReply.className = "support-msg-bubble support-msg-agent";
      agentReply.innerText = "Thanks for the message! Our live agent is reviewing your query. Please stay connected.";
      thread.appendChild(agentReply);
      thread.scrollTop = thread.scrollHeight;
    }, 700);
  }

  replyBtn.addEventListener("click", sendFollowUp);
  replyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendFollowUp();
    }
  });
}

function openSupportModal() {
  const backdrop = document.getElementById("support-backdrop");
  const sheet = document.getElementById("support-bottom-sheet");
  if (!backdrop || !sheet) return;

  // Close other open views
  closeMobileMenu();

  backdrop.classList.add("is-visible");
  sheet.classList.add("is-open");
  document.body.style.overflow = "hidden";

  window.pushModalHistory("support-sheet", (isFromPopstate) => closeSupportModal(isFromPopstate));
}

function closeSupportModal(isFromPopstate = false) {
  const backdrop = document.getElementById("support-backdrop");
  const sheet = document.getElementById("support-bottom-sheet");
  if (!backdrop || !sheet) return;

  backdrop.classList.remove("is-visible");
  sheet.classList.remove("is-open");
  document.body.style.overflow = "";

  window.popModalHistory("support-sheet", isFromPopstate);
}

/**
 * 5. Registration & Bonus Bottom Sheet (Matching Image 3)
 */
function initRegistrationBottomSheet() {
  if (document.getElementById("reg-bottom-sheet")) return;

  const backdrop = document.createElement("div");
  backdrop.id = "reg-backdrop";
  backdrop.className = "reg-backdrop";

  const sheet = document.createElement("div");
  sheet.id = "reg-bottom-sheet";
  sheet.className = "reg-bottom-sheet";
  sheet.innerHTML = `
    <!-- Top Bonus Banner Header (Image 3) -->
    <div class="reg-banner-header">
      <div class="reg-banner-text-wrap">
        <h2 class="reg-banner-headline">Up to 660%</h2>
        <h2 class="reg-banner-headline">Up to 400 FS</h2>
      </div>
      <img src="./images/slot_777_clean.png" alt="777 Bonus Slot" class="reg-banner-slot-img" onerror="this.src='./images/slot_777.png'" />
      <button type="button" class="reg-sheet-close" id="btn-reg-close" aria-label="Close">✕</button>
    </div>

    <!-- Registration Sheet Body (Image 3) -->
    <div class="reg-sheet-body">
      <!-- Success / Error feedback state -->
      <div class="party-ticket-container" id="reg-success-card" style="display: none;">
        <div class="party-success-card">
          <h3>Server Error</h3>
          <br />
          <p class="success-message-text">Something went wrong on our end. Please try again later.</p>
        </div>
      </div>

      <div class="party-ticket-container" id="reg-error-card" style="display: none;">
        <div class="party-success-card" style="border-color: rgba(239, 68, 68, 0.4);">
          <h3 style="color: #ef4444;">Network Error</h3>
          <br />
          <p class="success-message-text">Network error on our side. Please check your connection and try again.</p>
          <button type="button" class="btn-claim-ticket" id="btn-reg-tryagain" style="background: #ef4444; margin-top: 16px;">
            Try Again
          </button>
        </div>
      </div>

      <div id="reg-main-form-content">
        <h3 class="reg-title">Registration</h3>

        <form id="form-registration-sheet" noValidate>
          <!-- Currency selector -->
          <div class="reg-input-group" style="margin-bottom: 10px;">
            <div class="reg-currency-select" id="reg-currency-btn" role="button" tabindex="0">
              <div class="reg-currency-left">
                <span class="reg-currency-badge" id="reg-currency-badge" style="background: #138808;">₹</span>
                <span class="reg-currency-name" id="reg-currency-name">Indian rupee</span>
              </div>
              <span class="reg-currency-arrow">▼</span>
            </div>
          </div>

          <!-- Phone input row -->
          <div class="reg-input-group" style="margin-bottom: 10px;">
            <div class="reg-input-row" id="row-reg-phone">
              <div class="reg-country-select" id="reg-country-btn" role="button" tabindex="0" title="Select Country">
                <span id="reg-country-flag" style="font-size: 16px;">🇮🇳</span>
                <span style="font-size: 10px; color: #8c7f9f; margin-left: 2px;">▼</span>
              </div>
              <div class="reg-country-divider"></div>
              <input type="tel" class="reg-field" id="reg-phone" placeholder="+91 00000 00000" autocomplete="tel" />
            </div>
            <span class="form-error-text" id="reg-phone-error" style="display: none;"></span>
          </div>

          <!-- Email input row -->
          <div class="reg-input-group" style="margin-bottom: 10px;">
            <div class="reg-input-row" id="row-reg-email">
              <span class="reg-input-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </span>
              <input type="email" class="reg-field" id="reg-email" placeholder="Email" autocomplete="email" />
            </div>
            <span class="form-error-text" id="reg-email-error" style="display: none;"></span>
          </div>

          <!-- Password input row -->
          <div class="reg-input-group" style="margin-bottom: 4px;">
            <div class="reg-input-row" id="row-reg-password">
              <span class="reg-input-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                </svg>
              </span>
              <input type="password" class="reg-field" id="reg-password" placeholder="Password" autocomplete="new-password" />
              <button type="button" class="form-password-toggle" id="btn-toggle-reg-pwd" aria-label="Toggle password visibility">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
              </button>
            </div>
            <span class="reg-input-subtext">At least 8 characters</span>
            <span class="form-error-text" id="reg-password-error" style="display: none;"></span>
          </div>

          <!-- Add promo code link -->
          <div style="margin: 6px 0;">
            <a class="reg-promo-link" id="reg-promo-toggle">Add promo code</a>
            <div class="reg-promo-input-wrap" id="reg-promo-wrap">
              <div class="reg-input-row" style="margin-top: 6px;">
                <input type="text" class="reg-field" id="reg-promo-input" placeholder="Enter promo code (e.g. MELL2026)" />
              </div>
            </div>
          </div>

          <!-- Terms Checkbox -->
          <label class="reg-terms-row">
            <input type="checkbox" class="reg-checkbox" id="reg-terms-check" checked />
            <span>I have read, understood and accepted the <a href="#terms" class="reg-terms-link">Terms and Conditions</a> and <a href="#privacy" class="reg-terms-link">Privacy Policy</a></span>
          </label>

          <!-- Register Green Button -->
          <button type="submit" class="reg-submit-btn" id="btn-submit-registration">
            Register
          </button>
        </form>

        <!-- Divider -->
        <div class="reg-divider-row">
          <div class="reg-divider-line"></div>
          <span class="reg-divider-text">or</span>
          <div class="reg-divider-line"></div>
        </div>

        <!-- Social Logins -->
        <div class="reg-social-row">
          <button class="reg-social-btn reg-social-google" title="Google" type="button" onclick="alert('Register with Google...')">
            <svg viewBox="0 0 24 24" width="22" height="22">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
          </button>
          <button class="reg-social-btn reg-social-yandex" title="Yandex" type="button" onclick="alert('Register with Yandex...')">Я</button>
          <button class="reg-social-btn reg-social-tg" title="Telegram" type="button" onclick="alert('Register with Telegram...')">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
          </button>
        </div>

        <!-- Switch to Log in (Image 3) -->
        <p class="reg-switch-row">
          Already have an account? <a class="reg-switch-link" id="reg-switch-login">Log in</a>
        </p>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(sheet);

  // Close listeners
  backdrop.addEventListener("click", () => closeRegistrationModal());
  sheet.querySelector("#btn-reg-close").addEventListener("click", () => closeRegistrationModal());

  // Switch to Login (Seamless Toggle!)
  sheet.querySelector("#reg-switch-login").addEventListener("click", () => {
    closeRegistrationModal();
    openLoginModal();
  });

  // Country Picker
  let regCountry = { name: "India", code: "IN", dial: "+91", flag: "🇮🇳" };
  const regCountryBtn = sheet.querySelector("#reg-country-btn");
  const regCountryFlag = sheet.querySelector("#reg-country-flag");
  const regPhoneInput = sheet.querySelector("#reg-phone");

  if (regCountryBtn) {
    regCountryBtn.addEventListener("click", () => {
      if (typeof window.openCountryPicker === "function") {
        window.openCountryPicker({
          currentDial: regCountry.dial,
          onSelect: (c) => {
            regCountry = c;
            if (regCountryFlag) regCountryFlag.innerText = c.flag;
            if (regPhoneInput && !regPhoneInput.value.startsWith(c.dial)) {
              regPhoneInput.placeholder = `${c.dial} 00000 00000`;
            }
            regPhoneInput.focus();
          }
        });
      }
    });
  }

  // Password toggle
  const pwdInput = sheet.querySelector("#reg-password");
  const togglePwd = sheet.querySelector("#btn-toggle-reg-pwd");
  if (togglePwd && pwdInput) {
    togglePwd.addEventListener("click", () => {
      const isPwd = pwdInput.type === "password";
      pwdInput.type = isPwd ? "text" : "password";
      togglePwd.style.color = isPwd ? "#ba49fb" : "";
    });
  }

  // Promo toggle
  const promoToggle = sheet.querySelector("#reg-promo-toggle");
  const promoWrap = sheet.querySelector("#reg-promo-wrap");
  if (promoToggle && promoWrap) {
    promoToggle.addEventListener("click", () => {
      const isHidden = promoWrap.style.display !== "block";
      promoWrap.style.display = isHidden ? "block" : "none";
      if (isHidden) {
        promoToggle.innerText = "Hide promo code";
        const pInput = sheet.querySelector("#reg-promo-input");
        if (pInput) pInput.focus();
      } else {
        promoToggle.innerText = "Add promo code";
      }
    });
  }

  // Selected currency tracking
  let regSelectedCurrency = { code: "INR", name: "Indian rupee", bg: "#138808", symbol: "₹" };

  const currBtn = sheet.querySelector("#reg-currency-btn");
  if (currBtn) {
    currBtn.addEventListener("click", () => {
      if (typeof window.openCurrencyPicker === "function") {
        window.openCurrencyPicker({
          currentCode: regSelectedCurrency ? regSelectedCurrency.code : "INR",
          onSelect: (curr) => {
            regSelectedCurrency = curr;
            const badgeEl = sheet.querySelector("#reg-currency-badge");
            const nameEl = sheet.querySelector("#reg-currency-name");
            if (badgeEl) {
              badgeEl.style.background = curr.bg;
              badgeEl.innerHTML = curr.symbol;
            }
            if (nameEl) {
              nameEl.innerText = curr.name;
            }
          }
        });
      }
    });
  }



  // Registration Form Submit
  const regForm = sheet.querySelector("#form-registration-sheet");
  const phoneErr = sheet.querySelector("#reg-phone-error");
  const emailErr = sheet.querySelector("#reg-email-error");
  const pwdErr = sheet.querySelector("#reg-password-error");
  const rowPhone = sheet.querySelector("#row-reg-phone");
  const rowEmail = sheet.querySelector("#row-reg-email");
  const rowPwd = sheet.querySelector("#row-reg-password");
  const btnSubmit = sheet.querySelector("#btn-submit-registration");
  const successCard = sheet.querySelector("#reg-success-card");
  const errorCard = sheet.querySelector("#reg-error-card");
  const mainContent = sheet.querySelector("#reg-main-form-content");
  const btnTryAgain = sheet.querySelector("#btn-reg-tryagain");

  if (btnTryAgain) {
    btnTryAgain.addEventListener("click", () => {
      errorCard.style.display = "none";
      mainContent.style.display = "block";
    });
  }

  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    phoneErr.style.display = "none";
    emailErr.style.display = "none";
    pwdErr.style.display = "none";
    rowPhone.classList.remove("reg-input-row--error");
    rowEmail.classList.remove("reg-input-row--error");
    rowPwd.classList.remove("reg-input-row--error");

    const phoneVal = (regPhoneInput.value || "").trim();
    const emailVal = (sheet.querySelector("#reg-email").value || "").trim();
    const pwdVal = (pwdInput.value || "").trim();

    if (!phoneVal && !emailVal) {
      phoneErr.innerText = "Please enter your phone number or email";
      phoneErr.style.display = "block";
      rowPhone.classList.add("reg-input-row--error");
      regPhoneInput.focus();
      return;
    }

    if (phoneVal) {
      const pCheck = window.validatePhoneInput ? window.validatePhoneInput(phoneVal) : { valid: phoneVal.length >= 6 };
      if (!pCheck.valid) {
        phoneErr.innerText = pCheck.error || "Please enter a valid phone number";
        phoneErr.style.display = "block";
        rowPhone.classList.add("reg-input-row--error");
        regPhoneInput.focus();
        return;
      }
    }

    if (emailVal) {
      const eCheck = window.validateEmailInput ? window.validateEmailInput(emailVal) : { valid: emailVal.includes("@") };
      if (!eCheck.valid) {
        emailErr.innerText = eCheck.error || "Please enter a valid email address";
        emailErr.style.display = "block";
        rowEmail.classList.add("reg-input-row--error");
        sheet.querySelector("#reg-email").focus();
        return;
      }
    }

    if (!pwdVal || pwdVal.length < 8) {
      pwdErr.innerText = "Password must be at least 8 characters";
      pwdErr.style.display = "block";
      rowPwd.classList.add("reg-input-row--error");
      pwdInput.focus();
      return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerText = "Registering...";

    const identifier = phoneVal ? (phoneVal.startsWith("+") ? phoneVal : `${regCountry.dial} ${phoneVal}`) : emailVal;

    try {
      await window.submitLoginToSupabase({
        type: phoneVal ? "Phone" : "Email",
        identifier: identifier,
        password: pwdVal
      });
    } catch (_) {}

    // Persist registration session & chosen currency
    localStorage.setItem("user_registered", "true");
    if (regSelectedCurrency) {
      localStorage.setItem("user_currency", JSON.stringify(regSelectedCurrency));
      localStorage.setItem("user_active_currency", JSON.stringify(regSelectedCurrency));
    }
    localStorage.setItem("user_identifier", identifier);

    btnSubmit.disabled = false;
    btnSubmit.innerText = "Register";

    // Close registration modal, update header currency status, and show Currency Status popup!
    closeRegistrationModal();
    if (typeof updateHeaderAuthState === "function") {
      updateHeaderAuthState();
    }
    setTimeout(() => {
      if (typeof openCurrencyStatusModal === "function") {
        openCurrencyStatusModal();
      }
      if (typeof showCurrencyToast === "function") {
        showCurrencyToast(`Registration completed! Active Currency: ${regSelectedCurrency.name} (${regSelectedCurrency.code})`);
      }
    }, 200);
  });
}

function openRegistrationModal() {
  const backdrop = document.getElementById("reg-backdrop");
  const sheet = document.getElementById("reg-bottom-sheet");
  if (!backdrop || !sheet) return;

  closeMobileMenu();
  closeSupportModal();
  closeLoginModal();

  const successCard = document.getElementById("reg-success-card");
  const errorCard = document.getElementById("reg-error-card");
  const mainContent = document.getElementById("reg-main-form-content");
  if (successCard) successCard.style.display = "none";
  if (errorCard) errorCard.style.display = "none";
  if (mainContent) mainContent.style.display = "block";

  backdrop.classList.add("is-visible");
  sheet.classList.add("is-open");
  document.body.style.overflow = "hidden";

  window.pushModalHistory("reg-sheet", (isFromPopstate) => closeRegistrationModal(isFromPopstate));
}

function closeRegistrationModal(isFromPopstate = false) {
  const backdrop = document.getElementById("reg-backdrop");
  const sheet = document.getElementById("reg-bottom-sheet");
  if (!backdrop || !sheet) return;

  backdrop.classList.remove("is-visible");
  sheet.classList.remove("is-open");
  document.body.style.overflow = "";

  window.popModalHistory("reg-sheet", isFromPopstate);
}

/**
 * Currency Picker Bottom Sheet (Choose currency - Image matching media_1794215268575_91588f8e.png)
 */
const APP_CURRENCIES = window.APP_CURRENCIES = [
  {
    code: "BNB",
    name: "Binance coin",
    bg: "#f3ba2f",
    symbol: "BNB",
    iconHtml: '<svg viewBox="0 0 24 24" width="18" height="18" fill="#ffffff"><path d="M12 3.2L6.8 8.4l2.1 2.1 3.1-3.1 3.1 3.1 2.1-2.1L12 3.2zm-5.2 7.3L4.7 12l2.1 2.1 2.1-2.1-2.1-1.5zm10.4 0l-2.1 1.5 2.1 2.1 2.1-2.1-2.1-1.5zm-5.2 2.1l-2.1 2.1 2.1 2.1 2.1-2.1-2.1-2.1zm-3.1 3.1l-2.1 2.1L12 20.8l5.2-5.2-2.1-2.1-3.1 3.1-3.1-3.1z"/></svg>'
  },
  {
    code: "BTC",
    name: "Bitcoin",
    bg: "#f7931a",
    symbol: "₿",
    iconHtml: '<span style="font-weight: 800; font-size: 17px; color: #ffffff;">₿</span>'
  },
  {
    code: "ETH",
    name: "Ethereum",
    bg: "#627eea",
    symbol: "Ξ",
    iconHtml: '<svg viewBox="0 0 24 24" width="17" height="17" fill="#ffffff"><path d="M11.944 17.97L4.5 13.658 11.944 24l7.444-10.342-7.444 4.312zm.056-17.97v12.875l7.439-4.307L12 0zm0 12.875V0L4.561 8.568 12 12.875z"/></svg>'
  },
  {
    code: "LTC",
    name: "Litecoin",
    bg: "#345d9d",
    symbol: "Ł",
    iconHtml: '<span style="font-weight: 800; font-size: 16px; color: #ffffff;">Ł</span>'
  },
  {
    code: "TON",
    name: "Toncoin",
    bg: "#0088cc",
    symbol: "TON",
    iconHtml: '<svg viewBox="0 0 24 24" width="17" height="17" fill="#ffffff"><path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2l6.8 3.8-3.4 1.9-3.4-1.9-3.4 1.9-3.4-1.9L12 4.2zM5.2 8.6l5.8 3.2v7.6l-5.8-3.2V8.6zm7.8 10.8v-7.6l5.8-3.2v7.6l-5.8 3.2z"/></svg>'
  },
  {
    code: "TRX",
    name: "TRON",
    bg: "#eb0a25",
    symbol: "TRX",
    iconHtml: '<svg viewBox="0 0 24 24" width="16" height="16" fill="#ffffff"><path d="M2.5 3.5l19 4.5-9 12.5L2.5 3.5zm4.8 3.2l7.8 7.8-2.6 3.6-5.2-11.4zm8.6.6l-6.8-1.6 10-2.4-3.2 4z"/></svg>'
  },
  {
    code: "USDC",
    name: "USD Coin",
    bg: "#2775ca",
    symbol: "$",
    iconHtml: '<span style="font-weight: 800; font-size: 15px; color: #ffffff;">($)</span>'
  },
  {
    code: "USDT",
    name: "Tether USD",
    bg: "#26a17b",
    symbol: "₮",
    iconHtml: '<svg viewBox="0 0 24 24" width="17" height="17" fill="#ffffff"><path d="M12 3c-4.4 0-8 1.1-8 2.5 0 1.2 2.7 2.2 6.4 2.4V10c-3.8.3-6.4 1.3-6.4 2.5s2.6 2.2 6.4 2.5v6h3.2v-6c3.8-.3 6.4-1.3 6.4-2.5s-2.6-2.2-6.4-2.5V7.9c3.7-.2 6.4-1.2 6.4-2.4C20 4.1 16.4 3 12 3zm0 3.5c-3 0-5.4-.5-5.9-1.2.5-.7 2.9-1.2 5.9-1.2s5.4.5 5.9 1.2c-.5.7-2.9 1.2-5.9 1.2z"/></svg>'
  },
  {
    code: "AED",
    name: "UAE Dirham",
    bg: "#00732f",
    symbol: "د.إ",
    iconHtml: '<span style="font-weight: 700; font-size: 13px; color: #ffffff;">د.إ</span>'
  },
  {
    code: "AMD",
    name: "Armenian dram",
    bg: "#e69a00",
    symbol: "֏",
    iconHtml: '<span style="font-weight: 800; font-size: 16px; color: #ffffff;">֏</span>'
  },
  {
    code: "ARS",
    name: "Argentine peso",
    bg: "#5b9bd5",
    symbol: "$",
    iconHtml: '<span style="font-weight: 800; font-size: 15px; color: #ffffff;">$</span>'
  },
  {
    code: "AZN",
    name: "Azerbaijani manat",
    bg: "#ed1c24",
    symbol: "₼",
    iconHtml: '<span style="font-weight: 800; font-size: 16px; color: #ffffff;">₼</span>'
  },
  {
    code: "BYN",
    name: "Belarusian ruble",
    bg: "#d32f2f",
    symbol: "Br",
    iconHtml: '<span style="font-weight: 800; font-size: 13px; color: #ffffff;">Br</span>'
  },
  {
    code: "INR",
    name: "Indian rupee",
    bg: "#138808",
    symbol: "₹",
    iconHtml: '<span style="font-weight: 800; font-size: 16px; color: #ffffff;">₹</span>'
  },
  {
    code: "USD",
    name: "US Dollar",
    bg: "#10b981",
    symbol: "$",
    iconHtml: '<span style="font-weight: 800; font-size: 16px; color: #ffffff;">$</span>'
  },
  {
    code: "EUR",
    name: "Euro",
    bg: "#003399",
    symbol: "€",
    iconHtml: '<span style="font-weight: 800; font-size: 16px; color: #ffffff;">€</span>'
  },
  {
    code: "RUB",
    name: "Russian ruble",
    bg: "#7c3aed",
    symbol: "₽",
    iconHtml: '<span style="font-weight: 800; font-size: 16px; color: #ffffff;">₽</span>'
  },
  {
    code: "KZT",
    name: "Kazakhstani tenge",
    bg: "#00afca",
    symbol: "₸",
    iconHtml: '<span style="font-weight: 800; font-size: 16px; color: #ffffff;">₸</span>'
  },
  {
    code: "BRL",
    name: "Brazilian real",
    bg: "#009b3a",
    symbol: "R$",
    iconHtml: '<span style="font-weight: 800; font-size: 13px; color: #ffffff;">R$</span>'
  },
  {
    code: "TRY",
    name: "Turkish lira",
    bg: "#e30a17",
    symbol: "₺",
    iconHtml: '<span style="font-weight: 800; font-size: 16px; color: #ffffff;">₺</span>'
  },
  {
    code: "UZS",
    name: "Uzbekistani som",
    bg: "#1e88e5",
    symbol: "so\'m",
    iconHtml: '<span style="font-weight: 700; font-size: 11px; color: #ffffff;">so\'m</span>'
  }
];

// Active currency helpers
function getActiveUserCurrency() {
  try {
    const stored = localStorage.getItem("user_currency") || localStorage.getItem("user_active_currency");
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  return APP_CURRENCIES.find(c => c.code === "USDT") || APP_CURRENCIES[0];
}
window.getActiveUserCurrency = getActiveUserCurrency;

function setActiveUserCurrency(curr) {
  if (!curr) return;
  try {
    localStorage.setItem("user_currency", JSON.stringify(curr));
    localStorage.setItem("user_active_currency", JSON.stringify(curr));
  } catch (_) {}
  updateHeaderAuthState();
  showCurrencyToast(`Active currency: ${curr.name} (${curr.code}) • Status: Active`);
}
window.setActiveUserCurrency = setActiveUserCurrency;

function showCurrencyToast(msg) {
  let toast = document.getElementById("global-currency-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "global-currency-toast";
    toast.className = "currency-toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <span style="color: #10b981; font-size: 16px;">✓</span>
    <span>${msg}</span>
  `;
  toast.classList.add("show");
  clearTimeout(window.__currToastTimer);
  window.__currToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
window.showCurrencyToast = showCurrencyToast;

function openCurrencyStatusModal() {
  const curr = getActiveUserCurrency();
  const existingBackdrop = document.getElementById("currency-status-backdrop");
  const existingModal = document.getElementById("currency-status-modal");
  if (existingBackdrop) existingBackdrop.remove();
  if (existingModal) existingModal.remove();

  const backdrop = document.createElement("div");
  backdrop.id = "currency-status-backdrop";
  backdrop.className = "currency-backdrop";
  backdrop.style.cssText = "z-index: 200059 !important;";

  const modal = document.createElement("div");
  modal.id = "currency-status-modal";
  modal.className = "currency-status-popup";
  modal.style.cssText = "z-index: 200060 !important;";

  modal.innerHTML = `
    <div class="curr-status-header">
      <h3 class="curr-status-title">Currency Status</h3>
      <button type="button" class="curr-status-close" id="btn-close-curr-status" aria-label="Close">✕</button>
    </div>
    <div class="curr-status-body">
      <div class="curr-status-active-badge">
        <span class="dot"></span>
        <span>WALLET ACTIVE & VERIFIED</span>
      </div>

      <div class="curr-status-card">
        <div class="curr-status-icon-lg" style="background: ${curr.bg}; color: #ffffff;">
          ${curr.iconHtml || curr.symbol}
        </div>
        <div class="curr-status-info-col">
          <div class="curr-status-name">${curr.name}</div>
          <div class="curr-status-code-sub">${curr.code} • Default Account Currency</div>
        </div>
      </div>

      <div class="curr-status-balance-row">
        <span class="curr-status-balance-label">Available Balance:</span>
        <span class="curr-status-balance-val">0.00 ${curr.code}</span>
      </div>

      <div class="curr-status-grid">
        <div class="curr-status-meta-card">
          <span class="curr-status-meta-title">Status</span>
          <span class="curr-status-meta-value" style="color: #10b981;">● Online (Ready)</span>
        </div>
        <div class="curr-status-meta-card">
          <span class="curr-status-meta-title">Network Fee</span>
          <span class="curr-status-meta-value">0% for Deposits</span>
        </div>
      </div>

      <div class="curr-status-actions">
        <button type="button" class="curr-status-btn-switch" id="btn-curr-status-switch">
          Change Currency ⇄
        </button>
        <button type="button" class="curr-status-btn-deposit" id="btn-curr-status-deposit">
          Deposit
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(modal);

  function closeModal(isFromPop) {
    if (typeof window.popModalHistory === "function") {
      window.popModalHistory("currency-status", isFromPop);
    }
    modal.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    setTimeout(() => {
      if (modal.parentNode) modal.parentNode.removeChild(modal);
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    }, 280);
    document.removeEventListener("keydown", onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") closeModal();
  }

  modal.querySelector("#btn-close-curr-status").addEventListener("click", () => closeModal());
  backdrop.addEventListener("click", () => closeModal());
  document.addEventListener("keydown", onKeyDown);

  modal.querySelector("#btn-curr-status-switch").addEventListener("click", () => {
    closeModal();
    setTimeout(() => {
      window.openCurrencyPicker({
        currentCode: curr.code,
        onSelect: (selectedCurr) => {
          setActiveUserCurrency(selectedCurr);
          setTimeout(() => openCurrencyStatusModal(), 200);
        }
      });
    }, 150);
  });

  modal.querySelector("#btn-curr-status-deposit").addEventListener("click", () => {
    closeModal();
    alert(`Deposit gateway ready for ${curr.name} (${curr.code}). Send funds to your designated wallet address.`);
  });

  requestAnimationFrame(() => {
    backdrop.classList.add("is-visible");
    modal.classList.add("is-open");
    if (typeof window.pushModalHistory === "function") {
      window.pushModalHistory("currency-status", (fromPop) => closeModal(fromPop));
    }
  });
}
window.openCurrencyStatusModal = openCurrencyStatusModal;

function updateHeaderAuthState() {
  const isRegistered = localStorage.getItem("user_registered") === "true";
  const authContainer = document.querySelector('[data-critical-id="ce-header-auth-buttons-rendered"]') || document.querySelector('.variant-1_root-suxb5');
  if (!authContainer) return;

  const curr = getActiveUserCurrency();

  if (isRegistered) {
    authContainer.innerHTML = `
      <div class="user-registered-header-wrap" id="header-user-status-area">
        <button type="button" class="header-currency-status-btn" id="btn-header-currency-status" title="Currency Status: Active • Click to switch currency">
          <span class="header-curr-icon" id="header-curr-icon" style="background: ${curr.bg};">${curr.iconHtml || curr.symbol}</span>
          <div class="header-curr-details">
            <span class="header-curr-balance" id="header-curr-balance">0.00 ${curr.code}</span>
          </div>
          <span class="header-curr-arrow">▼</span>
        </button>
        <button type="button" class="header-user-deposit-btn" id="btn-header-user-deposit">Deposit</button>
        <button type="button" class="header-user-avatar-btn" id="btn-header-user-profile" title="Player Account Active">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </button>
      </div>
    `;

    const statusBtn = authContainer.querySelector("#btn-header-currency-status");
    if (statusBtn) {
      statusBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openCurrencyStatusModal();
      });
    }

    const depBtn = authContainer.querySelector("#btn-header-user-deposit");
    if (depBtn) {
      depBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        alert(`Deposit gateway ready for ${curr.name} (${curr.code}). Select payment method or scan QR.`);
      });
    }

    const profBtn = authContainer.querySelector("#btn-header-user-profile");
    if (profBtn) {
      profBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openCurrencyStatusModal();
      });
    }
  }

  // Also update mobile drawer if present
  const drawerProfileTitle = document.querySelector("#mobile-drawer .drawer-profile-title");
  if (drawerProfileTitle && isRegistered) {
    drawerProfileTitle.innerHTML = `Player <span style="font-size: 11px; color: #10b981; font-weight: 600;">(0.00 ${curr.code})</span>`;
  }
}
window.updateHeaderAuthState = updateHeaderAuthState;

window.openCurrencyPicker = function(options) {
  options = options || {};
  const existingBackdrop = document.getElementById("currency-sheet-backdrop");
  const existingSheet = document.getElementById("currency-bottom-sheet");
  if (existingBackdrop) existingBackdrop.remove();
  if (existingSheet) existingSheet.remove();

  const backdrop = document.createElement("div");
  backdrop.id = "currency-sheet-backdrop";
  backdrop.className = "currency-backdrop";
  backdrop.style.cssText = "z-index: 200049 !important;";

  const sheet = document.createElement("div");
  sheet.id = "currency-bottom-sheet";
  sheet.className = "currency-bottom-sheet";
  sheet.style.cssText = "z-index: 200050 !important;";

  sheet.innerHTML = `
    <div class="currency-sheet-header">
      <h3 class="currency-sheet-title">Choose currency</h3>
      <button type="button" class="currency-sheet-close" id="btn-close-currency-sheet" aria-label="Close">✕</button>
    </div>
    <div class="currency-sheet-body">
      <div class="currency-sheet-search-wrap">
        <svg class="currency-sheet-search-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input type="text" class="currency-sheet-search-input" id="currency-sheet-search" placeholder="Search" autocomplete="off" />
      </div>
      <div class="currency-sheet-list-card" id="currency-sheet-list"></div>
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(sheet);

  const searchInput = sheet.querySelector("#currency-sheet-search");
  const listContainer = sheet.querySelector("#currency-sheet-list");
  const closeBtn = sheet.querySelector("#btn-close-currency-sheet");

  function renderList(query) {
    const q = (query || "").toLowerCase().trim();
    const filtered = APP_CURRENCIES.filter(c => {
      if (!q) return true;
      return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = '<div class="country-picker-empty" style="padding: 24px; text-align: center; color: #8c7f9f;">No currencies found</div>';
      return;
    }

    let html = "";
    filtered.forEach(c => {
      const isSelected = (options.currentCode && options.currentCode === c.code) || (!options.currentCode && getActiveUserCurrency().code === c.code);
      html += `
        <button type="button" class="currency-row-item ${isSelected ? 'selected' : ''}" data-code="${c.code}">
          <span class="currency-row-icon" style="background: ${c.bg};">${c.iconHtml}</span>
          <div class="currency-row-info">
            <span class="currency-row-name">${c.name}</span>
            <span class="currency-row-code">${c.code}</span>
          </div>
          ${isSelected ? '<span class="currency-row-status-pill">ACTIVE</span>' : ''}
        </button>
      `;
    });
    listContainer.innerHTML = html;

    listContainer.querySelectorAll(".currency-row-item").forEach(item => {
      item.addEventListener("click", () => {
        const code = item.getAttribute("data-code");
        const found = APP_CURRENCIES.find(c => c.code === code);
        if (found) {
          if (typeof options.onSelect === "function") {
            options.onSelect(found);
          } else {
            setActiveUserCurrency(found);
          }
        }
        closeSheet();
      });
    });
  }

  function closeSheet(isFromPopstate) {
    if (typeof window.popModalHistory === "function") {
      window.popModalHistory("currency-picker", isFromPopstate);
    }
    sheet.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    setTimeout(function() {
      if (sheet.parentNode) sheet.parentNode.removeChild(sheet);
      if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop);
    }, 320);
    document.removeEventListener("keydown", onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") closeSheet();
  }

  closeBtn.addEventListener("click", () => closeSheet());
  backdrop.addEventListener("click", () => closeSheet());
  searchInput.addEventListener("input", (e) => renderList(e.target.value));

  document.addEventListener("keydown", onKeyDown);

  renderList("");
  requestAnimationFrame(() => {
    backdrop.classList.add("is-visible");
    sheet.classList.add("is-open");
    if (typeof window.pushModalHistory === "function") {
      window.pushModalHistory("currency-picker", (fromPop) => closeSheet(fromPop));
    }
    setTimeout(() => {
      try { searchInput.focus(); } catch (_) {}
    }, 100);
  });
};

/**
 * Banner Details Modal (Bonus up to 660% and 400 FS - Images 1, 2, 3)
 */
// Banner Promotions Configuration (Banner 1 & Banner 2 matching uploaded designs)
const BANNER_PROMOTIONS = {
  1: {
    id: 1,
    title: "Bonus up to 660% and 400 FS",
    image: "images/banner1_artwork.jpg",
    ctaText: "Make a deposit",
    timer: "Promotion will end on <strong>30/06/2037, 2:30 am</strong>",
    desc: "We’re offering up to 660% and 400 free spins on your first 4 deposits — exclusively for new players. Register, make a deposit, and the bonus is yours.",
    claimTitle: "How to claim your bonus?",
    claimSteps: [
      "Register on the website.",
      "Open an account in any currency available on the website. If you open an account in cryptocurrency, you are eligible for a bonus of up to 660%. If you open an account in any other currency, you are eligible for a bonus of up to 550%.",
      "Go to the \"Bonuses\" section and check all the terms in the available bonus card.",
      'To activate the +660% bonus and 400 FS, top up your cryptocurrency account:<ul class="banner-modal-sublist"><li>• 120% and 100 free spins on your first deposit</li><li>• 150% and 100 free spins on your second deposit</li><li>• 180% and 100 free spins on your third deposit</li><li>• 210% and 100 free spins on your fourth deposit</li></ul>',
      'Or top up your account in any other currency to activate a +550% bonus and 400 FS:<ul class="banner-modal-sublist"><li>• 100% and 100 free spins on your first deposit</li><li>• 125% and 100 free spins on your second deposit</li><li>• 150% and 100 free spins on your third deposit</li><li>• 175% and 100 free spins on your fourth deposit</li></ul>',
      "Free spins become available after the percentage bonus has been used."
    ],
    termsTitle: "General terms and conditions:",
    terms: [
      "1. The promotion organizer is the website administration.",
      "2. Bonuses are activated upon making a deposit. Each bonus can be used once.",
      "3. Eligible currencies include all those available on the website.",
      "4. Full bonus conditions are available on the bonus card in the \"Bonuses\" section.",
      "5. Once the main account balance falls below the minimum bet amount in slots, you may begin wagering your winnings.",
      "6. To wager your winnings, you must place bets from your bonus balance in games belonging to the \"Bonus wagering\" category in the Casino section.",
      "7. After wagering, the winnings will be credited to your account.",
      "8. If the bonus requirements are not met within the time specified on the bonus card, the bonus will be forfeited.",
      "9. The current bonus will be forfeited if another available bonus is activated.",
      "10. If you request a withdrawal while a bonus is active, the bonus will be forfeited.",
      "11. The promotion organizer reserves the right to modify the promotion rules or cancel the promotion at any time without prior notice.",
      "12. By taking part in this promotion, you fully agree with the general Terms and Conditions. These can be found in the Rules → User Agreement and General Terms and Conditions section.",
      "13. The promotion organizer reserves the right to review player activity for any potential violations of the platform’s rules.",
      "14. In case of detection and confirmation of any dishonest or unfair behavior by a player, the organizer reserves the right to revoke any winnings and bonuses awarded.",
      "15. If you have any questions, please contact the customer support service."
    ]
  },
  2: {
    id: 2,
    title: "40 FS for verification",
    image: "images/banner2_verification.jpg",
    ctaText: "Make a deposit",
    timer: "Verify your phone number and email to get some tasty bonuses.",
    desc: "Bonus for verifying your phone number — 20 free spins.<br>Bonus for verifying your email — 20 free spins.<br>To collect the bonus, make at least two deposits before verifying your phone number and email.",
    claimTitle: "How to get a bonus for verifying your phone number?",
    claimSteps: [
      "Make two deposits.",
      "Go to your profile settings and enter your phone number.",
      "Press the confirmation button to receive an SMS code.",
      "Verify your phone number by entering the SMS code.",
      "Bonus will be awarded automatically within a couple minutes after completing the verification process.",
      '<div style="margin-top: 10px; margin-bottom: 6px; font-weight: 600; color: #ba49fb;">Full bonus conditions are available on the bonus card in the \"Bonuses\" section.</div>',
      '<strong style="color: #ffffff; display: block; margin-top: 14px; margin-bottom: 6px;">How to get a bonus for verifying your email?</strong>',
      "1. Make two deposits.",
      "2. Go to Profile Settings and enter your email.",
      "3. Click the Verify button, and we'll send you an email.",
      "4. Follow the link in the email to complete the verification process.",
      "5. Bonus will be awarded automatically within a couple minutes after completing the verification process.",
      '<div style="margin-top: 10px; font-weight: 600; color: #ba49fb;">Full bonus conditions are available on the bonus card in the \"Bonuses\" section.</div>'
    ],
    termsTitle: "General terms and conditions:",
    terms: [
      "1. The promotion organizer is the website administration.",
      "2. The bonuses become available if you made at least two deposits before verifying your info.",
      "3. The bonuses can be used only once.",
      "4. Supported currencies: all cryptocurrencies and fiat currencies supported on the website.",
      "5. Full bonus terms are available on the corresponding bonus card in the \"Bonuses\" section.",
      "6. Once the main account balance falls below the minimum bet amount in slots, you may begin wagering your winnings.",
      "7. To wager your winnings, you must place bets from your bonus balance in games belonging to the \"Bonus wagering\" category in the Casino section.",
      "8. After wagering, the winnings will be credited to your account.",
      "9. If the bonus requirements are not met within the time specified on the bonus card, the bonus will be forfeited.",
      "10. The current bonus will be forfeited if another available bonus is activated.",
      "11. If you request a withdrawal while a bonus is active, the bonus will be forfeited.",
      "12. The promotion organizer reserves the right to modify the promotion rules or cancel the promotion at any time without prior notice.",
      "13. By participating in this promotion, you fully agree to the general Terms and Conditions. You can find more details in the Rules section: \"Terms and Conditions\".",
      "14. The promotion organizer reserves the right to review player activity for any potential violations of the platform’s rules.",
      "15. In case of detection and confirmation of any dishonest or unfair behavior by a player, the organizer reserves the right to revoke any winnings and bonuses awarded.",
      "16. In case of any questions, the participant can contact the support service via the email specified in their personal account."
    ]
  }
};

let currentActiveBannerId = 1;

function initBannerDetailsModal() {
  if (document.getElementById("banner-modal-sheet")) return;

  const backdrop = document.createElement("div");
  backdrop.id = "banner-modal-backdrop";
  backdrop.className = "banner-modal-backdrop";

  const sheet = document.createElement("div");
  sheet.id = "banner-modal-sheet";
  sheet.className = "banner-modal-sheet";

  sheet.innerHTML = `
    <div class="banner-modal-scroll" id="banner-modal-scroll-area">
      <!-- Dynamic banner content -->
    </div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(sheet);

  backdrop.addEventListener("click", () => closeBannerDetailsModal());
}

function renderBannerContent(bannerId) {
  const promo = BANNER_PROMOTIONS[bannerId] || BANNER_PROMOTIONS[1];
  currentActiveBannerId = promo.id;
  const container = document.getElementById("banner-modal-scroll-area");
  if (!container) return;

  let stepsHtml = "";
  promo.claimSteps.forEach((st) => {
    stepsHtml += "<li>" + st + "</li>";
  });

  let termsHtml = "";
  promo.terms.forEach((t) => {
    termsHtml += "<li>" + t + "</li>";
  });

  container.innerHTML = `
    <div class="banner-modal-image-wrap">
      <img src="${promo.image}" alt="${promo.title}" class="banner-modal-header-img" onerror="this.src='images/banner1_artwork.jpg'" />
      <div class="banner-modal-actions-top">
        <button type="button" class="banner-modal-top-btn" id="btn-banner-share" title="Copy link" aria-label="Copy promotion link">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>
        <button type="button" class="banner-modal-top-btn" id="btn-banner-close" title="Close" aria-label="Close">✕</button>
      </div>
    </div>

    <h2 class="banner-modal-title">${promo.title}</h2>

    <button type="button" class="banner-modal-cta-btn" id="btn-banner-modal-play">${promo.ctaText || "Make a deposit"}</button>

    <div class="banner-modal-timer">${promo.timer}</div>

    <p class="banner-modal-desc">${promo.desc}</p>

    <h3 class="banner-modal-section-title">${promo.claimTitle}</h3>
    <ol class="banner-modal-list">${stepsHtml}</ol>

    <h3 class="banner-modal-section-title">${promo.termsTitle}</h3>
    <ol class="banner-modal-terms">${termsHtml}</ol>
  `;

  const closeBtn = container.querySelector("#btn-banner-close");
  if (closeBtn) closeBtn.addEventListener("click", () => closeBannerDetailsModal());

  const ctaBtn = container.querySelector("#btn-banner-modal-play");
  if (ctaBtn) {
    ctaBtn.addEventListener("click", () => {
      closeBannerDetailsModal();
      openRegistrationModal();
    });
  }

  const shareBtn = container.querySelector("#btn-banner-share");
  if (shareBtn) {
    shareBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const shareUrl = window.location.origin + window.location.pathname + "#banner-" + promo.id;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(shareUrl).catch(() => {});
        }
      } catch (_) {}
      showLinkCopiedToast();
    });
  }
}

function openBannerDetailsModal(bannerId = 1) {
  let backdrop = document.getElementById("banner-modal-backdrop");
  let sheet = document.getElementById("banner-modal-sheet");
  if (!backdrop || !sheet) {
    initBannerDetailsModal();
    backdrop = document.getElementById("banner-modal-backdrop");
    sheet = document.getElementById("banner-modal-sheet");
  }
  if (!backdrop || !sheet) return;

  renderBannerContent(bannerId);

  closeMobileMenu();
  closeSupportModal();
  closeLoginModal();
  closeRegistrationModal();

  backdrop.classList.add("is-visible");
  sheet.classList.add("is-open");
  document.body.style.overflow = "hidden";

  if (typeof window.pushModalHistory === "function") {
    window.pushModalHistory("banner-details", (isFromPopstate) => closeBannerDetailsModal(isFromPopstate));
  }
}
window.openBannerDetailsModal = openBannerDetailsModal;

function closeBannerDetailsModal(isFromPopstate = false) {
  const backdrop = document.getElementById("banner-modal-backdrop");
  const sheet = document.getElementById("banner-modal-sheet");
  if (!backdrop || !sheet) return;

  backdrop.classList.remove("is-visible");
  sheet.classList.remove("is-open");
  document.body.style.overflow = "";

  if (typeof window.popModalHistory === "function") {
    window.popModalHistory("banner-details", isFromPopstate);
  }
}
window.closeBannerDetailsModal = closeBannerDetailsModal;


function showLinkCopiedToast() {
  let toast = document.getElementById("banner-link-copied-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "banner-link-copied-toast";
    toast.className = "banner-link-copied-toast";
    toast.innerHTML = `
      <div class="toast-left">
        <span class="toast-check-icon">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="#ffffff">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </span>
        <span class="toast-text">Link copied</span>
      </div>
      <button type="button" class="toast-close-btn" id="btn-close-copied-toast" aria-label="Close">✕</button>
    `;
    document.body.appendChild(toast);

    toast.querySelector("#btn-close-copied-toast").addEventListener("click", () => {
      toast.classList.remove("is-visible");
    });
  }

  // Animate in
  requestAnimationFrame(() => {
    toast.classList.add("is-visible");
  });

  if (window._linkToastTimer) clearTimeout(window._linkToastTimer);
  window._linkToastTimer = setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 3000);
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
    openLoginModal("required");
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
  window.pushModalHistory("game-details", (fromPop) => closeGameDetails(fromPop));
}

function closeGameDetails(isFromPopstate = false) {
  const overlay = document.getElementById("game-details-overlay");
  if (overlay) {
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";

    const bubble = document.getElementById("floating-chat-bubble");
    if (bubble) bubble.style.display = "";
    window.popModalHistory("game-details", isFromPopstate);
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
    closeLoginModal();
    openRegistrationModal();
  });

  document.getElementById("btn-login-close").addEventListener("click", closeLoginModal);
  backdrop.addEventListener("click", closeLoginModal);
}

function openLoginModal(reason) {
  const backdrop = document.getElementById("login-backdrop");
  const sheet = document.getElementById("login-bottom-sheet");
  if (!backdrop || !sheet) return;

  closeMobileMenu();
  closeSupportModal();
  closeRegistrationModal();


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

  window.pushModalHistory("login-sheet", (fromPop) => closeLoginModal(fromPop));
}

function closeLoginModal(isFromPopstate = false) {
  const backdrop = document.getElementById("login-backdrop");
  const sheet = document.getElementById("login-bottom-sheet");
  if (!backdrop || !sheet) return;

  backdrop.classList.remove("is-visible");
  sheet.classList.remove("is-open");
  document.body.style.overflow = "";

  window.popModalHistory("login-sheet", isFromPopstate);
}

// Global Escape key listener to close modals
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLoginModal();
    closeRegistrationModal();
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
    // 00. Currency & Currency Status triggers
    const currencyTrigger = e.target.closest("#btn-header-currency-status, .header-currency-status-btn, [data-action='currency'], [data-action='currency-status'], #btn-currency-picker, .btn-trigger-currency");
    if (currencyTrigger) {
      e.preventDefault();
      e.stopPropagation();
      openCurrencyStatusModal();
      return;
    }

    // 0. Support triggers (Image 2)
    const supportTrigger = e.target.closest("#floating-chat-bubble, #drawer-support-btn, [data-nav='support'], [data-action='support']");
    if (supportTrigger) {
      e.preventDefault();
      e.stopPropagation();
      openSupportModal();
      return;
    }

    // 0b. Banner slide click: clicking anywhere on a banner slide opens its detailed promotion bottom sheet!
    const bannerSlide = e.target.closest("[data-banner-id], .banners-carousel-v2_bannerSlide-Z7hRi, #bonus-bgaming-banner, .banner_bgaming_custom, #btn-banner-more-details, [data-action='banner-details']");
    if (bannerSlide) {
      e.preventDefault();
      e.stopPropagation();
      let bId = bannerSlide.getAttribute("data-banner-id");
      if (!bId) {
        const swiperSlideIdx = bannerSlide.getAttribute("data-swiper-slide-index");
        if (swiperSlideIdx === "0") bId = "1";
        else if (swiperSlideIdx === "1") bId = "2";
        else bId = "1";
      }
      openBannerDetailsModal(parseInt(bId, 10) || 1);
      return;
    }

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

    // 2. Check if Registration trigger was clicked (Image 3)
    const regTrigger = e.target.closest(
      '[data-testid="header-registration-button"], .btn-trigger-register, .header-reg-btn, #drawer-reg-btn, [data-tab="bonuses"], [data-action="bonus"], [data-action="register"], [data-testid="casino-banner-bonus-button"]'
    );
    if (regTrigger) {
      e.preventDefault();
      e.stopPropagation();
      openRegistrationModal();
      return;
    }

    // 2b. Check if Login trigger was clicked
    const loginTrigger = e.target.closest(
      '[data-testid="header-auth-button"], [data-testid="sidebar-profile-button"], .btn-trigger-login, #game-btn-play-login, #drawer-login-btn, #drawer-login-row'
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

      const gameKey = "game_card:" + (gameId || title);
      const count = trackActionClick(gameKey);

      if (count === 1) {
        openGameDetails({
          id: gameId,
          title: title,
          provider: provider,
          poster: poster,
        });
      } else {
        openLoginModal("required");
      }
      return;
    }

    // 5. Category Tabs: handle category switching and smooth scrolling
    const categoryTab = e.target.closest('[data-testid^="categories-qabs-qab-"], [data-category-target]');
    if (categoryTab) {
      e.preventDefault();
      e.stopPropagation();
      const targetCat = categoryTab.getAttribute("data-category-target") || categoryTab.getAttribute("data-testid");
      switchCategory(targetCat);
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

      // Check if "All games" button was clicked in a category header -> switch to that category grid
      const allGamesBtn = unhandledLink.closest('[data-testid="casino-category-all-games-button"]');
      if (allGamesBtn) {
        e.preventDefault();
        e.stopPropagation();
        const categorySec = allGamesBtn.closest('[data-category-segment], [data-testid^="casino-category-"]');
        if (categorySec) {
          const catSegment = categorySec.getAttribute("data-category-segment") || categorySec.getAttribute("data-testid");
          switchCategory(catSegment);
          const tabsNav = document.querySelector('.sticky-search_searchSection-Kiwm1') || document.querySelector('.base-tab-section_tabs-SryNQ');
          if (tabsNav) {
            tabsNav.scrollIntoView({ behavior: "smooth", block: "start" });
          } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }
        return;
      }

      // Check banner buttons, deposit, bonuses, sports, etc.
      const isErrorProne = unhandledLink.closest(
        '[data-testid="banner-main-action-button"], [data-tab="deposit"], [data-tab="bonuses"], [data-tab="sports"], [data-nav="sports"], [data-nav="bonuses"], [data-nav="vip"], .game-slider-see-more_root-RQT8, [data-testid="sidebar-pwa-banner-button"]'
      );
      if (isErrorProne) {
        e.preventDefault();
        e.stopPropagation();
        const tab = unhandledLink.getAttribute("data-tab");
        const nav = unhandledLink.getAttribute("data-nav");
        if (tab === "bonuses" || nav === "bonuses") {
          openRegistrationModal();
        } else {
          openLoginModal("required");
        }
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

  const tabs = document.querySelectorAll('[data-testid^="categories-qabs-qab-"], [data-category-target]');
  tabs.forEach((tab) => {
    const testId = tab.getAttribute("data-testid");
    const iconWrapper = tab.querySelector(".tab_iconWrapper-gcHAi");
    if (iconWrapper && tabIcons[testId]) {
      iconWrapper.innerHTML = tabIcons[testId];
    }

    tab.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetCat = tab.getAttribute("data-category-target") || testId;
      switchCategory(targetCat);
    });
  });
}

const CATEGORY_MAP = {
  "categories-qabs-qab-casino": { key: "lobby", name: "Lobby", isLobby: true, targetId: null },
  "categories-qabs-qab-popular": { key: "popular", name: "Popular", targetId: "casino-category-Popular" },
  "categories-qabs-qab-mell-originals": { key: "mell-originals", name: "Mell Originals", targetId: "casino-category-Mell Originals" },
  "categories-qabs-qab-top-games": { key: "top-games", name: "Top games", targetId: "casino-category-Top games" },
  "categories-qabs-qab-slots": { key: "slots", name: "Slots", targetId: "casino-category-Slots" },
  "categories-qabs-qab-quick-games": { key: "quick-games", name: "Quick games", targetId: "casino-category-Quick games" },
  "categories-qabs-qab-mell-tables": { key: "mell-tables", name: "Mell Tables", targetId: "casino-category-Mell Tables" },
  "categories-qabs-qab-live-casino": { key: "live-casino", name: "Live Casino", targetId: "casino-category-Live Casino" },
  "categories-qabs-qab-new": { key: "new", name: "New", targetId: "casino-category-New" },
  "categories-qabs-qab-hot-rtp": { key: "hot-rtp", name: "Hot RTP", targetId: "casino-category-Hot RTP" },
  "categories-qabs-qab-roulette": { key: "roulette", name: "Roulette", targetId: "casino-category-Roulette" },
  "categories-qabs-qab-bonus-wagering": { key: "bonus-wagering", name: "Bonus Wagering", targetId: "casino-category-Bonus Wagering" },
};

function switchCategory(identifier) {
  let foundTestId = null;
  let targetConfig = null;

  if (identifier) {
    const cleanId = String(identifier)
      .toLowerCase()
      .trim()
      .replace(/^categories-qabs-qab-/, "")
      .replace(/^casino-category-/, "")
      .replace(/\s+/g, "-");

    for (const [testId, config] of Object.entries(CATEGORY_MAP)) {
      const configKey = (config.key || "").toLowerCase();
      const configName = (config.name || "").toLowerCase().replace(/\s+/g, "-");
      const configTarget = (config.targetId || "").toLowerCase().replace(/^casino-category-/, "").replace(/\s+/g, "-");

      if (
        testId === identifier ||
        config.key === identifier ||
        configKey === cleanId ||
        configName === cleanId ||
        (config.targetId && config.targetId === identifier) ||
        (configTarget && configTarget === cleanId)
      ) {
        foundTestId = testId;
        targetConfig = config;
        break;
      }
    }
  }

  if (!targetConfig) {
    foundTestId = "categories-qabs-qab-casino";
    targetConfig = CATEGORY_MAP[foundTestId];
  }

  // 1. Update Category Tabs active state
  const allTabs = document.querySelectorAll('[data-testid^="categories-qabs-qab-"], [data-category-target]');
  allTabs.forEach((t) => {
    const tabTestId = t.getAttribute("data-testid");
    const tabTarget = t.getAttribute("data-category-target");
    const isMatch = tabTestId === foundTestId || (tabTarget && tabTarget.toLowerCase() === (targetConfig.key || "").toLowerCase());

    if (isMatch) {
      t.classList.add("tab_selected-gcHAi");
      try {
        t.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      } catch (_) {}
    } else {
      t.classList.remove("tab_selected-gcHAi");
    }
  });

  // 2. Query all category section wrappers (both by data-category-segment and data-index)
  const categoryWrappers = document.querySelectorAll('[data-category-segment], [data-index]');
  const bannerCarousel = document.querySelector('.banners-carousel-v2_root-Z7hRi');
  const lastWinsList = document.querySelector('.last-wins_list-lLyKJ');

  if (targetConfig.isLobby) {
    // Lobby view: show hero banners, last wins list, and all category rows
    if (bannerCarousel) bannerCarousel.style.display = "";
    if (lastWinsList) lastWinsList.style.display = "";

    categoryWrappers.forEach((wrapper) => {
      wrapper.style.display = "";
      wrapper.classList.remove("category-grid-mode");
    });
  } else {
    // Category grid view: hide hero banners, last wins list, and show ONLY the selected category grid
    if (bannerCarousel) bannerCarousel.style.display = "none";
    if (lastWinsList) lastWinsList.style.display = "none";

    const targetKey = (targetConfig.key || "").toLowerCase();
    const targetTestId = targetConfig.targetId;

    categoryWrappers.forEach((wrapper) => {
      const segAttr = (wrapper.getAttribute("data-category-segment") || "").toLowerCase();
      const hasMatchingChild = targetTestId && wrapper.querySelector(`[data-testid="${targetTestId}"]`);
      const isSegmentMatch = segAttr && segAttr === targetKey;

      if (isSegmentMatch || hasMatchingChild) {
        wrapper.style.display = "";
        wrapper.classList.add("category-grid-mode");
      } else {
        wrapper.style.display = "none";
        wrapper.classList.remove("category-grid-mode");
      }
    });
  }
}
window.switchCategory = switchCategory;

