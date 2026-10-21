// Inline SVG, so nothing extra has to download or be cached.
// The lantern is decoration only: every state is also written out in words.

export function lantern(lit) {
  return `<svg class="lantern${lit ? ' lit' : ''}" viewBox="0 0 64 96" width="64" height="96" aria-hidden="true" focusable="false">
    ${lit ? '<defs><radialGradient id="glow"><stop offset="0" stop-color="#ffb547" stop-opacity=".55"/><stop offset="1" stop-color="#ffb547" stop-opacity="0"/></radialGradient></defs><circle cx="32" cy="50" r="31" fill="url(#glow)"/>' : ''}
    <path d="M21 15c0-12 22-12 22 0" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M15 23l7-8h20l7 8z" fill="currentColor"/>
    <rect x="17.5" y="25" width="29" height="46" rx="13" fill="none" stroke="currentColor" stroke-width="3"/>
    ${lit ? '<path class="flame" d="M32 35c6 9 7 16 0 22-7-6-6-13 0-22z"/>' : '<path d="M32 52v6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>'}
    <rect x="13" y="71" width="38" height="8" rx="2" fill="currentColor"/>
    <rect x="18" y="79" width="28" height="5" rx="1.5" fill="currentColor"/>
  </svg>`;
}

// Power just went: a bulb, struck through.
export function iconOut() {
  return `<svg class="icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <path d="M24 6a12 12 0 0 0-7 21.7V32h14v-4.3A12 12 0 0 0 24 6z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M18.5 37h11M20.5 42h7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <path class="gap" d="M7 7l34 34" stroke-width="8" stroke-linecap="round"/>
    <path d="M7 7l34 34" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`;
}

// Power's back: the bulb lit, with rays. The amber here is the light itself.
export function iconBack() {
  return `<svg class="icon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <path class="light" d="M24 10a9 9 0 0 0-5.3 16.3V30h10.6v-3.7A9 9 0 0 0 24 10z"/>
    <path d="M24 10a9 9 0 0 0-5.3 16.3V30h10.6v-3.7A9 9 0 0 0 24 10z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M19.5 34.5h9M21 39h6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    <path class="ray" d="M24 2v4M8.5 8.5l3 3M39.5 8.5l-3 3M3 21h4M41 21h4" stroke-width="3" stroke-linecap="round"/>
  </svg>`;
}

export function iconPhone() {
  return `<svg class="icon-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z" fill="currentColor"/>
  </svg>`;
}
