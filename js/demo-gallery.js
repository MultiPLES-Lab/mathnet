(() => {
  const gallery = document.querySelector('[data-demo-gallery]');
  if (!gallery) return;

  const clips = [...gallery.querySelectorAll('[data-demo-clip]')];
  const videos = clips.map(clip => clip.querySelector('video'));
  const dialog = document.querySelector('.demo-viewer');
  const player = dialog.querySelector('video');
  const motion = document.querySelector('.demo-motion');
  const error = dialog.querySelector('.demo-error');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visible = new Set();
  let paused = reducedMotion.matches || Boolean(navigator.connection?.saveData);
  let selected = 0;
  let viewerVersion = 0;

  function load(video) {
    if (!video.hasAttribute('src')) {
      video.muted = true;
      video.src = video.dataset.src;
      video.load();
    }
  }

  function shouldPlay(video) {
    return !paused && !document.hidden && !dialog.open && visible.has(video);
  }

  function syncPlayback() {
    videos.forEach(video => {
      if (shouldPlay(video)) {
        load(video);
        video.play().then(() => {
          // A pending play may resolve after scrolling away or opening the viewer.
          if (!shouldPlay(video)) video.pause();
        }).catch(() => {}); // The poster and full-size player remain usable.
      } else {
        video.pause();
      }
    });
    motion.setAttribute('aria-pressed', String(paused));
    motion.setAttribute('aria-label', paused ? 'Play all videos' : 'Pause all videos');
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
          visible.add(entry.target);
        } else {
          visible.delete(entry.target);
        }
      });
      syncPlayback();
    }, { threshold: [0, 0.15] });
    videos.forEach(video => observer.observe(video));
  } else {
    // Avoid downloading an entire gallery on older browsers.
    paused = true;
    videos.forEach(video => visible.add(video));
  }

  motion.hidden = false;
  motion.addEventListener('click', () => {
    paused = !paused;
    syncPlayback();
  });
  reducedMotion.addEventListener('change', event => {
    paused = event.matches;
    syncPlayback();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) player.pause();
    syncPlayback();
  });

  function showVideo(index) {
    selected = (index + clips.length) % clips.length;
    const clip = clips[selected];
    const version = ++viewerVersion;
    error.hidden = true;
    player.pause();
    player.poster = videos[selected].poster;
    player.setAttribute('aria-label', clip.dataset.label);
    player.src = clip.href;
    player.muted = true;
    dialog.querySelector('.demo-original-link').href = clip.href;
    player.load();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('viewer-open');
    syncPlayback();
    player.play().then(() => {
      if (!dialog.open || document.hidden) player.pause();
    }).catch(() => {
      if (version === viewerVersion && player.error) error.hidden = false;
    });
  }

  clips.forEach((clip, index) => {
    clip.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      showVideo(index);
    });
  });

  dialog.querySelector('.demo-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.demo-previous').addEventListener('click', () => showVideo(selected - 1));
  dialog.querySelector('.demo-next').addEventListener('click', () => showVideo(selected + 1));
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('keydown', event => {
    // Leave native video-control keys available for seeking and volume.
    if (event.target === player) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showVideo(selected + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('close', () => {
    ++viewerVersion;
    player.pause();
    player.removeAttribute('src');
    player.load();
    error.hidden = true;
    document.body.classList.remove('viewer-open');
    syncPlayback();
  });
  player.addEventListener('error', () => {
    if (dialog.open && player.hasAttribute('src')) error.hidden = false;
  });
  syncPlayback();
})();
