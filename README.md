# RT Funds - Rajarata Technology Fund Management System

A lightweight fund management system for Rajarata University Technology 22/23 batch. Track student payments, events, and collections.

## Features

- ✅ Student payment tracking by Index Number
- ✅ Event-based fund collection
- ✅ Real-time balance updates
- ✅ Transaction history
- ✅ Public student status inquiry
- ✅ Admin authentication
- ✅ Responsive design

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Database**: Supabase (PostgreSQL) - Cloud hosted
- **Hosting**: Netlify (Static)

## Quick Start

### Option 1: Local Development (No Database)

1. Clone the repository
2. Open `index.html` in a browser
3. Uses localStorage for data storage (no setup required)

### Option 2: With Supabase (Cloud Database)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase-schema.sql`
3. Get your Project URL and anon key from Project Settings
4. Update `supabase-config.js`:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

5. Deploy to Netlify

## Deployment to Netlify

### Method 1: GitHub Integration (Recommended)

1. Push this project to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `/`
6. Click "Deploy"

### Method 2: Drag & Drop

1. Zip all project files
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag and drop the zip file

## Supabase Setup

### 1. Create Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Name it "rt-funds"
4. Set a strong database password (save this!)
5. Select a region near you
6. Wait for project to be created (~2 minutes)

### 2. Run Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `supabase-schema.sql`
4. Click **Run** to execute

This will create:
- `students` - Student records
- `events` - Fund collection events
- `transactions` - Payment records
- `media` - Gallery images
- `comments` - Feedback/comments
- `user_sessions` - Admin login sessions

### 3. Get API Keys

1. Go to **Project Settings** → **API**
2. Copy:
   - `Project URL` → paste in `supabase-config.js` as `SUPABASE_URL`
   - `anon public` key → paste in `supabase-config.js` as `SUPABASE_ANON_KEY`

### 4. Update Configuration

Edit `supabase-config.js`:

```javascript
const SUPABASE_URL = 'https://xxxxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGc...';
```

## Default Admin Credentials

After running the schema, login with:
- **Email**: admin@rtfunds.lk
- **Password**: admin123

⚠️ **Change these credentials immediately after first login!**

## Project Structure

```
rt-funds/
├── index.html          # Main application
├── index.css           # Styles
├── app.js              # Application logic
├── supabase-config.js  # Supabase credentials
├── db.js               # Database client
├── supabase-schema.sql # Database schema
├── package.json        # Dependencies
└── README.md           # This file
```

## Data Flow

```
User Action → app.js → db.js → Supabase API
                ↓
            state object (in-memory)
                ↓
            UI Update (renderApp)
```

## API Reference

The app uses Supabase client directly:

```javascript
// Read all records
await db.getAll('students');

// Read single record
await db.getById('students', id);

// Create record
await db.create('transactions', { amount: 1000 });

// Update record
await db.update('students', id, { status: 'Paid' });

// Delete record
await db.delete('students', id);
```

## Troubleshooting

### "Supabase not configured"
- Make sure `supabase-config.js` has valid URL and key
- URL should NOT contain "YOUR_"
- Key should start with "eyJ..."

### Data not saving
- Check browser console for errors
- Verify Supabase RLS policies allow operations
- Check network tab for failed API calls

### CORS errors
- Supabase doesn't have CORS issues (it's a REST API)
- If using local server, make sure it allows fetch

## License

MIT License - Rajarata Technology 22/23 Batch

## Support

For issues or questions, create an issue on GitHub or contact the batch treasurer.