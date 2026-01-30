<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

const STORAGE_KEY = 'pf-theme'

const explicitTheme = ref(null) // 'light' | 'dark' | null
const systemPrefersDark = ref(false)

let mediaQuery = null
let mediaQueryHandler = null
let outsideClickHandler = null

function readStoredTheme() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark') return value
    return null
  } catch {
    return null
  }
}

function applyThemeToDom() {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (!root) return

  if (explicitTheme.value === 'light' || explicitTheme.value === 'dark') {
    root.setAttribute('data-theme', explicitTheme.value)
    root.classList.remove('pf-theme-dark', 'pf-theme-light')
    root.classList.add(`pf-theme-${explicitTheme.value}`)
  } else {
    root.removeAttribute('data-theme')
    root.classList.remove('pf-theme-dark', 'pf-theme-light')
  }
}

const effectiveTheme = computed(() => explicitTheme.value || (systemPrefersDark.value ? 'dark' : 'light'))

function toggleTheme() {
  const next = effectiveTheme.value === 'dark' ? 'light' : 'dark'
  explicitTheme.value = next
  try { localStorage.setItem(STORAGE_KEY, next) } catch {}
  applyThemeToDom()
}

function useSystemTheme() {
  explicitTheme.value = null
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
  applyThemeToDom()
}

// Menu state for mobile
const menuOpen = ref(false)
const burgerRef = ref(null)
const menuRef = ref(null)
const menuLeft = ref(0)
const menuRight = ref(null)
const rightAlign = ref(false)

async function openMenu() {
  menuOpen.value = true
  await nextTick()
  positionMenu()
}
function toggleMenu() {
  if (menuOpen.value) {
    menuOpen.value = false
  } else {
    openMenu()
  }
}
function closeMenu() { menuOpen.value = false }

function positionMenu() {
  const burger = burgerRef.value
  const menu = menuRef.value
  if (!burger || !menu) return
  const container = burger.closest('.theme-control') || burger.parentElement
  const bRect = burger.getBoundingClientRect()
  const cRect = container.getBoundingClientRect()
  // If container is on right half of viewport, align to right edge of container
  if (cRect.left > (window.innerWidth / 2)) {
    rightAlign.value = true
    // compute right offset from container's right to burger's right
    menuRight.value = Math.max(8, Math.round(cRect.right - bRect.right))
    menuLeft.value = 0
  } else {
    rightAlign.value = false
    menuLeft.value = Math.max(8, Math.round(bRect.left - cRect.left))
    menuRight.value = null
  }
}

onMounted(() => {
  explicitTheme.value = readStoredTheme()
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemPrefersDark.value = !!mediaQuery.matches
    mediaQueryHandler = (e) => { systemPrefersDark.value = !!e.matches }
    if (typeof mediaQuery.addEventListener === 'function') mediaQuery.addEventListener('change', mediaQueryHandler)
    else if (typeof mediaQuery.addListener === 'function') mediaQuery.addListener(mediaQueryHandler)
  }
  applyThemeToDom()

  outsideClickHandler = (ev) => {
    const root = document.querySelector('.theme-control')
    if (!root) return
    if (!root.contains(ev.target)) closeMenu()
  }
  document.addEventListener('click', outsideClickHandler)

  // reposition on resize
  window.addEventListener('resize', positionMenu)
})

onBeforeUnmount(() => {
  if (mediaQuery && mediaQueryHandler) {
    if (typeof mediaQuery.removeEventListener === 'function') mediaQuery.removeEventListener('change', mediaQueryHandler)
    else if (typeof mediaQuery.removeListener === 'function') mediaQuery.removeListener(mediaQueryHandler)
  }
  if (outsideClickHandler) document.removeEventListener('click', outsideClickHandler)
  window.removeEventListener('resize', positionMenu)
})
</script>

