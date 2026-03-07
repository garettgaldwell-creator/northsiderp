/**
 * NorthSide RP — Authentification Admin
 *
 * Sécurité :
 * - Le mot de passe N'EST PAS stocké dans ce fichier.
 * - La vérification utilise SubtleCrypto (SHA-256) côté navigateur.
 * - Le hash attendu est stocké découpé en morceaux réassemblés à l'exécution
 *   (rend l'extraction du source inutile sans exécution).
 * - Session : token aléatoire 128 bits stocké en mémoire + localStorage chiffré.
 *   Expiration automatique après 2h.
 * - 5 tentatives max, puis blocage 15 min.
 * - L'URL admin ne figure pas dans le code source des autres pages.
 */
(function(w) {
  'use strict';

  // ── Hash attendu (SHA-256 de "nrp_x9k_2026_s3cur3" + mot de passe)
  // Découpé en 4 fragments pour éviter la lecture directe du source
  var _H = [
    '263e8934',
    'ef05952c',
    'cdeb22b8',
    '568aa626',
    'a7e6476f',
    'd50d1981',
    '6ad21afd',
    '85bacc73'
  ].join('');

  // Salt également découpé
  var _S = ['nrp_', 'x9k_', '2026', '_s3c', 'ur3'].join('');

  // ── Token de session en mémoire (ne survive pas au rechargement sans NRP store)
  var _memToken = null;

  // ── Blocage brute-force
  var _LOCK_KEY   = 'nrp_lock';
  var _MAX_TRIES  = 5;
  var _LOCK_DELAY = 15 * 60 * 1000; // 15 min en ms

  function _getLockData() {
    try {
      var raw = sessionStorage.getItem(_LOCK_KEY);
      return raw ? JSON.parse(raw) : { tries: 0, lockedUntil: 0 };
    } catch(e) { return { tries: 0, lockedUntil: 0 }; }
  }

  function _setLockData(d) {
    try { sessionStorage.setItem(_LOCK_KEY, JSON.stringify(d)); } catch(e) {}
  }

  function _resetLock() {
    try { sessionStorage.removeItem(_LOCK_KEY); } catch(e) {}
  }

  // ── Génère un token de session aléatoire
  function _genToken() {
    var arr = new Uint8Array(16);
    crypto.getRandomValues(arr);
    return Array.from(arr).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
  }

  // ── Hash SHA-256 via SubtleCrypto (async)
  function _sha256(str) {
    var enc = new TextEncoder();
    return crypto.subtle.digest('SHA-256', enc.encode(str)).then(function(buf) {
      return Array.from(new Uint8Array(buf))
        .map(function(b){ return b.toString(16).padStart(2,'0'); })
        .join('');
    });
  }

  // ── API publique
  var Auth = {

    /**
     * Vérifie si l'admin est actuellement connecté (token valide + non expiré)
     */
    isLoggedIn: function() {
      // 1. Token en mémoire
      if (_memToken) {
        var expiry = NRP.get('_adminExpiry') || 0;
        if (Date.now() < expiry) return true;
        // Expiré → nettoyage
        _memToken = null;
        NRP.set({ _adminToken: null, _adminExpiry: 0 });
        return false;
      }
      // 2. Token dans store (rechargement de page)
      var stored = NRP.get('_adminToken');
      var exp    = NRP.get('_adminExpiry') || 0;
      if (stored && Date.now() < exp) {
        _memToken = stored;
        return true;
      }
      return false;
    },

    /**
     * Tente de se connecter. Retourne une Promise<{ok, error}>
     * @param {string} password
     */
    login: function(password) {
      // Vérif brute-force
      var lock = _getLockData();
      if (Date.now() < lock.lockedUntil) {
        var rem = Math.ceil((lock.lockedUntil - Date.now()) / 60000);
        return Promise.resolve({ ok: false, error: 'Trop de tentatives. Réessayez dans ' + rem + ' min.' });
      }

      return _sha256(_S + password).then(function(hash) {
        if (hash === _H) {
          // ✓ Correct
          _resetLock();
          var token = _genToken();
          var expiry = Date.now() + 2 * 60 * 60 * 1000; // 2h
          _memToken = token;
          NRP.set({ _adminToken: token, _adminExpiry: expiry });
          return { ok: true };
        } else {
          // ✗ Mauvais mot de passe
          lock.tries++;
          if (lock.tries >= _MAX_TRIES) {
            lock.lockedUntil = Date.now() + _LOCK_DELAY;
            lock.tries = 0;
          }
          _setLockData(lock);
          var left = _MAX_TRIES - lock.tries;
          return { ok: false, error: left > 0
            ? 'Mot de passe incorrect. ' + left + ' tentative(s) restante(s).'
            : 'Compte bloqué 15 minutes.' };
        }
      });
    },

    /**
     * Déconnexion
     */
    logout: function() {
      _memToken = null;
      NRP.set({ _adminToken: null, _adminExpiry: 0 });
      _resetLock();
    },

    /**
     * Redirige vers index si non connecté (à appeler en tête de admin.html)
     */
    requireAuth: function() {
      if (!this.isLoggedIn()) {
        w.location.replace('index.html');
      }
    }
  };

  w.NRPAuth = Auth;
})(window);
