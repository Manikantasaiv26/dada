# Dada Celebration House

A private-room booking site for birthdays, anniversaries, date nights, proposals, farewells, and family gatherings.

Choose a date for a Whitefield room, then hold a three-hour slot. Bookings stay in this browser. Payment is taken at the room, not on the page.

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

Open the local address Vite prints. The desk number is 85559 09192. Replace the photos in `public/photos` with the real house before using this with customers.

## Android and iOS

The same booking site is packaged as a phone app with Capacitor. The app id is `house.dada.celebration` and the name on the home screen is Dada. Bookings still stay on the phone, and payment is still taken at the room.

```bash
npm install
npm run cap:sync
```

Open `android/` in Android Studio and press Run to install it on an Android phone or emulator. Publishing to Google Play is Android Studio’s signed app bundle, using a Play Console account.

The iOS project is `ios/App/App.xcworkspace`. Open that in Xcode on a Mac, then run it on a simulator or iPhone. Sending it to the App Store needs an Apple Developer account and a Xcode archive. The iOS project cannot be built on Linux.
