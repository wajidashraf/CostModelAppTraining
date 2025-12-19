# Local Development

To run both servers locally:

- Start backend: `npm run dev:backend`
- Start frontend: `npm run dev:frontend`

The project includes a Vite proxy so the frontend can call `/api/*` directly during local development. Alternatively, add a `.env.local` file with:

```
VITE_API_BASE=http://localhost:3001
```

This allows you to point the frontend at any backend URL if needed.
