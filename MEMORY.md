# Contexto del Proyecto: Smart ATS

## Estado Actual
El backend está 100% finalizado, validado y funcional. Estamos en la fase de desarrollo del frontend.

## Stack Tecnológico Backend
- Python 3.x
- FastAPI (Framework web asíncrono)
- Polars (Procesamiento de datos en memoria / dataframes)
- Supabase (PostgreSQL - RLS temporalmente desactivado)
- Pydantic (Validación estricta de esquemas)
- Google Gemini SDK (gemini-1.5-flash / gemini-flash-lite)

## Endpoints Disponibles (API Local: http://localhost:8000)

### 1. POST `/analizar-cv`
- **Recibe:** JSON `{ "texto_cv": "string" }`
- **Acción:** Envía el texto a la IA, valida la respuesta con Pydantic, guarda en Supabase.
- **Devuelve:** JSON con el análisis detallado del candidato (nombre, experiencia, score, etc.).

### 2. POST `/procesar-batch`
- **Recibe:** `UploadFile` (multipart/form-data) esperando un archivo `.csv`.
- **Acción:** 
  1. Lee el archivo CSV directamente a memoria RAM usando `io.BytesIO`.
  2. Filtra a los candidatos usando Polars (`pl.col('experiencia_years') >= 2`).
  3. Itera sobre los finalistas, llamando a la IA y guardando en Supabase por cada uno.
- **Devuelve:** Un arreglo (lista) de objetos JSON con los resultados de todos los finalistas procesados.