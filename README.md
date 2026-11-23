# MOLDIN exact visual site

This is a code-built MOLDIN landing page reconstructed from the supplied 1024 × 1536 visual reference. The PNG is retained only as a local comparison asset and is not loaded by the browser.

To run locally, use `npm run dev`, then visit `http://localhost:3232`.

The component layout uses the reference’s 1024 × 1536 coordinate system and scales proportionally. Navigation and CTA links are interactive demo links; no signup backend is connected.

## Files

- `index.html` — app entry point
- `main.js` — nine native browser components for the page structure
- `styles.css` — source-code layout, typography, CSS neon forms, waves, cards, and responsive scaling
- `assets/characters/` — four separate transparent creator portrait assets
- `assets/moldin-reference.png` — supplied reference artwork, retained only for visual comparison
- `package.json` and `server.js` — local development server (`npm run dev`)
