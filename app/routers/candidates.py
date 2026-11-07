from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.models.schemas import PeticionCV
from app.services.ia_services import procesar_cv_gemini
from app.services.db_service import guardar_candidato
import io
import polars as pl
from PyPDF2 import  PdfReader

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
async def procesar_pdf(files : list[UploadFile], criterios_vacante : str | None = Form(default=None))  :
    resultados_batch = []

    for file in files:
        if file.content_type != 'application/pdf':
            raise HTTPException(status_code=400, detail="El archivo debe ser un PDF válido") 

        
        contenido_bytes = await file.read()
        pdf_virtual = io.BytesIO(contenido_bytes)
        lector = PdfReader(pdf_virtual)
        
        texto_extraido = ''
        for pagina in lector.pages:
            texto_extraido+=pagina.extract_text() + "\n"
        try:
            resultado = await procesar_cv_gemini(texto_extraido,criterios_vacante)
            guardar_candidato(resultado)                                                
            resultados_batch.append(resultado)
            return resultado
        except Exception as e:
            raise HTTPException(status_code=500,detail=str(e))

        return resultado 




    