from fastapi import FastAPI, File
from fastapi.middleware.cors import CORSMiddleware
from app.routers import candidates

app =FastAPI(title= "Smart ATS API")
origenes_permitidos = [
    "*"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origenes_permitidos,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router)