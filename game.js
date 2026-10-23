function decodeEndingProgress(serialized, levels) {
  let saved;
  try { saved = JSON.parse(serialized); } catch { saved = null; }
  return Object.fromEntries(Object.entries(levels).map(([id, level]) => [id,
    [...new Set(Array.isArray(saved?.[id]) ? saved[id].filter(code =>
      typeof code === 'string' && Object.hasOwn(level.endings, code)) : [])]
  ]));
}

function initCinema() {
  const levels = {barber: BARBER_LEVEL, forest: FOREST_LEVEL};
  const storageKey = 'cinema-endings-v1';
  const byId = id => document.getElementById(id);
  const library = byId('libraryView');
  const player = byId('playerView');
  const video = byId('povVideo');
  const image = byId('decisionImage');
  const status = byId('videoStatus');
  const errorPanel = byId('playbackError');
  const choicePanel = byId('choicePanel');
  const choices = byId('choicesBox');
  const endingPanel = byId('endingPanel');
  const countdown = byId('countdownValue');
  const countdownSeconds = byId('countdownSeconds');
  const countdownProgress = byId('countdownProgress');
  const pauseButton = byId('btnPause');
  const muteButton = byId('btnMute');
  const rulesDialog = byId('rulesDialog');
  const studioDialog = byId('studioDialog');
  const studioLevel = byId('studioLevel');
  const studioNode = byId('studioNode');
  const posterCheckbox = byId('studioPosterMode');
  const stage = byId('playerStage');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const animationTargets = '.story-card, #choicePanel, #choicesBox > *, #endingPanel';
  let levelId = 'barber';
  let current = null;
  let lastDecision = null;
  let modalSession = null;
  let lastStoryButton = null;
  let storageAvailable = true;
  let saved;

  function storageUnavailable() {
    storageAvailable = false;
    byId('storageNotice').hidden = false;
    byId('storageNotice').textContent = 'Trình duyệt không cho phép lưu tiến độ. Các kết cục chỉ được ghi nhớ trong lần mở này.';
  }

  try { saved = window.localStorage.getItem(storageKey); } catch { storageUnavailable(); }
  const progress = decodeEndingProgress(saved, levels);

  function renderProgress() {
    for (const [id, level] of Object.entries(levels)) {
      byId('libraryProgress_' + id).textContent = `${progress[id].length} / ${Object.keys(level.endings).length} kết cục`;
      const list = byId('libraryEndings_' + id);
      list.replaceChildren();
      for (const [code, label] of Object.entries(level.endings)) {
        if (!progress[id].includes(code)) continue;
        const item = document.createElement('li');
        item.textContent = label;
        list.append(item);
      }
    }
  }

  function unlockEnding(code) {
    if (!Object.hasOwn(levels[levelId].endings, code) || progress[levelId].includes(code)) return;
    progress[levelId].push(code);
    if (storageAvailable) {
      try { window.localStorage.setItem(storageKey, JSON.stringify(progress)); } catch { storageUnavailable(); }
    }
    renderProgress();
  }

  function killAnimations() {
    if (!window.gsap) return;
    window.gsap.killTweensOf(animationTargets);
    window.gsap.set(animationTargets, {clearProps: 'opacity,transform'});
  }

  function animate(target, delay = 0) {
    if (!window.gsap || reducedMotion.matches) return;
    window.gsap.fromTo(target, {opacity: 0, y: 18}, {
      opacity: 1, y: 0, duration: 0.5, delay, stagger: 0.08,
      ease: 'power2.out', clearProps: 'opacity,transform', overwrite: true
    });
  }

  function setButtonLabel(button, text) {
    button.querySelector('[data-label]').textContent = text;
    button.setAttribute('aria-label', text);
    button.title = text;
  }

  function renderState(scene) {
    if (current !== scene) return;
    let state = scene.phase;
    if (scene.phase === 'video') state = scene.buffering ? 'loading' : 'playing';
    if (scene.phase === 'poster') state = 'playing';
    if (scene.paused && scene.phase !== 'error' && scene.phase !== 'ending') state = 'paused';
    document.body.dataset.state = state;
    pauseButton.disabled = scene.phase === 'error' || scene.phase === 'ending';
    pauseButton.setAttribute('aria-pressed', String(scene.paused));
    setButtonLabel(pauseButton, scene.paused ? 'Tiếp tục' : 'Tạm dừng');
    for (const button of choices.children) button.disabled = scene.paused || scene.choiceLocked;
    if (state === 'paused') status.textContent = 'Đã tạm dừng. Nhấn Tiếp tục để trở lại.';
    else if (state === 'loading') status.textContent = 'Đang tải phân cảnh…';
    else if (scene.phase === 'poster') status.textContent = 'Chế độ ảnh tham chiếu';
    else status.textContent = '';
  }

  function stopClock(scene) {
    if (scene.clockId === null) return;
    scene.remaining = Math.max(0, scene.deadline - performance.now());
    clearTimeout(scene.clockId);
    scene.clockId = null;
  }

  function renderCountdown(scene) {
    const seconds = String(Math.ceil(scene.remaining / 1000)).padStart(2, '0');
    if (countdownSeconds.textContent !== seconds) {
      countdownSeconds.textContent = seconds;
      countdownProgress.setAttribute('aria-valuenow', String(Math.ceil(scene.remaining / 1000)));
    }
    countdown.style.setProperty('--time-left', String(scene.remaining / scene.clockDuration));
    countdown.classList.toggle('is-urgent', scene.remaining <= 5000);
  }

  function resumeClock(scene) {
    if (current !== scene || scene.paused || !scene.clockKind || scene.clockId !== null) return;
    scene.deadline = performance.now() + scene.remaining;
    function tick() {
      scene.clockId = null;
      if (current !== scene || scene.paused) return;
      scene.remaining = Math.max(0, scene.deadline - performance.now());
      if (scene.clockKind === 'choice') renderCountdown(scene);
      if (scene.remaining <= 0) {
        const kind = scene.clockKind;
        scene.clockKind = null;
        if (kind === 'choice') choose(scene, scene.node.defaultChoiceIndex ?? 0);
        else finishScene(scene);
        return;
      }
      scene.clockId = setTimeout(tick, Math.min(100, scene.remaining));
    }
    tick();
  }

  function startClock(scene, kind, milliseconds) {
    stopClock(scene);
    scene.clockKind = kind;
    scene.remaining = milliseconds;
    scene.clockDuration = milliseconds;
    resumeClock(scene);
  }

  function disposeNode() {
    const scene = current;
    current = null;
    if (scene) {
      stopClock(scene);
      scene.events.abort();
      scene.imageEvents?.abort();
    }
    video.pause();
    video.removeAttribute('src');
    video.load();
    image.hidden = true;
    image.removeAttribute('src');
    choicePanel.hidden = true;
    endingPanel.hidden = true;
    errorPanel.hidden = true;
    countdown.hidden = true;
    choices.replaceChildren();
    killAnimations();
  }

  function showError(scene, message) {
    if (current !== scene || scene.phase === 'error') return;
    stopClock(scene);
    scene.clockKind = null;
    scene.phase = 'error';
    scene.playRequest++;
    video.pause();
    choicePanel.hidden = true;
    endingPanel.hidden = true;
    errorPanel.hidden = false;
    byId('playbackErrorText').textContent = message;
    renderState(scene);
    if (!rulesDialog.open && !studioDialog.open) byId('btnRetryVideo').focus({preventScroll: true});
  }

  function loadStill(scene, path, ready) {
    scene.imageEvents?.abort();
    const events = new AbortController();
    scene.imageEvents = events;
    const source = new URL(path, document.baseURI).href;
    let delivered = false;
    const onLoad = () => {
      if (current !== scene || delivered || image.currentSrc !== source || !image.naturalWidth) return;
      delivered = true;
      ready();
    };
    image.addEventListener('load', onLoad, {signal: events.signal});
    image.addEventListener('error', () => {
      if (current === scene && image.src === source) showError(scene, `Không tải được ảnh chờ: ${path}. Kiểm tra tài nguyên rồi thử lại.`);
    }, {signal: events.signal});
    image.alt = 'Khung hình chờ của câu chuyện';
    image.hidden = false;
    image.src = path;
    if (image.complete && image.naturalWidth) onLoad();
  }

  function requestPlayback(scene) {
    if (current !== scene || scene.paused || scene.phase !== 'video') return;
    if (video.ended && video.currentSrc === scene.source) { finishScene(scene); return; }
    const request = ++scene.playRequest;
    scene.buffering = true;
    renderState(scene);
    const promise = video.play();
    if (promise) promise.catch(error => {
      if (current !== scene || request !== scene.playRequest || scene.paused || scene.phase !== 'video') return;
      const explanation = error.name === 'NotAllowedError'
        ? 'Trình duyệt chưa cho phép phát video. Nhấn Thử lại để phát.'
        : `Không phát được video: ${error.message || error.name}. Kiểm tra tài nguyên rồi thử lại.`;
      showError(scene, explanation);
    });
  }

  function startVideo(scene) {
    const source = new URL(scene.node.clipPath, document.baseURI).href;
    scene.phase = 'video';
    scene.buffering = true;
    scene.source = source;
    const active = () => current === scene && scene.phase === 'video' && video.currentSrc === source;
    const listen = (name, handler) => video.addEventListener(name, handler, {signal: scene.events.signal});
    listen('loadedmetadata', () => {
      if (!active() || video.readyState < 1) return;
      byId('timelineFill').style.width = '0%';
    });
    listen('timeupdate', () => {
      if (!active() || !Number.isFinite(video.duration) || video.duration <= 0) return;
      byId('timelineFill').style.width = Math.min(100, video.currentTime / video.duration * 100) + '%';
    });
    listen('playing', () => {
      if (!active()) return;
      if (scene.paused) { video.pause(); return; }
      scene.buffering = false;
      renderState(scene);
    });
    for (const event of ['waiting', 'stalled']) listen(event, () => {
      if (!active() || scene.paused || video.paused) return;
      scene.buffering = true;
      renderState(scene);
    });
    listen('pause', () => {
      if (active() && video.paused && !video.ended && !scene.paused) pauseScene(scene);
    });
    listen('ended', () => {
      if (active() && video.ended && !scene.paused) finishScene(scene);
    });
    listen('error', () => {
      if (current !== scene || scene.phase !== 'video' || !video.error || video.src !== source) return;
      const errors = {1: 'Việc tải video đã bị hủy.', 2: 'Không đọc được tệp video.', 3: 'Trình duyệt không giải mã được video.', 4: 'Tệp video không tồn tại hoặc định dạng không được hỗ trợ.'};
      showError(scene, `${errors[video.error.code] || 'Có lỗi phát video.'} ${scene.node.clipPath} — nhấn Thử lại sau khi kiểm tra tài nguyên.`);
    });
    image.hidden = true;
    video.poster = scene.node.keyPath;
    video.src = scene.node.clipPath;
    video.load();
    renderState(scene);
    requestPlayback(scene);
  }

  function focusSceneTitle() {
    const title = byId('sceneTitle');
    title.tabIndex = -1;
    title.focus({preventScroll: true});
  }

  function loadNode(id, decisionOnly = false, posterMode = false) {
    const node = levels[levelId].nodes[id];
    if (!node) return;
    disposeNode();
    const scene = {
      node, phase: 'loading', paused: false, completed: false, choiceLocked: false,
      decisionOnly, posterMode, playRequest: 0, buffering: false,
      clockId: null, clockKind: null, remaining: 0, clockDuration: 0, deadline: 0,
      events: new AbortController(), imageEvents: null
    };
    current = scene;
    if (node.choices?.length) lastDecision = node.id;
    byId('sceneTitle').textContent = node.ending && !progress[levelId].includes(node.ending.code)
      ? 'Kết cục đang mở ra' : node.title;
    byId('sceneSubtitle').textContent = node.subtitle || '';
    byId('timelineFill').style.width = '0%';
    renderState(scene);
    focusSceneTitle();
    if (decisionOnly) {
      loadStill(scene, node.decisionPath || node.keyPath, () => finishScene(scene));
    } else if (posterMode) {
      loadStill(scene, node.keyPath, () => {
        if (scene.phase === 'error') return;
        scene.phase = 'poster';
        renderState(scene);
        startClock(scene, 'poster', 3200);
      });
    } else startVideo(scene);
  }

  function showChoices(scene) {
    if (current !== scene || scene.phase === 'error') return;
    scene.phase = 'decision';
    byId('choiceQuestion').textContent = scene.node.promptQuestion || 'Bạn sẽ làm gì?';
    byId('choiceHint').textContent = levelId === 'forest'
      ? 'Không giới hạn thời gian. Chọn trên màn hình hoặc nhấn phím 1 / 2.'
      : 'Chọn trước khi hết giờ. Nếu chờ, câu chuyện sẽ tự quyết định. Phím 1 / 2.';
    for (const [index, choice] of scene.node.choices.entries()) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice-button';
      const number = document.createElement('span');
      number.className = 'choice-number';
      number.textContent = String(index + 1).padStart(2, '0');
      number.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span');
      label.className = 'choice-label';
      label.textContent = choice.label;
      button.append(number, label);
      button.addEventListener('click', () => choose(scene, index));
      choices.append(button);
    }
    choicePanel.hidden = false;
    countdown.hidden = levelId === 'forest';
    if (levelId !== 'forest') {
      const seconds = scene.node.timerSeconds || 15;
      countdownProgress.setAttribute('aria-valuemax', String(seconds));
      startClock(scene, 'choice', seconds * 1000);
    }
    renderState(scene);
    animate(choicePanel);
    animate(choices.children, 0.08);
    if (!scene.paused && !rulesDialog.open && !studioDialog.open) choices.firstElementChild?.focus({preventScroll: true});
  }

  function finishScene(scene) {
    if (current !== scene || scene.completed || scene.phase === 'error') return;
    scene.completed = true;
    scene.playRequest++;
    stopClock(scene);
    scene.clockKind = null;
    scene.phase = 'loading';
    video.pause();
    byId('timelineFill').style.width = '100%';
    if (scene.node.next) {
      loadNode(scene.node.next, false, scene.posterMode);
    } else if (scene.node.ending) {
      scene.phase = 'ending';
      scene.paused = false;
      const ending = scene.node.ending;
      unlockEnding(ending.code);
      byId('sceneTitle').textContent = scene.node.title;
      byId('endingTitle').textContent = ending.title;
      byId('endingDesc').textContent = ending.desc;
      byId('endingProgress').textContent = `Đã khám phá ${progress[levelId].length} / ${Object.keys(levels[levelId].endings).length} kết cục`;
      byId('btnRetryEnding').textContent = ending.retryLabel || 'Thử lại ngã rẽ trước';
      endingPanel.hidden = false;
      renderState(scene);
      animate(endingPanel);
      byId('endingTitle').tabIndex = -1;
      if (!rulesDialog.open && !studioDialog.open) byId('endingTitle').focus({preventScroll: true});
    } else if (scene.node.choices?.length) {
      renderState(scene);
      loadStill(scene, scene.node.decisionPath || scene.node.keyPath, () => showChoices(scene));
    }
  }

  function choose(scene, index) {
    if (current !== scene || scene.phase !== 'decision' || scene.paused || scene.choiceLocked || rulesDialog.open || studioDialog.open) return;
    const choice = scene.node.choices[index];
    if (!choice) return;
    scene.choiceLocked = true;
    stopClock(scene);
    for (const button of choices.children) button.disabled = true;
    loadNode(choice.next, false, scene.posterMode);
  }

  function pauseScene(scene) {
    if (current !== scene || scene.paused || scene.phase === 'ending' || scene.phase === 'error') return;
    scene.paused = true;
    scene.playRequest++;
    stopClock(scene);
    video.pause();
    renderState(scene);
  }

  function resumeScene(scene) {
    if (current !== scene || !scene.paused || rulesDialog.open || studioDialog.open) return;
    scene.paused = false;
    renderState(scene);
    if (scene.phase === 'video') requestPlayback(scene);
    else resumeClock(scene);
  }

  function closeDialogs() {
    modalSession = null;
    if (rulesDialog.open) rulesDialog.close();
    if (studioDialog.open) studioDialog.close();
  }

  function openDialog(dialog) {
    if (dialog.open) return;
    modalSession = current ? {scene: current, resume: !current.paused} : null;
    if (current) pauseScene(current);
    dialog.showModal();
  }

  for (const dialog of [rulesDialog, studioDialog]) dialog.addEventListener('close', () => {
    const session = modalSession;
    modalSession = null;
    if (session?.resume && current === session.scene) resumeScene(session.scene);
  });

  function selectLevel(id) {
    levelId = id;
    lastDecision = null;
    document.body.dataset.theme = id;
    byId('storyLabel').textContent = levels[id].title;
    byId('rulesTitle').textContent = levels[id].rulesTitle;
    byId('rulesList').innerHTML = levels[id].rules;
  }

  function openPlayer(id, nodeId, posterMode = false) {
    closeDialogs();
    selectLevel(id);
    library.hidden = true;
    player.hidden = false;
    document.body.dataset.screen = 'player';
    loadNode(nodeId || levels[id].start, false, posterMode);
  }

  function showLibrary(ask = true) {
    const scene = current;
    if (ask && scene && scene.phase !== 'ending') {
      const wasPaused = scene.paused;
      pauseScene(scene);
      if (!window.confirm('Rời câu chuyện và bỏ lượt chơi hiện tại? Các kết cục đã khám phá vẫn được lưu.')) {
        if (!wasPaused) resumeScene(scene);
        return;
      }
    }
    closeDialogs();
    disposeNode();
    library.hidden = false;
    player.hidden = true;
    document.body.dataset.screen = 'library';
    document.body.dataset.state = 'playing';
    status.textContent = '';
    pauseButton.disabled = true;
    if (document.fullscreenElement === stage) document.exitFullscreen().catch(error => {
      status.textContent = 'Không thoát được toàn màn hình: ' + error.message;
    });
    renderProgress();
    animate('.story-card');
    if (lastStoryButton) lastStoryButton.focus({preventScroll: true});
  }

  function renderStudioMetadata() {
    const node = levels[studioLevel.value].nodes[studioNode.value];
    if (!node) return;
    byId('studioClip').textContent = node.clipPath;
    byId('studioKeyframe').textContent = node.keyPath;
    byId('studioImagePrompt').textContent = node.imgPrompt || 'Không có prompt tạo ảnh — đây là video được nhập sẵn.';
    byId('studioMotionPrompt').textContent = node.motionPrompt || 'Không có prompt chuyển động — đây là video được nhập sẵn.';
  }

  function populateStudio(selectedNode) {
    studioNode.replaceChildren();
    for (const node of Object.values(levels[studioLevel.value].nodes)) {
      const option = document.createElement('option');
      option.value = node.id;
      option.textContent = `${node.id} · ${node.title}`;
      studioNode.append(option);
    }
    if (selectedNode && Object.hasOwn(levels[studioLevel.value].nodes, selectedNode)) studioNode.value = selectedNode;
    renderStudioMetadata();
  }

  for (const button of document.querySelectorAll('[data-story]')) button.addEventListener('click', () => {
    if (!Object.hasOwn(levels, button.dataset.story)) return;
    lastStoryButton = button;
    openPlayer(button.dataset.story);
  });
  byId('btnLibrary').addEventListener('click', () => showLibrary());
  byId('btnEndingLibrary').addEventListener('click', () => showLibrary());
  byId('btnReplay').addEventListener('click', () => {
    if (current?.phase === 'ending') loadNode(levels[levelId].start, false, current.posterMode);
  });
  byId('btnRetryEnding').addEventListener('click', () => {
    if (current?.phase !== 'ending') return;
    const scene = current;
    const ending = scene.node.ending;
    loadNode(ending.retry || lastDecision || levels[levelId].start, Boolean(ending.retryWaiting), scene.posterMode);
  });
  byId('btnRetryVideo').addEventListener('click', () => {
    if (current?.phase === 'error') loadNode(current.node.id, current.decisionOnly, current.posterMode);
  });
  pauseButton.addEventListener('click', () => {
    if (!current) return;
    if (current.paused) resumeScene(current);
    else pauseScene(current);
  });
  muteButton.addEventListener('click', () => {
    video.muted = !video.muted;
    renderMute();
  });
  function renderMute() {
    muteButton.setAttribute('aria-pressed', String(video.muted));
    setButtonLabel(muteButton, video.muted ? 'Bật tiếng' : 'Tắt tiếng');
  }
  video.addEventListener('volumechange', renderMute);
  byId('btnRules').addEventListener('click', () => openDialog(rulesDialog));
  byId('btnOpenStudio').addEventListener('click', () => {
    studioLevel.value = levelId;
    populateStudio(current?.node.id);
    openDialog(studioDialog);
  });
  studioLevel.addEventListener('change', () => populateStudio());
  studioNode.addEventListener('change', renderStudioMetadata);
  byId('btnStudioJump').addEventListener('click', () => {
    const id = studioLevel.value;
    const nodeId = studioNode.value;
    if (Object.hasOwn(levels, id) && Object.hasOwn(levels[id].nodes, nodeId)) openPlayer(id, nodeId, posterCheckbox.checked);
  });
  const fullscreenButton = byId('btnFullscreen');
  fullscreenButton.disabled = !stage.requestFullscreen;
  fullscreenButton.addEventListener('click', () => {
    const promise = document.fullscreenElement ? document.exitFullscreen() : stage.requestFullscreen();
    promise.catch(error => { status.textContent = 'Không mở được toàn màn hình: ' + error.message; });
  });
  document.addEventListener('fullscreenchange', () => {
    const label = document.fullscreenElement ? 'Thoát toàn màn hình' : 'Toàn màn hình';
    fullscreenButton.setAttribute('aria-label', label);
    fullscreenButton.title = label;
  });
  window.addEventListener('keydown', event => {
    if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || rulesDialog.open || studioDialog.open) return;
    if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"])')) return;
    if (!current || current.phase !== 'decision' || current.paused || choicePanel.hidden) return;
    if (event.key === '1' || event.key === '2') {
      event.preventDefault();
      choose(current, Number(event.key) - 1);
    }
  });
  window.addEventListener('pagehide', () => showLibrary(false));
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) killAnimations(); });
  selectLevel('barber');
  studioLevel.value = levelId;
  populateStudio();
  renderMute();
  showLibrary(false);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initCinema, {once: true});
else initCinema();
