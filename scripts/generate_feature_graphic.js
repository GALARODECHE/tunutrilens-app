import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const WIDTH = 1024;
const HEIGHT = 500;

// Read logo
const logoPath = path.resolve('./public/icono_tunutrilens_512x512.png');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');

// Generate the 1024x500 Feature Graphic SVG
const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="50%" stop-color="#022c22" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>

    <!-- Accent Radial Glow -->
    <radialGradient id="emeraldGlow" cx="25%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#10b981" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="rightGlow" cx="80%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#059669" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#059669" stop-opacity="0" />
    </radialGradient>

    <!-- Shadow filters -->
    <filter id="shadowBox" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#000000" flood-opacity="0.5"/>
    </filter>

    <filter id="softGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#10b981" flood-opacity="0.25"/>
    </filter>

    <clipPath id="phoneClip">
      <rect x="0" y="0" width="280" height="460" rx="32"/>
    </clipPath>
  </defs>

  <!-- Background base -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#emeraldGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#rightGlow)"/>

  <!-- Subtle geometric nutritional grid lines in background -->
  <g opacity="0.07" stroke="#34d399" stroke-width="1.5">
    <line x1="0" y1="125" x2="1024" y2="125"/>
    <line x1="0" y1="250" x2="1024" y2="250"/>
    <line x1="0" y1="375" x2="1024" y2="375"/>
    <line x1="256" y1="0" x2="256" y2="500"/>
    <line x1="512" y1="0" x2="512" y2="500"/>
    <line x1="768" y1="0" x2="768" y2="500"/>
  </g>

  <!-- LEFT COLUMN: Brand identity & Value Proposition -->
  <g transform="translate(48, 52)">
    <!-- Top Pill: Category -->
    <rect x="0" y="0" width="250" height="34" rx="17" fill="#065f46" stroke="#10b981" stroke-width="1.5"/>
    <text x="125" y="23" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="800" fill="#a7f3d0" text-anchor="middle" letter-spacing="1">NUTRICIÓN &amp; SALUD IA</text>

    <!-- App Identity Row -->
    <g transform="translate(0, 48)">
      <!-- Logo image -->
      <rect x="0" y="0" width="76" height="76" rx="20" fill="#ffffff" filter="url(#softGlow)"/>
      <image href="data:image/png;base64,${logoBase64}" x="2" y="2" width="72" height="72"/>
      
      <text x="94" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="900" fill="#ffffff" letter-spacing="-0.5">TuNutriLens</text>
      <text x="96" y="68" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#34d399">Nutrición Visual Inteligente</text>
    </g>

    <!-- Main Headline -->
    <text x="0" y="172" font-family="system-ui, -apple-system, sans-serif" font-size="34" font-weight="900" fill="#ffffff" letter-spacing="-0.5">
      Escanea tus platos en 2 segundos
    </text>
    <text x="0" y="210" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800" fill="#a7f3d0">
      Calorías, Macronutrientes y Comida Real
    </text>

    <!-- Explanatory description -->
    <text x="0" y="246" font-family="system-ui, -apple-system, sans-serif" font-size="15" fill="#94a3b8">
      Identificación fotográfica con IA clínica • Semáforo NutriScore &amp; Grado NOVA
    </text>

    <!-- 3 Key Value Props -->
    <g transform="translate(0, 276)">
      <!-- Item 1 -->
      <rect x="0" y="0" width="180" height="38" rx="19" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <circle cx="20" cy="19" r="6" fill="#10b981"/>
      <text x="34" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#f8fafc">100% Comida Real</text>

      <!-- Item 2 -->
      <rect x="192" y="0" width="180" height="38" rx="19" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <circle cx="212" cy="19" r="6" fill="#38bdf8"/>
      <text x="226" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#f8fafc">Escáner Código Barras</text>

      <!-- Item 3 -->
      <rect x="384" y="0" width="170" height="38" rx="19" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <circle cx="404" cy="19" r="6" fill="#fbbf24"/>
      <text x="418" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#f8fafc">Guías ESPEN / OMS</text>
    </g>

    <!-- Trust banner footer -->
    <g transform="translate(0, 335)">
      <rect x="0" y="0" width="554" height="42" rx="12" fill="#064e3b" stroke="#047857" stroke-width="1"/>
      <text x="20" y="26" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" fill="#6ee7b7">
        🛡️ Sin dietas milagro ni efecto rebote • Respaldado por evidencia clínica
      </text>
    </g>
  </g>

  <!-- RIGHT COLUMN: Elegant Mobile Phone Showcase with Real UI & Badges -->
  <g transform="translate(670, 20)">
    <!-- Main Showcase Phone Frame (Compact 290 x 460) -->
    <g filter="url(#shadowBox)">
      <rect x="0" y="0" width="290" height="460" rx="34" fill="#0f172a" stroke="#334155" stroke-width="4"/>
      
      <!-- Phone Screen Area -->
      <g clip-path="url(#phoneClip)" transform="translate(5, 5)">
        <!-- Screen Background -->
        <rect x="0" y="0" width="280" height="450" fill="#090d16"/>
        
        <!-- Live Camera Viewfinder Overlay -->
        <rect x="12" y="14" width="256" height="200" rx="16" fill="#111827"/>
        
        <!-- Live Detection Reticle Corners -->
        <path d="M 24 30 L 24 50 M 24 30 L 44 30" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
        <path d="M 256 30 L 256 50 M 256 30 L 236 30" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
        <path d="M 24 198 L 24 178 M 24 198 L 44 198" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>
        <path d="M 256 198 L 256 178 M 256 198 L 236 198" stroke="#34d399" stroke-width="3" stroke-linecap="round"/>

        <!-- Dish Graphics -->
        <circle cx="140" cy="114" r="70" fill="#f1f5f9"/>
        <ellipse cx="140" cy="114" rx="60" ry="60" fill="#e2e8f0"/>
        <!-- Salmon portion -->
        <path d="M 110 100 C 120 75, 160 75, 175 95 C 185 115, 160 140, 135 140 Z" fill="#fb923c"/>
        <path d="M 125 98 L 165 112" stroke="#ffffff" stroke-width="2" opacity="0.7"/>
        <circle cx="115" cy="130" r="16" fill="#84cc16"/>
        <circle cx="155" cy="130" r="14" fill="#ca8a04"/>
        <circle cx="160" cy="90" r="10" fill="#e11d48"/>

        <!-- Detected Tag -->
        <rect x="40" y="24" width="200" height="24" rx="12" fill="#047857" opacity="0.95"/>
        <circle cx="54" cy="36" r="4" fill="#34d399"/>
        <text x="145" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Bowl Salmón Mediterráneo</text>

        <!-- Grams Badge -->
        <rect x="24" y="174" width="105" height="20" rx="10" fill="#000000" opacity="0.8"/>
        <text x="76" y="188" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="bold" fill="#34d399" text-anchor="middle">⚖️ 340 gramos</text>

        <!-- Nutrition Result Card below viewfinder -->
        <rect x="12" y="224" width="256" height="216" rx="18" fill="#ffffff"/>
        
        <text x="24" y="248" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" fill="#0f172a">Salmón &amp; Quinoa Real</text>
        
        <!-- Score Badges -->
        <rect x="24" y="258" width="82" height="22" rx="11" fill="#dcfce7"/>
        <text x="65" y="273" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold" fill="#15803d" text-anchor="middle">NutriScore A</text>

        <rect x="112" y="258" width="76" height="22" rx="11" fill="#ecfdf5"/>
        <text x="150" y="273" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold" fill="#047857" text-anchor="middle">NOVA 1</text>

        <!-- Calories -->
        <rect x="194" y="258" width="64" height="22" rx="11" fill="#f0fdf4"/>
        <text x="226" y="273" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold" fill="#047857" text-anchor="middle">524 kcal</text>

        <!-- 4 Small Macro Pills -->
        <g transform="translate(20, 290)">
          <rect x="0" y="0" width="56" height="42" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <text x="28" y="15" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="bold" fill="#64748b" text-anchor="middle">PROT</text>
          <text x="28" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" fill="#0284c7" text-anchor="middle">38g</text>

          <rect x="62" y="0" width="56" height="42" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <text x="90" y="15" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="bold" fill="#64748b" text-anchor="middle">CARB</text>
          <text x="90" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" fill="#ea580c" text-anchor="middle">45g</text>

          <rect x="124" y="0" width="56" height="42" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <text x="152" y="15" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="bold" fill="#64748b" text-anchor="middle">GRASAS</text>
          <text x="152" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" fill="#16a34a" text-anchor="middle">19g</text>

          <rect x="186" y="0" width="54" height="42" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1"/>
          <text x="213" y="15" font-family="system-ui, -apple-system, sans-serif" font-size="8" font-weight="bold" fill="#64748b" text-anchor="middle">FIBRA</text>
          <text x="213" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="900" fill="#9333ea" text-anchor="middle">8.4g</text>
        </g>

        <!-- Save button inside phone -->
        <rect x="20" y="342" width="240" height="34" rx="12" fill="#047857"/>
        <text x="140" y="364" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="bold" fill="#ffffff" text-anchor="middle">✓ Guardar en Diario Nutricional</text>

        <!-- Bottom bar in phone -->
        <rect x="0" y="390" width="280" height="50" fill="#ffffff"/>
        <line x1="0" y1="390" x2="280" y2="390" stroke="#f1f5f9" stroke-width="1"/>
        <circle cx="50" cy="412" r="12" fill="#047857"/>
        <text x="50" y="416" font-size="12" fill="#ffffff" text-anchor="middle">📷</text>
        <circle cx="110" cy="412" r="10" fill="#f1f5f9"/>
        <text x="110" y="416" font-size="12" text-anchor="middle">🥗</text>
        <circle cx="170" cy="412" r="10" fill="#f1f5f9"/>
        <text x="170" y="416" font-size="12" text-anchor="middle">🔍</text>
        <circle cx="230" cy="412" r="10" fill="#f1f5f9"/>
        <text x="230" y="416" font-size="12" text-anchor="middle">👤</text>
      </g>
    </g>

    <!-- Floating Badge 1 (Top Left of Phone) -->
    <g transform="translate(-80, 50)" filter="url(#shadowBox)">
      <rect x="0" y="0" width="170" height="54" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="2"/>
      <text x="85" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="#34d399" text-anchor="middle">✨ CÁMARA IA EN VIVO</text>
      <text x="85" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold" fill="#f8fafc" text-anchor="middle">Detección en 2 seg.</text>
    </g>

    <!-- Floating Badge 2 (Bottom Right of Phone) -->
    <g transform="translate(180, 370)" filter="url(#shadowBox)">
      <rect x="0" y="0" width="160" height="54" rx="16" fill="#064e3b" stroke="#34d399" stroke-width="2"/>
      <text x="80" y="24" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="800" fill="#a7f3d0" text-anchor="middle">🌱 ZERO WASTE</text>
      <text x="80" y="42" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">Nevera Residuo Cero</text>
    </g>
  </g>
