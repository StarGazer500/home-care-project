"""
Script to create test appointments for martin1 user.
"""
import asyncio
from datetime import date, time, datetime, timedelta
from sqlmodel import select
from src.core.database import AsyncSessionLocal
from src.features.appointments.models import Appointment
import random

# Sample data for generating appointments
FIRST_NAMES = [
    "John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa",
    "William", "Mary", "James", "Jennifer", "Richard", "Linda", "Joseph", "Elizabeth",
    "Thomas", "Susan", "Christopher", "Jessica", "Daniel", "Margaret", "Matthew", "Karen",
    "Anthony", "Nancy", "Mark", "Betty", "Donald", "Helen", "Paul", "Sandra",
    "Steven", "Donna", "Andrew", "Carol", "Kenneth", "Ruth", "Joshua", "Sharon"
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
    "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young"
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

# Sample locations around Accra, Ghana (latitude, longitude)
SAMPLE_LOCATIONS = [
    (5.6037, -0.1870),  # Central Accra
    (5.6205, -0.1689),  # Osu
    (5.6546, -0.1965),  # Achimota
    (5.5893, -0.2312),  # Dansoman
    (5.6472, -0.0858),  # Tema
    (5.6400, -0.2600),  # Kaneshie
    (5.5700, -0.2400),  # Korle Bu
    (5.6800, -0.1500),  # Legon
]

def generate_random_phone():
    """Generate a random Ghanaian phone number."""
    prefixes = ["024", "054", "055", "027", "057", "026", "056", "050"]
    return f"{random.choice(prefixes)}{random.randint(1000000, 9999999)}"

def generate_random_location():
    """Generate a random location with slight variation from sample points."""
    base_lat, base_lng = random.choice(SAMPLE_LOCATIONS)
    # Add small random offset (roughly 0-5km)
    lat_offset = random.uniform(-0.05, 0.05)
    lng_offset = random.uniform(-0.05, 0.05)
    return f"POINT({base_lng + lng_offset} {base_lat + lat_offset})"

async def create_appointments_for_user(user_id: int, count: int = 300):
    """Create appointments for specific user."""
    print(f"Creating {count} test appointments for user ID: {user_id}...")

    async with AsyncSessionLocal() as session:
        appointments_created = 0
        start_date = date.today()

        for i in range(count):
            # Generate random data
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            full_name = f"{first_name} {last_name}"
            email = f"{first_name.lower()}.{last_name.lower()}{i}@example.com"
            phone = generate_random_phone()

            # Spread appointments over next 60 days
            days_offset = random.randint(0, 60)
            appointment_date = start_date + timedelta(days=days_offset)

            # Random time between 8 AM and 6 PM
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
                "Emergency care needed",
                None,
            ]
            notes = random.choice(notes_options)

            # Create appointment
            appointment = Appointment(
                user_id=user_id,
                full_name=full_name,
                email=email,
                phone=phone,
                appointment_date=appointment_date,
                appointment_time=appointment_time,
                service_type=service_type,
                notes=notes,
                status=status,
                location=location,
                location_address=f"{random.randint(1, 500)} {random.choice(['Main', 'High', 'King', 'Queen', 'Oxford'])} Street, Accra",
                created_at=datetime.now(),
                updated_at=datetime.now()
            )

            session.add(appointment)
            appointments_created += 1

            # Commit in batches of 50
            if appointments_created % 50 == 0:
                await session.commit()
                print(f"Created {appointments_created}/{count} appointments...")

        # Final commit for remaining appointments
        await session.commit()
        print(f"✓ Successfully created {appointments_created} test appointments!")

if __name__ == "__main__":
    import sys

    # Usage: python create_martin_appointments.py <user_id> [count]
    # Example: python create_martin_appointments.py 2 300

    if len(sys.argv) < 2:
        print("Usage: python create_martin_appointments.py <user_id> [count]")
        print("Example: python create_martin_appointments.py 2 300")
        sys.exit(1)

    user_id = int(sys.argv[1])
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 300

    asyncio.run(create_appointments_for_user(user_id, count))
