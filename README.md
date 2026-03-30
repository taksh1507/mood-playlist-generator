# 🎵 Music Mood DJ

AI-powered playlist generator. Upload tracks, describe your mood, get a personalized playlist with 3-6 curated songs.

## Features

- Upload music (MP3/WAV) via API
- AI playlist generation using OpenRouter LLM
- Top tracks statistics with Redis caching (60s TTL)
- Browser playback with sequential player
- MongoDB for tracks + playlists + selection count
- In-memory cache fallback if Redis unavailable

## Tech Stack

**Backend**: Node.js • Express • MongoDB • Redis • OpenRouter API  
**Frontend**: Next.js 14 • React • Tailwind CSS

## Project Structure

```
backend/
  server.js              # Express app
  controllers/           # Track, Mix, Stats logic
  services/              # LLM & Cache
  models/                # Track, Playlist schemas
  routes/                # API endpoints
  middleware/            # Upload, errors
  uploads/               # Audio files

frontend/
  app/page.jsx           # Home (upload + generate)
  app/playlists/         # Playlist store
  app/top-tracks/        # Stats page
  components/            # UI parts
  lib/api.js             # API calls
```

## Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Set: OPENROUTER_API_KEY, MONGO_URI, REDIS_URL, PORT=5000
npm start  # http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev  # http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tracks/upload` | Upload audio file |
| GET | `/tracks` | List all tracks |
| POST | `/mix/generate` | Generate playlist by mood |
| GET | `/mix/all` | Get all playlists (paginated) |
| GET | `/mix/:id` | Get specific playlist |
| GET | `/stats/top-tracks` | Top 10 tracks (cached 60s) |

## Database Schema

**Track**
```javascript
{
  title: String,
  file_url: String,
  uploaded_at: Date,
  selected_count: Number
}
```

**Playlist**
```javascript
{
  mood_prompt: String,
  tracks_ordered: [ObjectId],
  created_at: Date
}
```

## Caching Strategy

- **Key**: `top_tracks`
- **TTL**: 60 seconds
- **Priority**: Redis → In-Memory → MongoDB
- **Response**: Includes `source: "cache" | "database"`

## LLM Integration

1. Fetch all tracks from DB
2. Build prompt: mood + track titles
3. LLM returns JSON with selected tracks
4. Match titles (case-insensitive)
5. Save playlist & increment selected_count

## Environment Variables

```
OPENROUTER_API_KEY=your_key
MONGO_URI=mongodb://localhost:27017/music_mood_dj
REDIS_URL=redis://localhost:6379
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Deployment

- **Backend**: Vercel / Railway / Render
- **Frontend**: Vercel
- **DB**: MongoDB Atlas (free)
- **Cache**: Redis Cloud (optional)

## Error Codes

- **400**: Invalid input, file type, missing mood
- **404**: Playlist not found
- **500**: DB/LLM/Cache error

## Testing Flow

1. Upload 3-5 audio files
2. Generate playlist with mood
3. Play tracks sequentially
4. Check top tracks endpoint
5. Verify cache source toggle

## Troubleshooting

**MongoDB won't connect**: Ensure mongod is running or use MongoDB Atlas  
**Redis unavailable**: App falls back to in-memory cache  
**LLM errors**: Check OPENROUTER_API_KEY in .env  
**Upload fails**: Verify file is MP3/WAV and under 50MB  

## Key Features Implemented

✅ Track upload with metadata  
✅ AI playlist generation (3-6 tracks)  
✅ Playlist storage with mood tracking  
✅ Selection count per track  
✅ Top tracks with caching  
✅ Browser playback  
✅ Responsive UI  
✅ Error handling  
✅ Pagination support  
✅ Cache strategy  

---
