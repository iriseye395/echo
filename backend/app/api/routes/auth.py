from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm

from app.db.session import get_db_session
from app.schemas.user import TokenResponse, UserLoginRequest, UserRegisterRequest, UserOut
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])
auth_service = AuthService()


@router.post("/register", response_model=TokenResponse)
async def register(
    payload: UserRegisterRequest,
    db: AsyncSession = Depends(get_db_session),
) -> TokenResponse:
    user = await auth_service.register(db, payload.email, payload.password)
    token, _ = await auth_service.login(db, payload.email, payload.password)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))

@router.post("/login", response_model=TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db_session),
) -> TokenResponse:
    token, user = await auth_service.login(
        db,
        form_data.username,
        form_data.password
    )

    return TokenResponse(
        access_token=token,
        user=UserOut.model_validate(user)
    )
