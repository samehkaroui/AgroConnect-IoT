# Fix Firebase Permission Denied Errors

## Problem
Your application is getting "permission_denied" errors when trying to write to Firebase Realtime Database paths like `/gasData`. This happens because Firebase has restrictive security rules by default.

## Quick Solution (Development)

### Step 1: Update Firebase Security Rules
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `iot-sys-532f6`
3. Navigate to **Realtime Database** → **Rules**
4. Replace the current rules with:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

5. Click **Publish**

### Step 2: Alternative - Use Firebase CLI (Recommended)
If you have Firebase CLI installed:

```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init database

# Deploy the rules
firebase deploy --only database
```

## Production Solution (Secure Rules)

For production, use the rules from `database.rules.production.json`:

```json
{
  "rules": {
    "sensorData": {
      ".read": true,
      ".write": true,
      ".validate": "newData.hasChildren(['temperature', 'humidity', 'airQuality', 'lightLevel', 'birdCount', 'activityLevel', 'timestamp'])"
    },
    "gasData": {
      ".read": true,
      ".write": true,
      ".validate": "newData.hasChildren(['co', 'co2', 'nh3', 'h2s', 'timestamp'])"
    },
    "equipment": {
      ".read": true,
      ".write": true,
      "$equipmentId": {
        ".validate": "newData.hasChildren(['name', 'type', 'status', 'power'])"
      }
    },
    "alerts": {
      ".read": true,
      ".write": true,
      "$alertId": {
        ".validate": "newData.hasChildren(['type', 'message', 'timestamp', 'building'])"
      }
    }
  }
}
```

## Verification

After updating the rules:

1. Refresh your application
2. Check the browser console - the permission denied errors should stop
3. Your sensor simulation should start working properly
4. Data should appear in your dashboard

## Security Notes

⚠️ **Warning**: The development rules (`".read": true, ".write": true`) allow anyone to read/write your database. Only use this for development.

✅ **For Production**: Use the production rules which validate data structure and can be extended with authentication requirements.

## Next Steps

1. **Immediate**: Apply the development rules to fix the current errors
2. **Later**: Implement Firebase Authentication for user management
3. **Production**: Use the secure rules with proper authentication

## Troubleshooting

If you still get errors after updating rules:
1. Wait 1-2 minutes for rules to propagate
2. Clear browser cache and refresh
3. Check Firebase Console → Database → Data to see if writes are working
4. Verify your Firebase config in `src/lib/firebase.ts` matches your project
