from pydantic import BaseModel,Field

class CVInput(BaseModel):
    texto_cv: str

class AnalisisCVCantidato(BaseModel):
    name: str = Field(description='Nombre del candidato')
    experiencia_years : int = Field(description= 'Años de experiencia del candidato')
    habilidades_tecnicas : list[str] = Field(description= 'Habilidades tecnicas del candidato')
    match_score : float = Field(description= 'Compatibilidad del empleado con el puesto')