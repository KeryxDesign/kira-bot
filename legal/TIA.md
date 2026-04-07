# Transfer Impact Assessment (TIA)
## Trasferimento dati UE-USA tramite Anthropic API

**Titolare del trattamento:** Keryx Design - Davide Filippini (M26525203S)
**Importatore dati:** Anthropic PBC, 548 Market Street, PMB 90375, San Francisco, CA 94104, USA
**Data:** 7 aprile 2026
**Versione:** 1.0

---

## 1. Descrizione del trasferimento

### 1.1 Dati trasferiti
I messaggi scambiati tra l'utente e il chatbot Kira vengono inviati all'API Claude di Anthropic per l'elaborazione delle risposte. I dati possono includere:
- Messaggi di testo dell'utente (che possono contenere nome, contatto, settore, dettagli progetto)
- System prompt (non contiene dati personali)
- Risposte generate dal modello

### 1.2 Frequenza e volume
- Trasferimento in tempo reale ad ogni messaggio dell'utente
- Volume stimato: decine di conversazioni al mese, centinaia di messaggi

### 1.3 Finalita
Generazione di risposte conversazionali per la qualificazione dei lead.

### 1.4 Destinatario
Anthropic PBC agisce come **responsabile del trattamento** (data processor) ai sensi dell'Art. 28 GDPR.

## 2. Garanzie contrattuali

### 2.1 Data Processing Addendum (DPA)
- Il DPA di Anthropic con Standard Contractual Clauses (SCCs) e automaticamente incorporato nei Commercial Terms of Service
- Testo completo: https://www.anthropic.com/legal/data-processing-addendum
- Il DPA include le SCCs Module 2 (controller-to-processor) allegate alla Decisione di Esecuzione (UE) 2021/914

### 2.2 Impegni contrattuali chiave di Anthropic
- Trattamento dei dati solo su istruzioni documentate del titolare
- Obbligo di riservatezza per il personale autorizzato
- Misure di sicurezza tecniche e organizzative appropriate
- Assistenza per le richieste degli interessati
- Notifica tempestiva in caso di data breach
- Cancellazione o restituzione dei dati entro 30 giorni dalla cessazione del servizio
- Audit e ispezioni su richiesta

### 2.3 Sub-processori
Anthropic mantiene una lista aggiornata dei sub-processori e fornisce preavviso di 15 giorni per nuove nomine, con possibilita di obiezione da parte del titolare.

## 3. Valutazione del quadro giuridico USA

### 3.1 EU-US Data Privacy Framework
- Gli Stati Uniti sono stati oggetto di una decisione di adeguatezza della Commissione Europea (10 luglio 2023) tramite l'EU-US Data Privacy Framework
- Le aziende USA certificate sotto il DPF offrono un livello di protezione adeguato

### 3.2 Rischi residui post-Schrems II
- **FISA Section 702:** consente la sorveglianza di comunicazioni di non-cittadini USA. Rischio mitigato dal fatto che i dati trattati sono di natura commerciale (non sensibili) e il volume e molto limitato
- **Executive Order 14086:** introduce garanzie di proporzionalita e necessita per l'intelligence USA e istituisce un meccanismo di ricorso (Data Protection Review Court)
- **Probabilita di accesso governativo:** molto bassa considerando la natura dei dati (informazioni commerciali di base), il volume ridotto e l'assenza di categorie sensibili

### 3.3 Valutazione complessiva
Il rischio di accesso governativo ai dati trasferiti e **molto basso** per i seguenti motivi:
1. I dati sono di natura puramente commerciale (nome, contatto, interesse per servizi di design)
2. Il volume e estremamente limitato
3. Non vengono trattate categorie particolari di dati (Art. 9 GDPR)
4. Anthropic implementa crittografia at-rest e in-transit
5. I dati in memoria API vengono eliminati secondo la retention policy di Anthropic
6. Il DPF fornisce un quadro giuridico adeguato riconosciuto dalla Commissione UE

## 4. Misure supplementari

### 4.1 Misure tecniche
- **Crittografia in transito:** TLS 1.2+ per tutte le comunicazioni API
- **Minimizzazione:** solo i messaggi della conversazione vengono inviati, non metadati aggiuntivi
- **TTL:** le conversazioni in memoria hanno un TTL di 24 ore
- **Anonimizzazione log locali:** session ID troncato a 8 caratteri

### 4.2 Misure organizzative
- **Consenso informato:** l'utente viene esplicitamente informato del trasferimento USA nel consent screen e nella Privacy Policy
- **Limitazione finalita:** Anthropic tratta i dati esclusivamente per generare risposte API, non per training del modello
- **Monitoraggio:** revisione periodica dei ToS e delle policy Anthropic

## 5. Conclusione

Il trasferimento dei dati personali verso Anthropic PBC negli Stati Uniti e conforme al GDPR grazie a:
1. Standard Contractual Clauses incorporate nel DPA
2. EU-US Data Privacy Framework
3. Misure supplementari tecniche e organizzative
4. Natura non sensibile e volume limitato dei dati

Il livello di protezione complessivo e **adeguato**. Il trasferimento puo procedere.

---

**Firma:** Davide Filippini - Titolare del trattamento
**Data:** 7 aprile 2026
**Prossima revisione:** 7 aprile 2027 o in caso di modifiche significative ai ToS/DPA di Anthropic
