# Application Routes Guide

## Available Routes

### Public Routes (No Login Required)

1. **Homepage** - `http://localhost:5173/`
   - Landing page with all sections
   - Contact form to submit inquiries
   - Services, pricing, testimonials

2. **Login** - `http://localhost:5173/login`
   - Admin login page
   - Enter email and password to access admin dashboard

3. **404 Page** - Any invalid URL
   - Shows when you visit a route that doesn't exist
   - Example: `http://localhost:5173/contacts` (wrong - should be `/admin/contacts`)
   - Provides helpful links to correct pages

### Protected Routes (Login Required - Admin Only)

These routes require you to be logged in with an admin account:

1. **Admin Dashboard** - `http://localhost:5173/admin`
   - Overview of contact statistics
   - Recent contact submissions
   - Quick action links

2. **Contacts List** - `http://localhost:5173/admin/contacts`
   - View all contact submissions
   - Search contacts by name
   - Delete contacts
   - Click to view details

3. **Contact Details** - `http://localhost:5173/admin/contacts/:id`
   - View full contact information
   - Edit contact details
   - Update and save changes
   - Example: `http://localhost:5173/admin/contacts/1`

## Important Notes

### Route Structure
- **Public routes**: `/` and `/login`
- **Admin routes**: All start with `/admin`
- **NOT** `/contacts` - this is incorrect
- **USE** `/admin/contacts` - this is correct

### Access Control
- If you try to access admin routes without logging in, you'll be redirected to `/login`
- If you're logged in but not an admin, you'll be redirected to homepage
- 401 errors in console during initial page load are normal (it's checking if you're logged in)

### Console Errors Explained
When you visit the site, you might see:
```
Failed to load resource: the server responded with a status of 401 (Unauthorized)
:8000/api/v1/auth/me:1
```

**This is normal!** The app checks if you're logged in on every page load. If you're not logged in, it gets a 401 error, which is expected behavior. This error doesn't break anything.

## Common Mistakes

❌ **Wrong**: `http://localhost:5173/contacts`
✅ **Correct**: `http://localhost:5173/admin/contacts`

❌ **Wrong**: Accessing `/admin/contacts` without logging in
✅ **Correct**: Login first at `/login`, then access `/admin/contacts`

## Navigation Flow

### For Admin Users
1. Visit `http://localhost:5173/login`
2. Enter admin credentials
3. You're redirected to `http://localhost:5173/admin` (dashboard)
4. Click "Contacts" in the navigation
5. Now you're at `http://localhost:5173/admin/contacts`

### For Public Users
1. Visit `http://localhost:5173/`
2. Scroll to contact section
3. Fill out and submit form
4. Done!

## Testing the Routes

### Test Public Access
```bash
# Homepage - Should work
http://localhost:5173/

# Login page - Should work
http://localhost:5173/login

# Invalid route - Should show 404 page
http://localhost:5173/contacts
http://localhost:5173/random-page
```

### Test Protected Routes (Must Login First)
```bash
# Admin dashboard - Redirects to /login if not authenticated
http://localhost:5173/admin

# Contacts list - Redirects to /login if not authenticated
http://localhost:5173/admin/contacts

# Contact detail - Redirects to /login if not authenticated
http://localhost:5173/admin/contacts/1
```

## URL Parameters

### Contact Detail Route
The contact detail route uses a URL parameter for the ID:
- Pattern: `/admin/contacts/:id`
- Example: `/admin/contacts/1` (shows contact with ID 1)
- Example: `/admin/contacts/42` (shows contact with ID 42)

The `:id` is dynamic and changes based on which contact you're viewing.

## Bookmarking

You can bookmark:
- ✅ Homepage: `http://localhost:5173/`
- ✅ Login: `http://localhost:5173/login`
- ✅ Admin Dashboard: `http://localhost:5173/admin` (will ask you to login if session expired)
- ✅ Contacts List: `http://localhost:5173/admin/contacts` (will ask you to login if session expired)

## Browser Back Button

The back button works correctly:
- From contact detail → goes back to contacts list
- From contacts list → goes back to dashboard
- From login (after logout) → goes back to homepage

## Quick Reference Table

| Route | Access | Purpose |
|-------|--------|---------|
| `/` | Public | Homepage with contact form |
| `/login` | Public | Admin login |
| `/admin` | Protected | Admin dashboard |
| `/admin/contacts` | Protected | Contact submissions list |
| `/admin/contacts/:id` | Protected | Individual contact details |
| `*` (any other) | Public | 404 Not Found page |

## Troubleshooting

### "No routes matched location" Error
- Check the URL path
- Admin routes must start with `/admin`
- Make sure you're using the correct route structure

### Redirected to Login
- You're trying to access a protected route
- Login with admin credentials first

### 401 Errors in Console
- Normal during initial auth check
- Doesn't affect functionality
- Can be safely ignored

### Route Not Working After Login
- Clear browser cache and cookies
- Make sure backend is running
- Check that your user has `role: "admin"`
