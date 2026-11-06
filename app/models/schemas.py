from pydantic import BaseModel,Field

class PeticionCV(BaseModel):
    criterios_vacante : str | None
    texto_cv: str

class AnalisisCVCandidato(BaseModel):
    name: str = Field(description='Nombre del candidato')
    experiencia_years : int = Field(description= 'Años de experiencia del candidato')
    habilidades_tecnicas : list[str] = Field(description= 'Habilidades tecnicas del candidato')
    match_score : float = Field(
        ge=0.0,
        le=100,
        description= 'Compatibilidad del empleado con el puesto')