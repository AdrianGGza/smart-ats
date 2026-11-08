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
    try:
        diccionario_limpio = datos.model_dump()
        
        # Ajustado para buscar 'name' en lugar de 'nombre'
        nombre_cv = diccionario_limpio.get('name') 
        tiene_vector = "SÍ" if diccionario_limpio.get('embedding') else "NO (Es nulo)"
        
        print(f"\nIntentando guardar a: {nombre_cv} | Contiene vector: {tiene_vector}")
        
        response = supabase.table('candidatos').insert(diccionario_limpio).execute()
        
        # Usamos .get() de forma segura por si la base de datos devuelve una estructura distinta
        nombre_guardado = response.data[0].get('name', 'Registro guardado')
        print(f"✅ Éxito al guardar en Supabase: {nombre_guardado}\n")
        
        return response
        
    except Exception as e:
        print(f"\n🚨 ERROR CRÍTICO AL GUARDAR EN SUPABASE ")
        print(f"Detalle del error: {str(e)}\n")
        raise e

def buscar_similares_supabase(vector_busqueda : list[float], limite : int, umbral : float):
    try:
        respuesta = supabase.rpc(
            "buscar_candidatos_similares",
            {
                "vector_busqueda": vector_busqueda,
                "limite_resultados": limite,
                "umbral_similitud": umbral
            }
        ).execute()
        return respuesta.data
    except Exception as e:
        print(f"\nError al buscar en supabase")
        print(f'Detalle: {str(e)}\n')
        raise e
