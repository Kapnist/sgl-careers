# SGL Careers – Web Developer / IT Assistant (responsive redesign)

[![CI/CD](https://github.com/Kapnist/sgl-careers/actions/workflows/ci.yml/badge.svg)](https://github.com/Kapnist/sgl-careers/actions/workflows/ci.yml)

Live: [English](https://kapnist.github.io/sgl-careers/) · [Français](https://kapnist.github.io/sgl-careers/fr.html)

Responsive, optimized redesign of the SGL job posting page
[Web Developer – IT Assistant](https://www.sgl.com/careers-Web%20Developer%20-%20IT%20Assistant.html).

![Mobile preview](apercu-mobile.png)

## Features

- **Bilingual EN / FR**: `index.html` (English) and `fr.html` (French, unofficial translation),
  EN | FR switch in the header, `hreflang` links, French browsers redirected to `fr.html`
  on first visit; the visitor's explicit choice is remembered
- Static pages, no dependencies; shared `css/styles.css` and `js/main.js`
- Fluid typography and spacing (`clamp()`), tested from 320px to 1920px
- Mobile: hamburger menu, sticky "Apply by email" button, full-width touch targets (≥44px)
- Tablet: sidebar cards in two columns; desktop: sticky apply sidebar
- Banners always shown whole, capped at 1280px with a blurred fill on wide screens
- Accessibility: semantic HTML, skip link, visible focus, alt text, Escape closes the menu
- SEO: meta description and `JobPosting` structured data
- Print stylesheet

## Usage

Open `index.html` (English) or `fr.html` (French) in a browser. Images are in `images/` (taken from the original site).

## CI/CD

GitHub Actions ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) runs on every push and pull request:

1. **Validate** – `html-validate` checks the markup of both pages.
2. **Test** – Playwright runs 16 tests on both languages:
   - no WCAG 2.1 A/AA violations (axe-core) at 375 px and 1440 px
   - no horizontal scrolling at 320, 375, 768, 1024, 1440 and 1920 px
   - every local file loads, no JavaScript errors, every relative link resolves
   - `lang` and `hreflang` are correct, the EN/FR switch works, a French browser lands on `fr.html` and an explicit EN choice is kept
   - the mobile menu reports `aria-expanded` and closes with Escape
   - apply buttons open an email with the position title as subject
3. **Deploy** – only when every test passes on `main`, the public files (`index.html`, `fr.html`, `css/`, `js/`, `images/`) are published to GitHub Pages.

Run the same checks locally:

```bash
npm ci
npx playwright install chromium
npm run check
```

## Built with

AI-assisted development (Claude as coding assistant). Design decisions, accessibility review, testing and deployment by Kapnist Ngantah.

> Navigation links still point to the original www.sgl.com pages, which are not responsive.
