<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const STORAGE_KEY = 'pf-theme'

const explicitTheme = ref(null) // 'light' | 'dark' | null (system)
const systemPrefersDark = ref(false)

let mediaQuery = null
let mediaQueryHandler = null

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
    root.dataset.theme = explicitTheme.value
  } else {
    delete root.dataset.theme
  }
}

const effectiveTheme = computed(() => {
  if (explicitTheme.value) return explicitTheme.value
  return systemPrefersDark.value ? 'dark' : 'light'
})

function toggleTheme() {
  const next = effectiveTheme.value === 'dark' ? 'light' : 'dark'
  explicitTheme.value = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // ignore
  }
  applyThemeToDom()
}

function useSystemTheme() {
  explicitTheme.value = null
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  applyThemeToDom()
}

onMounted(() => {
  explicitTheme.value = readStoredTheme()

  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemPrefersDark.value = !!mediaQuery.matches

    mediaQueryHandler = (e) => {
      systemPrefersDark.value = !!e.matches
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', mediaQueryHandler)
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(mediaQueryHandler)
    }
  }

  applyThemeToDom()
})

onBeforeUnmount(() => {
  if (!mediaQuery || !mediaQueryHandler) return
  if (typeof mediaQuery.removeEventListener === 'function') {
    mediaQuery.removeEventListener('change', mediaQueryHandler)
  } else if (typeof mediaQuery.removeListener === 'function') {
    mediaQuery.removeListener(mediaQueryHandler)
  }
})
</script>

<template>
  <div class="theme-control" role="group" aria-label="Theme">
    <button
      type="button"
      class="theme-button"
      @click="toggleTheme"
      :aria-label="effectiveTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
      :title="effectiveTheme === 'dark' ? 'Dark theme (click for light)' : 'Light theme (click for dark)'"
    >
      Theme: {{ effectiveTheme === 'dark' ? 'Dark' : 'Light' }}
    </button>

    <button
      v-if="explicitTheme"
      type="button"
      class="theme-button theme-button--subtle"
      @click="useSystemTheme"
      aria-label="Use system theme"
      title="Use system theme"
    >
      System
    </button>
  </div>
</template>
