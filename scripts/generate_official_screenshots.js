import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { execSync } from 'child_process';

const outputDir = path.resolve('./public/screenshots');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Load logo base64 if available
let logoBase64 = '';
const logoPath = path.resolve('./public/icono_tunutrilens_512x512.png');
if (fs.existsSync(logoPath)) {
  logoBase64 = fs.readFileSync(logoPath).toString('base64');
}

const WIDTH = 1080;
const HEIGHT = 1920;

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Common Top App Bar for TuNutriLens Edge-to-Edge UI
function renderTopBar(activeTabName, subTabName = '') {
  return `
    <!-- Edge-to-Edge App Header (No Status/Browser Bar, No Borders) -->
    <rect x="0" y="0" width="1080" height="150" fill="#064e3b"/>
    <g transform="translate(48, 38)">
      ${logoBase64 ? `<image href="data:image/png;base64,${logoBase64}" x="0" y="0" width="76" height="76"/>` : ''}
      <text x="${logoBase64 ? 96 : 0}" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#ffffff">TuNutriLens</text>
      <text x="${logoBase64 ? 96 : 0}" y="70" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="600" fill="#a7f3d0">Nutrición Visual Inteligente</text>
    </g>
    <rect x="800" y="52" width="232" height="48" rx="24" fill="#047857"/>
    <text x="916" y="83" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#ecfdf5" text-anchor="middle">${esc(activeTabName)}</text>
    ${subTabName ? `
      <rect x="0" y="150" width="1080" height="74" fill="#047857"/>
      <text x="48" y="196" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#ecfdf5">${esc(subTabName)}</text>
    ` : ''}
  `;
}

// Common Bottom Navigation Bar
function renderBottomNav(activeIdx = 0) {
  const tabs = [
    { label: 'Escáner', icon: '📷' },
    { label: 'Mi Nutrición', icon: '🥗' },
    { label: 'Descubrir', icon: '🔍' },
    { label: 'Mi Perfil', icon: '👤' },
  ];

  let tabsSvg = '';
  tabs.forEach((tab, i) => {
    const xCenter = 135 + i * 270;
    const isActive = i === activeIdx;
    tabsSvg += `
      <g transform="translate(${xCenter}, 1845)">
        <text x="0" y="0" font-size="36" text-anchor="middle">${tab.icon}</text>
        <text x="0" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="${isActive ? '900' : '600'}" fill="${isActive ? '#10b981' : '#94a3b8'}" text-anchor="middle">${esc(tab.label)}</text>
        ${isActive ? `<rect x="-35" y="44" width="70" height="4" rx="2" fill="#10b981"/>` : ''}
      </g>
    `;
  });

  return `
    <rect x="0" y="1790" width="1080" height="130" fill="#ffffff" filter="drop-shadow(0 -4px 12px rgba(0,0,0,0.06))"/>
    <line x1="0" y1="1790" x2="1080" y2="1790" stroke="#e2e8f0" stroke-width="2"/>
    ${tabsSvg}
  `;
}

