const fs = require('fs');
const path = require('path');

function createHarvardResumePDF() {
  const contentStreams = [];

  // Helper to escape PDF text
  function escapePDF(str) {
    return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  // Draw line
  function drawLine(x1, y1, x2, y2, lineWidth = 0.75) {
    contentStreams.push(`${lineWidth} w 0 0 0 RG ${x1} ${y1} m ${x2} ${y2} l S`);
  }

  // Draw text at exact position
  function drawText(font, size, x, y, text) {
    contentStreams.push(`BT /${font} ${size} Tf ${x} ${y} Td (${escapePDF(text)}) Tj ET`);
  }

  // Draw centered text
  function drawCenteredText(font, size, y, text, approxCharWidth = 0.5) {
    // Estimating string width for Times font
    const textWidth = text.length * size * approxCharWidth;
    const x = (612 - textWidth) / 2;
    drawText(font, size, Math.max(36, x), y, text);
  }

  // Page coordinates: (0,0) is bottom-left.
  // Standard Letter: 612 x 792 pt. Margins: Left=40, Right=572 (width=532).
  const left = 40;
  const right = 572;
  let y = 752;

  // 1. HEADER (Centered)
  drawCenteredText('F2', 17, y, 'ALEX MORGAN', 0.55);
  y -= 15;
  drawCenteredText('F1', 9.5, y, 'Cambridge, MA  |  (555) 382-9104  |  alex.morgan@alumni.harvard.edu  |  linkedin.com/in/alexmorgan  |  github.com/alexmorgan', 0.44);
  y -= 18;

  // Section helper
  function drawSectionTitle(title) {
    drawText('F2', 11, left, y, title.toUpperCase());
    y -= 3;
    drawLine(left, y, right, y, 0.75);
    y -= 13;
  }

  // 2. EDUCATION
  drawSectionTitle('Education');
  drawText('F2', 10.5, left, y, 'HARVARD UNIVERSITY');
  drawText('F3', 10, right - 85, y, 'Cambridge, MA');
  y -= 12;
  drawText('F3', 10, left, y, 'Bachelor of Arts in Computer Science, Secondary in Economics');
  drawText('F1', 10, right - 55, y, 'May 2023');
  y -= 12;
  drawText('F1', 9.5, left + 10, y, '- Cumulative GPA: 3.88 / 4.00 (Magna Cum Laude, Dean\'s List all semesters)');
  y -= 11;
  drawText('F1', 9.5, left + 10, y, '- Relevant Coursework: Systems Programming, Algorithms & Data Structures, Machine Learning, Distributed Systems');
  y -= 16;

  // 3. TECHNICAL SKILLS
  drawSectionTitle('Technical Skills');
  drawText('F2', 9.5, left, y, 'Languages:');
  drawText('F1', 9.5, left + 65, y, 'Python, JavaScript (ES6+), TypeScript, SQL (PostgreSQL), C++, HTML5/CSS3');
  y -= 12;
  drawText('F2', 9.5, left, y, 'Frameworks:');
  drawText('F1', 9.5, left + 65, y, 'FastAPI, React, Node.js, Polars, Pandas, Pydantic, PyTorch, TailwindCSS');
  y -= 12;
  drawText('F2', 9.5, left, y, 'Tools & Cloud:');
  drawText('F1', 9.5, left + 65, y, 'Git, GitHub Actions (CI/CD), Docker, Supabase, AWS (S3, EC2), Linux, Postman');
  y -= 16;

  // 4. PROFESSIONAL EXPERIENCE
  drawSectionTitle('Professional Experience');

  // Job 1
  drawText('F2', 10.5, left, y, 'NEXUS DATA SYSTEMS');
  drawText('F3', 10, right - 115, y, 'June 2023 - Present');
  y -= 12;
  drawText('F3', 10, left, y, 'Software Engineer - AI & Backend Infrastructure');
  drawText('F3', 10, right - 65, y, 'Boston, MA');
  y -= 12;
  drawText('F1', 9.5, left + 10, y, '- Architected and deployed asynchronous REST APIs using FastAPI and Python, handling 150,000+ daily queries with sub-50ms latency.');
  y -= 11;
  drawText('F1', 9.5, left + 10, y, '- Integrated LLM extraction pipelines using Google Gemini API and Pydantic schemas, reaching 99.4% data validation accuracy.');
  y -= 11;
  drawText('F1', 9.5, left + 10, y, '- Engineered high-speed dataframes with Polars for batch CSV parsing in RAM, decreasing execution times by 68%.');
  y -= 11;
  drawText('F1', 9.5, left + 10, y, '- Implemented automated CI/CD workflows and containerized services using Docker, maintaining 94% test suite coverage.');
  y -= 14;

  // Job 2
  drawText('F2', 10.5, left, y, 'VERTEX ANALYTICS');
  drawText('F3', 10, right - 135, y, 'June 2022 - August 2022');
  y -= 12;
  drawText('F3', 10, left, y, 'Software Engineering Intern - Platform Team');
  drawText('F3', 10, right - 75, y, 'New York, NY');
  y -= 12;
  drawText('F1', 9.5, left + 10, y, '- Designed responsive dashboard interfaces in React and TypeScript for recruitment analytics, improving workflow speed by 25%.');
  y -= 11;
  drawText('F1', 9.5, left + 10, y, '- Optimized complex PostgreSQL queries and Supabase indexes, decreasing median search query latency from 420ms to 85ms.');
  y -= 11;
  drawText('F1', 9.5, left + 10, y, '- Participated in Agile engineering sprints, performing rigorous code reviews and implementing unit tests.');
  y -= 16;

  // 5. PROJECTS
  drawSectionTitle('Projects');

  // Project 1
  drawText('F2', 10, left, y, 'SMART ATS & RESUME PARSER');
  drawText('F3', 9.5, right - 220, y, 'Python, FastAPI, Polars, React, Gemini SDK');
  y -= 12;
  drawText('F1', 9.5, left + 10, y, '- Engineered an applicant tracking platform filtering candidates by experience thresholds and calculating match scores.');
  y -= 11;
  drawText('F1', 9.5, left + 10, y, '- Built an intuitive user interface with drag-and-drop file upload and instant structured evaluation breakdown.');
  y -= 14;

  // Project 2
  drawText('F2', 10, left, y, 'SEMANTIC EMBEDDING SEARCH ENGINE');
  drawText('F3', 9.5, right - 210, y, 'Python, PyTorch, Supabase pgvector, Docker');
  y -= 12;
  drawText('F1', 9.5, left + 10, y, '- Developed a high-throughput search system vectorizing and indexing 50,000+ candidate profiles with cosine-similarity matching.');
  y -= 16;

  // 6. LEADERSHIP & ACTIVITIES
  drawSectionTitle('Leadership & Activities');
  drawText('F2', 10, left, y, 'HARVARD COMPUTER SOCIETY');
  drawText('F3', 9.5, right - 135, y, 'September 2021 - May 2023');
  y -= 12;
  drawText('F3', 10, left, y, 'Vice President of Technical Workshops');
  drawText('F3', 10, right - 85, y, 'Cambridge, MA');
  y -= 12;
  drawText('F1', 9.5, left + 10, y, '- Organized and instructed 12 technical bootcamps on full-stack web architectures and cloud deployment for 200+ students.');

  // Combine stream
  const streamData = contentStreams.join('\n');
  const streamLength = Buffer.byteLength(streamData, 'utf-8');

  // Build PDF structure
  const objects = [];
  objects.push(`1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj`);
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`);
  objects.push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> /Contents 7 0 R >>\nendobj`);
  objects.push(`4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Roman >>\nendobj`);
  objects.push(`5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold >>\nendobj`);
  objects.push(`6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Times-Italic >>\nendobj`);
  objects.push(`7 0 obj\n<< /Length ${streamLength} >>\nstream\n${streamData}\nendstream\nendobj`);

  let fileContent = '%PDF-1.4\n';
  const offsets = [0];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(fileContent, 'utf-8'));
    fileContent += objects[i] + '\n';
  }

  const startxref = Buffer.byteLength(fileContent, 'utf-8');
  fileContent += 'xref\n';
  fileContent += `0 ${objects.length + 1}\n`;
  fileContent += '0000000000 65535 f \n';
  for (let i = 1; i <= objects.length; i++) {
    const offsetStr = String(offsets[i]).padStart(10, '0');
    fileContent += `${offsetStr} 00000 n \n`;
  }
  fileContent += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

  const outputPathRoot = path.join(__dirname, 'cv_harvard_ejemplo.pdf');
  const outputPathFrontend = path.join(__dirname, 'frontend', 'public', 'cv_harvard_ejemplo.pdf');

  fs.writeFileSync(outputPathRoot, Buffer.from(fileContent, 'utf-8'));
  console.log('Generated root PDF:', outputPathRoot, fs.statSync(outputPathRoot).size, 'bytes');

  if (fs.existsSync(path.join(__dirname, 'frontend', 'public'))) {
    fs.writeFileSync(outputPathFrontend, Buffer.from(fileContent, 'utf-8'));
    console.log('Generated frontend public PDF:', outputPathFrontend, fs.statSync(outputPathFrontend).size, 'bytes');
  }
}

createHarvardResumePDF();
