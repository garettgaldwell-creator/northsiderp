/**
 * NorthSide RP — Lib Forum partagée
 * Inclure après nrp-data.js sur toutes les pages du forum.
 *
 * Fournit :
 *  NRPForum.renderTopics(cat, containerId, opts)  — affiche les topics
 *  NRPForum.submitForm(cat, fields, redirectUrl)   — poste un topic
 *  NRPForum.injectAdminBtn()                       — bouton admin discret footer
 *  NRPForum.applyBanner()                          — applique le bandeau dynamique
 */
(function(w) {
  'use strict';

  // ── Couleurs de statut ──────────────────────────────────
  var STATUS_LABEL = {
    ouvert:   { l:'OUVERT',    c:'#22c55e' },
    en_cours: { l:'EN COURS',  c:'#f59e0b' },
    accepte:  { l:'ACCEPTÉ',   c:'#3b9fd8' },
    refuse:   { l:'REFUSÉ',    c:'#e74c3c' },
    ferme:    { l:'FERMÉ',     c:'#555' }
  };

  function _statusBadge(s) {
    var st = STATUS_LABEL[s] || STATUS_LABEL.ouvert;
    return '<span style="font-family:\'Share Tech Mono\',monospace;font-size:9px;letter-spacing:2px;padding:3px 8px;border-radius:3px;background:'+st.c+'22;color:'+st.c+';border:1px solid '+st.c+'44">'+st.l+'</span>';
  }

  // ── HTML d'un topic dans la liste ──────────────────────
  function _topicRow(topic, opt) {
    var excerpt = (topic.content||'').replace(/<[^>]*>/g,'').substring(0,80);
    if (excerpt.length === 80) excerpt += '…';
    var admin = NRPAuth && NRPAuth.isLoggedIn();
    var del = admin
      ? '<button onclick="NRPForum.deleteTopic(\''+opt.cat+'\',\''+topic.id+'\',this)" style="background:none;border:none;cursor:pointer;color:#555;font-size:14px;padding:0 4px;transition:color .15s" title="Supprimer">🗑</button>'
      : '';
    var statusSel = admin
      ? '<select onchange="NRPForum.changeStatus(\''+opt.cat+'\',\''+topic.id+'\',this.value)" style="background:#131318;border:1px solid #26263a;color:#aaa;font-size:10px;border-radius:4px;padding:3px 6px;cursor:pointer;font-family:\'Share Tech Mono\',monospace;letter-spacing:1px">'
        + '<option value="ouvert"'+(topic.status==='ouvert'?' selected':'')  +'>Ouvert</option>'
        + '<option value="en_cours"'+(topic.status==='en_cours'?' selected':'')+'>En cours</option>'
        + '<option value="accepte"'+(topic.status==='accepte'?' selected':'') +'>Accepté</option>'
        + '<option value="refuse"'+(topic.status==='refuse'?' selected':'')  +'>Refusé</option>'
        + '<option value="ferme"'+(topic.status==='ferme'?' selected':'')    +'>Fermé</option>'
      + '</select>'
      : _statusBadge(topic.status);

    return '<div class="thread" style="flex-wrap:wrap;gap:6px" data-id="'+topic.id+'">'
      + '<div class="thread-icon">'+(opt.icon||'💬')+'</div>'
      + '<div class="thread-info" style="min-width:0;flex:1">'
      +   '<div class="thread-title" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'
      +     (topic.title ? '<span>'+_esc(topic.title)+'</span>' : '<span style="color:#555;font-style:italic">Sans titre</span>')
      +     _statusBadge(topic.status)
      +   '</div>'
      +   '<div class="thread-desc" style="font-size:11px;margin-top:2px">'
      +     '<span style="color:#e74c3c">'+_esc(topic.author||'Anonyme')+'</span>'
      +     '<span style="color:#444"> · '+topic.date+' à '+topic.time+'</span>'
      +     (excerpt ? '<span style="color:#555"> · '+_esc(excerpt)+'</span>' : '')
      +   '</div>'
      + '</div>'
      + '<div style="display:flex;align-items:center;gap:8px;flex-shrink:0">'
      +   statusSel
      +   del
      + '</div>'
      + '</div>';
  }

  function _esc(str) {
    return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── API publique ────────────────────────────────────────
  var NRPForum = {

    /**
     * Rend les topics dans le container
     * @param {string} cat          clé catégorie
     * @param {string} containerId  id du div à remplir
     * @param {Object} opts  { emptyMsg, icon, newUrl }
     */
    renderTopics: function(cat, containerId, opts) {
      opts = opts || {};
      var el = document.getElementById(containerId);
      if (!el) return;
      var topics = NRP.getTopics(cat);
      if (!topics.length) {
        el.innerHTML = '<div class="thread" style="justify-content:center;padding:40px;background:var(--dark);border:1px solid var(--border);border-top:none">'
          + '<div style="text-align:center">'
          +   '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:40px;color:#2a2a2a;letter-spacing:3px">VIDE</div>'
          +   '<div style="font-size:13px;color:#555;margin-top:4px">'+(opts.emptyMsg||'Aucun sujet pour le moment')+'</div>'
          +   (opts.newUrl ? '<a href="'+opts.newUrl+'" style="display:inline-block;margin-top:16px" class="btn btn-red">Créer</a>' : '')
          + '</div></div>';
        return;
      }
      var html = '';
      topics.forEach(function(t) { html += _topicRow(t, {cat: cat, icon: opts.icon||'💬'}); });
      el.innerHTML = html;

      // Met à jour le compteur s'il existe
      var cntEl = document.getElementById(containerId + '-count');
      if (cntEl) cntEl.textContent = topics.length + ' sujet' + (topics.length > 1 ? 's' : '');
    },

    /** Supprime un topic et re-rend (appelé par le bouton admin dans la liste) */
    deleteTopic: function(cat, id, btn) {
      if (!confirm('Supprimer ce topic ?')) return;
      NRP.deleteTopic(cat, id);
      var row = btn.closest('[data-id]');
      if (row) { row.style.opacity='0'; row.style.transition='opacity .3s'; setTimeout(function(){ row.remove(); }, 300); }
    },

    /** Change le statut d'un topic */
    changeStatus: function(cat, id, status) {
      NRP.setTopicStatus(cat, id, status);
    },

    /**
     * Soumet un formulaire → NRP.addTopic() → redirect
     * @param {string}   cat       clé catégorie
     * @param {Function} buildFn   function() → { author, title, content, fields? } | null (si validation échoue)
     * @param {string}   listUrl   page de redirection après succès
     */
    submitForm: function(cat, buildFn, listUrl) {
      var post = buildFn();
      if (!post) return;
      NRP.addTopic(cat, post);
      // Flash succès puis redirect
      var btn = document.querySelector('.btn-submit-topic');
      if (btn) { btn.textContent = '✓ Envoyé !'; btn.disabled = true; btn.style.background = '#1a9e4a'; }
      setTimeout(function() { window.location.href = listUrl; }, 900);
    },

    /**
     * Injecte le bouton admin discret dans le footer
     * (petit cadenas dans les liens footer)
     */
    injectAdminBtn: function() {
      var links = document.querySelector('.footer-links');
      if (!links) return;
      var a = document.createElement('a');
      a.href = '#';
      a.id   = 'nrp-admin-btn';
      a.title = 'Administration';
      a.style.cssText = 'opacity:.25;transition:opacity .2s;font-size:11px;letter-spacing:1px';
      a.textContent = '🔐 Admin';
      a.onmouseenter = function(){ a.style.opacity='0.9'; };
      a.onmouseleave = function(){ a.style.opacity='0.25'; };
      a.onclick = function(e) {
        e.preventDefault();
        // Si déjà connecté → va direct
        if (typeof NRPAuth !== 'undefined' && NRPAuth.isLoggedIn()) {
          window.location.href = ['adm','in','.html'].join('');
          return;
        }
        _openLoginModal();
      };
      links.appendChild(a);
    },

    /** Applique le bandeau header depuis le store */
    applyBanner: function() {
      var el = document.querySelector('.header-top');
      if (!el) return;
      var d = NRP.all();
      if (d.optBandeau === false) { el.style.display = 'none'; return; }
      if (d.bannerText) el.textContent = d.bannerText;
    }
  };

  // ── Modale login admin (injectée dans le DOM à la demande) ─
  function _openLoginModal() {
    var existing = document.getElementById('_nrp_adm_modal');
    if (existing) { existing.style.display = 'flex'; _focusInput(); return; }

    var overlay = document.createElement('div');
    overlay.id = '_nrp_adm_modal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center;';

    overlay.innerHTML = [
      '<div style="background:#0e0e12;border:1px solid #3d1515;border-top:2px solid #e74c3c;border-radius:16px;padding:36px 32px;width:340px;max-width:95vw;box-shadow:0 30px 80px rgba(0,0,0,.8);animation:_admIn .25s ease">',
        '<style>@keyframes _admIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}</style>',
        '<button onclick="document.getElementById(\'_nrp_adm_modal\').style.display=\'none\'" style="float:right;background:none;border:none;color:#44445a;font-size:18px;cursor:pointer;transition:color .2s" onmouseenter="this.style.color=\'#e74c3c\'" onmouseleave="this.style.color=\'#44445a\'">✕</button>',
        '<div style="font-family:\'Bebas Neue\',sans-serif;font-size:24px;letter-spacing:4px;color:#f5f5ff;margin-bottom:4px">ACCÈS RESTREINT</div>',
        '<div style="font-family:\'Share Tech Mono\',monospace;font-size:10px;letter-spacing:2px;color:#44445a;margin-bottom:24px">Zone protégée — Personnel autorisé</div>',
        '<input id="_nrp_adm_pwd" type="password" maxlength="32" autocomplete="off" spellcheck="false" placeholder="••••••"',
        ' style="width:100%;background:#131318;border:1px solid #26263a;color:#e8e8f2;font-family:Rajdhani,sans-serif;font-size:18px;padding:12px 16px;border-radius:8px;outline:none;letter-spacing:6px;text-align:center;box-sizing:border-box;transition:border-color .2s"',
        ' onfocus="this.style.borderColor=\'rgba(192,57,43,.5)\'" onblur="this.style.borderColor=\'#26263a\'"',
        ' onkeydown="if(event.key===\'Enter\')document.getElementById(\'_nrp_adm_sub\').click()">',
        '<button id="_nrp_adm_sub" onclick="NRPForum._doLogin()" style="width:100%;margin-top:14px;background:linear-gradient(135deg,#a02020,#e74c3c);color:#fff;border:none;border-radius:8px;font-family:\'Barlow Condensed\',sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;padding:12px;cursor:pointer;box-shadow:0 4px 14px rgba(192,57,43,.3);transition:all .2s">VALIDER</button>',
        '<div id="_nrp_adm_err" style="margin-top:10px;font-size:12px;color:#e74c3c;font-family:\'Share Tech Mono\',monospace;min-height:18px;text-align:center"></div>',
      '</div>'
    ].join('');

    overlay.addEventListener('click', function(e){ if(e.target===overlay) overlay.style.display='none'; });
    document.addEventListener('keydown', function(e){ if(e.key==='Escape' && overlay.style.display!=='none') overlay.style.display='none'; });
    document.body.appendChild(overlay);
    _focusInput();
  }

  function _focusInput() {
    setTimeout(function(){ var i=document.getElementById('_nrp_adm_pwd'); if(i) i.focus(); }, 80);
  }

  // Exposé pour le bouton inline du HTML de la modale
  NRPForum._doLogin = function() {
    var btn = document.getElementById('_nrp_adm_sub');
    var err = document.getElementById('_nrp_adm_err');
    var pwd = (document.getElementById('_nrp_adm_pwd')||{}).value || '';
    if (!pwd) return;
    if (btn) { btn.disabled = true; btn.textContent = 'Vérification…'; }
    NRPAuth.login(pwd).then(function(res) {
      if (res.ok) {
        if (err) err.textContent = '';
        window.location.href = ['adm','in','.html'].join('');
      } else {
        if (err) err.textContent = res.error || 'Erreur.';
        var i = document.getElementById('_nrp_adm_pwd'); if(i) i.value='';
        if (btn) { btn.disabled=false; btn.textContent='VALIDER'; }
      }
    });
  };

  w.NRPForum = NRPForum;
})(window);
