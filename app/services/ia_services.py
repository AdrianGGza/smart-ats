from google import genai
import os
from app.models.schemas import AnalisisCVCandidato
from dotenv import load_dotenv


load_dotenv()

async def procesar_cv_gemini(texto: str, criterios_vacante: str | None = None):
    client = genai.Client(api_key=os.environ.get('GEMINI_API_KEY'))

    if criterios_vacante:
        prompt = f"Analiza el siguiente CV. Calcula el match_score basándote estrictamente en qué tan bien cumple con estos requerimientos específicos: {criterios_vacante}\n\nCV:\n{texto}"
    else:
        prompt = f"Analiza el siguiente CV y extrae la información solicitada. Calcula un match_score general basándote en la solidez del perfil:\n\nCV:\n{texto}"  

    interaction = client.interactions.create(
        model= 'gemini-3.5-flash-lite',
        input=prompt,
        response_format={
            "type": "text",
            "mime_type": "application/json", 
            "schema": AnalisisCVCandidato.model_json_schema()
        }
    )

    if not interaction.output_text:
        raise ValueError('"La API de Gemini no devolvió texto (posible bloqueo de seguridad o error de red).')
    
    return AnalisisCVCandidato.model_validate_json(interaction.output_text)