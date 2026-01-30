<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToBnl() {
  router.push('/bnl')
}
</script>

<template>
  <main class="region-shell">
    <div class="card">
      <h1 class="title">Choose your XMS region</h1>
      <p class="subtitle">Select a region to continue.</p>

      <div class="grid">
        <button class="region-button" type="button" @click="goToBnl">
          <span class="region-button__title">XMS BNL</span>
          <span class="region-button__hint">Play the People First games</span>
        </button>

        <div class="region-disabled" role="status" aria-live="polite">
          <button class="region-button region-button--disabled" type="button" disabled>
            <span class="region-button__title">XMS DE</span>
            <span class="region-button__hint">Coming soon</span>
          </button>
          <div class="coming-soon">
            XMS DE is coming soon — this option isn’t available yet.
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.region-shell {
  width: 100%;
  min-height: calc(100vh - 96px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--pf-bg);
  color: var(--pf-text);
}

.card {
  width: 100%;
  max-width: 520px;
  background: var(--pf-surface);
  border: 1px solid var(--pf-border-soft);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 28px var(--pf-shadow);
}

.title {
  margin: 0;
  font-size: 1.4rem;
  line-height: 1.2;
}

.subtitle {
  margin: 8px 0 0;
  color: var(--pf-muted);
}

.grid {
  margin-top: 16px;
  display: grid;
  gap: 12px;
}

.region-button {
  width: 100%;
  text-align: left;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid var(--pf-border);
  background: var(--pf-surface);
  color: var(--pf-text);
  cursor: pointer;
  transition: transform 0.05s ease, background 0.15s ease;
}

.region-button:hover {
  background: var(--pf-hover);
}

.region-button:active {
  transform: translateY(1px);
}

.region-button__title {
  display: block;
  font-weight: 800;
}

.region-button__hint {
  display: block;
  margin-top: 4px;
  color: var(--pf-muted-2);
}

.region-button--disabled {
  cursor: not-allowed;
  opacity: 0.75;
}

.coming-soon {
  margin-top: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px dashed var(--pf-border-strong);
  background: var(--pf-surface-2);
  color: var(--pf-muted-2);
}
</style>
