// ============================================================
//  script.js — SkyTech Prestation Informatique
//  Modules : Supabase | Services | Panier | Devis
// ============================================================

// ─────────────────────────────────────────────
//  1. CONFIGURATION SUPABASE
//  ⚠️  Remplacez ces deux valeurs par les vôtres :
//      Supabase → Settings → API
// ─────────────────────────────────────────────
const SUPABASE_URL = "https://lehzfplwzvatviasqlpm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlaHpmcGx3enZhdHZpYXNxbHBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzc1NjIsImV4cCI6MjA5NDc1MzU2Mn0.ort5PmxtiokaSkiyEDCBApRKs4s51vin2kqQDZbywNo";

let supabaseClient = null;

function getSupabase() {
  if (!supabaseClient) {
    if (typeof window.supabase === "undefined") {
      console.error("❌ Supabase SDK non chargé. Vérifiez le <script> CDN dans votre HTML.");
      return null;
    }
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  }
  return supabaseClient;
}


// ─────────────────────────────────────────────
//  2. CATALOGUE DES SERVICES
// ─────────────────────────────────────────────
const CATALOGUE = {
  maintenance: {
    key: "maintenance",
    nom: "Maintenance Ordinateur",
    prix: "10 000 FCFA",
    desc: "Nettoyage, réparation, optimisation complète",
    description: "Maintenance & réparation informatique",
    descriptionText: "Nettoyage, optimisation et réparation selon l'état de votre ordinateur. Diagnostic rapide et exécution soignée.",
    supports: [
      { icon: "🖥️", nom: "PC fixe (tour)",      prix: "Forfait selon diagnostic" },
      { icon: "💻", nom: "PC portable",           prix: "Forfait selon diagnostic" },
      { icon: "🧠", nom: "Windows (7/10/11)",     prix: "Optimisation incluse"    },
    ],
    prestations: [
      { icon: "🧹", nom: "Nettoyage complet",  prix: "15 000 FCFA" },
      { icon: "🔧", nom: "Réparation système", prix: "25 000 FCFA" },
      { icon: "⚡", nom: "Optimisation PC",    prix: "9 500 FCFA"  },
    ],
  },

  siteweb: {
    key: "siteweb",
    nom: "Création de site web",
    prix: "50 000 FCFA",
    desc: "Sites professionnels modernes",
    description: "Création de site web",
    descriptionText: "Des sites modernes et rapides : vitrine, e-commerce et optimisation (SEO + performance).",
    supports: [
      { icon: "🌐", nom: "Site responsive (mobile + PC)", prix: "Inclus" },
      { icon: "🧩", nom: "Design moderne & UI pro",       prix: "Inclus" },
      { icon: "🔧", nom: "Mise en page & performance",    prix: "Inclus" },
    ],
    prestations: [
      { icon: "🏠", nom: "Site vitrine",     prix: "50 000 FCFA"  },
      { icon: "🛒", nom: "Site e-commerce",  prix: "150 000 FCFA" },
      { icon: "⚡", nom: "Site rapide + SEO",prix: "80 000 FCFA"  },
    ],
  },

  logiciel: {
    key: "logiciel",
    nom: "Installation Logiciels",
    prix: "10 000 FCFA",
    desc: "Installation Windows, Office, antivirus",
    description: "Installation de logiciels",
    descriptionText: "Installation Windows/Office et antivirus, avec configuration de base pour une utilisation sécurisée.",
    supports: [
      { icon: "🪟", nom: "Windows",    prix: "Forfait selon version" },
      { icon: "📚", nom: "Pack Office", prix: "Inclus selon choix"   },
      { icon: "🛡️", nom: "Antivirus",  prix: "Choix & configuration" },
    ],
    prestations: [
      { icon: "💿", nom: "Installation Windows", prix: "8 000 FCFA" },
      { icon: "📦", nom: "Pack Office",           prix: "5 000 FCFA" },
      { icon: "🛡️", nom: "Antivirus",             prix: "3 000 FCFA" },
    ],
  },

  telephone: {
    key: "telephone",
    nom: "Solutions Téléphone",
    prix: "7 000 FCFA",
    desc: "Configuration, déblocage, optimisation",
    description: "Solutions téléphone",
    descriptionText: "Configuration, déblocage et optimisation de votre smartphone pour un usage fluide et sécurisé.",
    supports: [
      { icon: "📱", nom: "Android / iPhone",       prix: "Selon modèle" },
      { icon: "🔐", nom: "Sécurité & optimisation",prix: "Inclus"       },
      { icon: "📶", nom: "Réseau & performance",   prix: "Inclus"       },
    ],
    prestations: [
      { icon: "📱", nom: "Configuration", prix: "4 000 FCFA" },
      { icon: "🔓", nom: "Déblocage",     prix: "6 000 FCFA" },
      { icon: "⚙️", nom: "Optimisation",  prix: "5 000 FCFA" },
    ],
  },

  domicile: {
    key: "domicile",
    nom: "Cours à domicile",
    prix: "20 000 FCFA",
    desc: "Formation pratique en informatique à domicile",
    description: "Cours à domicile",
    descriptionText: "Formation pratique avec explications claires : initiation, bureautique et internet/email.",
    supports: [
      { icon: "🎓", nom: "Initiation informatique", prix: "Forfait" },
      { icon: "🖥️", nom: "Pratique avec exercices", prix: "Inclus"  },
      { icon: "🌍", nom: "Internet & Email",         prix: "Inclus"  },
    ],
    prestations: [
      { icon: "📘", nom: "Initiation informatique",   prix: "20 000 FCFA" },
      { icon: "💻", nom: "Word / Excel / PowerPoint", prix: "30 000 FCFA" },
      { icon: "🌐", nom: "Internet & Email",           prix: "8 000 FCFA"  },
    ],
  },

  bureautique: {
    key: "bureautique",
    nom: "Bureautique",
    prix: "5 000 FCFA",
    desc: "Formation et assistance sur les outils bureautiques",
    description: "Bureautique",
    descriptionText: "Apprentissage et assistance sur les outils bureautiques pour gagner du temps et produire des documents pro.",
    supports: [
      { icon: "📝", nom: "Microsoft Word",  prix: "Forfait" },
      { icon: "📊", nom: "Microsoft Excel", prix: "Forfait" },
      { icon: "📌", nom: "PowerPoint",      prix: "Forfait" },
    ],
    prestations: [
      { icon: "📝", nom: "Microsoft Word",  prix: "5 000 FCFA"  },
      { icon: "📊", nom: "Microsoft Excel", prix: "15 000 FCFA" },
      { icon: "📽️", nom: "PowerPoint",      prix: "8 000 FCFA"  },
      { icon: "📧", nom: "Gestion Email",   prix: "4 000 FCFA"  },
    ],
  },
};


