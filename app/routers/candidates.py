from fastapi import APIRouter, HTTPException    
from app.models.schemas import CVInput
from app.services.ia_services import procesar_cv_gemini
from app.services.db_service import guardar_candidato

router = APIRouter()


@router.post('/analizar-cv')
async def analizar_cv(candidato : CVInput):
    try:
        resultado = await procesar_cv_gemini(candidato.texto_cv)
        guardar_candidato(resultado)
        return resultado
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))