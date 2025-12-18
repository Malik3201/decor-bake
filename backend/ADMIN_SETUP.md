# Admin User Setup

## Default Admin Credentials

After running the setup script, you can login with:

- **Email:** `admin@decorbake.com`
- **Password:** `admin123`

⚠️ **IMPORTANT:** Change this password immediately after first login!

## Troubleshooting "Invalid Credentials" Error

If you're getting "Invalid credentials" error, follow these steps:

### Step 1: Verify Admin User Exists
```bash
npm run verify-admin
```
This will check if the admin user exists and verify the password.

### Step 2: Create Admin User (if it doesn't exist)
```bash
npm run create-admin
```

### Step 3: Reset Admin Password (if password is wrong)
```bash
npm run reset-admin
```
This will reset the password back to `admin123`.

### Step 4: Check Your Login Credentials
Make sure you're using:
- Email: `admin@decorbake.com` (exact, case-insensitive)
- Password: `admin123` (exact, case-sensitive)

## Creating Admin User

### Option 1: Using the Script (Recommended)

Run the following command to create an admin user:

```bash
npm run create-admin
```

This will create an admin user with:
- Email: `admin@decorbake.com`
- Password: `admin123`
- Role: `admin`

### Option 2: Manual Creation via API

1. Register a new user via the API:
```bash
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@decorbake.com",
  "password": "admin123"
}
```

2. Then manually update the user role in MongoDB:
```javascript
// In MongoDB shell or MongoDB Compass
db.users.updateOne(
  { email: "admin@decorbake.com" },
  { $set: { role: "admin" } }
)
```

### Option 3: Direct Database Update

If you already have a user account, you can update it to admin role:

```javascript
// In MongoDB shell
use decor-bake
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Security Notes

1. **Change Default Password:** Always change the default password after first login
2. **Use Strong Passwords:** Use a strong, unique password for admin accounts
3. **Limit Admin Access:** Only grant admin role to trusted users
4. **Environment Variables:** Ensure JWT secrets are strong and unique in production

## Admin Features

Once logged in as admin, you can:
- Access `/admin` dashboard
- Manage products, categories, offers, and promo codes
- View and update orders
- Update site settings
- Upload files

