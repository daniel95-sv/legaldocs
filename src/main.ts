import "@/styles/main.css";
import type { LegalDocsState } from "@/types";
import {
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
  clearStateFromLocalStorage,
} from "@/services/storage/storage";
import { validateStep } from "@/core/validation/schemas";
import { WIZARD_STEPS } from "@/components/WizardSteps";

let state: LegalDocsState = loadStateFromLocalStorage();
let currentStepIndex = 0;

const THEME_STORAGE_KEY = "legaldocs_theme_mode";

function initTheme(): void {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  const activeTheme = saved || (prefersLight ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", activeTheme);
  updateThemeIcon(activeTheme);
}

function toggleTheme(): void {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const next = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem(THEME_STORAGE_KEY, next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme: string): void {
  const icon = document.querySelector("#themeToggleIcon");
  const textEl = document.querySelector("#themeToggleText");
  if (textEl) {
    textEl.textContent = theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
  }
  if (!icon) return;
  icon.innerHTML =
    theme === "light"
      ? `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`
      : `<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
}

function getVisibleSteps(): typeof WIZARD_STEPS {
  return WIZARD_STEPS.filter((s) => s.isVisible(state));
}

function renderSidebar(): void {
  const list = document.querySelector("#stepNavList");
  if (!list) return;

  const visible = getVisibleSteps();
  list.innerHTML = "";

  visible.forEach((s, idx) => {
    const isCurrent = idx === currentStepIndex;
    const validation = validateStep(s.id, state);
    const isDone = validation.valid && !isCurrent;

    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `step-btn ${isDone ? "is-complete" : ""}`;
    btn.setAttribute("aria-current", isCurrent ? "step" : "false");

    btn.innerHTML = `
      <span class="step-num">${isDone ? "✓" : idx + 1}</span>
      <span>${s.label}</span>
    `;

    btn.addEventListener("click", () => {
      goToStep(idx);
    });

    li.appendChild(btn);
    list.appendChild(li);
  });
}

function renderCurrentStep(): void {
  const visible = getVisibleSteps();
  if (currentStepIndex >= visible.length) {
    currentStepIndex = visible.length - 1;
  }

  const step = visible[currentStepIndex];
  const titleEl = document.querySelector("#stepTitle");
  const leadEl = document.querySelector("#stepLead");
  const formEl = document.querySelector("#stepFormContainer");
  const prevBtn = document.querySelector<HTMLButtonElement>("#prevStepBtn");
  const nextBtn = document.querySelector<HTMLButtonElement>("#nextStepBtn");
  const statusEl = document.querySelector("#stepStatusNotice");

  if (!step || !formEl || !titleEl || !leadEl || !prevBtn || !nextBtn) return;

  // Clear any status alert
  if (statusEl) {
    statusEl.innerHTML = "";
    statusEl.removeAttribute("data-visible");
  }

  titleEl.textContent = step.label;
  leadEl.textContent = step.lead;

  // Render step component
  step.render(formEl as HTMLElement, state, () => {
    saveStateToLocalStorage(state);
    renderSidebar();
  });

  // Setup buttons
  prevBtn.disabled = currentStepIndex === 0;
  if (currentStepIndex === visible.length - 1) {
    nextBtn.style.display = "none";
  } else {
    nextBtn.style.display = "inline-flex";
    nextBtn.textContent = "Siguiente →";
  }

  renderSidebar();
}

function goToStep(targetIndex: number): void {
  const visible = getVisibleSteps();
  if (targetIndex < 0 || targetIndex >= visible.length) return;

  // If navigating forward, validate current step
  if (targetIndex > currentStepIndex) {
    const currentStep = visible[currentStepIndex];
    const validation = validateStep(currentStep.id, state);
    if (!validation.valid) {
      showStepError(validation.errors[0].message);
      return;
    }
  }

  currentStepIndex = targetIndex;
  renderCurrentStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showStepError(message: string): void {
  const statusEl = document.querySelector("#stepStatusNotice");
  if (!statusEl) return;
  statusEl.innerHTML = `
    <div class="alert-banner alert-error">
      <span>⚠️</span>
      <div>${message}</div>
    </div>
  `;
}

function showToast(message: string): void {
  const toast = document.querySelector("#globalToast");
  if (!toast) return;
  toast.textContent = message;
  toast.setAttribute("data-active", "true");
  setTimeout(() => toast.removeAttribute("data-active"), 2600);
}

function initApp(): void {
  initTheme();

  document.querySelector("#themeToggleBtn")?.addEventListener("click", toggleTheme);

  document.querySelector("#prevStepBtn")?.addEventListener("click", () => {
    goToStep(currentStepIndex - 1);
  });

  document.querySelector("#nextStepBtn")?.addEventListener("click", () => {
    goToStep(currentStepIndex + 1);
  });

  document.querySelector("#clearDataBtn")?.addEventListener("click", () => {
    if (
      !confirm(
        "¿Deseas reiniciar todos los datos del formulario y vaciar el borrador guardado en tu navegador?"
      )
    )
      return;
    clearStateFromLocalStorage();
    state = loadStateFromLocalStorage();
    currentStepIndex = 0;
    renderCurrentStep();
    showToast("Datos locales eliminados correctamente.");
  });

  // Dynamic copyright year
  const yearEl = document.querySelector("#currentYear");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  renderCurrentStep();
}

document.addEventListener("DOMContentLoaded", initApp);
