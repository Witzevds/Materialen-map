# Deployment Guide - Materialen Kaart

Deze app is gebouwd met React + Vite en Supabase. Er zijn verschillende opties om te hosten:

## 🚀 Optie 1: Netlify (Aanbevolen - Gratis)

### Stap 1: Maak een Netlify account
1. Ga naar [netlify.com](https://www.netlify.com)
2. Maak een gratis account aan

### Stap 2: Deploy via Git
1. Push je code naar GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/jouw-username/materialen-kaart.git
git push -u origin main
```

2. In Netlify:
   - Klik "Add new site" → "Import an existing project"
   - Kies GitHub en selecteer je repository
   - Build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Klik "Deploy site"

### Stap 3: Environment Variables toevoegen
1. Ga naar Site settings → Environment variables
2. Voeg toe:
   - `VITE_SUPABASE_URL` = je Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = je Supabase anon key

3. Redeploy de site

✅ **Klaar!** Je app is nu live op een Netlify URL (bijv. `your-app.netlify.app`)

---

## 🔥 Optie 2: Vercel (Ook Gratis)

### Stap 1: Maak een Vercel account
1. Ga naar [vercel.com](https://vercel.com)
2. Maak een gratis account aan

### Stap 2: Deploy
1. Push je code naar GitHub (zie Optie 1)
2. In Vercel:
   - Klik "Add New..." → "Project"
   - Import je GitHub repository
   - Framework Preset: **Vite**
   - Build settings automatisch gedetecteerd
   - Voeg Environment Variables toe:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Klik "Deploy"

✅ **Klaar!** Live op `your-app.vercel.app`

---

## 🌐 Optie 3: Cloudflare Pages (Gratis)

### Via Git
1. Push naar GitHub
2. Ga naar [Cloudflare Pages](https://pages.cloudflare.com)
3. Klik "Create a project"
4. Selecteer je repository
5. Build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output**: `dist`
6. Voeg environment variables toe
7. Deploy!

---

## 📦 Optie 4: Handmatige Deploy (Eigen Server)

### Stap 1: Build lokaal
```bash
npm run build
```

Dit maakt een `dist` folder met alle productie bestanden.

### Stap 2: Upload naar server
Upload de inhoud van de `dist` folder naar je webserver (via FTP, SSH, etc.)

### Stap 3: Nginx configuratie (voorbeeld)
```nginx
server {
    listen 80;
    server_name jouw-domein.com;
    root /var/www/materialen-kaart/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 🔑 Environment Variables Setup

Voor **alle** deployment opties heb je deze variabelen nodig:

### Supabase Credentials ophalen:
1. Ga naar je [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecteer je project
3. Ga naar Settings → API
4. Kopieer:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`

### Lokaal testen met environment variables:
Maak een `.env` bestand:
```env
VITE_SUPABASE_URL=https://jouw-project.supabase.co
VITE_SUPABASE_ANON_KEY=jouw-anon-key
```

⚠️ **LET OP**: Voeg `.env` toe aan `.gitignore` zodat credentials niet in Git komen!

---

## 📱 Custom Domain (Optioneel)

### Netlify/Vercel:
1. Ga naar Domain settings in je dashboard
2. Voeg je custom domain toe (bijv. `materialen.jouwbedrijf.be`)
3. Volg de DNS instructies om je domain te wijzen naar de hosting
4. SSL certificaat wordt automatisch gegenereerd! 🔒

---

## ✅ Checklist voor Go-Live

- [ ] Build succesvol gemaakt (`npm run build`)
- [ ] Environment variables ingesteld
- [ ] Supabase project is live (niet in development mode)
- [ ] Database policies zijn correct ingesteld
- [ ] App getest in production mode
- [ ] Custom domain geconfigureerd (optioneel)
- [ ] SSL certificaat actief

---

## 🆘 Troubleshooting

### "Blank page na deploy"
- Check browser console voor errors
- Controleer of environment variables correct zijn ingesteld
- Zorg dat Supabase URL en key kloppen

### "404 bij page refresh"
- Configureer je hosting voor SPA routing
- Netlify/Vercel doen dit automatisch
- Bij eigen server: gebruik de nginx config hierboven

### "Database errors"
- Check Supabase Row Level Security policies
- Zorg dat authentication goed werkt
- Controleer of de database schema klopt

---

## 🎉 Succes met deployen!

Bij vragen of problemen, check de documentatie van je hosting provider of neem contact op.
