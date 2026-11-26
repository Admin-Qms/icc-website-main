const players = new WeakMap();

function playIfReady(video, player) {
  if (!video.isConnected || !player.wantsPlayback || !player.ready) return;
  if (player.hls && !player.hls.loadingEnabled) {
    player.hls.startLoad(video.currentTime || -1);
  }
  if (video.paused) void video.play().catch(() => {});
}

function fallBackToMp4(video, player) {
  if (!video.isConnected || players.get(video) !== player) return;
  const position = video.currentTime;
  player.hls?.destroy();
  player.hls = null;
  video.removeAttribute("src");
  if (position > 0) {
    video.addEventListener("loadedmetadata", () => {
      video.currentTime = Math.min(position, video.duration);
    }, { once: true });
  }
  video.load();
  player.ready = true;
  playIfReady(video, player);
}

function playNativeOrMp4(video, player, manifest) {
  if (!video.isConnected || players.get(video) !== player) return;
  if (!video.canPlayType("application/vnd.apple.mpegurl")) {
    fallBackToMp4(video, player);
    return;
  }

  player.nativeError = () => fallBackToMp4(video, player);
  video.addEventListener("error", player.nativeError, { once: true });
  video.src = manifest;
  player.ready = true;
  playIfReady(video, player);
}

async function setupStream(video, player) {
  const manifest = video.dataset.hls;
  if (!manifest) {
    player.ready = true;
    playIfReady(video, player);
    return;
  }

  if (video.canPlayType("application/vnd.apple.mpegurl") || !(window.MediaSource || window.ManagedMediaSource)) {
    playNativeOrMp4(video, player, manifest);
    return;
  }

  try {
    const { default: Hls } = await import("../vendor/hls-1.7.4/hls.light.min.mjs");
    if (!video.isConnected || players.get(video) !== player) return;
    if (!Hls.isSupported()) {
      playNativeOrMp4(video, player, manifest);
      return;
    }

    const hls = new Hls({
      autoStartLoad: false,
      capLevelToPlayerSize: true,
      maxBufferLength: 15,
      startLevel: 0,
      manifestLoadPolicy: {
        default: {
          maxTimeToFirstByteMs: 4000,
          maxLoadTimeMs: 8000,
          timeoutRetry: null,
          errorRetry: null,
        },
      },
    });
    player.hls = hls;
    hls.on(Hls.Events.ERROR, (_event, error) => {
      if (error.fatal) fallBackToMp4(video, player);
    });
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      player.ready = true;
      playIfReady(video, player);
    });
    hls.attachMedia(video);
    hls.loadSource(manifest);
  } catch {
    playNativeOrMp4(video, player, manifest);
  }
}

export function playHero(video) {
  if (!video.isConnected) return;
  const current = players.get(video);
  if (current) {
    current.wantsPlayback = true;
    playIfReady(video, current);
    return;
  }

  const player = { wantsPlayback: true, ready: false, hls: null, nativeError: null };
  players.set(video, player);
  void setupStream(video, player);
}

export function pauseHero(video) {
  const player = players.get(video);
  if (player) {
    player.wantsPlayback = false;
    player.hls?.stopLoad();
  }
  video.pause();
}

export function disposeHero(video) {
  const player = players.get(video);
  if (!player) return;
  players.delete(video);
  player.hls?.destroy();
  if (player.nativeError) video.removeEventListener("error", player.nativeError);
  video.pause();
  video.removeAttribute("src");
  video.load();
}
