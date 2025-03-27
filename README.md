# Watchlist

Create and share playlists of your favorite videos!

Supports YouTube and Reddit

### Running

Make sure to set your enviroment variables by copying `apps/api/.env.sample` to `apps/api/.env`, and filling them out.

Start the test and development databases with:

```sh
docker-compose -f docker-compose-dev.yml up -d
```

Then, start the backend and frontend with

```sh
npx turbo run dev
```

 - The backend will be available at http://localhost:3000
 - The frontend will be available at http://localhost:5173
