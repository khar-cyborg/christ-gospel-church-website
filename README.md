# Christ Gospel Church, Coimbatore: website

A plain HTML, CSS and JavaScript site in English and Tamil. There is no build step and no database, so it can be uploaded to any web host as it is.

## See it on your computer

```bash
node tools/serve.mjs
```

Then open http://localhost:5173. Use this rather than double-clicking `index.html`, because YouTube's players refuse to run from a file on disk.

## The live website

The site is live at https://khar-cyborg.github.io/christ-gospel-church-website/ through GitHub Pages. Every push to the `main` branch updates it within a few minutes.

## Where to change things

| To change | Edit |
| --- | --- |
| Address, phone numbers, WhatsApp number, service time, logo | `assets/js/config.js` |
| UPI or bank details (they appear on the Connect page once filled in) | `giving` in `assets/js/config.js` |
| Special service dates | `events` in `assets/js/config.js` |
| Daily verses | `verses` in `assets/js/config.js` |
| English wording | the HTML page itself |
| Tamil wording | `assets/js/i18n-ta.js` |
| Colours and fonts | top of `assets/css/styles.css` |

## Keeping videos current

The "Today's meditation" and "Latest service" players always show the newest upload, with no work needed. The searchable library is a saved list, so refresh it now and then:

```bash
node tools/update-videos.mjs
```

Then upload `assets/js/videos.js` again.

## Please confirm before publishing

Most facts come from the church's YouTube channel. A few things were inferred or written fresh, and the church should check them:

- **Address wording.** The site uses "6" and "Cheran Ma Nagar" as supplied. The sign on the building reads "Door No. 6, 6(1), 6(2)" and "Cheran Maa Nagar".
- **Photo captions.** `front-night.jpg` is captioned as Christmas (it has Christmas stars and a file date of 24 December 2025), and `sanctuary-stage.jpg` as "an anniversary" (it has anniversary decorations).
- **Second phone, 098656 36486.** Taken from YouTube descriptions.
- **WhatsApp.** Prayer requests go to 095787 78787. Check that this number uses WhatsApp.
- **Founding year, 2014.** Worked out from the 12th anniversary in September 2026.
- **Sunday running order** (8:00 praise, 9:15 Psalms, 10:00 Word, 11:00 fellowship). The 8 to 11 AM time is stated on YouTube. The steps within it are estimated from stream start times.
- **Pastors' roles and descriptions**, and **the guest list** on the About page.
- **Mission text** under Care for Bible, Go to People and Counsel the Gospel. The three phrases are on the emblem; the sentences explaining them are drafted.
- **Worship, Word, Prayer, Fellowship descriptions**, and **the "New to faith" and FAQ answers** (language, dress, family, parking).
- **Promise Word** at the start of each month, based on only two examples (August 2025, October 2026).
- **Special service times**, which are last year's start times. They are labelled that way on the Calendar page.
- **Tamil text and Tamil scripture.** Have a Tamil reader proofread `assets/js/i18n-ta.js` and the verses in `config.js`.

## Worth adding when available

- Portraits of the pastors and more photos of church life. The pastor pictures and the smaller gallery pictures on the About page are still small stills from livestreams. Church photos live in `assets/img/church/`.
- UPI or bank details for giving, a statement of faith, ministry groups, midweek meetings, an email address and other social links. None of these were published on the channel, so none were invented here.
- If the church gets its own domain name: update the addresses in `robots.txt`, `sitemap.xml` and the top of `index.html`. It is also worth listing the church on Google Business Profile.
