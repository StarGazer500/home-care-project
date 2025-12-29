# Create Admin User Guide

Since you need an admin user to access the admin dashboard, here's how to create one:

## Password Requirements
⚠️ **Important Password Rules:**
- Minimum 8 characters
- At least one uppercase letter
- At least one digit
- Example valid password: `Admin123`

## Option 1: Using cURL (Command Line) ✅ RECOMMENDED

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@bridgehoito.fi",
    "username": "admin",
    "password": "Admin123",
    "full_name": "Admin User",
    "role": "admin"
  }'
```

## Option 2: Using Python Script

Create a file called `create_admin.py`:

```python
import requests

url = "http://localhost:8000/api/v1/auth/register"
data = {
    "email": "admin@bridgehoito.fi",
    "username": "admin",
    "password": "Admin123",
    "full_name": "Admin User",
    "role": "admin"
}

response = requests.post(url, json=data)
print(response.json())
```

Then run:
```bash
python create_admin.py
```

## Option 3: Using Postman or Insomnia

1. Create a new POST request
2. URL: `http://localhost:8000/api/v1/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (JSON):
```json
{
  "email": "admin@bridgehoito.fi",
  "username": "admin",
  "password": "Admin123",
  "full_name": "Admin User",
  "role": "admin"
}
```

## Required Fields Explained

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| email | ✅ Yes | Valid email address | admin@bridgehoito.fi |
| username | ✅ Yes | 3-50 characters | admin |
| password | ✅ Yes | 8+ chars, 1 uppercase, 1 digit | Admin123 |
| full_name | ❌ No | User's display name | Admin User |
| role | ✅ Yes* | User role (user/doctor/admin) | admin |
| phone | ❌ No | Phone number | +358123456789 |

*Note: `role` might default to "user" if not specified. Make sure to include it as "admin".

## Default Admin Credentials (After Creation)

**For Login Page:**
- **Email:** admin@bridgehoito.fi
- **Username:** admin
- **Password:** Admin123

**You can login with EITHER email OR username** - both work!

**Important:** Change the password after first login!

## Testing the Login

1. Make sure both backend and frontend servers are running
   ```bash
   # Backend
   cd backend && make run

   # Frontend (in another terminal)
   cd frontend && npm run dev
   ```

2. Go to `http://localhost:5173/login`

3. Enter credentials:
   - Email: `admin@bridgehoito.fi` (or username: `admin`)
   - Password: `Admin123`

4. Click "Sign In"

5. You should be redirected to the admin dashboard at `/admin`

## Common Errors and Solutions

### Error: "Field required" for username
**Problem:** Missing `username` field in request
**Solution:** Add `"username": "admin"` to your request body

### Error: "Password must contain at least one uppercase letter"
**Problem:** Password doesn't meet requirements
**Solution:** Use a password like `Admin123` with uppercase and digits

### Error: "Password must contain at least one digit"
**Problem:** Password has no numbers
**Solution:** Add numbers to password (e.g., `Admin123`)

### Error: "Email already exists"
**Problem:** User with this email already registered
**Solution:** Either use a different email, or delete the existing user from the database

### Error: 422 Unprocessable Entity
**Problem:** Invalid data format or missing required fields
**Solution:** Check that all required fields are present and correctly formatted

## Checking if Admin User Exists

You can check if the admin user was created by querying the database:

```sql
SELECT id, email, username, role, created_at
FROM users
WHERE email = 'admin@bridgehoito.fi';
```

Or check all users:
```sql
SELECT id, email, username, role
FROM users
ORDER BY created_at DESC;
```

## Deleting and Recreating Admin User

If you need to start over:

```sql
DELETE FROM users WHERE email = 'admin@bridgehoito.fi';
```

Then run the registration command again.

## Backend Registration Endpoint

The registration endpoint is located at:
- **URL:** `POST /api/v1/auth/register`
- **Content-Type:** `application/json`
- **Response:** Returns user object with id, email, username, role, created_at

## Login Flow

After creating the admin user:

1. Frontend sends login request to `/api/v1/auth/login`
2. Backend validates credentials
3. Backend sets HTTP-only cookie with session token
4. Frontend redirects to `/admin` dashboard
5. All subsequent requests include the session cookie

## Troubleshooting

### Registration fails
- ✅ Check if backend is running on `http://localhost:8000`
- ✅ Verify the auth registration endpoint exists
- ✅ Check backend logs for detailed errors
- ✅ Email or username might already exist in database
- ✅ Password doesn't meet requirements

### Can't login after creating user
- ✅ Verify the user was created in the database
- ✅ Check the user's role is set to "admin" (not "user")
- ✅ Try clearing browser cookies and cache
- ✅ Check backend authentication logs
- ✅ Verify you're using the correct email/password

### 401 Unauthorized Error
- ✅ Check that credentials are correct
- ✅ Verify session cookies are being set
- ✅ Check CORS configuration allows credentials

### Redirected to login after accessing /admin
- ✅ Make sure you're logged in
- ✅ Check that session cookie is valid
- ✅ Verify user has `role: "admin"`

## Success Response Example

When registration is successful, you should see:

```json
{
  "id": 1,
  "email": "admin@bridgehoito.fi",
  "username": "admin",
  "full_name": "Admin User",
  "role": "admin",
  "created_at": "2025-12-29T10:30:00.000Z"
}
```

## Next Steps

After creating the admin user:
1. ✅ Login at `http://localhost:5173/login`
2. ✅ Access admin dashboard at `http://localhost:5173/admin`
3. ✅ View contact submissions at `http://localhost:5173/admin/contacts`
4. ✅ Test the contact form on homepage
5. ✅ Change the default password for security
