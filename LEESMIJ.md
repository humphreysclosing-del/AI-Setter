# Setter Studio op Netlify zetten

Deze map bevat:
- `index.html`: de complete app in één bestand
- `netlify/functions/claude.mjs`: de server-functie die de AI aanroept (je API-sleutel blijft geheim)
- `netlify.toml`: instellingen voor Netlify

## Stap 1: Anthropic API-sleutel
1. Ga naar console.anthropic.com en maak een account.
2. Zet een betaalmethode erin en stel bij **Limits** een maandlimiet in.
3. Ga naar **API Keys** → **Create Key** en kopieer de sleutel (begint met `sk-ant-`). Bewaar hem veilig en deel hem met niemand.

## Stap 2: Node.js installeren (eenmalig)
Download en installeer de LTS-versie via nodejs.org.

## Stap 3: Deployen met de Netlify CLI
Let op: slepen naar Netlify Drop werkt NIET, want dan wordt de AI-functie niet meegenomen.

Open een terminal in deze map (`netlify-deploy`) en voer uit:

```
npx netlify-cli login
npx netlify-cli init
```
Kies "Create & configure a new site", kies je team en geef de site een naam.

## Stap 4: API-sleutel in Netlify zetten
```
npx netlify-cli env:set ANTHROPIC_API_KEY sk-ant-JOUW-SLEUTEL
```
(Of via het Netlify-dashboard: Site configuration → Environment variables → Add variable.)

## Stap 5: Live zetten
```
npx netlify-cli deploy --prod
```
Je krijgt een link zoals `https://jouw-site.netlify.app`. Klaar.

## Stap 6: Testen
Open de link op je telefoon en desktop, start een sessie en controleer of de lead antwoordt.
Werkt de AI niet? Kijk in het Netlify-dashboard bij **Logs → Functions → claude**.

## Later bijwerken
Nieuwe versie van `index.html` in deze map zetten en opnieuw `npx netlify-cli deploy --prod` draaien.

## Belangrijk: wat deze versie wel en niet is
Wel: de volledige app, met echte AI-gesprekken en beoordelingen, op telefoon en desktop.
Niet (nog):
- Geen logins: iedereen met de link kan de app gebruiken en kost je AI-tegoed. Deel de link dus alleen met je eigen studenten en houd de maandlimiet laag.
- Sessies worden niet opgeslagen: ze staan alleen in de browser zolang het tabblad open is.
- Samen oefenen is nog gesimuleerd: de AI speelt de medestudent.
- PDF's gaan via "Opslaan als PDF" in de browser; studenten sturen ze zelf naar jou.

Voor logins, opgeslagen sessies en een trainersoverzicht is de volgende stap een database (bijv. Supabase).
