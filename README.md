# FlashBuy — Auto-Login Source (Public)

This repository contains the **publicly auditable source code** of the
`autologin.js` script used by the FlashBuy Chrome extension, plus the
extension package itself.

## Why is the auto-login script public?

FlashBuy stores your iBood email and password locally to enable auto-login.
Because that's a sensitive feature, we want users to be able to verify
exactly what the script does with their credentials.

## What this script does

1. Reads `fb_email`, `fb_pass` and `fb_autologin` from `chrome.storage.sync`
   (your local browser storage)
2. Detects the iBood login form on the page
3. Fills the email and password fields and clicks "Ga verder"

## What this script does NOT do

- **No network requests** to FlashBuy servers
- No `fetch()` or `XMLHttpRequest` anywhere
- No sending of credentials to third parties
- No analytics, tracking, or telemetry

The password is **only** entered into the iBood login form on ibood.com —
the same place you would type it yourself.

## Repository contents

- `autologin.js` — the unobfuscated source of the auto-login script
- `Flashbuy v3.1.0.zip` — the full FlashBuy extension package for installation

## Verifying authenticity

To verify your installed extension matches the public source:
1. Locate the extension's `src/autologin.js` file (inside Flashbuy v3.1.0.zip)
2. Compare its content with `autologin.js` in this repository
3. They should be identical

## Other extension files

The rest of the FlashBuy extension (checkout automation, license logic,
selector data) is **obfuscated** to protect the commercial value of the
checkout optimization.

Only this file handles your credentials, so only this file needs to be
publicly verifiable.

## Installation

Download `Flashbuy v3.1.0.zip` and follow the installation instructions
in the included PDF manual (`FlashBuy_Handleiding.pdf`).

## License

Source provided for **transparency and verification purposes only**.
Not licensed for redistribution or commercial use.

## Contact

- Email: Flashbuy.novadevlabs@gmail.com
- X: https://x.com/Flashbuy2026
- GitHub: https://github.com/Flashbuy2026/Flashbuy
