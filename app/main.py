from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import candidates

app = FastAPI(title="Smart ATS API")

origenes_permitidos = [
    "http://localhost:5173",
    "https://smart-ats-ashen.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origenes_permitidos,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router)