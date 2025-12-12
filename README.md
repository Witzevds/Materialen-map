# 🗺️ Materialen Leveranciers Kaart

Een moderne web applicatie voor het beheren van leveranciers op een interactieve kaart van België.

![React](https://img.shields.io/badge/React-18.3-blue)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)
![Leaflet](https://img.shields.io/badge/Leaflet-Maps-brightgreen)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styling-38bdf8)

## ✨ Features

- 🔐 **Authenticatie** met Supabase
- 🗺️ **Interactieve kaart** van België met Leaflet.js
- 📍 **Gekleurde markers** (Groen = Deal, Oranje = Antwoord, Rood = Geen antwoord)
- ➕ **CRUD operaties** voor bedrijven/leveranciers
- 🔄 **Real-time updates** met Supabase subscriptions
- 🎨 **Modern UI** met TailwindCSS
- 📱 **Responsive design** (mobile-friendly)
- 🔍 **Filter functionaliteit** op status

## 🚀 Quick Start

### 1. Clone het project
```bash
git clone <your-repo-url>
cd materialen-kaart
```

### 2. Installeer dependencies
```bash
npm install
```

### 3. Setup Supabase
Volg de instructies in [SETUP.md](./SETUP.md) voor:
- Supabase project aanmaken
- Database tabel creëren
- Admin gebruiker aanmaken
- Environment variables configureren

### 4. Start development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in je browser.

## 📋 Environment Variables

Maak een `.env.local` bestand aan in de root:

```env
VITE_SUPABASE_URL=https://jouwproject.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🏗️ Tech Stack

- **Frontend**: React 18.3 + Vite
- **Backend**: Supabase (PostgreSQL + Auth)
- **Maps**: Leaflet.js + React-Leaflet
- **Styling**: TailwindCSS
- **Routing**: React Router v7
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   └── LoginForm.jsx          # Login component
│   ├── Bedrijven/
│   │   ├── BedrijfForm.jsx        # Add/Edit form modal
│   │   └── DeleteConfirmation.jsx  # Delete modal
│   ├── Layout/
│   │   ├── Navbar.jsx             # Navigation bar
│   │   └── ProtectedRoute.jsx     # Route guard
│   └── Map/
│       └── MapView.jsx            # Leaflet map component
├── hooks/
│   ├── useAuth.js                 # Authentication hook
│   └── useBedrijven.js            # CRUD operations hook
├── lib/
│   └── supabaseClient.js          # Supabase config
├── pages/
│   └── Dashboard.jsx              # Main dashboard
├── App.tsx                        # App router
└── main.tsx                       # Entry point
```

## 🎯 Gebruik

1. **Login**: Gebruik je Supabase credentials
2. **Bedrijf toevoegen**: Klik op de blauwe + knop rechtsonder
3. **Bedrijf bewerken**: Klik op een marker → "Bewerk"
4. **Bedrijf verwijderen**: Klik op een marker → "Verwijder"
5. **Filteren**: Gebruik de filter knoppen bovenaan

## 📊 Database Schema

```sql
CREATE TABLE leveranciers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  naam TEXT NOT NULL,
  adres TEXT NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  website TEXT,
  contactpersoon TEXT,
  email TEXT,
  telefoon TEXT,
  status TEXT CHECK (status IN ('deal', 'antwoord', 'geen-antwoord')),
  type_materiaal TEXT,
  notities TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚢 Deployment

### Vercel (Aanbevolen)
```bash
npm install -g vercel
vercel
```

Voeg environment variables toe in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Netlify
```bash
npm run build
# Upload dist/ folder naar Netlify
```

## 🛠️ Development

```bash
# Development server
npm run dev

# Build voor productie
npm run build

# Preview productie build
npm run preview
```

## 📝 To-Do / Roadmap

- [ ] Export naar JSON/CSV
- [ ] Import van backup
- [ ] Zoekfunctionaliteit
- [ ] List view toggle
- [ ] Bulk acties
- [ ] Notificaties

## 🤝 Contributing

Contributions zijn welkom! Open een issue of pull request.

## 📄 License

MIT

## 👨‍💻 Author

Ontwikkeld voor Mout Project - Materialen Beheer

---

**Hulp nodig?** Check [SETUP.md](./SETUP.md) voor gedetailleerde setup instructies.
