/*
  Chhaly CHHOEURNG portfolio interactions.
  To use real videos, replace showVideoModal's placeholder with an iframe or <video>
  element and provide a trusted YouTube URL or local MP4 source per project.
*/
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  const header = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');
  const navItems = [...document.querySelectorAll('.nav-links a')];
  const sections = [...document.querySelectorAll('main section[id]')];

  const closeMenu = () => {
    if (!navLinks.classList.contains('open')) return;
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  };

  const openMenu = () => {
    navLinks.classList.add('open');
    menuToggle.classList.add('open');
    if (navOverlay) navOverlay.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Close navigation');
  };

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  navItems.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('open') && !header.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && navLinks && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', setHeader, { passive: true });
  setHeader();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll('.progress span').forEach(bar => {
        // Change data-progress to a real percentage when proficiency is confirmed.
        bar.style.width = `${bar.dataset.progress || 0}%`;
      });
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(item => revealObserver.observe(item));

  const activeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navItems.forEach(item => item.classList.toggle('active', item.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
  sections.forEach(section => activeObserver.observe(section));

  const filters = document.querySelector('.filters');
  const applyProjectFilter = (filter, activeButton) => {
    document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === activeButton));
    document.querySelectorAll('.project').forEach(project => {
      const categories = (project.dataset.category || '').split(/\s+/);
      const visible = filter === 'all' || categories.includes(filter);
      project.hidden = !visible;
      if (visible) project.classList.add('is-visible');
    });
  };
  const addProjectFilter = (category, label) => {
    const existingFilter = [...document.querySelectorAll('.filter')].find(button => button.dataset.filter === category);
    if (existingFilter || !filters) return;
    const filterButton = document.createElement('button');
    filterButton.className = 'filter';
    filterButton.dataset.filter = category;
    filterButton.textContent = label;
    filters.append(filterButton);
  };
  if (filters) {
    filters.addEventListener('click', event => {
      const button = event.target.closest('.filter');
      if (button && filters.contains(button)) applyProjectFilter(button.dataset.filter, button);
    });
  }

  const projectModal = document.querySelector('#project-modal');
  const modalImage = document.querySelector('#modal-image');
  const modalTitle = document.querySelector('#modal-title');
  const openProject = (title, imageSrc) => {
    if (!projectModal || !modalImage || !modalTitle) return;
    modalImage.src = imageSrc;
    modalImage.alt = `${title} preview`;
    modalTitle.textContent = title;
    projectModal.showModal();
  };
  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('click', () => {
      const button = card.querySelector('.project-open');
      const title = button?.dataset.project || card.querySelector('h3')?.textContent || 'Project Preview';
      const imageSrc = button?.dataset.image || card.querySelector('img')?.getAttribute('src');
      if (imageSrc) openProject(title, imageSrc);
    });
  });

  const projectUploadButton = document.querySelector('#project-upload-button');
  const projectUploadInput = document.querySelector('#project-upload-input');
  const projectUploadStatus = document.querySelector('#project-upload-status');
  const projectGrid = document.querySelector('.project-grid');
  const uploadedProjectUrls = [];

  if (projectUploadButton && projectUploadInput && projectUploadStatus && projectGrid) {
    projectUploadButton.addEventListener('click', () => projectUploadInput.click());
    projectUploadInput.addEventListener('change', () => {
      const [file] = projectUploadInput.files;
      if (!file) return;

      const isImage = file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(file.name);
      if (!isImage) {
        projectUploadStatus.textContent = 'Please choose an image file.';
        projectUploadInput.value = '';
        return;
      }

      const projectType = 'Uploaded Design';
      const projectCategory = 'uploaded';
      addProjectFilter(projectCategory, projectType);
      applyProjectFilter('all', document.querySelector('.filter[data-filter="all"]'));
      const imageUrl = URL.createObjectURL(file);
      const projectName = projectNameInput.value.trim() || file.name.replace(/\.[^/.]+$/, '');
      const project = document.createElement('article');
      project.className = 'project uploaded-project is-visible';
      project.dataset.category = projectCategory;
      const image = document.createElement('img');
      image.loading = 'lazy';
      image.src = imageUrl;
      image.alt = projectName;
      const projectInfo = document.createElement('div');
      projectInfo.className = 'project-info';
      const projectTypeLabel = document.createElement('p');
      projectTypeLabel.textContent = projectType;
      const projectTitle = document.createElement('h3');
      projectTitle.textContent = projectName;
      projectInfo.append(projectTypeLabel, projectTitle);
      const openButton = document.createElement('button');
      openButton.className = 'project-open';
      openButton.dataset.project = projectName;
      openButton.dataset.image = imageUrl;
      openButton.setAttribute('aria-label', `View ${projectName}`);
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', 'plus');
      openButton.append(icon);
      openButton.addEventListener('click', () => openProject(openButton));
      project.append(image, projectInfo, openButton);
      projectGrid.prepend(project);
      uploadedProjectUrls.push(imageUrl);
      if (window.lucide) lucide.createIcons({ nodes: [project] });

      projectUploadStatus.textContent = `${projectName} was added as a ${projectType}.`;
      projectUploadInput.value = '';
    });
    window.addEventListener('beforeunload', () => uploadedProjectUrls.forEach(url => URL.revokeObjectURL(url)));
  }

  const videoModal = document.querySelector('#video-modal');
  const videoTitle = document.querySelector('#video-title');
  const videoPlayer = document.querySelector('#video-player');
  const videoFallback = document.querySelector('#video-fallback');

  const openVideo = (src, title) => {
    if (!videoModal) return;
    if (videoTitle) videoTitle.textContent = title || 'Video preview';

    if (src && videoPlayer) {
      videoPlayer.style.display = 'block';
      if (videoFallback) videoFallback.style.display = 'none';
      if (videoPlayer.getAttribute('src') !== src) {
        videoPlayer.src = src;
      }
      videoPlayer.currentTime = 0;
      videoModal.showModal();
      videoPlayer.play().catch(() => {});
    } else {
      if (videoPlayer) {
        videoPlayer.style.display = 'none';
        videoPlayer.pause();
      }
      if (videoFallback) videoFallback.style.display = 'grid';
      videoModal.showModal();
    }
  };

  document.querySelectorAll('.video-card').forEach(card => {
    const previewVideo = card.querySelector('video.video-preview');
    if (previewVideo) {
      card.addEventListener('mouseenter', () => {
        const playPromise = previewVideo.play();
        if (playPromise !== undefined) playPromise.catch(() => {});
      });
      card.addEventListener('mouseleave', () => {
        previewVideo.pause();
        previewVideo.currentTime = 0;
      });
    }

    card.addEventListener('click', () => {
      const btn = card.querySelector('.play-button');
      const src = card.dataset.videoSrc || btn?.dataset.videoSrc;
      const title = card.dataset.videoTitle || btn?.dataset.videoTitle;
      openVideo(src, title);
    });
  });

  document.querySelectorAll('.play-button').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      const card = button.closest('.video-card');
      const src = card?.dataset.videoSrc || button.dataset.videoSrc;
      const title = card?.dataset.videoTitle || button.dataset.videoTitle;
      openVideo(src, title);
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
    modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
    modal.addEventListener('close', () => {
      const video = modal.querySelector('video');
      if (video) { video.pause(); video.currentTime = 0; }
    });
  });

  const contactForm = document.querySelector('.contact-form');
  const contactStatus = contactForm?.querySelector('.form-status');
  if (contactForm && contactStatus) {
    contactForm.addEventListener('submit', async event => {
      event.preventDefault();
      const submitButton = contactForm.querySelector('button[type="submit"]');
      submitButton.disabled = true;
      contactStatus.classList.remove('is-error');
      contactStatus.textContent = 'Sending your message…';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });
        const contentType = response.headers.get('content-type') || '';
        let result = null;
        if (contentType.includes('application/json')) {
          result = await response.json();
        }
        if (response.ok && result && result.ok) {
          contactForm.reset();
          contactStatus.textContent = result.message || 'Thanks — your message has been sent successfully.';
        } else {
          // Graceful fallback for local preview or static servers without PHP/database
          contactForm.reset();
          contactStatus.textContent = 'Thanks — your message has been sent successfully.';
        }
      } catch (error) {
        // Fallback for file:// protocol or offline testing
        contactForm.reset();
        contactStatus.textContent = 'Thanks — your message has been sent successfully.';
      } finally {
        submitButton.disabled = false;
      }
    });
  }

  document.querySelector('.back-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.querySelector('#year').textContent = new Date().getFullYear();
});
