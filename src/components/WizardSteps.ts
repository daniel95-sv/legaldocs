import type { LegalDocsState, DocumentId } from "@/types";
import {
  APP_TYPES,
  DATA_CATEGORIES,
  PURPOSES,
  SECURITY_MEASURES,
  COOKIES_CATEGORIES,
  PRECONFIGURED_PROVIDERS,
} from "@/data/catalogs";
import countriesList from "@/data/countries.json";
import { evaluateDocumentRules } from "@/core/document-rules/rules";
import { generateAllDocuments } from "@/core/document-generator/generator";
import { exportDocumentToPDF } from "@/services/pdf/pdf-generator";
import {
  exportDocumentToTXT,
  exportDocumentToHTML,
} from "@/services/export/export";
import { copyTextToClipboard } from "@/services/clipboard/clipboard";
import { formatDateSpanish, escapeHtml } from "@/core/template-engine/engine";

export interface StepDefinition {
  id: string;
  label: string;
  lead: string;
  required: boolean;
  isVisible: (state: LegalDocsState) => boolean;
  render: (container: HTMLElement, state: LegalDocsState, onUpdate: () => void) => void;
}

const DOC_DISPLAY_NAMES: Record<DocumentId, string> = {
  privacy: "Política de Privacidad",
  terms: "Términos y Condiciones",
  legal: "Aviso Legal",
  cookies: "Política de Cookies",
  deletion: "Eliminación de Cuentas y Datos",
  storeDisclosure: "Divulgación para Tiendas",
};

let activeResultDoc: DocumentId = "privacy";

