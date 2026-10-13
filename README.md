# Biodata Wallah

Marriage, job and general biodata maker in Hindi, Marathi and English.

- Everything runs in the browser. Details and photos stay on the user's device (localStorage); nothing is uploaded.
- 30 ready templates, auto-picked by purpose and community.
- "Write it for me" for About me, partner expectations, career objective and declaration.
- Free to make and preview; pay ₹49 (Razorpay) only to download the PDF + WhatsApp image.
- 12 static SEO landing pages, sitemap and robots.txt are generated at build time.

## Run

```bash
npm install
npm run dev
```

## Go live checklist

1. `src/config.ts`: set `razorpayKeyId` (live key) and `helplineWhatsApp`. Empty key = demo mode, no money taken.
2. Build with your domain: `SITE_URL=https://biodatawallah.com npm run build`.
3. Payments are confirmed in the browser only. Before scaling, add a small server (e.g. Cloudflare Worker) to create Razorpay orders and verify signatures.
4. Have a lawyer review the Privacy and Terms text in `src/components/Legal.tsx`.
