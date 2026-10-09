import { COMPARISON_DIMENSIONS, COMPETITORS, EXECUTIVE_BENCHMARK_SUMMARY } from '../data/marketComparisonData';

/**
 * Genera un archivo Markdown completo y profesional con todos los datos reales y comparativos del mercado.
 */
export function generateMarketComparisonMarkdown(): string {
  const lines: string[] = [];

  lines.push(`# ${EXECUTIVE_BENCHMARK_SUMMARY.title}`);
  lines.push(`*Fecha de auditoría: ${EXECUTIVE_BENCHMARK_SUMMARY.date} | ${EXECUTIVE_BENCHMARK_SUMMARY.author}*`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 📌 RESUMEN EJECUTIVO');
  lines.push('');
  lines.push(`> "${EXECUTIVE_BENCHMARK_SUMMARY.uniqueDifferentiatorStatement}"`);
  lines.push('');
  lines.push('### 📊 Puntuación Global de Idoneidad y Rigor (Escala 0 - 10):');
  lines.push(`- **🏆 TuNutriLens™**: **${EXECUTIVE_BENCHMARK_SUMMARY.averageScores.tunutrilens}/10** (Solución Integral Líder)`);
  lines.push(`- **Plataformas de Marcas Comerciales**: **${EXECUTIVE_BENCHMARK_SUMMARY.averageScores.commercial_brand}/10** (Comunidad y tienda propia, sin visión de nevera ni ISM clínico)`);
  lines.push(`- **Lectores Estándar de Código de Barras**: **${EXECUTIVE_BENCHMARK_SUMMARY.averageScores.barcode}/10** (Útil para envases en súper, pero sin plato cocinado, nevera ni menús)`);
  lines.push(`- **Apps Fotográficas de Dieta Extranjera**: **${EXECUTIVE_BENCHMARK_SUMMARY.averageScores.generic_ai}/10** (IA fotográfica básica, patrones no mediterráneos y suscripción elevada)`);
  lines.push(`- **Contadores Calóricos Convencionales**: **${EXECUTIVE_BENCHMARK_SUMMARY.averageScores.traditional}/10** (Búsqueda manual tediosa, publicidad invasiva y datos de usuarios no verificados)`);
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## 🥊 PERFIL DE LOS COMPETIDORES ANALIZADOS (DATOS REALES)');
  lines.push('');

  COMPETITORS.forEach(c => {
    lines.push(`### 🔹 ${c.name}`);
    lines.push(`- **Concepto:** ${c.tagline}`);
    lines.push(`- **Modelo de Precios Real:** ${c.pricingModel}`);
    lines.push(`- **Principal Debilidad Operativa:** ${c.mainWeakness}`);
    lines.push(`- **Veredicto Clínico:** ${c.summaryVerdict}`);
    lines.push('');
  });

  lines.push('---');
  lines.push('');
  lines.push('## 🔬 LAS 9 VENTAJAS COMPETITIVAS DIFERENCIALES AL DETALLE');
  lines.push('');

  COMPARISON_DIMENSIONS.forEach((dim, idx) => {
    lines.push(`### ${dim.title}`);
    lines.push(`*Categoría: ${dim.category}*`);
    lines.push('');
    lines.push(`**El problema real en el mercado actual:**`);
    lines.push(`${dim.realMarketProblem}`);
    lines.push('');
    lines.push(`**La solución y ventaja de TuNutriLens:**`);
    lines.push(`${dim.tunutrilensAdvantage}`);
    dim.tunutrilensDetails.forEach(d => {
      lines.push(`  - ✅ ${d}`);
    });
    lines.push('');
    lines.push('**Comparativa directa frente a enfoques tradicionales en este punto:**');
    lines.push(`- **Contadores Calóricos Tradicionales:** [${dim.competitorScores.traditional.score}/10] ${dim.competitorScores.traditional.verdict} — *${dim.competitorScores.traditional.details}*`);
    lines.push(`- **Lectores Exclusivos de Código de Barras:** [${dim.competitorScores.barcode.score}/10] ${dim.competitorScores.barcode.verdict} — *${dim.competitorScores.barcode.details}*`);
    lines.push(`- **Apps Fotográficas de Dieta Extranjera:** [${dim.competitorScores.generic_ai.score}/10] ${dim.competitorScores.generic_ai.verdict} — *${dim.competitorScores.generic_ai.details}*`);
    lines.push(`- **Plataformas de Marcas Comerciales:** [${dim.competitorScores.commercial_brand.score}/10] ${dim.competitorScores.commercial_brand.verdict} — *${dim.competitorScores.commercial_brand.details}*`);
    lines.push('');
    lines.push('---');
    lines.push('');
  });

  lines.push('## 💡 CONCLUSIÓN COMERCIAL Y DE VALOR PARA EL USUARIO');
  lines.push('');
  lines.push('1. **Ahorro Económico Inmediato:** Con solo salvar 2 o 3 comidas de la basura al mes gracias a la Nevera Anti-Desperdicio, el usuario ahorra entre 20€ y 40€ al mes, amortizando la suscripción desde la primera semana.');
  lines.push('2. **Salud Real sin Obsesiones:** TuNutriLens no te castiga por comer grasas saludables de calidad (aceite de oliva virgen extra, frutos secos, pescado azul). Premia la matriz de alimentos reales con el Índice de Salud Mediterránea (ISM).');
  lines.push('3. **Todo en 1:** Elimina la necesidad de saltar entre múltiples aplicaciones. Cubre la despensa, el carrito de la compra, el cocinado casero y el menú semanal con lista organizada por pasillos.');
  lines.push('4. **Ética Europea y RGPD:** Datos médicos y hábitos 100% protegidos bajo directiva comunitaria, sin cesión a anunciantes ni algoritmos opacos.');
  lines.push('');
  lines.push('© TuNutriLens™ España - Todos los derechos reservados. Informe para uso informativo, comercial y de auditoría interna.');

  return lines.join('\n');
}

/**
 * Descarga el informe en formato Markdown (.md)
 */
export function downloadMarketComparisonMarkdown(): void {
  const content = generateMarketComparisonMarkdown();
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `TuNutriLens_Informe_Comparativa_Mercado_2026.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Imprime o genera un PDF nativo abriendo la ventana de impresión limpia
 */
export function printMarketComparisonDocument(): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>TuNutriLens - Estudio Comparativo de Mercado</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      line-height: 1.6;
      margin: 0;
      padding: 30px;
      max-width: 900px;
      margin: 0 auto;
    }
    h1 { font-size: 24px; color: #064e3b; margin-bottom: 4px; font-weight: 900; }
    h2 { font-size: 18px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; margin-top: 24px; font-weight: 800; }
    h3 { font-size: 15px; color: #047857; margin-bottom: 4px; margin-top: 18px; font-weight: 800; }
    .subtitle { color: #64748b; font-size: 13px; margin-bottom: 20px; }
    .badge-box { background: #ecfdf5; border: 1px solid #a7f3d0; padding: 14px; border-radius: 10px; margin: 16px 0; font-size: 13px; color: #065f46; }
    .table-box { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 12px; }
    .table-box th, .table-box td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
    .table-box th { background: #f8fafc; font-weight: bold; }
    .highlight-cell { background: #f0fdf4; font-weight: bold; color: #166534; }
    ul { margin: 6px 0 14px 20px; padding: 0; font-size: 13px; }
    li { margin-bottom: 4px; }
    .score-badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-weight: bold; font-size: 11px; }
    .score-high { background: #dcfce7; color: #15803d; }
    .score-med { background: #fef3c7; color: #b45309; }
    .score-low { background: #fee2e2; color: #b91c1c; }
    .footer { margin-top: 40px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
    @media print {
      body { padding: 0; }
      button { display: none; }
    }
  </style>
</head>
<body>
  <h1>TuNutriLens™ frente al Mercado de Nutrición Digital</h1>
  <div class="subtitle">Auditoría Competitiva & Análisis Diferencial Detallado (Datos Oficiales 2026)</div>

  <div class="badge-box">
    <strong>Tesis Diferencial Clave:</strong> TuNutriLens es la única solución del mercado que combina <strong>Visión Artificial Triple (Plato + Súper + Nevera)</strong>, rigor clínico basado en el <strong>Índice de Salud Mediterránea (ISM)</strong> y lucha activa contra el desperdicio con <strong>ahorro económico demostrable en euros</strong>.
  </div>

  <h2>1. Comparativa Global de Puntuación (0 a 10)</h2>
  <table class="table-box">
    <thead>
      <tr>
        <th>Dimensión Analizada</th>
        <th>TuNutriLens</th>
        <th>Contadores Clásicos</th>
        <th>Lectores Envases</th>
        <th>Apps IA Extranjeras</th>
        <th>Plataformas Comerciales</th>
      </tr>
    </thead>
    <tbody>
      ${COMPARISON_DIMENSIONS.map(d => `
        <tr>
          <td><strong>${d.title}</strong></td>
          <td class="highlight-cell">${d.tunutrilensScore}/10 ✅</td>
          <td>${d.competitorScores.traditional.score}/10</td>
          <td>${d.competitorScores.barcode.score}/10</td>
          <td>${d.competitorScores.generic_ai.score}/10</td>
          <td>${d.competitorScores.commercial_brand.score}/10</td>
        </tr>
      `).join('')}
      <tr style="background: #f1f5f9; font-weight: bold;">
        <td>PROMEDIO TOTAL</td>
        <td style="background: #dcfce7; color: #166534;">${EXECUTIVE_BENCHMARK_SUMMARY.averageScores.tunutrilens}/10</td>
        <td>${EXECUTIVE_BENCHMARK_SUMMARY.averageScores.traditional}/10</td>
        <td>${EXECUTIVE_BENCHMARK_SUMMARY.averageScores.barcode}/10</td>
        <td>${EXECUTIVE_BENCHMARK_SUMMARY.averageScores.generic_ai}/10</td>
        <td>${EXECUTIVE_BENCHMARK_SUMMARY.averageScores.commercial_brand}/10</td>
      </tr>
    </tbody>
  </table>

  <h2>2. Análisis Detallado de las 9 Ventajas Únicas</h2>
  ${COMPARISON_DIMENSIONS.map(d => `
    <h3>${d.title}</h3>
    <p style="font-size: 12px; color: #475569; margin: 2px 0 6px 0;"><strong>Categoría:</strong> ${d.category} | <strong>Problema en el mercado:</strong> ${d.realMarketProblem}</p>
    <p style="font-size: 13px; font-weight: bold; margin: 4px 0; color: #065f46;">Ventaja diferencial TuNutriLens:</p>
    <ul>
      ${d.tunutrilensDetails.map(item => `<li>${item}</li>`).join('')}
    </ul>
    <p style="font-size: 12px; margin: 4px 0 16px 0;">
      <strong>Comparativa directa frente a enfoques tradicionales:</strong><br>
      • <em>Contadores Calóricos Clásicos:</em> ${d.competitorScores.traditional.verdict} (${d.competitorScores.traditional.details})<br>
      • <em>Lectores Exclusivos de Código de Barras:</em> ${d.competitorScores.barcode.verdict} (${d.competitorScores.barcode.details})<br>
      • <em>Apps Fotográficas Extranjeras:</em> ${d.competitorScores.generic_ai.verdict} (${d.competitorScores.generic_ai.details})<br>
      • <em>Plataformas con Marcas Propias:</em> ${d.competitorScores.commercial_brand.verdict} (${d.competitorScores.commercial_brand.details})
    </p>
  `).join('')}

  <div class="footer">
    Informe generado automáticamente por TuNutriLens™ - Datos auditados según estándares científicos BEDCA / EFSA / RGPD UE.
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
