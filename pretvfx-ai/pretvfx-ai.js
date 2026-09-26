// ==== Markup Pretvfx-AI (dipindahkan dari index.html) ====
// index.html sekarang cuma nyambungin file ini; semua tampilan (div) disuntikkan lewat JS di sini,
// persis kayak pola yang dipakai music.js buat Pretvfx-Music.
document.body.insertAdjacentHTML('afterbegin', `
  <div id="intro-container" style="position: fixed; inset: 0; z-index: 99999; background: var(--bg-dark); display: flex; align-items: center; justify-content: center;">
  <div id="intro-loading" style="position: absolute; display: flex; flex-direction: column; align-items: center; gap: 10px;">
    <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 2rem; color: #6366f1;"></i>
    <span style="color: #a5b4fc; font-size: 0.9rem;">Memuat Pretvfx-AI</span>
  </div>
  <video id="intro-video" src="video.mp4" autoplay muted playsinline style="width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.5s ease; pointer-events: none;"></video>
</div>

  <svg style="width:0;height:0;position:absolute;" aria-hidden="true" focusable="false">
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" />
      <stop offset="50%" stop-color="#a855f7" />
      <stop offset="100%" stop-color="#06b6d4" />
    </linearGradient>
  </svg>

  <div id="bubbleCopyPopup" class="bubble-copy-popup" aria-hidden="true">
    <button type="button" onclick="copyPopupText()">
      <i class="fa-regular fa-copy"></i>
      <span id="bubbleCopyLabel">Salin</span>
    </button>
  </div>

  <div class="warning-modal-overlay" id="warningModalOverlay">
    <div class="warning-modal" role="dialog" aria-modal="true" aria-labelledby="warningModalTitle">
      <div class="warning-modal-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
      <div class="warning-modal-main">
        <h3 id="warningModalTitle">Peringatan</h3>
        <p id="warningModalMessage"></p>
      </div>
      <button type="button" class="warning-modal-btn" onclick="closeWarningModal()">Mengerti</button>
    </div>
  </div>

  <div class="warning-modal-overlay" id="confirmModalOverlay">
    <div class="warning-modal" role="dialog" aria-modal="true" aria-labelledby="confirmModalTitle">
      <div class="warning-modal-icon confirm-modal-icon"><i class="fa-solid fa-trash-can"></i></div>
      <div class="warning-modal-main">
        <h3 id="confirmModalTitle">Konfirmasi</h3>
        <p id="confirmModalMessage"></p>
      </div>
      <div class="confirm-modal-actions">
        <button type="button" class="warning-modal-btn confirm-modal-btn-cancel" onclick="closeConfirmModal()">Batal</button>
        <button type="button" class="warning-modal-btn confirm-modal-btn-danger" id="confirmModalConfirmBtn" onclick="confirmModalAccept()">Hapus</button>
      </div>
    </div>
  </div>

  <div class="app-container">
    <div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>

    <aside class="sidebar" id="sidebar">
      <div class="sidebar-header">
        <div class="brand">
          <img src="logo.png" class="brand-logo" alt="Logo">
          Pretvfx-AI
        </div>
        <button class="icon-btn" onclick="toggleSidebar()" title="Close Menu">
          <svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <button type="button" class="sidebar-pro-card" onclick="openProUpgradeModal()" aria-label="Upgrade to Pro">
        <span class="sidebar-pro-badge"><i class="fa-solid fa-crown"></i> Pro</span>
        <div class="sidebar-pro-title">Upgrade to Pro</div>
        <div class="sidebar-pro-sub">Generate tanpa batas · model Pro · kuota lebih tinggi</div>
        <span class="sidebar-pro-cta">Lihat benefit <i class="fa-solid fa-arrow-right"></i></span>
      </button>
      <div class="sidebar-divider"></div>

      <div class="history-section">
        <div class="history-label">Terbaru</div>
        <div class="chat-history" id="chatHistory"></div>
        <div class="sidebar-dock">
          <div class="sidebar-account" id="sidebarAccount"></div>
          <button type="button" class="btn-new-chat" onclick="startNewChat()"><i class="fa-solid fa-plus"></i> Chat baru</button>
        </div>
      </div>

      <div class="sidebar-footer">
        Modded by <span class="modder-name">Zain Suryo Negoro</span>
      </div>
    </aside>

    <main class="chat-main">
      <div class="top-bar">
        <div class="top-nav" aria-label="Mode aplikasi">
          <button type="button" class="top-nav-btn active" id="navAsk" onclick="exitImagine()">Ask</button>
          <button type="button" class="top-nav-btn" id="navImagine" onclick="enterImagine()">Imagine</button>
        </div>

        <button class="top-btn" onclick="toggleSidebar()" title="Menu">
          <svg class="icon" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <div class="top-extras-wrap" id="topExtrasWrap">
          <button type="button" class="top-btn" id="topExtrasBtn" onclick="handleTopExtrasBtn()" title="Menu">
            <i class="fa-solid fa-ellipsis-vertical" id="topExtrasIcon" aria-hidden="true"></i>
          </button>
          <div class="top-extras-menu" id="topExtrasMenu" role="menu" aria-hidden="true">
            <button type="button" class="top-extras-item music" role="menuitem" onclick="openPretvfxMusic()">
              <i class="fa-solid fa-music"></i>
              <span>Pretvfx-Music</span>
            </button>
            <button type="button" class="top-extras-item tools" role="menuitem" onclick="openPretvfxTools()">
              <i class="fa-solid fa-toolbox"></i>
              <span>Pretvfx-Tools</span>
            </button>
          </div>
        </div>
      </div>

      <div class="imagine-view" id="imagineView">
        <!-- HERO SECTION -->
        <div class="imagine-hero" id="imagineHero">
          
          
            
          <div class="imagine-results" id="imagineResults"></div>
        </div>

        <!-- CONTOH HASIL (Gambar dan Video dipertahankan, layout baru) -->
      <div class="imagine-gallery" id="imagineGallery" aria-label="Contoh hasil Imagine">  
          
          <div class="imagine-gallery-grid">
  <article class="imagine-card">
    <video class="imagine-card-media" src="video-tumbnail.mp4" loop muted playsinline preload="metadata"></video>
    <div class="imagine-card-label"><i class="fa-solid fa-video"></i> Contoh Video</div>
    </article>
            
  <article class="imagine-card">
    <video class="imagine-card-media" src="video-thumbnail-2.mp4" loop muted playsinline preload="metadata"></video>
    <div class="imagine-card-label"><i class="fa-solid fa-video"></i> Contoh Video</div>
  </article>
            <article class="imagine-card">
    <img class="imagine-card-media" src="https://raw.githubusercontent.com/danadiyaksanasif-afk/upload-gambar/refs/heads/main/WA_1789872763393.jpeg" alt="Contoh Gambar">
    <div class="imagine-card-label"><i class="fa-regular fa-image"></i> Contoh Gambar</div>
  </article>
     <article class="imagine-card">
    <img class="imagine-card-media" src="https://raw.githubusercontent.com/danadiyaksanasif-afk/upload-gambar/refs/heads/main/WA_1789873408391.jpeg" alt="Contoh Gambar">
    <div class="imagine-card-label"><i class="fa-regular fa-image"></i> Contoh Gambar</div>
  </article>         
            
  <article class="imagine-card">
    <video class="imagine-card-media" src="video-thumbnail-3.mp4" loop muted playsinline preload="metadata"></video>
    <div class="imagine-card-label"><i class="fa-solid fa-video"></i> Contoh Video</div>
  </article>
            
  <article class="imagine-card">
    <video class="imagine-card-media" src="video-thumbnail-4.mp4" loop muted playsinline preload="metadata"></video>
    <div class="imagine-card-label"><i class="fa-solid fa-video"></i> Contoh Video</div>
  </article>
            <article class="imagine-card">
    <img class="imagine-card-media" src="https://raw.githubusercontent.com/danadiyaksanasif-afk/upload-gambar/refs/heads/main/iamgine4.jpg" alt="Contoh Gambar">
    <div class="imagine-card-label"><i class="fa-regular fa-image"></i> Contoh Gambar</div>
  </article>
            <article class="imagine-card">
    <img class="imagine-card-media" src="https://raw.githubusercontent.com/danadiyaksanasif-afk/upload-gambar/refs/heads/main/image-3.jpg" alt="Contoh Gambar">
    <div class="imagine-card-label"><i class="fa-regular fa-image"></i> Contoh Gambar</div>
  </article>
             
            <article class="imagine-card">
    <img class="imagine-card-media" src="https://raw.githubusercontent.com/danadiyaksanasif-afk/upload-gambar/refs/heads/main/ssstik.io_1789871601337.webp" alt="Contoh Gambar">
    <div class="imagine-card-label"><i class="fa-regular fa-image"></i> Contoh Gambar</div>
  </article>
            <article class="imagine-card">
    <img class="imagine-card-media" src="https://raw.githubusercontent.com/danadiyaksanasif-afk/upload-gambar/refs/heads/main/ssstik.io_1789871812777.webp" alt="Contoh Gambar">
    <div class="imagine-card-label"><i class="fa-regular fa-image"></i> Contoh Gambar</div>
  </article> 
            <article class="imagine-card">
    <img class="imagine-card-media" src="https://raw.githubusercontent.com/danadiyaksanasif-afk/upload-gambar/refs/heads/main/ssstik.io_1789871741520.webp" alt="Contoh Gambar">
    <div class="imagine-card-label"><i class="fa-regular fa-image"></i> Contoh Gambar</div>
  </article>
            <article class="imagine-card">
    <img class="imagine-card-media" src="https://raw.githubusercontent.com/danadiyaksanasif-afk/upload-gambar/refs/heads/main/ssstik.io_1789871708448.webp" alt="Contoh Gambar">
    <div class="imagine-card-label"><i class="fa-regular fa-image"></i> Contoh Gambar</div>
  </article>
</div>
        
        </div>
      </div>

      <div class="messages-container" id="messagesContainer"></div>

      <div class="composer-container">
        <div class="input-box">
          <div class="image-preview-wrapper" id="imagePreviewWrapper">
            <div class="media-preview-list" id="mediaPreviewList"></div>
          </div>

          <textarea id="promptInput" placeholder="Mengobrol dengan Pretvfx-AI..." onkeydown="handleKeyDown(event)" oninput="autoResizeTextarea(this)"></textarea>

          <div class="composer-toolbar">
            <div class="toolbar-left">
              <div class="imagine-mode-switch" id="imagineModeSwitch" aria-label="Mode Imagine">
                <button type="button" class="imagine-mode-btn active" id="imagineImageBtn" onclick="setImagineMode('IMAGE')">
                  <i class="fa-regular fa-image"></i> Gambar <span class="quota-badge" id="quotaImageBadge">3/3</span>
                </button>
                <button type="button" class="imagine-mode-btn" id="imagineVideoBtn" onclick="setImagineMode('VIDEO')">
                  <i class="fa-solid fa-video"></i> Video <span class="quota-badge" id="quotaVideoBadge">1/1</span>
                </button>
              </div>

              <button class="btn-plus" onclick="handlePlusButton()" title="Tambahkan gambar">+</button>

              <button class="model-selector-button" id="modelSelectorButton" onclick="toggleModelSheet()" title="Pilih model">
                <span class="model-selector-name" id="modelSelectorName">Loading Models...</span>
                <svg class="model-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
            </div>

            <div class="toolbar-right">
              <input type="file" id="imageInput" accept="image/*" style="display:none;" onchange="handleImageSelect(event)">
              <input type="file" id="cameraInput" accept="image/*" capture="environment" style="display:none;" onchange="handleImageSelect(event)">
              <input type="file" id="fileInput" accept="image/*,video/*" style="display:none;" onchange="handleGeneralFileSelect(event)">
              <input type="file" id="videoInput" accept="video/mp4,video/mpeg,video/quicktime,video/avi,video/x-flv,video/mpg,video/webm,video/wmv,video/3gpp" style="display:none;" onchange="handleVideoSelect(event)">

              <button class="icon-btn" id="btnMic" title="Voice Input" onclick="toggleVoiceInput()">
                <svg class="icon" viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
              </button>

              <button class="btn-voice-mode" id="btnVoiceMode" onclick="openVoiceMode()" title="Voice Mode">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="4" y1="10" x2="4" y2="14"></line><line x1="9" y1="6" x2="9" y2="18"></line><line x1="14" y1="8" x2="14" y2="16"></line><line x1="19" y1="10" x2="19" y2="14"></line></svg>
              </button>

              <button class="btn-stop" id="btnStop" onclick="stopGenerating()" title="Stop">
                <svg class="icon" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12"></rect></svg>
              </button>

              <button class="btn-send" id="btnSend" onclick="sendMessage()" title="Kirim">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
              </button>
            </div>
          </div>
          <div class="imagine-quota-hint" id="imagineQuotaHint"></div>
        </div>
      </div>
    </main>
  </div>

  <div class="model-sheet-overlay" id="modelSheetOverlay" onclick="toggleModelSheet()"></div>

  <div class="model-bottom-sheet" id="modelBottomSheet">
    <div class="sheet-handle"></div>
    <div class="model-sheet-header">
      <button class="icon-btn model-sheet-close" id="modelSheetNavBtn" onclick="handleModelSheetNav()" title="Tutup">
        <svg class="icon" id="modelSheetNavIcon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <h4>Pilih model</h4>
      <div class="sheet-header-spacer"></div>
    </div>

    <div class="model-list" id="modelList">
      <div class="model-empty">Memuat model dari Admin Control...</div>
    </div>

    <div class="research-setting" id="researchSettingContainer">
      <div class="research-info">
        <div class="research-title">Riset mendalam</div>
        <div class="research-description">AI akan berpikir lebih teliti dan memberikan jawaban lebih lengkap.</div>
      </div>
      <label class="research-switch">
        <input type="checkbox" id="deepResearchToggle" onchange="toggleDeepResearch(this.checked)">
        <span class="research-slider"></span>
      </label>
    </div>

    <div class="model-sheet-footer">
      <button class="other-models-button" onclick="toggleOtherModels()">
        <span>••• &nbsp; Model lainnya</span>
        <svg class="icon" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </button>
    </div>
  </div>

  <div class="sheet-overlay" id="authSheetOverlay" onclick="closeAuthSheet()"></div>

  <div class="bottom-sheet" id="authSheet">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <button class="icon-btn" onclick="closeAuthSheet()" title="Tutup">
        <svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <h4 id="authSheetTitle">Masuk Akun</h4>
      <div class="sheet-header-spacer"></div>
    </div>

    <div class="auth-tabs">
      <button type="button" class="auth-tab active" id="tabLogin" onclick="switchAuthTab('login')">Masuk</button>
      <button type="button" class="auth-tab" id="tabSignup" onclick="switchAuthTab('signup')">Daftar</button>
    </div>

    <div class="auth-error" id="authError" style="display:none;"></div>

    <form class="auth-form" id="loginForm" onsubmit="handleLogin(event)">
      <div class="auth-field">
        <label>Email</label>
        <input type="email" id="loginEmail" required placeholder="nama@email.com" autocomplete="email">
      </div>
      <div class="auth-field">
        <label>Password</label>
        <input type="password" id="loginPassword" required placeholder="Masukkan password" autocomplete="current-password">
      </div>
      <button type="submit" class="auth-submit-btn" id="loginSubmitBtn">Masuk</button>
    </form>

    <form class="auth-form" id="signupForm" style="display:none;" onsubmit="handleSignup(event)">
      <div class="auth-field">
        <label>Username</label>
        <input type="text" id="signupUsername" required placeholder="Nama pengguna" autocomplete="username">
      </div>
      <div class="auth-field">
        <label>Email</label>
        <input type="email" id="signupEmail" required placeholder="nama@email.com" autocomplete="email">
      </div>
      <div class="auth-field">
        <label>Password</label>
        <input type="password" id="signupPassword" required minlength="6" placeholder="Minimal 6 karakter" autocomplete="new-password">
      </div>
      <button type="submit" class="auth-submit-btn" id="signupSubmitBtn">Buat Akun</button>
    </form>

    <div class="auth-hint">Akses model Premium (Alphax, Glux, dll) dibuka oleh Admin setelah kamu login.</div>
  </div>

  <div class="sheet-overlay" id="sheetOverlay" onclick="toggleBottomSheet()"></div>

  <div class="bottom-sheet" id="bottomSheet">
    <div class="sheet-handle"></div>
    <div class="sheet-header">
      <button class="icon-btn" onclick="toggleBottomSheet()" title="Tutup">
        <svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <h4>Tambahkan ke chat</h4>
      <div class="sheet-header-spacer"></div>
    </div>

    <div class="sheet-grid">
      <div class="sheet-item-card" onclick="openCamera()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
        <span>Kamera</span>
      </div>
      <div class="sheet-item-card" onclick="openPhotoPicker()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
        <span>Foto</span>
      </div>
      <div class="sheet-item-card" onclick="openVideoPicker()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="15" height="14" rx="2"></rect><polygon points="10,9 10,15 14,12"></polygon><path d="M18 10l3-2v8l-3-2"></path></svg>
        <span>Video</span>
      </div>
      <div class="sheet-item-card" onclick="openFilePicker()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
        <span>File</span>
      </div>
    </div>

    <div class="sheet-list">
      <div class="sheet-list-item" onclick="toggleWebSearch()">
        <div class="sheet-list-left">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          <span class="sheet-list-title">Pencarian web</span>
        </div>
        <label class="switch" onclick="event.stopPropagation()">
          <input type="checkbox" id="webSearchToggle" checked onchange="webSearchEnabled = this.checked;">
          <span class="slider"></span>
        </label>
      </div>

      <div class="sheet-list-item" onclick="showProjectInfo()">
        <div class="sheet-list-left">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
          <div><div class="sheet-list-title">Tambahkan ke proyek</div><div class="sheet-list-subtitle">Tidak ada</div></div>
        </div>
        <svg class="icon" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </div>

      <div class="sheet-list-item" onclick="showToolsInfo()">
        <div class="sheet-list-left">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
          <div><div class="sheet-list-title">Akses alat</div><div class="sheet-list-subtitle">Auto</div></div>
        </div>
        <svg class="icon" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
      </div>
    </div>
  </div>

  <div class="voice-mode-overlay" id="voiceModeOverlay">
    <div class="voice-mode-orb-wrap">
      <img src="logo.png" alt="Pretvfx" class="voice-mode-orb" id="voiceModeOrb">
    </div>
    <div class="voice-mode-status" id="voiceModeStatus">Mendengarkan...</div>
    <div class="voice-mode-controls">
      <button class="voice-mode-btn" id="voiceModeMuteBtn" onclick="toggleVoiceModeMute()" title="Bisukan mic">
        <i class="fa-solid fa-microphone"></i>
      </button>
      <button class="voice-mode-btn voice-mode-close" onclick="closeVoiceMode()" title="Tutup">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="voice-mode-credit">Modded by Zain Suryo Negoro</div>
  </div>

  <div class="pro-modal-overlay" id="proUpgradeOverlay" onclick="if(event.target===this)closeProUpgradeModal()">
    <div class="pro-modal" role="dialog" aria-modal="true" aria-labelledby="proUpgradeTitle">
      <div class="pro-modal-head">
        <div>
          <h3 id="proUpgradeTitle">Upgrade to Pro</h3>
          <p>Nikmati akses penuh Pretvfx-AI tanpa batas limit free.</p>
        </div>
        <button type="button" class="pro-modal-close" onclick="closeProUpgradeModal()" aria-label="Tutup"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <ul class="pro-benefit-list">
        <li><i class="fa-solid fa-infinity"></i><span>Generate gambar dan video tanpa batas</span></li>
        <li><i class="fa-solid fa-robot"></i><span>Akses ke semua model Pro AI</span></li>
        <li><i class="fa-solid fa-bolt"></i><span>Limit token kuota lebih tinggi</span></li>
        <li><i class="fa-solid fa-shield-halved"></i><span>Garansi 1 bulan pemakaian permanen</span></li>
      </ul>
      <div class="pro-contact-label">Hubungi admin untuk upgrade</div>
      <div class="pro-contact-row">
        <a class="pro-contact-btn wa" href="https://wa.me/6285713164894" target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-whatsapp"></i>
          <span>WhatsApp<small>0857-1316-4894</small></span>
        </a>
        <a class="pro-contact-btn tg" href="https://t.me/Pretvfx_Real01" target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-telegram"></i>
          <span>Telegram<small>t.me/Pretvfx_Real01</small></span>
        </a>
      </div>
    </div>
  </div>

`);

