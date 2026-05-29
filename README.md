# ⚡ FlashBuy — Fast Checkout voor iBood

**FlashBuy is een browser-extensie die je checkout op iBood.com automatiseert.** Klik op "Ik neem er 1!" — FlashBuy navigeert automatisch naar de checkout, selecteert thuislevering, klikt PayPal aan en plaatst de bestelling.

## Wat doet FlashBuy?

1. Jij klikt **"Ik neem er 1!"**
2. FlashBuy navigeert automatisch naar de checkout
3. Selecteert **thuislevering** + **PayPal**
4. Klikt **"Bestellen en betalen!"**
5. Je wordt doorgestuurd naar PayPal

## ⚡ Box Mode (nieuw in v4)

Box Mode koopt automatisch zonder dat je zelf hoeft te klikken:

1. FlashBuy pollt de iBood API elke 2 seconden
2. In de laatste 8 seconden voor een deal-wissel: 200ms polling
3. Zodra een nieuw deal-item beschikbaar is (vóór de pagina het toont): automatisch kopen
4. Stel een **slug/titel filter** in (bijv. `de-box`) zodat alleen specifieke producten gekocht worden
5. Auto-checkout voltooit de aankoop volledig automatisch

## Pauze-knop

Wil je normaal winkelen? Gebruik de schakelaar in het paneel:
- 🟢 **Groen** = FlashBuy actief (ARMED)
- 🔴 **Rood** = FlashBuy gepauzeerd (PAUSED)

## Installatie

1. Download **`Flashbuy v4.2.6.zip`**
2. Pak uit en open `chrome://extensions/`
3. Zet **"Ontwikkelaarsmodus"** aan
4. Klik **"Uitgepakte extensie laden"** → selecteer de map `Flashbuy v4.2.6`
5. Klaar!

Werkt op Chrome, Edge, Brave, Opera, Vivaldi — BE en NL versie van iBood.

---

# 🔒 Auto-Login Source (Public)

De broncode van de auto-login functie is publiek zodat je kan verifiëren wat er met je wachtwoord gebeurt.

## Wat dit script doet

1. Leest credentials uit lokale browser-opslag (`chrome.storage.sync`)
2. Detecteert het iBood inlog-formulier
3. Vult e-mail en wachtwoord in en klikt "Ga verder"

## Wat dit script NIET doet

- Geen netwerk-requests naar FlashBuy servers
- Geen `fetch()` of `XMLHttpRequest` naar derden
- Geen analytics of telemetrie

## Authenticiteit verifiëren

Vergelijk `src/autologin.js` uit de zip met `autologin.js` in deze repository — ze zijn identiek.

---

## Contact

- **E-mail:** Flashbuy.novadevlabs@gmail.com
- **X:** https://x.com/Flashbuy2026
- **GitHub:** https://github.com/Flashbuy2026/Flashbuy
