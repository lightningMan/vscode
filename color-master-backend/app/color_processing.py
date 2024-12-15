from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.database import get_db

router = APIRouter()

@router.post("/collections", response_model=schemas.ColorCollection)
def create_color_collection(
    collection: schemas.ColorCollectionCreate,
    db: Session = Depends(get_db)
):
    db_collection = models.ColorCollection(**collection.dict())
    db.add(db_collection)
    db.commit()
    db.refresh(db_collection)
    return db_collection

@router.get("/collections", response_model=list[schemas.ColorCollection])
def get_color_collections(db: Session = Depends(get_db)):
    return db.query(models.ColorCollection).all()

@router.get("/collections/{collection_id}", response_model=schemas.ColorCollection)
def get_color_collection(collection_id: int, db: Session = Depends(get_db)):
    db_collection = db.query(models.ColorCollection).filter(models.ColorCollection.id == collection_id).first()
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Color collection not found")
    return db_collection

@router.delete("/collections/{collection_id}")
def delete_color_collection(collection_id: int, db: Session = Depends(get_db)):
    db_collection = db.query(models.ColorCollection).filter(models.ColorCollection.id == collection_id).first()
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Color collection not found")
    db.delete(db_collection)
    db.commit()
    return {"message": "Color collection deleted"}

@router.put("/collections/{collection_id}", response_model=schemas.ColorCollection)
def update_color_collection(
    collection_id: int,
    collection: schemas.ColorCollectionUpdate,
    db: Session = Depends(get_db)
):
    db_collection = db.query(models.ColorCollection).filter(models.ColorCollection.id == collection_id).first()
    if db_collection is None:
        raise HTTPException(status_code=404, detail="Color collection not found")

    for key, value in collection.dict(exclude_unset=True).items():
        setattr(db_collection, key, value)

    db.commit()
    db.refresh(db_collection)
    return db_collection
