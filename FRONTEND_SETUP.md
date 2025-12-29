# Frontend Setup and Usage Guide

## Overview
The frontend has been successfully integrated with the backend. It now includes:
- **Public Homepage** with a working contact form
- **Admin Login** page for authentication
- **Admin Dashboard** for managing contacts and administrative tasks

## Features Implemented

### 1. Public Homepage (`/`)
- Contact form that submits to the backend API
- Real-time form validation
- Success/error message display
- All original homepage sections intact (Hero, Services, Pricing, Testimonials, etc.)

### 2. Admin Login (`/login`)
- Secure login page for administrators
- Email and password authentication
- Error handling for invalid credentials
- Redirects to admin dashboard on successful login

### 3. Admin Dashboard (`/admin`)
- **Dashboard Overview** (`/admin`)
  - Statistics cards showing total contacts
  - Recent contact submissions
  - Quick action links

- **Contacts List** (`/admin/contacts`)
  - View all contact submissions in a table
  - Search contacts by name
  - Pagination support (100 records per page)
  - Delete contacts with confirmation
  - Click to view detailed information

- **Contact Details** (`/admin/contacts/:id`)
  - View full contact information
  - Edit contact details (name, email, phone, service, message)
  - Update and save changes
  - Timestamps for created/updated dates

## Technology Stack
- **React 18.3.1** - UI library
- **React Router DOM 7.11.0** - Client-side routing
- **Vite 5.4.21** - Build tool and dev server
- **Tailwind CSS 3.3** - Styling
- **Lucide React** - Icons
- **Fetch API** - HTTP requests (no axios)

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AdminLayout.jsx           # Admin dashboard layout with navigation
│   │   └── ProtectedRoute.jsx        # Route protection for admin pages
│   ├── contexts/
│   │   └── AuthContext.jsx           # Authentication state management
│   ├── pages/
│   │   ├── HomePage.jsx              # Public homepage with contact form
│   │   ├── LoginPage.jsx             # Admin login page
│   │   └── admin/
│   │       ├── DashboardPage.jsx     # Admin dashboard overview
│   │       ├── ContactsPage.jsx      # Contacts list and management
│   │       └── ContactDetailPage.jsx # Individual contact view/edit
│   ├── services/
│   │   └── api.js                    # API service using Fetch API
│   ├── App.jsx                       # Main app with routing
│   └── main.jsx                      # App entry point
```

## API Integration

### API Service (`src/services/api.js`)
All backend communication uses the Fetch API with the following endpoints:

**Client Contacts:**
- `POST /api/v1/client_contacts/create_client_contact_info/` - Create new contact
- `GET /api/v1/client_contacts/get_all_client_contact_info` - Get all contacts
- `GET /api/v1/client_contacts/get_one_client_contact_info/:id` - Get single contact
- `PATCH /api/v1/client_contacts/update_client_contact_info/:id` - Update contact
- `DELETE /api/v1/client_contacts/delete_client_contact_info/:id` - Delete contact
- `GET /api/v1/client_contacts/search_client_contact_by_name/?name=` - Search by name

**Authentication:**
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/register` - Register new user

## Running the Application

### Prerequisites
1. Backend server must be running on `http://localhost:8000`
2. Node.js installed (v18+ recommended, though v18.19.1 works)

### Start Development Server
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at: **http://localhost:5173**

### Build for Production
```bash
npm run build
npm run preview  # Preview production build
```

## Using the Application

### For Public Users (Homepage Contact Form)
1. Go to `http://localhost:5173`
2. Scroll to the "Contact" section
3. Fill out the form:
   - Full Name (required)
   - Email Address (required)
   - Phone Number (optional)
   - Service Needed (dropdown)
   - Message (optional)
4. Click "Send Message"
5. Success or error message will appear

### For Administrators

#### Login
1. Go to `http://localhost:5173/login`
2. Enter admin email and password
3. Click "Sign In"
4. You'll be redirected to `/admin` dashboard

**Note:** You'll need to create an admin user in the backend first using the registration endpoint with `role: "admin"`.

#### Dashboard
- View statistics about total contacts
- See recent contact submissions
- Quick links to manage contacts or view the website

#### Managing Contacts
1. Click "Contacts" in the navigation or "Manage Contacts" card
2. **Search:** Use the search bar to find contacts by name
3. **View:** Click the eye icon to view full contact details
4. **Edit:** On the detail page, click "Edit Contact" to modify information
5. **Delete:** Click the trash icon and confirm deletion
6. **Clear Search:** Click "Clear" to show all contacts again

## Authentication & Authorization

### Protected Routes
- All `/admin/*` routes require authentication
- Only users with `role: "admin"` can access admin pages
- Unauthenticated users are redirected to `/login`
- Non-admin authenticated users are redirected to homepage

### Session Management
- Uses HTTP-only cookies for secure session storage
- `credentials: 'include'` in all API calls
- Automatic authentication check on app load
- Logout clears session and redirects to login

## CORS Configuration
The backend must allow requests from `http://localhost:5173`:

```python
# Backend CORS settings
allowed_origins = ["http://localhost:5173"]
```

## Error Handling
- Network errors show user-friendly messages
- Form validation prevents empty submissions
- API errors display relevant error messages
- 404/401/403 errors handled gracefully

## Form Validation

### Contact Form
- Full name: Required
- Email: Required, must be valid email format
- Phone: Optional
- Service needed: Required (dropdown selection)
- Message: Optional

### Login Form
- Email: Required, valid email format
- Password: Required

## Styling
- Tailwind CSS utility classes
- Custom color scheme:
  - Navy: `#1e3a5f` (primary text)
  - Red-Pink gradient: Primary actions
  - Cyan: Accents and secondary elements
- Responsive design for mobile, tablet, and desktop
- Rounded corners (2xl, 3xl) for modern look
- Shadow effects for depth

## Known Issues
- React Router v7 requires Node.js >=20, but works with v18.19.1 (warning shown)
- 2 moderate severity vulnerabilities in dependencies (run `npm audit` for details)

## Next Steps / Future Enhancements
- Add pagination controls for contacts list
- Export contacts to CSV/Excel
- Email notifications for new contact submissions
- Advanced filtering (by date, service type)
- User management page for admins
- Dashboard analytics and charts
- Bulk operations (delete multiple contacts)

## Troubleshooting

### Frontend won't start
- Check if port 5173 is already in use
- Run `npm install` to ensure dependencies are installed

### Contact form not working
- Verify backend is running on http://localhost:8000
- Check browser console for CORS errors
- Verify API endpoints in backend are accessible

### Login fails
- Ensure you have created an admin user in the backend
- Check that the email/password are correct
- Verify backend authentication endpoints are working

### Can't access admin pages
- Make sure you're logged in
- Verify your user has `role: "admin"`
- Clear browser cookies and try logging in again

## API Response Examples

### Successful Contact Creation
```json
{
  "id": 1,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+358123456789",
  "service_needed": "Home Care Services",
  "message": "I need help with daily care for my mother",
  "created_at": "2025-12-29T10:30:00",
  "updated_at": "2025-12-29T10:30:00"
}
```

### Successful Login
```json
{
  "id": 1,
  "email": "admin@bridgehoito.fi",
  "name": "Admin User",
  "role": "admin"
}
```

## Support
For issues or questions, check the backend logs and browser console for error messages.