</svg>
`;

async function generate() {
  console.log('Generating Google Play Feature Graphic (1024x500)...');
  
  const pngPath = path.resolve('./public/screenshots/TuNutriLens_Elemento_Grafico_Destacado_1024x500.png');
  const jpgPath = path.resolve('./public/screenshots/TuNutriLens_Elemento_Grafico_Destacado_1024x500.jpg');

  // Also save in public root for easy reference
  const pubPngPath = path.resolve('./public/TuNutriLens_Elemento_Grafico_Destacado_1024x500.png');
  const pubJpgPath = path.resolve('./public/TuNutriLens_Elemento_Grafico_Destacado_1024x500.jpg');

  // Generate PNG
  await sharp(Buffer.from(svg))
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(pngPath);
  fs.copyFileSync(pngPath, pubPngPath);

  // Generate JPEG (< 15 MB)
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 92 })
    .toFile(jpgPath);
  fs.copyFileSync(jpgPath, pubJpgPath);

  // Also copy to dist if dist exists
  const distDir = path.resolve('./dist/screenshots');
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(pngPath, path.join(distDir, 'TuNutriLens_Elemento_Grafico_Destacado_1024x500.png'));
    fs.copyFileSync(jpgPath, path.join(distDir, 'TuNutriLens_Elemento_Grafico_Destacado_1024x500.jpg'));
    fs.copyFileSync(pngPath, path.resolve('./dist/TuNutriLens_Elemento_Grafico_Destacado_1024x500.png'));
    fs.copyFileSync(jpgPath, path.resolve('./dist/TuNutriLens_Elemento_Grafico_Destacado_1024x500.jpg'));
  }

  const pngStats = fs.statSync(pngPath);
  const jpgStats = fs.statSync(jpgPath);

  console.log(`✓ PNG created: ${pngPath} (${(pngStats.size / 1024).toFixed(1)} KB)`);
  console.log(`✓ JPEG created: ${jpgPath} (${(jpgStats.size / 1024).toFixed(1)} KB)`);

  const meta = await sharp(pngPath).metadata();
  console.log(`Dimensions verified: ${meta.width}x${meta.height} px (Ratio: ${(meta.width / meta.height).toFixed(2)})`);
}

generate().catch(err => {
  console.error(err);
  process.exit(1);
});
