# Oudio Modal Beta (WordPress plugin)

Gutenberg block: slide-in checkout modal from the right, iframe embed, optional conversion tracking via Oudio **embed-tracker.js v2**.

**Install folder:** `wp-content/plugins/oudio-modal-beta/` (main file `oudio-modal-beta.php`). Use this name so you can run it **alongside** the legacy **Oudio Modal Block** plugin (`oudio-modal-block/`) without PHP or block-name collisions.

**Repository:** [github.com/exzenter/oudio-modal](https://github.com/exzenter/oudio-modal) — upstream; contributions via fork + pull request.

**Source of truth (development):** `wordpress-oudio-modal/` in the [Oudio monorepo](https://github.com/timbencker/oudio-toys) (`development` branch).

### Publishing changes (fork → PR)

Contributors without write access to `exzenter/oudio-modal`:

1. Fork [exzenter/oudio-modal](https://github.com/exzenter/oudio-modal) on GitHub.
2. From the monorepo root, export this folder and push to your fork:

```powershell
git subtree split --prefix=wordpress-oudio-modal -b oudio-modal-beta-export
git push git@github.com:YOUR_USER/oudio-modal.git oudio-modal-beta-export:beta/v1.2.1
```

3. Open a **draft** pull request: `YOUR_USER:beta/v1.2.1` → `exzenter:master`. Mark **Beta — not for production** until Oudio prod embed checkout is live.

## Requirements

- WordPress 6.3+, PHP 8.0+
- Oudio embed checkout URL (`/embed/checkout?token=…`)
- Seller domain registered in Oudio **`EMBED_ALLOWED_ORIGINS`**
- Oudio host deployed with **multi-controller** `embed-tracker.js` (v2)

## Install

### Without npm (use committed `build/`)

1. Copy or clone this plugin into `wp-content/plugins/oudio-modal-beta/`
2. Activate **Oudio Modal Beta** in WordPress admin

### With npm (development)

```powershell
cd oudio-modal-beta
npm install
npm run build
```

Always run `npm run build` after editing `src/` — WordPress loads assets from `build/`.

## Usage

1. Add the **Oudio Modal Beta** block to a page (typically at the end of content).
2. Set **iFrame URL** to your Oudio embed checkout URL.
3. Add the block’s **Trigger CSS Class** (default `oudio-open-modal-beta`) to any button or link on the page.
4. Configure **Modal Width** for desktop / tablet / mobile as needed.

## Conversion tracking

In the block inspector → **Conversion tracking**:

1. Enable **Oudio embed tracker**
2. Set **Oudio app origin** (e.g. `https://staging.oudio.io`)
3. Add **Meta**, **GA4**, and/or **TikTok** pixel IDs (optional gates — plugin does **not** inject pixels)

**Purchase / StartTrial:** fires when checkout completes in the iframe. With **GA4 measurement ID** set, calls **`gtag('event', 'purchase')`**. With **no GA4 ID**, pushes **`dataLayer`** when present (GTM-only setups — do not set both or you may double-count). Also calls **`fbq`** or **`ttq`** when pixel IDs and globals exist — the plugin does **not** inject tags.

**Allowlist:** if checkout cannot resolve your site origin, the browser console warns via `onPostMessageTargetMissing` — register the domain in Oudio **`EMBED_ALLOWED_ORIGINS`**.

**Consent (CMP):** set **Consent function name** to a global function that returns `false` to skip pixels (e.g. `myOudioShouldTrack` → `window.myOudioShouldTrack = () => cookieConsent.marketing`).

**Multiple blocks:** each block registers its own iframe selector (`OudioEmbed.enqueueInit`). Use a **unique trigger class per block**. One `embed-tracker.js` script loads per page.

See [Embed checkout – parent events & analytics](/licensing/docs/embed-checkout-parent-events) for the full postMessage contract.

## Behaviour (1.2.1 beta)

- Block type: `oudio/modal-beta` (distinct from legacy `oudio/modal-block`).
- Modal closes automatically when checkout sends `oudio_embed_checkout_close` (complete or expired).
- Focus trap inside open panel; focus returns to trigger on close.
- Body scroll lock uses a refcount (safe with multiple modals).

## Version

Plugin **1.2.1** — tracker URL `embed-tracker.js?v=2`.

## Related docs

- [WordPress – embedded checkout on Oudio docs](https://oudio.io/licensing/docs/wordpress-checkout-embed-iframe)
- [Embed checkout – parent events & analytics](https://oudio.io/licensing/docs/embed-checkout-parent-events)