const screens = [
  // 1. Escáner de Plato & Cámara IA
  {
    filename: 'TuNutriLens_1_EscanerComida.png',
    bg: '#f8fafc',
    render: () => `
      ${renderTopBar('Escáner IA', 'Visor de Cámara IA • Detección en 2 Segundos')}
      
      <!-- Subtabs selector -->
      <g transform="translate(48, 245)">
        <rect x="0" y="0" width="310" height="62" rx="31" fill="#047857"/>
        <text x="155" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">📷 Plato Comida</text>

        <rect x="330" y="0" width="310" height="62" rx="31" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <text x="485" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#475569" text-anchor="middle">🏷️ Supermercado</text>

        <rect x="660" y="0" width="324" height="62" rx="31" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <text x="822" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#475569" text-anchor="middle">❄️ Tu Nevera</text>
      </g>

      <!-- Monthly free plan quota pill -->
      <g transform="translate(48, 330)">
        <rect x="0" y="0" width="984" height="58" rx="20" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2"/>
        <text x="32" y="37" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#047857">✨ Fotos este mes: 4 de 5 restantes (Plan Gratuito disponible)</text>
      </g>

      <!-- Meal Moment Pills -->
      <g transform="translate(48, 410)">
        <text x="0" y="36" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#0f172a">Momento:</text>
        <rect x="120" y="0" width="180" height="50" rx="25" fill="#e2e8f0"/>
        <text x="210" y="33" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="bold" fill="#475569" text-anchor="middle">Desayuno</text>

        <rect x="320" y="0" width="180" height="50" rx="25" fill="#047857"/>
        <text x="410" y="33" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="bold" fill="#ffffff" text-anchor="middle">✓ Almuerzo</text>

        <rect x="520" y="0" width="180" height="50" rx="25" fill="#e2e8f0"/>
        <text x="610" y="33" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="bold" fill="#475569" text-anchor="middle">Cena</text>

        <rect x="720" y="0" width="180" height="50" rx="25" fill="#e2e8f0"/>
        <text x="810" y="33" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="bold" fill="#475569" text-anchor="middle">Snack</text>
      </g>

      <!-- Live AI Camera Viewfinder -->
      <g transform="translate(48, 480)">
        <rect x="0" y="0" width="984" height="540" rx="36" fill="#090d16"/>
        <!-- Reticle -->
        <rect x="30" y="30" width="924" height="480" rx="24" fill="none" stroke="#10b981" stroke-width="3" stroke-dasharray="16,16" opacity="0.6"/>
        <!-- Corners -->
        <path d="M 60 70 L 60 120 M 60 70 L 110 70" stroke="#34d399" stroke-width="8" stroke-linecap="round"/>
        <path d="M 924 70 L 924 120 M 924 70 L 874 70" stroke="#34d399" stroke-width="8" stroke-linecap="round"/>
        <path d="M 60 470 L 60 420 M 60 470 L 110 470" stroke="#34d399" stroke-width="8" stroke-linecap="round"/>
        <path d="M 924 470 L 924 420 M 924 470 L 874 470" stroke="#34d399" stroke-width="8" stroke-linecap="round"/>

        <!-- Realistic Dish Drawing -->
        <circle cx="492" cy="270" r="180" fill="#f8fafc" stroke="#e2e8f0" stroke-width="6"/>
        <ellipse cx="492" cy="270" rx="160" ry="160" fill="#f1f5f9"/>
        <!-- Salmon portion -->
        <path d="M 400 230 C 420 180, 520 180, 560 220 C 580 250, 540 310, 480 310 Z" fill="#fb923c"/>
        <path d="M 430 225 L 530 255 M 440 255 L 510 285" stroke="#ffffff" stroke-width="4" opacity="0.7"/>
        <!-- Avocado slices -->
        <path d="M 520 280 C 570 270, 600 310, 580 350 C 540 360, 500 320, 520 280 Z" fill="#84cc16"/>
        <circle cx="400" cy="310" r="38" fill="#ca8a04"/>
        <circle cx="370" cy="270" r="28" fill="#15803d"/>
        <circle cx="560" cy="210" r="26" fill="#16a34a"/>
        <circle cx="490" cy="180" r="22" fill="#e11d48"/>

        <!-- Live Detection Pill -->
        <rect x="232" y="48" width="520" height="54" rx="27" fill="#047857" opacity="0.95"/>
        <circle cx="264" cy="75" r="10" fill="#34d399"/>
        <text x="502" y="82" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">Detectado: Bowl Salmón &amp; Quinoa</text>

        <!-- Grams Tag -->
        <rect x="60" y="440" width="260" height="46" rx="23" fill="#000000" opacity="0.8"/>
        <text x="190" y="471" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#34d399" text-anchor="middle">⚖️ Peso IA: 340 gramos</text>
      </g>

      <!-- Instant Results Card -->
      <g transform="translate(48, 1050)">
        <rect x="0" y="0" width="984" height="690" rx="32" fill="#ffffff" filter="drop-shadow(0 8px 24px rgba(0,0,0,0.06))"/>
        
        <text x="44" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="bold" fill="#0f172a">Bowl Mediterráneo de Salmón</text>
        <text x="44" y="96" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="#64748b">Salmón noruego, quinoa real, aguacate hass y semillas</text>

        <!-- Badges -->
        <rect x="44" y="120" width="160" height="44" rx="22" fill="#dcfce7"/>
        <text x="124" y="149" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#15803d" text-anchor="middle">NutriScore A</text>

        <rect x="220" y="120" width="160" height="44" rx="22" fill="#ecfdf5"/>
        <text x="300" y="149" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#047857" text-anchor="middle">NOVA 1 (Real)</text>

        <rect x="396" y="120" width="180" height="44" rx="22" fill="#fef3c7"/>
        <text x="486" y="149" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#b45309" text-anchor="middle">Mediterráneo</text>

        <!-- Calories Box -->
        <rect x="690" y="44" width="250" height="120" rx="24" fill="#f0fdf4" stroke="#86efac" stroke-width="2"/>
        <text x="815" y="102" font-family="system-ui, -apple-system, sans-serif" font-size="48" font-weight="black" fill="#047857" text-anchor="middle">524</text>
        <text x="815" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#15803d" text-anchor="middle">KILOCALORÍAS</text>

        <line x1="44" y1="190" x2="940" y2="190" stroke="#f1f5f9" stroke-width="2"/>

        <!-- 4 Macros -->
        <rect x="44" y="215" width="210" height="116" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <text x="149" y="255" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#64748b" text-anchor="middle">PROTEÍNA</text>
        <text x="149" y="302" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="bold" fill="#0284c7" text-anchor="middle">38g</text>

        <rect x="274" y="215" width="210" height="116" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <text x="379" y="255" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#64748b" text-anchor="middle">CARBOHIDR.</text>
        <text x="379" y="302" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="bold" fill="#ea580c" text-anchor="middle">45g</text>

        <rect x="504" y="215" width="210" height="116" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <text x="609" y="255" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#64748b" text-anchor="middle">GRASAS SAL.</text>
        <text x="609" y="302" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="bold" fill="#16a34a" text-anchor="middle">19g</text>

        <rect x="734" y="215" width="206" height="116" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <text x="837" y="255" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#64748b" text-anchor="middle">FIBRA PURA</text>
        <text x="837" y="302" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="bold" fill="#9333ea" text-anchor="middle">8.4g</text>

        <!-- Gala Tip -->
        <rect x="44" y="355" width="896" height="88" rx="20" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2"/>
        <text x="75" y="392" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#047857">💡 Consejo Gala (Nutricionista IA):</text>
        <text x="75" y="423" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#065f46">Excelente densidad de Omega-3 marino y fibra prebiótica para tu microbiota.</text>

        <!-- Save Button -->
        <rect x="44" y="475" width="896" height="76" rx="24" fill="#047857"/>
        <text x="492" y="522" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">✓ Guardar en Diario Nutricional</text>
      </g>

      ${renderBottomNav(0)}
    `
  },

  // 2. Escáner de Supermercado & NutriScore / NOVA
  {
    filename: 'TuNutriLens_2_Supermercado.png',
    bg: '#f8fafc',
    render: () => `
      ${renderTopBar('Supermercado', 'Análisis Instantáneo • Código de Barras & Etiquetas')}
      
      <!-- Subtabs selector -->
      <g transform="translate(48, 245)">
        <rect x="0" y="0" width="310" height="62" rx="31" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <text x="155" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#475569" text-anchor="middle">📷 Plato Comida</text>

        <rect x="330" y="0" width="310" height="62" rx="31" fill="#0f766e"/>
        <text x="485" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle">🏷️ Supermercado</text>

        <rect x="660" y="0" width="324" height="62" rx="31" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <text x="822" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#475569" text-anchor="middle">❄️ Tu Nevera</text>
      </g>

      <!-- Barcode simulation top -->
      <g transform="translate(48, 330)">
        <rect x="0" y="0" width="984" height="280" rx="32" fill="#0f172a"/>
        <!-- Red Laser Scan line -->
        <line x1="40" y1="140" x2="944" y2="140" stroke="#ef4444" stroke-width="5"/>
        <!-- Barcode bars -->
        <g transform="translate(240, 60)" fill="#ffffff">
          <rect x="0" y="0" width="12" height="130"/>
          <rect x="25" y="0" width="7" height="130"/>
          <rect x="45" y="0" width="18" height="130"/>
          <rect x="75" y="0" width="10" height="130"/>
          <rect x="100" y="0" width="16" height="130"/>
          <rect x="130" y="0" width="9" height="130"/>
          <rect x="155" y="0" width="22" height="130"/>
          <rect x="190" y="0" width="7" height="130"/>
          <rect x="210" y="0" width="14" height="130"/>
          <rect x="240" y="0" width="24" height="130"/>
          <rect x="280" y="0" width="10" height="130"/>
          <rect x="305" y="0" width="18" height="130"/>
          <rect x="335" y="0" width="8" height="130"/>
          <rect x="360" y="0" width="22" height="130"/>
          <rect x="395" y="0" width="12" height="130"/>
          <rect x="420" y="0" width="20" height="130"/>
          <rect x="455" y="0" width="10" height="130"/>
          <rect x="480" y="0" width="16" height="130"/>
        </g>
        <text x="492" y="240" font-family="monospace" font-size="24" font-weight="bold" fill="#38bdf8" text-anchor="middle">EAN-13: 8480000123456 • Hacendado</text>
      </g>

      <!-- Full Product Audit Card -->
      <g transform="translate(48, 640)">
        <rect x="0" y="0" width="984" height="1100" rx="32" fill="#ffffff" filter="drop-shadow(0 8px 24px rgba(0,0,0,0.06))"/>
        
        <rect x="44" y="40" width="240" height="42" rx="21" fill="#dcfce7"/>
        <text x="164" y="68" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="bold" fill="#15803d" text-anchor="middle">✓ Alimento Recomendado</text>

        <text x="44" y="130" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="bold" fill="#0f172a">Yogur Griego 0% Natural</text>
        <text x="44" y="170" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="#64748b">Hacendado • Sin azúcares añadidos ni edulcorantes</text>

        <!-- Nutriscore 5 bars -->
        <g transform="translate(44, 210)">
          <!-- A -->
          <rect x="0" y="0" width="85" height="85" rx="18" fill="#047857"/>
          <text x="42" y="58" font-family="system-ui, -apple-system, sans-serif" font-size="46" font-weight="900" fill="#ffffff" text-anchor="middle">A</text>
          <!-- B -->
          <rect x="95" y="12" width="65" height="73" rx="14" fill="#86efac" opacity="0.4"/>
          <text x="127" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="bold" fill="#166534" text-anchor="middle">B</text>
          <!-- C -->
          <rect x="170" y="12" width="65" height="73" rx="14" fill="#fde047" opacity="0.4"/>
          <text x="202" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="bold" fill="#854d0e" text-anchor="middle">C</text>
          <!-- D -->
          <rect x="245" y="12" width="65" height="73" rx="14" fill="#fdba74" opacity="0.4"/>
          <text x="277" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="bold" fill="#9a3412" text-anchor="middle">D</text>
          <!-- E -->
          <rect x="320" y="12" width="65" height="73" rx="14" fill="#fca5a5" opacity="0.4"/>
          <text x="352" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="bold" fill="#991b1b" text-anchor="middle">E</text>
        </g>

        <!-- NOVA 1 Tag -->
        <rect x="450" y="210" width="280" height="85" rx="20" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2"/>
        <text x="590" y="246" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#065f46" text-anchor="middle">CLASIFICACIÓN NOVA</text>
        <text x="590" y="278" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="900" fill="#047857" text-anchor="middle">GRUPO 1: NO PROCESADO</text>

        <!-- Calories 100g -->
        <rect x="750" y="210" width="190" height="85" rx="20" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
        <text x="845" y="246" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#64748b" text-anchor="middle">POR 100g</text>
        <text x="845" y="278" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#0f172a" text-anchor="middle">59 kcal</text>

        <!-- Traffic light box -->
        <g transform="translate(44, 330)">
          <rect x="0" y="0" width="896" height="190" rx="24" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
          <text x="36" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#334155">SEMÁFORO NUTRICIONAL (AESAN / OMS):</text>
          
          <circle cx="56" cy="98" r="18" fill="#22c55e"/>
          <text x="96" y="105" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#0f172a">Azúcares: 3.2g</text>
          <text x="96" y="132" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#15803d">Naturales de la leche (Óptimo)</text>

          <circle cx="360" cy="98" r="18" fill="#22c55e"/>
          <text x="400" y="105" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#0f172a">Grasas Sat: 0.1g</text>
          <text x="400" y="132" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#15803d">Bajo en saturadas</text>

          <circle cx="670" cy="98" r="18" fill="#22c55e"/>
          <text x="710" y="105" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#0f172a">Proteína: 10.3g</text>
          <text x="710" y="132" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#15803d">Alta biodisponibilidad</text>
        </g>

        <!-- Clean Additives Tag -->
        <g transform="translate(44, 550)">
          <rect x="0" y="0" width="896" height="96" rx="20" fill="#f0fdf4" stroke="#86efac" stroke-width="2"/>
          <text x="36" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="21" font-weight="bold" fill="#15803d">✓ 0 Aditivos sospechosos ni edulcorantes artificiales</text>
          <text x="36" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#166534">Ingredientes: Leche pasteurizada desnatada y fermentos lácticos vivos.</text>
        </g>

        <!-- Add to Cart Button -->
        <rect x="44" y="680" width="896" height="76" rx="24" fill="#0f766e"/>
        <text x="492" y="728" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">+ Añadir a Mi Lista de la Compra Saludable</text>
      </g>

      ${renderBottomNav(0)}
    `
  },

  // 3. Diario Nutricional & Resumen Diario
  {
    filename: 'TuNutriLens_3_DiarioNutricional.png',
    bg: '#f8fafc',
    render: () => `
      ${renderTopBar('Mi Nutrición', 'Diario Nutricional • Resumen de Hoy')}

      <!-- Date banner -->
      <g transform="translate(48, 245)">
        <rect x="0" y="0" width="984" height="66" rx="22" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
        <text x="492" y="43" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="bold" fill="#0f172a" text-anchor="middle">&lt; Hoy • Domingo, 20 de Septiembre &gt;</text>
      </g>

      <!-- Streak Card -->
      <g transform="translate(48, 330)">
        <rect x="0" y="0" width="984" height="90" rx="24" fill="#fff7ed" stroke="#fdba74" stroke-width="2"/>
        <text x="40" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#c2410c">🔥 Racha de Compromiso Saludable: 1 día consecutivo activo</text>
        <text x="40" y="72" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#9a3412">Hábito Inicial (1-3 días) • Te faltan 13 días para el gran hito de 14 días</text>
      </g>

      <!-- Calorie Ring Card -->
      <g transform="translate(48, 445)">
        <rect x="0" y="0" width="984" height="460" rx="32" fill="#ffffff" filter="drop-shadow(0 8px 24px rgba(0,0,0,0.06))"/>
        
        <!-- Circular Gauge -->
        <circle cx="260" cy="230" r="140" fill="none" stroke="#f1f5f9" stroke-width="30"/>
        <circle cx="260" cy="230" r="140" fill="none" stroke="#0284c7" stroke-width="30" stroke-dasharray="879" stroke-dashoffset="260" stroke-linecap="round"/>

        <text x="260" y="200" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#64748b" text-anchor="middle">CONSUMIDAS</text>
        <text x="260" y="255" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="900" fill="#0f172a" text-anchor="middle">1.460</text>
        <text x="260" y="295" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#0284c7" font-weight="bold" text-anchor="middle">de 2.100 kcal</text>

        <!-- Remaining -->
        <rect x="490" y="60" width="450" height="100" rx="20" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
        <text x="525" y="100" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#15803d">CALORÍAS RESTANTES</text>
        <text x="525" y="142" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="900" fill="#166534">640 kcal</text>

        <!-- Water -->
        <rect x="490" y="180" width="450" height="100" rx="20" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
        <text x="525" y="220" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#1d4ed8">AGUA Y LÍQUIDOS</text>
        <text x="525" y="262" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="900" fill="#1e40af">1.85 L / 2.20 L (84%)</text>

        <!-- Macros Bars -->
        <g transform="translate(490, 300)">
          <text x="0" y="25" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#0369a1">Proteína: 112g / 130g (86%)</text>
          <rect x="0" y="38" width="450" height="10" rx="5" fill="#e2e8f0"/>
          <rect x="0" y="38" width="387" height="10" rx="5" fill="#0284c7"/>

          <text x="0" y="75" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#ea580c">Carbohidratos: 145g / 190g (76%)</text>
          <rect x="0" y="88" width="450" height="10" rx="5" fill="#e2e8f0"/>
          <rect x="0" y="88" width="342" height="10" rx="5" fill="#f97316"/>

          <text x="0" y="125" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#16a34a">Grasas Saludables: 52g / 65g (80%)</text>
          <rect x="0" y="138" width="450" height="10" rx="5" fill="#e2e8f0"/>
          <rect x="0" y="138" width="360" height="10" rx="5" fill="#16a34a"/>
        </g>
      </g>

      <!-- Meals Logged List -->
      <g transform="translate(48, 930)">
        <text x="0" y="36" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="bold" fill="#0f172a">Comidas Registradas Hoy</text>

        <!-- Meal 1 -->
        <rect x="0" y="55" width="984" height="125" rx="24" fill="#ffffff" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.04))"/>
        <circle cx="70" cy="117" r="38" fill="#ffedd5"/>
        <text x="70" y="129" font-size="34" text-anchor="middle">🥑</text>
        <text x="135" y="103" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="bold" fill="#0f172a">Desayuno: Tostada con tomate y AOVE</text>
        <text x="135" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#64748b">280 kcal • 7g Prot • 35g Carbos • 12g Grasas</text>
        <text x="940" y="123" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#047857" text-anchor="end">NutriScore A</text>

        <!-- Meal 2 -->
        <rect x="0" y="200" width="984" height="125" rx="24" fill="#ffffff" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.04))"/>
        <circle cx="70" cy="262" r="38" fill="#dbeafe"/>
        <text x="70" y="274" font-size="34" text-anchor="middle">🥗</text>
        <text x="135" y="248" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="bold" fill="#0f172a">Almuerzo: Bowl de salmón salvaje y quinoa</text>
        <text x="135" y="285" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#64748b">524 kcal • 38g Prot • 45g Carbos • 19g Grasas</text>
        <text x="940" y="268" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#047857" text-anchor="end">NutriScore A</text>

        <!-- Meal 3 -->
        <rect x="0" y="345" width="984" height="125" rx="24" fill="#ffffff" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.04))"/>
        <circle cx="70" cy="407" r="38" fill="#fef3c7"/>
        <text x="70" y="419" font-size="34" text-anchor="middle">🫐</text>
        <text x="135" y="393" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="bold" fill="#0f172a">Merienda: Yogur griego 0% con arándanos</text>
        <text x="135" y="430" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#64748b">215 kcal • 16g Prot • 14g Carbos • 10g Grasas</text>
        <text x="940" y="413" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#047857" text-anchor="end">NutriScore A</text>

        <!-- Add meal button -->
        <rect x="0" y="495" width="984" height="74" rx="24" fill="#0284c7"/>
        <text x="492" y="542" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">+ Registrar Nueva Comida o Foto</text>
      </g>

      ${renderBottomNav(1)}
    `
  },

  // 4. Plan Nutricional Semanal 100% Personalizable
  {
    filename: 'TuNutriLens_4_PlanSemanal.png',
    bg: '#f8fafc',
    render: () => `
      ${renderTopBar('Mi Nutrición', 'Plan Nutricional Semanal • 100% Personalizable')}

      <!-- Targets Summary Card -->
      <g transform="translate(48, 245)">
        <rect x="0" y="0" width="984" height="280" rx="32" fill="#ffffff" filter="drop-shadow(0 8px 24px rgba(0,0,0,0.06))"/>
        
        <text x="40" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#0f172a">Tus Metas Nutricionales Activas (Calibrado a tu Medida)</text>
        <text x="40" y="82" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#64748b">Configura tus platos para cada día o autogenéralos con Inteligencia Artificial</text>

        <rect x="40" y="115" width="210" height="130" rx="20" fill="#f0fdf4" stroke="#86efac" stroke-width="2"/>
        <text x="145" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#15803d" text-anchor="middle">CALORÍAS</text>
        <text x="145" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#166534" text-anchor="middle">1.196</text>
        <text x="145" y="225" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#15803d" text-anchor="middle">de 1.800 kcal</text>

        <rect x="270" y="115" width="210" height="130" rx="20" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
        <text x="375" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#1d4ed8" text-anchor="middle">PROTEÍNA META</text>
        <text x="375" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#1e40af" text-anchor="middle">92g</text>
        <text x="375" y="225" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#1d4ed8" text-anchor="middle">de 120g (77%)</text>

        <rect x="500" y="115" width="210" height="130" rx="20" fill="#fff7ed" stroke="#fed7aa" stroke-width="2"/>
        <text x="605" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#ea580c" text-anchor="middle">CARBOHIDRATOS</text>
        <text x="605" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#9a3412" text-anchor="middle">93g</text>
        <text x="605" y="225" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#ea580c" text-anchor="middle">de 180g (52%)</text>

        <rect x="730" y="115" width="214" height="130" rx="20" fill="#fefce8" stroke="#fef08a" stroke-width="2"/>
        <text x="837" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#ca8a04" text-anchor="middle">GRASAS META</text>
        <text x="837" y="195" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#854d0e" text-anchor="middle">48g</text>
        <text x="837" y="225" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#ca8a04" text-anchor="middle">de 55g (87%)</text>
      </g>

      <!-- Day Selector Pills -->
      <g transform="translate(48, 550)">
        <rect x="0" y="0" width="125" height="74" rx="20" fill="#4f46e5"/>
        <text x="62" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#c7d2fe" text-anchor="middle">LUN</text>
        <text x="62" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="900" fill="#ffffff" text-anchor="middle">21 ✓</text>

        <rect x="143" y="0" width="125" height="74" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="205" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#64748b" text-anchor="middle">MAR</text>
        <text x="205" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">22</text>

        <rect x="286" y="0" width="125" height="74" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="348" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#64748b" text-anchor="middle">MIÉ</text>
        <text x="348" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">23</text>

        <rect x="429" y="0" width="125" height="74" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="491" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#64748b" text-anchor="middle">JUE</text>
        <text x="491" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">24</text>

        <rect x="572" y="0" width="125" height="74" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="634" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#64748b" text-anchor="middle">VIE</text>
        <text x="634" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">25</text>

        <rect x="715" y="0" width="125" height="74" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="777" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#64748b" text-anchor="middle">SÁB</text>
        <text x="777" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">26</text>

        <rect x="858" y="0" width="126" height="74" rx="20" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="921" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#64748b" text-anchor="middle">DOM</text>
        <text x="921" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#0f172a" text-anchor="middle">27</text>
      </g>

      <!-- Day Menu Plan -->
      <g transform="translate(48, 650)">
        <rect x="0" y="0" width="984" height="630" rx="32" fill="#ffffff" filter="drop-shadow(0 8px 24px rgba(0,0,0,0.06))"/>
        
        <text x="40" y="55" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#0f172a">Menú del Lunes (100% Comida Real Mediterránea)</text>
        <text x="40" y="88" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#64748b">Total día: 2.050 kcal • P: 125g • C: 180g • G: 62g • Fibra: 34g</text>

        <!-- Slot 1 -->
        <rect x="40" y="115" width="904" height="95" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <text x="70" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#4f46e5">DESAYUNO (390 kcal)</text>
        <text x="70" y="186" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#1e293b">Porridge de avena integral con semillas de chía, plátano y nueces</text>

        <!-- Slot 2 -->
        <rect x="40" y="230" width="904" height="95" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <text x="70" y="267" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#15803d">ALMUERZO PRINCIPAL (620 kcal)</text>
        <text x="70" y="301" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#1e293b">Lentejas pardinas estofadas con verduras de temporada y arroz integral</text>

        <!-- Slot 3 -->
        <rect x="40" y="345" width="904" height="95" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <text x="70" y="382" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#b45309">MERIENDA (220 kcal)</text>
        <text x="70" y="416" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#1e293b">Manzana asada con canela de Ceilán y queso fresco batido 0%</text>

        <!-- Slot 4 -->
        <rect x="40" y="460" width="904" height="95" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
        <text x="70" y="497" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#0284c7">CENA LIGERA (480 kcal)</text>
        <text x="70" y="531" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#1e293b">Merluza al horno con espárragos trigueros y patata panadera</text>

        <rect x="40" y="575" width="904" height="38" fill="none"/>
      </g>

      <!-- AI Generation CTA -->
      <g transform="translate(48, 1310)">
        <rect x="0" y="0" width="984" height="90" rx="24" fill="#4f46e5"/>
        <text x="492" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">✨ Autogenerar Menús Semanales con IA</text>
      </g>

      ${renderBottomNav(1)}
    `
  },

  // 5. Nutrición por Etapas de la Vida ESPEN / ASPEN
  {
    filename: 'TuNutriLens_5_EtapasVida.png',
    bg: '#f8fafc',
    render: () => `
      ${renderTopBar('Descubrir', 'Nutrición por Etapas de la Vida • Guías Clínicas')}

      <!-- Main Scientific Header -->
      <g transform="translate(48, 245)">
        <rect x="0" y="0" width="984" height="150" rx="28" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <rect x="40" y="30" width="280" height="36" rx="18" fill="#fef3c7"/>
        <text x="180" y="55" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#92400e" text-anchor="middle">🛡️ GUÍAS ESPEN / ASPEN</text>

        <text x="40" y="105" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" fill="#0f172a">Nutrición por Etapas de la Vida</text>
        <text x="40" y="132" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#64748b">Recomendaciones actualizadas de macro y micronutrientes para cada etapa vital</text>
      </g>

      <!-- Life Stage Cards Grid -->
      <g transform="translate(48, 420)">
        <!-- Card 1 (Embarazo y Lactancia - Selected) -->
        <rect x="0" y="0" width="984" height="145" rx="24" fill="#fef3c7" stroke="#f59e0b" stroke-width="3"/>
        <text x="40" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#92400e">🤰 Embarazo y Lactancia Materna (Gestación &amp; Postparto)</text>
        <text x="40" y="85" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#78350f">Requerimientos críticos: Ácido fólico (600 µg), Hierro hemo (27 mg), Omega-3 DHA (200 mg) y Calcio.</text>
        <text x="40" y="118" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#b45309">Protocolo FESNAD: Control de listeria, toxoplasmosis y mercurio en pescados grandes.</text>

        <!-- Card 2 (Perimenopausia y Menopausia) -->
        <rect x="0" y="165" width="984" height="145" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="40" y="215" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#0f172a">🌸 Perimenopausia y Menopausia (45 - 65+ Años)</text>
        <text x="40" y="250" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#475569">Preservación ósea y muscular: Calcio (1.200 mg), Vitamina D3, Fitoestrógenos naturales y proteína 1.2g/kg.</text>
        <text x="40" y="283" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#047857">Guía ESPEN: Prevención de osteoporosis y control de redistribución visceral de grasa.</text>

        <!-- Card 3 (Deportistas y Alto Rendimiento) -->
        <rect x="0" y="330" width="984" height="145" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="40" y="380" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#0f172a">⚡ Deportistas y Alto Rendimiento (ESPEN / ISSN)</text>
        <text x="40" y="415" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#475569">Optimización del rendimiento: Proteína 1.6 - 2.2 g/kg, recarga glucogénica y balance hidroelectrolítico.</text>
        <text x="40" y="448" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#0284c7">Consenso ISSN: Timing de ingesta peri-entreno y leucina para síntesis proteica.</text>

        <!-- Card 4 (Adultos Mayores 65+) -->
        <rect x="0" y="495" width="984" height="145" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="40" y="545" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#0f172a">👴 Adultos Mayores (65+ Años) ESPEN / ASPEN</text>
        <text x="40" y="580" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#475569">Prevención de sarcopenia: Proteína 1.2 - 1.5 g/kg, Vitamina B12 reforzada, hidratación y fibra prebiótica.</text>
        <text x="40" y="613" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#ca8a04">Criterios GLIM: Mantenimiento de masa muscular, densidad mineral y energía celular.</text>

        <!-- Card 5 (Infancia y Crecimiento) -->
        <rect x="0" y="660" width="984" height="145" rx="24" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        <text x="40" y="710" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#0f172a">👶 Infancia y Crecimiento (2 - 12 Años) ESPGHAN</text>
        <text x="40" y="745" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#475569">Desarrollo cognitivo y educación del paladar: Libre de ultraprocesados infantiles y azúcares añadidos.</text>
        <text x="40" y="778" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#15803d">Consenso ESPGHAN: Grasas esenciales para mielinización cerebral y crecimiento armónico.</text>
      </g>

      <!-- Action button -->
      <g transform="translate(48, 1260)">
        <rect x="0" y="0" width="984" height="90" rx="24" fill="#b45309"/>
        <text x="492" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">✓ Configurar Mi Etapa Biológica Activa</text>
      </g>

      ${renderBottomNav(2)}
    `
  },

  // 6. Nevera Residuo Cero & Recetas IA
  {
    filename: 'TuNutriLens_6_NeveraResiduoCero.png',
    bg: '#f8fafc',
    render: () => `
      ${renderTopBar('Escáner IA', 'Nevera Residuo Cero con Visión IA')}

      <!-- Hero Sustainability Banner -->
      <g transform="translate(48, 245)">
        <rect x="0" y="0" width="984" height="150" rx="28" fill="#15803d"/>
        <rect x="40" y="25" width="380" height="36" rx="18" fill="#166534"/>
        <text x="230" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#bbf7d0" text-anchor="middle">🌱 AHORRA HASTA 80 €/MES EN COMIDA</text>

        <text x="40" y="100" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" fill="#ffffff">Nevera Residuo Cero con Visión IA</text>
        <text x="40" y="130" font-family="system-ui, -apple-system, sans-serif" font-size="19" fill="#dcfce7">Fotografía tu nevera y la IA crea platos mediterráneos con lo que ya tienes</text>
      </g>

      <!-- Detected Ingredients from Fridge -->
      <g transform="translate(48, 420)">
        <rect x="0" y="0" width="984" height="260" rx="28" fill="#0f172a"/>
        <text x="40" y="50" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#4ade80">✨ 5 Ingredientes detectados en tu foto:</text>

        <!-- Chips -->
        <rect x="40" y="80" width="280" height="52" rx="26" fill="#15803d"/>
        <text x="180" y="113" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">✓ 3 Huevos camperos</text>

        <rect x="340" y="80" width="260" height="52" rx="26" fill="#15803d"/>
        <text x="470" y="113" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">✓ 2 Calabacines</text>

        <rect x="620" y="80" width="310" height="52" rx="26" fill="#15803d"/>
        <text x="775" y="113" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">✓ Tomates maduros</text>

        <rect x="120" y="150" width="300" height="52" rx="26" fill="#15803d"/>
        <text x="270" y="183" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">✓ Cebolla dulce fresca</text>

        <rect x="440" y="150" width="380" height="52" rx="26" fill="#15803d"/>
        <text x="630" y="183" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">✓ Aceite Oliva Virgen Extra</text>

        <text x="492" y="235" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#94a3b8" text-anchor="middle">Evitas tirar 450 gramos de alimentos frescos a la basura hoy</text>
      </g>

      <!-- Generated Recipe Card -->
      <g transform="translate(48, 705)">
        <rect x="0" y="0" width="984" height="540" rx="32" fill="#ffffff" filter="drop-shadow(0 8px 24px rgba(0,0,0,0.06))"/>

        <rect x="40" y="40" width="260" height="42" rx="21" fill="#dcfce7"/>
        <text x="170" y="68" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="bold" fill="#15803d" text-anchor="middle">Receta Generada por IA</text>

        <text x="40" y="130" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="bold" fill="#0f172a">Shakshuka de Calabacín y Huevo</text>
        <text x="40" y="168" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#64748b">Tiempo: 15 min • Dificultad: Muy fácil • 0 desperdicio</text>

        <!-- Stats Row -->
        <rect x="40" y="200" width="210" height="95" rx="20" fill="#f0fdf4"/>
        <text x="145" y="238" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#15803d" text-anchor="middle">CALORÍAS</text>
        <text x="145" y="278" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" fill="#166534" text-anchor="middle">385 kcal</text>

        <rect x="270" y="200" width="210" height="95" rx="20" fill="#eff6ff"/>
        <text x="375" y="238" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#1d4ed8" text-anchor="middle">PROTEÍNA</text>
        <text x="375" y="278" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" fill="#1e40af" text-anchor="middle">24g</text>

        <rect x="500" y="200" width="210" height="95" rx="20" fill="#fefce8"/>
        <text x="605" y="238" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#854d0e" text-anchor="middle">FIBRA PURA</text>
        <text x="605" y="278" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" fill="#713f12" text-anchor="middle">6.8g</text>

        <rect x="730" y="200" width="214" height="95" rx="20" fill="#ecfdf5"/>
        <text x="837" y="238" font-family="system-ui, -apple-system, sans-serif" font-size="17" font-weight="bold" fill="#047857" text-anchor="middle">NUTRISCORE</text>
        <text x="837" y="278" font-family="system-ui, -apple-system, sans-serif" font-size="32" font-weight="900" fill="#065f46" text-anchor="middle">GRADO A</text>

        <!-- Preparation Steps -->
        <g transform="translate(40, 320)">
          <rect x="0" y="0" width="904" height="190" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
          <text x="30" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="bold" fill="#0f172a">Paso 1: <tspan font-weight="normal" fill="#334155">Pica la cebolla y los calabacines en dados. Pocha 5 min en sartén con el AOVE.</tspan></text>
          <text x="30" y="88" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="bold" fill="#0f172a">Paso 2: <tspan font-weight="normal" fill="#334155">Añade el tomate maduro rallado y cocina a fuego medio hasta reducir.</tspan></text>
          <text x="30" y="132" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="bold" fill="#0f172a">Paso 3: <tspan font-weight="normal" fill="#334155">Haz huecos en la salsa, casca los huevos camperos, tapa y cuaja 3 minutos.</tspan></text>
          <text x="30" y="168" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#15803d">🌱 Impacto: 100% de ingredientes aprovechados sin tirar nada.</text>
        </g>
      </g>

      <!-- Action Button -->
      <g transform="translate(48, 1270)">
        <rect x="0" y="0" width="984" height="85" rx="24" fill="#15803d"/>
        <text x="492" y="53" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">🍳 Cocinar con Modo Manos Libres</text>
      </g>

      ${renderBottomNav(0)}
    `
  },

  // 7. Evolución Corporal & Progreso de Peso
  {
    filename: 'TuNutriLens_7_ProgresoPeso.png',
    bg: '#f8fafc',
    render: () => `
      ${renderTopBar('Mi Nutrición', 'Evolución Corporal • Progreso de Peso')}

      <!-- Metric Highlights Row -->
      <g transform="translate(48, 245)">
        <rect x="0" y="0" width="310" height="210" rx="26" fill="#ffffff" stroke="#86efac" stroke-width="2" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.04))"/>
        <text x="155" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#15803d" text-anchor="middle">PESO ACTUAL</text>
        <text x="155" y="112" font-family="system-ui, -apple-system, sans-serif" font-size="46" font-weight="900" fill="#166534" text-anchor="middle">75.0 kg</text>
        <text x="155" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#047857" text-anchor="middle">-4.2 kg (Saludable)</text>
        <text x="155" y="185" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">Última actualización</text>

        <rect x="335" y="0" width="310" height="210" rx="26" fill="#ffffff" stroke="#bfdbfe" stroke-width="2" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.04))"/>
        <text x="490" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#1d4ed8" text-anchor="middle">PESO OBJETIVO</text>
        <text x="490" y="112" font-family="system-ui, -apple-system, sans-serif" font-size="46" font-weight="900" fill="#1e40af" text-anchor="middle">68.0 kg</text>
        <text x="490" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#2563eb" text-anchor="middle">Meta Saludable</text>
        <text x="490" y="185" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">Sin efecto rebote</text>

        <rect x="670" y="0" width="314" height="210" rx="26" fill="#ffffff" stroke="#fde047" stroke-width="2" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.04))"/>
        <text x="827" y="48" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#854d0e" text-anchor="middle">FALTANTE</text>
        <text x="827" y="112" font-family="system-ui, -apple-system, sans-serif" font-size="46" font-weight="900" fill="#713f12" text-anchor="middle">7.0 kg</text>
        <text x="827" y="152" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="#ca8a04" text-anchor="middle">Ritmo Sostenible</text>
        <text x="827" y="185" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#64748b" text-anchor="middle">0.5 kg / semana</text>
      </g>

      <!-- Weight Evolution Chart -->
      <g transform="translate(48, 485)">
        <rect x="0" y="0" width="984" height="580" rx="32" fill="#ffffff" filter="drop-shadow(0 8px 24px rgba(0,0,0,0.06))"/>
        
        <text x="40" y="55" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#0f172a">Curva de Pérdida de Grasa Sostenible</text>
        <text x="40" y="90" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#64748b">Preservando el 100% de tu masa muscular mediante ingesta proteica adecuada</text>

        <!-- Grid lines -->
        <line x1="80" y1="140" x2="920" y2="140" stroke="#f1f5f9" stroke-width="2"/>
        <text x="60" y="146" font-size="18" fill="#94a3b8" text-anchor="end">80kg</text>

        <line x1="80" y1="220" x2="920" y2="220" stroke="#f1f5f9" stroke-width="2"/>
        <text x="60" y="226" font-size="18" fill="#94a3b8" text-anchor="end">78kg</text>

        <line x1="80" y1="300" x2="920" y2="300" stroke="#f1f5f9" stroke-width="2"/>
        <text x="60" y="306" font-size="18" fill="#94a3b8" text-anchor="end">76kg</text>

        <line x1="80" y1="380" x2="920" y2="380" stroke="#f1f5f9" stroke-width="2"/>
        <text x="60" y="386" font-size="18" fill="#94a3b8" text-anchor="end">74kg</text>

        <line x1="80" y1="460" x2="920" y2="460" stroke="#f1f5f9" stroke-width="2"/>
        <text x="60" y="466" font-size="18" fill="#94a3b8" text-anchor="end">72kg</text>

        <!-- Area under curve -->
        <path d="M 120 170 L 260 210 L 420 260 L 580 300 L 740 340 L 880 380 L 880 480 L 120 480 Z" fill="#cffafe" opacity="0.4"/>

        <!-- Smooth Curve -->
        <path d="M 120 170 Q 260 210 420 260 T 740 340 T 880 380" fill="none" stroke="#0891b2" stroke-width="6" stroke-linecap="round"/>

        <!-- Points -->
        <circle cx="120" cy="170" r="10" fill="#0891b2" stroke="#ffffff" stroke-width="4"/>
        <circle cx="260" cy="210" r="10" fill="#0891b2" stroke="#ffffff" stroke-width="4"/>
        <circle cx="420" cy="260" r="10" fill="#0891b2" stroke="#ffffff" stroke-width="4"/>
        <circle cx="580" cy="300" r="10" fill="#0891b2" stroke="#ffffff" stroke-width="4"/>
        <circle cx="740" cy="340" r="10" fill="#0891b2" stroke="#ffffff" stroke-width="4"/>
        <circle cx="880" cy="380" r="14" fill="#047857" stroke="#ffffff" stroke-width="5"/>

        <!-- Current point tooltip -->
        <rect x="760" y="290" width="190" height="60" rx="16" fill="#047857"/>
        <text x="855" y="328" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle">Hoy: 75.0 kg ✓</text>

        <!-- Months labels -->
        <text x="120" y="520" font-size="18" fill="#64748b" text-anchor="middle">Inicio (79.2)</text>
        <text x="260" y="520" font-size="18" fill="#64748b" text-anchor="middle">Sem 2</text>
        <text x="420" y="520" font-size="18" fill="#64748b" text-anchor="middle">Sem 4</text>
        <text x="580" y="520" font-size="18" fill="#64748b" text-anchor="middle">Sem 6</text>
        <text x="740" y="520" font-size="18" fill="#64748b" text-anchor="middle">Sem 8</text>
        <text x="880" y="520" font-size="19" font-weight="bold" fill="#0891b2" text-anchor="middle">Hoy</text>
      </g>

      <!-- Register Weight Button -->
      <g transform="translate(48, 1095)">
        <rect x="0" y="0" width="984" height="90" rx="24" fill="#0891b2"/>
        <text x="492" y="56" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">+ Registrar Nuevo Peso y Medidas</text>
      </g>

      ${renderBottomNav(1)}
    `
  },

  // 8. Mi Perfil & Metabolismo Basal / Gala Nutricionista IA
  {
    filename: 'TuNutriLens_8_NutriCoachIA.png',
    bg: '#f8fafc',
    render: () => `
      ${renderTopBar('Mi Perfil', 'Perfil Nutricional • Metabolismo BMR & TDEE')}

      <!-- BMR Card -->
      <g transform="translate(48, 245)">
        <rect x="0" y="0" width="984" height="170" rx="28" fill="#f0fdf4" stroke="#86efac" stroke-width="2"/>
        <text x="40" y="55" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#15803d">METABOLISMO BASAL (BMR)</text>
        <text x="40" y="112" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" fill="#166534">1.502 kcal / día</text>
        <text x="40" y="145" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#15803d">Calorías quemadas en reposo absoluto (Ecuación clínica Mifflin-St Jeor)</text>
      </g>

      <!-- TDEE Card -->
      <g transform="translate(48, 440)">
        <rect x="0" y="0" width="984" height="170" rx="28" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
        <text x="40" y="55" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="bold" fill="#1d4ed8">GASTO TOTAL DIARIO (TDEE)</text>
        <text x="40" y="112" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" fill="#1e40af">2.328 kcal / día</text>
        <text x="40" y="145" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#1d4ed8">Incluye tu nivel de actividad física (Moderado - 3 a 5 días de ejercicio semanal)</text>
      </g>

      <!-- Physical Data Card -->
      <g transform="translate(48, 635)">
        <rect x="0" y="0" width="984" height="340" rx="32" fill="#ffffff" filter="drop-shadow(0 8px 24px rgba(0,0,0,0.06))"/>
        
        <text x="40" y="55" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#0f172a">Datos Físicos y Estilo de Vida</text>
        
        <g transform="translate(40, 85)">
          <rect x="0" y="0" width="280" height="90" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
          <text x="30" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="bold" fill="#64748b">EDAD</text>
          <text x="30" y="72" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="bold" fill="#0f172a">30 años</text>

          <rect x="310" y="0" width="280" height="90" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
          <text x="340" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="bold" fill="#64748b">ALTURA</text>
          <text x="340" y="72" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="bold" fill="#0f172a">170 cm</text>

          <rect x="620" y="0" width="284" height="90" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
          <text x="650" y="38" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="bold" fill="#64748b">GÉNERO</text>
          <text x="650" y="72" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="bold" fill="#0f172a">Mujer</text>
        </g>

        <g transform="translate(40, 200)">
          <rect x="0" y="0" width="430" height="95" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
          <text x="30" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="bold" fill="#64748b">PESO ACTUAL</text>
          <text x="30" y="76" font-family="system-ui, -apple-system, sans-serif" font-size="30" font-weight="900" fill="#047857">75.0 kg</text>

          <rect x="474" y="0" width="430" height="95" rx="20" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
          <text x="504" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="bold" fill="#64748b">PESO OBJETIVO</text>
          <text x="504" y="76" font-family="system-ui, -apple-system, sans-serif" font-size="30" font-weight="900" fill="#0284c7">68.0 kg (-7 kg)</text>
        </g>
      </g>

      <!-- Gala AI Coach Card -->
      <g transform="translate(48, 1000)">
        <rect x="0" y="0" width="984" height="230" rx="32" fill="#ffffff" filter="drop-shadow(0 8px 24px rgba(0,0,0,0.06))"/>
        
        <circle cx="75" cy="65" r="32" fill="#dcfce7"/>
        <text x="75" y="76" font-size="32" text-anchor="middle">👩‍⚕️</text>
        <text x="125" y="60" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="bold" fill="#047857">Gala (Nutricionista Clínica IA 24/7)</text>
        <text x="125" y="88" font-family="system-ui, -apple-system, sans-serif" font-size="18" fill="#64748b">Respuestas y asesoría basada en evidencia clínica (OMS, Harvard, FESNAD)</text>

        <rect x="40" y="120" width="904" height="80" rx="20" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="2"/>
        <text x="65" y="155" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="bold" fill="#065f46">Plan activo: Pérdida de Peso Sostenible (1.800 kcal/día)</text>
        <text x="65" y="183" font-family="system-ui, -apple-system, sans-serif" font-size="17" fill="#047857">Déficit calórico moderado de 528 kcal para quemar grasa preservando tu salud y energía.</text>
      </g>

      <!-- Action Button -->
      <g transform="translate(48, 1255)">
        <rect x="0" y="0" width="984" height="85" rx="24" fill="#047857"/>
        <text x="492" y="53" font-family="system-ui, -apple-system, sans-serif" font-size="26" font-weight="bold" fill="#ffffff" text-anchor="middle">💬 Hablar con Gala por Chat o Voz</text>
      </g>

      ${renderBottomNav(3)}
    `
  }
];

