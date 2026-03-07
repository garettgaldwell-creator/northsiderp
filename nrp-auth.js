/**
 * NorthSide RP — Auth Admin
 * Le token de session est stocké dans sa propre clé JSON simple (pas de btoa)
 * pour éviter tout problème d'encodage au rechargement de page.
 */
(function(w) {
  'use strict';

  // Hash SHA-256 de (salt + password), découpé pour éviter la lecture directe
  var _H = ['263e8934','ef05952c','cdeb22b8','568aa626',
             'a7e6476f','d50d1981','6ad21afd','85bacc73'].join('');
  var _S = ['nrp_','x9k_','2026','_s3c','ur3'].join('');

  // Clé dédiée pour le token — JSON simple, pas de btoa
  var _SK = 'nrp_session';

  // Brute-force
  var _LK = 'nrp_lock';
  var _MAX = 5;
  var _DELAY = 15 * 60 * 1000;

  function _readSession() {
    try { return JSON.parse(localStorage.getItem(_SK) || 'null') || {}; }
    catch(e) { return {}; }
  }
  function _writeSession(obj) {
    try { localStorage.setItem(_SK, JSON.stringify(obj)); } catch(e) {}
  }
  function _clearSession() {
    try { localStorage.removeItem(_SK); } catch(e) {}
  }

  function _getLock() {
    try { return JSON.parse(sessionStorage.getItem(_LK) || 'null') || {tries:0,until:0}; }
    catch(e) { return {tries:0,until:0}; }
  }
  function _setLock(d) {
    try { sessionStorage.setItem(_LK, JSON.stringify(d)); } catch(e) {}
  }
  function _clearLock() {
    try { sessionStorage.removeItem(_LK); } catch(e) {}
  }

  function _genToken() {
    var a = new Uint8Array(16);
    crypto.getRandomValues(a);
    return Array.from(a).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
  }

  function _sha256(str) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str)).then(function(buf) {
      return Array.from(new Uint8Array(buf)).map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
    });
  }

  var Auth = {

    isLoggedIn: function() {
      var s = _readSession();
      if (s.token && s.expiry && Date.now() < s.expiry) return true;
      _clearSession();
      return false;
    },

    login: function(password) {
      var lock = _getLock();
      if (Date.now() < lock.until) {
        var rem = Math.ceil((lock.until - Date.now()) / 60000);
        return Promise.resolve({ ok:false, error:'Trop de tentatives. Réessayez dans '+rem+' min.' });
      }
      return _sha256(_S + password).then(function(hash) {
        if (hash === _H) {
          _clearLock();
          _writeSession({ token: _genToken(), expiry: Date.now() + 7200000 });
          return { ok: true };
        }
        lock.tries = (lock.tries||0) + 1;
        if (lock.tries >= _MAX) { lock.until = Date.now() + _DELAY; lock.tries = 0; }
        _setLock(lock);
        var left = _MAX - lock.tries;
        return { ok:false, error: left > 0
          ? 'Code incorrect. '+left+' tentative(s) restante(s).'
          : 'Accès bloqué 15 minutes.' };
      });
    },

    logout: function() { _clearSession(); _clearLock(); },

    requireAuth: function() {
      if (!this.isLoggedIn()) w.location.replace('index.html');
    }
  };

  w.NRPAuth = Auth;
})(window);
