// ════════════════════════════════════════════════════════════════════
//  FlashBuy – autologin.js (PUBLIC SOURCE)
//  https://github.com/Flashbuy2026/Flashbuy
// ════════════════════════════════════════════════════════════════════
//
//  Deze bron is BEWUST onversleuteld en publiek inzichtelijk zodat
//  gebruikers kunnen verifieren wat er met hun iBood-inloggegevens
//  gebeurt.
//
//  Wat dit script doet:
//    1. Leest fb_email, fb_pass en fb_autologin uit chrome.storage.sync
//       (= lokale browser-opslag, blijft op jouw eigen apparaat)
//    2. Detecteert het iBood inlog-formulier op de pagina
//    3. Vult de e-mail en wachtwoord velden in en klikt op "Ga verder"
//
//  Wat dit script NIET doet:
//    - Geen netwerk-requests naar FlashBuy servers
//    - Geen fetch() of XMLHttpRequest waar dan ook
//    - Geen versturen van credentials naar derden
//    - Geen analytics, tracking, of telemetrie
//
//  Het wachtwoord wordt uitsluitend in het iBood inlog-formulier op
//  ibood.com gezet — dezelfde plek waar jij het anders zelf typt.
//
//  Hash van dit bestand wordt vermeld op:
//  https://x.com/Flashbuy2026
// ════════════════════════════════════════════════════════════════════

// FlashBuy – autologin.js – Auto-fill + submit op alle iBood pagina's

