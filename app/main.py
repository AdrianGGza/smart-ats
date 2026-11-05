from fastapi import FastAPI
from app.routers import candidates

app =FastAPI(title= "Smart ATS API")

app.include_router(candidates.router,prefix='/api/v1')