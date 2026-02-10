# Canvas LMS integration setup

Users can connect their Canvas account and sync assignments as tasks. Each **school** (Canvas instance) must be registered in the app before users can connect.

## Adding a Canvas institution (school)

### 1. School admin: create a Developer Key in Canvas

1. In Canvas, go to **Admin** → **Developer Keys** (or **Settings** → **Developer Keys** for the account).
2. Create a new Developer Key (API key type).
3. Set the **Redirect URI** to your app’s callback URL, for example:
   - Production: `https://your-app.vercel.app/api/canvas/callback`
   - Local: `http://localhost:3000/api/canvas/callback`
4. Enable the key and copy the **Client ID** and **Client Secret**.

### 2. Add the institution to the app

**Option A: Environment variables + seed (one school)**

Set in `.env` (or Vercel env vars):

- `CANVAS_BASE_URL` – Canvas base URL (e.g. `https://canvas.school.edu`)
- `CANVAS_CLIENT_ID` – from the Developer Key
- `CANVAS_CLIENT_SECRET` – from the Developer Key
- `CANVAS_INSTITUTION_NAME` – display name (e.g. `My University`)

Then run:

```bash
npx prisma db seed
```

This creates or updates one Canvas institution. To add more schools, use Option B or add more env vars and run the seed again (only one institution is supported via env; for multiple, use Prisma Studio or an admin API).

**Option B: Prisma Studio (any number of schools)**

1. Run `npx prisma studio`.
2. Open the **CanvasInstitution** model.
3. Add a row with: **baseUrl**, **name**, **clientId**, **clientSecret** (and **id** is auto-generated).

**Option C: Custom admin API**

Implement a protected route (e.g. `POST /api/admin/canvas-institutions`) that creates a `CanvasInstitution` row. Restrict access to admins only.

## Redirect URI

The redirect URI must match exactly what the app sends (including protocol and path). The app uses the request origin, so:

- Production: `https://<your-domain>/api/canvas/callback`
- Local: `http://localhost:3000/api/canvas/callback`

Add each environment’s URI in the Canvas Developer Key if users will sign in from both.
