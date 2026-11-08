from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.models.schemas import PeticionCV
from app.services.ia_services import procesar_cv_gemini, generar_embedding
from app.services.db_service import guardar_candidato
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
async def procesar_pdf(files : List[UploadFile] = File(...), criterios_vacante : str | None = Form(default=None))  :
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

        print("Texto estraido del pdf")
        print(texto_extraido[:250])
        try:
            resultado = await procesar_cv_gemini(texto_extraido,criterios_vacante)
            vector_cv = await generar_embedding(texto_extraido)
            resultado.embedding = vector_cv
            guardar_candidato(resultado)                                                
            resultados_batch.append(resultado)
        except Exception as e:
            raise HTTPException(status_code=500,detail=str(e))

    return resultados_batch 