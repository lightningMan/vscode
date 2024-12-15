from pydantic import BaseModel

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class ColorBase(BaseModel):
    hex_value: str
    name: str | None = None

class ColorCollectionBase(BaseModel):
    name: str
    tags: list[str] = []
    colors: list[str] = []

class ColorCollectionCreate(ColorCollectionBase):
    pass

class ColorCollectionUpdate(ColorCollectionBase):
    pass

class ColorCollection(ColorCollectionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
