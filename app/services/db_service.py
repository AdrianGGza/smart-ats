import os
from dotenv import load_dotenv
from supabase import create_client, Client
from app.models.schemas import AnalisisCVCandidato

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    raise ValueError('Faltan las credenciales de supabase en el archivo .env')

supabase: Client = create_client(url, key)

def guardar_candidato(datos : AnalisisCVCandidato):
    diccionario_limpio = datos.model_dump()

    response = (
        supabase.table('candidatos')
        .insert(diccionario_limpio)
        .execute()
    )

    return response