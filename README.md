# Dada Celebration House

A private-room booking site for birthdays, anniversaries, date nights, proposals, farewells, and family gatherings.

Choose a Bengaluru neighbourhood and a date, then hold a three-hour slot. Bookings stay in this browser. Payment is taken at the room, not on the page.

The site is built to publish at:

https://manikantasaiv26.github.io/dada/

The production files are already on the `gh-pages` branch. GitHub serves them after the Pages source is saved once:

1. Open https://github.com/Manikantasaiv26/dada/settings/pages while logged in as the repository owner.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch `gh-pages` and folder `/ (root)`, then click **Save**.

The address starts serving the booking site within about a minute. The repository is public, which a free GitHub plan requires before Pages can be served. Choosing branch `main` would not show the site, because `main` does not contain the built page.

```bash
npm install
npm run dev
```

Open the local address Vite prints. Replace the desk phone in `src/data.js` and the photos in `public/photos` with the real house before using this with customers.
