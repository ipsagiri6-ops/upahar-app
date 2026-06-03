from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

class RegisterUser(BaseModel):
    full_name: str
    email: str
    phone: str

class LoginUser(BaseModel):
    email: str

class Order(BaseModel):
    user_email: str
    recipient_name: str
    occasion: str
    budget: str
    gift_name: str
    gift_price: str
    order_id: str

@app.post("/register")
def register(user: RegisterUser):
    result = supabase.table("users").insert(user.dict()).execute()
    return {"message": "Registered successfully", "data": result.data}

@app.post("/login")
def login(user: LoginUser):
    result = supabase.table("users").select("*").eq("email", user.email).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "Login successful", "user": result.data[0]}

@app.post("/order")
def place_order(order: Order):
    result = supabase.table("orders").insert(order.dict()).execute()
    return {"message": "Order placed", "data": result.data}

@app.get("/orders/{email}")
def get_orders(email: str):
    result = supabase.table("orders").select("*").eq("user_email", email).execute()
    return result.data