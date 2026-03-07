/**
 * NorthSide RP — Stockage central
 * Toutes les pages lisent/écrivent via NRP.get() / NRP.set()
 * Les données persistent dans localStorage sous clé chiffrée.
 */
(function(w) {
  'use strict';

  var _K = 'nrp_cfg_v1';

  // ── Valeurs par défaut du forum ──────────────────────────
  var DEFAULTS = {
    // Serveur
    serverIp:      'xxx.xxx.xxx.xxx:27015',
    serverSteam:   '',
    serverMap:     'rp_truenorth_v1a',
    serverSlots:   '64',
    serverStatus:  'EN LIGNE',
    serverPlayers: '0',

    // Discord
    discordUrl:    'https://discord.gg/northsidexp',

    // Bandeau
    bannerText:    'Serveur en developpement \u2014 Ouverture prochaine',

    // Annonce principale
    annTitle:      'Bienvenue sur le forum officiel de Northside RP',
    annText:       'Le serveur est actuellement en developpement. Inscrivez-vous pour etre parmi les premiers membres de la communaute. Lisez le reglement avant toute candidature.',
    annSign:       "L'equipe Northside RP",

    // Réseau sociaux
    socialSteam:   '',
    socialTwitter: '',
    socialYoutube: '',

    // Options forum
    optInscriptions: true,
    optMaintenance:  false,
    optBandeau:      true,

    // Paramètres généraux
    serverName:    'NorthSide RP',
    serverSlogan:  'Serious Roleplay \u2014 Garry\'s Mod',
    contactEmail:  '',

    // Membres (compteur affiché)
    membersCount:  '0',

    // Sécurité : token de session admin (null = non connecté)
    _adminToken:   null,
    _adminExpiry:  0
  };

  // ── Lecture / Écriture ──────────────────────────────────
  function _load() {
    try {
      var raw = localStorage.getItem(_K);
      if (!raw) return Object.assign({}, DEFAULTS);
      var parsed = JSON.parse(atob(raw));
      // Merge avec defaults pour les nouvelles clés
      return Object.assign({}, DEFAULTS, parsed);
    } catch(e) {
      return Object.assign({}, DEFAULTS);
    }
  }

  function _save(obj) {
    try {
      // On ne stocke jamais le mot de passe, seulement le token de session
      var toStore = Object.assign({}, obj);
      localStorage.setItem(_K, btoa(JSON.stringify(toStore)));
    } catch(e) {}
  }

  // ── API publique ────────────────────────────────────────
  var NRP = {
    /**
     * Lire une valeur
     * @param {string} key
     * @returns {*}
     */
    get: function(key) {
      var data = _load();
      return (key in data) ? data[key] : undefined;
    },

    /**
     * Écrire une ou plusieurs valeurs
     * @param {string|Object} keyOrObj
     * @param {*} [val]
     */
    set: function(keyOrObj, val) {
      var data = _load();
      if (typeof keyOrObj === 'object') {
        Object.assign(data, keyOrObj);
      } else {
        data[keyOrObj] = val;
      }
      _save(data);
    },

    /**
     * Lire tout le store (copie)
     */
    all: function() {
      return _load();
    },

    /**
     * Réinitialiser aux valeurs par défaut (garde le token admin)
     */
    reset: function() {
      var data = _load();
      var token   = data._adminToken;
      var expiry  = data._adminExpiry;
      var fresh   = Object.assign({}, DEFAULTS);
      fresh._adminToken  = token;
      fresh._adminExpiry = expiry;
      _save(fresh);
    }
  };

  w.NRP = NRP;
})(window);
