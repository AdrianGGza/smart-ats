from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks
from app.models.schemas import PeticionCV, BusquedaSemantica
from app.services.ia_services import procesar_cv_gemini, generar_embedding
from app.services.db_service import guardar_candidato,buscar_similares_supabase
from app.services.email_service import enviar_notificacion
import io
import polars as pl
import pdfplumber
from typing import List

router = APIRouter()

@router.post('/analizar-cv')
async def analizar_cv(candidato : PeticionCV):
    try:
        resultado = await procesar_cv_gemini(candidato.texto_cv, candidato.criterios_vacante)
        guardar_candidato(resultado)
        return resultado
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/procesar-batch")
async def procesar_batch(file : UploadFile):
    contenido_bytes = await file.read()
    archivo_virtual = io.BytesIO(contenido_bytes)
    finalistas = (
	pl.read_csv(archivo_virtual)
	.filter(pl.col('experiencia_years') >= 2).to_dicts()
)
    resultados_batch = []

    for f in finalistas:
        texto = f"Nombre del candidato:{f['nombre']}\nCV: {f['texto_cv']}"
        resultado = await procesar_cv_gemini(texto)
        resultado.name = f['nombre']
        guardar_candidato(resultado)
        resultados_batch.append(resultado)

    return resultados_batch

@router.post('/analizar-pdf')
async def procesar_pdf(background_task : BackgroundTasks, files : List[UploadFile] = File(...), criterios_vacante : str | None = Form(default=None))  :
    resultados_batch = []

    for file in files:
        if file.content_type != 'application/pdf':
            raise HTTPException(status_code=400, detail="El archivo debe ser un PDF válido") 

        
        contenido_bytes = await file.read()
        pdf_virtual = io.BytesIO(contenido_bytes)

        texto_extraido = ''
        with pdfplumber.open(pdf_virtual) as pdf:
            for pagina in pdf.pages:
                texto_extraido+=pagina.extract_text() + "\n"
        try:
            resultado = await procesar_cv_gemini(texto_extraido,criterios_vacante)
            vector_cv = await generar_embedding(texto_extraido)
            resultado.embedding = vector_cv
            guardar_candidato(resultado)

            if resultado.email and resultado.email.strip() != "":
                background_task.add_task(
                    enviar_notificacion,
                    resultado.name,
                    "adriangalvan.dev@gmail.com",
                    resultado.match_score
                )

            resultados_batch.append(resultado)
        except Exception as e:
            raise HTTPException(status_code=500,detail=str(e))

    return resultados_batch 

@router.post('/buscar-candidatos')
async def buscar_candidatos(busqueda: BusquedaSemantica):
    try:
        vector_query = await generar_embedding(busqueda.consulta)

        candidatos_compatibles = buscar_similares_supabase(
            vector_busqueda=vector_query,
            limite=busqueda.limite_resultados,
            umbral=busqueda.umbral_similitud
        )

        return candidatos_compatibles
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))