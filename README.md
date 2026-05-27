# ⚡ FlashBuy — Fast Checkout voor iBood

**FlashBuy is een browser-extensie die je checkout op iBood.com versnelt
tot enkele seconden.** Tijdens de iBood Hunt zijn deals soms binnen
seconden uitverkocht. FlashBuy zorgt ervoor dat jij niet de deal verliest
omdat je te traag was met afrekenen.

## Wat doet FlashBuy?

Zodra **jij** op "Kopen" klikt bij een deal, neemt FlashBuy het over:

1. Selecteert automatisch **thuislevering**
2. Klikt **PayPal** aan als betaalmethode
3. Klikt op **"Bestellen en betalen"**
4. Stuurt je door naar PayPal om af te ronden

Wat handmatig 15-30 seconden duurt, doet FlashBuy in 2-4 seconden.

**Belangrijk:** FlashBuy is **geen bot**. Het klikt niet automatisch op
deals — dat doe jij zelf. FlashBuy versnelt alleen het afrekenproces
nadat jij hebt besloten te kopen.

## Installatie

1. Download **`Flashbuy v3.1.1.zip`** uit deze repository
2. Pak het bestand uit
3. Open Chrome (of Edge, Brave, Opera, Vivaldi) en ga naar
   `chrome://extensions/`
4. Zet rechtsboven **"Ontwikkelaarsmodus"** aan
5. Klik **"Uitgepakte extensie laden"** en selecteer de uitgepakte map
6. Klaar! Het FlashBuy-icoon verschijnt in je browserbalk

Volledige instructies en activatie-stappen staan in de bijgeleverde
**`FlashBuy_Handleiding.pdf`**.

## Werkt op

- Google Chrome
- Microsoft Edge
- Brave
- Opera
- Vivaldi

Werkt op zowel de Belgische (`/s-be/`) als Nederlandse (`/s-nl/`)
versie van iBood.

---

# 🔒 Auto-Login Source (Public)

FlashBuy biedt een optionele auto-login functie. Daarvoor sla je je
iBood e-mail en wachtwoord op in de extensie. Omdat dit een gevoelige
feature is, is de broncode van de auto-login functie **volledig publiek
inzichtelijk** in deze repository.

Je kan zelf controleren wat het script met je wachtwoord doet.

## Wat dit script doet

1. Leest `fb_email`, `fb_pass` en `fb_autologin` uit `chrome.storage.sync`
   (= lokale browser-opslag op jouw eigen apparaat)
2. Detecteert het iBood inlog-formulier op de pagina
3. Vult de e-mail en wachtwoord velden in en klikt op "Ga verder"

## Wat dit script NIET doet

- **Geen netwerk-requests** naar FlashBuy servers
- Geen `fetch()` of `XMLHttpRequest` waar dan ook
- Geen versturen van credentials naar derden
- Geen analytics, tracking, of telemetrie

Het wachtwoord wordt **uitsluitend** in het iBood inlog-formulier op
ibood.com gezet — dezelfde plek waar jij het anders zelf typt.

## Authenticiteit verifieren

Om te controleren dat je geinstalleerde extensie overeenkomt met
deze publieke broncode:

1. Open de extensie-bestanden uit `Flashbuy v3.1.1.zip`
2. Open `src/autologin.js`
3. Vergelijk de inhoud met `autologin.js` in deze repository
4. Ze moeten identiek zijn

## Waarom is de rest van de extensie obfuscated?

De rest van FlashBuy (checkout automatisering, license-systeem,
selector-data) is obfuscated om de commerciele waarde van de
checkout-optimalisatie te beschermen.

Alleen het auto-login script werkt met je inloggegevens, dus alleen
dat script hoeft publiek verifieerbaar te zijn.

---

## Repository inhoud

- **`Flashbuy v3.1.1.zip`** — Volledige FlashBuy extensie + PDF handleiding
- **`autologin.js`** — Publieke broncode van het auto-login script
- **`README.md`** — Dit bestand

## Licentie

Source ter beschikking gesteld voor **transparantie en verificatie**.
Niet gelicentieerd voor herdistributie of commercieel gebruik.

## Contact

- **E-mail:** Flashbuy.novadevlabs@gmail.com
- **X (Twitter):** https://x.com/Flashbuy2026
- **GitHub:** https://github.com/Flashbuy2026/Flashbuy
