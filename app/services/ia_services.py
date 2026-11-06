from google import genai
import os
from app.models.schemas import AnalisisCVCandidato
from dotenv import load_dotenv


load_dotenv()

async def procesar_cv_gemini(texto: str):
    client = genai.Client(api_key=os.environ.get('GEMINI_API_KEY'))
    
    instruccion = f"Analiza el siguiente CV y extrae los datos solicitados:\n\n{texto}"

    interaction = client.interactions.create(
        model= 'gemini-3.5-flash-lite',
        input=instruccion,
        response_format={
            "type": "text",
            "mime_type": "application/json", 
            "schema": AnalisisCVCandidato.model_json_schema()
        }
    )

    if not interaction.output_text:
        raise ValueError('"La API de Gemini no devolvió texto (posible bloqueo de seguridad o error de red).')
    
    return AnalisisCVCandidato.model_validate_json(interaction.output_text)