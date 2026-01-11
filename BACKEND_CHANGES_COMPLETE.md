# Backend Changes Complete ✅

## Changes Made

### 1. Database Schema
- Added `user_id` column to appointments table (nullable foreign key)
- Relationship: User ↔ Appointments (one-to-many)

### 2. Files Modified

#### Models
- `backend/src/features/appointments/models.py`
  - Added `user_id` field with ForeignKey to users table
  - Added `user` Relationship back to User model

- `backend/src/features/accounts/models.py`
  - Added `appointments` Relationship to Appointment model

#### Security
- `backend/src/core/security.py`
  - Added `get_current_user_optional()` function for optional authentication

#### Service Layer
- `backend/src/features/appointments/service.py`
  - Updated `create_appointment()` to accept optional `user_id` parameter
  - Added `get_user_appointments()` method

#### Repository Layer
- `backend/src/features/appointments/repository.py`
  - Added `get_by_user()` method to query appointments by user_id

#### API Routes
- `backend/src/features/appointments/router.py`
  - Updated `/create` endpoint to use `get_current_user_optional` (associates appointment with user if logged in)
  - Added `/my-appointments` endpoint (requires authentication, returns user's appointments only)

### 3. Migration Created
- File: `backend/alembic/versions/add_user_id_to_appointments.py`
- Adds `user_id` column to appointments table
- Creates foreign key constraint

## Deployment Steps

### On Your Server (37.60.240.194)

1. **Stop containers**
   ```bash
   cd /path/to/home_care_project
   docker compose -f docker-compose.prod.yml down
   ```

2. **Pull latest code**
   ```bash
   git pull origin prod1  # or your branch name
   ```

3. **Start containers**
   ```bash
   docker compose -f docker-compose.prod.yml up -d
   ```

4. **Run migration**
   ```bash
   docker compose -f docker-compose.prod.yml exec backend alembic upgrade head
   ```

5. **Verify**
   ```bash
   docker compose -f docker-compose.prod.yml logs backend
   ```

### Testing the New Endpoints

1. **Create appointment without login** (should work, user_id will be NULL):
   ```bash
   curl -X POST http://37.60.240.194/api/v1/appointments/create \
     -H "Content-Type: application/json" \
     -d '{
       "full_name": "Test User",
       "email": "test@example.com",
       "phone": "1234567890",
       "appointment_date": "2026-02-01",
       "appointment_time": "10:00:00",
       "service_type": "Home Care",
       "notes": "Test appointment"
     }'
   ```

2. **Create appointment with login** (should associate with user):
   - First login to get cookie
   - Then create appointment (user_id will be set automatically)

3. **Get my appointments** (requires authentication):
   ```bash
   curl http://37.60.240.194/api/v1/appointments/my-appointments \
     --cookie "access_token=Bearer_YOUR_TOKEN_HERE"
   ```

## API Endpoints Summary

### Public Endpoints (No Auth Required)
- `POST /api/v1/appointments/create` - Create appointment (optional auth - if logged in, associates with user)
- `GET /api/v1/appointments/all` - Get all appointments (admin use)
- `GET /api/v1/appointments/by-date/{date}` - Get appointments by date
- `GET /api/v1/appointments/by-status/{status}` - Get appointments by status

### Protected Endpoints (Auth Required)
- `GET /api/v1/appointments/my-appointments` - Get current user's appointments only

### Admin Endpoints
- `PATCH /api/v1/appointments/update/{id}` - Update appointment
- `DELETE /api/v1/appointments/delete/{id}` - Delete appointment

## Database Schema After Migration

```sql
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,  -- NEW FIELD
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    notes VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending',
    location GEOMETRY(POINT, 4326),
    location_address VARCHAR(300),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## Next: Frontend Implementation

The backend is now ready to:
1. Accept anonymous appointments (user_id = NULL)
2. Accept authenticated appointments (user_id = logged_in_user.id)
3. Return user-specific appointments via `/my-appointments`

Frontend needs to:
1. Check if user is logged in before booking
2. Show login prompt if not authenticated
3. Fetch and display user's appointments on their dashboard
4. Add modals for better UX
5. Improve mobile responsiveness