let viewingOtherModels = false;

  let introFinished = false;
  let resolveIntroFinished;
  const introFinishedPromise = new Promise(resolve => { resolveIntroFinished = resolve; });

  // Video contoh di tab Imagine hanya diputar kalau: intro sudah selesai, tab Imagine
  // lagi terbuka, kartunya kelihatan di layar, dan aplikasi tidak di background.
  // Di luar itu video di-pause, jadi tidak ada 4 video yang diam-diam jalan terus.
  const galleryVisibleVideos = new Set();

  function syncGalleryVideo(v) {
    const shouldPlay = introFinished
      && galleryVisibleVideos.has(v)
      && document.body.classList.contains('imagine-mode')
      && !document.hidden;
    if (shouldPlay) { if (v.paused) v.play().catch(() => {}); }
    else if (!v.paused) v.pause();
  }

  function playImagineGalleryVideos() {
    document.querySelectorAll('#imagineGallery video.imagine-card-media').forEach(syncGalleryVideo);
  }

  function setupGalleryVideoObserver() {
    const videos = document.querySelectorAll('#imagineGallery video.imagine-card-media');
    if (!('IntersectionObserver' in window)) {
      videos.forEach(v => galleryVisibleVideos.add(v));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) galleryVisibleVideos.add(entry.target);
        else galleryVisibleVideos.delete(entry.target);
        syncGalleryVideo(entry.target);
      });
    }, { threshold: 0.25 });
    videos.forEach(v => observer.observe(v));
  }

  document.addEventListener('visibilitychange', playImagineGalleryVideos);
  introFinishedPromise.then(playImagineGalleryVideos);

  document.addEventListener("DOMContentLoaded", () => {
    const introContainer = document.getElementById('intro-container');
    const introVideo = document.getElementById('intro-video');
    const introLoading = document.getElementById('intro-loading');
    let introClosed = false;

    function finishIntro() {
      if (introClosed) return;
      introClosed = true;
      if (introContainer) {
        introContainer.style.transition = "opacity 0.45s ease";
        introContainer.style.opacity = "0";
        setTimeout(() => {
          introContainer.style.display = 'none';
          introFinished = true;
          if (typeof resolveIntroFinished === 'function') resolveIntroFinished();
        }, 450);
      } else {
        introFinished = true;
        if (typeof resolveIntroFinished === 'function') resolveIntroFinished();
      }
    }

    if (introVideo) {
      introVideo.addEventListener('canplaythrough', () => {
        if (introLoading) introLoading.style.display = 'none';
        introVideo.style.opacity = '1';
      });
      introVideo.addEventListener('ended', finishIntro);
      introVideo.addEventListener('error', finishIntro);
    }

    // Safety: jangan pernah stuck di "Memuat Pretvfx-AI"
    // (video.mp4 hilang / WebView tidak fire error / jaringan lambat)
    setTimeout(() => {
      if (introLoading) introLoading.style.display = 'none';
      finishIntro();
    }, 3500);

    loadVoicesOnce();
    updateComposerButtons();
    setupGalleryVideoObserver();
  });

    const SUPABASE_URL = "https://avomctrjaroyourindwh.supabase.co";
    const SUPABASE_ANON_KEY = "sb_publishable_C5VqC9QjJoRpyQgQEUPZeg_vgBVlOEw";

    const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    let activeModels = [];
    let currentSelectedModel = null;
    let currentChatMessages = [];
    let base64ImageData = null;
    let selectedImages = [];
    let selectedMediaKind = null;
    let selectedMediaMime = null;
    let selectedImagineFile = null;
    let selectedImagineObjectUrl = null;
    let selectedVideoObjectUrl = null;
    const activeVideoObjectUrls = new Set();
    let abortController = null;

    let responseMode = 'short';
    let webSearchEnabled = true;

    const USER_SESSION_KEY = 'pretvfx_user_session';
    let currentUser = null;
    let userRealtimeChannel = null;

    let imagineMode = 'IMAGE';
