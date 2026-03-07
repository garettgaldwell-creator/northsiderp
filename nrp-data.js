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
    membersCount:    '0'
  };

  // ── Encodage unicode-safe (btoa natif ne supporte pas les accents) ──
  function _encode(obj) {
    try {
      // encodeURIComponent échappe tout > 0x7F, btoa ne voit que de l'ASCII
      return btoa(encodeURIComponent(JSON.stringify(obj)));
    } catch(e) { return null; }
  }
  function _decode(str) {
    try {
      return JSON.parse(decodeURIComponent(atob(str)));
    } catch(e) { return null; }
  }

  // ── Config ─────────────────────────────────────────────
  function _loadCfg() {
    try {
      var r = localStorage.getItem(_CK);
      if (!r) return Object.assign({}, DEFAULTS);
      var parsed = _decode(r);
      return parsed ? Object.assign({}, DEFAULTS, parsed) : Object.assign({}, DEFAULTS);
    } catch(e) { return Object.assign({}, DEFAULTS); }
  }
  function _saveCfg(obj) {
    try {
      var enc = _encode(obj);
      if (enc) localStorage.setItem(_CK, enc);
    } catch(e) {}
  }

  // ── Topics ─────────────────────────────────────────────
  function _loadTopics() {
    try {
      var r = localStorage.getItem(_TK);
      if (!r) return {};
      return _decode(r) || {};
    } catch(e) { return {}; }
  }
  function _saveTopics(obj) {
    try {
      var enc = _encode(obj);
      if (enc) localStorage.setItem(_TK, enc);
    } catch(e) {}
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
      _saveCfg(Object.assign({}, DEFAULTS));
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
    },

    // ── REPLIES ────────────────────────────────────────────
    /** Ajouter une réponse à un topic */
    addReply: function(cat, topicId, reply) {
      var all = _loadTopics();
      var topics = all[cat] || [];
      var t = topics.find(function(t){ return t.id === topicId; });
      if (!t) return null;
      if (!t.replies) t.replies = [];
      var r = Object.assign({}, reply, {
        id:   Date.now() + '-' + Math.random().toString(36).slice(2,6),
        date: new Date().toLocaleDateString('fr-FR'),
        time: new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}),
        likes: []
      });
      t.replies.push(r);
      _saveTopics(all);
      return r;
    },

    /** Supprimer une réponse */
    deleteReply: function(cat, topicId, replyId) {
      var all = _loadTopics();
      var t = (all[cat]||[]).find(function(t){ return t.id === topicId; });
      if (!t || !t.replies) return;
      t.replies = t.replies.filter(function(r){ return r.id !== replyId; });
      _saveTopics(all);
    },

    // ── LIKES ──────────────────────────────────────────────
    /** Liker / unliker un post (topic ou reply). Retourne le nouveau tableau de likes */
    toggleLike: function(cat, topicId, pseudo, replyId) {
      var all = _loadTopics();
      var t = (all[cat]||[]).find(function(t){ return t.id === topicId; });
      if (!t) return [];
      var target = replyId ? (t.replies||[]).find(function(r){ return r.id === replyId; }) : t;
      if (!target) return [];
      if (!target.likes) target.likes = [];
      var idx = target.likes.indexOf(pseudo);
      if (idx >= 0) target.likes.splice(idx, 1);
      else target.likes.push(pseudo);
      _saveTopics(all);
      return target.likes;
    },

    /** Lire un topic précis */
    getTopic: function(cat, topicId) {
      return (_loadTopics()[cat]||[]).find(function(t){ return t.id === topicId; }) || null;
    }
  };

  w.NRP = NRP;
})(window);
