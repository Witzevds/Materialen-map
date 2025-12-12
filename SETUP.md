# Materialen Kaart - Setup Instructies

## 🚀 Supabase Setup

### 1. Maak een Supabase project aan
1. Ga naar [https://supabase.com](https://supabase.com)
2. Maak een gratis account aan
3. Klik op "New Project"
4. Kies een naam, database wachtwoord en regio
5. Wacht tot het project is aangemaakt (~2 minuten)

### 2. Creëer de database tabel
1. Ga naar de SQL Editor in je Supabase dashboard
2. Voer deze SQL query uit:

```sql
-- Maak de leveranciers tabel aan
CREATE TABLE leveranciers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  naam TEXT NOT NULL,
  adres TEXT NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  website TEXT,
  contactpersoon TEXT,
  email TEXT,
  telefoon TEXT,
  status TEXT CHECK (status IN ('deal', 'antwoord', 'geen-antwoord')) NOT NULL,
  type_materiaal TEXT,
  notities TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leveranciers ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users kunnen alles doen
CREATE POLICY "Authenticated users can do everything"
ON leveranciers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
```

### 3. Maak een admin gebruiker aan
1. Ga naar Authentication > Users in Supabase dashboard
2. Klik op "Add user" > "Create new user"
3. Vul in:
   - Email: `admin@materialen.local` (of je eigen email)
   - Password: [kies een sterk wachtwoord]
   - Auto Confirm User: **JA** (vink aan!)
4. Klik op "Create user"

### 4. Krijg je API credentials
1. Ga naar Settings > API in je Supabase project
2. Kopieer de volgende waarden:
   - **Project URL** (bijvoorbeeld: `https://xxxxx.supabase.co`)
   - **anon public** key (lange string)

### 5. Configureer je lokale environment
1. Open `.env.local` in deze project folder
2. Vervang de placeholder waarden:
   ```env
   VITE_SUPABASE_URL=https://jouwproject.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Sla het bestand op

### 6. Start de applicatie
```bash
npm run dev
```

### 7. Login
- Open http://localhost:5173
- Login met de credentials die je hebt aangemaakt in stap 3

## 🗺️ Test Data (Optioneel)

Je kan deze SQL query gebruiken om wat test data toe te voegen:

```sql
INSERT INTO leveranciers (naam, adres, lat, lng, website, contactpersoon, email, telefoon, status, type_materiaal, notities)
VALUES 
  ('Houthandel Janssen', 'Industrieweg 12, 9000 Gent', 51.0543, 3.7174, 'https://example.com', 'Jan Janssens', 'jan@example.com', '+32 9 123 45 67', 'deal', 'Hout', 'Goede prijzen en snelle levering'),
  ('Steenhandel De Vries', 'Kapelstraat 45, 2000 Antwerpen', 51.2194, 4.4025, 'https://example2.com', 'Piet de Vries', 'piet@example.com', '+32 3 234 56 78', 'antwoord', 'Steen', 'Wachten op offerte'),
  ('Metaal Import BV', 'Havenweg 89, 8000 Brugge', 51.2093, 3.2247, 'https://example3.com', 'Marie Dubois', 'marie@example.com', '+32 50 345 67 89', 'geen-antwoord', 'Metaal', 'Geen reactie na 2 weken');
```

## 🚢 Deployment (Vercel)

1. Push je code naar GitHub
2. Ga naar [vercel.com](https://vercel.com)
3. Importeer je GitHub repository
4. Voeg Environment Variables toe:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

## ⚠️ Troubleshooting

**"Invalid API key"**
- Check of je `.env.local` bestand correct is ingevuld
- Restart de dev server (`npm run dev`)

**"Auth session missing"**
- Zorg dat je gebruiker in Supabase "Auto Confirm" heeft staan
- Check of Row Level Security policies correct zijn

**Markers verschijnen niet op de kaart**
- Check of er data in de `leveranciers` tabel staat
- Open de browser console voor errors
