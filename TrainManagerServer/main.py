from typing import Annotated
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from tmserver.api.projects import router as projects_router
from tmserver.api.session import router as session_router
from tmserver.api.users import router as users_router
from tmserver.db.tables import init_db, init_first_user
from tmserver.exc import InvalidTokenError
from tmserver.settings import Settings, get_settings
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
async def on_startup():
    # get_settings.cache_clear()
    init_db()
    init_first_user()

app.include_router(projects_router)
app.include_router(session_router)
app.include_router(users_router)
