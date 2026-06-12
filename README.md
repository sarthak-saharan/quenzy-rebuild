# Quenzy — Conversion Prototype

A pitch-ready conversion prototype built on top of [thequenzy.com](https://thequenzy.com) to demonstrate 3 high-impact improvements to the current Shopify storefront.

**Live demo → https://sarthak-saharan.github.io/quenzy-rebuild/**

---

## What's different from the live site

### 1. Scratch Card Lead Capture
The current site has no email or WhatsApp capture. This prototype adds a gamified scratch card that fires 2 seconds after landing. The discount code (`FIZZY20`) is only revealed after the visitor submits their WhatsApp number — turning anonymous traffic into CRM leads before they bounce.

### 2. Find Your Fizz — Flavour Quiz
The current site drops visitors on a product grid with no guidance. This prototype adds a 4-question quiz (vibe → health goal → taste mood → frequency) that maps answers to a personalised flavour recommendation. Reduces decision paralysis and increases add-to-cart confidence.

### 3. Popzy — Brand Mascot
The current site has no mascot or character. This prototype introduces Popzy, a friendly animated character in the hero section with a speech bubble. Mascots increase brand recall, reduce bounce by adding personality to the first impression, and give the brand a face to build social content around.

### 4. Subscribe & Save Toggle
The current site has no subscription offering surfaced on the product page. This prototype adds a toggle on the result card with live 15% discount pricing, frequency selector (2 weeks / monthly / 6 weeks), and per-can price calculation. One tap to convert a one-time buyer into a recurring subscriber.

---

## Stack

- Vanilla HTML / CSS / JS — no build step, no dependencies
- Served via Python `http.server` locally (`python3 -m http.server 3456`)
- Hosted on GitHub Pages

## Run locally

```bash
git clone https://github.com/sarthak-saharan/quenzy-rebuild.git
cd quenzy-rebuild
python3 -m http.server 3456
# open http://localhost:3456
```

---

Built by Sarthak Saharan as a conversion-focused prototype for Quenzy.
