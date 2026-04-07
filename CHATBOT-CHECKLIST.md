# Kira Chatbot - Checklist Best Practice

## GDPR & Legal

- [x] Consent screen obbligatorio con checkbox prima della chat
- [x] Link alla Privacy Policy nel consent screen
- [x] Avviso monitoraggio conversazioni nel consent screen
- [x] Privacy Policy aggiornata (EN + IT) con sezioni:
  - Dati raccolti dal chatbot
  - Finalita (qualificazione lead + monitoraggio sicurezza)
  - Base giuridica: consenso esplicito Art. 6(1)(a) per chat, legittimo interesse Art. 6(1)(f) per log
  - Retention: 24h in memoria + 30 giorni log
  - Trasferimento extra-UE (Anthropic USA)
  - Session ID disclosure
  - Diritto alla cancellazione
- [x] DPA Anthropic: automaticamente incluso nei Commercial Terms of Service
  - Testo completo: https://www.anthropic.com/legal/data-processing-addendum
  - Info: https://support.anthropic.com/en/articles/7996862
- [x] DPIA (Data Protection Impact Assessment) - documento in `legal/DPIA.md`
- [x] Transfer Impact Assessment (TIA) per trasferimento UE-USA via Anthropic - documento in `legal/TIA.md`

## EU AI Act Compliance

- [x] Avviso AI visibile: "Stai parlando con un assistente AI, non con una persona"
- [x] Strategia di logging documentata - documento in `legal/LOGGING-STRATEGY.md`
- [x] Classificazione rischio AI Act: rischio limitato (Art. 52) - documentato in LOGGING-STRATEGY.md

## Sicurezza

- [x] Security headers (CSP frame-ancestors, X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, HSTS)
- [x] Rate limiting (20 req/min per IP)
- [x] Input validation (max 2000 char, tipo obbligatorio)
- [x] Anti-bot: honeypot (campo nascosto)
- [x] Anti-bot: timing check (min 2s dal caricamento)
- [x] Sanitizzazione HTML output (escape prima del rendering bold)
- [x] iframe embedding limitato a keryxdesign.com (CSP frame-ancestors)
- [ ] Cloudflare Turnstile (CAPTCHA GDPR-friendly) - upgrade opzionale

## Data Management

- [x] TTL 24h conversazioni in memoria con cleanup automatico ogni ora
- [x] Endpoint DELETE per cancellazione dati utente
- [x] Bottone "Cancella i miei dati" nel frontend
- [x] Log persistenti su file JSONL giornalieri
- [x] Session ID troncato a 8 char nei log (anonimizzazione)
- [x] Endpoint admin protetto da ADMIN_KEY per lettura conversazioni attive
- [x] Endpoint admin per storico log per data
- [x] Persistenza log su Railway: Railway Volume montato su `/app/logs`

## UX & Conversazione

- [x] Messaggio di benvenuto con quick actions
- [x] Quick actions scompaiono al click
- [x] Bubble separate per paragrafo con delay proporzionale alla lunghezza (simula scrittura umana)
- [x] Typing indicator tra le bubble
- [x] Auto-resize textarea
- [x] Enter per inviare, Shift+Enter per newline
- [x] Rendering **grassetto** nelle bubble
- [x] Messaggio errore user-friendly in caso di problemi API

## i18n

- [x] Lingua UI basata su navigator.language (IT/EN)
- [x] Consent screen tradotto
- [x] Quick actions tradotti
- [x] Welcome message tradotto
- [x] Avviso AI tradotto
- [x] Placeholder, bottoni, messaggi errore tradotti
- [x] Lingua browser passata al server per il system prompt
- [x] Kira si adatta alla lingua in cui scrive l'utente

## System Prompt

- [x] Personalita: professionale, diretto, competente, non freddo
- [x] Conciso: 1-3 frasi per messaggio
- [x] Formattazione: solo **grassetto**, no corsivo/elenchi/heading/emoji
- [x] Educazione DRD: spiega i due pilastri (leggibilita + superamento difese)
- [x] MAI inventare prezzi
- [x] MAI dare consigli di marketing specifici
- [x] MAI ripresentarsi dopo il primo messaggio
- [x] Guardrail off-topic
- [x] Flusso profilazione: una info alla volta
- [x] Riepilogo con conferma prima dell'invio

## Servizi dichiarati

- [x] DRD cartaceo (sales letter, magalog, cartoline, packaging)
- [x] Libri per imprenditori (InDesign/InCopy, revisioni illimitate)
- [x] Logo / Visual Hammer
- [x] Web design a risposta diretta
- [ ] ~~Ads design~~ (rimosso per ora)

## Deploy & Infra

- [x] GitHub repo: KeryxDesign/kira-bot
- [x] Railway: progetto "giving-connection", servizio "kira-bot"
- [x] Deploy automatico su push a main
- [x] Env vars: ANTHROPIC_API_KEY, ADMIN_KEY
- [x] Widget flottante su keryxdesign.com (KiraWidget.astro)
- [x] Teaser contestuali per pagina (appaiono dopo 8s)
- [x] iframe lazy-loaded al primo click
- [x] Mobile: chat fullscreen

## Credenziali & Accessi

- ADMIN_KEY: abb5b3d063ea6ec8662a5da4921fa912
- Railway token: kira-bot-deploy (****-14d9)
- URL live: https://kira-bot-production-2a99.up.railway.app
- Admin conversazioni attive: GET /api/admin/conversations
- Admin storico log: GET /api/admin/logs/YYYY-MM-DD
