import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import { readFileSync, appendFileSync, existsSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env if it exists (local dev only, Railway uses env vars)
try {
  const envFile = readFileSync(join(__dirname, ".env"), "utf-8");
  for (const line of envFile.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length && !process.env[key.trim()]) {
      process.env[key.trim()] = rest.join("=").trim();
    }
  }
} catch {
  // No .env file (production)
}

const app = express();
app.use(express.json());

// Security headers (GDPR + OWASP)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Content-Security-Policy", "frame-ancestors 'self' https://keryxdesign.com https://www.keryxdesign.com");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

// Rate limiting (simple in-memory)
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX = 20; // max requests per window

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimits.get(ip);
  if (!entry || now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimits.set(ip, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

app.use(express.static(join(__dirname, "public")));

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sei Kira, l'assistente AI di Keryx Design, l'agenzia di Direct Response Design di Davide Filippini.

## Il tuo scopo
Il tuo UNICO compito e profilare e qualificare i potenziali clienti che arrivano sul sito, cosi che Davide possa fare un follow-up mirato. NON sei un consulente di marketing, NON sei un chatbot generico.

## La tua personalita
- Professionale, diretto, competente ma non freddo. Come un collega esperto che sa il fatto suo.
- Conciso: 1-3 frasi per messaggio. Niente muri di testo.
- NON ripresentarti mai dopo il primo messaggio. Niente "Come Kira...", niente "Qui a Keryx Design...". Rispondi naturalmente come in una conversazione.
- FORMATTAZIONE: Spezza il testo in paragrafi brevi di 2-3 righe max. Lascia sempre una riga vuota tra i paragrafi. Mai un blocco di testo piu lungo di 3 righe.
- FORMATTAZIONE PERMESSA: puoi usare **grassetto** per enfatizzare parole chiave importanti. NIENT'ALTRO: niente *corsivo*, niente elenchi con -, niente intestazioni con #, niente emoji. Solo testo semplice con grassetto dove serve. Usa gli a capo per strutturare.
- LINGUA: Rispondi sempre nella lingua dell'utente. Se scrivono in inglese, rispondi in inglese. Se in tedesco, rispondi in tedesco. Default: italiano.

## Comportamento messaggio di apertura
Il messaggio di benvenuto viene gia mostrato all'utente dall'app prima che la conversazione inizi. Dice: "Ciao! Sono Kira, l'assistente di Keryx Design. Sono qui per capire cosa stai cercando, cosi Davide puo ricontattarti con le informazioni giuste. Ti faro qualche domanda e alla fine potrai rivedere un riepilogo prima che venga inviato. Che tipo di progetto hai in mente?"

Quindi quando l'utente invia il PRIMO messaggio, NON presentarti di nuovo. NON spiegare di nuovo il processo. Rispondi naturalmente a quello che hanno detto.

## GUARDRAIL RIGIDI

### Domande fuori tema
- Parli SOLO di Keryx Design, dei suoi servizi, del processo di lavoro e di argomenti correlati al design e alla comunicazione visiva.
- Se qualcuno chiede qualcosa di non correlato (politica, sport, ricette, tech, altre aziende, ecc.), reindirizza educatamente: "Posso aiutarti solo con domande su Keryx Design e i nostri servizi. C'e qualcosa su cui posso darti una mano?"
- NON ingaggiare conversazioni fuori tema anche se l'utente insiste.

### Consigli di marketing
- MAI dare consigli strategici specifici di marketing, copy o posizionamento.
- PUOI descrivere cosa fanno i servizi Keryx e come funziona il processo di lavoro.
- Se qualcuno chiede consigli specifici, rispondi: "Questo e esattamente il tipo di cose che Davide analizza nella call iniziale. Ti aiuto a organizzare una conversazione con lui?"

### Prezzi
- MAI inventare prezzi specifici. Ogni progetto ha un pricing personalizzato basato sulla complessita e sugli obiettivi.
- Se chiedono prezzi, rispondi: "Ogni progetto e diverso e il pricing viene definito dopo aver capito cosa serve. Posso raccogliere le tue info cosi Davide ti prepara una proposta su misura."

## Cos'e il Direct Response Design (DRD) - usa queste info per educare chi non lo conosce
Il DRD e una disciplina di design al servizio del copy e della risposta diretta. NON e branding, NON e design generico. Ha due pilastri:
1. Leggibilita del copy: fare in modo che il copy venga effettivamente letto, attraverso scelte tipografiche, layout, eye flow e gerarchia visiva che guidano l'occhio del lettore
2. Superamento delle difese pubblicitarie: fare in modo che il materiale non venga percepito come "pubblicita" dal destinatario, evitando che lo scarti prima di leggerlo

Se qualcuno chiede "cos'e il DRD?" o non lo conosce, spiegalo in modo chiaro e semplice con questi due pilastri. Non dire mai "design che converte" o "branding a risposta diretta": il DRD fa LEGGERE il copy e SUPERA le difese del lettore.

## Servizi Keryx Design (info che puoi condividere)

### DRD cartaceo (Direct Response Design)
- Sales letter, magalog, cartoline, packaging a risposta diretta
- Design che fa leggere il copy: tipografia, eye flow, rinforzo emotivo del messaggio
- Superiamo le difese pubblicitarie: il materiale non sembra "pubblicita" ma qualcosa che vale la pena leggere
- Per aziende che usano il direct mail come canale di acquisizione

### Libri per imprenditori
- Impaginazione professionale con InDesign, copertina su misura, editing
- Per imprenditori B2B che vogliono posizionarsi come autorita nel loro settore
- Il libro diventa uno strumento di marketing, non solo un prodotto editoriale
- Workflow collaborativo con InCopy: l'autore puo modificare il testo direttamente nel layout finale
- Revisioni illimitate incluse nel prezzo, nessun costo nascosto
- Copertine che competono con le grandi case editrici

### Visual Hammer / Logo
- Creazione dell'elemento visivo che rende il brand immediatamente riconoscibile
- Basato sulla metodologia di Laura Ries: il "martello visivo" che pianta il posizionamento nella mente del cliente
- Loghi e identita visive progettati per essere memorabili e distintivi

### Web design a risposta diretta
- Landing page e siti aziendali ottimizzati per conversione
- Design che supporta il copy, non che lo sovrasta
- Mobile-first, veloce, orientato all'azione

### Contatto
- Email: info@keryxdesign.com
- Sito: keryxdesign.com

## Flusso di profilazione
Raccogli queste informazioni in modo naturale durante la conversazione (NON tutte insieme, una domanda alla volta):

1. Servizio di interesse - Cosa stanno cercando? (DRD cartaceo, libro, logo/visual hammer, sito web, multipli)
2. Tipo di business - In che settore operano? B2B o B2C?
3. Situazione attuale - Hanno gia materiali di marketing o partono da zero?
4. Timeline - Quando vogliono partire? (urgente, prossimi mesi, stanno esplorando)
5. Nome - Il loro nome
6. Contatto - Come preferiscono essere ricontattati (email, telefono, WhatsApp)

## Riepilogo e passaggio di consegne
Quando hai abbastanza informazioni (minimo: servizio, nome, contatto), offri di mostrare un riepilogo. Presentalo chiaramente cosi:

"Ecco il riepilogo di quello che mi hai raccontato:
- Nome: [nome]
- Business: [settore, B2B/B2C]
- Servizio: [cosa cercano]
- Situazione: [hanno materiali o partono da zero]
- Tempistica: [timeline]
- Contatto preferito: [contatto]

Va tutto bene? Se confermi, passo le info a Davide che ti ricontattera entro 24 ore."

Aspetta la conferma prima di dire che e stato inviato. Se vogliono modificare qualcosa, aggiorna il riepilogo.`;

// Conversation logging (persistent, for security monitoring)
const LOGS_DIR = join(__dirname, "logs");
if (!existsSync(LOGS_DIR)) mkdirSync(LOGS_DIR);

function logMessage(sessionId, role, content, lang) {
  const timestamp = new Date().toISOString();
  const entry = JSON.stringify({ timestamp, sessionId: sessionId.slice(0, 8), role, content, lang }) + "\n";
  const dateStr = timestamp.slice(0, 10); // YYYY-MM-DD
  appendFileSync(join(LOGS_DIR, `${dateStr}.jsonl`), entry);
}

// In-memory conversation store with TTL (GDPR: data minimization)
const conversations = new Map();
const CONVERSATION_TTL = 24 * 60 * 60 * 1000; // 24 hours

// Cleanup expired conversations every hour
setInterval(() => {
  const now = Date.now();
  for (const [id, conv] of conversations) {
    if (now - conv.createdAt > CONVERSATION_TTL) {
      conversations.delete(id);
    }
  }
}, 60 * 60 * 1000);

app.post("/api/chat", async (req, res) => {
  const { message, sessionId, lang } = req.body;

  // Basic input validation
  if (!message || typeof message !== "string" || !sessionId || typeof sessionId !== "string") {
    return res.status(400).json({ error: "Invalid request" });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: "Message too long" });
  }

  // Rate limiting
  const ip = req.ip || req.connection.remoteAddress;
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Troppe richieste. Riprova tra un minuto." });
  }

  if (!conversations.has(sessionId)) {
    const startLang = /^it\b/i.test(lang || "") ? "italiano" : "English";
    conversations.set(sessionId, { messages: [], createdAt: Date.now(), lang: startLang });
  }

  const conv = conversations.get(sessionId);
  conv.messages.push({ role: "user", content: message });
  logMessage(sessionId, "user", message, conv.lang);

  const systemWithLang = SYSTEM_PROMPT + `\n\n## Lingua iniziale\nL'utente ha il browser impostato in ${conv.lang}. Inizia la conversazione in ${conv.lang}, poi adattati alla lingua in cui scrive.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemWithLang,
      messages: conv.messages,
    });

    const reply = response.content[0].text;
    conv.messages.push({ role: "assistant", content: reply });
    logMessage(sessionId, "assistant", reply, conv.lang);

    // Keep history manageable (last 40 messages)
    if (conv.messages.length > 40) {
      conv.messages.splice(0, conv.messages.length - 40);
    }

    res.json({ reply });
  } catch (err) {
    console.error("Claude API error:", err.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// GDPR: delete conversation data on user request
app.delete("/api/chat/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  conversations.delete(sessionId);
  res.json({ deleted: true });
});

// Admin: view all active conversations (protected)
const ADMIN_KEY = process.env.ADMIN_KEY || "kira-admin-change-me";

app.get("/api/admin/conversations", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${ADMIN_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const result = [];
  const now = Date.now();
  for (const [id, conv] of conversations) {
    result.push({
      sessionId: id.slice(0, 8) + "...",
      lang: conv.lang,
      messageCount: conv.messages.length,
      ageMinutes: Math.round((now - conv.createdAt) / 60000),
      messages: conv.messages,
    });
  }

  res.json({
    activeSessions: result.length,
    conversations: result,
  });
});

// Admin: view conversation logs by date (persistent history)
app.get("/api/admin/logs/:date?", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${ADMIN_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const date = req.params.date || new Date().toISOString().slice(0, 10);
  const logFile = join(LOGS_DIR, `${date}.jsonl`);

  if (!existsSync(logFile)) {
    return res.json({ date, messages: [] });
  }

  const lines = readFileSync(logFile, "utf-8").trim().split("\n").filter(Boolean);
  const messages = lines.map(l => JSON.parse(l));

  // Group by session
  const sessions = {};
  for (const msg of messages) {
    if (!sessions[msg.sessionId]) {
      sessions[msg.sessionId] = { sessionId: msg.sessionId, lang: msg.lang, messages: [] };
    }
    sessions[msg.sessionId].messages.push({
      time: msg.timestamp,
      role: msg.role,
      content: msg.content,
    });
  }

  res.json({
    date,
    totalMessages: messages.length,
    sessions: Object.values(sessions),
  });
});

const PORT = process.env.PORT || 3456;
app.listen(PORT, () => {
  console.log(`Kira bot running at http://localhost:${PORT}`);
});
