# Nyaya Summarizer — AI Court Judgment Summarizer for District Courts

Nyaya Summarizer is a Next.js legal-document research portal for lawyers and court officials. Users can upload PDF/TXT judgments or paste judgment text, generate a case summary, identify legal points, extract citations, compare a judgment with documents in their own private library, and manage hearing dates.

> **Important legal-use notice:** AI output is an assistive research aid, not legal advice. Extracted citations are not independently verified. Always check summaries, dates, citations and legal propositions against the original judgment and authoritative sources. Do not upload confidential or privileged material to an external AI provider unless you are authorized to do so.

## Main features

- **Accounts and access:** email/password authentication, hashed passwords, signed HTTP-only session cookies, and per-user data isolation.
- **Judgment upload:** PDF, TXT, Markdown, or pasted text; 10 MB upload limit.
- **AI summaries:** Claude API when configured, with a built-in extractive fallback. The AI prompt asks for facts, legal issues, decision and outcome without inventing missing details.
- **Legal points and citations:** extracts likely legal principles, statutory references and case citations. The detail page displays nearby source text where possible and clearly marks citations as *not verified*.
- **Similar judgments:** TF-IDF/cosine similarity against the signed-in user's own library. This intentionally avoids exposing one user's private documents to another user.
- **Hearing management:** detects some future hearing dates in text, supports manual scheduling, and displays upcoming/past hearings with an in-app reminder for hearings within 48 hours.
- **Summary export:** download a plain-text case summary, legal points and extracted citations.
- **Demo data:** sample judgments and hearings for evaluation.

## Technology

- Next.js 14 App Router, React 18, TypeScript
- Prisma ORM + SQLite for local academic/demo use
- `pdf-parse` for text-based PDFs
- Anthropic Claude API (optional)
- `jose` session tokens and `bcryptjs` password hashing

## Run on Windows (recommended)

**Requirements:** Node.js 20 LTS (Node 18.17+ may work), VS Code, and an internet connection for the first dependency installation.

1. Extract the ZIP file to a normal folder, for example `C:\Users\YourName\Desktop\nyaya-summarizer`.
2. Open that extracted `nyaya-summarizer` folder in VS Code (the folder containing `package.json`).
3. Double-click **`SETUP-WINDOWS.bat`**. It installs dependencies, creates `.env`, generates Prisma Client, creates the SQLite database, inserts demo data, and starts the app.
4. Open `http://localhost:3000` in your browser.

If Windows blocks npm PowerShell scripts, the setup file uses `npm.cmd` and `npx.cmd` to avoid that PowerShell execution-policy issue.

### Manual VS Code terminal setup

Open the VS Code terminal in the folder containing `package.json`, then run these commands one by one:

```powershell
copy .env.example .env
npm.cmd install
npx.cmd prisma generate
npx.cmd prisma db push
node prisma/seed.js
npm.cmd run dev
```

Open `http://localhost:3000`.

## Demo login

- Email: `demo@court.in`
- Password: `Demo@1234`

Change or remove this demo account before deploying publicly. The seed script creates two sample judgments and hearing records.

## Optional AI configuration

Open `.env` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY="your-api-key"
ANTHROPIC_MODEL="claude-sonnet-4-5"
```

Restart the development server after editing `.env`. If no API key is configured or the provider call fails, the built-in extractive analyzer is used. Do not commit `.env` or share API keys.

## Environment variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Local SQLite connection; default `file:./dev.db` |
| `AUTH_SECRET` | Secret used to sign session cookies; replace the development value before deployment |
| `ANTHROPIC_API_KEY` | Optional key for Claude-powered summarization |
| `ANTHROPIC_MODEL` | Optional Anthropic model name |

## Important implementation notes and limitations

1. **Scanned PDFs:** PDFs containing only page images cannot be read by the current text extractor. They need OCR before upload. The UI/API reports this rather than pretending the document was analyzed.
2. **Citation verification:** The app extracts references and shows source context, but does not validate them against SCC, AIR, e-Courts or another authoritative legal database.
3. **Similar-case search:** Results are limited to documents uploaded by the same account. It is not a national case-law search engine and does not access other users' files.
4. **Hearing information:** Dates detected in uploaded text may be historical, incomplete or ambiguous. Users should confirm all hearing dates with the relevant court. The in-app reminder is not an email/SMS alert and is not a live court-calendar integration.
5. **Court-official role:** Public sign-up always creates a lawyer account. Court-official access must be assigned through a trusted administrative process; do not allow public self-registration as a court official.
6. **Storage:** Original uploads are parsed in memory; the app stores extracted text and metadata, not the original PDF file.
7. **Production readiness:** SQLite is suitable for a local demonstration. For multi-user production deployment, configure PostgreSQL, persistent private file storage, rate limiting, audit logs, secure backups, stronger admin provisioning, and a reviewed privacy/security policy. Set a strong random `AUTH_SECRET` and never use the demo credentials.

## Suggested academic demonstration flow

1. Sign in using the demo account.
2. Open **Upload** and select `samples/sample-judgment.txt`.
3. Review the summary, legal points and citation source context.
4. Download the generated summary.
5. Upload the second sample or another judgment to see private-library similarity results.
6. Open **Hearings** to view upcoming dates and add a hearing manually.

## Project structure

```text
app/                 Next.js pages and API route handlers
components/           Forms, navigation, export and UI components
lib/                  Authentication, AI analysis, similarity and citation helpers
prisma/               Database schema and seed data
samples/               Sample judgment for testing
.env.example           Environment-variable template
SETUP-WINDOWS.bat      One-click Windows setup and run script
```
