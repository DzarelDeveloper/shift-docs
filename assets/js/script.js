// Shift Main Interactions Script

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Radial Glow Following Mouse Move
  const glowContainers = document.querySelectorAll('.radial-glow-parent');
  
  document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    
    // Global glows
    document.querySelectorAll('.radial-glow').forEach((glow) => {
      // Find the relative positioning if needed
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

  // Active Nav Link highlight on Scroll
  const navLinks = document.querySelectorAll('.desktop-nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    let currentId = '';
    const scrollPosition = window.scrollY + 150;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = id;
      }
    });

    // Handle scroll-to-bottom edge case
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 10) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        currentId = lastSection.getAttribute('id');
      }
    }

    navLinks.forEach(link => {
      link.classList.remove('nav-link-active', 'text-sky-400', 'text-white');
      link.classList.add('text-slate-400');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.remove('text-slate-400');
        link.classList.add('nav-link-active');
      }
    });
  }

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', updateActiveNavLink);
    window.addEventListener('resize', updateActiveNavLink);
    updateActiveNavLink();
  }

  // Roadmap Voting System Simulator (Local Persistence)
  const voteButtons = document.querySelectorAll('.vote-btn');
  
  voteButtons.forEach(btn => {
    const featureId = btn.getAttribute('data-feature-id');
    const voteCountEl = btn.querySelector('.vote-count');
    
    // Load vote counts and status
    let votes = parseInt(localStorage.getItem(`votes_${featureId}`) || btn.getAttribute('data-initial-votes') || '0');
    let hasVoted = localStorage.getItem(`voted_${featureId}`) === 'true';
    
    // Update UI status on load
    voteCountEl.textContent = votes;
    if (hasVoted) {
      btn.classList.add('bg-sky-500/20', 'text-sky-400', 'border-sky-500/30');
      btn.classList.remove('bg-card/40', 'text-slate-400', 'border-border');
    }
    
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      hasVoted = localStorage.getItem(`voted_${featureId}`) === 'true';
      
      if (hasVoted) {
        // Undo vote
        votes -= 1;
        localStorage.setItem(`votes_${featureId}`, votes);
        localStorage.setItem(`voted_${featureId}`, 'false');
        btn.classList.remove('bg-sky-500/20', 'text-sky-400', 'border-sky-500/30');
        btn.classList.add('bg-card/40', 'text-slate-400', 'border-border');
      } else {
        // Cast vote
        votes += 1;
        localStorage.setItem(`votes_${featureId}`, votes);
        localStorage.setItem(`voted_${featureId}`, 'true');
        btn.classList.add('bg-sky-500/20', 'text-sky-400', 'border-sky-500/30');
        btn.classList.remove('bg-card/40', 'text-slate-400', 'border-border');
        
        // Show immediate micro-animation / visual indicator
        btn.classList.add('scale-110');
        setTimeout(() => {
          btn.classList.remove('scale-110');
        }, 150);
      }
      voteCountEl.textContent = votes;
    });
  });

  // ========== INTERACTIVE WORKSPACE DEMO LAUNCHER CONTROL ==========
  const workspaceTabs = document.querySelectorAll('.workspace-demo-tab');
  const workspaceTitle = document.getElementById('workspace-title');
  const workspaceDesc = document.getElementById('workspace-desc');
  const launchContainer = document.getElementById('launch-items-container');
  const restoreBtn = document.getElementById('restore-workspace-btn');
  const shortcutBadge = document.querySelector('span.bg-slate-900.border.text-sky-400');

  const workspaceData = {
    frontend: {
      title: 'Frontend Dev Launcher',
      desc: 'Instantly restores frontend developer toolsets & directory terminals',
      shortcut: '⌥F',
      items: [
        { name: 'VS Code Editor', action: 'Exec "code ~/projects/shift-client"', icon: 'terminal', bg: 'bg-sky-500/10', border: 'border-sky-500/20', text: 'text-sky-400' },
        { name: 'Chrome Dev-tabs', action: 'Open "localhost:3000", "figma.com", "github.com"', icon: 'chrome', bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400' },
        { name: 'Run Docker containers', action: 'Shell "docker-compose up -d database cache"', icon: 'cpu', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400' },
        { name: 'Project Folder path', action: 'Open dir "~/projects/shift-client"', icon: 'folder', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400' }
      ]
    },
    cyber: {
      title: 'Cybersecurity Sandbox Launcher',
      desc: 'Orchestrates local penetration testing environments and secure logs',
      shortcut: '⌥C',
      items: [
        { name: 'Burp Suite Community', action: 'Exec "burpsuite"', icon: 'shield', bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400' },
        { name: 'Wireshark Analyzer', action: 'Sudo "wireshark -i wlan0"', icon: 'cpu', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
        { name: 'Open Secure Reports folder', action: 'Open dir "~/seclogs/reports"', icon: 'folder', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400' },
        { name: 'OWASP Security Guides', action: 'Open "cheatsheetseries.owasp.org"', icon: 'chrome', bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400' }
      ]
    },
    creator: {
      title: 'Content Creator Studio Launcher',
      desc: 'Safely launches screen recording tools, video monitors, and scripts',
      shortcut: '⌥E',
      items: [
        { name: 'OBS Studio Recorder', action: 'Exec "obs --startrecording"', icon: 'video', bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400' },
        { name: 'DaVinci Resolve Editor', action: 'Exec "resolve"', icon: 'sliders', bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' },
        { name: 'Studio Assets Folder', action: 'Open dir "~/media/assets/active"', icon: 'folder', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400' },
        { name: 'YouTube Creator Analytics', action: 'Open "studio.youtube.com"', icon: 'chrome', bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400' }
      ]
    },
    student: {
      title: 'Student Study Desk Launcher',
      desc: 'Collects homework folders, online notes, classes, and workspace books',
      shortcut: '⌥S',
      items: [
        { name: 'Notion Study Log', action: 'Open "notion.so/my-university-board"', icon: 'book-open', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' },
        { name: 'Google Scholar Search', action: 'Open "scholar.google.com"', icon: 'chrome', bg: 'bg-teal-500/10', border: 'border-teal-500/20', text: 'text-teal-400' },
        { name: 'Class Lectures Directory', action: 'Open dir "~/university/spring-2026"', icon: 'folder', bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400' },
        { name: 'Zotero Reference manager', action: 'Exec "zotero"', icon: 'terminal', bg: 'bg-sky-500/10', border: 'border-sky-500/20', text: 'text-sky-400' }
      ]
    }
  };

  let activeWorkspace = 'frontend';

  const barColors = {
    'text-sky-400': 'bg-sky-500',
    'text-teal-400': 'bg-teal-500',
    'text-indigo-400': 'bg-indigo-500',
    'text-violet-400': 'bg-violet-500',
    'text-purple-400': 'bg-purple-500',
    'text-amber-400': 'bg-amber-505', // maps to yellow/amber
    'text-pink-400': 'bg-pink-500',
    'text-rose-400': 'bg-rose-500'
  };

  function renderLaunchItems(workspaceKey, isLaunching = false) {
    if (!launchContainer || !workspaceData[workspaceKey]) return;
    
    const data = workspaceData[workspaceKey];
    const itemsCountBadge = document.querySelector('span.bg-sky-500\\/10.text-sky-400');
    if (itemsCountBadge) {
      itemsCountBadge.textContent = `${data.items.length} launch items`;
    }

    launchContainer.innerHTML = '';
    data.items.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'launch-item bg-card/60 border border-border p-3.5 rounded-xl flex flex-col gap-2 hover:border-sky-500/30 transition duration-300 relative overflow-hidden';
      
      let statusHtml = '<span class="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10 font-mono">Ready</span>';
      if (isLaunching) {
        statusHtml = `<span class="launch-status-badge text-[10px] bg-slate-500/10 text-slate-400 px-2 py-0.5 rounded border border-slate-500/20 font-mono">Pending</span>`;
      }

      const barColorClass = barColors[item.text] || 'bg-sky-500';

      itemEl.innerHTML = `
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded ${item.bg} flex items-center justify-center border ${item.border}">
              <i data-lucide="${item.icon}" class="w-4 h-4 ${item.text}"></i>
            </div>
            <div>
              <h5 class="text-xs font-bold text-white leading-tight">${item.name}</h5>
              <p class="text-[10px] text-slate-500 font-mono">${item.action}</p>
            </div>
          </div>
          <div class="status-container">${statusHtml}</div>
        </div>
        
        <!-- Interactive Progress bar container -->
        <div class="launch-progress-container w-full h-[3px] bg-slate-950/60 rounded-full overflow-hidden mt-1 max-h-0 opacity-0 transition-all duration-300">
          <div class="launch-progress-bar h-full rounded-full w-0 ${barColorClass} transition-all duration-[80ms] ease-out" style="width: 0%"></div>
        </div>
      `;
      launchContainer.appendChild(itemEl);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons({
        attrs: {
          class: 'lucide-dynamic'
        },
        node: launchContainer
      });
    }
  }

  function launchItem(itemEl, barBgClass, onComplete) {
    const progressContainer = itemEl.querySelector('.launch-progress-container');
    const progressBar = itemEl.querySelector('.launch-progress-bar');
    const statusContainer = itemEl.querySelector('.status-container');
    
    if (!progressContainer || !statusContainer || !progressBar) {
      onComplete();
      return;
    }

    // Expand progress container
    progressContainer.classList.remove('max-h-0', 'opacity-0');
    progressContainer.classList.add('max-h-[8px]', 'opacity-1', 'mt-1');
    
    // Highlight card border
    itemEl.classList.add('border-sky-500/30', 'bg-sky-500/[0.02]');
    itemEl.classList.remove('hover:border-sky-500/30');

    // Setup active progress status spinner
    statusContainer.innerHTML = `
      <span class="launch-status-badge text-[10px] bg-sky-500/15 text-sky-400 px-2 py-0.5 rounded border border-sky-500/10 font-mono flex items-center gap-1.5">
        <svg class="w-2.5 h-2.5 animate-spin text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="progress-percent">0%</span>
      </span>
    `;

    const percentEl = statusContainer.querySelector('.progress-percent');
    
    let progress = 0;
    const duration = 1000; // 1 second duration
    const intervalTime = 30; // 30ms step updates
    const increment = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      progress += increment;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        // Finalize visual progress
        progressBar.style.width = '100%';
        progressBar.style.backgroundColor = '#10b981'; // solid emerald color
        progressBar.className = `launch-progress-bar h-full rounded-full w-full bg-emerald-500 transition-all duration-300`;

        // Update status badge to "LAUNCHED"
        statusContainer.innerHTML = `
          <span class="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-mono font-semibold flex items-center gap-1">
            <svg class="w-2.5 h-2.5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            LAUNCHED
          </span>
        `;

        // Update card styling
        itemEl.classList.remove('border-sky-500/30', 'bg-sky-500/[0.02]');
        itemEl.classList.add('border-emerald-500/20', 'bg-emerald-950/5');

        setTimeout(() => {
          onComplete();
        }, 150); // slight delay before starting next item
      } else {
        const roundedProgress = Math.round(progress);
        progressBar.style.width = `${roundedProgress}%`;
        if (percentEl) {
          percentEl.textContent = `${roundedProgress}%`;
        }
      }
    }, intervalTime);
  }

  if (workspaceTabs.length > 0) {
    workspaceTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const workspaceKey = tab.getAttribute('data-workspace');
        if (!workspaceKey || workspaceKey === activeWorkspace) return;

        // Reset any launching feedback on button
        if (restoreBtn) {
          restoreBtn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-1.5 shadow-lg shadow-sky-500/10 cursor-pointer';
          restoreBtn.innerHTML = '<i data-lucide="zap" class="w-3.5 h-3.5"></i><span>RESTORE WORKSPACE</span>';
          if (typeof lucide !== 'undefined') { lucide.createIcons({ node: restoreBtn }); }
        }

        // Highlight tab
        workspaceTabs.forEach(t => {
          t.className = 'workspace-demo-tab w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium border border-transparent text-slate-400 hover:text-slate-200 transition';
        });
        
        tab.className = 'workspace-demo-tab w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium border border-sky-500 bg-sky-500/10 text-sky-400 transition';

        activeWorkspace = workspaceKey;
        const info = workspaceData[workspaceKey];
        if (workspaceTitle) workspaceTitle.textContent = info.title;
        if (workspaceDesc) workspaceDesc.textContent = info.desc;
        if (shortcutBadge) shortcutBadge.textContent = info.shortcut;

        // Dev tray folder shell text
        const pathLine = document.querySelector('div.ml-4.px-3.py-1.rounded-md.bg-surface');
        if (pathLine) {
          pathLine.innerHTML = `<i data-lucide="terminal" class="w-3.5 h-3.5 text-sky-400"></i>shift --workspace ${workspaceKey}-dev`;
          if (typeof lucide !== 'undefined') { lucide.createIcons({ node: pathLine }); }
        }

        renderLaunchItems(workspaceKey);
      });
    });
  }

  // Sequenced Mock Restoration Simulator Action
  if (restoreBtn) {
    restoreBtn.addEventListener('click', () => {
      if (restoreBtn.classList.contains('bg-emerald-500')) return; // already done

      // Set to loading
      restoreBtn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center gap-1.5 pointer-events-none select-none';
      restoreBtn.innerHTML = '<i class="w-3.5 h-3.5 animate-spin border-2 border-slate-400 border-t-transparent rounded-full"></i><span>RESTORING WORKSPACE...</span>';

      renderLaunchItems(activeWorkspace, true);

      // sequence launch checks
      const itemElements = launchContainer.querySelectorAll('.launch-item');

      function triggerNextLaunch(index) {
        if (index >= itemElements.length) {
          // All items finish launching
          setTimeout(() => {
            restoreBtn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer';
            restoreBtn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i><span>WORKSPACE RESTORED!</span>';
            if (typeof lucide !== 'undefined') {
              lucide.createIcons({ node: restoreBtn });
            }
          }, 300);
          return;
        }

        const itemEl = itemElements[index];
        const data = workspaceData[activeWorkspace];
        const itemInfo = data.items[index];
        const barColorClass = barColors[itemInfo.text] || 'bg-sky-500';

        // Launch the item
        launchItem(itemEl, barColorClass, () => {
          // completed callback -> start next item
          triggerNextLaunch(index + 1);
        });
      }

      // Start the sequential launching
      if (itemElements.length > 0) {
        triggerNextLaunch(0);
      } else {
        // Fallback if no elements
        restoreBtn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-slate-950 flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer';
        restoreBtn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5"></i><span>WORKSPACE RESTORED!</span>';
        if (typeof lucide !== 'undefined') {
          lucide.createIcons({ node: restoreBtn });
        }
      }
    });
  }

  // Switch tabs in Quick Start Terminal section
  function switchHeroCliPlatform(platform) {
    document.querySelectorAll('.hero-cli-plat-btn').forEach(btn => {
      btn.className = 'hero-cli-plat-btn px-3 py-1 rounded-md text-slate-400 text-[10px] font-mono font-medium hover:text-white transition duration-150 flex items-center gap-1 cursor-pointer';
    });

    const activeBtn = document.getElementById(`hero-cli-tab-${platform}`);
    if (activeBtn) {
      if (platform === 'unix') {
        activeBtn.className = 'hero-cli-plat-btn px-3 py-1 rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-mono font-medium transition duration-150 flex items-center gap-1 cursor-pointer';
      } else {
        activeBtn.className = 'hero-cli-plat-btn px-3 py-1 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[10px] font-mono font-medium transition duration-150 flex items-center gap-1 cursor-pointer';
      }
    }

    // Hide all contents
    document.querySelectorAll('.hero-cli-platform-content').forEach(block => {
      block.classList.add('hidden');
    });

    const activeBlock = document.getElementById(`hero-cli-content-${platform}`);
    if (activeBlock) {
      activeBlock.classList.remove('hidden');
    }
  }
  window.switchHeroCliPlatform = switchHeroCliPlatform;

  // Global Clipboard Copier with Beautiful Toasts
  function showToast(message, iconName = 'check-circle') {
    const existing = document.getElementById('global-toast');
    if (existing) {
      existing.remove();
    }

    const toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'fixed bottom-6 right-6 bg-slate-900 border border-sky-500/30 text-white px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 font-sans text-sm animate-fade-in transition-all duration-300';
    toast.innerHTML = `
      <div class="w-5 h-5 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center">
        <i data-lucide="${iconName}" class="w-3.5 h-3.5"></i>
      </div>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

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
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
          btn.classList.remove('bg-emerald-500/10', 'border-emerald-500/30');
        }, 2000);
      }
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };
});
