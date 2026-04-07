# Data Protection Impact Assessment (DPIA)
## Chatbot Kira - Keryx Design

**Titolare del trattamento:** Keryx Design - Davide Filippini (M26525203S)
**Data:** 7 aprile 2026
**Versione:** 1.0

---

## 1. Descrizione del trattamento

### 1.1 Natura del trattamento
Il chatbot Kira e un assistente AI integrato nel sito keryxdesign.com che qualifica i lead raccogliendo informazioni sui potenziali clienti tramite conversazione. I messaggi dell'utente vengono inviati all'API Claude di Anthropic per generare risposte contestuali.

### 1.2 Ambito del trattamento
- **Dati raccolti:** nome, email/telefono/WhatsApp, settore di attivita, tipo di business (B2B/B2C), servizio di interesse, timeline del progetto, messaggi di conversazione
- **Categorie di interessati:** potenziali clienti di Keryx Design (imprenditori, marketer, professionisti B2B/B2C)
- **Volume stimato:** decine di conversazioni al mese
- **Area geografica:** principalmente Italia e paesi anglofoni

### 1.3 Contesto del trattamento
Il chatbot e accessibile pubblicamente sul sito web tramite un widget flottante o direttamente all'URL dedicato. L'interazione e volontaria e richiede consenso esplicito prima dell'avvio.

### 1.4 Finalita
1. **Qualificazione lead:** raccogliere informazioni per consentire al titolare un follow-up personalizzato
2. **Monitoraggio sicurezza:** prevenire abusi del servizio e garantire la qualita delle interazioni

## 2. Necessita e proporzionalita

### 2.1 Base giuridica
- **Qualificazione lead:** Consenso esplicito dell'interessato (Art. 6(1)(a) GDPR), raccolto tramite checkbox obbligatoria prima dell'avvio della chat
- **Monitoraggio sicurezza:** Legittimo interesse del titolare (Art. 6(1)(f) GDPR)

### 2.2 Necessita
Il chatbot e necessario per:
- Qualificare le richieste prima del contatto umano, migliorando l'efficienza del processo commerciale
- Offrire un punto di contatto immediato 24/7 ai potenziali clienti
- Raccogliere informazioni strutturate per un follow-up mirato

### 2.3 Proporzionalita
- Si raccolgono solo i dati strettamente necessari alla qualificazione (nome, contatto, settore, servizio)
- Le conversazioni in memoria hanno un TTL di 24 ore
- I log persistenti troncano il session ID a 8 caratteri
- L'utente puo cancellare i propri dati in qualsiasi momento
- Non vengono prese decisioni automatizzate che producono effetti giuridici sull'interessato

### 2.4 Minimizzazione dei dati
- Il chatbot raccoglie una informazione alla volta, solo quelle necessarie
- Non vengono raccolti dati sensibili (Art. 9 GDPR)
- Il session ID e un UUID casuale, non collegato all'identita dell'utente fino a quando quest'ultimo non fornisce volontariamente le proprie informazioni

## 3. Valutazione dei rischi

### 3.1 Rischi identificati

| Rischio | Probabilita | Gravita | Livello |
|---------|-------------|---------|---------|
| Accesso non autorizzato alle conversazioni | Bassa | Media | Medio |
| Data breach tramite Anthropic | Molto bassa | Alta | Medio |
| Memorizzazione involontaria di dati nel modello AI | Molto bassa | Media | Basso |
| Abuso del servizio (spam, contenuti illeciti) | Media | Bassa | Medio |
| Perdita dati per problemi tecnici | Bassa | Bassa | Basso |
| Profilazione non dichiarata | N/A | N/A | Eliminato |

### 3.2 Analisi dettagliata

**Accesso non autorizzato:**
- Rischio: qualcuno potrebbe accedere alle conversazioni degli utenti
- Probabilita bassa grazie a: endpoint admin protetto da chiave segreta, HTTPS obbligatorio, security headers

**Data breach Anthropic:**
- Rischio: compromissione dei server Anthropic con esposizione dei messaggi
- Probabilita molto bassa: Anthropic e certificata SOC 2 Type II, implementa crittografia at-rest e in-transit
- DPA con SCCs in vigore tramite Commercial Terms of Service

**Memorizzazione nel modello:**
- Rischio: i dati delle conversazioni potrebbero essere usati per addestrare il modello
- Eliminato: Anthropic dichiara che i dati API non vengono usati per training (confermato nel DPA e nei ToS)

**Abuso del servizio:**
- Rischio: bot o utenti malintenzionati potrebbero abusare del chatbot
- Mitigato: rate limiting (20 req/min), honeypot anti-bot, timing check, input validation (max 2000 char), monitoraggio log

## 4. Misure di mitigazione implementate

### 4.1 Misure tecniche
- **Crittografia in transito:** HTTPS obbligatorio (Railway + HSTS header)
- **Security headers:** X-Content-Type-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy, CSP frame-ancestors
- **Rate limiting:** 20 richieste/minuto per IP
- **Anti-bot:** honeypot, timing check (min 2s), input validation
- **Data minimization:** TTL 24h conversazioni, cleanup automatico ogni ora
- **Anonimizzazione log:** session ID troncato a 8 caratteri
- **Accesso admin:** protetto da chiave segreta (ADMIN_KEY)
- **Sanitizzazione output:** escape HTML prima del rendering

### 4.2 Misure organizzative
- **Consenso esplicito:** checkbox obbligatoria con link alla Privacy Policy
- **Trasparenza AI:** avviso visibile "Stai parlando con un assistente AI"
- **Avviso monitoraggio:** dichiarazione nel consent screen
- **Privacy Policy:** aggiornata in IT e EN con tutte le informazioni richieste dagli Art. 13-14 GDPR
- **DPA:** in vigore con Anthropic tramite Commercial Terms of Service
- **Diritto alla cancellazione:** bottone "Cancella i miei dati" nell'interfaccia

### 4.3 Misure contrattuali
- **DPA Anthropic:** include Standard Contractual Clauses (SCCs) per trasferimento UE-USA
- **Anthropic come responsabile del trattamento:** confermato nel DPA, Art. 28 GDPR

## 5. Diritti degli interessati

| Diritto | Come viene garantito |
|---------|---------------------|
| Informazione (Art. 13-14) | Privacy Policy completa in IT e EN |
| Accesso (Art. 15) | Richiesta via email a info@keryxdesign.com |
| Rettifica (Art. 16) | Richiesta via email |
| Cancellazione (Art. 17) | Bottone "Cancella i miei dati" + richiesta email |
| Limitazione (Art. 18) | Richiesta via email |
| Portabilita (Art. 20) | Richiesta via email (dati forniti in formato JSON) |
| Opposizione (Art. 21) | Richiesta via email |
| Revoca consenso (Art. 7) | Chiudere la chat o richiesta email |

## 6. Conclusione

Il trattamento dei dati tramite il chatbot Kira presenta un livello di rischio complessivo **MEDIO-BASSO** grazie alle misure tecniche e organizzative implementate. I rischi residui sono accettabili e proporzionati alle finalita del trattamento.

Il trattamento puo procedere senza necessita di consultazione preventiva con l'autorita di controllo (Art. 36 GDPR).

---

**Firma:** Davide Filippini - Titolare del trattamento
**Data:** 7 aprile 2026
**Prossima revisione:** 7 aprile 2027
