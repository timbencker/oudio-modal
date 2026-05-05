# Oudio Modal Block

Ein WordPress Gutenberg-Block der ein **vollwertiges Slide-In-Modal von rechts** erzeugt – perfekt für Checkout-iFrames wie den Oudio Embed.

---

## ✅ Features

| Feature | Details |
|---|---|
| Slide-in von rechts | CSS `transform: translateX(100%)` → `0` mit konfigurierbarer Dauer |
| Full-height | `top:0; bottom:0` – immer volle Höhe |
| Rechts-alignt | `right:0; position:fixed` |
| Trigger per CSS-Klasse | Jedes Element auf der Seite mit der definierten Klasse öffnet das Modal |
| Responsive | Separate Breiten-Einstellungen für Desktop / Tablet / Mobile |
| iFrame-Konfiguration | URL, Title, allow, referrerpolicy, lazy-load |
| Close-Button | Schwebend links vom Panel (auf Mobile: oben rechts im Panel) |
| Overlay-Klick | Optional schließt das Modal |
| ESC-Taste | Optional schließt das Modal |
| MutationObserver | Funktioniert auch mit dynamisch geladenen Trigger-Elementen |
| Kein Bundler nötig | `build/` enthält bereits fertige JS/CSS-Dateien |

---

## 🚀 Installation

### Option A – ohne npm (sofort einsatzbereit)

1. Den Ordner `oudio-modal-block/` in dein WordPress-Plugin-Verzeichnis kopieren:
   ```
   wp-content/plugins/oudio-modal-block/
   ```
2. Plugin in WordPress aktivieren → fertig.

### Option B – mit npm (für Entwicklung / Anpassungen)

```powershell
cd oudio-modal-block
npm install
npm run build
```

---

## 📦 Verwendung

### 1. Block einfügen

In Gutenberg nach **„Oudio Modal"** suchen und den Block auf jeder Seite/Post einfügen (am besten am Ende des Content-Bereichs oder in einem reusable block).

### 2. iFrame URL konfigurieren

Im Block-Inspector (rechte Sidebar):

```
iFrame URL: https://staging.oudio.io/embed/checkout?token=eyJ...
iFrame Title: Checkout
allow: payment *
referrerpolicy: strict-origin-when-cross-origin
```

Beispiel-iFrame das akzeptiert wird:
```html
<iframe
  title="Checkout"
  src="https://staging.oudio.io/embed/checkout?token=eyJwbH..."
  width="100%"
  height="720"
  style="width:100%;min-height:720px;border:0;display:block"
  loading="lazy"
  allow="payment *"
  referrerpolicy="strict-origin-when-cross-origin"
></iframe>
```
→ Einfach die `src` URL in das Feld eintragen.

### 3. Trigger-Klasse vergeben

Standard-Klasse: `oudio-open-modal`

Jedes Element auf der Seite dem diese Klasse gegeben wird öffnet das Modal beim Klicken.

**Beispiele:**

Ein Button:
```html
<button class="oudio-open-modal">Jetzt kaufen</button>
```

Ein Bild:
```html
<img src="..." class="oudio-open-modal" alt="Produkt">
```

Ein beliebiges `<div>`:
```html
<div class="oudio-open-modal" style="cursor:pointer;">Klick mich</div>
```

> Du kannst auch eine eigene Trigger-Klasse definieren – z.B. `mein-checkout-trigger`. Dann trägst du diese im Block-Inspector unter **Trigger CSS Class** ein.

### 4. Responsive Breiten

| Breakpoint | Standard |
|---|---|
| Desktop | 480px |
| Tablet (≤ 1024px) | 420px |
| Mobile (≤ 767px) | 100vw |

Alle Werte sind im Inspector konfigurierbar (auch mit `%` oder `vw` als Einheit).

---

## 📁 Dateistruktur

```
oudio-modal-block/
├── oudio-modal-block.php   ← Plugin-Header & Registration
├── package.json            ← npm Build-Config (optional)
├── build/                  ← Fertige Assets (direkt nutzbar!)
│   ├── block.json          ← Block-Manifest
│   ├── index.js            ← Editor-Script (Gutenberg UI)
│   ├── index.css           ← Editor-Styles
│   ├── style-index.css     ← Frontend-CSS (Modal Styles)
│   ├── view.js             ← Frontend-JS (Modal Logik)
│   └── render.php          ← PHP Server-Side Render Template
└── src/                    ← Quellcode (für npm build)
    ├── block.json
    ├── index.js
    ├── edit.js             ← React Editor Component
    ├── index.css
    ├── style.css
    ├── view.js
    └── render.php
```

---

## 🎨 CSS-Anpassungen

Das Modal nutzt CSS Custom Properties – du kannst sie im Theme-CSS überschreiben:

```css
/* Eigene Überschreibungen */
.oudio-modal-panel {
  background: #f8f8f8;       /* Panel-Hintergrund */
  border-radius: 12px 0 0 12px; /* Abgerundete linke Ecke */
}

.oudio-modal-close {
  background: #000;
  color: #fff;
}
```

---

## 🔧 Mehrere Modals auf einer Seite

Du kannst mehrere Block-Instanzen auf einer Seite platzieren. Jeder Block bekommt eine eindeutige `blockId`. Verschiedene Trigger-Klassen können verschiedene Modals öffnen:

- Block 1: Trigger-Klasse `open-checkout`
- Block 2: Trigger-Klasse `open-demo`

---

## ⚙️ Kompatibilität

- WordPress ≥ 6.3
- PHP ≥ 8.0
- Kein jQuery, kein Framework
- Funktioniert mit jedem Theme
