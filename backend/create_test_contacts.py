"""
Script to create test contacts for pagination testing.
Run this from the backend directory: python create_test_contacts.py
"""
import asyncio
from datetime import datetime
from sqlalchemy import text
from src.core.database import engine
import random

# Sample data
FIRST_NAMES = [
    "John", "Jane", "Michael", "Sarah", "David", "Emily", "Robert", "Lisa",
    "William", "Mary", "James", "Jennifer", "Richard", "Linda", "Joseph", "Elizabeth",
    "Thomas", "Susan", "Christopher", "Jessica", "Daniel", "Margaret", "Matthew", "Karen",
    "Anthony", "Nancy", "Mark", "Betty", "Donald", "Helen"
]

LAST_NAMES = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White"
]

STATUSES = ["pending", "contacted", "cancelled"]

SERVICES = [
    "Personal Care",
    "Nursing Care",
    "Physiotherapy",
    "Occupational Therapy",
    "Meal Preparation",
    "Medication Management",
    "Companionship",
    "Transportation"
]

def generate_random_phone():
    """Generate a random Ghanaian phone number."""
    prefixes = ["024", "054", "055", "027", "057", "026", "056", "050"]
    return f"{random.choice(prefixes)}{random.randint(1000000, 9999999)}"

async def create_contacts(count: int = 300):
    """Create test contacts using raw SQL."""
    print(f"Creating {count} test contacts...")

    async with engine.begin() as conn:
        for i in range(count):
            first_name = random.choice(FIRST_NAMES)
            last_name = random.choice(LAST_NAMES)
            full_name = f"{first_name} {last_name}"
            email = f"{first_name.lower()}.{last_name.lower()}{i}@example.com"
            phone = generate_random_phone()
            status = random.choice(STATUSES)
            service_needed = random.choice(SERVICES)

            messages = [
                "Looking for home care services for elderly parent",
                "Need physiotherapy services",
                "Interested in nursing care",
                "Requesting companionship services",
                "Need help with daily activities",
                "Looking for medication management",
                "Interested in meal preparation services",
                "Would like to know more about your services",
                "Please contact me regarding home care options",
            ]
            message = random.choice(messages)

            query = text("""
                INSERT INTO client_contacts_information
                (full_name, email, phone, message, status, service_needed, created_at, updated_at)
                VALUES
                (:full_name, :email, :phone, :message, :status, :service_needed, :created_at, :updated_at)
            """)

            await conn.execute(query, {
                'full_name': full_name,
                'email': email,
                'phone': phone,
                'message': message,
                'status': status,
                'service_needed': service_needed,
                'created_at': datetime.now(),
                'updated_at': datetime.now()
            })

            if (i + 1) % 10 == 0:
                print(f"Created {i + 1}/{count} contacts...")

    print(f"✓ Successfully created {count} contacts!")

if __name__ == "__main__":
    import sys

    # Get count from command line argument if provided
    count = 300
    if len(sys.argv) > 1:
        try:
            count = int(sys.argv[1])
        except ValueError:
            print("Invalid count provided, using default 300")

    asyncio.run(create_contacts(count))
