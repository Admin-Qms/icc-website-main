"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContactForm } from "../ContactForm";
import { ArrowRight, Icon } from "../Icons";
import { IMAGEKIT_URL } from "@/lib/imagekit-loader";
import { MODULES } from "@/lib/site";

const VIDEO = "/videos/homepage-overview.mp4";
const MOBILE_VIDEO = "/videos/homepage-overview-720.mp4";
const DESKTOP_ASSET = `${IMAGEKIT_URL}/icc/website/homepage/overview-1080-eb36428bf2.mp4`;
const DESKTOP_CDN = `${DESKTOP_ASSET}?tr=orig-true`;
const HLS_MANIFEST = `${DESKTOP_ASSET}/ik-master.m3u8?tr=sr-360_480_720_1080`;
const MOBILE_CDN = `${IMAGEKIT_URL}/icc/website/homepage/overview-720-dc6d5ed762.mp4?tr=orig-true`;
const MOBILE_MEDIA = "(max-width: 767px)";
const POSTER = "/videos/homepage-overview-poster.webp";
const VIDEO_ID = "homepage-overview-video";
const PLAYBACK_MODULE = "/videos/hero-playback.js";
const PLAYER_BUTTON = "grid h-11 w-11 shrink-0 place-items-center rounded-full text-white hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white disabled:opacity-60";

// Start the visible hero on a direct visit while the rest of the page hydrates.
const START_HERO = `(() => {
  const video = document.getElementById(${JSON.stringify(VIDEO_ID)});
  if (!video || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();
    import(${JSON.stringify(PLAYBACK_MODULE)}).then(({ playHero }) => {
      if (!video.isConnected || video.getBoundingClientRect().bottom <= 0) return;
      playHero(video);
    }, () => {
      if (video.isConnected) video.play().catch(() => {});
    });
  });
  observer.observe(video);
})();`;

type HeroPlayback = {
  playHero(video: HTMLVideoElement): void;
  pauseHero(video: HTMLVideoElement): void;
  disposeHero(video: HTMLVideoElement): void;
};

function loadHeroPlayback(): Promise<HeroPlayback> {
  // This small module is shared with the pre-hydration player.
  return import(/* webpackIgnore: true */ PLAYBACK_MODULE);
}

function playVisibleVideo(video: HTMLVideoElement, canPlay: () => boolean) {
  void loadHeroPlayback().then(({ playHero }) => {
    if (canPlay()) playHero(video);
  }, () => {
    if (video.isConnected && canPlay()) void video.play().catch(() => {});
  });
}

