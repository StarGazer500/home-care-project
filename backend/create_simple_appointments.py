"""
Simple script to create test appointments using raw SQL.
"""
import asyncio
from datetime import date, time, datetime, timedelta
from sqlalchemy import text
from src.core.database import engine
import random

# Sample data
FIRST_NAMES = [
    "John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa",
    "William", "Mary", "James", "Jennifer", "Richard", "Linda", "Joseph", "Elizabeth",
    "Thomas", "Susan", "Christopher", "Jessica", "Daniel", "Margaret", "Matthew", "Karen",
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
]

SERVICE_TYPES = [
    "Personal Care",
    "Nursing Care",
    "Physiotherapy",
    "Occupational Therapy",
    "Meal Preparation",
    "Medication Management",
    "Companionship",
    "Transportation"
]

STATUSES = ["pending", "confirmed", "cancelled", "completed"]

SAMPLE_LOCATIONS = [
    (5.6037, -0.1870),
    (5.6205, -0.1689),
    (5.6546, -0.1965),
    (5.5893, -0.2312),
    (5.6472, -0.0858),
]

def generate_random_phone():
    prefixes = ["024", "054", "055", "027", "057"]
    return f"{random.choice(prefixes)}{random.randint(1000000, 9999999)}"

def generate_random_location():
    base_lat, base_lng = random.choice(SAMPLE_LOCATIONS)
    lat_offset = random.uniform(-0.05, 0.05)
    lng_offset = random.uniform(-0.05, 0.05)
    return f"POINT({base_lng + lng_offset} {base_lat + lat_offset})"

async def create_appointments(user_id: int, count: int = 300):
    """Create appointments using raw SQL."""
    print(f"Creating {count} appointments for user ID: {user_id}...")

    async with engine.begin() as conn:
        start_date = date.today()

        for i in range(count):
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            full_name = f"{first_name} {last_name}"
            email = f"{first_name.lower()}.{last_name.lower()}{i}@example.com"
            phone = generate_random_phone()

            days_offset = random.randint(0, 60)
            appointment_date = start_date + timedelta(days=days_offset)

            hour = random.randint(8, 18)
            minute = random.choice([0, 15, 30, 45])
            appointment_time = time(hour=hour, minute=minute)

            service_type = random.choice(SERVICE_TYPES)
            status = random.choice(STATUSES)
            location = generate_random_location()

            notes_options = [
                "First time client",
                "Requires wheelchair access",
                "Prefers morning appointments",
                "Regular weekly service",
                None,
            ]
            notes = random.choice(notes_options)

            location_address = f"{random.randint(1, 500)} {random.choice(['Main', 'High', 'King'])} St, Accra"

            query = text("""
                INSERT INTO appointments
                (user_id, full_name, email, phone, appointment_date, appointment_time,
                 service_type, notes, status, location, location_address, created_at, updated_at)
                VALUES
                (:user_id, :full_name, :email, :phone, :appointment_date, :appointment_time,
                 :service_type, :notes, :status, ST_GeomFromText(:location, 4326), :location_address, :created_at, :updated_at)
            """)

            await conn.execute(query, {
                'user_id': user_id,
                'full_name': full_name,
                'email': email,
                'phone': phone,
                'appointment_date': appointment_date,
                'appointment_time': appointment_time,
                'service_type': service_type,
                'notes': notes,
                'status': status,
                'location': location,
                'location_address': location_address,
                'created_at': datetime.now(),
                'updated_at': datetime.now()
            })

            if (i + 1) % 50 == 0:
                print(f"Created {i + 1}/{count} appointments...")

    print(f"✓ Successfully created {count} appointments!")

if __name__ == "__main__":
    import sys

    if len(sys.argv) < 2:
        print("Usage: python create_simple_appointments.py <user_id> [count]")
        print("Example: python create_simple_appointments.py 5 300")
        sys.exit(1)

    user_id = int(sys.argv[1])
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 300

    asyncio.run(create_appointments(user_id, count))