let imagineRealtimeChannel = null;
let isLoggingOut = false; // <-- TAMBAHKAN INI
    const IMAGINE_BUCKET = 'imagine-media';
    let imagineRequests = new Map();
    let imagineBusy = false;
    let imagineHasPending = false;
    let lastImagineRenderKey = '';

    // Deteksi server mati pakai 2 cara digabung:
    // 1) Status masih 'queued' kelamaan (worker seharusnya nyomot tiap ~2 detik,
    //    ini kerjaan otomatis, gak nunggu owner) — jalan tanpa syarat tambahan.
    // 2) Heartbeat dari server (tabel system_heartbeat) berhenti kelamaan — ini
    //    yang bisa nangkep server mati walau requestnya udah kekirim ke owner
    //    (status 'processing'), tanpa salah tuduh pas owner cuma lagi lambat balas.
    // Angka-angka ini sengaja dibikin kecil biar kartu peringatannya cepet muncul.
    const IMAGINE_QUEUED_STALL_MS = 6 * 1000;    // 6 detik
    const IMAGINE_HEARTBEAT_STALE_MS = 9 * 1000; // 9 detik (server lapor tiap 3 detik)
    let serverAlive = true; // asumsi hidup dulu sampai heartbeat pertama kecek

    async function checkServerHeartbeat() {
      try {
        const { data, error } = await supabaseClient
          .from('system_heartbeat')
          .select('last_seen')
          .eq('id', 'imagine_worker')
          .maybeSingle();
        if (error || !data?.last_seen) return; // tabel belum ada/gagal baca -> jangan buru-buru anggap mati
        const lastSeenMs = new Date(data.last_seen).getTime();
        serverAlive = (Date.now() - lastSeenMs) < IMAGINE_HEARTBEAT_STALE_MS;
      } catch (_) {
        // Gagal cek koneksi ke Supabase sendiri -> biarkan status sebelumnya, jangan disimpulkan
      }
    }

    // Limit free: 5 gambar + 1 video, reset otomatis tiap 45 menit. Premium tanpa batas.
    // Window ini FIXED: begitu lewat 45 menit dari request pertama di window itu,
    // semua slot balik penuh SEKALIGUS, bukan kebuka satu-satu kayak sliding window.
    const FREE_IMAGE_LIMIT = 5;
    const FREE_VIDEO_LIMIT = 1;
    const QUOTA_WINDOW_MS = 45 * 60 * 1000;
    let quotaCache = { imageUsed: 0, videoUsed: 0, isPremium: false, imageResetAt: null, videoResetAt: null };

    let forcedVisibleImagineIds = new Set();
    let viewingSingleImagineId = null;

    // ============ FUNGSI BARU: generateUUID untuk fallback crypto.randomUUID ============
    function generateUUID() {
      if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    async function hashPassword(password) {
      const enc = new TextEncoder().encode(password);
      const buf = await crypto.subtle.digest('SHA-256', enc);
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function loadSessionFromStorage() {
      try {
        const raw = localStorage.getItem(USER_SESSION_KEY);
        currentUser = raw ? JSON.parse(raw) : null;
      } catch (error) { currentUser = null; }
    }

    function saveSession(user) {
      currentUser = user;
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    }

    function clearSession() {
  currentUser = null;
  localStorage.removeItem(USER_SESSION_KEY);
  
  if (userRealtimeChannel) { 
    supabaseClient.removeChannel(userRealtimeChannel); 
    userRealtimeChannel = null; 
  }
  if (imagineRealtimeChannel) { 
    supabaseClient.removeChannel(imagineRealtimeChannel); 
    imagineRealtimeChannel = null; 
  }
  imagineChannelStatus = ''; // <-- reset status channel
}
    function renderAccountUI() {
  const container = document.getElementById('sidebarAccount');
  if (!container) return;

  if (!currentUser) {
    container.innerHTML = `
      <button type="button" class="account-login-btn" onclick="openAuthSheet('login')">
        <i class="fa-solid fa-right-to-bracket"></i>
        Masuk
      </button>`;
    return;
  }

  const initial = (currentUser.username || currentUser.email || '?').trim().charAt(0);
  const isPremium = !!currentUser.is_premium;

  container.innerHTML = `
    <div class="account-menu" id="accountMenu">
      <div class="account-menu-head">
        <div class="account-name">${escapeHtml(currentUser.username)}</div>
        <div class="account-plan ${isPremium ? 'premium' : 'free'}">
          ${isPremium ? '<i class="fa-solid fa-crown"></i> Premium' : 'Akun Free'}
        </div>
      </div>
      <button type="button" class="account-menu-item" onclick="logoutUser()">
        <i class="fa-solid fa-right-from-bracket"></i>
        Keluar akun
      </button>
    </div>
    <button type="button" class="account-avatar-btn ${isPremium ? 'premium' : ''}" onclick="toggleAccountMenu(event)" aria-label="Menu akun">
      <span class="account-avatar-inner">${escapeHtml(initial)}</span>
    </button>`;
}


    function openAuthSheet(mode) {
      switchAuthTab(mode || 'login');
      document.getElementById('authSheet').classList.add('open');
      document.getElementById('authSheetOverlay').classList.add('active');
      if (window.innerWidth <= 768 && document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
    }

    function closeAuthSheet() {
      document.getElementById('authSheet').classList.remove('open');
      document.getElementById('authSheetOverlay').classList.remove('active');
      hideAuthError();
    }

    function switchAuthTab(tab) {
      const isLogin = tab !== 'signup';
      document.getElementById('tabLogin').classList.toggle('active', isLogin);
      document.getElementById('tabSignup').classList.toggle('active', !isLogin);
      document.getElementById('loginForm').style.display = isLogin ? 'flex' : 'none';
      document.getElementById('signupForm').style.display = isLogin ? 'none' : 'flex';
      document.getElementById('authSheetTitle').textContent = isLogin ? 'Masuk Akun' : 'Buat Akun Baru';
      hideAuthError();
    }

    function showAuthError(message) {
      const el = document.getElementById('authError');
      el.textContent = message;
      el.style.display = 'block';
    }

    function hideAuthError() {
      const el = document.getElementById('authError');
      el.style.display = 'none';
      el.textContent = '';
    }

    async function handleSignup(event) {
      event.preventDefault();
      hideAuthError();

      const username = document.getElementById('signupUsername').value.trim();
      const email = document.getElementById('signupEmail').value.trim().toLowerCase();
      const password = document.getElementById('signupPassword').value;
      const btn = document.getElementById('signupSubmitBtn');

      if (!username || !email || !password) return;
      if (password.length < 6) { showAuthError('Password minimal 6 karakter.'); return; }

      btn.disabled = true;
      btn.textContent = 'Memproses...';

      try {
        const password_hash = await hashPassword(password);
        const { data, error } = await supabaseClient
          .from('app_users')
          .insert([{ username, email, password_hash }])
          .select()
          .single();

        if (error) {
          if (error.code === '23505' || /duplicate/i.test(error.message || '')) showAuthError('Username atau email sudah terdaftar.');
          else showAuthError('Gagal membuat akun: ' + error.message);
          return;
        }

        saveSession({ id: data.id, username: data.username, email: data.email, is_premium: !!data.is_premium });
        subscribeUserRealtime();
        renderAccountUI();
        renderModelList();
        connectImagineStream();
        
        // Load history khusus user baru (chat + imagine)
        loadChatSessions();
        currentChatId = createNewChatId();
        renderChatHistoryList();
        loadImagineRequests();
        renderWelcomeMessage();
        
        closeAuthSheet();
      } catch (error) {
        showAuthError('Terjadi kesalahan. Coba lagi.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Buat Akun';
      }
    }

    async function handleLogin(event) {
      event.preventDefault();
      hideAuthError();

      const email = document.getElementById('loginEmail').value.trim().toLowerCase();
      const password = document.getElementById('loginPassword').value;
      const btn = document.getElementById('loginSubmitBtn');

      if (!email || !password) return;

      btn.disabled = true;
      btn.textContent = 'Memproses...';

      try {
        const { data, error } = await supabaseClient.from('app_users').select('*').eq('email', email).maybeSingle();

        if (error || !data) { showAuthError('Email belum terdaftar.'); return; }

        const password_hash = await hashPassword(password);
        if (password_hash !== data.password_hash) { showAuthError('Password salah.'); return; }

        saveSession({ id: data.id, username: data.username, email: data.email, is_premium: !!data.is_premium });
        subscribeUserRealtime();
        renderAccountUI();
        renderModelList();
        connectImagineStream();
        
        // Load history khusus user yang login (chat + imagine)
        loadChatSessions();
        currentChatId = createNewChatId();
        renderChatHistoryList();
        loadImagineRequests();
        renderWelcomeMessage();

        closeAuthSheet();
      } catch (error) {
        showAuthError('Terjadi kesalahan. Coba lagi.');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Masuk';
      }
    }

    function logoutUser() {
  isLoggingOut = true;

  // 1. Bersihkan data dari layar SEGERA (sebelum proses network)
  chatSessions = [];
  currentChatId = null;
  imagineRequests.clear();
  forcedVisibleImagineIds.clear();
  viewingSingleImagineId = null;
  lastImagineRenderKey = '';

  // 2. Render layar kosong seketika
  renderChatHistoryList();
  renderImagineRequests(true);
  renderWelcomeMessage();
  if (document.body.classList.contains('imagine-mode')) exitImagine();

  // 3. Baru proses pembersihan session & network
  flushChatSaves();
  chatMessagesCache.clear();
  clearSession();
  renderAccountUI();
  renderModelList();

  // 4. Reset flag setelah channel Realtime benar-benar mati
  setTimeout(() => { isLoggingOut = false; }, 1500);
}

    async function refreshCurrentUserPremium() {
      if (!currentUser) return;
      try {
        const { data, error } = await supabaseClient.from('app_users').select('username, email, is_premium').eq('id', currentUser.id).maybeSingle();
        if (error || !data) return;

        currentUser.is_premium = !!data.is_premium;
        currentUser.username = data.username;
        currentUser.email = data.email;
        saveSession(currentUser);
        renderAccountUI();
        renderModelList();
        refreshImagineQuotaBar();
      } catch (error) {}
    }

    function subscribeUserRealtime() {
      if (!currentUser || userRealtimeChannel) return;
      userRealtimeChannel = supabaseClient
        .channel('app_users_changes_' + currentUser.id)
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'app_users', filter: `id=eq.${currentUser.id}` }, (payload) => {
          if (!currentUser || !payload.new) return;
          currentUser.is_premium = !!payload.new.is_premium;
          currentUser.username = payload.new.username;
          saveSession(currentUser);
          renderAccountUI();
          renderModelList();
          refreshImagineQuotaBar();
        })
        .subscribe();
    }

    function isModelLocked(model) { return !!model.is_premium && !(currentUser && currentUser.is_premium); }

    function closeModelSheet() {
      const sheet = document.getElementById('modelBottomSheet');
      const overlay = document.getElementById('modelSheetOverlay');
      const button = document.getElementById('modelSelectorButton');
      if (sheet) sheet.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      if (button) button.classList.remove('active');
    }

    function showWarningModal(message, title = 'Peringatan') {
      const overlay = document.getElementById('warningModalOverlay');
      const titleEl = document.getElementById('warningModalTitle');
      const messageEl = document.getElementById('warningModalMessage');
      if (!overlay || !titleEl || !messageEl) return;
      titleEl.textContent = title;
      messageEl.textContent = message;
      overlay.classList.add('show');
    }

    function closeWarningModal() {
      const overlay = document.getElementById('warningModalOverlay');
      if (overlay) overlay.classList.remove('show');
    }

    let confirmModalCallback = null;

    function showConfirmModal(message, onConfirm, opts = {}) {
      const overlay = document.getElementById('confirmModalOverlay');
      const titleEl = document.getElementById('confirmModalTitle');
      const messageEl = document.getElementById('confirmModalMessage');
      const confirmBtn = document.getElementById('confirmModalConfirmBtn');
      if (!overlay || !titleEl || !messageEl || !confirmBtn) return;
      titleEl.textContent = opts.title || 'Konfirmasi';
      messageEl.textContent = message;
      confirmBtn.textContent = opts.confirmText || 'Hapus';
      confirmModalCallback = onConfirm;
      overlay.classList.add('show');
    }

    function closeConfirmModal() {
      const overlay = document.getElementById('confirmModalOverlay');
      if (overlay) overlay.classList.remove('show');
      confirmModalCallback = null;
    }

    function confirmModalAccept() {
      const cb = confirmModalCallback;
      closeConfirmModal();
      if (typeof cb === 'function') cb();
    }

    function showPremiumLockedInfo() {
      if (!currentUser) {
        const modelSheet = document.getElementById('modelBottomSheet');
        const modelOverlay = document.getElementById('modelSheetOverlay');
        const modelButton = document.getElementById('modelSelectorButton');
        if (modelSheet) modelSheet.classList.remove('open');
        if (modelOverlay) modelOverlay.classList.remove('active');
        if (modelButton) modelButton.classList.remove('active');

        setTimeout(() => {
          if (modelSheet) modelSheet.style.visibility = 'hidden';
          if (modelOverlay) modelOverlay.style.visibility = 'hidden';
          openAuthSheet('login');
          setTimeout(() => {
            if (modelSheet) modelSheet.style.visibility = '';
            if (modelOverlay) modelOverlay.style.visibility = '';
          }, 50);
        }, 360);
        return;
      }
      showWarningModal('Model ini khusus akun Premium. Silakan upgrade akunmu terlebih dahulu untuk menggunakan model tersebut.', 'Model Premium');
    }

    // ==========================================
    // HISTORY CHAT DISIMPAN DI SUPABASE (tabel chat_sessions)
    // Di HP cuma ada daftar ringan (id, judul, waktu). Isi percakapan baru diambil
    // dari Supabase saat chat dibuka, jadi memori & penyimpanan HP tidak terbebani.
    // Yang disimpan cuma teks; foto/video hanya ditandai supaya tetap ringan.
    // ==========================================
    const CHAT_TABLE = 'chat_sessions';
    const MAX_CHAT_SESSIONS = 50;
    const CHAT_SAVE_DELAY_MS = 700;
    const CHAT_CACHE_LIMIT = 6;

    let chatSessions = [];                 // [{ id, title, updatedAt }] tanpa isi pesan
    let currentChatId = null;
    const chatMessagesCache = new Map();   // id -> pesan (teks saja), dibatasi CHAT_CACHE_LIMIT
    const pendingChatSaves = new Map();    // id -> baris yang menunggu dikirim ke Supabase
    let chatSaveTimer = null;
    let chatSaveChain = Promise.resolve();
    let chatLoadToken = 0;
    let chatPruned = false;
    let chatStoreWarned = false;

    function chatUserId() { return currentUser ? String(currentUser.id) : null; }

    function reportChatStoreError(label, error) {
      const msg = String((error && (error.message || error.code)) || error || '');
      console.warn('[Riwayat] ' + label + ':', msg);
      const missing = error && (error.code === 'PGRST205' || error.code === '42P01' || /chat_sessions/i.test(msg));
      if (missing && !chatStoreWarned) {
        chatStoreWarned = true;
        console.warn('[Riwayat] Tabel "chat_sessions" belum ada di Supabase. Jalankan SQL-nya di SQL Editor dulu.');
      }
    }

    function rememberChatMessages(id, messages) {
      chatMessagesCache.delete(id);
      chatMessagesCache.set(id, messages);
      if (!chatUserId()) return; // tamu: tidak ada di Supabase, jadi cache jangan dibuang
      while (chatMessagesCache.size > CHAT_CACHE_LIMIT) {
        chatMessagesCache.delete(chatMessagesCache.keys().next().value);
      }
    }

    function createNewChatId() { return 'chat_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8); }

    function generateChatTitle(messages) {
      const firstUserMsg = messages.find(msg => msg.role === 'user' && msg.text);
      if (!firstUserMsg) return 'Percakapan Baru';
      const text = firstUserMsg.text.trim();
      return text.length > 40 ? text.slice(0, 40) + '...' : text;
    }

    function toStorableMessages(messages) {
      return messages.map(m => {
        const hadVideo = !!m.video || !!m.videoOmitted || m.mediaKind === 'video';
        const hadImage = (Array.isArray(m.images) && m.images.length > 0) || !!m.image || m.mediaKind === 'image';
        const kind = m.mediaOmitted || (hadVideo ? 'video' : (hadImage ? 'image' : null));
        const out = { role: m.role === 'assistant' ? 'assistant' : 'user', text: m.text || '' };
        if (kind) out.media = kind;
        return out;
      });
    }

    function buildChatRow(uid, id, title, messages, updatedAtMs) {
      return {
        id: String(id),
        user_id: uid,
        title: String(title || 'Percakapan Baru').slice(0, 120),
        messages: toStorableMessages(messages),
        updated_at: new Date(updatedAtMs || Date.now()).toISOString()
      };
    }

    async function fetchChatList(uid) {
      const { data, error } = await supabaseClient
        .from(CHAT_TABLE)
        .select('id, title, updated_at')
        .eq('user_id', uid)
        .order('updated_at', { ascending: false })
        .limit(MAX_CHAT_SESSIONS);
      if (error) throw error;
      return (data || []).map(r => ({
        id: r.id,
        title: r.title || 'Percakapan Baru',
        updatedAt: new Date(r.updated_at).getTime() || Date.now()
      }));
    }

    function applyChatList(fromServer) {
      // Chat yang baru dibuat di sesi ini tapi belum sempat terkirim tetap dipertahankan
      const serverIds = new Set(fromServer.map(s => s.id));
      const localOnly = chatSessions.filter(s => !serverIds.has(s.id) && pendingChatSaves.has(s.id));
      chatSessions = [...localOnly, ...fromServer].sort((a, b) => b.updatedAt - a.updatedAt);
      renderChatHistoryList();
      historyListDirty = false;
    }

    async function loadChatSessions() {
      const uid = chatUserId();
      if (!uid) { chatSessions = []; return; }
      try {
        const list = await fetchChatList(uid);
        if (chatUserId() !== uid) return; // akun berganti selagi menunggu
        applyChatList(list);
        pruneOldChatRows(uid, list);
      } catch (error) {
        reportChatStoreError('Gagal memuat daftar riwayat', error);
      }

      // Riwayat lama yang masih di HP (localStorage) dipindah sekali ke Supabase, lalu dihapus dari HP.
      try {
        const moved = await migrateLegacyLocalChats(uid);
        if (moved > 0 && chatUserId() === uid) applyChatList(await fetchChatList(uid));
      } catch (error) {
        reportChatStoreError('Gagal memindahkan riwayat lama', error);
      }
    }

    async function migrateLegacyLocalChats(uid) {
      const key = 'pretvfx_chat_sessions_' + uid;
      let raw = null;
      try { raw = localStorage.getItem(key); } catch (_) { return 0; }
      if (!raw) return 0;

      let old = null;
      try { old = JSON.parse(raw); } catch (_) { old = null; }
      raw = null;
      if (!Array.isArray(old) || old.length === 0) {
        try { localStorage.removeItem(key); } catch (_) {}
        return 0;
      }

      const rows = old
        .filter(s => s && s.id && Array.isArray(s.messages) && s.messages.length > 0)
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
        .slice(0, MAX_CHAT_SESSIONS)
        .map(s => buildChatRow(uid, s.id, s.title, s.messages, s.updatedAt));
      old = null;

      for (let i = 0; i < rows.length; i += 10) {
        const { error } = await supabaseClient.from(CHAT_TABLE).upsert(rows.slice(i, i + 10), { onConflict: 'user_id,id' });
        if (error) throw error; // data di HP TIDAK dihapus kalau gagal, jadi aman dicoba lagi nanti
      }
      try { localStorage.removeItem(key); } catch (_) {}
      return rows.length;
    }

    // Batas 50 chat (sama seperti aturan sebelumnya): yang paling lama dibersihkan dari Supabase.
    function pruneOldChatRows(uid, list) {
      if (chatPruned || list.length < MAX_CHAT_SESSIONS) return;
      chatPruned = true;
      const oldest = new Date(list[list.length - 1].updatedAt).toISOString();
      supabaseClient.from(CHAT_TABLE).delete().eq('user_id', uid).lt('updated_at', oldest)
        .then(({ error }) => { if (error) console.warn('[Riwayat] Gagal merapikan riwayat lama:', error.message); });
    }

    function trimChatSessions() {
      if (chatSessions.length <= MAX_CHAT_SESSIONS) return;
      chatSessions.sort((a, b) => b.updatedAt - a.updatedAt);
      const removed = chatSessions.splice(MAX_CHAT_SESSIONS);
      removed.forEach(s => { chatMessagesCache.delete(s.id); pendingChatSaves.delete(s.id); });
      const uid = chatUserId();
      if (uid && removed.length) {
        supabaseClient.from(CHAT_TABLE).delete().eq('user_id', uid).in('id', removed.map(s => s.id))
          .then(({ error }) => { if (error) console.warn('[Riwayat] Gagal membuang riwayat lama:', error.message); });
      }
    }

    // Simpan ditunda sebentar & digabung: kirim pesan lalu balasan AI cukup jadi 1 request, bukan tiap pesan.
    function queueChatSave(row) {
      pendingChatSaves.set(row.id, row);
      if (chatSaveTimer) clearTimeout(chatSaveTimer);
      chatSaveTimer = setTimeout(flushChatSaves, CHAT_SAVE_DELAY_MS);
    }

    function flushChatSaves() {
      if (chatSaveTimer) { clearTimeout(chatSaveTimer); chatSaveTimer = null; }
      chatSaveChain = chatSaveChain.then(sendPendingChatSaves);
      return chatSaveChain;
    }

    async function sendPendingChatSaves() {
      if (!pendingChatSaves.size) return;
      const rows = [...pendingChatSaves.values()];
      pendingChatSaves.clear();
      try {
        const { error } = await supabaseClient.from(CHAT_TABLE).upsert(rows, { onConflict: 'user_id,id' });
        if (error) throw error;
      } catch (error) {
        // Kembalikan ke antrean (kecuali sudah ada versi yang lebih baru) supaya dicoba lagi di simpan berikutnya
        rows.forEach(r => { if (!pendingChatSaves.has(r.id)) pendingChatSaves.set(r.id, r); });
        reportChatStoreError('Gagal menyimpan riwayat chat', error);
      }
    }

    // Kirim yang tertunda saat aplikasi ditutup / pindah ke background
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushChatSaves(); });
    window.addEventListener('pagehide', () => { flushChatSaves(); });

    function persistCurrentChat() {
      if (!currentChatId || currentChatMessages.length === 0) return;
      const uid = chatUserId();
      const now = Date.now();
      const title = generateChatTitle(currentChatMessages);

      // Daftar di sidebar langsung diperbarui, tanpa nunggu jaringan
      const session = chatSessions.find(s => s.id === currentChatId);
      if (session) { session.title = title; session.updatedAt = now; }
      else chatSessions.unshift({ id: currentChatId, title, updatedAt: now });

      const row = buildChatRow(uid, currentChatId, title, currentChatMessages, now);
      rememberChatMessages(currentChatId, row.messages);
      if (uid) {
        queueChatSave(row);
        trimChatSessions();
      }

      historyListDirty = true;
      const sidebar = document.getElementById('sidebar');
      if (sidebar && sidebar.classList.contains('open')) {
        renderChatHistoryList();
        historyListDirty = false;
      }
    }

    function formatRelativeTime(timestamp) {
      const diffMin = Math.floor((Date.now() - timestamp) / 60000);
      if (diffMin < 1) return 'Baru';
      if (diffMin < 60) return diffMin + 'm';
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return diffHour + 'j';
      const diffDay = Math.floor(diffHour / 24);
      if (diffDay === 1) return 'Kemarin';
      if (diffDay < 7) return diffDay + 'h';
      const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
      const date = new Date(timestamp);
      return date.getDate() + ' ' + bulan[date.getMonth()];
    }

    function buildHistoryItemHtml(entry) {
      const safeTitle = escapeHtml(entry.title);
      const safeId = escapeHtml(entry.id);
      const inImagine = document.body.classList.contains('imagine-mode');

      if (entry.type === 'imagine') {
        // Hanya aktif di mode Imagine, dan hanya 1 entry yang cocok
        const isActive = inImagine && viewingSingleImagineId === entry.id;
        const iconClass = entry.mode === 'VIDEO' ? 'fa-video' : 'fa-image';
        return `
          <div class="history-item ${isActive ? 'active' : ''}" data-kind="imagine" data-id="${safeId}" onclick="loadImagineHistoryEntry('${entry.id}')">
            <span class="history-bullet"><i class="fa-solid ${iconClass}"></i></span>
            <span class="history-item-title">${safeTitle}</span>
            <button type="button" class="history-item-delete" onclick="deleteImagineHistory(event, '${entry.id}')" title="Hapus riwayat ini" aria-label="Hapus riwayat ini">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>`;
      }

      // Chat hanya aktif di mode Ask (bukan Imagine) — supaya tidak dobel highlight
      const isActive = !inImagine && entry.id === currentChatId;
      return `
        <div class="history-item ${isActive ? 'active' : ''}" data-kind="chat" data-id="${safeId}" onclick="loadChatSession('${entry.id}')">
          <span class="history-bullet"><i class="fa-solid fa-comment"></i></span>
          <span class="history-item-title">${safeTitle}</span>
          <button type="button" class="history-item-delete" onclick="deleteChatSession(event, '${entry.id}')" title="Hapus chat ini" aria-label="Hapus chat ini">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>`;
    }

    function renderChatHistoryList() {
      const listEl = document.getElementById('chatHistory');
      if (!listEl) return;

      const chatItems = chatSessions.map(session => ({ type: 'chat', id: session.id, title: session.title, updatedAt: session.updatedAt }));

      const imagineItems = [...imagineRequests.values()].map(item => ({
        type: 'imagine',
        id: item.request_id,
        mode: item.mode,
        title: item.prompt || (item.mode === 'VIDEO' ? 'Buat video' : 'Buat gambar'),
        updatedAt: new Date(item.created_at || Date.now()).getTime() || Date.now()
      }));

      const combined = [...chatItems, ...imagineItems].sort((a, b) => b.updatedAt - a.updatedAt);

      if (combined.length === 0) {
        const hint = currentUser
          ? 'Obrolan dan hasil Imagine kamu akan muncul di sini.'
          : 'Masuk ke akun untuk menyimpan obrolan kamu di sini.';
        listEl.innerHTML = `<div class="history-empty"><i class="fa-regular fa-message"></i><strong>Belum ada riwayat</strong><span>${hint}</span></div>`;
        return;
      }

      const prevScroll = listEl.scrollTop;
      listEl.innerHTML = combined.map(buildHistoryItemHtml).join('');
      listEl.scrollTop = prevScroll;
    }

    // ===== Tekan-tahan baris riwayat -> konfirmasi hapus (seperti di aplikasi Claude) =====
    var historyLongPressFired = false;
    (function setupHistoryLongPress() {
      const HOLD_MS = 550;
      const MOVE_LIMIT = 10;
      let timer = null;
      let row = null;
      let startX = 0;
      let startY = 0;

      function cancelPress() {
        if (timer) { clearTimeout(timer); timer = null; }
        if (row) { row.classList.remove('pressing'); row = null; }
      }

      document.addEventListener('touchstart', (e) => {
        historyLongPressFired = false;
        const target = e.target.closest ? e.target.closest('.chat-history .history-item') : null;
        if (!target || e.touches.length !== 1) { cancelPress(); return; }

        row = target;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;

        timer = setTimeout(() => {
          timer = null;
          historyLongPressFired = true;
          setTimeout(() => { historyLongPressFired = false; }, 5000); // pengaman
          try { if (navigator.vibrate) navigator.vibrate(15); } catch (err) {}
          const kind = row ? row.dataset.kind : null;
          const id = row ? row.dataset.id : null;
          if (row) row.classList.remove('pressing');
          row = null;
          if (!id) return;
          if (kind === 'imagine') deleteImagineHistory(null, id);
          else deleteChatSession(null, id);
        }, HOLD_MS);

        // efek "ditekan" baru muncul sesaat kemudian supaya tap biasa tidak berkedip
        setTimeout(() => { if (row === target && timer) target.classList.add('pressing'); }, 160);
      }, { passive: true });

      document.addEventListener('touchmove', (e) => {
        if (!timer) return;
        const t = e.touches[0];
        if (Math.abs(t.clientX - startX) > MOVE_LIMIT || Math.abs(t.clientY - startY) > MOVE_LIMIT) cancelPress();
      }, { passive: true });

      document.addEventListener('touchend', (e) => {
        cancelPress();
        if (historyLongPressFired) {
          if (e.cancelable) e.preventDefault(); // cegah "klik hantu" setelah tekan-tahan
          setTimeout(() => { historyLongPressFired = false; }, 500);
        }
      }, { passive: false });

      document.addEventListener('touchcancel', () => {
        cancelPress();
        if (historyLongPressFired) setTimeout(() => { historyLongPressFired = false; }, 500);
      }, { passive: true });

      // Klik susulan setelah tekan-tahan diblokir supaya chat tidak ikut terbuka / dialog tidak kepencet
      document.addEventListener('click', (e) => {
        if (!historyLongPressFired) return;
        e.stopPropagation();
        e.preventDefault();
      }, true);

      // Cegah menu bawaan Android muncul saat tekan-tahan di baris riwayat
      document.addEventListener('contextmenu', (e) => {
        const onRow = e.target.closest && e.target.closest('.chat-history .history-item');
        if (onRow && (timer || historyLongPressFired)) e.preventDefault();
      });
    })();

    // ===== Menu akun (ketuk avatar) =====
    function toggleAccountMenu(event) {
      if (event) event.stopPropagation();
      const menu = document.getElementById('accountMenu');
      if (menu) menu.classList.toggle('open');
    }

    function closeAccountMenu() {
      const menu = document.getElementById('accountMenu');
      if (menu) menu.classList.remove('open');
    }

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.account-menu') && !event.target.closest('.account-avatar-btn')) closeAccountMenu();
    });

    // ===== Menu Ask / Imagine di sidebar =====
    function closeSidebarOnMobile() {
      const sidebar = document.getElementById('sidebar');
      if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('open')) toggleSidebar();
    }

    function sidebarGoAsk() {
      if (document.body.classList.contains('imagine-mode')) exitImagine();
      closeSidebarOnMobile();
    }

    function sidebarGoImagine() {
      if (!document.body.classList.contains('imagine-mode')) enterImagine();
      closeSidebarOnMobile();
    }

    function deleteImagineHistory(event, requestId) {
      if (event && event.stopPropagation) event.stopPropagation();
      
      showConfirmModal('Riwayat Imagine ini akan dihapus permanen.', async () => {
        try {
          const { error } = await supabaseClient
            .from('imagine_requests')
            .delete()
            .eq('request_id', requestId);

          if (error) throw error;

          imagineRequests.delete(requestId);
          forcedVisibleImagineIds.delete(requestId);
          
          if (viewingSingleImagineId === requestId) {
            viewingSingleImagineId = null;
          }

          renderImagineRequests();
          renderChatHistoryList();
          
        } catch (err) {
          console.error('Gagal menghapus riwayat Imagine:', err);
          showWarningModal('Gagal menghapus riwayat: ' + err.message, 'Error');
        }
      }, { title: 'Hapus riwayat Imagine ini?', confirmText: 'Hapus' });
    }

    async function loadChatSession(id) {
      const listed = chatSessions.find(s => s.id === id);
      if (!listed) return;
      const token = ++chatLoadToken;
      const container = document.getElementById('messagesContainer');

      if (document.body.classList.contains('imagine-mode')) exitImagine();
      currentChatId = id;
      clearImage();

      let messages = chatMessagesCache.get(id);
      if (!messages) {
        // Belum ada di HP: ambil dari Supabase (cuma chat yang dibuka, bukan semuanya)
        currentChatMessages = [];
        container.innerHTML = '<div class="history-loading"><i class="fa-solid fa-circle-notch fa-spin"></i><span>Memuat percakapan...</span></div>';
        renderChatHistoryList();
        closeSidebarOnMobile();
        try {
          const uid = chatUserId();
          if (!uid) throw new Error('Belum login');
          const { data, error } = await supabaseClient
            .from(CHAT_TABLE)
            .select('messages')
            .eq('user_id', uid)
            .eq('id', id)
            .maybeSingle();
          if (error) throw error;
          messages = Array.isArray(data && data.messages) ? data.messages : [];
          rememberChatMessages(id, messages);
        } catch (error) {
          if (token !== chatLoadToken) return;
          reportChatStoreError('Gagal membuka riwayat chat', error);
          currentChatId = createNewChatId();
          currentChatMessages = [];
          renderWelcomeMessage();
          renderChatHistoryList();
          showWarningModal('Riwayat chat ini gagal dibuka. Periksa koneksi internetmu lalu coba lagi.', 'Gagal Membuka Chat');
          return;
        }
      }
      if (token !== chatLoadToken) return;

      currentChatMessages = messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        text: m.text || '',
        mediaOmitted: m.media || null
      }));

      if (currentChatMessages.length === 0) {
        renderWelcomeMessage();
      } else {
        container.innerHTML = '';
        // Tanpa animasi & tanpa scroll per pesan, biar buka chat panjang tidak nge-lag
        currentChatMessages.forEach(msg => {
          appendMessage(msg.role === 'assistant' ? 'ai' : 'user', msg.text, null, false, null,
            { noAnim: true, skipScroll: true, mediaOmitted: msg.mediaOmitted });
        });
        container.scrollTop = container.scrollHeight;
      }

      renderChatHistoryList();
      closeSidebarOnMobile();
    }

    // ===== Tombol kanan atas: menu Music/Tools (kosong) vs New Chat (ada pesan) =====
    function isChatEmpty() {
      if (document.body.classList.contains('imagine-mode')) {
        // Di Imagine: anggap "kosong" kalau belum ada hasil yang sedang dilihat
        return !viewingSingleImagineId;
      }
      return !currentChatMessages || currentChatMessages.length === 0;
    }

    function updateTopExtrasBtn() {
      const btn = document.getElementById('topExtrasBtn');
      const icon = document.getElementById('topExtrasIcon');
      if (!btn || !icon) return;
      const empty = isChatEmpty();
      if (empty) {
        icon.className = 'fa-solid fa-ellipsis-vertical';
        btn.title = 'Menu';
        btn.setAttribute('aria-label', 'Menu ekstra');
      } else {
        icon.className = 'fa-solid fa-pen-to-square';
        btn.title = 'Chat Baru';
        btn.setAttribute('aria-label', 'Chat Baru');
        closeTopExtrasMenu();
      }
    }

    function openTopExtrasMenu() {
      const menu = document.getElementById('topExtrasMenu');
      if (!menu) return;
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
    }

    function closeTopExtrasMenu() {
      const menu = document.getElementById('topExtrasMenu');
      if (!menu) return;
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
    }

    function toggleTopExtrasMenu() {
      const menu = document.getElementById('topExtrasMenu');
      if (!menu) return;
      if (menu.classList.contains('open')) closeTopExtrasMenu();
      else openTopExtrasMenu();
    }

    function handleTopExtrasBtn() {
      if (isChatEmpty()) {
        toggleTopExtrasMenu();
      } else {
        closeTopExtrasMenu();
        startNewChat();
      }
    }

    function openPretvfxMusic() {
      closeTopExtrasMenu();
      if (window.PretvfxMusic && typeof window.PretvfxMusic.open === 'function') {
        window.PretvfxMusic.open();
      } else {
        showWarningModal('Pretvfx-Music belum siap. Muat ulang halaman.', 'Pretvfx-Music');
      }
    }

    function openPretvfxTools() {
  closeTopExtrasMenu();
  if (window.PretvfxTools && typeof window.PretvfxTools.open === 'function') {
    window.PretvfxTools.open();
  } else {
    showWarningModal('Pretvfx-Tools belum siap. Muat ulang halaman.', 'Pretvfx-Tools');
  }
}

    document.addEventListener('click', (e) => {
      const wrap = document.getElementById('topExtrasWrap');
      if (!wrap) return;
      if (!wrap.contains(e.target)) closeTopExtrasMenu();
    });

    // Pastikan ikon tombol sesuai state chat saat halaman siap
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => updateTopExtrasBtn());
    } else {
      setTimeout(() => updateTopExtrasBtn(), 0);
    }

    function startNewChat() {
      if (document.body.classList.contains('imagine-mode')) {
        const promptEl = document.getElementById('promptInput');
        if (promptEl) { promptEl.value = ''; promptEl.style.height = ''; }
        clearImage();

        viewingSingleImagineId = null;
        forcedVisibleImagineIds.clear();

        renderImagineRequests();
        renderChatHistoryList();
        updateComposerButtons();
        updateTopExtrasBtn();

        if (window.innerWidth <= 768 && document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
        return;
      }

      currentChatId = createNewChatId();
      currentChatMessages = [];
      renderWelcomeMessage();
      clearImage();
      const input = document.getElementById('promptInput');
      if (input) { input.value = ''; input.style.height = ''; }
      updateComposerButtons();
      updateTopExtrasBtn();
      renderChatHistoryList();
      if (window.innerWidth <= 768 && document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
    }

    function deleteChatSession(event, id) {
      if (event && event.stopPropagation) event.stopPropagation();
      showConfirmModal('Riwayat chat ini akan dihapus permanen.', async () => {
        const uid = chatUserId();
        pendingChatSaves.delete(id);
        try {
          if (uid) {
            await chatSaveChain; // jangan sampai ketimpa simpanan yang lagi jalan
            const { error } = await supabaseClient.from(CHAT_TABLE).delete().eq('user_id', uid).eq('id', id);
            if (error) throw error;
          }
        } catch (error) {
          reportChatStoreError('Gagal menghapus riwayat chat', error);
          showWarningModal('Riwayat chat gagal dihapus. Periksa koneksi internetmu lalu coba lagi.', 'Gagal Menghapus');
          return;
        }
        chatSessions = chatSessions.filter(s => s.id !== id);
        chatMessagesCache.delete(id);

        if (id === currentChatId) startNewChat();
        else renderChatHistoryList();
      }, { title: 'Hapus riwayat chat ini?', confirmText: 'Hapus' });
    }

    window.addEventListener('DOMContentLoaded', async () => {
      loadSessionFromStorage();

      if (currentUser) {
        loadChatSessions();
        currentChatId = createNewChatId();
        renderChatHistoryList();
        subscribeUserRealtime();
        refreshCurrentUserPremium();
        connectImagineStream();
        loadImagineRequests(); // muat chat + imagine history dari awal
      }

      renderAccountUI();
      await fetchActiveModels();
      await introFinishedPromise;

      renderWelcomeMessage();
      refreshImagineQuotaBar();
      // Update countdown limit free setiap 30 detik
      setInterval(() => {
        if (document.hidden) return;
        if (document.body.classList.contains('imagine-mode')) refreshImagineQuotaBar();
      }, 1000);
    });

    async function fetchActiveModels() {
      const nameElement = document.getElementById('modelSelectorName');
      const listElement = document.getElementById('modelList');

      nameElement.textContent = 'Loading Models...';
      listElement.innerHTML = '<div class="model-empty">Memuat model dari Admin Control...</div>';

      try {
        const { data, error } = await supabaseClient.from('ai_models').select('*').eq('enabled', true).order('created_at', { ascending: false });

        if (error) {
          activeModels = [];
          currentSelectedModel = null;
          nameElement.textContent = 'Gagal memuat model';
          listElement.innerHTML = '<div class="model-empty">Gagal memuat model.<br><small>' + escapeHtml(error.message) + '</small></div>';
          return;
        }

        if (!data || data.length === 0) {
          activeModels = [];
          currentSelectedModel = null;
          nameElement.textContent = 'Tidak ada model';
          listElement.innerHTML = '<div class="model-empty">Belum ada model AI aktif di Admin Control.</div>';
          return;
        }

        activeModels = data.map((model, index) => ({ ...model, __adminOrder: index }));
        const previousId = currentSelectedModel?.id;
        let restoredModel = activeModels.find(model => String(model.id) === String(previousId));
        if (restoredModel && isModelLocked(restoredModel)) restoredModel = null;
        currentSelectedModel = restoredModel || [...activeModels].reverse().find(model => !isModelLocked(model)) || activeModels[activeModels.length - 1];

        renderModelSelector();
        renderModelList();
      } catch (error) {
        activeModels = [];
        currentSelectedModel = null;
        nameElement.textContent = 'Error Supabase';
        listElement.innerHTML = '<div class="model-empty">Error koneksi Supabase.<br><small>' + escapeHtml(error.message) + '</small></div>';
      }
    }

    function getModelName(model) { return String(model?.name || model?.display_name || model?.model_name || model?.model_id || 'Model AI'); }
    function getModelDescription(model) { return String(model?.description || model?.desc || model?.subtitle || 'Model AI dari Admin Control'); }

    function getModelBadge(model) {
      const raw = String(model?.badge || model?.plan || model?.tier || '').trim();
      if (!raw) return '';
      return raw.split(/[,|•·/]+/).map(part => part.trim()).filter(part => part && !/^vision$/i.test(part)).join(' • ');
    }

    function renderModelSelector() {
      const nameElement = document.getElementById('modelSelectorName');
      const selectorButton = document.getElementById('modelSelectorButton');
      if (!currentSelectedModel) {
        nameElement.textContent = 'Pilih model';
        selectorButton?.classList.remove('has-selection');
        return;
      }
      nameElement.textContent = getModelName(currentSelectedModel);
      selectorButton?.classList.add('has-selection');
    }

    function renderModelList() {
      const listElement = document.getElementById('modelList');

      const modelsToShow = activeModels
        .filter(model => {
          if (viewingOtherModels) return model.category === 'other';
          return !model.category || model.category === 'regular';
        })
        .sort((a, b) => {
          const nameA = getModelName(a).trim().toLowerCase();
          const nameB = getModelName(b).trim().toLowerCase();
          const isPretvfxA = nameA === 'pretvfx' || nameA === 'pretvfx-ai';
          const isPretvfxB = nameB === 'pretvfx' || nameB === 'pretvfx-ai';
          if (isPretvfxA !== isPretvfxB) return isPretvfxA ? 1 : -1;
          if (isPretvfxA && isPretvfxB) return 0;
          const premiumA = !!a.is_premium;
          const premiumB = !!b.is_premium;
          if (premiumA !== premiumB) return premiumA ? -1 : 1;
          const timeA = Date.parse(a.created_at || '') || 0;
          const timeB = Date.parse(b.created_at || '') || 0;
          if (timeA !== timeB) return timeB - timeA;
          return (a.__adminOrder ?? 0) - (b.__adminOrder ?? 0);
        });

      if (!modelsToShow.length) {
        listElement.innerHTML = '<div class="model-empty">Tidak ada model di kategori ini.</div>';
        return;
      }

      listElement.innerHTML = '';
      modelsToShow.forEach(model => {
        const locked = isModelLocked(model);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'model-option'
          + (currentSelectedModel && String(currentSelectedModel.id) === String(model.id) ? ' selected' : '')
          + (locked ? ' locked' : '');
        const badge = getModelBadge(model);

        button.innerHTML = `
          <div class="model-option-main">
            <div class="model-option-title">
              <span>${escapeHtml(getModelName(model))}</span>
              ${model.is_premium ? '<span class="model-badge premium-badge"> Pro</span>' : '<span class="model-badge free-badge">Free</span>'}
              ${badge ? `<span class="model-badge">${escapeHtml(badge)}</span>` : ''}
            </div>
            <div class="model-option-description">${escapeHtml(getModelDescription(model))}</div>
          </div>
          ${locked ? '<i class="fa-solid fa-lock model-lock-icon"></i>' : `<svg class="model-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="5 12 10 17 20 7"></polyline></svg>`}
        `;

        button.addEventListener('click', () => {
          if (locked) { showPremiumLockedInfo(); return; }
          selectModel(model);
        });
        listElement.appendChild(button);
      });
    }

    function selectModel(model) {
      if (!model) return;
      currentSelectedModel = model;
      renderModelSelector();
      renderModelList();
      toggleModelSheet();
    }

    function toggleModelSheet() {
      const sheet = document.getElementById('modelBottomSheet');
      const overlay = document.getElementById('modelSheetOverlay');
      const button = document.getElementById('modelSelectorButton');

      if (sheet.classList.contains('open')) {
        sheet.classList.remove('open');
        overlay.classList.remove('active');
        button.classList.remove('active');
      } else {
        if (currentUser) refreshCurrentUserPremium();
        renderModelList();
        sheet.classList.add('open');
        overlay.classList.add('active');
        button.classList.add('active');
      }
    }

    function getModeStyleInstruction() {
      if (voiceModeActive) {
        return `Kamu sekarang lagi di mode PERCAKAPAN SUARA (telepon suara), bukan chat teks biasa. Jawabanmu akan langsung dibacakan keras, jadi ikuti ini:
- Jawab singkat & to the point, ngobrol kayak orang asli, bukan kayak nulis artikel/dokumen.
- JANGAN pakai format list bernomor (1. 2. 3.), bullet point, heading, atau simbol markdown apa pun. Itu aneh banget kalau dibacakan.
- JANGAN selalu buka jawaban dengan sapaan generik kayak "Halo!" atau "Tentu!" di setiap balasan, kecuali penggunanya memang baru menyapa duluan.
- Kalau ditanya cara/tutorial melakukan sesuatu, jelasin ngalir kayak lagi cerita ke teman, bukan poin-poin bernomor.
- Boleh sesekali pakai gaya ngomong manusia asli, kayak "hmm...", "ya...", "gini...", secukupnya aja, jangan berlebihan.
- PENTING: tetap jawab sepenuhnya pakai Bahasa Indonesia.`;
      }
      if (deepResearchEnabled) {
        return 'Mode Riset Mendalam aktif. Berikan jawaban yang lebih teliti, lengkap, terstruktur, dan mendalam. PENTING: Kamu WAJIB memproses dan menjawab sepenuhnya menggunakan Bahasa Indonesia.';
      }
      return 'Mode Riset Mendalam tidak aktif. Jawab secara singkat, jelas, langsung ke inti, dan jangan terlalu panjang. PENTING: Kamu WAJIB memproses dan menjawab sepenuhnya menggunakan Bahasa Indonesia.';
    }

    let historyListDirty = true;

    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      const opening = !sidebar.classList.contains('open');
      sidebar.classList.toggle('open');
      overlay.classList.toggle('active');
      // Sembunyikan bubble musik saat history terbuka
      document.body.classList.toggle('sidebar-open', opening);
      if (!opening) closeAccountMenu();
      if (opening && historyListDirty) {
        renderChatHistoryList();
        historyListDirty = false;
      }
    }

    function toggleBottomSheet() {
      const sheet = document.getElementById('bottomSheet');
      const overlay = document.getElementById('sheetOverlay');
      if (sheet.classList.contains('open')) {
        sheet.classList.remove('open');
        overlay.classList.remove('active');
      } else {
        sheet.classList.add('open');
        overlay.classList.add('active');
      }
    }

    let typingTimeout = null;

    function renderWelcomeMessage() {
      const container = document.getElementById('messagesContainer');
      container.innerHTML = `
        <div class="welcome-screen">
          <img src="logo.png" class="welcome-image" alt="Pretvfx">
          <div class="welcome-greeting">
            <span id="typingWelcome"></span><span class="typing-cursor"></span>
          </div>
          <div class="welcome-subtitle">Teman AI untuk ngobrol, mencari ide, belajar, dan membantu pekerjaanmu.</div>
        </div>`;
      startLoopTyping();
    }

    function startLoopTyping() {
      const element = document.getElementById('typingWelcome');
      if (!element) return;

      const phrases = [
        'Slamat datang di Pretvfx-AI','Pretvfx-AI siap membantu!!!','Gratis untuk semua model!!!','Mau tanya tentang apa?',
        'Mau cari ide apa?','Butuh bantuan sekarang?','Ada yang dicari?','Punya pertanyaan apa?','Yuk mulai ngobrol',
        'Ayo mulai sekarang','Ketik pesanmu disini','Tulis pertanyaanmu sekarang','Coba tanyakan sesuatu','Cari solusi bersama',
        'Mari pecahkan masalah','Siap membantu kamu','Aku siap membantu','Tanyakan apa saja','Jangan ragu bertanya',
        'Butuh ide baru?','Mau belajar sesuatu?','Siap untuk mulai?','Ayo ngobrol santai','Mari mulai percakapan',
        'Punya ide menarik?','Butuh jawaban cepat?','Cari informasi terbaru?','Mau tahu sesuatu?','Ada masalah teknis?',
        'Butuh bantuan teknis?','Bingung dengan sesuatu?','Mari cari jawaban','Kita mulai sekarang','Yuk cari solusi',
        'Coba tanya Pretvfx','Pretvfx siap menjawab','AI siap membantu','AI menunggu pesanmu','Ketik pesan sekarang',
        'Kirim pesanmu sekarang','Mulai chat sekarang','Let’s start chatting','Ready to ask?','What do you?',
        'Need some help?','Ask me anything','Let’s talk now','Start chatting now','Tell me something',
        'What’s on your?','Are you ready?'
      ];

      let phraseIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      if (typingTimeout) clearTimeout(typingTimeout);

      function typeLoop() {
        if (!element.isConnected) { typingTimeout = null; return; }
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
          element.textContent = currentPhrase.substring(0, charIndex - 1);
          charIndex--;
        } else {
          element.textContent = currentPhrase.substring(0, charIndex + 1);
          charIndex++;
        }

        let typeSpeed = isDeleting ? 35 : 70;

        if (!isDeleting && charIndex === currentPhrase.length) { typeSpeed = 2000; isDeleting = true; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; typeSpeed = 400; }

        typingTimeout = setTimeout(typeLoop, typeSpeed);
      }
      typeLoop();
    }

    // ===== IMAGINE =====
    function setImagineNav(mode) {
      const isImagine = String(mode || '').toUpperCase() === 'IMAGINE';
      const navAsk = document.getElementById('navAsk');
      const navImagine = document.getElementById('navImagine');
      if (navAsk) navAsk.classList.toggle('active', !isImagine);
      if (navImagine) navImagine.classList.toggle('active', isImagine);
      const sideAsk = document.getElementById('sideNavAsk');
      const sideImagine = document.getElementById('sideNavImagine');
      if (sideAsk) sideAsk.classList.toggle('active', !isImagine);
      if (sideImagine) sideImagine.classList.toggle('active', isImagine);
    }

    function updateImaginePlaceholder() {
      const input = document.getElementById('promptInput');
      if (!input) return;
      input.placeholder = imagineMode === 'VIDEO' ? 'Buat video sesuai permintaan Anda' : 'Buat gambar sesuai permintaan Anda';
    }

    function enterImagine() {
      document.body.classList.add('imagine-mode');
      setImagineNav('IMAGINE');
      closeAllInputSheets();
      closeModelSheet();
      clearImage();
      const input = document.getElementById('promptInput');
      if (input) { input.value = ''; input.style.height = ''; } // Dihapus focus()
      setImagineMode(imagineMode, false);
      updateImaginePlaceholder();
      updateComposerButtons();
      updateTopExtrasBtn();
      loadImagineRequestsIfStale();
      connectImagineStream();
      playImagineGalleryVideos();
    }

    function exitImagine() {
      document.body.classList.remove('imagine-mode');
      setImagineNav('ASK');
      viewingSingleImagineId = null;

      const btnSend = document.getElementById('btnSend');
      if (btnSend) {
        btnSend.disabled = false;
        btnSend.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
        btnSend.style.display = 'none';
      }

      updateImaginePlaceholder();
      updateComposerButtons();
      updateTopExtrasBtn();
      const input = document.getElementById('promptInput');
      if (input) input.placeholder = 'Mengobrol dengan Pretvfx-AI...';
      renderChatHistoryList();
      playImagineGalleryVideos();
    }

    function exitSingleView() {
      viewingSingleImagineId = null;
      renderImagineRequests();
      renderChatHistoryList();
    }

    function setImagineMode(mode, clearPrompt = true) {
      imagineMode = mode === 'VIDEO' ? 'VIDEO' : 'IMAGE';
      document.getElementById('imagineImageBtn')?.classList.toggle('active', imagineMode === 'IMAGE');
      document.getElementById('imagineVideoBtn')?.classList.toggle('active', imagineMode === 'VIDEO');
      updateImaginePlaceholder();
      if (clearPrompt) {
        const input = document.getElementById('promptInput');
        if (input) input.focus();
      }
      refreshImagineQuotaBar();
    }

    function computeFixedWindowUsage(mode) {
      // Ambil semua request mode ini (bukan failed/warned), urut lama -> baru
      const timestamps = [...imagineRequests.values()]
        .filter(item => {
          const st = String(item.status || '');
          if (st === 'failed' || st === 'warned') return false;
          return String(item.mode || 'IMAGE').toUpperCase() === mode;
        })
        .map(item => new Date(item.created_at || 0).getTime())
        .filter(ts => ts > 0)
        .sort((a, b) => a - b);

      // Simulasi window fixed: begitu jarak ke request sebelumnya > 45 menit,
      // window lama dianggap TUNTAS SELURUHNYA, mulai window baru dari nol.
      let windowStart = null;
      let used = 0;
      for (const ts of timestamps) {
        if (windowStart === null || (ts - windowStart) > QUOTA_WINDOW_MS) {
          windowStart = ts;
          used = 0;
        }
        used++;
      }
      return { used, windowStart };
    }

    function computeQuotaFromRequests() {
      const isPremium = !!(currentUser && currentUser.is_premium);
      if (isPremium) {
        quotaCache = { imageUsed: 0, videoUsed: 0, isPremium: true, imageResetAt: null, videoResetAt: null };
        return quotaCache;
      }

      const now = Date.now();
      const img = computeFixedWindowUsage('IMAGE');
      const vid = computeFixedWindowUsage('VIDEO');

      // Kalau window terakhirnya sendiri udah lewat 45 menit dari sekarang, berarti
      // belum ada request baru sejak waktunya reset -> kuota dianggap sudah penuh lagi.
      const imageExpired = img.windowStart && (now - img.windowStart) > QUOTA_WINDOW_MS;
      const videoExpired = vid.windowStart && (now - vid.windowStart) > QUOTA_WINDOW_MS;

      quotaCache = {
        imageUsed: imageExpired ? 0 : img.used,
        videoUsed: videoExpired ? 0 : vid.used,
        isPremium: false,
        imageResetAt: (!imageExpired && img.windowStart) ? img.windowStart + QUOTA_WINDOW_MS : null,
        videoResetAt: (!videoExpired && vid.windowStart) ? vid.windowStart + QUOTA_WINDOW_MS : null
      };
      return quotaCache;
    }

    function formatQuotaCountdown(ms) {
  if (!ms || ms <= 0) return 'segera';
  
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  
  // Format: 2j 15m 30d (jika ada jam), atau 15m 30d (jika tidak ada jam)
  if (h > 0) {
    return `${h}j ${m}m ${s}d`;
  }
  return `${m}m ${s}d`;
}

    function refreshImagineQuotaBar() {
      const imgBadge = document.getElementById('quotaImageBadge');
      const vidBadge = document.getElementById('quotaVideoBadge');
      const hint = document.getElementById('imagineQuotaHint');
      if (!imgBadge || !vidBadge) return;

      const inImagine = document.body.classList.contains('imagine-mode');
      imgBadge.style.display = inImagine ? '' : 'none';
      vidBadge.style.display = inImagine ? '' : 'none';
      if (!inImagine) {
        if (hint) { hint.textContent = ''; hint.classList.remove('show'); }
        return;
      }

      const q = computeQuotaFromRequests();

      if (q.isPremium) {
        imgBadge.textContent = '∞';
        vidBadge.textContent = '∞';
        imgBadge.classList.add('premium');
        vidBadge.classList.add('premium');
        imgBadge.classList.remove('exhausted');
        vidBadge.classList.remove('exhausted');
        if (hint) {
          hint.textContent = 'Akun Premium · generate tanpa batas';
          hint.classList.add('show');
        }
        return;
      }

      const imgRemain = Math.max(0, FREE_IMAGE_LIMIT - q.imageUsed);
      const vidRemain = Math.max(0, FREE_VIDEO_LIMIT - q.videoUsed);
      imgBadge.textContent = `${imgRemain}/${FREE_IMAGE_LIMIT}`;
      vidBadge.textContent = `${vidRemain}/${FREE_VIDEO_LIMIT}`;
      imgBadge.classList.remove('premium');
      vidBadge.classList.remove('premium');
      imgBadge.classList.toggle('exhausted', imgRemain <= 0);
      vidBadge.classList.toggle('exhausted', vidRemain <= 0);

      if (hint) {
        if (q.imageUsed > 0 || q.videoUsed > 0) {
          // Prioritaskan reset mode yang lagi aktif dipakai; kalau mode itu belum
          // ada pemakaian, tampilkan reset mode lain yang ada pemakaiannya.
          let resetAt = null;
          if (imagineMode === 'VIDEO' && q.videoUsed > 0) resetAt = q.videoResetAt;
          else if (imagineMode === 'IMAGE' && q.imageUsed > 0) resetAt = q.imageResetAt;
          else resetAt = q.imageUsed > 0 ? q.imageResetAt : q.videoResetAt;

          const left = resetAt ? resetAt - Date.now() : QUOTA_WINDOW_MS;
          hint.textContent = `Limit free · reset dalam ${formatQuotaCountdown(left)}`;
          hint.classList.add('show');
        } else {
          hint.textContent = `Limit free · ${FREE_IMAGE_LIMIT} gambar & ${FREE_VIDEO_LIMIT} video / 45 menit`;
          hint.classList.add('show');
        }
      }
    }

    function getRemainingQuota(mode) {
      const q = computeQuotaFromRequests();
      if (q.isPremium) return { allowed: true, remaining: Infinity, isPremium: true };
      if (mode === 'VIDEO') {
        const remaining = Math.max(0, FREE_VIDEO_LIMIT - q.videoUsed);
        return { allowed: remaining > 0, remaining, isPremium: false };
      }
      const remaining = Math.max(0, FREE_IMAGE_LIMIT - q.imageUsed);
      return { allowed: remaining > 0, remaining, isPremium: false };
    }

    function getImagineFileExtension(file) {
      const name = String(file?.name || '').toLowerCase();
      const byName = name.includes('.') ? name.split('.').pop() : '';
      if (byName && /^[a-z0-9]{1,8}$/.test(byName)) return byName;
      const mime = String(file?.type || '').toLowerCase();
      const map = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'video/mp4': 'mp4', 'video/webm': 'webm', 'video/quicktime': 'mov', 'video/x-matroska': 'mkv' };
      return map[mime] || 'bin';
    }

    async function uploadImagineMedia(file) {
      if (!file) return null;
      if (!currentUser?.id) throw new Error('Sesi login tidak ditemukan.');

      const maxImage = 20 * 1024 * 1024;
      const maxVideo = 50 * 1024 * 1024;
      const isVideo = String(file.type || '').startsWith('video/');
      const max = isVideo ? maxVideo : maxImage;
      if (file.size > max) {
        throw new Error(isVideo ? 'Video terlalu besar. Maksimal 50 MB.' : 'Foto terlalu besar. Maksimal 20 MB.');
      }

      const ext = getImagineFileExtension(file);
      const safeUser = String(currentUser.id).replace(/[^a-zA-Z0-9_-]/g, 'user');
      const path = `${safeUser}/input/${Date.now()}_${generateUUID().replace(/-/g, '').slice(0, 12)}.${ext}`;

      const { error } = await supabaseClient.storage.from(IMAGINE_BUCKET).upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type || undefined });

      if (error) throw new Error('Upload media gagal: ' + error.message);

      const { data } = supabaseClient.storage.from(IMAGINE_BUCKET).getPublicUrl(path);
      if (!data?.publicUrl) throw new Error('URL media tidak berhasil dibuat.');
      return data.publicUrl;
    }

    function getImagineResultList(item) {
      if (Array.isArray(item.result_urls) && item.result_urls.length) {
        return item.result_urls.map(entry => {
          if (!entry) return null;
          if (typeof entry === 'string') return { url: entry, type: item.result_type === 'video' ? 'video' : 'image' };
          return { url: entry.url, type: entry.type === 'video' ? 'video' : 'image' };
        }).filter(entry => entry && entry.url);
      }
      if (item.result_url) return [{ url: item.result_url, type: item.result_type === 'video' ? 'video' : 'image' }];
      return [];
    }

    function renderImagineMediaGroup(mediaList) {
      if (!mediaList.length) return '';
      const mediaHtml = mediaList.map(m => {
        let html = '';
        if (m.type === 'video') {
          html = `<video class="imagine-result-media" controls playsinline preload="metadata" src="${escapeHtml(m.url)}"></video>`;
        } else {
          html = `
            <div style="position: relative; display: inline-block; max-width: 100%;">
              <img class="imagine-result-media" src="${escapeHtml(m.url)}" alt="Hasil Imagine" loading="lazy">
              <button class="download-btn" onclick="downloadImage('${escapeHtml(m.url)}')" title="Unduh Gambar"><i class="fa-solid fa-download"></i></button>
            </div>`;
        }
        return html;
      }).join('');

      return mediaList.length > 1 ? `<div class="imagine-result-media-row">${mediaHtml}</div>` : mediaHtml;
    }

    // FUNGSI BARU UNTUK DOWNLOAD GAMBAR
    async function downloadImage(url) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = `pretvfx-imagine-${Date.now()}.jpg`;

        // Kalau dibuka lewat APK (WebView) yang sudah dikasih jembatan AndroidDownloader,
        // blob: URL gak bisa dibuka DownloadManager/Intent di sisi native, jadi dikirim
        // sebagai base64 biar disimpan langsung oleh kode Java-nya.
        if (window.AndroidDownloader && typeof window.AndroidDownloader.saveBase64File === 'function') {
          const reader = new FileReader();
          reader.onloadend = () => {
            window.AndroidDownloader.saveBase64File(reader.result, fileName);
          };
          reader.onerror = () => {
            showWarningModal('Gagal mengunduh gambar. Pastikan koneksi internet stabil.', 'Gagal Mengunduh');
          };
          reader.readAsDataURL(blob);
          return;
        }

        // Browser biasa (bukan APK): cara lama pakai blob URL tetap jalan normal
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } catch (error) {
        console.error('Download error:', error);
        showWarningModal('Gagal mengunduh gambar. Pastikan koneksi internet stabil.', 'Gagal Mengunduh');
      }
    }

    function renderImagineReference(item) {
      if (!item.media_url) return '';
      const isVideoRef = item.media_type === 'video';
      return `
        <div class="imagine-reference">
          <span class="imagine-reference-label">Referensi kamu</span>
          ${isVideoRef
            ? `<video class="imagine-reference-thumb" src="${escapeHtml(item.media_url)}" muted></video>`
            : `<img class="imagine-reference-thumb" src="${escapeHtml(item.media_url)}" alt="Referensi">`}
        </div>`;
    }

    function renderImagineRequests(force = false) {
      const box = document.getElementById('imagineResults');
      if (!box) return;

      const allItems = [...imagineRequests.values()];

      let items;
      let isSingleView = false;

      if (viewingSingleImagineId) {
        const single = allItems.find(i => i.request_id === viewingSingleImagineId);
        items = single ? [single] : [];
        isSingleView = true;
      } else {
        items = allItems
          .filter(item => {
            if (forcedVisibleImagineIds.has(item.request_id)) return true;
            return false;
          })
          .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
      }

      const gallery = document.getElementById('imagineGallery');
      if (gallery) gallery.classList.toggle('is-hidden', items.length > 0);

      imagineHasPending = allItems.some(item => item.status === 'queued' || item.status === 'processing');

      const heroText = document.getElementById('imagineHeroText');
      if (heroText) {
        const hasContent = items.length > 0 || imagineBusy || imagineHasPending;
        heroText.style.display = hasContent ? 'none' : 'block';
      }

      refreshImagineSendButton();
      refreshImagineQuotaBar();

      // Cegah kedip: skip rebuild DOM jika data kartu tidak berubah
      const renderKey = items.map(item => {
        const st = String(item.status || '');
        const url = String(item.result_url || '');
        const media = String(item.media_url || '');
        const createdAtMs = item.created_at ? new Date(item.created_at).getTime() : 0;
        const elapsedMs = createdAtMs ? (Date.now() - createdAtMs) : 0;
        const stallMs = (typeof IMAGINE_QUEUED_STALL_MS !== 'undefined') ? IMAGINE_QUEUED_STALL_MS : 120000;
        const queuedTooLong = st === 'queued' && createdAtMs && elapsedMs > stallMs;
        const heartbeatDead = !serverAlive && (st === 'queued' || st === 'processing');
        const phase = queuedTooLong || heartbeatDead ? 'stalled' : st;
        return [item.request_id, phase, url, media, item.result_type || '', item.prompt || ''].join('::');
      }).join('||') + '|v:' + (viewingSingleImagineId || '') + '|n:' + items.length;

      if (!force && renderKey === lastImagineRenderKey) return;
      lastImagineRenderKey = renderKey;

      if (!items.length) {
  if (isSingleView) {
    box.style.display = 'grid';
    box.innerHTML = `
      <div class="imagine-empty">Data riwayat tidak ditemukan atau sudah dihapus.</div>`;
  } else {
    box.innerHTML = '';
    box.style.display = 'none';
  }
  return;
}

box.style.display = 'grid';
box.innerHTML = items.map(item => {
        const isVideo = item.mode === 'VIDEO' || item.result_type === 'video';
        const mediaList = getImagineResultList(item);
        const completed = item.status === 'completed' && mediaList.length > 0;
        const failed = item.status === 'failed';
        const cancelled = item.status === 'cancelled'
          || item.status === 'cancel_requested'
          || (typeof item.result_url === 'string' && item.result_url.startsWith('cancel://'));
        const reqId = escapeHtml(item.request_id || '');

        if (completed) {
          const modeIcon = isVideo ? 'fa-video' : 'fa-image';
          const modeLabel = isVideo ? 'Video' : 'Gambar';
          return `<article class="imagine-result completed" data-request-id="${reqId}">
            <div class="imagine-media-frame">
              ${renderImagineMediaGroup(mediaList)}
            </div>
            <div class="imagine-result-caption">
              <div class="imagine-done-meta">
                <span class="imagine-done-badge"><i class="fa-solid fa-check"></i> ${modeLabel} selesai</span>
                <span class="imagine-done-mode"><i class="fa-solid ${modeIcon}"></i> ${modeLabel}</span>
              </div>
              ${renderImagineReference(item)}
              <p class="imagine-done-prompt">
                <span class="imagine-done-prompt-label">Prompt</span>
                ${escapeHtml(item.prompt || 'Tanpa prompt')}
              </p>
              <div class="imagine-done-footer">
                <span class="imagine-done-id">${reqId}</span>
                <span class="imagine-done-chip">Pretvfx Imagine</span>
              </div>
            </div>
          </article>`;
        }

        const warned = item.status === 'warned' || (typeof item.result_url === 'string' && item.result_url.startsWith('warn://'));
        if (warned) {
          let warnMsg = 'Prompt kamu mengandung konten sensitif / tidak sesuai ketentuan. Mohon ganti prompt dan coba lagi.';
          if (typeof item.result_url === 'string' && item.result_url.startsWith('warn://')) {
            warnMsg = item.result_url.slice('warn://'.length) || warnMsg;
          }
          return `<article class="imagine-result warned" data-request-id="${reqId}">
            <div class="imagine-result-header" style="display:flex;gap:12px;align-items:flex-start;">
              <div class="imagine-result-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
              <div>
                <div class="imagine-result-title">Peringatan</div>
                <div class="imagine-result-status">${escapeHtml(warnMsg)}</div>
                <div class="imagine-result-id">${reqId}</div>
              </div>
            </div>
          </article>`;
        }

        if (cancelled) {
          return `<article class="imagine-result" data-request-id="${reqId}">
            <div class="imagine-result-header" style="display:flex;gap:12px;align-items:flex-start;">
              <div class="imagine-result-icon"><i class="fa-solid fa-ban"></i></div>
              <div>
                <div class="imagine-result-title">Generate Dibatalkan</div>
                <div class="imagine-result-status">Request ini dibatalkan. Kamu bisa generate ulang kapan saja.</div>
                <div class="imagine-result-id">${reqId}</div>
              </div>
            </div>
          </article>`;
        }

        if (failed) {
          let failMsg = 'Maaf, permintaan gagal diproses. Silakan coba lagi.';
          let isQuota = false;
          if (typeof item.result_url === 'string' && item.result_url.startsWith('quota://')) {
            failMsg = item.result_url.slice('quota://'.length) || failMsg;
            isQuota = true;
          }
          return `<article class="imagine-result failed" data-request-id="${reqId}">
            <div class="imagine-result-header">
              <div class="imagine-result-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
              <div>
                <div class="imagine-result-title">${isQuota ? 'Limit Generate Tercapai' : 'Permintaan gagal'}</div>
                <div class="imagine-result-status${isQuota ? ' quota-msg' : ''}">${escapeHtml(failMsg)}</div>
                <div class="imagine-result-id">${reqId}</div>
              </div>
            </div>
          </article>`;
        }

        // Cek apakah request masih 'queued' (belum diambil worker) kelamaan —
        // ini SATU-SATUNYA sinyal yang murni nunjukin server/worker mati, karena
        // langkah ini otomatis, tidak melibatkan owner sama sekali. Status
        // 'processing' sengaja tidak dicek waktunya, biar nunggu balasan owner
        // lama sekalipun tidak dianggap error.
        const createdAtMs = item.created_at ? new Date(item.created_at).getTime() : null;
        const elapsedMs = createdAtMs ? (Date.now() - createdAtMs) : 0;
        const queuedTooLong = item.status === 'queued' && createdAtMs && elapsedMs > IMAGINE_QUEUED_STALL_MS;
        // Heartbeat mati = server beneran down, berlaku juga buat status 'processing'
        // (request udah kekirim ke owner tapi server-nya tumbang di tengah jalan).
        const heartbeatDead = !serverAlive && (item.status === 'queued' || item.status === 'processing');
        const isStalled = queuedTooLong || heartbeatDead;

        if (isStalled) {
          return `<article class="imagine-result stalled" data-request-id="${reqId}">
            <div class="imagine-result-header" style="display:flex;gap:12px;align-items:flex-start;">
              <div class="imagine-result-icon"><i class="fa-solid fa-server"></i></div>
              <div>
                <div class="imagine-result-title">Server Sedang Mengalami Kendala</div>
                <div class="imagine-result-status">Proses ${isVideo ? 'video' : 'gambar'} kamu belum ada perkembangan. Server sedang gangguan/offline. Request ini tetap tersimpan dan akan otomatis lanjut kalau server sudah normal.</div>
                <div class="imagine-result-id">${reqId}</div>
              </div>
            </div>
          </article>`;
        }

        const loadingTitle = isVideo ? 'Video sedang dibuat...' : 'Gambar sedang dibuat...';
        const loadingSub = isVideo
          ? 'Pretvfx-AI sedang merender video kamu. Tetap di aplikasi agar proses lancar.'
          : 'Pretvfx-AI sedang merender gambar kamu. Tetap di aplikasi agar proses lancar.';
        const modeLabel = isVideo ? 'Video' : 'Gambar';
        const modeIcon = isVideo ? 'fa-video' : 'fa-image';

        return `<article class="imagine-result loading" data-request-id="${reqId}">
          <div class="imagine-loading-state">
            <div class="imagine-loading-orb">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div class="imagine-loading-text">
              <span class="imagine-loading-kicker"><i class="fa-solid ${modeIcon}"></i> ${modeLabel}</span>
              <div class="imagine-loading-title">${loadingTitle}</div>
              <div class="imagine-loading-sub">${loadingSub}</div>
            </div>
          </div>
          <div class="imagine-progress"><div class="imagine-progress-bar"></div></div>
          <div class="imagine-loading-prompt">
            ${renderImagineReference(item)}
            <span class="imagine-loading-prompt-label">Prompt</span>
            <div class="imagine-result-status">${escapeHtml(item.prompt || 'Tanpa prompt')}</div>
            <div class="imagine-loading-footer">
              <span class="imagine-result-id">${reqId}</span>
              <span class="imagine-loading-dots" aria-hidden="true"><span></span><span></span><span></span></span>
            </div>
          </div>
        </article>`;
      }).join('');
    }

    function upsertImagineRequest(item) {
  if (isLoggingOut) return; // <-- TAMBAHKAN INI
  if (!item?.request_id) return;
  imagineRequests.set(item.request_id, item);

  if (document.body.classList.contains('imagine-mode')) {
    renderImagineRequests();
  }

  historyListDirty = true;
  const sidebar = document.getElementById('sidebar');
  if (sidebar && sidebar.classList.contains('open')) {
    renderChatHistoryList();
    historyListDirty = false;
  }
}

    let lastImagineLoadAt = 0;
    let imagineChannelStatus = '';

    // Data Imagine sudah dijaga up-to-date oleh Realtime, jadi pindah tab Ask <-> Imagine
    // tidak perlu ambil ulang dari Supabase kalau barusan di-load.
    function loadImagineRequestsIfStale() {
      if (currentUser && (Date.now() - lastImagineLoadAt) < 20000) {
        renderImagineRequests();
        renderChatHistoryList();
        return;
      }
      loadImagineRequests();
    }

    async function loadImagineRequests() {
  if (isLoggingOut) return; // <-- TAMBAHKAN INI
  if (!currentUser) {
    imagineRequests.clear();
    renderImagineRequests();
    renderChatHistoryList();
    return;
  }
  try {
    const { data, error } = await supabaseClient
      .from('imagine_requests')
      .select('*')
      .eq('user_id', String(currentUser.id))
      .order('created_at', { ascending: false })
      .limit(30);
    if (error) throw error;
    imagineRequests.clear();
    (data || []).forEach(item => imagineRequests.set(item.request_id, item));
    lastImagineLoadAt = Date.now();
    renderImagineRequests();
    renderChatHistoryList();
    historyListDirty = false;
  } catch (error) {
    console.error('Imagine history:', error.message);
    renderImagineRequests();
    renderChatHistoryList();
  }
}

    // Karena kalau server mati gak akan ada event Realtime baru sama sekali,
    // kita harus tetap render ulang secara berkala biar deteksi "stalled" jalan.
    // checkServerHeartbeat() jalan terus selama ada request pending (gak peduli
    // lagi buka tab Imagine atau nggak), biar begitu balik ke tab Imagine
    // datanya udah update; render ulangnya baru kalau memang lagi di tab Imagine.
    setInterval(async () => {
      if (!imagineHasPending || document.hidden) return;
      await checkServerHeartbeat();
      if (document.body.classList.contains('imagine-mode')) {
        renderImagineRequests();
      }
    }, 3000);

    function connectImagineStream() {
      if (!currentUser) return;
      // Channel yang sudah tersambung dipakai terus, tidak dibongkar-pasang tiap masuk tab Imagine
      if (imagineRealtimeChannel && imagineChannelStatus === 'SUBSCRIBED') return;
      if (imagineRealtimeChannel) {
        supabaseClient.removeChannel(imagineRealtimeChannel);
        imagineRealtimeChannel = null;
      }
      imagineChannelStatus = '';
      imagineRealtimeChannel = supabaseClient
        .channel(`imagine-user-${currentUser.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'imagine_requests', filter: `user_id=eq.${currentUser.id}` }, payload => {
          if (payload.eventType === 'DELETE') {
            if (payload.old?.request_id) {
              imagineRequests.delete(payload.old.request_id);
              forcedVisibleImagineIds.delete(payload.old.request_id);
              if (viewingSingleImagineId === payload.old.request_id) viewingSingleImagineId = null;
            }
            renderImagineRequests();
            historyListDirty = true;
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
              renderChatHistoryList();
              historyListDirty = false;
            }
            return;
          }
          if (payload.new) {
            if (payload.eventType === 'INSERT' && !viewingSingleImagineId) {
              forcedVisibleImagineIds.add(payload.new.request_id);
            }
            upsertImagineRequest(payload.new);
          }
        })
        .subscribe(status => {
          imagineChannelStatus = status;
          if (status === 'SUBSCRIBED') loadImagineRequestsIfStale();
        });
    }

    function refreshImagineSendButton() {
      if (!document.body.classList.contains('imagine-mode')) return;
      const btn = document.getElementById('btnSend');
      const input = document.getElementById('promptInput');
      if (!btn) return;

      // Saat ada request pending: tombol jadi Batalkan (ikon kotak stop)
      if (imagineHasPending && !imagineBusy) {
        btn.disabled = false;
        btn.style.display = 'flex';
        btn.title = 'Batalkan generate';
        btn.setAttribute('data-mode', 'cancel');
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>';
        return;
      }

      btn.setAttribute('data-mode', 'send');
      btn.innerHTML = imagineBusy
        ? '<i class="fa-solid fa-circle-notch fa-spin" style="font-size:15px"></i>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';

      const blocked = imagineBusy || imagineHasPending;
      btn.disabled = blocked || !input || input.value.trim().length === 0;
      btn.style.display = 'flex';

      if (imagineBusy) btn.title = 'Mengirim...';
      else btn.title = 'Generate';
    }

    function setImagineBusy(busy) {
      imagineBusy = !!busy;
      refreshImagineSendButton();
    }

    async function cancelImaginePending() {
      if (!currentUser) return;
      // Hanya request yang masih antri / diproses (bukan yang sudah cancel/failed)
      const pending = [...imagineRequests.values()].filter(item => {
        const s = String(item.status || '');
        if (s !== 'queued' && s !== 'processing') return false;
        if (typeof item.result_url === 'string' && item.result_url.startsWith('cancel://')) return false;
        return true;
      });
      if (!pending.length) {
        imagineHasPending = false;
        refreshImagineSendButton();
        return;
      }

      showConfirmModal(
        'Generate yang anda buat sedang di proses latar belakang history. Apakah anda ingin membatalkan generate ini?',
        async () => {
          try {
            for (const item of pending) {
              // Pakai status "failed" + marker cancel:// agar lolos check constraint DB.
              // Worker akan baca marker ini dan kirim notif Telegram saat server nyala.
              const { data, error } = await supabaseClient
                .from('imagine_requests')
                .update({
                  status: 'failed',
                  result_url: 'cancel://pending',
                  completed_at: new Date().toISOString()
                })
                .eq('id', item.id)
                .in('status', ['queued', 'processing'])
                .select('*')
                .maybeSingle();
              if (error) throw error;
              if (data) upsertImagineRequest(data);
              else {
                item.status = 'failed';
                item.result_url = 'cancel://pending';
                upsertImagineRequest(item);
              }
            }
            imagineHasPending = [...imagineRequests.values()].some(i => {
              const s = String(i.status || '');
              return s === 'queued' || s === 'processing';
            });
            renderImagineRequests();
            refreshImagineSendButton();
          } catch (err) {
            console.error('Cancel imagine:', err);
            showWarningModal(err?.message || 'Gagal membatalkan. Coba lagi.', 'Gagal Batalkan');
          }
        },
        { title: 'Batalkan generate?', confirmText: 'Batalkan' }
      );
    }

    function loadImagineHistoryEntry(requestId) {
      if (!document.body.classList.contains('imagine-mode')) {
        document.body.classList.add('imagine-mode');
        setImagineNav('IMAGINE');
        closeAllInputSheets();
        closeModelSheet();
        clearImage();
        const input = document.getElementById('promptInput');
        if (input) { input.value = ''; input.style.height = ''; }
        setImagineMode(imagineMode, false);
        updateImaginePlaceholder();
        updateComposerButtons();
        connectImagineStream();
        loadImagineRequestsIfStale();
        playImagineGalleryVideos();
      }

      viewingSingleImagineId = requestId;
      forcedVisibleImagineIds.clear();
      renderImagineRequests();
      renderChatHistoryList();

      setTimeout(() => {
        const box = document.getElementById('imagineResults');
        if (box) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);

      if (window.innerWidth <= 768 && document.getElementById('sidebar').classList.contains('open')) toggleSidebar();
    }

    async function submitImagine() {
      const input = document.getElementById('promptInput');
      const prompt = input?.value.trim() || '';
      if (!prompt || imagineBusy || imagineHasPending) return;
      if (!currentUser) { openAuthSheet('login'); return; }

      // Cek limit free sebelum kirim
      const quota = getRemainingQuota(imagineMode);
      if (!quota.allowed) {
        const isVideo = imagineMode === 'VIDEO';
        const limitLabel = isVideo
          ? `${FREE_VIDEO_LIMIT} video / 45 menit`
          : `${FREE_IMAGE_LIMIT} gambar / 45 menit`;
        refreshImagineQuotaBar();
        showWarningModal(
          `Limit akun free sudah tercapai (${limitLabel}). Upgrade ke Premium untuk generate tanpa batas, atau tunggu reset otomatis dalam 45 menit`,
          'Limit Generate'
        );
        return;
      }

      try {
        setImagineBusy(true);

        viewingSingleImagineId = null;

        let mediaUrl = null;
        let mediaType = null;
        if (selectedImagineFile) {
          mediaType = String(selectedImagineFile.type || '').startsWith('video/') ? 'video' : 'image';
          mediaUrl = await uploadImagineMedia(selectedImagineFile);
        }

        const requestId = `REQ-${Date.now()}-${generateUUID().replace(/-/g, '').slice(0, 8).toUpperCase()}`;
        const { data, error } = await supabaseClient
          .from('imagine_requests')
          .insert([{
            request_id: requestId,
            user_id: String(currentUser.id),
            user_name: currentUser.username,
            mode: imagineMode,
            prompt,
            media_url: mediaUrl,
            media_type: mediaType,
            status: 'queued'
          }])
          .select('*')
          .single();

        if (error) throw error;

        forcedVisibleImagineIds.add(requestId);
        upsertImagineRequest(data);

        input.value = '';
        input.style.height = '';
        clearImage();
        renderImagineRequests();
        renderChatHistoryList();
        refreshImagineQuotaBar();
      } catch (err) {
        console.error('Imagine submit:', err);
        showWarningModal(err?.message || 'Gagal membuat request. Coba lagi.', 'Imagine Gagal');
      } finally {
        setImagineBusy(false);
        updateComposerButtons();
      }
    }

    function handlePlusButton() {
      if (document.body.classList.contains('imagine-mode')) {
        openImagineImagePicker();
        return;
      }
      toggleBottomSheet();
    }

    function openImagineImagePicker() {
      if (!currentUser) { openAuthSheet('login'); return; }
      const input = document.getElementById('imageInput');
      if (input) input.click();
    }

    function handleKeyDown(event) {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    }

    function autoResizeTextarea(element) {
      element.style.height = '';
      element.style.height = Math.min(element.scrollHeight, 150) + 'px';
      updateComposerButtons();
    }

    function compressImageFile(file, maxDimension = 1280, quality = 0.72) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            let { width, height } = img;
            if (width > maxDimension || height > maxDimension) {
              if (width > height) { height = Math.round(height * (maxDimension / width)); width = maxDimension; }
              else { width = Math.round(width * (maxDimension / height)); height = maxDimension; }
            }
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', quality));
          };
          img.onerror = () => reject(new Error('Gagal memuat gambar'));
          img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error('Gagal membaca file gambar'));
        reader.readAsDataURL(file);
      });
    }

    function renderMediaPreview() {
      updateComposerButtons();
      const wrapper = document.getElementById('imagePreviewWrapper');
      const list = document.getElementById('mediaPreviewList');
      if (!wrapper || !list) return;

      list.innerHTML = '';

      if (selectedImages.length) {
        const src = selectedImages[0];
        const item = document.createElement('div');
        item.className = 'media-preview-thumb';
        item.innerHTML = `
          <img src="${escapeHtml(src)}" alt="Foto" class="media-preview-thumb-media">
          <button type="button" class="media-preview-thumb-remove" aria-label="Hapus foto" title="Hapus foto">✕</button>
        `;
        item.querySelector('.media-preview-thumb-remove').addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          clearImage();
        });
        list.appendChild(item);
        wrapper.style.display = 'block';
        return;
      }

      if (selectedMediaKind === 'video' && (base64ImageData || selectedImagineObjectUrl || selectedVideoObjectUrl)) {
        const item = document.createElement('div');
        item.className = 'media-preview-thumb video-thumb';

        const video = document.createElement('video');
        video.className = 'media-preview-thumb-media';
        video.muted = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.setAttribute('aria-label', 'Preview video');
        video.src = selectedVideoObjectUrl || selectedImagineObjectUrl || base64ImageData;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'media-preview-thumb-remove';
        removeBtn.setAttribute('aria-label', 'Hapus video');
        removeBtn.title = 'Hapus video';
        removeBtn.textContent = '✕';
        removeBtn.addEventListener('click', (event) => {
          event.preventDefault();
          event.stopPropagation();
          clearImage();
        });

        item.appendChild(video);
        item.appendChild(removeBtn);
        list.appendChild(item);
        wrapper.style.display = 'block';
        try { video.load(); } catch (_) {}
        return;
      }

      wrapper.style.display = 'none';
    }

    async function handleImageSelect(event) {
      const input = event.target;
      const file = Array.from(input.files || []).find(f => f.type.startsWith('image/'));
      if (!file) { input.value = ''; return; }

      if (!currentUser) { input.value = ''; openAuthSheet('login'); return; }

      if (document.body.classList.contains('imagine-mode')) {
        try {
          selectedImagineFile = file;
          selectedMediaKind = 'image';
          selectedMediaMime = file.type || 'image/jpeg';
          try {
            if (selectedImagineObjectUrl) URL.revokeObjectURL(selectedImagineObjectUrl);
            selectedImagineObjectUrl = URL.createObjectURL(file);
          } catch (_) { selectedImagineObjectUrl = null; }
          selectedImages = selectedImagineObjectUrl ? [selectedImagineObjectUrl] : [];
          base64ImageData = null;
          renderMediaPreview();
        } catch (error) {
          showWarningModal('Gagal memproses gambar. Coba pilih gambar lain.', 'Upload Gambar Gagal');
        } finally {
          input.value = '';
        }
        return;
      }

      if (!currentSelectedModel || !currentSelectedModel.supports_vision) {
        input.value = '';
        showWarningModal('Model ini belum mendukung melihat foto. Silakan pilih model lain yang mendukung Vision terlebih dahulu.', 'Vision Belum Didukung');
        return;
      }

      try {
        const compressed = await compressImageFile(file);
        selectedImages = [compressed];
        base64ImageData = compressed;
        selectedMediaKind = 'image';
        selectedMediaMime = 'image/jpeg';
        renderMediaPreview();
      } catch (error) {
        showWarningModal('Gagal memproses foto. Coba pilih foto lain.', 'Upload Foto Gagal');
      } finally {
        input.value = '';
      }
    }

    async function handleVideoSelect(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!currentUser) { event.target.value = ''; openAuthSheet('login'); return; }

      if (document.body.classList.contains('imagine-mode')) {
        if (!file.type.startsWith('video/')) {
          showWarningModal('File yang dipilih bukan video.', 'Format Tidak Didukung');
          event.target.value = '';
          return;
        }
        const maxVideoSize = 50 * 1024 * 1024;
        if (file.size > maxVideoSize) {
          showWarningModal('Video terlalu besar. Maksimal 50 MB.', 'Video Terlalu Besar');
          event.target.value = '';
          return;
        }
        selectedImagineFile = file;
        selectedImages = [];
        base64ImageData = null;
        selectedMediaKind = 'video';
        selectedMediaMime = file.type || 'video/mp4';
        try {
          if (selectedImagineObjectUrl) URL.revokeObjectURL(selectedImagineObjectUrl);
          selectedImagineObjectUrl = URL.createObjectURL(file);
        } catch (_) { selectedImagineObjectUrl = null; }
        try {
          if (selectedVideoObjectUrl) { URL.revokeObjectURL(selectedVideoObjectUrl); activeVideoObjectUrls.delete(selectedVideoObjectUrl); }
          selectedVideoObjectUrl = URL.createObjectURL(file);
          activeVideoObjectUrls.add(selectedVideoObjectUrl);
        } catch (_) {}
        renderMediaPreview();
        event.target.value = '';
        return;
      }

      if (!currentSelectedModel || !currentSelectedModel.supports_vision) {
        event.target.value = '';
        showWarningModal('Model ini belum mendukung melihat video. Silakan pilih model lain yang mendukung Vision terlebih dahulu.', 'Vision Belum Didukung');
        return;
      }

      if (!file.type.startsWith('video/')) {
        showWarningModal('File yang dipilih bukan video.', 'Format Tidak Didukung');
        event.target.value = '';
        return;
      }

      const maxVideoSize = 50 * 1024 * 1024;
      if (file.size > maxVideoSize) {
        showWarningModal('Video terlalu besar. Maksimal 50 MB.', 'Video Terlalu Besar');
        event.target.value = '';
        return;
      }

      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target.result);
          reader.onerror = () => reject(new Error('Gagal membaca video'));
          reader.readAsDataURL(file);
        });

        selectedImages = [];
        base64ImageData = dataUrl;
        selectedMediaKind = 'video';
        selectedMediaMime = file.type || 'video/mp4';

        try {
          if (selectedVideoObjectUrl) { URL.revokeObjectURL(selectedVideoObjectUrl); activeVideoObjectUrls.delete(selectedVideoObjectUrl); }
          selectedVideoObjectUrl = URL.createObjectURL(file);
          activeVideoObjectUrls.add(selectedVideoObjectUrl);
        } catch (_) { selectedVideoObjectUrl = null; }

        renderMediaPreview();
      } catch (error) {
        showWarningModal('Gagal membaca video. Coba video lain.', 'Upload Video Gagal');
      } finally {
        event.target.value = '';
      }
    }

    async function handleGeneralFileSelect(event) {
      const files = Array.from(event.target.files || []);
      if (!files.length) return;

      const imageFiles = files.filter(f => f.type.startsWith('image/'));
      const videoFiles = files.filter(f => f.type.startsWith('video/'));

      if (imageFiles.length) await handleImageSelect({ target: { files: imageFiles, value: '' } });
      else if (videoFiles.length) await handleVideoSelect({ target: { files: [videoFiles[0]], value: '' } });
      else showWarningModal('Untuk saat ini, file yang dapat dikirim ke AI adalah gambar dan video.', 'File Tidak Didukung');

      event.target.value = '';
    }

    function clearImage() {
      base64ImageData = null;
      selectedImages = [];
      selectedImagineFile = null;
      selectedMediaKind = null;
      selectedMediaMime = null;
      if (selectedVideoObjectUrl) {
        try { URL.revokeObjectURL(selectedVideoObjectUrl); } catch (_) {}
        activeVideoObjectUrls.delete(selectedVideoObjectUrl);
        selectedVideoObjectUrl = null;
      }
      if (selectedImagineObjectUrl) {
        try { URL.revokeObjectURL(selectedImagineObjectUrl); } catch (_) {}
        selectedImagineObjectUrl = null;
      }

      const wrapper = document.getElementById('imagePreviewWrapper');
      const list = document.getElementById('mediaPreviewList');
      if (list) list.innerHTML = '';
      if (wrapper) wrapper.style.display = 'none';

      ['imageInput','cameraInput','fileInput','videoInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      updateComposerButtons();
    }

    function mediaVisionAllowed(kind) {
      if (!currentSelectedModel || !currentSelectedModel.supports_vision) {
        showWarningModal(
          kind === 'video'
            ? 'Model ini belum mendukung melihat video. Silakan pilih model yang mendukung Vision terlebih dahulu.'
            : 'Model ini belum mendukung melihat foto. Silakan pilih model yang mendukung Vision terlebih dahulu.',
          'Vision Belum Didukung'
        );
        return false;
      }
      return true;
    }

    function openFilePicker() {
      if (!currentUser) { closeAllInputSheets(); openAuthSheet('login'); return; }
      if (!mediaVisionAllowed('image')) return;
      closeAllInputSheets();
      document.getElementById('fileInput')?.click();
    }

    function openVideoPicker() {
      if (!currentUser) { closeAllInputSheets(); openAuthSheet('login'); return; }
      if (!mediaVisionAllowed('video')) return;
      closeAllInputSheets();
      document.getElementById('videoInput')?.click();
    }

    function openPhotoPicker() {
      if (!currentUser) { closeAllInputSheets(); openAuthSheet('login'); return; }
      if (!mediaVisionAllowed('image')) return;
      closeAllInputSheets();
      document.getElementById('imageInput')?.click();
    }

    function openCamera() {
      if (!currentUser) { closeAllInputSheets(); openAuthSheet('login'); return; }
      if (!mediaVisionAllowed('image')) return;
      closeAllInputSheets();
      document.getElementById('cameraInput')?.click();
    }

    function closeAllInputSheets() {
      const sheet = document.getElementById('bottomSheet');
      const overlay = document.getElementById('sheetOverlay');
      if (sheet) sheet.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    }

    async function sendMessage() {
      if (document.body.classList.contains('imagine-mode')) {
        const btn = document.getElementById('btnSend');
        if (btn && btn.getAttribute('data-mode') === 'cancel') {
          await cancelImaginePending();
          return;
        }
        await submitImagine();
        return;
      }
      const input = document.getElementById('promptInput');
      const text = input.value.trim();
      const container = document.getElementById('messagesContainer');
      const hasImage = selectedImages.length > 0;
      const hasVideo = selectedMediaKind === 'video' && !!base64ImageData;

      if (!text && !hasImage && !hasVideo) return;
      if (!currentSelectedModel) { showWarningModal('Belum ada model AI yang tersedia.', 'Model Belum Tersedia'); return; }
      if (isModelLocked(currentSelectedModel)) { showPremiumLockedInfo(); return; }
      if ((hasImage || hasVideo) && !currentSelectedModel.supports_vision) {
        showWarningModal('Model ini belum mendukung fitur Vision, jadi belum bisa melihat atau membaca foto/video yang kamu kirim. Silakan pilih model lain yang mendukung Vision.', 'Vision Belum Didukung');
        return;
      }
      if (hasVideo && String(currentSelectedModel.provider).toLowerCase() !== 'gemini') {
        showWarningModal('Model yang dipilih belum mendukung pengiriman video. Gunakan model Glux QSL 9 Express yang mendukung Vision untuk mengirim video.', 'Video Tidak Didukung');
        return;
      }

      if (container.querySelector('.welcome-screen')) container.innerHTML = '';

      const sentImages = hasImage ? [...selectedImages] : [];
      const sentMedia = hasVideo ? base64ImageData : (sentImages[0] || null);
      const sentMediaKind = hasVideo ? 'video' : (hasImage ? 'image' : null);
      const sentMediaMime = hasVideo ? selectedMediaMime : 'image/jpeg';

      const displayMedia = hasVideo
        ? { url: selectedVideoObjectUrl || sentMedia, data: sentMedia }
        : (hasImage ? sentImages : sentMedia);
      appendMessage('user', text, displayMedia, false, sentMediaKind);
      currentChatMessages.push({
        role: 'user',
        text: text,
        images: sentImages,
        image: sentImages[0] || null,
        video: hasVideo ? sentMedia : null,
        mediaKind: sentMediaKind,
        mediaMime: sentMediaMime
      });
      persistCurrentChat();
      updateTopExtrasBtn();

      input.value = '';
      input.style.height = '';
      clearImage();
      setLoadingState(true);
      abortController = new AbortController();
      showThinking();

      try {
        let aiResponseText = '';
        const reportKeyAttempt = (num, total) => {
          if (total > 1) console.log(`[AI] "${currentSelectedModel.name}" — mencoba API Key ke-${num} dari ${total}`);
          if (voiceModeActive && total > 1) setVoiceModeStatus(`Memuat Server ${num}/${total}...`, null);
        };
        if (String(currentSelectedModel.provider).toLowerCase() === 'gemini') {
          aiResponseText = await callGemini(currentSelectedModel, text, hasVideo ? sentMedia : sentImages, sentMediaKind, sentMediaMime, abortController.signal, reportKeyAttempt);
        } else {
          aiResponseText = await callOpenAICompatible(currentSelectedModel, currentChatMessages, abortController.signal, reportKeyAttempt);
        }
        removeThinking();
        const shownText = await appendMessage('ai', aiResponseText, null, true);
        currentChatMessages.push({ role: 'assistant', text: shownText });
        persistCurrentChat();
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('[AI] Gagal mendapat balasan:', error.message);
          const detail = error && error.message ? String(error.message) : 'Tidak diketahui';
          appendMessage('ai', `Server sedang mengalami gangguan. Mohon coba kembali beberapa saat lagi.\n\nDetail teknis: ${detail}`);
        }
      } finally {
        removeThinking();
        setLoadingState(false);
        abortController = null;
        releaseSentVideoPayloads();
      }
    }

    // Video yang sudah terkirim ke AI tidak dipakai lagi (tiap kirim video berdiri sendiri),
    // jadi data base64-nya dilepas supaya memori HP tidak menumpuk.
    function releaseSentVideoPayloads() {
      currentChatMessages.forEach(m => {
        if (m.video) { m.video = null; m.videoOmitted = true; }
      });
    }

    function parseApiKeys(raw) {
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(k => String(k).trim()).filter(Boolean);
      } catch (_) {}
      return [String(raw).trim()].filter(Boolean);
    }

    async function callWithKeyFallback(modelConfig, callFn, onAttempt) {
      const keys = parseApiKeys(modelConfig.api_key);
      if (!keys.length) throw new Error('API key belum diisi untuk model ini.');
      let lastError = null;
      for (let i = 0; i < keys.length; i++) {
        if (typeof onAttempt === 'function') onAttempt(i + 1, keys.length);
        try {
          return await callFn(keys[i]);
        } catch (err) {
          if (err.name === 'AbortError') throw err;
          lastError = err;
          console.warn(`[AI] API Key ke-${i + 1}/${keys.length} gagal:`, err.message);
        }
      }
      throw lastError || new Error('Semua API key untuk model ini gagal dipakai.');
    }

    async function callGemini(modelConfig, prompt, mediaData, mediaKind, mediaMime, signal, onAttempt) {
      const endpoint = modelConfig.endpoint.replace(/\/+$/, '');
      const modelId = modelConfig.model_id.replace(/^models\//, '').replace(/\/+$/, '');
      const parts = [];
      if (prompt) parts.push({ text: prompt });

      const mediaList = Array.isArray(mediaData) ? mediaData : (mediaData ? [mediaData] : []);
      for (const item of mediaList) {
        const mimeMatch = String(item).match(/^data:([^;]+);base64,/);
        const mimeType = mediaMime || (mimeMatch ? mimeMatch[1] : null);
        const data = String(item).includes(',') ? String(item).split(',')[1] : item;
        if (!mimeType) throw new Error('MIME type media tidak ditemukan.');
        parts.push({ inline_data: { mime_type: mimeType, data } });
      }
      if (!parts.length) parts.push({ text: '(pesan kosong)' });

      return await callWithKeyFallback(modelConfig, async (apiKey) => {
        const url = `${endpoint}/${modelId}:generateContent?key=` + encodeURIComponent(apiKey);
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal,
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: 'ATURAN: Jawab sesuai pertanyaan user, jangan belok topik. Hitungan langsung dihitung. Ngobrol santai/curhat/basa-basi (misal "gabut", "capek", cerita perasaan) BUKAN pertanyaan tidak jelas — tanggapi natural kayak teman ngobrol asli, jangan nanya balik "maksud Anda apa?" atau "apakah ada yang bisa saya bantu?". Klarifikasi cuma buat tugas yang infonya beneran kurang. Pakai bahasa santai natural, ikutin gaya bahasa user. Jangan bahas pembuat AI kecuali user bertanya. Namamu Pretvfx-AI (tulis persis begitu). Jika ditanya kamu siapa / namamu siapa, jawab singkat: Saya adalah Pretvfx-AI buatan Zain Suryo Negoro. PENTING: kalau user lanjut bertanya soal orangnya (misal: dia siapa, dia itu siapa, siapa itu, beliau siapa, siapa pembuatmu, siapa Zain Suryo Negoro), itu artinya menanyakan Zain Suryo Negoro, BUKAN menanyakan dirimu. Jawab bahwa Zain Suryo Negoro adalah programmer/developer yang membuat dan mengembangkan Pretvfx-AI, ceritakan pakai bahasamu sendiri, jangan mengulang kalimat dibuat oleh Zain Suryo Negoro dan jangan memperkenalkan dirimu lagi. Jangan mengarang detail pribadi lain tentang dia yang tidak kamu tahu. Jika ditanya pembuat: Zain Suryo Negoro (Developer AI). Jangan klaim dibuat Google/OpenAI/Anthropic.\n\n' + getModeStyleInstruction() }] },
            contents: [{ role: 'user', parts }]
          })
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json?.error?.message || `HTTP ${response.status}`);
        return json?.candidates?.[0]?.content?.parts?.filter(p => typeof p.text === 'string')?.map(p => p.text)?.join('') || '';
      }, onAttempt);
    }

    function trimHistoryToLastTurns(history, maxTurns = 3) {
      const maxMessages = maxTurns * 2;
      return history.length > maxMessages ? history.slice(-maxMessages) : history;
    }

    async function callOpenAICompatible(modelConfig, history, signal, onAttempt) {
      const trimmedHistory = trimHistoryToLastTurns(history, 3);

      function buildMessages(includeImages) {
        return [
          { role: 'system', content: 'ATURAN WAJIB: Jawab sesuai pertanyaan user, jangan belok topik. Matematika langsung dihitung. Ngobrol santai/curhat/basa-basi (misal "gabut", "capek", cerita perasaan) BUKAN pertanyaan tidak jelas — tanggapi natural kayak teman ngobrol asli, jangan nanya balik "maksud Anda apa?" atau "apakah ada yang bisa saya bantu?". Klarifikasi cuma buat tugas yang infonya beneran kurang. Pakai bahasa santai natural, ikutin gaya bahasa user. Jangan bahas pembuat AI kecuali user bertanya. Namamu Pretvfx-AI (tulis persis begitu). Jika ditanya kamu siapa / namamu siapa, jawab singkat: Saya adalah Pretvfx-AI buatan Zain Suryo Negoro. PENTING: kalau user lanjut bertanya soal orangnya (misal: dia siapa, dia itu siapa, siapa itu, beliau siapa, siapa pembuatmu, siapa Zain Suryo Negoro), itu artinya menanyakan Zain Suryo Negoro, BUKAN menanyakan dirimu. Jawab bahwa Zain Suryo Negoro adalah programmer/developer yang membuat dan mengembangkan Pretvfx-AI, ceritakan pakai bahasamu sendiri, jangan mengulang kalimat dibuat oleh Zain Suryo Negoro dan jangan memperkenalkan dirimu lagi. Jangan mengarang detail pribadi lain tentang dia yang tidak kamu tahu. Jika ditanya pembuat AI: Zain Suryo Negoro (Developer AI). Jangan klaim dibuat Google/OpenAI/Anthropic.' },
          { role: 'system', content: getModeStyleInstruction() },
          ...trimmedHistory.map(msg => {
            const role = msg.role === 'assistant' ? 'assistant' : 'user';
            let textContent = msg.text || '';
            if (!textContent && msg.mediaOmitted) textContent = '[Pengguna mengirim foto/video di pesan ini, tapi tidak tersimpan di riwayat]';
            const images = Array.isArray(msg.images) ? msg.images : (msg.image ? [msg.image] : []);

            if (!includeImages) {
              if (images.length && !textContent) textContent = '[Pengguna mengirim gambar/video di pesan ini, tapi model yang sedang aktif belum bisa memprosesnya]';
              return { role, content: textContent };
            }

            if (images.length) {
              const content = [];
              if (textContent) content.push({ type: 'text', text: textContent });
              images.forEach(image => content.push({ type: 'image_url', image_url: { url: image } }));
              return { role, content };
            }
            return { role, content: textContent };
          })
        ];
      }

      async function requestOnce(apiKey, includeImages) {
        const response = await fetch(modelConfig.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          signal,
          body: JSON.stringify({ model: modelConfig.model_id, messages: buildMessages(includeImages) })
        });
        const json = await response.json();
        if (!response.ok) {
          const detail = json?.error?.metadata?.raw || json?.error?.message || `HTTP ${response.status}`;
          throw new Error(detail);
        }
        return json?.choices?.[0]?.message?.content || '';
      }

      const modelSupportsVision = !!modelConfig.supports_vision;
      const historyHasMedia = trimmedHistory.some(msg => (Array.isArray(msg.images) && msg.images.length) || msg.image);

      return await callWithKeyFallback(modelConfig, async (apiKey) => {
        try {
          return await requestOnce(apiKey, modelSupportsVision);
        } catch (err) {
          if (modelSupportsVision && historyHasMedia) {
            console.warn('[AI] Request dengan gambar gagal, coba ulang tanpa gambar:', err.message);
            try { return await requestOnce(apiKey, false); } catch (_) { throw err; }
          }
          throw err;
        }
      }, onAttempt);
    }

    let activeTypingStop = null;

    window.addEventListener('beforeunload', () => {
      activeVideoObjectUrls.forEach(url => { try { URL.revokeObjectURL(url); } catch (_) {} });
      activeVideoObjectUrls.clear();
    });

    function appendMessage(sender, text, media = null, animate = false, mediaKind = null, options = {}) {
      const container = document.getElementById('messagesContainer');
      const msgDiv = document.createElement('div');
      const shouldAnimate = animate && sender === 'ai' && !!text;
      msgDiv.className = `message ${sender}${shouldAnimate ? ' is-typing' : ''}${options.noAnim ? ' no-anim' : ''}`;

      let mediaHtml = '';
      let videoDisplayUrl = null;
      if (Array.isArray(media)) {
        mediaHtml = `<div class="message-media-grid">${media.map(src => `<img src="${escapeHtml(src)}" class="message-img" alt="Uploaded Image">`).join('')}</div>`;
      } else if (media) {
        if (mediaKind === 'video') {
          videoDisplayUrl = (media && typeof media === 'object' && media.url) ? media.url : media;
          mediaHtml = `<div class="message-video-wrap" data-video-placeholder="1"></div>`;
        } else {
          mediaHtml = `<img src="${escapeHtml(media)}" class="message-img" alt="Uploaded Image">`;
        }
      }

      // Riwayat dari Supabase tidak menyimpan foto/video: tampilkan penanda kecil saja
      if (!mediaHtml && options.mediaOmitted) {
        const isVid = options.mediaOmitted === 'video';
        mediaHtml = `<div class="message-media-omitted"><i class="fa-solid ${isVid ? 'fa-video' : 'fa-image'}"></i> ${isVid ? 'Video' : 'Foto'} tidak disimpan di riwayat</div>`;
      }

      const parsedText = shouldAnimate ? '' : renderMessageHtml(text);
      const contentHtml = (!text && options.mediaOmitted) ? '' : `<div class="message-content">${parsedText}</div>`;
      msgDiv.innerHTML = `
        ${mediaHtml}
        ${contentHtml}
        <div class="message-actions">
          ${sender === 'ai' ? `
            <button class="action-link" onclick="copyMessageContent(this)" title="Salin teks"><i class="fa-regular fa-copy"></i><span>Salin</span></button>
            <button class="action-link" onclick="speakMessage(this)" title="Bacakan suara"><i class="fa-solid fa-volume-high"></i><span>Suara</span></button>
            <button class="action-link feedback-btn" onclick="giveFeedback(this, 'like')" title="Suka"><i class="fa-regular fa-thumbs-up"></i></button>
            <button class="action-link feedback-btn" onclick="giveFeedback(this, 'dislike')" title="Tidak Suka"><i class="fa-regular fa-thumbs-down"></i></button>
          ` : ''}
        </div>
      `;

      if (mediaKind === 'video' && videoDisplayUrl) {
        const wrap = msgDiv.querySelector('[data-video-placeholder]');
        if (wrap) {
          const video = document.createElement('video');
          video.className = 'message-video';
          video.controls = true;
          video.playsInline = true;
          video.preload = 'metadata';
          video.src = videoDisplayUrl;

          const play = document.createElement('span');
          play.className = 'message-video-play';
          play.innerHTML = '<i class="fa-solid fa-play"></i>';

          video.addEventListener('loadedmetadata', () => { video.style.maxWidth = '100%'; }, { once: true });
          video.addEventListener('error', () => { wrap.setAttribute('data-video-error', '1'); }, { once: true });
          video.addEventListener('play', () => { play.style.display = 'none'; });
          video.addEventListener('pause', () => { if (!video.ended) play.style.display = 'flex'; });
          play.addEventListener('click', () => { video.play().catch(() => {}); });

          wrap.appendChild(video);
          wrap.appendChild(play);
        }
      }

      container.appendChild(msgDiv);
      if (!options.skipScroll) container.scrollTop = container.scrollHeight;
      if (shouldAnimate) return typeWriterEffect(msgDiv, text);
      return Promise.resolve(text);
    }

    function typeWriterEffect(msgDiv, fullText) {
      return new Promise(resolve => {
        const contentEl = msgDiv.querySelector('.message-content');
        const container = document.getElementById('messagesContainer');
        const chunks = fullText.match(/\S+\s*/g) || [fullText];
        const TOTAL_STEPS = Math.min(chunks.length, 26);
        const chunksPerTick = Math.max(1, Math.ceil(chunks.length / TOTAL_STEPS));
        const TICK_DELAY = 42;
        let chunkIndex = 0;
        let done = false;

        contentEl.classList.add('glitching');

        function shownTextUpTo(count) { return chunks.slice(0, count).join(''); }

        function finalize(count) {
          if (done) return;
          done = true;
          if (activeTypingStop === stopHandler) activeTypingStop = null;
          const shownText = shownTextUpTo(count);
          msgDiv.classList.remove('is-typing');
          contentEl.classList.remove('glitching');
          contentEl.innerHTML = renderMessageHtml(shownText);
          container.scrollTop = container.scrollHeight;
          resolve(shownText);
        }

        function stopHandler() { finalize(chunkIndex); }
        activeTypingStop = stopHandler;

        function tick() {
          if (done) return;
          chunkIndex += chunksPerTick;
          if (chunkIndex >= chunks.length) { finalize(chunks.length); return; }
          contentEl.innerHTML = renderMessageHtml(shownTextUpTo(chunkIndex)) + '<span class="typing-cursor"></span>';
          container.scrollTop = container.scrollHeight;
          setTimeout(tick, TICK_DELAY);
        }
        tick();
      });
    }

    function escapeHtml(text) {
      return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    function renderMathToken(rawFormula, displayMode) {
      if (typeof katex === 'undefined') return null;
      try { return katex.renderToString(rawFormula.trim(), { throwOnError: false, displayMode }); } catch (error) { return null; }
    }

    function renderMessageHtml(text) {
      if (!text) return '';

      const mathTokens = [];
      function extractMath(source, pattern, displayMode) {
        return source.replace(pattern, (match, formula) => {
          const rendered = renderMathToken(formula, displayMode);
          if (rendered === null) return match;
          const token = `@@KMATH${mathTokens.length}@@`;
          mathTokens.push(rendered);
          return token;
        });
      }

      let working = text;
      working = extractMath(working, /\\\[([\s\S]+?)\\\]/g, true);
      working = extractMath(working, /\$\$([\s\S]+?)\$\$/g, true);
      working = extractMath(working, /\\\(([\s\S]+?)\\\)/g, false);

      let html = (typeof marked === 'undefined') ? escapeHtml(working) : marked.parse(working);

      html = html.replace(/<table>/g, '<div class="table-scroll"><table>').replace(/<\/table>/g, '</table></div>');
      html = html.replace(/<pre><code([^>]*)>([\s\S]*?)<\/code><\/pre>/g, (match, attrs, codeHtml) => {
        const dataCode = encodeURIComponent(codeHtml);
        return `<div class="code-block-wrap"><button class="code-copy-btn" type="button" data-code="${dataCode}" onclick="copyCodeBlock(this)" title="Salin kode" aria-label="Salin kode"><i class="fa-regular fa-copy"></i></button><pre><code${attrs}>${codeHtml}</code></pre></div>`;
      });

      mathTokens.forEach((renderedHtml, i) => { html = html.split(`@@KMATH${i}@@`).join(renderedHtml); });

      return html;
    }

    let bubbleCopySource = null;
    let bubbleCopyTimer = null;

    async function copyTextSafely(text) {
      const value = String(text || '');
      if (!value) return false;
      try { await navigator.clipboard.writeText(value); return true; }
      catch (error) {
        try {
          const ta = document.createElement('textarea');
          ta.value = value;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          const ok = document.execCommand('copy');
          ta.remove();
          return ok;
        } catch (fallbackError) { return false; }
      }
    }

    function showBubbleCopyPopup(messageEl) {
      const popup = document.getElementById('bubbleCopyPopup');
      if (!popup || !messageEl) return;

      const contentEl = messageEl.querySelector('.message-content');
      if (!contentEl) return;
      const text = contentEl.innerText.trim();
      if (!text) return;

      bubbleCopySource = text;
      const rect = contentEl.getBoundingClientRect();
      const popupWidth = 84;
      const popupHeight = 40;
      const gap = 7;

      let left = rect.left + (rect.width / 2) - (popupWidth / 2);
      left = Math.max(8, Math.min(left, window.innerWidth - popupWidth - 8));

      let top = rect.top - popupHeight - gap;
      if (top < 8) top = Math.min(window.innerHeight - popupHeight - 8, rect.bottom + gap);

      popup.style.left = `${left}px`;
      popup.style.top = `${top}px`;
      popup.classList.add('show');
      popup.setAttribute('aria-hidden', 'false');

      const label = document.getElementById('bubbleCopyLabel');
      if (label) label.textContent = 'Salin';

      clearTimeout(bubbleCopyTimer);
      bubbleCopyTimer = setTimeout(hideBubbleCopyPopup, 2200);
    }

    function hideBubbleCopyPopup() {
      const popup = document.getElementById('bubbleCopyPopup');
      if (!popup) return;
      popup.classList.remove('show');
      popup.setAttribute('aria-hidden', 'true');
    }

    async function copyPopupText() {
      const ok = await copyTextSafely(bubbleCopySource);
      const label = document.getElementById('bubbleCopyLabel');
      const icon = document.querySelector('#bubbleCopyPopup i');

      if (ok) { if (label) label.textContent = 'Tersalin!'; if (icon) icon.className = 'fa-solid fa-check'; }
      else { if (label) label.textContent = 'Gagal menyalin'; }

      clearTimeout(bubbleCopyTimer);
      bubbleCopyTimer = setTimeout(() => {
        if (label) label.textContent = 'Salin';
        if (icon) icon.className = 'fa-regular fa-copy';
        hideBubbleCopyPopup();
      }, 1400);
    }

    async function copyMessageContent(button) {
      const message = button.closest('.message');
      const contentEl = message ? message.querySelector('.message-content') : null;
      const text = contentEl ? contentEl.innerText.trim() : '';
      if (!text) return;

      const icon = button.querySelector('i');
      const label = button.querySelector('span');
      const originalIcon = icon ? icon.className : '';
      const originalLabel = label ? label.textContent : '';

      const ok = await copyTextSafely(text);
      if (icon) icon.className = ok ? 'fa-solid fa-check' : 'fa-solid fa-xmark';
      if (label) label.textContent = ok ? 'Tersalin!' : 'Gagal';

      clearTimeout(button._copyTimer);
      button._copyTimer = setTimeout(() => {
        if (icon) icon.className = originalIcon;
        if (label) label.textContent = originalLabel;
      }, 1400);
    }

    async function copyCodeBlock(button) {
      if (!button) return;
      let code = '';
      try { code = decodeURIComponent(button.dataset.code || ''); } catch (error) { code = button.closest('.code-block-wrap')?.querySelector('code')?.innerText || ''; }
      const codeEl = button.closest('.code-block-wrap')?.querySelector('code');
      if (codeEl) code = codeEl.innerText;

      const ok = await copyTextSafely(code);
      const original = button.innerHTML;
      button.classList.toggle('copied', ok);
      button.innerHTML = ok ? '<i class="fa-solid fa-check"></i>' : '<i class="fa-solid fa-xmark"></i>';

      clearTimeout(button._copyTimer);
      button._copyTimer = setTimeout(() => {
        button.innerHTML = original;
        button.classList.remove('copied');
      }, 1400);
    }

    document.addEventListener('click', (event) => {
      const content = event.target.closest('.message-content');
      const popup = event.target.closest('#bubbleCopyPopup');

      if (popup) return;
      if (content) {
        if (event.target.closest('.code-block-wrap')) return;
        const message = content.closest('.message');
        if (message && message.classList.contains('user')) showBubbleCopyPopup(message);
        return;
      }
      hideBubbleCopyPopup();
    });

    window.addEventListener('resize', hideBubbleCopyPopup);
    window.addEventListener('scroll', hideBubbleCopyPopup, true);

    function stopGenerating() {
      if (abortController) abortController.abort();
      if (activeTypingStop) activeTypingStop();
      setLoadingState(false);
    }

    function setLoadingState(isLoading) {
      if (document.body.classList.contains('imagine-mode')) { setImagineBusy(isLoading); return; }
      document.getElementById('btnStop').style.display = isLoading ? 'flex' : 'none';
      if (isLoading) {
        document.getElementById('btnSend').style.display = 'none';
        const voiceBtn = document.getElementById('btnVoiceMode');
        if (voiceBtn) voiceBtn.style.display = 'none';
      } else {
        updateComposerButtons();
      }
    }

    function showProjectInfo() { showWarningModal('Fitur proyek belum dikonfigurasi.', 'Info'); }
    function showToolsInfo() { showWarningModal('Akses alat masih mengikuti konfigurasi Admin Control.', 'Info'); }

    function handleModelSheetNav() {
      if (viewingOtherModels) toggleOtherModels();
      else toggleModelSheet();
    }

    function updateModelSheetNav() {
      const btn = document.getElementById('modelSheetNavBtn');
      const icon = document.getElementById('modelSheetNavIcon');
      if (!btn || !icon) return;

      if (viewingOtherModels) {
        btn.title = 'Kembali';
        icon.innerHTML = '<polyline points="15 18 9 12 15 6"></polyline>';
      } else {
        btn.title = 'Tutup';
        icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
      }
    }

    function toggleOtherModels() {
      viewingOtherModels = !viewingOtherModels;
      renderModelList();
      updateModelSheetNav();

      const btn = document.querySelector('.other-models-button');
      const researchContainer = document.getElementById('researchSettingContainer');

      if (viewingOtherModels) {
        if (btn) btn.style.display = 'none';
        if (researchContainer) researchContainer.style.display = 'none';
      } else {
        if (btn) btn.style.display = 'flex';
        if (researchContainer) researchContainer.style.display = 'flex';
      }
    }

    function toggleWebSearch() {
      const checkbox = document.getElementById('webSearchToggle');
      checkbox.checked = !checkbox.checked;
      webSearchEnabled = checkbox.checked;
    }

    function showThinking() {
      const container = document.getElementById('messagesContainer');
      const thinking = document.createElement('div');
      thinking.className = 'message ai';
      thinking.id = 'thinkingMessage';
      thinking.innerHTML = `
        <div class="ai-thinking">
          <div class="thinking-icon"></div>
          <span>AI sedang berpikir</span>
          <div class="thinking-dots"><span></span><span></span><span></span></div>
        </div>
      `;
      container.appendChild(thinking);
      container.scrollTop = container.scrollHeight;
    }

    function removeThinking() {
      const thinking = document.getElementById('thinkingMessage');
      if (thinking) thinking.remove();
    }

    let voiceRecognition = null;
    let isVoiceRecording = false;
    let voiceBaseText = '';

    function getSpeechRecognitionAPI() { return window.SpeechRecognition || window.webkitSpeechRecognition || null; }

    function setupVoiceRecognition() {
      const SpeechRecognitionAPI = getSpeechRecognitionAPI();
      if (!SpeechRecognitionAPI) return null;

      const rec = new SpeechRecognitionAPI();
      rec.lang = 'id-ID';
      rec.continuous = false;
      rec.interimResults = true;

      rec.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) transcript += event.results[i][0].transcript;
        const input = document.getElementById('promptInput');
        if (!input) return;
        input.value = (voiceBaseText + ' ' + transcript).trim();
        autoResizeTextarea(input);
      };

      rec.onerror = (event) => {
        isVoiceRecording = false;
        updateMicButtonState();
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') showWarningModal('Izin mikrofon ditolak. Aktifkan izin mikrofon untuk browser/app ini di pengaturan HP.', 'Izin Mikrofon Ditolak');
      };

      rec.onend = () => { isVoiceRecording = false; updateMicButtonState(); };
      return rec;
    }

    function updateMicButtonState() {
      const btn = document.getElementById('btnMic');
      if (!btn) return;
      btn.classList.toggle('recording', isVoiceRecording);
      btn.title = isVoiceRecording ? 'Berhenti merekam' : 'Voice Input';
    }

    function toggleVoiceInput() {
      if (!getSpeechRecognitionAPI()) { showWarningModal('Input suara tidak didukung di browser/perangkat ini. Coba pakai Chrome versi terbaru.', 'Tidak Didukung'); return; }
      if (!voiceRecognition) voiceRecognition = setupVoiceRecognition();
      if (!voiceRecognition) return;

      if (isVoiceRecording) { voiceRecognition.stop(); return; }

      const input = document.getElementById('promptInput');
      voiceBaseText = input ? input.value.trim() : '';

      try { voiceRecognition.start(); isVoiceRecording = true; updateMicButtonState(); } catch (error) {}
    }


    function openProUpgradeModal() {
      const el = document.getElementById('proUpgradeOverlay');
      if (el) el.classList.add('show');
    }
    function closeProUpgradeModal() {
      const el = document.getElementById('proUpgradeOverlay');
      if (el) el.classList.remove('show');
    }

    function updateComposerButtons() {
      const input = document.getElementById('promptInput');
      const btnSend = document.getElementById('btnSend');
      const btnVoice = document.getElementById('btnVoiceMode');
      const btnStop = document.getElementById('btnStop');
      if (!input || !btnSend || !btnVoice || !btnStop) return;

      if (document.body.classList.contains('imagine-mode')) {
        btnStop.style.display = 'none';
        btnVoice.style.display = 'none';
        btnSend.style.display = 'flex';
        refreshImagineSendButton();
        return;
      }

      btnSend.disabled = false;
      btnSend.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';

      if (btnStop.style.display === 'flex') return;

      const hasText = input.value.trim().length > 0;
      const hasMedia = selectedImages.length > 0 || (selectedMediaKind === 'video' && !!base64ImageData);
      const isEmpty = !hasText && !hasMedia;

      btnSend.style.display = isEmpty ? 'none' : 'flex';
      btnVoice.style.display = isEmpty ? 'flex' : 'none';
    }

    function loadVoicesOnce() {
      if (!('speechSynthesis' in window)) return;
      speechSynthesis.getVoices();
      speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
    }

    function pickSmoothVoice() {
      if (!('speechSynthesis' in window)) return null;
      const voices = speechSynthesis.getVoices();
      if (!voices.length) return null;
      const isID = v => v.lang === 'id-ID' || v.lang.toLowerCase().startsWith('id');
      const isPremium = v => /neural|wavenet|natural|enhanced|premium|plus/i.test(v.name);
      return voices.find(v => isID(v) && isPremium(v)) || voices.find(v => isID(v) && !/compact/i.test(v.name)) || voices.find(isID) || voices.find(isPremium) || voices[0] || null;
    }

    let voiceModeActive = false;
    let voiceModeMuted = false;
    let voiceModeSpeaking = false;
    let voiceModeRecognition = null;
    let voiceModeSilentCtx = null;
    let voiceModeSilentOsc = null;

    function setNativeVoiceMode(active) {
      try {
        if (!window.AndroidTTS) return false;
        if (typeof window.AndroidTTS.setVoiceMode === 'function') { window.AndroidTTS.setVoiceMode(!!active); return true; }
        if (typeof window.AndroidTTS.muteSystemSounds === 'function') { window.AndroidTTS.muteSystemSounds(!!active); return true; }
        if (typeof window.AndroidTTS.muteBeep === 'function') { window.AndroidTTS.muteBeep(!!active); return true; }
        if (typeof window.AndroidTTS.setMuteBeep === 'function') { window.AndroidTTS.setMuteBeep(!!active); return true; }
      } catch (e) {}
      return false;
    }

    function startSilentAudioFocus() {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        if (!voiceModeSilentCtx) {
          voiceModeSilentCtx = new AC();
          const osc = voiceModeSilentCtx.createOscillator();
          const gain = voiceModeSilentCtx.createGain();
          gain.gain.value = 0.00001;
          osc.frequency.value = 20;
          osc.connect(gain);
          gain.connect(voiceModeSilentCtx.destination);
          osc.start();
          voiceModeSilentOsc = osc;
        }
        if (voiceModeSilentCtx.state === 'suspended') voiceModeSilentCtx.resume().catch(() => {});
      } catch (_) {}
    }

    function stopSilentAudioFocus() {
      try {
        if (voiceModeSilentOsc) { try { voiceModeSilentOsc.stop(); } catch (_) {} voiceModeSilentOsc = null; }
        if (voiceModeSilentCtx) { try { voiceModeSilentCtx.close(); } catch (_) {} voiceModeSilentCtx = null; }
      } catch (_) {}
    }

    function openVoiceMode() {
      if (!getSpeechRecognitionAPI()) { showWarningModal('Voice Mode butuh dukungan pengenalan suara (Speech Recognition). Coba pakai Chrome versi terbaru.', 'Voice Mode Tidak Didukung'); return; }
      const overlay = document.getElementById('voiceModeOverlay');
      if (!overlay) return;

      voiceModeActive = true;
      voiceModeMuted = false;
      voiceModeProcessing = false;
      voiceModeCooldownUntil = 0;
      voiceModeLastSent = '';
      updateVoiceModeMuteButton();
      setNativeVoiceMode(true);
      startSilentAudioFocus();
      overlay.classList.add('show');
      setTimeout(() => { if (voiceModeActive && !voiceModeMuted) startVoiceModeListening(); }, 80);
    }

    function closeVoiceMode() {
      voiceModeActive = false;
      voiceModeSpeaking = false;
      voiceModeProcessing = false;
      voiceModeCooldownUntil = 0;
      voiceModeLastSent = '';
      clearVoiceModeRestartTimer();

      const overlay = document.getElementById('voiceModeOverlay');
      if (overlay) overlay.classList.remove('show', 'listening', 'speaking');

      setTimeout(() => {
        stopVoiceRecognitionClean();
        stopAllSpeech();
        setNativeVoiceMode(false);
        stopSilentAudioFocus();
      }, 0);
    }

    function setVoiceModeStatus(text, mode) {
      const status = document.getElementById('voiceModeStatus');
      const overlay = document.getElementById('voiceModeOverlay');
      if (status) status.textContent = text;
      if (overlay) {
        overlay.classList.remove('listening', 'speaking');
        if (mode) overlay.classList.add(mode);
      }
    }

    let voiceModeProcessing = false;
    let voiceModeCooldownUntil = 0;
    let voiceModeLastSent = '';
    let voiceModeRestartTimer = null;

    function clearVoiceModeRestartTimer() {
      if (voiceModeRestartTimer) { clearTimeout(voiceModeRestartTimer); voiceModeRestartTimer = null; }
    }

    function stopVoiceRecognitionClean() {
      clearVoiceModeRestartTimer();
      const rec = voiceModeRecognition;
      voiceModeRecognition = null;
      if (!rec) return;
      try {
        rec.onend = null;
        rec.onresult = null;
        rec.onerror = null;
        if (typeof rec.abort === 'function') { try { rec.abort(); } catch (_) {} }
        try { rec.stop(); } catch (_) {}
      } catch (_) {}
    }

    function normalizeVoiceText(t) { return String(t || '').replace(/\s+/g, ' ').trim(); }

    function isDuplicateVoiceText(a, b) {
      a = normalizeVoiceText(a).toLowerCase();
      b = normalizeVoiceText(b).toLowerCase();
      if (!a || !b) return false;
      if (a === b) return true;
      if (a.length >= 6 && b.includes(a)) return true;
      if (b.length >= 6 && a.includes(b)) return true;
      const words = a.split(' ').filter(Boolean);
      if (words.length >= 4) { const uniq = new Set(words); if (uniq.size <= 2) return true; }
      return false;
    }

    function isGarbageVoiceText(t) {
      t = normalizeVoiceText(t);
      if (!t || t.length < 2) return true;
      const words = t.toLowerCase().split(/\s+/).filter(Boolean);
      if (words.length >= 5) { const uniq = new Set(words); if (uniq.size / words.length < 0.4) return true; }
      return false;
    }

    function startVoiceModeListening() {
      if (!voiceModeActive || voiceModeMuted || voiceModeSpeaking || voiceModeProcessing) return;
      if (Date.now() < voiceModeCooldownUntil) {
        clearVoiceModeRestartTimer();
        voiceModeRestartTimer = setTimeout(() => startVoiceModeListening(), Math.max(200, voiceModeCooldownUntil - Date.now()));
        return;
      }
      const SpeechRecognitionAPI = getSpeechRecognitionAPI();
      if (!SpeechRecognitionAPI) return;
      if (voiceModeRecognition) return;

      const rec = new SpeechRecognitionAPI();
      rec.lang = 'id-ID';
      rec.continuous = false;
      rec.interimResults = true;
      rec.maxAlternatives = 1;

      let bestText = '';
      let sent = false;

      function maybeSend(text) {
        if (sent) return;
        text = normalizeVoiceText(text);
        if (!text || text.length < 2) return;
        if (isGarbageVoiceText(text)) return;
        if (!voiceModeActive || voiceModeSpeaking || voiceModeMuted || voiceModeProcessing) return;
        if (isDuplicateVoiceText(text, voiceModeLastSent)) return;
        sent = true;
        stopVoiceRecognitionClean();
        voiceModeLastSent = text;
        voiceModeSendToAI(text);
      }

      rec.onresult = (event) => {
        if (!voiceModeActive || voiceModeMuted || voiceModeSpeaking || voiceModeProcessing || sent) return;
        let interim = '';
        let finalText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const piece = (result[0] && result[0].transcript) ? result[0].transcript : '';
          if (!piece) continue;
          if (result.isFinal) finalText += piece + ' ';
          else interim += piece;
        }
        finalText = normalizeVoiceText(finalText);
        interim = normalizeVoiceText(interim);
        if (finalText) bestText = finalText;
        else if (interim) bestText = interim;
        if (finalText) maybeSend(finalText);
      };

      rec.onerror = (event) => {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          showWarningModal('Izin mikrofon ditolak. Aktifkan izin mikrofon untuk browser/app ini di pengaturan HP.', 'Izin Mikrofon Ditolak');
          closeVoiceMode();
          return;
        }
        if (voiceModeRecognition === rec) voiceModeRecognition = null;
        if (voiceModeActive && !voiceModeMuted && !voiceModeSpeaking && !voiceModeProcessing && !sent) {
          clearVoiceModeRestartTimer();
          voiceModeRestartTimer = setTimeout(() => startVoiceModeListening(), 400);
        }
      };

      rec.onend = () => {
        if (voiceModeRecognition !== rec) return;
        voiceModeRecognition = null;
        if (!sent && bestText) { maybeSend(bestText); return; }
        if (voiceModeActive && !voiceModeMuted && !voiceModeSpeaking && !voiceModeProcessing && !sent) {
          clearVoiceModeRestartTimer();
          voiceModeRestartTimer = setTimeout(() => startVoiceModeListening(), 280);
        }
      };

      voiceModeRecognition = rec;
      setVoiceModeStatus('Mendengarkan...', 'listening');
      setNativeVoiceMode(true);
      startSilentAudioFocus();
      try { rec.start(); }
      catch (_) {
        voiceModeRecognition = null;
        clearVoiceModeRestartTimer();
        voiceModeRestartTimer = setTimeout(() => {
          if (voiceModeActive && !voiceModeMuted && !voiceModeSpeaking && !voiceModeProcessing) startVoiceModeListening();
        }, 500);
      }
    }

    async function voiceModeSendToAI(text) {
      if (!voiceModeActive) return;
      text = normalizeVoiceText(text);
      if (!text || isGarbageVoiceText(text)) { startVoiceModeListening(); return; }

      voiceModeProcessing = true;
      stopVoiceRecognitionClean();
      setVoiceModeStatus('Memikirkan...', null);

      const input = document.getElementById('promptInput');
      if (input) input.value = text;

      const beforeLen = currentChatMessages.length;
      try { await sendMessage(); } catch (_) {}

      if (!voiceModeActive) { voiceModeProcessing = false; return; }

      if (currentChatMessages.length > beforeLen) {
        const lastAI = [...currentChatMessages].reverse().find(m => m.role === 'assistant');
        if (lastAI && lastAI.text) { voiceModeProcessing = false; speakInVoiceMode(lastAI.text); return; }
      }

      voiceModeProcessing = false;
      startVoiceModeListening();
    }

    let speechSessionId = 0;
    let currentSpeakingButton = null;

    function resetSpeakButtonLabel(button) { if (button) button.innerHTML = '<i class="fa-solid fa-volume-high"></i><span>Suara</span>'; }

    // Tulisan di layar tetap "Pretvfx-AI", tapi yang dikirim ke suara (TTS) dieja biar jelas.
    // Kalau mau ubah cara bacanya, cukup edit dua teks di bawah ini.
    const SPOKEN_PRETVFX = 'pre tivi ef ex';
    const SPOKEN_PRETVFX_AI = 'pre tivi ef ex, e ai';

    function fixSpeechPronunciation(text) {
      return String(text || '').replace(
        /\bpretvfx(?:[\s\-\u2011\u2013\u2014_]*(ai))?(?![a-z0-9])/gi,
        (m, ai) => ai ? SPOKEN_PRETVFX_AI : SPOKEN_PRETVFX
      );
    }

    function nativeSpeak(text, onEnd) {
      if (window.AndroidTTS && typeof window.AndroidTTS.speak === 'function') {
        window.onNativeTTSEnd = function () { window.onNativeTTSEnd = null; if (onEnd) onEnd(); };
        window.AndroidTTS.speak(fixSpeechPronunciation(text));
        return true;
      }
      return false;
    }

    function nativeStopSpeak() {
      if (window.AndroidTTS && typeof window.AndroidTTS.stop === 'function') { window.AndroidTTS.stop(); return true; }
      return false;
    }

    function stopAllSpeech() {
      speechSessionId++;
      window.onNativeTTSEnd = null;
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      nativeStopSpeak();
      if (currentSpeakingButton) { resetSpeakButtonLabel(currentSpeakingButton); currentSpeakingButton = null; }
    }

    function splitIntoSpeechChunks(text) {
      const clean = String(text || '').replace(/\s+/g, ' ').trim();
      if (!clean) return [];
      const parts = clean.match(/[^.!?]+[.!?]*/g);
      return (parts && parts.length ? parts : [clean]).map(s => s.trim()).filter(Boolean);
    }

    function browserSpeak(text, onEnd) {
      if (!('speechSynthesis' in window)) return false;

      const voice = pickSmoothVoice();
      const chunks = splitIntoSpeechChunks(fixSpeechPronunciation(text));
      if (!chunks.length) { if (onEnd) onEnd(); return true; }

      const mySession = speechSessionId;
      let index = 0;

      function speakNext() {
        if (mySession !== speechSessionId) return;
        if (index >= chunks.length) { if (onEnd) onEnd(); return; }
        const speech = new SpeechSynthesisUtterance(chunks[index++]);
        if (voice) speech.voice = voice;
        speech.lang = 'id-ID';
        speech.rate = 1.20;
        speech.pitch = 1;
        speech.volume = 1;
        speech.onend = speakNext;
        speech.onerror = speakNext;
        speechSynthesis.speak(speech);
      }

      if (speechSynthesis.speaking || speechSynthesis.pending) { speechSynthesis.cancel(); setTimeout(speakNext, 150); }
      else speakNext();
      return true;
    }

    function speakInVoiceMode(text) {
      const clean = text.replace(/[*_#`>~]/g, '').replace(/\n{2,}/g, '. ');

      stopAllSpeech();
      stopVoiceRecognitionClean();
      voiceModeSpeaking = true;
      setVoiceModeStatus('Berbicara...', 'speaking');

      const finishSpeaking = () => {
        voiceModeSpeaking = false;
        voiceModeCooldownUntil = Date.now() + 1200;
        if (voiceModeActive && !voiceModeMuted) startVoiceModeListening();
      };

      if (nativeSpeak(clean, finishSpeaking)) return;
      if (browserSpeak(clean, finishSpeaking)) return;

      finishSpeaking();
    }

    function updateVoiceModeMuteButton() {
      const btn = document.getElementById('voiceModeMuteBtn');
      if (!btn) return;
      btn.classList.toggle('muted', voiceModeMuted);
      btn.innerHTML = voiceModeMuted ? '<i class="fa-solid fa-microphone-slash"></i>' : '<i class="fa-solid fa-microphone"></i>';
      btn.title = voiceModeMuted ? 'Nyalakan mic' : 'Bisukan mic';
    }

    function toggleVoiceModeMute() {
      voiceModeMuted = !voiceModeMuted;
      updateVoiceModeMuteButton();
      if (voiceModeMuted) { stopVoiceRecognitionClean(); setVoiceModeStatus('Mic dimatikan', null); }
      else if (voiceModeActive && !voiceModeSpeaking && !voiceModeProcessing) startVoiceModeListening();
    }

    function speakMessage(button) {
      const content = button.closest('.message').querySelector('.message-content').innerText;
      if (!content) return;

      if (currentSpeakingButton === button) { stopAllSpeech(); return; }

      stopAllSpeech();

      currentSpeakingButton = button;
      button.innerHTML = '<i class="fa-solid fa-volume-high"></i><span>Berbicara...</span>';

      const finish = () => {
        resetSpeakButtonLabel(button);
        if (currentSpeakingButton === button) currentSpeakingButton = null;
      };

      if (nativeSpeak(content, finish)) return;
      if (browserSpeak(content, finish)) return;

      finish();
      showWarningModal('Fitur suara tidak didukung perangkat ini.', 'Suara Tidak Didukung');
    }

    function giveFeedback(button, type) {
      const parent = button.parentElement;
      parent.querySelectorAll('.feedback-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    }

    let deepResearchEnabled = false;
    function toggleDeepResearch(enabled) {
      deepResearchEnabled = enabled;
      responseMode = enabled ? 'deep' : 'short';
    }
