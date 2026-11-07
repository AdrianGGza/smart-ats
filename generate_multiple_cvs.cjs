const fs = require('fs');
const path = require('path');

function createResumePDF(candidate, outputPath) {
  const contentStreams = [];

  function escapePDF(str) {
    return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  function drawLine(x1, y1, x2, y2, lineWidth = 0.75) {
    contentStreams.push(`${lineWidth} w 0 0 0 RG ${x1} ${y1} m ${x2} ${y2} l S`);
  }

  function drawText(font, size, x, y, text) {
    contentStreams.push(`BT /${font} ${size} Tf ${x} ${y} Td (${escapePDF(text)}) Tj ET`);
  }

  function drawCenteredText(font, size, y, text, approxCharWidth = 0.5) {
    const textWidth = text.length * size * approxCharWidth;
    const x = (612 - textWidth) / 2;
    drawText(font, size, Math.max(36, x), y, text);
  }

  const left = 40;
  const right = 572;
  let y = 752;

  // Header
  drawCenteredText('F2', 17, y, candidate.name.toUpperCase(), 0.55);
  y -= 15;
  drawCenteredText('F1', 9.5, y, `${candidate.location}  |  ${candidate.phone}  |  ${candidate.email}  |  ${candidate.links}`, 0.44);
  y -= 18;

  function drawSectionTitle(title) {
    drawText('F2', 11, left, y, title.toUpperCase());
    y -= 3;
    drawLine(left, y, right, y, 0.75);
    y -= 13;
  }

  // Education
  drawSectionTitle('Education');
  drawText('F2', 10.5, left, y, candidate.education.institution);
  drawText('F3', 10, right - 95, y, candidate.education.location);
  y -= 12;
  drawText('F3', 10, left, y, candidate.education.degree);
  drawText('F1', 10, right - 60, y, candidate.education.date);
  y -= 12;
  for (const bullet of candidate.education.bullets) {
    drawText('F1', 9.5, left + 10, y, `- ${bullet}`);
    y -= 11;
  }
  y -= 4;

  // Technical Skills
  drawSectionTitle('Technical Skills');
  for (const [category, skills] of Object.entries(candidate.skills)) {
    drawText('F2', 9.5, left, y, `${category}:`);
    drawText('F1', 9.5, left + 75, y, skills);
    y -= 12;
  }
  y -= 4;

  // Experience
  drawSectionTitle('Professional Experience');
  for (const job of candidate.experience) {
    drawText('F2', 10.5, left, y, job.company);
    drawText('F3', 10, right - 120, y, job.dates);
    y -= 12;
    drawText('F3', 10, left, y, job.role);
    drawText('F3', 10, right - 75, y, job.location);
    y -= 12;
    for (const b of job.bullets) {
      drawText('F1', 9.5, left + 10, y, `- ${b}`);
      y -= 11;
    }
    y -= 4;
  }

  // Projects
  drawSectionTitle('Key Projects');
  for (const proj of candidate.projects) {
    drawText('F2', 10, left, y, proj.title);
    drawText('F3', 9.5, right - 220, y, proj.technologies);
    y -= 12;
    for (const b of proj.bullets) {
      drawText('F1', 9.5, left + 10, y, `- ${b}`);
      y -= 11;
    }
    y -= 4;
  }

  const streamData = contentStreams.join('\n');
  const streamLength = Buffer.byteLength(streamData, 'utf-8');

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

  fs.writeFileSync(outputPath, Buffer.from(fileContent, 'utf-8'));
}

const candidates = [
  {
    fileName: 'cv_valeria_mendez_frontend.pdf',
    name: 'Valeria Méndez',
    location: 'Guadalajara, México',
    phone: '(33) 1982-4521',
    email: 'valeria.mendez.dev@gmail.com',
    links: 'linkedin.com/in/valeriamendez  |  github.com/valeriam-frontend',
    education: {
      institution: 'INSTITUTO TECNOLÓGICO DE ESTUDIOS SUPERIORES DE OCCIDENTE (ITESO)',
      location: 'Guadalajara, JAL',
      degree: 'Ingeniería en Sistemas Computacionales (Titulada)',
      date: 'Junio 2020',
      bullets: [
        'Mención honorífica por promedio sobresaliente de 9.4/10.',
        'Especialidad en Diseño de Interfaces Web Responsivas y Accesibilidad WCAG.'
      ]
    },
    skills: {
      'Languages': 'JavaScript (ES6+), TypeScript, HTML5, CSS3, SCSS, Node.js',
      'Frameworks': 'React 18, Next.js, Redux Toolkit, TailwindCSS, Vite, Jest, Playwright',
      'Tools & Cloud': 'Git, GitHub Actions, Figma, Webpack, Vercel, RESTful APIs, Supabase'
    },
    experience: [
      {
        company: 'TECHFLOW DIGITAL SOLUTIONS',
        location: 'Remoto',
        role: 'Senior Frontend Engineer / Tech Lead UI',
        dates: 'Enero 2022 - Presente',
        bullets: [
          'Lideró la migración de un monolito legado hacia microfrontends en React y Next.js, reduciendo el First Contentful Paint en un 42%.',
          'Diseñó y mantuvo un sistema de diseño institucional con TailwindCSS y TypeScript utilizado por 5 equipos de desarrollo.',
          'Implementó pruebas automatizadas con Playwright y Jest, incrementando la cobertura de código del 40% al 88%.'
        ]
      },
      {
        company: 'INNOVA CLOUD APPS',
        location: 'Guadalajara, JAL',
        role: 'Frontend Developer',
        dates: 'Julio 2020 - Diciembre 2021',
        bullets: [
          'Desarrolló tableros interactivos en React consumiendo servicios REST y WebSockets en tiempo real.',
          'Optimizó el consumo de memoria en el navegador reduciendo re-renderizados innecesarios mediante useMemo y useCallback.'
        ]
      }
    ],
    projects: [
      {
        title: 'TALENT PORTAL DASHBOARD',
        technologies: 'React 18, TailwindCSS, TypeScript, Supabase',
        bullets: [
          'Plataforma integral para candidatos con previsualización de documentos y filtrado instantáneo en cliente.',
          'Desplegado en producción con arquitectura serverless y autenticación OAuth.'
        ]
      }
    ]
  },
  {
    fileName: 'cv_jorge_castillo_backend.pdf',
    name: 'Jorge Castillo',
    location: 'Ciudad de México, México',
    phone: '(55) 4721-8930',
    email: 'jorge.castillo.py@gmail.com',
    links: 'linkedin.com/in/jorgecastillo-py  |  github.com/jorgec-backend',
    education: {
      institution: 'UNIVERSIDAD NACIONAL AUTÓNOMA DE MÉXICO (UNAM)',
      location: 'Ciudad de México, CDMX',
      degree: 'Licenciatura en Ciencias de la Computación',
      date: 'Diciembre 2020',
      bullets: [
        'Promedio: 9.2/10. Tesina en Algoritmos Distribuidos y Concurrencia en Python.',
        'Materias clave: Bases de Datos Avanzadas, Sistemas Distribuidos, Redes de Computadoras.'
      ]
    },
    skills: {
      'Languages': 'Python 3.12, SQL (PostgreSQL), Go básico, Bash Scripting',
      'Frameworks': 'FastAPI, Polars, Pydantic, SQLAlchemy, Celery, Redis, Pytest',
      'Tools & Cloud': 'Docker, Kubernetes, AWS (ECS, RDS, S3), Supabase, Git, Postman'
    },
    experience: [
      {
        company: 'FINPAY LATAM',
        location: 'Ciudad de México, CDMX',
        role: 'Senior Backend Engineer',
        dates: 'Marzo 2022 - Presente',
        bullets: [
          'Diseñó e implementó servicios asíncronos en FastAPI procesando más de 200,000 transacciones diarias con latencia menor a 40ms.',
          'Sustituyó pipelines basados en Pandas por Polars en memoria, logrando una aceleración de procesamiento de 5x en datasets transaccionales.',
          'Aseguró contratos de datos estrictos mediante modelos Pydantic y tipado estático con Mypy.'
        ]
      },
      {
        company: 'DATAVOX SYSTEMS',
        location: 'Querétaro, QRO',
        role: 'Backend Developer',
        dates: 'Enero 2021 - Febrero 2022',
        bullets: [
          'Construyó APIs RESTful en Python y gestionó migraciones automáticas con Alembic sobre PostgreSQL.',
          'Optimizó consultas SQL indexando tablas clave y reduciendo tiempos de respuesta de 650ms a 90ms.'
        ]
      }
    ],
    projects: [
      {
        title: 'HIGH-SPEED RESUME INGESTION API',
        technologies: 'FastAPI, Polars, Supabase, Docker',
        bullets: [
          'Servicio de ingestión masiva que lee archivos PDF/CSV directamente en memoria RAM usando io.BytesIO.',
          'Filtrado y validación de compatibilidad con Gemini Flash Lite y persistencia en PostgreSQL.'
        ]
      }
    ]
  },
  {
    fileName: 'cv_sofia_navarro_data_ai.pdf',
    name: 'Sofía Navarro',
    location: 'Monterrey, México',
    phone: '(81) 8234-9012',
    email: 'sofia.navarro.ai@gmail.com',
    links: 'linkedin.com/in/sofianavarro-ai  |  github.com/sofian-ml',
    education: {
      institution: 'INSTITUTO TECNOLÓGICO Y DE ESTUDIOS SUPERIORES DE MONTERREY (ITESM)',
      location: 'Monterrey, NL',
      degree: 'Ingeniería en Ciencia de Datos y Matemáticas Aplicadas',
      date: 'Mayo 2021',
      bullets: [
        'Graduada con honores. Presidente de la Sociedad de Inteligencia Artificial Estudiantil.',
        'Cursos destacados: Aprendizaje Profundo, Minería de Texto, Modelos de Lenguaje (LLMs).'
      ]
    },
    skills: {
      'Languages': 'Python, SQL, R, C++',
      'AI & ML': 'Google Gemini SDK, LangChain, PyTorch, Hugging Face, Scikit-learn, Vector Embeddings',
      'Data & Cloud': 'Polars, Pandas, Supabase (pgvector), Docker, FastAPI, Snowflake, MLflow'
    },
    experience: [
      {
        company: 'COGNITIVE DATA LABS',
        location: 'Monterrey, NL',
        role: 'Machine Learning & LLM Engineer',
        dates: 'Agosto 2022 - Presente',
        bullets: [
          'Desarrolló canalizaciones de extracción estructurada de entidades usando Gemini 1.5 Flash y esquemas Pydantic.',
          'Construyó un motor de búsqueda semántica con pgvector en Supabase alcanzando 97% de precisión top-3.',
          'Procesó más de 10 millones de filas tabulares usando Polars para entrenamiento de modelos predictivos.'
        ]
      },
      {
        company: 'ANALYTICS MX',
        location: 'Monterrey, NL',
        role: 'Data Analyst / Junior Scientist',
        dates: 'Junio 2021 - Julio 2022',
        bullets: [
          'Construyó modelos de clasificación de texto y sentimiento para atención a clientes.',
          'Creó pipelines ETL automatizados en Python para ingesta y limpieza de datos no estructurados.'
        ]
      }
    ],
    projects: [
      {
        title: 'SEMANTIC ATS MATCHING ENGINE',
        technologies: 'Python, Gemini SDK, Supabase Vector, Polars',
        bullets: [
          'Sistema que evalúa la compatibilidad entre requisitos de vacantes y CVs mediante embeddings vectoriales.',
          'Cálculo de puntajes ponderados por experiencia técnica y validación en tiempo real.'
        ]
      }
    ]
  },
  {
    fileName: 'cv_esteban_reyes_devops.pdf',
    name: 'Esteban Reyes',
    location: 'Mérida, México',
    phone: '(999) 314-5678',
    email: 'esteban.reyes.devops@gmail.com',
    links: 'linkedin.com/in/estebanreyes-ops  |  github.com/estebanr-infra',
    education: {
      institution: 'UNIVERSIDAD AUTÓNOMA DE YUCATÁN (UADY)',
      location: 'Mérida, YUC',
      degree: 'Ingeniería en Computación',
      date: 'Noviembre 2018',
      bullets: [
        'Especialidad en Redes de Alta Disponibilidad y Seguridad de Infraestructura.',
        'Certificaciones: AWS Certified Solutions Architect, Certified Kubernetes Administrator (CKA).'
      ]
    },
    skills: {
      'Cloud Providers': 'AWS (EKS, ECS, S3, RDS, CloudFront), Google Cloud Platform (GCP)',
      'DevOps & IaC': 'Terraform, Docker, Kubernetes, Helm, GitHub Actions, GitLab CI/CD, Ansible',
      'Scripting & Ops': 'Python, Bash, Linux (Ubuntu, Debian, Alpine), Prometheus, Grafana, OpenTelemetry'
    },
    experience: [
      {
        company: 'NEXUS CLOUD SOLUTIONS',
        location: 'Remoto',
        role: 'Lead Cloud & DevOps Engineer',
        dates: 'Febrero 2021 - Presente',
        bullets: [
          'Administró infraestructura distribuida en AWS con Terraform y Kubernetes para más de 40 microservicios.',
          'Diseñó pipelines CI/CD automatizados reduciendo los tiempos de despliegue de 45 a 8 minutos con cero downtime.',
          'Implementó observabilidad de extremo a extremo con Prometheus, Grafana y OpenTelemetry.'
        ]
      },
      {
        company: 'GLOBAL TELECOM TECH',
        location: 'Mérida, YUC',
        role: 'DevOps / SysAdmin Engineer',
        dates: 'Diciembre 2018 - Enero 2021',
        bullets: [
          'Automatizó aprovisionamiento de servidores Linux usando scripts en Bash y Ansible.',
          'Configuró políticas de seguridad IAM, firewalls virtuales y copias de seguridad continuas en S3.'
        ]
      }
    ],
    projects: [
      {
        title: 'AUTOMATED ATS CLOUD INFRASTRUCTURE',
        technologies: 'Terraform, AWS, Docker, GitHub Actions',
        bullets: [
          'Infraestructura como código (IaC) modular para despliegue de backend FastAPI y base de datos PostgreSQL.',
          'Configuración de autoescalado basado en consumo de memoria durante cargas de trabajo por lotes.'
        ]
      }
    ]
  },
  {
    fileName: 'cv_lucia_ortiz_junior.pdf',
    name: 'Lucía Ortiz',
    location: 'Puebla, México',
    phone: '(222) 598-1234',
    email: 'lucia.ortiz.dev@gmail.com',
    links: 'linkedin.com/in/luciaortiz-dev  |  github.com/luciao-junior',
    education: {
      institution: 'BENEMÉRITA UNIVERSIDAD AUTÓNOMA DE PUEBLA (BUAP)',
      location: 'Puebla, PUE',
      degree: 'Licenciatura en Ciencias de la Computación (Egresada)',
      date: 'Diciembre 2024',
      bullets: [
        'Promedio: 8.9/10. Participación activa en maratones de programación competitiva ACM-ICPC.',
        'Cursos relevantes: Estructuras de Datos, Programación Orientada a Objetos, Desarrollo Web Básico.'
      ]
    },
    skills: {
      'Languages': 'JavaScript, Python básico, HTML5, CSS3, SQL básico',
      'Tools & Frameworks': 'React básico, Git, GitHub, VS Code, Linux, Postman',
      'Soft Skills': 'Trabajo en equipo colaborativo, comunicación ágil, aprendizaje proactivo'
    },
    experience: [
      {
        company: 'INICIATIVA TECNOLÓGICA LOCAL',
        location: 'Puebla, PUE',
        role: 'Desarrolladora de Software Trainee / Becaria',
        dates: 'Enero 2024 - Diciembre 2024',
        bullets: [
          'Colaboró en el desarrollo de componentes modulares en React y corrección de estilos CSS responsivos.',
          'Escribió scripts en Python para la limpieza básica de datos y validación de formatos en hojas de cálculo.',
          'Participó en ceremonias Scrum de planificación, sprints semanales y revisión de pull requests.'
        ]
      }
    ],
    projects: [
      {
        title: 'PORTAL ESTUDIANTIL DE RECURSOS',
        technologies: 'JavaScript, HTML5, CSS3, Firebase',
        bullets: [
          'Aplicación web para intercambio de apuntes y recursos académicos con autenticación y subida de archivos.',
          'Diseño intuitivo y responsive para dispositivos móviles y de escritorio.'
        ]
      }
    ]
  }
];

const outputDirRoot = path.join(__dirname, 'cvs_prueba');
const outputDirPublic = path.join(__dirname, 'frontend', 'public', 'cvs_prueba');

if (!fs.existsSync(outputDirRoot)) {
  fs.mkdirSync(outputDirRoot, { recursive: true });
}
if (!fs.existsSync(outputDirPublic)) {
  fs.mkdirSync(outputDirPublic, { recursive: true });
}

console.log('Generating sample candidate PDFs...');
for (const cand of candidates) {
  const rootPath = path.join(outputDirRoot, cand.fileName);
  const publicPath = path.join(outputDirPublic, cand.fileName);

  createResumePDF(cand, rootPath);
  createResumePDF(cand, publicPath);

  const stats = fs.statSync(rootPath);
  console.log(`✓ ${cand.fileName} (${stats.size} bytes)`);
}
console.log('All candidate PDFs generated successfully in:');
console.log('  -> ' + outputDirRoot);
console.log('  -> ' + outputDirPublic);
