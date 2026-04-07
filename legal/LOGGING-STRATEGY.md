# Strategia di Logging - Chatbot Kira
## Documento di conformita EU AI Act

**Titolare:** Keryx Design - Davide Filippini
**Data:** 7 aprile 2026
**Versione:** 1.0

---

## 1. Cosa viene loggato

### 1.1 Per ogni messaggio
- **Timestamp:** data e ora in formato ISO 8601 (UTC)
- **Session ID:** troncato a 8 caratteri (anonimizzato)
- **Ruolo:** "user" o "assistant"
- **Contenuto:** testo del messaggio
- **Lingua:** lingua rilevata del browser

### 1.2 Cosa NON viene loggato
- Indirizzo IP dell'utente
- User agent / informazioni browser
- System prompt
- Risposte di errore API
- Metadati della richiesta HTTP

## 2. Formato e storage

### 2.1 Formato
File JSONL (JSON Lines), un file per giorno con naming convention: `YYYY-MM-DD.jsonl`

Esempio di entry:
```json
{"timestamp":"2026-04-07T10:30:00.000Z","sessionId":"a1b2c3d4","role":"user","content":"Mi interessa il DRD cartaceo","lang":"italiano"}
```

### 2.2 Storage
- **Posizione:** `/app/logs/` su Railway (volume persistente)
- **Persistenza:** i file sopravvivono ai deploy grazie al Railway Volume
- **Backup:** nessun backup automatico (volume singolo)

## 3. Retention

| Tipo di log | Retention | Motivazione |
|-------------|-----------|-------------|
| Log conversazioni (file JSONL) | 30 giorni | Monitoraggio sicurezza e prevenzione abusi |
| Conversazioni in memoria | 24 ore | Funzionamento chat (contesto conversazione) |

### 3.1 Pulizia
- I file di log oltre i 30 giorni devono essere cancellati manualmente
- Le conversazioni in memoria vengono eliminate automaticamente ogni ora (cleanup scheduled)

## 4. Accesso

### 4.1 Chi puo accedere
Solo il titolare del trattamento (Davide Filippini) tramite:
- Endpoint API protetto da ADMIN_KEY
- Accesso diretto al filesystem Railway (via dashboard)

### 4.2 Endpoint di accesso
- `GET /api/admin/conversations` - conversazioni attive in memoria
- `GET /api/admin/logs/YYYY-MM-DD` - storico log per data
- Autenticazione: header `Authorization: Bearer [ADMIN_KEY]`

### 4.3 Nessun accesso automatizzato
I log non vengono processati automaticamente da sistemi di analytics, alerting o machine learning. La consultazione e esclusivamente manuale e occasionale.

## 5. Finalita del logging

1. **Sicurezza:** identificare tentativi di abuso, injection, o utilizzo improprio del chatbot
2. **Qualita del servizio:** verificare che le risposte del chatbot siano accurate e conformi al system prompt
3. **Compliance:** dimostrare la conformita al GDPR e all'EU AI Act in caso di richieste dell'autorita di controllo

## 6. Base giuridica

Legittimo interesse del titolare (Art. 6(1)(f) GDPR) per:
- Sicurezza dei sistemi informativi
- Prevenzione abusi
- Conformita normativa

Dichiarato nella Privacy Policy (sezioni IT e EN) e nel consent screen del chatbot.

## 7. Classificazione EU AI Act

Il chatbot Kira rientra nella categoria **rischio limitato** (Art. 52 del Regolamento UE 2024/1689):
- E un sistema AI che interagisce con persone fisiche
- Obbligo di trasparenza: soddisfatto tramite avviso visibile "Stai parlando con un assistente AI"
- Non effettua decisioni automatizzate con effetti giuridici
- Non tratta dati biometrici o categorie particolari
- Non rientra nelle categorie ad alto rischio (Allegato III)

---

**Firma:** Davide Filippini
**Data:** 7 aprile 2026
**Prossima revisione:** 7 aprile 2027
