from fastapi import APIRouter

from src.api.routes.image import router as image_router
from src.api.routes.ocr import router as ocr_router

router = APIRouter()

router.include_router(
    image_router,
    prefix="/image",
    tags=["Image AI"],
)

router.include_router(
    ocr_router,
    prefix="/ocr",
    tags=["OCR"],
)