<template>
  <div class="theme-control" role="group" aria-label="Theme">
    <div class="theme-buttons-inline">
      <button
        type="button"
        class="theme-button"
        @click="toggleTheme"
        :aria-label="effectiveTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
      >
        Theme: {{ effectiveTheme === 'dark' ? 'Dark' : 'Light' }}
      </button>

      <button
        v-if="explicitTheme"
        type="button"
        class="theme-button theme-button--subtle"
        @click="useSystemTheme"
        aria-label="Use system theme"
      >
        System
      </button>
    </div>

    <button
      ref="burgerRef"
      class="burger"
      type="button"
      @click="toggleMenu"
      :aria-expanded="menuOpen"
      aria-label="Toggle theme menu"
      title="Menu"
    >
      <span class="burger-box"><span class="burger-inner" :class="{ open: menuOpen }"></span></span>
    </button>

    <div
      ref="menuRef"
      class="menu"
      :class="{ open: menuOpen }"
      role="menu"
      :style="rightAlign ? { right: menuRight + 'px', left: 'auto' } : { left: menuLeft + 'px', right: 'auto' }"
    >
      <button class="theme-button menu-item" type="button" @click.stop="() => { toggleTheme(); closeMenu(); }">
        Theme: {{ effectiveTheme === 'dark' ? 'Dark' : 'Light' }}
      </button>
      <button v-if="explicitTheme" class="theme-button theme-button--subtle menu-item" type="button" @click.stop="() => { useSystemTheme(); closeMenu(); }">
        System
      </button>
    </div>
  </div>
</template>

<style scoped>
.theme-control { position: fixed; top: 12px; right: 12px; z-index: 60; display: inline-flex; gap: 8px; align-items: center; }
.theme-buttons-inline { display: flex; gap: 8px; align-items: center; }
.theme-button { padding: 8px 12px; border-radius: 999px; border: 1px solid var(--pf-border); background: var(--pf-surface); color: var(--pf-text); font-weight: 800; cursor: pointer; box-shadow: 0 6px 18px var(--pf-shadow); }
.theme-button:hover { background: var(--pf-hover); }
.theme-button--subtle { background: var(--pf-surface); border: 1px solid var(--pf-border-soft, var(--pf-border)); color: var(--pf-text); opacity: 0.9; font-weight: 700; box-shadow: none; }
.theme-button--subtle:hover { background: var(--pf-hover); opacity: 1; }
.burger { display: none; background: transparent; border: none; padding: 8px; cursor: pointer; }
.burger-box { width: 22px; height: 16px; position: relative; display: inline-block; }
.burger-inner, .burger-inner::before, .burger-inner::after { width: 22px; height: 2px; background: var(--pf-text); position: absolute; left: 0; transition: transform 0.25s ease, opacity 0.2s ease; }
.burger-inner { top: 50%; transform: translateY(-50%); }
.burger-inner::before { content: ''; top: -7px; }
.burger-inner::after { content: ''; top: 7px; }
.burger-inner.open { background: transparent; }
.burger-inner.open::before { transform: translateY(7px) rotate(45deg); }
.burger-inner.open::after { transform: translateY(-7px) rotate(-45deg); }
.menu { display: none; position: absolute; top: calc(100% + 8px); background: var(--pf-surface); border: 1px solid var(--pf-border); border-radius: 10px; padding: 8px; box-shadow: 0 8px 24px var(--pf-shadow); min-width: 180px; z-index: 70; flex-direction: column; }
.menu.open { display: flex; }
.menu-item { width: 100%; text-align: left; margin: 4px 0; color: var(--pf-text); }
@media (max-width: 600px) { 
  .theme-buttons-inline { display: none; } 
  .burger { display: inline-flex; align-items: center; justify-content: center; }
  /* On mobile, use fixed positioning for the menu so it displays correctly */
  .menu { position: fixed; top: auto; pointer-events: auto; bottom: auto; margin-top: 50px; }
}
@media (min-width: 601px) { .menu { display: none !important; } }
</style>
