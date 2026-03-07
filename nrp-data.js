/**
 * NorthSide RP — Store central v2
 * Config  : localStorage clé nrp_cfg_v1  (base64 JSON)
 * Topics  : localStorage clé nrp_topics_v1 (base64 JSON)
 */
(function(w) {
  'use strict';

  var _CK = 'nrp_cfg_v1';
  var _TK = 'nrp_topics_v1';

  var DEFAULTS = {
    serverIp:        'xxx.xxx.xxx.xxx:27015',
    serverSteam:     '',
    serverMap:       'rp_truenorth_v1a',
    serverSlots:     '64',
    serverStatus:    'EN LIGNE',
    serverPlayers:   '0',
    discordUrl:      'https://discord.gg/northsidexp',
    bannerText:      'Serveur en developpement \u2014 Ouverture prochaine',
    annTitle:        'Bienvenue sur le forum officiel de Northside RP',
    annText:         'Le serveur est actuellement en developpement. Inscrivez-vous pour etre parmi les premiers membres de la communaute.',
    annSign:         "L'equipe Northside RP",
    socialSteam:     '',
    socialTwitter:   '',
    socialYoutube:   '',
    optInscriptions: true,
    optMaintenance:  false,
    optBandeau:      true,
    serverName:      'NorthSide RP',
    serverSlogan:    "Serious Roleplay \u2014 Garry's Mod",
    contactEmail:    '',
    membersCount:    '0',
    _adminToken:     null,
    _adminExpiry:    0
  };

  // ── Config ─────────────────────────────────────────────
  function _loadCfg() {
    try {
      var r = localStorage.getItem(_CK);
      return r ? Object.assign({}, DEFAULTS, JSON.parse(atob(r))) : Object.assign({}, DEFAULTS);
    } catch(e) { return Object.assign({}, DEFAULTS); }
  }
  function _saveCfg(obj) {
    try { localStorage.setItem(_CK, btoa(JSON.stringify(obj))); } catch(e) {}
  }

  // ── Topics ─────────────────────────────────────────────
  function _loadTopics() {
    try {
      var r = localStorage.getItem(_TK);
      return r ? JSON.parse(atob(r)) : {};
    } catch(e) { return {}; }
  }
  function _saveTopics(obj) {
    try { localStorage.setItem(_TK, btoa(JSON.stringify(obj))); } catch(e) {}
  }

  // ── API ────────────────────────────────────────────────
  var NRP = {

    /* CONFIG */
    get: function(k) { var d = _loadCfg(); return k in d ? d[k] : undefined; },
    set: function(kOrObj, val) {
      var d = _loadCfg();
      if (typeof kOrObj === 'object') Object.assign(d, kOrObj); else d[kOrObj] = val;
      _saveCfg(d);
    },
    all: function() { return _loadCfg(); },
    reset: function() {
      var d = _loadCfg();
      var t = d._adminToken, e = d._adminExpiry;
      var f = Object.assign({}, DEFAULTS); f._adminToken = t; f._adminExpiry = e;
      _saveCfg(f);
    },

    /* TOPICS */
    /**
     * Ajouter un topic dans une catégorie
     * @param {string} cat  ex: 'discussions', 'cand-police', 'debans'
     * @param {Object} post { author, title, content, [fields], [status] }
     * @returns {Object} topic avec id, date, time
     */
    addTopic: function(cat, post) {
      var all = _loadTopics();
      if (!all[cat]) all[cat] = [];
      var now = new Date();
      var topic = Object.assign({}, post, {
        id:     now.getTime() + '-' + Math.random().toString(36).slice(2, 7),
        date:   now.toLocaleDateString('fr-FR'),
        time:   now.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'}),
        status: post.status || 'ouvert'
      });
      all[cat].unshift(topic);
      _saveTopics(all);
      return topic;
    },

    /** Lire les topics d'une catégorie */
    getTopics: function(cat) {
      return _loadTopics()[cat] || [];
    },

    /** Tous les topics de toutes catégories */
    getAllTopics: function() {
      return _loadTopics();
    },

    /** Supprimer un topic */
    deleteTopic: function(cat, id) {
      var all = _loadTopics();
      if (!all[cat]) return;
      all[cat] = all[cat].filter(function(t){ return t.id !== id; });
      _saveTopics(all);
    },

    /** Changer le statut d'un topic */
    setTopicStatus: function(cat, id, status) {
      var all = _loadTopics();
      if (!all[cat]) return;
      all[cat] = all[cat].map(function(t){
        return t.id === id ? Object.assign({}, t, {status: status}) : t;
      });
      _saveTopics(all);
    },

    /** Nombre de topics dans une catégorie */
    countTopics: function(cat) {
      return (_loadTopics()[cat] || []).length;
    }
  };

  w.NRP = NRP;
})(window);