// ─────────────────────────────────────────────
//  3. UTILITAIRES
// ─────────────────────────────────────────────
function el(id) {
  return document.getElementById(id) || null;
}

function parsePrix(str) {
  if (!str || !String(str).toUpperCase().includes("FCFA")) return NaN;
  return parseInt(String(str).replace(/[^0-9]/g, ""), 10);
}

function formatPrix(num) {
  return `${num.toLocaleString("fr-FR")} FCFA`;
}

function showToast(message, type = "success") {
  const existingToast = document.getElementById("toast-notify");
  if (existingToast) existingToast.remove();

  const colors = { success: "#22c55e", error: "#ef4444", info: "#3b82f6" };
  const toast = document.createElement("div");
  toast.id = "toast-notify";
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    background: ${colors[type] || colors.info}; color: #fff;
    padding: 14px 22px; border-radius: 10px; font-size: 15px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
  `;
  toast.innerText = message;

  const style = document.createElement("style");
  style.innerText = `@keyframes slideIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`;
  document.head.appendChild(style);

  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}


// ─────────────────────────────────────────────
//  4. FORMULAIRE DE DEVIS → SUPABASE
// ─────────────────────────────────────────────
async function initFormulaireDevis() {
  const form = el("devisForm");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const demande = {
      nom:     el("nom")?.value.trim()     || "",
      email:   el("email")?.value.trim()   || "",
      service: el("service")?.value.trim() || "",
      message: el("message")?.value.trim() || "",
    };

    if (!demande.nom || !demande.email || !demande.service) {
      showToast("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    const db = getSupabase();

    if (db) {
      const { error } = await db.from("devis").insert([demande]);

      if (error) {
        console.error("Erreur Supabase :", error.message);
        // Fallback localStorage si erreur
        const saved = JSON.parse(localStorage.getItem("devis")) || [];
        saved.push({ ...demande, createdAt: new Date().toISOString() });
        localStorage.setItem("devis", JSON.stringify(saved));
        showToast("✅ Demande envoyée (sauvegarde locale) !");
        form.reset();
        return;
      }

      showToast("✅ Demande de devis envoyée avec succès !");
      form.reset();
    } else {
      // Fallback localStorage si Supabase non chargé
      const saved = JSON.parse(localStorage.getItem("devis")) || [];
      saved.push({ ...demande, createdAt: new Date().toISOString() });
      localStorage.setItem("devis", JSON.stringify(saved));
      showToast("✅ Demande enregistrée localement !");
      form.reset();
    }
  });
}


// ─────────────────────────────────────────────
//  5. NAVIGATION VERS LA PAGE SERVICE
// ─────────────────────────────────────────────
function voirService(key) {
  const service = CATALOGUE[key];
  if (!service) {
    console.warn(`Service inconnu : "${key}"`);
    return;
  }
  localStorage.setItem("serviceActif", JSON.stringify(service));
  window.location.href = "service.html";
}


// ─────────────────────────────────────────────
//  6. PAGE SERVICE — Affichage dynamique
// ─────────────────────────────────────────────
function initPageService() {
  const service = JSON.parse(localStorage.getItem("serviceActif") || "null");

  const titreEl   = el("nom");
  const detailsEl = el("details");

  if (!titreEl || !detailsEl) return;

  if (!service || !CATALOGUE[service.key]) {
    titreEl.innerText = "Service introuvable";
    return;
  }

  const pack = CATALOGUE[service.key];

  titreEl.innerText = pack.nom;
  const descEl     = el("descriptionService");
  const descTextEl = el("descriptionServiceText");
  if (descEl)     descEl.innerText     = pack.description     || "";
  if (descTextEl) descTextEl.innerText = pack.descriptionText || "";

  const supportsEl = el("ordinateurs");
  if (supportsEl) {
    supportsEl.innerHTML = pack.supports.map(s => `
      <div class="col-md-4 mb-3">
        <div class="detail-card">
          <div class="detail-icon">${s.icon}</div>
          <h5>${s.nom}</h5>
          <div class="detail-price">${s.prix}</div>
        </div>
      </div>
    `).join("");
  }

  detailsEl.innerHTML = pack.prestations.map((item, i) => {
    const id = `opt_${pack.key}_${i}`;
    return `
      <div class="col-md-4 mb-4">
        <label class="detail-card" style="cursor:pointer; user-select:none;" for="${id}">
          <input type="checkbox" class="form-check-input option-checkbox"
                 id="${id}" data-nom="${item.nom}" data-prix="${item.prix}"
                 style="margin-right:10px; transform:translateY(2px);">
          <div class="detail-icon">${item.icon}</div>
          <h5 class="mt-2">${item.nom}</h5>
          <div class="detail-price">${item.prix}</div>
        </label>
      </div>
    `;
  }).join("");

  const optionsTexteEl = el("optionsChoisiesText");
  const totalTexteEl   = el("totalEstimeText");
  if (optionsTexteEl) optionsTexteEl.innerText = "Aucune option sélectionnée.";
  if (totalTexteEl)   totalTexteEl.innerText   = "0 FCFA";

  function mettreAJourResume() {
    const checkboxes = document.querySelectorAll(".option-checkbox");
    const selectionnees = [];
    let total = 0;
    let totalChiffrable = true;

    checkboxes.forEach(cb => {
      if (!cb.checked) return;
      const prix    = cb.dataset.prix || "";
      const prixNum = parsePrix(prix);
      selectionnees.push(cb.dataset.nom || "Option");
      if (!isNaN(prixNum)) total += prixNum;
      else totalChiffrable = false;
    });

    if (optionsTexteEl) {
      optionsTexteEl.innerText = selectionnees.length
        ? selectionnees.join(", ")
        : "Aucune option sélectionnée.";
    }

    if (totalTexteEl) {
      totalTexteEl.innerText = selectionnees.length === 0
        ? "0 FCFA"
        : totalChiffrable
          ? formatPrix(total)
          : "Selon devis";
    }
  }

  detailsEl.addEventListener("change", mettreAJourResume);
}


// ─────────────────────────────────────────────
//  7. PANIER
// ─────────────────────────────────────────────
function ajouterPanier() {
  const service = JSON.parse(localStorage.getItem("serviceActif") || "null");
  if (!service) {
    showToast("Aucun service sélectionné.", "error");
    return;
  }

  const checkboxes = document.querySelectorAll(".option-checkbox");
  const optionsChoisies = [];
  let total = 0;
  let totalChiffrable = true;

  checkboxes.forEach(cb => {
    if (!cb.checked) return;
    const prix    = cb.dataset.prix || "";
    const prixNum = parsePrix(prix);
    optionsChoisies.push({ nom: cb.dataset.nom || "Option", prix });
    if (!isNaN(prixNum)) total += prixNum;
    else totalChiffrable = false;
  });

  if (optionsChoisies.length === 0) {
    showToast("Veuillez sélectionner au moins une option.", "info");
    return;
  }

  const panier = JSON.parse(localStorage.getItem("panier")) || [];

  panier.push({
    service: { key: service.key, nom: service.nom },
    optionsChoisies,
    totalEstime: totalChiffrable ? formatPrix(total) : "Selon devis",
    createdAt: new Date().toISOString(),
  });

  localStorage.setItem("panier", JSON.stringify(panier));
  showToast("🛒 Ajouté au panier !");
}

function getPanier() {
  return JSON.parse(localStorage.getItem("panier")) || [];
}

function viderPanier() {
  localStorage.removeItem("panier");
  showToast("Panier vidé.", "info");
}

function supprimerDuPanier(index) {
  const panier = getPanier();
  if (index < 0 || index >= panier.length) return;
  panier.splice(index, 1);
  localStorage.setItem("panier", JSON.stringify(panier));
}


// ─────────────────────────────────────────────
//  8. INIT GLOBAL
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initFormulaireDevis();
  initPageService();
});