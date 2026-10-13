import type { LegalDocsState, DocumentId } from "@/types";
import {
  APP_TYPES,
  DATA_CATEGORIES,
  PURPOSES,
  SECURITY_MEASURES,
  COOKIES_CATEGORIES,
} from "@/data/catalogs";
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
            <label class="field-label" for="country">País del responsable <span class="req-star">*</span></label>
            <input class="input-text" id="country" type="text" value="${escapeHtml(s.country)}" placeholder="España, México, Argentina..." />
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
      c.querySelector<HTMLInputElement>("#country")?.addEventListener("input", (e) => {
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
      c.innerHTML = `
        <div class="alert-banner alert-info">
          ℹ️ Añade los proveedores que utiliza tu aplicación. Se integrarán en la sección de destinatarios de la política.
        </div>

        <div id="thirdPartyList">
          ${
            s.thirdParties.length === 0
              ? `<p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1rem;">No has añadido proveedores externos aún.</p>`
              : s.thirdParties
                  .map(
                    (tp, idx) => `
            <div class="third-party-row" data-index="${idx}">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <strong style="color: var(--text-main);">${escapeHtml(tp.name || `Proveedor #${idx + 1}`)}</strong>
                <button class="btn btn-sm btn-danger-ghost remove-tp-btn" data-index="${idx}" type="button">Eliminar</button>
              </div>
              <div class="grid-two-cols">
                <input class="input-text tp-name" type="text" placeholder="Nombre (ej. AWS, Stripe, Google...)" value="${escapeHtml(tp.name)}" />
                <input class="input-text tp-service" type="text" placeholder="Servicio (ej. Hosting, Pagos...)" value="${escapeHtml(tp.service)}" />
              </div>
              <div class="grid-two-cols">
                <input class="input-text tp-data" type="text" placeholder="Datos recibidos (ej. IP, correo...)" value="${escapeHtml(tp.data)}" />
                <input class="input-text tp-purpose" type="text" placeholder="Finalidad (ej. Procesar cobros...)" value="${escapeHtml(tp.purpose)}" />
              </div>
              <input class="input-text tp-policy" type="url" placeholder="Enlace a su política de privacidad (opcional)" value="${escapeHtml(tp.policyUrl)}" />
            </div>
          `
                  )
                  .join("")
          }
        </div>

        <button class="btn btn-sm" id="addTpBtn" type="button" style="margin-top: 0.5rem;">+ Añadir proveedor externo</button>
      `;

      c.querySelector("#addTpBtn")?.addEventListener("click", () => {
        s.thirdParties.push({
          id: String(Date.now()),
          name: "",
          service: "",
          data: "",
          purpose: "",
          policyUrl: "",
        });
        update();
      });

      c.querySelectorAll<HTMLButtonElement>(".remove-tp-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = Number(btn.getAttribute("data-index"));
          s.thirdParties.splice(idx, 1);
          update();
        });
      });

      c.querySelectorAll(".third-party-row").forEach((row) => {
        const idx = Number(row.getAttribute("data-index"));
        row.querySelector<HTMLInputElement>(".tp-name")?.addEventListener("input", (e) => {
          s.thirdParties[idx].name = (e.target as HTMLInputElement).value;
        });
        row.querySelector<HTMLInputElement>(".tp-service")?.addEventListener("input", (e) => {
          s.thirdParties[idx].service = (e.target as HTMLInputElement).value;
        });
        row.querySelector<HTMLInputElement>(".tp-data")?.addEventListener("input", (e) => {
          s.thirdParties[idx].data = (e.target as HTMLInputElement).value;
        });
        row.querySelector<HTMLInputElement>(".tp-purpose")?.addEventListener("input", (e) => {
          s.thirdParties[idx].purpose = (e.target as HTMLInputElement).value;
        });
        row.querySelector<HTMLInputElement>(".tp-policy")?.addEventListener("input", (e) => {
          s.thirdParties[idx].policyUrl = (e.target as HTMLInputElement).value;
        });
      });
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
      const generatedKeys = Object.keys(s.generatedDocs) as DocumentId[];

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

        <!-- Generate button -->
        <div style="display: flex; gap: 1rem; align-items: center; margin: 1.5rem 0;">
          <button class="btn btn-primary" id="generateAllDocsBtn" type="button" style="font-size: 1rem; padding: 0.75rem 1.5rem;">
            ⚡ Generar borradores de documentos
          </button>
          <span style="color: var(--text-muted); font-size: 0.88rem;">Procesamiento 100% privado en tu navegador.</span>
        </div>

        <!-- Results Viewer / Editor -->
        <div id="resultsContainer">
          ${
            generatedKeys.length === 0
              ? `<p style="color: var(--text-muted); font-size: 0.95rem; margin-top: 1rem;">Pulsa el botón superior para generar los documentos.</p>`
              : `
            <div class="doc-tabs-nav" role="tablist">
              ${generatedKeys
                .map(
                  (k) => `
                <button class="doc-tab-button" role="tab" data-doc-id="${k}" aria-selected="${k === activeResultDoc ? "true" : "false"}">
                  ${DOC_DISPLAY_NAMES[k] || k}
                </button>
              `
                )
                .join("")}
            </div>

            <textarea class="document-editor-area" id="docEditorArea" aria-label="Editor de documento">${escapeHtml(s.generatedDocs[activeResultDoc] || "")}</textarea>

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
          `
          }
        </div>
      `;

      // Hook up Generate button
      c.querySelector("#generateAllDocsBtn")?.addEventListener("click", () => {
        s.generatedDocs = generateAllDocuments(s);
        const keys = Object.keys(s.generatedDocs) as DocumentId[];
        if (keys.length > 0 && !keys.includes(activeResultDoc)) {
          activeResultDoc = keys[0];
        }
        update();
      });

      // Hook up tab switches
      c.querySelectorAll<HTMLButtonElement>(".doc-tab-button").forEach((btn) => {
        btn.addEventListener("click", () => {
          activeResultDoc = btn.getAttribute("data-doc-id") as DocumentId;
          update();
        });
      });

      // Hook up Editor modifications
      const editor = c.querySelector<HTMLTextAreaElement>("#docEditorArea");
      editor?.addEventListener("input", () => {
        s.generatedDocs[activeResultDoc] = editor.value;
      });

      // Hook up Copy
      c.querySelector("#copyDocBtn")?.addEventListener("click", async () => {
        const text = s.generatedDocs[activeResultDoc] || "";
        const ok = await copyTextToClipboard(text);
        const toast = document.querySelector("#globalToast");
        if (toast) {
          toast.textContent = ok ? "✅ Documento copiado al portapapeles." : "⚠️ No se pudo copiar automáticamente. Selecciona el texto.";
          toast.setAttribute("data-active", "true");
          setTimeout(() => toast.removeAttribute("data-active"), 2500);
        }
      });

      // Hook up PDF
      c.querySelector("#downloadPdfBtn")?.addEventListener("click", async () => {
        const text = s.generatedDocs[activeResultDoc] || "";
        await exportDocumentToPDF(activeResultDoc, text, s);
      });

      // Hook up TXT
      c.querySelector("#downloadTxtBtn")?.addEventListener("click", () => {
        const text = s.generatedDocs[activeResultDoc] || "";
        exportDocumentToTXT(activeResultDoc, text, s);
      });

      // Hook up HTML
      c.querySelector("#downloadHtmlBtn")?.addEventListener("click", () => {
        const text = s.generatedDocs[activeResultDoc] || "";
        exportDocumentToHTML(activeResultDoc, text, s);
      });

      // Hook up Print
      c.querySelector("#printDocBtn")?.addEventListener("click", () => {
        window.print();
      });

      // Hook up Regenerate
      c.querySelector("#regenerateDocBtn")?.addEventListener("click", () => {
        if (!confirm("¿Deseas regenerar este documento con los datos actuales del formulario? Se perderán las modificaciones manuales que hayas escrito.")) return;
        const freshDocs = generateAllDocuments(s);
        s.generatedDocs[activeResultDoc] = freshDocs[activeResultDoc];
        update();
      });
    },
  },
];
