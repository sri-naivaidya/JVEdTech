# JV EdTech Medovation — Website

React + Tailwind CSS + GSAP cinematic preloader for [JV EdTech Medovation](https://jvedtech.com).

## Features

- **Cinematic preloader** — split-letter reveal, 0→100 counter, progress bar, curtain transition (GSAP)
- **Full landing page** — Hero, About, Services, Medi AI initiative, Contact
- **Responsive** — mobile-friendly navigation and layout

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Customize preloader

Edit `src/components/Preloader.jsx`:

- `LETTERS` / `TAGLINE` — brand text
- GSAP timeline durations and easing
- Curtain timing at `3.15s` in the timeline

## Stack

- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [GSAP](https://gsap.com)
