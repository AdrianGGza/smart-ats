from pydantic import BaseModel,Field

class PeticionCV(BaseModel):
    criterios_vacante : str | None
    texto_cv: str

class AnalisisCVCandidato(BaseModel):
    name: str = Field(description='Nombre del candidato')
    experiencia_years : int = Field(description= 'Años de experiencia del candidato')
    habilidades_tecnicas : list[str] = Field(description= 'Habilidades tecnicas del candidato')
    email : str = Field(description= 'Correo electronico del candidato')
    match_score : float = Field(
        ge=0.0,
        le=100,
        description= 'Compatibilidad del empleado con el puesto')
    embedding : list[float] | None = None

class BusquedaSemantica(BaseModel):
    consulta : str = Field(description= 'El texto de busqueda del reclutador')
    limite_resultados : int = Field(description= 'Cuantos perfiles devolver como maximo')
    umbral_similitud : float = Field(default=0.4, description= 'Que tan estrictos seremos con el match (0 a 1)')