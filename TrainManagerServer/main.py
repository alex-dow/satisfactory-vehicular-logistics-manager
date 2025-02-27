from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from tmserver.api.projects import router as projects_router
from tmserver.api.session import router as session_router
from tmserver.api.trainStations import router as train_stations_router
from tmserver.api.users import router as users_router
from tmserver.db.tables import init_db
from tmserver.exc import InvalidTokenError
app = FastAPI(root_path="/api")


@app.exception_handler(InvalidTokenError)
async def http_invalid_token_error(request, exc):
    return PlainTextResponse("Token expired", status_code=401)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost","http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(projects_router)
app.include_router(session_router)
app.include_router(train_stations_router)
app.include_router(users_router)
