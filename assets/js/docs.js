// Shift Documentation Interactions Script

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. Highlight standard active route inside Sidebar
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll('.docs-sidebar-link');
  let activeLinkFound = false;

  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Match exact path or subfile
    if (currentPath.includes(href) || (href !== '../index.html' && currentPath.endsWith(href))) {
      link.classList.add('sidebar-link-active');
      activeLinkFound = true;
    }
  });

  // Default to introduction/index as fallback active highlight
  if (!activeLinkFound && sidebarLinks.length > 0) {
    sidebarLinks.forEach(link => {
      if (link.getAttribute('href').endsWith('index.html') || link.getAttribute('href').endsWith('introduction.html')) {
        link.classList.add('sidebar-link-active');
      }
    });
  }

  // 2. Auto-Generate Table of Contents (TOC) on Desktop
  const tocContainer = document.getElementById('docs-toc-items');
  const mainContent = document.querySelector('.prose');
  
  if (tocContainer && mainContent) {
    const headers = mainContent.querySelectorAll('h2, h3');
    
    if (headers.length > 0) {
      const ul = document.createElement('ul');
      ul.className = 'space-y-2 border-l border-border pl-4 text-xs font-medium text-slate-400';
      
      headers.forEach((header, index) => {
        // Ensure header has an id for anchor linking
        if (!header.id) {
          header.id = header.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${header.id}`;
        a.textContent = header.textContent;
        
        // Indent H3 items slightly
        if (header.tagName.toLowerCase() === 'h3') {
          a.className = 'block py-0.5 hover:text-sky-400 pl-4 border-l border-transparent';
        } else {
          a.className = 'block py-0.5 hover:text-sky-400 border-l border-transparent';
        }
        
        a.setAttribute('data-header-id', header.id);
        li.appendChild(a);
        ul.appendChild(li);
      });
      
      tocContainer.innerHTML = '';
      tocContainer.appendChild(ul);
      
      // Auto highlight active heading during scroll
      const tocLinks = tocContainer.querySelectorAll('a');
      
      function highlightActiveHeader() {
        let activeId = '';
        const scrollOffset = window.scrollY + 120;
        
        headers.forEach(h => {
          if (scrollOffset >= h.offsetTop) {
            activeId = h.id;
          }
        });
        
        tocLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('text-sky-400', 'border-l-sky-400');
            link.classList.remove('text-slate-400', 'border-transparent');
          } else {
            link.classList.remove('text-sky-400', 'border-l-sky-400');
            link.classList.add('text-slate-400', 'border-transparent');
          }
        });
      }
      
      window.addEventListener('scroll', highlightActiveHeader);
      highlightActiveHeader();
    } else {
      // No subheaders, hide the TOC column
      const tocWidget = document.getElementById('docs-toc-widget');
      if (tocWidget) tocWidget.style.display = 'none';
    }
  }

  // 3. Setup Code Block Copy Buttons
  document.querySelectorAll('pre').forEach(block => {
    // Wrap pre block in a target relative container if not already
    block.style.position = 'relative';
    
    // Create button element
    const btn = document.createElement('button');
    btn.className = 'absolute top-3 right-3 p-1.5 rounded-md bg-slate-900 border border-border text-slate-400 hover:text-white transition duration-200 cursor-pointer';
    btn.innerHTML = '<i data-lucide="clipboard" class="w-3.5 h-3.5"></i>';
    btn.title = 'Copy code';
    
    block.appendChild(btn);
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    
    btn.addEventListener('click', () => {
      const codeElement = block.querySelector('code');
      if (!codeElement) return;
      
      const textToCopy = codeElement.innerText;
      
      navigator.clipboard.writeText(textToCopy).then(() => {
        // Visual indicator of copy success
        btn.innerHTML = '<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-400"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        
        setTimeout(() => {
          btn.innerHTML = '<i data-lucide="clipboard" class="w-3.5 h-3.5"></i>';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  });

  // 4. Docs Global Search Overlay Demo (Modal Trigger and Filter)
  const searchInputs = document.querySelectorAll('.docs-search-trigger');
  const searchModal = document.getElementById('search-modal');
  const searchClose = document.getElementById('search-close');
  const searchModalInput = document.getElementById('search-modal-input');
  const searchResults = document.getElementById('search-results');

  // Realistic mock searchable index spanning the documentation sections
  const searchDatabase = [
    { title: "What is Shift?", url: "introduction.html", desc: "Introduction, core design principles, and product features." },
    { title: "Quick-start guide", url: "quick-start.html", desc: "Setting up your first workspace trigger profile." },
    { title: "How to Install Shift", url: "installation.html", desc: "Requirements, installation guides, and running the background tray daemon." },
    { title: "Working with Workspaces", url: "workspace.html", desc: "Configuring active launch contexts and application directories." },
    { title: "Managing Launch Configurations", url: "projects.html", desc: "Define shell commands, native application triggers, and browser targets." },
    { title: "Workspace Templates", url: "templates.html", desc: "Start instantly with ready-made workspace layouts designed for different workflows." },
    { title: "Settings Options (.shiftrc)", url: "settings.html", desc: "Theme configurations, keyboard shortcuts, and local storage limits." },
    { title: "Frequently Asked Questions (FAQ)", url: "faq.html", desc: "Information regarding offline capability, data storage, and license." },
    { title: "Troubleshooting Guide", url: "troubleshooting.html", desc: "Resolving performance issues, port conflicts, or storage clearing." }
  ];

  // Open search modal on triggering elements
  searchInputs.forEach(input => {
    input.addEventListener('click', (e) => {
      e.preventDefault();
      if (searchModal) {
        searchModal.classList.remove('hidden');
        searchModal.classList.add('flex');
        if (searchModalInput) {
          searchModalInput.value = '';
          searchModalInput.focus();
          renderSearchResults('');
        }
      }
    });
  });

  // Close search modal
  if (searchClose && searchModal) {
    searchClose.addEventListener('click', () => {
      searchModal.classList.add('hidden');
      searchModal.classList.remove('flex');
    });
  }

  // Listening to search queries
  if (searchModalInput) {
    searchModalInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim());
    });
  }

  // Keyboard shortcut for search trigger (Cmd/Ctrl + K)
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchModal) {
        searchModal.classList.toggle('hidden');
        if (!searchModal.classList.contains('hidden')) {
          searchModal.classList.add('flex');
          searchModalInput.focus();
          renderSearchResults('');
        } else {
          searchModal.classList.remove('flex');
        }
      }
    } else if (e.key === 'Escape' && searchModal) {
      searchModal.classList.add('hidden');
      searchModal.classList.remove('flex');
    }
  });

  function renderSearchResults(query) {
    if (!searchResults) return;
    
    if (query === '') {
      searchResults.innerHTML = `
        <div class="text-center py-8 text-slate-400 text-sm">
          <p>Type a keyword or phrase to search documentation...</p>
          <div class="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
            <span><kbd class="px-1.5 py-0.5 rounded border border-border bg-slate-900">↑↓</kbd> navigate</span>
            <span><kbd class="px-1.5 py-0.5 rounded border border-border bg-slate-900">Enter</kbd> opening</span>
          </div>
        </div>
      `;
      return;
    }

    const filtered = searchDatabase.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) || 
      item.desc.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      searchResults.innerHTML = `
        <div class="text-center py-8 text-slate-400 text-sm">
          <p>No results found for "<span class="text-sky-400 font-semibold">${query}</span>"</p>
          <p class="text-xs text-slate-500 mt-1">Try another search string such as "install", "board", or "shiftrc".</p>
        </div>
      `;
      return;
    }

    let html = '<div class="space-y-2">';
    filtered.forEach(item => {
      html += `
        <a href="${item.url}" class="block p-3.5 rounded-xl bg-slate-900/60 hover:bg-sky-500/10 border border-border hover:border-sky-500/20 transition duration-150 group">
          <div class="flex items-center justify-between">
            <span class="font-semibold text-sm text-slate-200 group-hover:text-white transition">${item.title}</span>
            <i data-lucide="chevron-right" class="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition"></i>
          </div>
          <p class="text-xs text-slate-400 mt-1">${item.desc}</p>
        </a>
      `;
    });
    html += '</div>';
    searchResults.innerHTML = html;
    
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // 5. Docs Mobile Sidebar Menu Drawer Toggle
  const docsMenuToggleBtn = document.getElementById('docs-menu-toggle');
  const docsSidebar = document.getElementById('docs-sidebar-container');
  const docsSidebarClose = document.getElementById('docs-sidebar-close');

  if (docsMenuToggleBtn && docsSidebar) {
    docsMenuToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      docsSidebar.classList.remove('-translate-x-full');
    });
  }

  if (docsSidebarClose && docsSidebar) {
    docsSidebarClose.addEventListener('click', () => {
      docsSidebar.classList.add('-translate-x-full');
    });
  }

  // Close mobile sidebar on click outside
  document.addEventListener('click', (e) => {
    if (docsSidebar && !docsSidebar.contains(e.target) && docsMenuToggleBtn && !docsMenuToggleBtn.contains(e.target)) {
      docsSidebar.classList.add('-translate-x-full');
    }
  });

  // 6. Global Mobile Navbar Menu on Docs pages
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('hidden');
    });

    // Close on click of links
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

  // 7. Scroll Progress Indicator for Docs Pages
  const progressIndicator = document.createElement('div');
  progressIndicator.className = 'scroll-progress-bar';
  document.body.appendChild(progressIndicator);

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressIndicator.style.width = scrolled + '%';
  });

  // 8. Sticky/Floating Navbar scroll support
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
    handleScroll(); // initial state run
  }
});