function pauseVideo(video: HTMLVideoElement) {
  video.pause();
  void loadHeroPlayback().then(({ pauseHero }) => pauseHero(video), () => {});
}

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ambientRef = useRef<HTMLCanvasElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const bookingRef = useRef<HTMLButtonElement>(null);
  const wantsPlayback = useRef(false);
  const inViewport = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const playbackLabel = playing ? "Pause" : "Play";
  const soundLabel = muted ? "Unmute" : "Mute";

  useEffect(() => {
    setReady(true);
    const video = videoRef.current;
    if (!video) return;

    setPlaying(!video.paused);
    wantsPlayback.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(([entry]) => {
      const wasVisible = inViewport.current;
      inViewport.current = entry.isIntersecting;
      if (!inViewport.current) {
        if (wasVisible || !video.paused) pauseVideo(video);
      } else if (wantsPlayback.current && video.paused) {
        playVisibleVideo(video, () => wantsPlayback.current && inViewport.current);
      }
    });
    observer.observe(video);
    return () => {
      observer.disconnect();
      queueMicrotask(() => {
        if (!video.isConnected) {
          void loadHeroPlayback().then(({ disposeHero }) => disposeHero(video), () => {});
        }
      });
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const ambient = ambientRef.current?.getContext("2d");
    if (!video || !ambient) return;

    // Skip canvas work when the sharp video already fills the whole viewport.
    let visible = ambient.canvas.clientWidth > 0;
    const paintAmbient = () => {
      if (visible && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        ambient.drawImage(video, 0, 0, ambient.canvas.width, ambient.canvas.height);
      }
    };

    const observer = new ResizeObserver(([entry]) => {
      visible = entry.contentRect.width > 0;
      paintAmbient();
    });
    observer.observe(ambient.canvas);

    paintAmbient();
    video.addEventListener("loadeddata", paintAmbient);
    video.addEventListener("timeupdate", paintAmbient);
    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", paintAmbient);
      video.removeEventListener("timeupdate", paintAmbient);
    };
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    wantsPlayback.current = video.paused;
    if (video.paused) {
      playVisibleVideo(video, () => wantsPlayback.current && inViewport.current);
    } else {
      pauseVideo(video);
    }
  }

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <section aria-labelledby="homepage-heading">
      <div className="relative isolate overflow-hidden bg-navy-950 pt-[var(--home-nav-offset)] md:[--home-frame-height:calc(100svh-var(--home-nav-offset))]">
        <canvas
          ref={ambientRef}
          aria-hidden="true"
          width={96}
          height={54}
          className="home-hero-ambient pointer-events-none absolute inset-x-0 top-0 -z-10 h-[var(--home-nav-height)] w-full scale-110 bg-cover bg-center object-cover opacity-60 blur-2xl saturate-75 md:h-full"
          style={{ backgroundImage: `url(${POSTER})` }}
        />
        <div className="md:grid md:h-[var(--home-frame-height)] md:place-items-center">
          <div className="relative w-full md:max-w-[calc(var(--home-frame-height)*16/9)]">
            <h1 id="homepage-heading" className="sr-only">Quality and compliance management software</h1>
            <video
              ref={videoRef}
              id={VIDEO_ID}
              data-hls={HLS_MANIFEST}
              aria-label="ICC homepage overview"
              width={1920}
              height={1080}
              className="block aspect-video h-auto w-full object-contain"
              poster={POSTER}
              preload="none"
              crossOrigin="anonymous"
              muted
              playsInline
              loop
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            >
              <source src={MOBILE_CDN} type="video/mp4" media={MOBILE_MEDIA} />
              <source src={MOBILE_VIDEO} type="video/mp4" media={MOBILE_MEDIA} />
              <source src={DESKTOP_CDN} type="video/mp4" />
              <source src={VIDEO} type="video/mp4" />
              <a href={VIDEO}>Watch the ICC homepage overview</a>
            </video>
            <script dangerouslySetInnerHTML={{ __html: START_HERO }} />

            <div className="flex items-center justify-between gap-2 bg-navy-950/75 px-4 py-2 sm:px-6 md:pointer-events-none md:absolute md:inset-x-0 md:bottom-0 md:bg-transparent md:px-[clamp(2rem,4vw,6rem)] md:pb-[clamp(5.75rem,9svh,8rem)]">
              <div className="flex items-center gap-1 md:pointer-events-auto md:rounded-full md:border md:border-white/20 md:bg-navy-900/90 md:px-1.5">
                <button type="button" className={PLAYER_BUTTON} aria-label={playbackLabel} title={playbackLabel} onClick={togglePlayback} disabled={!ready}>
                  <Icon name={playing ? "pause" : "play"} className="h-5 w-5" aria-hidden="true" />
                </button>
                <button type="button" className={PLAYER_BUTTON} aria-label={soundLabel} title={soundLabel} onClick={toggleSound} disabled={!ready}>
                  <Icon name={muted ? "volume-off" : "volume"} className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <button
                ref={bookingRef}
                type="button"
                aria-haspopup="dialog"
                disabled={!ready}
                onClick={() => dialogRef.current?.showModal()}
                className="btn-primary group shrink-0 gap-2 px-4 py-3 disabled:opacity-60 md:pointer-events-auto md:rounded-full md:bg-white md:px-6 md:py-3.5 md:text-base md:text-navy-900 md:shadow-lg md:hover:bg-teal-50 md:focus-visible:ring-white md:focus-visible:ring-offset-navy-900"
              >
                Book a demo
                <ArrowRight className="h-4 w-4 motion-safe:transition-transform motion-safe:group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>

        <dialog
          ref={dialogRef}
          aria-label="Book a demo"
          onClose={() => bookingRef.current?.focus()}
          onClick={(event) => {
            if (event.target === event.currentTarget) event.currentTarget.close();
          }}
          className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto overscroll-contain rounded-2xl bg-transparent p-0 shadow-2xl backdrop:bg-navy-900/50"
        >
          <div className="relative">
            <ContactForm compact title="Book a demo" submitLabel="Request demo" />
            <button
              type="button"
              aria-label="Close demo form"
              onClick={() => dialogRef.current?.close()}
              className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-lg text-navy-900 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700"
            >
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </dialog>
      </div>

      <div className="border-y border-slate-200 bg-white">
        <div className="container-page py-8">
          <p className="mb-5 text-center text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Everything your quality system needs, in one platform
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {MODULES.map((module) => (
              <li key={module.slug}>
                <Link
                  href={`/solutions/${module.slug}`}
                  className="group flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-navy-800 shadow-sm transition-colors hover:border-teal-300 hover:text-teal-700"
                >
                  <span className="grid h-6 w-6 place-items-center rounded bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                    <Icon name={module.icon} className="h-4 w-4" />
                  </span>
                  {module.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
