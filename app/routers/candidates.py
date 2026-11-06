from fastapi import APIRouter, HTTPException, UploadFile, File
from app.models.schemas import CVInput
from app.services.ia_services import procesar_cv_gemini
from app.services.db_service import guardar_candidato
import io
import polars as pl

router = APIRouter()


@router.post('/analizar-cv')
async def analizar_cv(candidato : CVInput):
    try:
        resultado = await procesar_cv_gemini(candidato.texto_cv)
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
        texto = f'Nombre del candidato:{f['nombre']}\nCV: {f['texto_cv']}'
        resultado = await procesar_cv_gemini(texto)
        resultado.name = f['nombre']
        guardar_candidato(resultado)
        resultados_batch.append(resultado)

    return resultados_batch