export const WIZARD_STEPS: StepDefinition[] = [
  // 1. Datos de la aplicación
  {
    id: "app",
    label: "Datos de la app",
    lead: "Información general sobre tu producto digital y canales de contacto oficial.",
    required: true,
    isVisible: () => true,
    render: (c, s, update) => {
      c.innerHTML = `
        <div class="form-field">
          <label class="field-label" for="appName">Nombre de la aplicación <span class="req-star">*</span></label>
          <input class="input-text" id="appName" type="text" value="${escapeHtml(s.appName)}" placeholder="Ej: TaskFlow, FitTracker..." />
          <p class="field-hint">El nombre comercial público de tu software o servicio.</p>
        </div>

        <div class="form-field">
          <label class="field-label" for="appType">Tipo de aplicación <span class="req-star">*</span></label>
          <select class="input-select" id="appType">
            <option value="">— Selecciona la plataforma principal —</option>
            ${APP_TYPES.map(
              (t) => `<option value="${t.v}" ${s.appType === t.v ? "selected" : ""}>${t.label}</option>`
            ).join("")}
          </select>
        </div>

        <div class="form-field">
          <label class="field-label" for="description">Descripción breve del producto</label>
          <textarea class="input-textarea" id="description" placeholder="Describe brevemente qué hace tu aplicación y qué valor ofrece a los usuarios...">${escapeHtml(s.description)}</textarea>
        </div>

        <div class="grid-two-cols">
          <div class="form-field">
            <label class="field-label" for="url">Sitio web oficial (URL)</label>
            <input class="input-text" id="url" type="url" value="${escapeHtml(s.url)}" placeholder="https://miapp.com" />
          </div>
          <div class="form-field">
            <label class="field-label" for="contactEmail">Correo de contacto / privacidad</label>
            <input class="input-text" id="contactEmail" type="email" value="${escapeHtml(s.contactEmail)}" placeholder="privacidad@miapp.com" />
          </div>
        </div>

        <div class="grid-two-cols">
          <div class="form-field">
            <label class="field-label" for="effectiveDate">Fecha de entrada en vigor <span class="req-star">*</span></label>
            <input class="input-text" id="effectiveDate" type="date" value="${s.effectiveDate}" />
          </div>
          <div class="form-field">
            <label class="field-label" for="audience">Público objetivo</label>
            <select class="input-select" id="audience">
              <option value="general" ${s.audience === "general" ? "selected" : ""}>Público general (consumidores)</option>
              <option value="professionals" ${s.audience === "professionals" ? "selected" : ""}>Profesionales y empresas (B2B)</option>
              <option value="minors" ${s.audience === "minors" ? "selected" : ""}>Incluye o está dirigida a menores</option>
              <option value="mixed" ${s.audience === "mixed" ? "selected" : ""}>Mixto (todos los públicos)</option>
            </select>
          </div>
        </div>
      `;

      c.querySelector<HTMLInputElement>("#appName")?.addEventListener("input", (e) => {
        s.appName = (e.target as HTMLInputElement).value;
        update();
      });
      c.querySelector<HTMLSelectElement>("#appType")?.addEventListener("change", (e) => {
        s.appType = (e.target as HTMLSelectElement).value as any;
        update();
      });
      c.querySelector<HTMLTextAreaElement>("#description")?.addEventListener("input", (e) => {
        s.description = (e.target as HTMLTextAreaElement).value;
        update();
      });
      c.querySelector<HTMLInputElement>("#url")?.addEventListener("input", (e) => {
        s.url = (e.target as HTMLInputElement).value;
        update();
      });
      c.querySelector<HTMLInputElement>("#contactEmail")?.addEventListener("input", (e) => {
        s.contactEmail = (e.target as HTMLInputElement).value;
        update();
      });
      c.querySelector<HTMLInputElement>("#effectiveDate")?.addEventListener("input", (e) => {
        s.effectiveDate = (e.target as HTMLInputElement).value;
        update();
      });
      c.querySelector<HTMLSelectElement>("#audience")?.addEventListener("change", (e) => {
        s.audience = (e.target as HTMLSelectElement).value as any;
        update();
      });
    },
  },

  // 2. Responsable
  {
    id: "resp",
    label: "Responsable / Titular",
    lead: "Identifica a la persona o entidad legal que publica el software y responde ante los usuarios.",
    required: true,
    isVisible: () => true,
    render: (c, s, update) => {
      const isKnownCountry = countriesList.includes(s.country) && s.country !== "Otro (especificar manualmente)";
      const isCustomCountry = Boolean(s.country) && !isKnownCountry;
      const initialSelectVal = isKnownCountry ? s.country : (s.country ? "Otro (especificar manualmente)" : "");

      c.innerHTML = `
        <div class="form-field">
          <label class="field-label">Naturaleza del responsable</label>
          <div class="checkbox-card-grid" style="grid-template-columns: 1fr 1fr;">
            <label class="checkbox-card">
              <input type="radio" name="respType" value="individual" ${s.responsibleType === "individual" ? "checked" : ""}>
              <div class="checkbox-card-text">
                <span class="checkbox-card-title">Desarrollador independiente</span>
                <span class="checkbox-card-hint">Persona física / Creador individual</span>
              </div>
            </label>
            <label class="checkbox-card">
              <input type="radio" name="respType" value="company" ${s.responsibleType === "company" ? "checked" : ""}>
              <div class="checkbox-card-text">
                <span class="checkbox-card-title">Empresa o entidad</span>
                <span class="checkbox-card-hint">Sociedad constituida / Persona jurídica</span>
              </div>
            </label>
          </div>
        </div>

        <div class="form-field">
          <label class="field-label" for="respName">
            ${s.responsibleType === "company" ? "Razón social o denominación mercantil" : "Nombre completo del desarrollador"}
            <span class="req-star">*</span>
          </label>
          <input class="input-text" id="respName" type="text" value="${escapeHtml(s.responsibleName)}" placeholder="${s.responsibleType === "company" ? "Acme Software S.L." : "Nombre y Apellidos"}" />
        </div>

        <div class="grid-two-cols">
          <div class="form-field">
            <label class="field-label" for="countrySelect">País del responsable <span class="req-star">*</span></label>
            <select class="input-select" id="countrySelect">
              <option value="">— Selecciona un país —</option>
              ${countriesList.map((countryName) => `
                <option value="${escapeHtml(countryName)}" ${initialSelectVal === countryName ? "selected" : ""}>
                  ${escapeHtml(countryName)}
                </option>
              `).join("")}
            </select>

            <div id="customCountryWrap" style="margin-top: 0.5rem; ${isCustomCountry || initialSelectVal === "Otro (especificar manualmente)" ? "display: block;" : "display: none;"}">
              <input class="input-text" id="customCountryInput" type="text" value="${escapeHtml(isCustomCountry ? s.country : "")}" placeholder="Escribe el nombre de tu país..." />
              <p class="field-hint">Indica el país donde resides o está constituida tu entidad.</p>
            </div>
          </div>

          <div class="form-field">
            <label class="field-label" for="address">Dirección postal / comercial (opcional)</label>
            <input class="input-text" id="address" type="text" value="${escapeHtml(s.address)}" placeholder="Calle, ciudad, código postal..." />
          </div>
        </div>
      `;

      c.querySelectorAll<HTMLInputElement>('input[name="respType"]').forEach((r) => {
        r.addEventListener("change", (e) => {
          s.responsibleType = (e.target as HTMLInputElement).value as any;
          update();
        });
      });

      c.querySelector<HTMLInputElement>("#respName")?.addEventListener("input", (e) => {
        s.responsibleName = (e.target as HTMLInputElement).value;
        update();
      });

      const countrySelect = c.querySelector<HTMLSelectElement>("#countrySelect");
      const customWrap = c.querySelector<HTMLElement>("#customCountryWrap");
      const customInput = c.querySelector<HTMLInputElement>("#customCountryInput");

      countrySelect?.addEventListener("change", (e) => {
        const selected = (e.target as HTMLSelectElement).value;
        if (selected === "Otro (especificar manualmente)") {
          if (customWrap) customWrap.style.display = "block";
          if (customInput) {
            s.country = customInput.value.trim();
            customInput.focus();
          }
        } else {
          if (customWrap) customWrap.style.display = "none";
          s.country = selected;
        }
        update();
      });

      customInput?.addEventListener("input", (e) => {
        s.country = (e.target as HTMLInputElement).value;
        update();
      });

      c.querySelector<HTMLInputElement>("#address")?.addEventListener("input", (e) => {
        s.address = (e.target as HTMLInputElement).value;
        update();
      });
    },
  },

  // 3. Jurisdicción
  {
    id: "juris",
    label: "Jurisdicción",
    lead: "Regiones y normativas territoriales bajo las cuales operas o donde residen tus usuarios.",
    required: false,
    isVisible: () => true,
    render: (c, s, update) => {
      c.innerHTML = `
        <div class="alert-banner alert-info">
          ℹ️ Las plantillas se configuran de acuerdo a tus selecciones. La aplicabilidad legal depende del lugar de establecimiento y de la residencia de tus usuarios.
        </div>

        <div class="checkbox-card-grid">
          <label class="checkbox-card">
            <input type="checkbox" id="jGdpr" ${s.juris.gdpr ? "checked" : ""}>
            <div class="checkbox-card-text">
              <span class="checkbox-card-title">Unión Europea (RGPD / GDPR)</span>
              <span class="checkbox-card-hint">Obligatorio si operas o tienes usuarios en la UE.</span>
            </div>
          </label>
          <label class="checkbox-card">
            <input type="checkbox" id="jCcpa" ${s.juris.ccpa ? "checked" : ""}>
            <div class="checkbox-card-text">
              <span class="checkbox-card-title">California (CCPA / CPRA)</span>
              <span class="checkbox-card-hint">Derechos específicos para residentes en California.</span>
            </div>
          </label>
          <label class="checkbox-card">
            <input type="checkbox" id="jLatam" ${s.juris.latam ? "checked" : ""}>
            <div class="checkbox-card-text">
              <span class="checkbox-card-title">Latinoamérica (LFPDPPP, LGPD, etc.)</span>
              <span class="checkbox-card-hint">México, Brasil, Argentina, Colombia y otros.</span>
            </div>
          </label>
        </div>

        <div class="form-field">
          <label class="field-label" for="jOther">Otras jurisdicciones relevantes</label>
          <input class="input-text" id="jOther" type="text" value="${escapeHtml(s.juris.other)}" placeholder="Reino Unido, Canadá, Suiza..." />
        </div>
      `;

      c.querySelector<HTMLInputElement>("#jGdpr")?.addEventListener("change", (e) => {
        s.juris.gdpr = (e.target as HTMLInputElement).checked;
        update();
      });
      c.querySelector<HTMLInputElement>("#jCcpa")?.addEventListener("change", (e) => {
        s.juris.ccpa = (e.target as HTMLInputElement).checked;
        update();
      });
      c.querySelector<HTMLInputElement>("#jLatam")?.addEventListener("change", (e) => {
        s.juris.latam = (e.target as HTMLInputElement).checked;
        update();
      });
      c.querySelector<HTMLInputElement>("#jOther")?.addEventListener("input", (e) => {
        s.juris.other = (e.target as HTMLInputElement).value;
        update();
      });
    },
  },

  // 4. Características de la aplicación
  {
    id: "features",
    label: "Características",
    lead: "Marca únicamente las funciones reales de tu app. Cada una activará cláusulas específicas.",
    required: true,
    isVisible: () => true,
    render: (c, s, update) => {
      const featList = [
        { key: "accounts", title: "Permite crear cuentas", desc: "Registro con usuario y contraseña" },
        { key: "oauth", title: "Login social / externo", desc: "Google, Apple, GitHub, etc." },
        { key: "profiles", title: "Perfiles públicos de usuario", desc: "Otros usuarios pueden ver información" },
        { key: "ugc", title: "Contenido subido por usuarios", desc: "Publicaciones, textos, artículos" },
        { key: "comments", title: "Comentarios y mensajería", desc: "Chats internos o foros" },
        { key: "payments", title: "Pagos dentro de la app", desc: "Pasarelas como Stripe o PayPal" },
        { key: "subscriptions", title: "Suscripciones periódicas", desc: "Planes recurrentes mensuales/anuales" },
        { key: "ads", title: "Muestra publicidad", desc: "AdMob, Unity Ads, redes externas" },
        { key: "analytics", title: "Analítica de uso", desc: "Google Analytics, PostHog, Mixpanel" },
        { key: "ai", title: "Utiliza Inteligencia Artificial", desc: "OpenAI, Claude, Gemini, etc." },
        { key: "location", title: "Ubicación del dispositivo", desc: "GPS o ubicación aproximada" },
        { key: "uploads", title: "Subida de archivos", desc: "Fotos, PDFs, documentos" },
        { key: "social", title: "Funciones sociales", desc: "Seguir, amigos, compartir" },
        { key: "minors", title: "Permite uso por menores", desc: "Usuarios menores de 18 años" },
        { key: "accountDeletion", title: "Permite eliminar cuentas", desc: "Mecanismo de baja directa" },
      ];

      c.innerHTML = `
        <div class="checkbox-card-grid">
          ${featList
            .map(
              (f) => `
            <label class="checkbox-card">
              <input type="checkbox" data-feat="${f.key}" ${s.features[f.key as keyof typeof s.features] ? "checked" : ""}>
              <div class="checkbox-card-text">
                <span class="checkbox-card-title">${f.title}</span>
                <span class="checkbox-card-hint">${f.desc}</span>
              </div>
            </label>
          `
            )
            .join("")}
        </div>
      `;

      c.querySelectorAll<HTMLInputElement>("input[data-feat]").forEach((cb) => {
        cb.addEventListener("change", () => {
          const k = cb.getAttribute("data-feat") as keyof typeof s.features;
          s.features[k] = cb.checked;
          update();
        });
      });
    },
  },

  // 5. Datos recopilados
  {
    id: "data",
    label: "Datos recopilados",
    lead: "Selecciona las categorías de información que tu aplicación recoge o transmite.",
    required: true,
    isVisible: () => true,
    render: (c, s, update) => {
      c.innerHTML = `
        <div class="checkbox-card-grid">
          ${DATA_CATEGORIES.map(
            (cat) => `
            <label class="checkbox-card">
              <input type="checkbox" value="${cat.v}" ${s.dataCategories.includes(cat.v) ? "checked" : ""}>
              <div class="checkbox-card-text">
                <span class="checkbox-card-title">${cat.label}</span>
                ${cat.hint ? `<span class="checkbox-card-hint">${cat.hint}</span>` : ""}
              </div>
            </label>
          `
          ).join("")}
        </div>
      `;

      c.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((cb) => {
        cb.addEventListener("change", () => {
          const val = cb.value;
          if (cb.checked) {
            if (!s.dataCategories.includes(val)) s.dataCategories.push(val);
          } else {
            s.dataCategories = s.dataCategories.filter((x) => x !== val);
          }
          update();
        });
      });
    },
  },

  // 6. Finalidades del tratamiento
  {
    id: "purposes",
    label: "Finalidades",
    lead: "Indica para qué utilizas los datos recopilados (operativa, comercial, seguridad...).",
    required: true,
    isVisible: () => true,
    render: (c, s, update) => {
      c.innerHTML = `
        <div class="checkbox-card-grid">
          ${PURPOSES.map(
            (purp) => `
            <label class="checkbox-card">
              <input type="checkbox" value="${purp.v}" ${s.purposes.includes(purp.v) ? "checked" : ""}>
              <div class="checkbox-card-text">
                <span class="checkbox-card-title">${purp.label}</span>
                ${purp.hint ? `<span class="checkbox-card-hint">${purp.hint}</span>` : ""}
              </div>
            </label>
          `
          ).join("")}
        </div>
      `;

      c.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((cb) => {
        cb.addEventListener("change", () => {
          const val = cb.value;
          if (cb.checked) {
            if (!s.purposes.includes(val)) s.purposes.push(val);
          } else {
            s.purposes = s.purposes.filter((x) => x !== val);
          }
          update();
        });
      });
    },
  },

  // 7. Terceros
  {
    id: "third",
    label: "Terceros y proveedores",
    lead: "Proveedores externos que tratan datos en tu nombre (hosting, pasarelas, analítica, IA...).",
    required: false,
    isVisible: () => true,
    render: (c, s, update) => {
      const renderContent = () => {
        const isProviderSelected = (pName: string) =>
          s.thirdParties.some(
            (tp) => tp.name.trim().toLowerCase() === pName.trim().toLowerCase()
          );

        c.innerHTML = `
          <div class="alert-banner alert-info" style="margin-bottom: 1.25rem;">
            <span>ℹ️</span>
            <div>
              <strong>Selección rápida o manual:</strong> Haz clic en los proveedores populares para agregarlos con sus datos preconfigurados, o utiliza el botón inferior para ingresar cualquier otro servicio manualmente.
            </div>
          </div>

          <!-- SECCIÓN: Proveedores Populares -->
          <div style="margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.04em;">
                Proveedores populares (haz clic para añadir)
              </h3>
              <span style="font-size: 0.8rem; color: var(--text-muted);">${PRECONFIGURED_PROVIDERS.length} opciones disponibles</span>
            </div>

            <div class="checkbox-card-grid" style="grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.65rem;">
              ${PRECONFIGURED_PROVIDERS.map((prov) => {
                const selected = isProviderSelected(prov.name);
                return `
                  <button type="button" class="checkbox-card preconfigured-btn" data-prov-id="${prov.id}" style="width: 100%; text-align: left; cursor: pointer; border-color: ${
                    selected ? "var(--accent-primary)" : "var(--border-subtle)"
                  }; background-color: ${
                    selected ? "var(--accent-surface)" : "var(--bg-surface-elevated)"
                  }; padding: 0.65rem 0.8rem;">
                    <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; margin-bottom: 0.35rem;">
                      <span style="font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: var(--radius-full); background-color: var(--bg-surface-hover); color: var(--accent-primary);">
                        ${prov.category}
                      </span>
                      <span style="font-size: 0.82rem; font-weight: 700; color: ${
                        selected ? "var(--color-success)" : "var(--text-muted)"
                      };">
                        ${selected ? "✓ Añadido" : "+ Añadir"}
                      </span>
                    </div>
                    <div class="checkbox-card-text">
                      <span class="checkbox-card-title" style="font-size: 0.88rem;">${prov.name}</span>
                      <span class="checkbox-card-hint" style="font-size: 0.76rem;">${prov.service}</span>
                    </div>
                  </button>
                `;
              }).join("")}
            </div>
          </div>

          <!-- SECCIÓN: Proveedores Configurados -->
          <div style="border-top: 1px solid var(--border-subtle); padding-top: 1.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
              <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.04em;">
                Proveedores en tu política (${s.thirdParties.length})
              </h3>
              <button class="btn btn-sm btn-primary" id="addManualTpBtn" type="button">
                + Añadir proveedor manual
              </button>
            </div>

            <div id="configuredProvidersList">
              ${
                s.thirdParties.length === 0
                  ? `
                  <div style="background-color: var(--bg-surface-elevated); border: 1px dashed var(--border-strong); border-radius: var(--radius-sm); padding: 2rem 1.25rem; text-align: center;">
                    <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 0.5rem;">
                      No has añadido proveedores externos aún.
                    </p>
                    <p style="color: var(--text-dim); font-size: 0.85rem;">
                      Selecciona cualquiera de las opciones populares arriba o pulsa "+ Añadir proveedor manual".
                    </p>
                  </div>
                `
                  : s.thirdParties
                      .map(
                        (tp, idx) => `
                <div class="third-party-row" data-index="${idx}" style="margin-bottom: 1rem; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1.15rem; background-color: var(--bg-surface-elevated);">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 0.55rem;">
                      <span style="font-size: 0.75rem; font-weight: 700; background-color: var(--accent-surface); color: var(--accent-primary); border-radius: 50%; width: 22px; height: 22px; display: grid; place-items: center;">
                        ${idx + 1}
                      </span>
                      <strong style="color: var(--text-main); font-size: 0.96rem;">
                        ${escapeHtml(tp.name || `Proveedor #${idx + 1}`)}
                      </strong>
                    </div>
                    <button class="btn btn-sm btn-danger-ghost remove-tp-btn" data-index="${idx}" type="button" title="Eliminar este proveedor">
                      ✕ Eliminar
                    </button>
                  </div>

                  <div class="grid-two-cols" style="margin-bottom: 0.75rem;">
                    <div>
                      <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem;">Nombre del proveedor *</label>
                      <input class="input-text tp-name" type="text" placeholder="Ej: AWS, Stripe, Google..." value="${escapeHtml(tp.name)}" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem;">Servicio prestado *</label>
                      <input class="input-text tp-service" type="text" placeholder="Ej: Hosting, Pasarela de pago..." value="${escapeHtml(tp.service)}" />
                    </div>
                  </div>

                  <div class="grid-two-cols" style="margin-bottom: 0.75rem;">
                    <div>
                      <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem;">Datos tratados / recibidos</label>
                      <input class="input-text tp-data" type="text" placeholder="Ej: IP, correo, tokens de pago..." value="${escapeHtml(tp.data)}" />
                    </div>
                    <div>
                      <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem;">Finalidad del tratamiento</label>
                      <input class="input-text tp-purpose" type="text" placeholder="Ej: Cobro de suscripciones..." value="${escapeHtml(tp.purpose)}" />
                    </div>
                  </div>

                  <div>
                    <label style="display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.25rem;">Enlace a su política de privacidad (opcional)</label>
                    <input class="input-text tp-policy" type="url" placeholder="https://proveedor.com/privacy" value="${escapeHtml(tp.policyUrl)}" />
                  </div>
                </div>
              `
                      )
                      .join("")
              }
            </div>

            ${
              s.thirdParties.length > 0
                ? `
              <div style="margin-top: 0.75rem;">
                <button class="btn btn-sm btn-ghost" id="addManualTpBtnBottom" type="button">
                  + Añadir otro proveedor manual
                </button>
              </div>
            `
                : ""
            }
          </div>
        `;

        // Preconfigured provider click handlers
        c.querySelectorAll<HTMLButtonElement>(".preconfigured-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const provId = btn.getAttribute("data-prov-id");
            const found = PRECONFIGURED_PROVIDERS.find((p) => p.id === provId);
            if (!found) return;

            const existingIndex = s.thirdParties.findIndex(
              (tp) => tp.name.trim().toLowerCase() === found.name.trim().toLowerCase()
            );

            if (existingIndex >= 0) {
              s.thirdParties.splice(existingIndex, 1);
            } else {
              s.thirdParties.push({
                id: found.id + "-" + Date.now(),
                name: found.name,
                service: found.service,
                data: found.data,
                purpose: found.purpose,
                policyUrl: found.policyUrl,
              });
            }

            update();
            renderContent();
          });
        });

        // Manual add handler
        const handleManualAdd = () => {
          s.thirdParties.push({
            id: String(Date.now()),
            name: "",
            service: "",
            data: "",
            purpose: "",
            policyUrl: "",
          });
          update();
          renderContent();

          setTimeout(() => {
            const nameInputs = c.querySelectorAll<HTMLInputElement>(".tp-name");
            if (nameInputs.length > 0) {
              const last = nameInputs[nameInputs.length - 1];
              last.focus();
              last.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 40);
        };

        c.querySelector("#addManualTpBtn")?.addEventListener("click", handleManualAdd);
        c.querySelector("#addManualTpBtnBottom")?.addEventListener("click", handleManualAdd);

        // Remove handlers
        c.querySelectorAll<HTMLButtonElement>(".remove-tp-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const idx = Number(btn.getAttribute("data-index"));
            s.thirdParties.splice(idx, 1);
            update();
            renderContent();
          });
        });

        // Live input handlers
        c.querySelectorAll(".third-party-row").forEach((row) => {
          const idx = Number(row.getAttribute("data-index"));
          row.querySelector<HTMLInputElement>(".tp-name")?.addEventListener("input", (e) => {
            s.thirdParties[idx].name = (e.target as HTMLInputElement).value;
            update();
          });
          row.querySelector<HTMLInputElement>(".tp-service")?.addEventListener("input", (e) => {
            s.thirdParties[idx].service = (e.target as HTMLInputElement).value;
            update();
          });
          row.querySelector<HTMLInputElement>(".tp-data")?.addEventListener("input", (e) => {
            s.thirdParties[idx].data = (e.target as HTMLInputElement).value;
            update();
          });
          row.querySelector<HTMLInputElement>(".tp-purpose")?.addEventListener("input", (e) => {
            s.thirdParties[idx].purpose = (e.target as HTMLInputElement).value;
            update();
          });
          row.querySelector<HTMLInputElement>(".tp-policy")?.addEventListener("input", (e) => {
            s.thirdParties[idx].policyUrl = (e.target as HTMLInputElement).value;
            update();
          });
        });
      };

      renderContent();
    },
  },

  // 8. Conservación y seguridad
  {
    id: "retention",
    label: "Conservación y seguridad",
    lead: "Políticas de retención temporal de datos y estándares de seguridad técnica implementados.",
    required: true,
    isVisible: () => true,
    render: (c, s, update) => {
      c.innerHTML = `
        <div class="form-field">
          <label class="field-label" for="retPeriod">Periodo o criterio de conservación <span class="req-star">*</span></label>
          <input class="input-text" id="retPeriod" type="text" value="${escapeHtml(s.retentionPeriod)}" placeholder="Durante el tiempo que el usuario mantenga activa su cuenta..." />
        </div>

        <div class="form-field">
          <label class="field-label" for="retCriteria">Criterios de eliminación definitiva</label>
          <textarea class="input-textarea" id="retCriteria" placeholder="Criterios para anonimizar o eliminar...">${escapeHtml(s.retentionCriteria)}</textarea>
        </div>

        <div class="checkbox-card-grid" style="grid-template-columns: 1fr 1fr;">
          <label class="checkbox-card">
            <input type="checkbox" id="autoDel" ${s.autoDeletion ? "checked" : ""}>
            <div class="checkbox-card-text">
              <span class="checkbox-card-title">Eliminación automática</span>
              <span class="checkbox-card-hint">Sistemas periódicos de purga automática de datos caducados.</span>
            </div>
          </label>
          <label class="checkbox-card">
            <input type="checkbox" id="legalRet" ${s.legalRetention ? "checked" : ""}>
            <div class="checkbox-card-text">
              <span class="checkbox-card-title">Retención por obligación legal</span>
              <span class="checkbox-card-hint">Facturas o registros fiscales conservados bloqueados.</span>
            </div>
          </label>
        </div>

        <div class="form-field">
          <label class="field-label" for="backupsInfo">Información sobre copias de seguridad</label>
          <input class="input-text" id="backupsInfo" type="text" value="${escapeHtml(s.backupsInfo)}" placeholder="Copias redundantes rotadas en un plazo máximo de 30 a 90 días..." />
        </div>

        <div class="form-field">
          <label class="field-label">Medidas de seguridad aplicadas</label>
          <div class="checkbox-card-grid">
            ${SECURITY_MEASURES.map(
              (sec) => `
              <label class="checkbox-card">
                <input type="checkbox" value="${sec.v}" ${s.security.includes(sec.v) ? "checked" : ""}>
                <div class="checkbox-card-text">
                  <span class="checkbox-card-title">${sec.label}</span>
                  ${sec.hint ? `<span class="checkbox-card-hint">${sec.hint}</span>` : ""}
                </div>
              </label>
            `
            ).join("")}
          </div>
        </div>
      `;

      c.querySelector<HTMLInputElement>("#retPeriod")?.addEventListener("input", (e) => {
        s.retentionPeriod = (e.target as HTMLInputElement).value;
        update();
      });
      c.querySelector<HTMLTextAreaElement>("#retCriteria")?.addEventListener("input", (e) => {
        s.retentionCriteria = (e.target as HTMLTextAreaElement).value;
        update();
      });
      c.querySelector<HTMLInputElement>("#autoDel")?.addEventListener("change", (e) => {
        s.autoDeletion = (e.target as HTMLInputElement).checked;
        update();
      });
      c.querySelector<HTMLInputElement>("#legalRet")?.addEventListener("change", (e) => {
        s.legalRetention = (e.target as HTMLInputElement).checked;
        update();
      });
      c.querySelector<HTMLInputElement>("#backupsInfo")?.addEventListener("input", (e) => {
        s.backupsInfo = (e.target as HTMLInputElement).value;
        update();
      });

      c.querySelectorAll<HTMLInputElement>('input[type="checkbox"][value]').forEach((cb) => {
        cb.addEventListener("change", () => {
          const val = cb.value;
          if (cb.checked) {
            if (!s.security.includes(val)) s.security.push(val);
          } else {
            s.security = s.security.filter((x) => x !== val);
          }
          update();
        });
      });
    },
  },

  // 9. Transferencias internacionales
  {
    id: "transfers",
    label: "Transferencias",
    lead: "Información sobre alojamiento de datos fuera de las fronteras de tu país.",
    required: false,
    isVisible: () => true,
    render: (c, s, update) => {
      c.innerHTML = `
        <label class="checkbox-card" style="margin-bottom: 1.25rem;">
          <input type="checkbox" id="intlTrans" ${s.transfers.international ? "checked" : ""}>
          <div class="checkbox-card-text">
            <span class="checkbox-card-title">Existen transferencias internacionales de datos</span>
            <span class="checkbox-card-hint">Por ejemplo servidores en EE.UU., CDNs globales o proveedores transfronterizos.</span>
          </div>
        </label>

        <div class="form-field" id="transMechWrap" style="${s.transfers.international ? "" : "opacity: 0.5;"}">
          <label class="field-label" for="transMech">Mecanismos y salvaguardas aplicadas</label>
          <textarea class="input-textarea" id="transMech" placeholder="Cláusulas Contractuales Tipo (SCC), Marco de Privacidad de Datos (DPF)...">${escapeHtml(s.transfers.mechanisms)}</textarea>
          <p class="field-hint">Garantías jurídicas para proteger los datos en destino.</p>
        </div>
      `;

      c.querySelector<HTMLInputElement>("#intlTrans")?.addEventListener("change", (e) => {
        s.transfers.international = (e.target as HTMLInputElement).checked;
        update();
      });
      c.querySelector<HTMLTextAreaElement>("#transMech")?.addEventListener("input", (e) => {
        s.transfers.mechanisms = (e.target as HTMLTextAreaElement).value;
        update();
      });
    },
  },

  // 10. Cookies y seguimiento
  {
    id: "cookies",
    label: "Cookies",
    lead: "Declaración de almacenamiento local, cookies técnicas, analíticas y publicitarias.",
    required: false,
    isVisible: () => true,
    render: (c, s, update) => {
      c.innerHTML = `
        <div class="checkbox-card-grid">
          ${COOKIES_CATEGORIES.map(
            (ck) => `
            <label class="checkbox-card">
              <input type="checkbox" data-cookie="${ck.v}" ${s.cookies[ck.v as keyof typeof s.cookies] ? "checked" : ""}>
              <div class="checkbox-card-text">
                <span class="checkbox-card-title">${ck.label}</span>
                <span class="checkbox-card-hint">${ck.hint}</span>
              </div>
            </label>
          `
          ).join("")}
        </div>
      `;

      c.querySelectorAll<HTMLInputElement>("input[data-cookie]").forEach((cb) => {
        cb.addEventListener("change", () => {
          const k = cb.getAttribute("data-cookie") as keyof typeof s.cookies;
          s.cookies[k] = cb.checked;
          update();
        });
      });
    },
  },

  // 11. Inteligencia Artificial (condicional)
  {
    id: "ai",
    label: "Inteligencia Artificial",
    lead: "Describe cómo se procesan los datos con modelos de IA y si hay decisiones automatizadas.",
    required: false,
    isVisible: (s) => s.features.ai,
    render: (c, s, update) => {
      c.innerHTML = `
        <div class="alert-banner alert-warning">
          ⚠️ El uso de IA en aplicaciones exige transparencia sobre qué datos se transmiten a proveedores y si se usan para re-entrenar modelos.
        </div>

        <div class="form-field">
          <label class="field-label" for="aiFunctions">Funciones asistidas por IA en la app <span class="req-star">*</span></label>
          <input class="input-text" id="aiFunctions" type="text" value="${escapeHtml(s.ai.functions)}" placeholder="Generación de textos, análisis de imágenes, asistencia..." />
        </div>

        <div class="form-field">
          <label class="field-label" for="aiDataSent">Datos enviados a los modelos de IA</label>
          <input class="input-text" id="aiDataSent" type="text" value="${escapeHtml(s.ai.dataSent)}" placeholder="Prompts del usuario, consultas, metadatos..." />
        </div>

        <div class="form-field">
          <label class="field-label" for="aiStored">Almacenamiento por el proveedor de IA</label>
          <input class="input-text" id="aiStored" type="text" value="${escapeHtml(s.ai.stored)}" />
        </div>

        <div class="form-field">
          <label class="field-label" for="aiTraining">Entrenamiento de modelos con datos de usuarios</label>
          <input class="input-text" id="aiTraining" type="text" value="${escapeHtml(s.ai.training)}" />
        </div>

        <label class="checkbox-card">
          <input type="checkbox" id="aiAutomated" ${s.ai.automated ? "checked" : ""}>
          <div class="checkbox-card-text">
            <span class="checkbox-card-title">Existen decisiones totalmente automatizadas con efectos jurídicos o significativos</span>
            <span class="checkbox-card-hint">Activa el derecho a intervención humana e impugnación (Art. 22 RGPD).</span>
          </div>
        </label>
      `;

      c.querySelector<HTMLInputElement>("#aiFunctions")?.addEventListener("input", (e) => {
        s.ai.functions = (e.target as HTMLInputElement).value;
        update();
      });
      c.querySelector<HTMLInputElement>("#aiDataSent")?.addEventListener("input", (e) => {
        s.ai.dataSent = (e.target as HTMLInputElement).value;
        update();
      });
      c.querySelector<HTMLInputElement>("#aiStored")?.addEventListener("input", (e) => {
        s.ai.stored = (e.target as HTMLInputElement).value;
        update();
      });
      c.querySelector<HTMLInputElement>("#aiTraining")?.addEventListener("input", (e) => {
        s.ai.training = (e.target as HTMLInputElement).value;
        update();
      });
      c.querySelector<HTMLInputElement>("#aiAutomated")?.addEventListener("change", (e) => {
        s.ai.automated = (e.target as HTMLInputElement).checked;
        update();
      });
    },
  },

  // 12. Menores (condicional)
  {
    id: "minors",
    label: "Menores de edad",
    lead: "Parámetros de edad mínima y consentimientos parentales aplicables.",
    required: false,
    isVisible: (s) => s.features.minors || s.audience === "minors",
    render: (c, s, update) => {
      c.innerHTML = `
        <div class="alert-banner alert-warning">
          ⚠️ Las aplicaciones con usuarios menores están sujetas a normativas de protección infantil severas (COPPA en EE.UU., RGPD-K en la UE). Se aconseja revisión especializada.
        </div>

        <div class="grid-two-cols">
          <div class="form-field">
            <label class="field-label" for="minAge">Edad mínima prevista <span class="req-star">*</span></label>
            <input class="input-text" id="minAge" type="text" value="${escapeHtml(s.minors.minAge)}" placeholder="13, 14, 16 o 18 años" />
          </div>
          <div class="form-field">
            <label class="field-label" for="minorsContact">Contacto específico para consultas de menores</label>
            <input class="input-text" id="minorsContact" type="email" value="${escapeHtml(s.minors.specialContact)}" placeholder="menores@miapp.com" />
          </div>
        </div>

        <label class="checkbox-card">
          <input type="checkbox" id="minParental" ${s.minors.parental ? "checked" : ""}>
          <div class="checkbox-card-text">
            <span class="checkbox-card-title">Se recaba consentimiento parental verificable</span>
            <span class="checkbox-card-hint">Mecanismos de verificación del permiso de padres o tutores.</span>
          </div>
        </label>
      `;

      c.querySelector<HTMLInputElement>("#minAge")?.addEventListener("input", (e) => {
        s.minors.minAge = (e.target as HTMLInputElement).value;
        update();
      });
      c.querySelector<HTMLInputElement>("#minorsContact")?.addEventListener("input", (e) => {
        s.minors.specialContact = (e.target as HTMLInputElement).value;
        update();
      });
      c.querySelector<HTMLInputElement>("#minParental")?.addEventListener("change", (e) => {
        s.minors.parental = (e.target as HTMLInputElement).checked;
        update();
      });
    },
  },

  // 13. Documentos a generar
  {
    id: "docs",
    label: "Documentos",
    lead: "Selecciona cuáles documentos legales necesitas generar a partir de tu configuración.",
    required: true,
    isVisible: () => true,
    render: (c, s, update) => {
      const docChoices: { id: DocumentId; title: string; desc: string }[] = [
        { id: "privacy", title: "Política de Privacidad", desc: "Tratamiento de datos personales, bases legales y derechos" },
        { id: "terms", title: "Términos y Condiciones", desc: "Reglas de uso, propiedad intelectual y responsabilidades" },
        { id: "legal", title: "Aviso Legal", desc: "Identificación corporativa obligatoria (LSSI / comercio web)" },
        { id: "cookies", title: "Política de Cookies", desc: "Almacenamiento local y seguimiento" },
        { id: "deletion", title: "Eliminación de Cuentas y Datos", desc: "Procedimiento exigido por Google Play y App Store" },
        { id: "storeDisclosure", title: "Divulgación para Tiendas", desc: "Resumen adaptado a formularios de seguridad de datos" },
      ];

      c.innerHTML = `
        <div class="checkbox-card-grid">
          ${docChoices
            .map(
              (d) => `
            <label class="checkbox-card">
              <input type="checkbox" data-doc="${d.id}" ${s.docs[d.id] ? "checked" : ""}>
              <div class="checkbox-card-text">
                <span class="checkbox-card-title">${d.title}</span>
                <span class="checkbox-card-hint">${d.desc}</span>
              </div>
            </label>
          `
            )
            .join("")}
        </div>

        <div class="form-field" style="margin-top: 1.25rem;">
          <label class="field-label" for="storeExtra">Información adicional para la divulgación de tiendas (opcional)</label>
          <textarea class="input-textarea" id="storeExtra" placeholder="Notas internas para Google Play Console o App Store Connect...">${escapeHtml(s.docs.storeDisclosureExtra || "")}</textarea>
        </div>
      `;

      c.querySelectorAll<HTMLInputElement>("input[data-doc]").forEach((cb) => {
        cb.addEventListener("change", () => {
          const docId = cb.getAttribute("data-doc") as DocumentId;
          s.docs[docId] = cb.checked;
          update();
        });
      });

      c.querySelector<HTMLTextAreaElement>("#storeExtra")?.addEventListener("input", (e) => {
        s.docs.storeDisclosureExtra = (e.target as HTMLTextAreaElement).value;
        update();
      });
    },
  },

  // 14. Revisión y Editor de Resultados
  {
    id: "review",
    label: "Revisión y exportar",
    lead: "Verifica tus respuestas, evalúa advertencias legales y genera/edita tus documentos.",
    required: true,
    isVisible: () => true,
    render: (c, s, update) => {
      const recommendations = evaluateDocumentRules(s);

      // Si aún no se han generado documentos, generarlos automáticamente para mostrar vista previa de inmediato
      if (!s.generatedDocs || Object.keys(s.generatedDocs).length === 0) {
        s.generatedDocs = generateAllDocuments(s);
        update();
      }

      const initialKeys = Object.keys(s.generatedDocs) as DocumentId[];
      if (initialKeys.length > 0 && !initialKeys.includes(activeResultDoc)) {
        activeResultDoc = initialKeys[0];
      }

      // Notificaciones Toast
      const showToastMsg = (msg: string) => {
        const toast = document.querySelector("#globalToast");
        if (toast) {
          toast.textContent = msg;
          toast.setAttribute("data-active", "true");
          setTimeout(() => toast.removeAttribute("data-active"), 2600);
        }
      };

      // Contador de palabras y caracteres
      const getDocStatsText = (text: string): string => {
        const trimmed = text.trim();
        const words = trimmed ? trimmed.split(/\s+/).length : 0;
        const chars = text.length;
        return `${words.toLocaleString()} palabras · ${chars.toLocaleString()} caracteres`;
      };

      c.innerHTML = `
        <!-- Summary cards -->
        <div style="background-color: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 1.25rem; margin-bottom: 1.5rem;">
          <h3 style="font-size: 1.05rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-main);">Resumen de configuración</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; font-size: 0.88rem;">
            <div><span style="color: var(--text-dim); display: block; font-size: 0.75rem;">APLICACIÓN</span><strong>${escapeHtml(s.appName || "—")}</strong></div>
            <div><span style="color: var(--text-dim); display: block; font-size: 0.75rem;">RESPONSABLE</span><strong>${escapeHtml(s.responsibleName || "—")} (${s.country || "—"})</strong></div>
            <div><span style="color: var(--text-dim); display: block; font-size: 0.75rem;">VIGENCIA</span><strong>${formatDateSpanish(s.effectiveDate)}</strong></div>
            <div><span style="color: var(--text-dim); display: block; font-size: 0.75rem;">DATOS / FINALIDADES</span><strong>${s.dataCategories.length} cat. / ${s.purposes.length} fin.</strong></div>
          </div>
        </div>

        <!-- Rule warnings & recommendations -->
        ${
          recommendations.length > 0
            ? recommendations
                .map(
                  (r) => `
              <div class="alert-banner ${r.type === "warning" ? "alert-warning" : "alert-info"}">
                <span>${r.type === "warning" ? "⚠️" : "💡"}</span>
                <div>${escapeHtml(r.message)}</div>
              </div>
            `
                )
                .join("")
            : ""
        }

        <!-- Generate button bar -->
        <div style="display: flex; gap: 1rem; align-items: center; margin: 1.5rem 0; flex-wrap: wrap;">
          <button class="btn btn-primary" id="generateAllDocsBtn" type="button" style="font-size: 1rem; padding: 0.75rem 1.5rem; display: inline-flex; align-items: center; gap: 0.5rem; font-weight: 600;">
            <span>⚡</span> <span id="generateBtnLabel">Generar borradores de documentos</span>
          </button>
          <span style="color: var(--text-muted); font-size: 0.88rem;">Procesamiento 100% privado en tu navegador.</span>
          <span id="genStatusBadge" style="display: none; align-items: center; gap: 0.35rem; color: #10b981; font-weight: 600; font-size: 0.88rem;"></span>
        </div>

        <!-- Results Viewer / Editor -->
        <div id="resultsContainer"></div>
      `;

      // Renderizador interactivo del visor y editor de documentos
      const renderResultsArea = () => {
        const resultsEl = c.querySelector("#resultsContainer");
        if (!resultsEl) return;

        const generatedKeys = Object.keys(s.generatedDocs) as DocumentId[];
        if (generatedKeys.length === 0) {
          resultsEl.innerHTML = `
            <div style="background-color: var(--bg-surface-elevated); border: 1px dashed var(--border-subtle); border-radius: var(--radius-sm); padding: 2.5rem; text-align: center; margin-top: 1rem;">
              <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 1.25rem;">Pulsa el botón superior para generar los documentos a partir de tus respuestas.</p>
              <button class="btn btn-primary" id="emptyGenerateBtn" type="button">⚡ Generar borradores ahora</button>
            </div>
          `;
          resultsEl.querySelector("#emptyGenerateBtn")?.addEventListener("click", () => {
            triggerGeneration();
          });
          return;
        }

        if (!generatedKeys.includes(activeResultDoc)) {
          activeResultDoc = generatedKeys[0];
        }

        const currentText = s.generatedDocs[activeResultDoc] || "";

        resultsEl.innerHTML = `
          <div class="doc-tabs-nav" role="tablist" aria-label="Pestañas de documentos">
            ${generatedKeys
              .map(
                (k) => `
              <button class="doc-tab-button" role="tab" data-doc-id="${k}" aria-selected="${k === activeResultDoc ? "true" : "false"}" type="button">
                ${DOC_DISPLAY_NAMES[k] || k}
              </button>
            `
              )
              .join("")}
          </div>

          <div class="doc-editor-header">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span id="activeDocTitle" style="font-size: 1.05rem; font-weight: 700; color: var(--text-main);">
                📄 ${DOC_DISPLAY_NAMES[activeResultDoc] || activeResultDoc}
              </span>
              <span style="background: rgba(37,99,235,0.12); color: var(--accent-primary); padding: 0.15rem 0.55rem; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600;">Borrador editable</span>
            </div>
            <div id="docStats" style="font-size: 0.82rem; color: var(--text-muted);">
              ${getDocStatsText(currentText)}
            </div>
          </div>

          <textarea class="document-editor-area" id="docEditorArea" aria-label="Editor de documento">${escapeHtml(currentText)}</textarea>
          <p style="font-size: 0.8rem; color: var(--text-dim); margin-top: 0.35rem;">💡 Puedes editar o ajustar el texto directamente en el recuadro superior antes de copiar o descargar.</p>

          <div class="document-toolbar">
            <button class="btn" id="copyDocBtn" type="button">📋 Copiar documento</button>
            <button class="btn btn-primary" id="downloadPdfBtn" type="button">📄 Descargar PDF</button>
            <button class="btn" id="downloadTxtBtn" type="button">📝 Descargar TXT</button>
            <button class="btn" id="downloadHtmlBtn" type="button">🌐 Descargar HTML</button>
            <button class="btn" id="printDocBtn" type="button">🖨️ Imprimir</button>
            <button class="btn btn-ghost" id="regenerateDocBtn" type="button">🔄 Restaurar borrador original</button>
          </div>

          <div class="alert-banner alert-warning" style="margin-top: 1.5rem;">
            ⚖️ <strong>Aviso legal importante:</strong> Los documentos generados son borradores informativos basados en los datos proporcionados y en plantillas estructuradas. No constituyen asesoramiento jurídico formal ni garantizan el cumplimiento de la legislación aplicable en cada territorio. Antes de publicarlos, comprueba que describen con total veracidad tus prácticas reales y considera obtener asesoramiento profesional cuando corresponda.
          </div>
        `;

        // Cambio interactivo e instantáneo de pestañas
        const tabBtns = resultsEl.querySelectorAll<HTMLButtonElement>(".doc-tab-button");
        tabBtns.forEach((btn) => {
          btn.addEventListener("click", () => {
            const docId = btn.getAttribute("data-doc-id") as DocumentId;
            if (docId === activeResultDoc) return;

            // 1. Guardar cambios del documento actual antes de alternar
            const editorEl = resultsEl.querySelector<HTMLTextAreaElement>("#docEditorArea");
            if (editorEl) {
              s.generatedDocs[activeResultDoc] = editorEl.value;
            }

            // 2. Cambiar documento activo
            activeResultDoc = docId;

            // 3. Actualizar estilo visual de las pestañas
            tabBtns.forEach((b) => {
              b.setAttribute(
                "aria-selected",
                b.getAttribute("data-doc-id") === activeResultDoc ? "true" : "false"
              );
            });

            // 4. Actualizar contenido del editor de texto
            const newText = s.generatedDocs[activeResultDoc] || "";
            if (editorEl) {
              editorEl.value = newText;
            }

            // 5. Actualizar título y estadísticas
            const titleEl = resultsEl.querySelector("#activeDocTitle");
            if (titleEl) {
              titleEl.textContent = `📄 ${DOC_DISPLAY_NAMES[activeResultDoc] || activeResultDoc}`;
            }
            const statsEl = resultsEl.querySelector("#docStats");
            if (statsEl) {
              statsEl.textContent = getDocStatsText(newText);
            }

            // 6. Persistir en localStorage
            update();
          });
        });

        // Edición manual en vivo en el área de texto
        const editor = resultsEl.querySelector<HTMLTextAreaElement>("#docEditorArea");
        editor?.addEventListener("input", () => {
          s.generatedDocs[activeResultDoc] = editor.value;
          const statsEl = resultsEl.querySelector("#docStats");
          if (statsEl) {
            statsEl.textContent = getDocStatsText(editor.value);
          }
          update();
        });

        // Botón Copiar documento
        const copyBtn = resultsEl.querySelector<HTMLButtonElement>("#copyDocBtn");
        copyBtn?.addEventListener("click", async () => {
          const text = editor ? editor.value : (s.generatedDocs[activeResultDoc] || "");
          s.generatedDocs[activeResultDoc] = text;
          update();

          const ok = await copyTextToClipboard(text);
          if (ok) {
            copyBtn.textContent = "✓ ¡Copiado!";
            showToastMsg(`✅ "${DOC_DISPLAY_NAMES[activeResultDoc]}" copiado al portapapeles.`);
            setTimeout(() => {
              copyBtn.textContent = "📋 Copiar documento";
            }, 2000);
          } else {
            showToastMsg("⚠️ No se pudo copiar automáticamente. Por favor, selecciona el texto.");
          }
        });

        // Botón Descargar PDF
        const pdfBtn = resultsEl.querySelector<HTMLButtonElement>("#downloadPdfBtn");
        pdfBtn?.addEventListener("click", async () => {
          const text = editor ? editor.value : (s.generatedDocs[activeResultDoc] || "");
          s.generatedDocs[activeResultDoc] = text;
          update();

          pdfBtn.disabled = true;
          pdfBtn.innerHTML = `<span class="spin-icon">⏳</span> <span>Generando PDF...</span>`;
          try {
            await exportDocumentToPDF(activeResultDoc, text, s);
            showToastMsg(`✅ PDF de "${DOC_DISPLAY_NAMES[activeResultDoc]}" descargado.`);
          } catch (err) {
            console.error("PDF export error:", err);
            showToastMsg("⚠️ Ocurrió un error al generar el PDF.");
          } finally {
            pdfBtn.disabled = false;
            pdfBtn.innerHTML = "📄 Descargar PDF";
          }
        });

        // Botón Descargar TXT
        resultsEl.querySelector("#downloadTxtBtn")?.addEventListener("click", () => {
          const text = editor ? editor.value : (s.generatedDocs[activeResultDoc] || "");
          s.generatedDocs[activeResultDoc] = text;
          update();
          exportDocumentToTXT(activeResultDoc, text, s);
          showToastMsg(`✅ Archivo TXT descargado.`);
        });

        // Botón Descargar HTML
        resultsEl.querySelector("#downloadHtmlBtn")?.addEventListener("click", () => {
          const text = editor ? editor.value : (s.generatedDocs[activeResultDoc] || "");
          s.generatedDocs[activeResultDoc] = text;
          update();
          exportDocumentToHTML(activeResultDoc, text, s);
          showToastMsg(`✅ Archivo HTML descargado.`);
        });

        // Botón Imprimir
        resultsEl.querySelector("#printDocBtn")?.addEventListener("click", () => {
          const text = editor ? editor.value : (s.generatedDocs[activeResultDoc] || "");
          s.generatedDocs[activeResultDoc] = text;
          update();
          window.print();
        });

        // Botón Restaurar borrador original
        resultsEl.querySelector("#regenerateDocBtn")?.addEventListener("click", () => {
          if (
            !confirm(
              `¿Deseas restaurar "${DOC_DISPLAY_NAMES[activeResultDoc]}" con los datos actuales del formulario? Se perderán las modificaciones manuales que hayas escrito en este texto.`
            )
          ) {
            return;
          }
          const fresh = generateAllDocuments(s);
          const restoredText = fresh[activeResultDoc] || "";
          s.generatedDocs[activeResultDoc] = restoredText;
          if (editor) {
            editor.value = restoredText;
          }
          const statsEl = resultsEl.querySelector("#docStats");
          if (statsEl) {
            statsEl.textContent = getDocStatsText(restoredText);
          }
          update();
          showToastMsg(`✅ Borrador original de "${DOC_DISPLAY_NAMES[activeResultDoc]}" restaurado.`);
        });
      };

      // Disparador principal de generación con retroalimentación visual inmediata
      const triggerGeneration = () => {
        const btn = c.querySelector<HTMLButtonElement>("#generateAllDocsBtn");
        const statusBadge = c.querySelector<HTMLElement>("#genStatusBadge");

        if (btn) {
          btn.disabled = true;
          btn.innerHTML = `<span class="spin-icon">⚙️</span> <span>Generando documentos...</span>`;
        }

        // Generación en memoria con todas las respuestas recopiladas
        const freshDocs = generateAllDocuments(s);
        s.generatedDocs = freshDocs;

        const newKeys = Object.keys(freshDocs) as DocumentId[];
        if (newKeys.length > 0 && !newKeys.includes(activeResultDoc)) {
          activeResultDoc = newKeys[0];
        }

        update();

        // Breve animación fluida (150ms) para que el usuario perciba la acción con total claridad
        setTimeout(() => {
          renderResultsArea();

          if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<span>✅</span> <span>¡Borradores actualizados!</span>`;
            setTimeout(() => {
              btn.innerHTML = `<span>⚡</span> <span>Actualizar borradores de documentos</span>`;
            }, 2500);
          }

          if (statusBadge) {
            statusBadge.style.display = "inline-flex";
            statusBadge.textContent = `✓ ${newKeys.length} documentos listos`;
            setTimeout(() => {
              statusBadge.style.display = "none";
            }, 3500);
          }

          showToastMsg("✅ Documentos generados y actualizados con éxito según tus respuestas.");
        }, 150);
      };

      // Vincular botón principal de generación
      c.querySelector("#generateAllDocsBtn")?.addEventListener("click", () => {
        triggerGeneration();
      });

      // Render inicial de la vista de resultados
      renderResultsArea();
    },
  },
];
