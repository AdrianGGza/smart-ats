from google import genai
from app.models.schemas import AnalisisCVCantidato

async def procesar_cv_gemini(texto: str):
    client = genai.Client()
    
    instruccion = f"Analiza el siguiente CV y extrae los datos solicitados:\n\n{texto}"

    interaction = client.interactions.create(
        model='gemini-2.5-pro',
        input=instruccion,
        response_format={
            "type": "text",
            "mime_type": "application/json", 
            "schema": AnalisisCVCantidato.model_json_schema()
        }
    )

    if not interaction.output_text:
        raise ValueError('"La API de Gemini no devolvió texto (posible bloqueo de seguridad o error de red).')
    
    return AnalisisCVCantidato.model_validate_json(interaction.output_text)