// Shift Download Page Controller

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Radial Glow Tracking
  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    document.querySelectorAll('.radial-glow').forEach((glow) => {
      const rect = glow.parentElement.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      glow.style.setProperty('--x', `${x}px`);
      glow.style.setProperty('--y', `${y}px`);
    });
  });

  // Scroll Progress Indicator
  const progressIndicator = document.createElement('div');
  progressIndicator.className = 'scroll-progress-bar';
  document.body.appendChild(progressIndicator);

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressIndicator.style.width = scrolled + '%';
  });

  // Scroll and floating sticky navbar behaviour
  const navbar = document.getElementById('navbar');
  const navbarInner = document.getElementById('navbar-inner');
  if (navbar && navbarInner) {
    const handleScroll = () => {
      if (window.scrollY >= 50) {
        navbarInner.classList.remove('border-transparent', 'bg-transparent', 'shadow-none');
        navbarInner.classList.add(
          'md:bg-[#0a0a0a]/75', 'md:backdrop-blur-[12px]', 'md:border-white/8',
          'bg-[#0a0a0a]/90', 'backdrop-blur-[12px]', 'border-b', 'border-white/8', 'shadow-xl'
        );
      } else {
        navbarInner.classList.add('border-transparent', 'bg-transparent', 'shadow-none');
        navbarInner.classList.remove(
          'md:bg-[#0a0a0a]/75', 'md:backdrop-blur-[12px]', 'md:border-white/8',
          'bg-[#0a0a0a]/90', 'backdrop-blur-[12px]', 'border-b', 'border-white/8', 'shadow-xl'
        );
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // execute once on load
  }

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on click of links
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenu.classList.add('hidden');
      }
    });
  }

  // OS Detection Logic
  function detectOS() {
    const platform = window.navigator.userAgent.toLowerCase();
    const macosPlatforms = ['macintosh', 'macintel', 'macppc', 'mac68k', 'macos'];
    const windowsPlatforms = ['win32', 'win64', 'windows', 'wince'];
    
    // Check OS
    if (macosPlatforms.some(mac => platform.includes(mac))) {
      return 'macos';
    } else if (windowsPlatforms.some(win => platform.includes(win))) {
      return 'windows';
    } else if (platform.includes('linux')) {
      return 'linux';
    }
    return 'windows'; // fallback default
  }

  const userOS = detectOS();
  highlightOSCard(userOS);

  function highlightOSCard(os) {
    // Remove previous highlights just in case
    document.querySelectorAll('.platform-card').forEach(card => {
      card.classList.remove('recommended-active', 'border-sky-500/50');
      const badge = card.querySelector('.recommended-badge');
      if (badge) badge.classList.add('hidden');
    });

    const targetCard = document.getElementById(`card-${os}`);
    if (targetCard) {
      targetCard.classList.add('recommended-active');
      const badge = targetCard.querySelector('.recommended-badge');
      if (badge) {
        badge.classList.remove('hidden');
      }
    }

    // Also pre-select verification tab
    switchVerificationTab(os);
  }

  // System OS Switch buttons interaction
  window.manuallySelectOS = function(os) {
    highlightOSCard(os);
  };

  // Toast Notification System
  function showToast(message, iconName = 'check-circle') {
    // Remove existing toast if any
    const existing = document.getElementById('global-toast');
    if (existing) {
      existing.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'fixed bottom-6 right-6 bg-slate-900 border border-emerald-500/30 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 toast-notification font-sans text-sm';
    toast.innerHTML = `
      <div class="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
        <i data-lucide="${iconName}" class="w-4 h-4"></i>
      </div>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Auto remove toast
    setTimeout(() => {
      toast.remove();
    }, 2500);
  }

  // Clipboard Copier
  window.copyText = function(text, buttonId, successMessage) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage || 'Copied to clipboard!');
      
      const btn = document.getElementById(buttonId);
      if (btn) {
        const originalContent = btn.innerHTML;
        btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i> <span class="text-emerald-400">Copied!</span>`;
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
        btn.classList.add('bg-emerald-500/10', 'border-emerald-500/30');

        setTimeout(() => {
          btn.innerHTML = originalContent;
          btn.classList.remove('bg-emerald-500/10', 'border-emerald-500/30');
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  // Switch tabs in Security Verification section
  function switchVerificationTab(platform) {
    // Select all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('terminal-tab-active', 'border-sky-500/30', 'text-sky-400');
      btn.classList.add('border-border', 'text-slate-400', 'bg-surface/50');
    });

    // Select active button
    const activeBtn = document.getElementById(`tab-${platform}`);
    if (activeBtn) {
      activeBtn.classList.add('terminal-tab-active');
      activeBtn.classList.remove('border-border', 'text-slate-400', 'bg-surface/50');
    }

    // Switch visible command container
    document.querySelectorAll('.code-command-block').forEach(block => {
      block.classList.add('hidden');
    });

    const activeBlock = document.getElementById(`command-${platform}`);
    if (activeBlock) {
      activeBlock.classList.remove('hidden');
    }
  }
  window.switchVerificationTab = switchVerificationTab;

  // Switch tabs in CLI Terminal Installation section
  function switchCliPlatform(platform) {
    // Select all CLI platform button elements
    document.querySelectorAll('.cli-plat-btn').forEach(btn => {
      btn.classList.remove('terminal-tab-active', 'border-sky-500/30', 'text-sky-400');
      btn.classList.add('border-border', 'text-slate-400', 'bg-surface/50');
    });

    const activeBtn = document.getElementById(`cli-tab-${platform}`);
    if (activeBtn) {
      activeBtn.classList.add('terminal-tab-active');
      activeBtn.classList.remove('border-border', 'text-slate-400', 'bg-surface/50');
    }

    // Hide all CLI contents
    document.querySelectorAll('.cli-platform-content').forEach(block => {
      block.classList.add('hidden');
    });

    const activeBlock = document.getElementById(`cli-content-${platform}`);
    if (activeBlock) {
      activeBlock.classList.remove('hidden');
    }
  }
  window.switchCliPlatform = switchCliPlatform;

  // Mock release documentation and release notes lookup database
  const releaseNotesDB = {
    'v0.6.8': {
      version: 'v0.6.8',
      date: 'June 12, 2026 (3 Days Ago)',
      tag: 'Latest Stable',
      changelog: `
### Key Highlights
- **Upgraded Workspace Context Parser**: Added comprehensive JSON Schema-based file scanning algorithms and multi-directory focus logic.
- **Enhanced Keyboard Shortcuts**: Brand-new system shortcuts bindings for blazing-fast transitions. Customize workspace settings via \`Ctrl + ,\`.
- **Integrated Environment Configuration**: Full workspace support for local sandboxed variables and multi-stage configurations.

### Bug Fixes and Optimization
- Fixed memory leakage occurring during heavy directory scans with nested Git configurations.
- Repaired intermittent dark layout flickering in Safari & specific WebKit browsers on macOS.
- Solved Lucide external file icons initialization delay bottleneck during first-render states.
- Stabilized persistent local theme values when opening docs side-overs in narrow viewports.
      `
    },
    'v0.6.7': {
      version: 'v0.6.7',
      date: 'May 18, 2026 (1 Month Ago)',
      tag: 'Previous Release',
      changelog: `
### Key Highlights
- **Performance Tuning**: Reduced startup loading delay by 42% through lazy-loaded configuration maps and visual chunks.
- **Theme Enhancements**: Redesigned borders and dark glow gradients across all sections to promote ocular comfort; introduced the Cosmic Slate Theme.

### Bug Fixes and Improvements
- Corrected sidebar scroll boundaries truncation on 13-inch displays.
- Strengthened sandbox isolation for untrusted terminal tasks.
- Restructured standard navigation links highlight algorithm during scroll-to-bottom actions.
      `
    },
    'v0.6.6': {
      version: 'v0.6.6',
      date: 'April 02, 2026 (2 Months Ago)',
      tag: 'Previous Release',
      changelog: `
### Key Highlights
- **State Engine Revamp**: Shifted core temporary state synchronization to automatic secure IndexedDB structure fallback to prevent sudden local state wipeouts.
- **Improved Workspace File Search**: Added robust regex filtering filters to locate settings or documentation with ease.

### Bug Fixes
- Restored broken external links alignment inside navigation headers inside responsive drawer views.
- Rectified multi-monitor split screen layout displacement behavior.
      `
    },
    'v0.6.5': {
      version: 'v0.6.5',
      date: 'March 11, 2026 (3 Months Ago)',
      tag: 'Initial Pre-Release',
      changelog: `
### Key Highlights
- **Launch Phase**: The initial community pre-release is officially online!
- **Core Functionality**: Full implementation of localized workspaces, markdown docs, progress timelines, customizable developer settings, and system shortcuts.
      `
    }
  };

  // Release Notes Modal Handler
  const notesModal = document.getElementById('notes-modal');
  const detailsTitle = document.getElementById('notes-modal-title');
  const detailsMeta = document.getElementById('notes-modal-meta');
  const detailsBody = document.getElementById('notes-modal-body');
  const closeNotesModal = document.getElementById('close-notes-modal');

  window.openReleaseNotes = function(version) {
    const data = releaseNotesDB[version];
    if (!data) return;

    detailsTitle.innerText = `Release Notes - ${data.version}`;
    detailsMeta.innerHTML = `<span class="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-400 text-xs font-mono font-medium">${data.tag}</span> <span class="text-slate-400">Release Date: ${data.date}</span>`;
    
    // Convert markdown bullets to styled HTML programmatically
    let htmlContent = data.changelog
      .replace(/### (.*)/g, '<h4 class="text-sm font-semibold text-white tracking-tight border-b border-border/65 pb-1 mt-5 mb-3">$1</h4>')
      .replace(/- \*\*(.*?)\*\*(.*)/g, '<li class="flex items-start gap-2 text-slate-300 text-xs leading-relaxed mb-1.5"><span class="text-sky-400 font-bold mt-0.5">•</span><span><strong class="text-sky-300 font-semibold">$1</strong>$2</span></li>')
      .replace(/- (.*)/g, '<li class="flex items-start gap-2 text-slate-300 text-xs leading-relaxed mb-1.5"><span class="text-sky-400 font-bold mt-0.5">•</span><span>$1</span></li>')
      .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-background border border-border text-[11px] font-mono text-pink-400">$1</code>');

    // Wrap list elements safely
    htmlContent = htmlContent.replace(/(<li.*<\/li>)/gs, '<ul class="space-y-1 mb-4">$1</ul>');

    detailsBody.innerHTML = htmlContent;

    // Show Modal
    notesModal.classList.remove('hidden');
    notesModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  // Close Notes Modal
  if (closeNotesModal && notesModal) {
    closeNotesModal.addEventListener('click', () => {
      notesModal.classList.add('hidden');
      notesModal.classList.remove('flex');
      document.body.style.overflow = '';
    });

    // Close on backdrop click
    notesModal.addEventListener('click', (e) => {
      if (e.target === notesModal) {
        notesModal.classList.add('hidden');
        notesModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });

    // Close on esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !notesModal.classList.contains('hidden')) {
        notesModal.classList.add('hidden');
        notesModal.classList.remove('flex');
        document.body.style.overflow = '';
      }
    });
  }

  // Interactive Live Counter Increment Simulator
  window.triggerDownloadAction = function(fileName) {
    showToast(`Downloading: ${fileName}`, 'download');
    
    // Animate and increment download count
    const statsCounter = document.getElementById('stats-downloads-count');
    if (statsCounter) {
      const current = parseInt(statsCounter.getAttribute('data-value') || '15000');
      const incremented = current + Math.floor(Math.random() * 3) + 1;
      statsCounter.setAttribute('data-value', incremented.toString());
      statsCounter.innerText = incremented.toLocaleString() + '+';
    }
  };
});
