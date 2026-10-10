// Site-wide constants. Contact and education facts mirror the current resume.

export const BASE_PATH = process.env.NEXT_PUBLIC_ASSET_PREFIX ?? '';

/** Prefix a public-folder path with the GitHub Pages base path. */
export const asset = (path: string) => `${BASE_PATH}/${path.replace(/^\/+/, '')}`;

export const SITE_URL = 'https://zgeez.github.io/portfolio';

export const site = {
  title: "Ziad's Portfolio",
  name: 'Ziad Ghanem',
  role: 'Embedded & Firmware Engineer',
  tagline: 'I build systems where software meets physical hardware.',
  location: 'Brooklyn, NY',
  email: 'zghanema@gmail.com',
  github: 'https://github.com/zgeez',
  linkedin: 'https://linkedin.com/in/ziad-ghanem/',
  resume: asset('resume.pdf'),
  description:
    'Embedded and firmware engineering portfolio featuring STM32, ESP32, FreeRTOS, real-time acquisition, sensing, instrumentation, and hardware/software debugging.',
} as const;
