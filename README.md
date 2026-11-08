# 🚀 Smart ATS - AI-Powered Applicant Tracking System (RAG Architecture)

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/pgvector-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=minutemailer&logoColor=white)

Un Sistema Inteligente de Seguimiento de Candidatos (ATS) de grado empresarial diseñado para procesar, evaluar y encontrar talento utilizando Inteligencia Artificial y bases de datos vectoriales. 

La plataforma es capaz de extraer texto de documentos PDF, evaluar candidatos contra criterios específicos utilizando modelos generativos, convertirlos en representaciones espaciales (embeddings) para búsquedas semánticas y automatizar la comunicación con el talento.

---

## 🌍 Demo en Vivo
- **Frontend (UI):** [https://smart-ats-ashen.vercel.app](https://smart-ats-ashen.vercel.app)
- **Backend (API Docs):** [https://smart-ats-0c5l.onrender.com/docs](https://smart-ats-0c5l.onrender.com/docs)

---

## 🏗️ Arquitectura y Stack Tecnológico

El proyecto opera bajo un ecosistema Full-Stack distribuido y asíncrono:

*   **Frontend:** React, Vite, TailwindCSS (Desplegado en **Vercel**).
*   **Backend:** Python 3, FastAPI, Pydantic (Desplegado en **Render**).
*   **IA Generativa & Embeddings:** Google Gemini SDK (`gemini-3.5-flash-lite` para evaluación y `gemini-embedding-001` para vectorización de 3072 dimensiones).
*   **Base de Datos & RAG:** Supabase / PostgreSQL con la extensión `pgvector` y funciones RPC para cálculo de similitud espacial.
*   **Procesamiento de Documentos:** `pdfplumber` para extracción robusta de texto con codificación UTF-8.
*   **Comunicaciones:** `Resend` API operando en `BackgroundTasks` para notificaciones sin bloqueo de I/O.
*   **Data Engineering:** `Polars` para procesamiento y filtrado ultrarrápido en memoria RAM de lotes CSV.

---

## ✨ Características Principales

1.  **Motor RAG y Búsqueda Semántica:** Los perfiles son convertidos a vectores matemáticos. Los reclutadores pueden buscar talento usando lenguaje natural (ej. *"alguien que sepa de despliegues en la nube y Python"*), y el motor SQL calcula la distancia espacial para devolver los mejores resultados, superando los filtros tradicionales de palabras clave.
2.  **Extracción y Evaluación de PDFs:** Lectura profunda de currículums en formato PDF superando problemas clásicos de codificación (acentos/ñ), seguido de un análisis estructurado contra los criterios de la vacante.
3.  **Notificaciones Automatizadas Asíncronas:** El sistema detecta el `match_score` y, en segundo plano (Background Tasks), decide si enviar un correo de aceptación o rechazo automático al candidato a través de Resend, manteniendo tiempos de respuesta de milisegundos en la UI.
4.  **Procesamiento Masivo (Batch):** Ingesta de archivos `.csv` pesados. El motor carga los datos en memoria con `Polars`, aplica filtros previos (ej. +2 años de experiencia) y orquesta llamadas a la IA únicamente para los perfiles viables.
5.  **Validación Estricta de IA:** Uso de esquemas restrictivos con `Pydantic` para obligar al LLM a devolver estructuras JSON precisas y predecibles.

---

## 🛠️ Instalación y Ejecución Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/smart-ats.git
cd smart-ats
```

### 2. Configurar el Backend (FastAPI)
```bash
# Navegar a la raíz del proyecto backend
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate

# Instalar dependencias estrictas
pip install -r requirements.txt
```

Crea un archivo `.env` en la raíz del backend con las siguientes variables:
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_key_publica_de_supabase
GEMINI_API_KEY=tu_api_key_de_google
RESEND_API_KEY=tu_api_key_de_resend
```

Inicia el servidor backend:
```bash
uvicorn app.main:app --reload
```
*La API y la documentación interactiva (Swagger) estarán disponibles en `http://localhost:8000/docs`*

### 3. Configurar el Frontend (React)
```bash
# Abrir una nueva terminal y navegar a la carpeta frontend
cd frontend

# Instalar dependencias de Node
npm install
```

Crea un archivo `.env.local` en la carpeta frontend:
```env
VITE_API_URL=http://localhost:8000
```

Inicia el entorno de desarrollo:
```bash
npm run dev
```
*El panel de usuario estará disponible en `http://localhost:5173`*

---

## 📡 Endpoints Principales de la API

*   `POST /analizar-pdf`: Recibe documentos PDF (multipart), extrae el texto, genera la evaluación JSON, crea el vector de 3072 dimensiones, guarda en pgvector y detona correos en segundo plano.
*   `POST /buscar-candidatos`: Recibe una consulta en lenguaje natural, la vectoriza y ejecuta un RPC en Supabase para devolver los perfiles más afines por distancia semántica.
*   `POST /procesar-batch`: Endpoint para recibir un archivo CSV, decodificarlo en memoria (`io.BytesIO`) y procesar perfiles en masa mediante DataFrames de Polars.

---

> Construido con visión de escalabilidad empresarial, arquitecturas limpias y operaciones asíncronas.
