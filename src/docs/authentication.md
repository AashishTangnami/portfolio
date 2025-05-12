# Authentication System

This project uses a secure, database-based authentication system for the admin panel. All authentication is handled through the database, with no hardcoded credentials.

## How It Works

1. Users are stored in the database (PostgreSQL) using the Prisma ORM
2. Passwords are securely hashed using bcrypt
3. JWT tokens are used for session management
4. All authentication routes verify credentials against the database

## Setting Up Authentication

### Environment Variables

Make sure to set these environment variables in your `.env` file:

```
# Database connection
DATABASE_URL="postgresql://admin:password@localhost:5433/portfolio"

# JWT configuration (generate secure random strings for production)
JWT_SECRET="your-secure-random-string-at-least-32-chars"
JWT_EXPIRES_IN="7d"
```

### Creating Admin Users

There are two ways to create admin users:

#### 1. Using the Seed Script

Run the following command to create a default admin user:

```bash
npm run seed
```

This will create a user with:
- Email: admin@example.com
- Password: password123
- Role: admin

#### 2. Creating a Custom User

To create a custom user with your own credentials:

```bash
npm run create-user your@email.com yourpassword "Your Name" admin
```

Or directly:

```bash
node src/scripts/create-custom-user.js your@email.com yourpassword "Your Name" admin
```

### Testing Authentication

You can test if a user's password is correct using:

```bash
node src/scripts/test-password.js your@email.com yourpassword
```

## Security Notes

1. Always use strong, unique passwords for admin accounts
2. In production, ensure JWT_SECRET is a secure random string
3. Never commit your .env file to version control
4. The system is designed to work with multiple admin users
5. User management is available in the admin panel

## Troubleshooting

If you're having issues logging in:

1. Make sure the database is running (check docker-compose)
2. Verify the user exists in the database
3. Check that the password is correct
4. Ensure JWT_SECRET is set in your environment
5. Clear browser cookies and session storage if needed
