# 🚀 Smart ATS - AI-Powered Applicant Tracking System

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Polars](https://img.shields.io/badge/Polars-000000?style=for-the-badge&logo=polars&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)

Un Sistema Inteligente de Seguimiento de Candidatos (ATS) diseñado para analizar, extraer y evaluar perfiles de talento utilizando Inteligencia Artificial. La plataforma ingiere currículums individuales en texto plano o procesa masivamente archivos CSV en memoria RAM, calculando un `match_score` para identificar a los mejores perfiles de manera asíncrona.

---

## 🌍 Demo en Vivo
- **Frontend (UI):** [https://smart-ats-ashen.vercel.app](https://smart-ats-ashen.vercel.app)
- **Backend (API Docs):** [https://smart-ats-0c5l.onrender.com/docs](https://smart-ats-0c5l.onrender.com/docs)

---

## 🏗️ Arquitectura y Stack Tecnológico

El proyecto está dividido en un ecosistema Full-Stack distribuido:

*   **Frontend:** React, Vite, TailwindCSS (Desplegado en **Vercel**).
*   **Backend:** Python 3, FastAPI, Pydantic (Desplegado en **Render**).
*   **Ingeniería de Datos:** Polars (Procesamiento y filtrado ultrarrápido en RAM sin operaciones I/O de disco).
*   **Inteligencia Artificial:** Google Gemini SDK (Análisis Semántico y Extracción Estructurada).
*   **Base de Datos:** Supabase / PostgreSQL (Persistencia de finalistas).

---

## ✨ Características Principales

1.  **Evaluación Individual:** Análisis semántico de CVs en texto plano, extrayendo años de experiencia, skills técnicos y calculando compatibilidad.
2.  **Procesamiento por Lotes (Batch):** Subida de archivos `.csv` pesados. El motor utiliza `Polars` para cargar en memoria, filtrar candidatos por experiencia y orquestar llamadas a la IA únicamente para los perfiles viables.
3.  **Validación Estricta:** Implementación de esquemas restrictivos con `Pydantic` para garantizar la integridad de las respuestas del LLM (ej. obligando a que el `match_score` sea un entero entre 0 y 100).
4.  **CORS & Seguridad:** Comunicación asíncrona segura entre dominios implementando políticas de orígenes cruzados (CORS).

---

## 🛠️ Instalación y Ejecución Local

Si deseas correr este proyecto en tu entorno local, sigue estos pasos:

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
GEMINI_API_KEY=tu_api_key_de_google_ai_studio
```

Inicia el motor de Python:
```bash
uvicorn app.main:app --reload
```
*La API estará disponible en `http://localhost:8000`*

### 3. Configurar el Frontend (React)
```bash
# Abrir una nueva terminal y navegar a la carpeta frontend
cd frontend

# Instalar dependencias de Node
npm install

# Iniciar el entorno de desarrollo
npm run dev
```
*El panel de usuario estará disponible en `http://localhost:5173`*

---

## 📡 Endpoints de la API

*   `POST /analizar-cv`: Recibe un JSON con el texto del currículum, interactúa con la IA y guarda el registro en Supabase.
*   `POST /procesar-batch`: Endpoint tipo `multipart/form-data` para recibir un archivo CSV. Lo decodifica en memoria mediante `io.BytesIO` y filtra mediante DataFrames de Polars.

---

> Desarrollado con visión de arquitectura de software y metodologías ágiles.