async function generateAllScreenshots() {
  console.log('Generating 8 real edge-to-edge Google Play screenshots (1080x1920, 9:16)...');

  for (let i = 0; i < screens.length; i++) {
    const sc = screens[i];
    const num = i + 1;

    const fullSvg = `
      <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Edge-to-Edge Canvas Background -->
        <rect width="${WIDTH}" height="${HEIGHT}" fill="${sc.bg}"/>

        ${sc.render()}
      </svg>
    `;

    const outputPath = path.join(outputDir, sc.filename);
    await sharp(Buffer.from(fullSvg))
      .png({ quality: 95, compressionLevel: 8 })
      .toFile(outputPath);

    // Also copy to dist if dist exists
    const distScreensDir = path.resolve('./dist/screenshots');
    if (fs.existsSync(distScreensDir)) {
      fs.copyFileSync(outputPath, path.join(distScreensDir, sc.filename));
    }

    const stats = fs.statSync(outputPath);
    console.log(`✓ [${num}/${screens.length}] Generated ${sc.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
  }

  // Create zip file using python3
  console.log('Packaging all 8 screenshots into ZIP...');
  const zipCmd = `python3 -c "
import zipfile, os
files = [
    'TuNutriLens_1_EscanerComida.png',
    'TuNutriLens_2_Supermercado.png',
    'TuNutriLens_3_DiarioNutricional.png',
    'TuNutriLens_4_PlanSemanal.png',
    'TuNutriLens_5_EtapasVida.png',
    'TuNutriLens_6_NeveraResiduoCero.png',
    'TuNutriLens_7_ProgresoPeso.png',
    'TuNutriLens_8_NutriCoachIA.png'
]
zip_path = 'public/screenshots/TuNutriLens_8_Capturas_PlayStore.zip'
with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as z:
    for f in files:
        full = os.path.join('public/screenshots', f)
        if os.path.exists(full):
            z.write(full, f)
print('ZIP created at', zip_path, 'size:', os.path.getsize(zip_path))
"`;

  execSync(zipCmd, { stdio: 'inherit' });

  // Also copy ZIP to dist
  const distZip = path.resolve('./dist/screenshots/TuNutriLens_8_Capturas_PlayStore.zip');
  const pubZip = path.resolve('./public/screenshots/TuNutriLens_8_Capturas_PlayStore.zip');
  if (fs.existsSync(path.dirname(distZip)) && fs.existsSync(pubZip)) {
    fs.copyFileSync(pubZip, distZip);
  }

  console.log('SUCCESS: All 8 official screenshots and ZIP created.');
}

generateAllScreenshots().catch((err) => {
  console.error('Error generating screenshots:', err);
  process.exit(1);
});