(function () {
  "use strict";

  // Stop oude observer als die nog draait (bij SPA herinjectie)
  if (window._fbAutologinObserver) {
    try { window._fbAutologinObserver.disconnect(); } catch (e) {}
  }
  if (window._fbAutologinInterval) {
    clearInterval(window._fbAutologinInterval);
  }

  function _l(m) { console.log("[FlashBuy login] " + m); }
  function _w(ms) { return new Promise(function(r) { setTimeout(r, ms); }); }

  var _filling = false;
  var _credsCache = null; // Lokale cache - geen storage-calls meer in de hot path
  var _throttleTimer = null;
  var _lastFillAttempt = 0;

  // Laad credentials één keer bij start
  function _loadCreds(callback) {
    chrome.storage.sync.get(["fb_email", "fb_pass", "fb_autologin", "fb_paused"], function(d) {
      _credsCache = {
        email: d.fb_email || null,
        pass: d.fb_pass || null,
        autologin: !!d.fb_autologin,
        paused: !!d.fb_paused
      };
      if (callback) callback();
    });
  }

  // Luister naar storage wijzigingen (gebruiker kan credentials updaten)
  chrome.storage.onChanged.addListener(function(changes, area) {
    if (area !== "sync") return;
    if (changes.fb_email || changes.fb_pass || changes.fb_autologin || changes.fb_paused) {
      _loadCreds();
      _l("Credentials cache geupdate");
    }
  });

  function _tap(el) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    var o = { bubbles: true, cancelable: true, view: window, clientX: cx, clientY: cy, button: 0 };
    el.dispatchEvent(new PointerEvent("pointerdown", o));
    el.dispatchEvent(new MouseEvent("mousedown", o));
    el.dispatchEvent(new PointerEvent("pointerup", o));
    el.dispatchEvent(new MouseEvent("mouseup", o));
    el.dispatchEvent(new MouseEvent("click", o));
  }

  function _setValue(el, val) {
    el.focus();
    var set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    set.call(el, "");
    el.dispatchEvent(new Event("input", { bubbles: true }));
    set.call(el, val);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
    el.blur();
  }

  function _findLoginInputs() {
    var passInputs = document.querySelectorAll('input[type="password"]:not([disabled]):not([readonly])');
    if (passInputs.length === 0) return null;
    
    for (var i = 0; i < passInputs.length; i++) {
      var passInput = passInputs[i];
      if (passInput.offsetParent === null) continue;
      
      var container = passInput.closest('form, [role="dialog"], .modal, [class*="modal"], [class*="dialog"], [class*="login"], [class*="popup"]');
      
      if (!container) {
        container = passInput.parentElement;
        for (var lvl = 0; lvl < 3 && container; lvl++) {
          if (container.querySelector('input[type="email"], input[name="email"], input[id*="email"]')) break;
          container = container.parentElement;
        }
      }
      
      if (!container) continue;
      
      var emailInput = container.querySelector(
        'input[type="email"]:not([disabled]):not([readonly]):not([data-testid*="search"]), ' +
        'input[name="email"]:not([disabled]):not([readonly]):not([data-testid*="search"]), ' +
        'input[id*="email"]:not([disabled]):not([readonly]):not([data-testid*="search"]), ' +
        'input[autocomplete="email"]:not([disabled]):not([readonly]):not([data-testid*="search"])'
      );
      
      if (emailInput && emailInput.getAttribute("data-testid") && 
          emailInput.getAttribute("data-testid").indexOf("search") !== -1) {
        emailInput = null;
      }
      
      if (!emailInput) {
        var textInputs = container.querySelectorAll('input[type="text"]:not([disabled]):not([readonly])');
        for (var j = 0; j < textInputs.length; j++) {
          var ti = textInputs[j];
          var testid = ti.getAttribute("data-testid") || "";
          if (testid.indexOf("search") !== -1) continue;
          var placeholder = (ti.placeholder || "").toLowerCase();
          var name = (ti.name || "").toLowerCase();
          var id = (ti.id || "").toLowerCase();
          if (placeholder.indexOf("mail") !== -1 || name.indexOf("email") !== -1 || id.indexOf("email") !== -1) {
            emailInput = ti;
            break;
          }
        }
      }
      
      if (emailInput && emailInput.offsetParent !== null) {
        return { email: emailInput, pass: passInput, container: container };
      }
    }
    
    return null;
  }

  function _findSubmitButton(container) {
    if (container) {
      var btn = container.querySelector('button[type="submit"]:not([disabled])');
      if (btn) return btn;
      
      var btns = container.querySelectorAll('button:not([disabled])');
      for (var i = 0; i < btns.length; i++) {
        var b = btns[i];
        var txt = (b.textContent || "").toLowerCase().trim();
        if (txt.indexOf("ga verder") !== -1 || txt.indexOf("inloggen") !== -1 || 
            txt.indexOf("aanmelden") !== -1 || txt === "verder" ||
            txt.indexOf("login") !== -1) {
          return b;
        }
      }
    }
    return null;
  }

  async function _attemptFill() {
    // Snelle checks zonder storage calls
    if (_filling) return;
    if (!_credsCache) return;
    if (_credsCache.paused) return;
    if (!_credsCache.autologin || !_credsCache.email || !_credsCache.pass) return;

    var inputs = _findLoginInputs();
    if (!inputs) return;

    var testid = inputs.email.getAttribute("data-testid") || "";
    if (testid.indexOf("search") !== -1) return;

    // Skip als BEIDE velden al correct ingevuld
    if (inputs.email.value && inputs.email.value.toLowerCase() === _credsCache.email.toLowerCase() &&
        inputs.pass.value && inputs.pass.value.length > 3) {
      return;
    }

    _filling = true;
    _l("Login form gevonden, invullen email...");

    await _w(200);

    _setValue(inputs.email, _credsCache.email);
    await _w(300);
    
    if (inputs.email.value !== _credsCache.email) {
      _l("Email gereset, opnieuw");
      _setValue(inputs.email, _credsCache.email);
      await _w(300);
    }
    
    _l("Wachtwoord invullen...");
    _setValue(inputs.pass, _credsCache.pass);
    await _w(300);

    if (inputs.email.value !== _credsCache.email) {
      _l("Email leeg na pass-fill, abort");
      _filling = false;
      return;
    }

    var btn = _findSubmitButton(inputs.container);
    if (btn) {
      _l("Submit klikken");
      btn.click();
      _tap(btn);
    } else {
      _l("Geen submit knop gevonden");
    }

    setTimeout(function() { _filling = false; }, 2000);
  }

  // Throttled trigger: max 1x per 200ms
  function _triggerCheck() {
    if (_throttleTimer) return;
    var now = Date.now();
    var elapsed = now - _lastFillAttempt;
    var delay = elapsed >= 200 ? 0 : (200 - elapsed);
    
    _throttleTimer = setTimeout(function() {
      _throttleTimer = null;
      _lastFillAttempt = Date.now();
      _attemptFill();
    }, delay);
  }

  // Start: laad credentials, dan eerste poging
  _loadCreds(function() {
    setTimeout(_attemptFill, 600);
  });

  // MutationObserver met throttling
  var observer = new MutationObserver(_triggerCheck);
  observer.observe(document.body, { childList: true, subtree: true });
  window._fbAutologinObserver = observer;

  // SPA navigatie detectie
  function _onNavigate() {
    setTimeout(_attemptFill, 400);
    setTimeout(_attemptFill, 1200);
  }
  
  // Wrap history methodes maar alleen één keer
  if (!window._fbHistoryWrapped) {
    window._fbHistoryWrapped = true;
    var origPush = history.pushState;
    var origReplace = history.replaceState;
    history.pushState = function() {
      origPush.apply(history, arguments);
      window.dispatchEvent(new Event("fb-spa-navigate"));
    };
    history.replaceState = function() {
      origReplace.apply(history, arguments);
      window.dispatchEvent(new Event("fb-spa-navigate"));
    };
  }
  window.addEventListener("fb-spa-navigate", _onNavigate);
  window.addEventListener("popstate", _onNavigate);
  
  // Periodieke check als vangnet — elke 3s, max 30 minuten
  var checkCount = 0;
  var periodicCheck = setInterval(function() {
    checkCount++;
    if (checkCount > 600) {
      clearInterval(periodicCheck);
      return;
    }
    _attemptFill();
  }, 3000);
  window._fbAutologinInterval = periodicCheck;
})();
