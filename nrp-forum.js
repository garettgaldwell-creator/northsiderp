/**
 * NorthSide RP — Lib Forum v3
 * - renderTopics : affiche la liste avec liens vers sujet.html
 * - submitForm   : poste un topic
 * - injectAdminBtn, applyBanner
 */
(function(w) {
  'use strict';

  var STATUS_C={ouvert:'#22c55e',en_cours:'#f59e0b',accepte:'#3b9fd8',refuse:'#e74c3c',ferme:'#555'};
  var STATUS_L={ouvert:'OUVERT',en_cours:'EN COURS',accepte:'ACCEPTÉ',refuse:'REFUSÉ',ferme:'FERMÉ'};

  function _esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  function _badge(s){
    var c=STATUS_C[s]||'#555', l=STATUS_L[s]||s;
    return '<span style="font-family:\'Share Tech Mono\',monospace;font-size:9px;letter-spacing:2px;padding:3px 8px;border-radius:3px;background:'+c+'22;color:'+c+';border:1px solid '+c+'44">'+l+'</span>';
  }

  function _topicRow(topic, opt) {
    var replies  = (topic.replies||[]).length;
    var likes    = (topic.likes||[]).length;
    var excerpt  = (topic.content||'').substring(0,70);
    if ((topic.content||'').length > 70) excerpt += '…';
    var isAdmin  = typeof NRPAuth!=='undefined' && NRPAuth.isLoggedIn();
    var url      = 'sujet.html?cat='+encodeURIComponent(opt.cat)+'&id='+encodeURIComponent(topic.id);

    var del = isAdmin
      ? '<button onclick="event.preventDefault();NRPForum.deleteTopic(\''+opt.cat+'\',\''+_esc(topic.id)+'\',this)" style="background:none;border:none;cursor:pointer;color:#555;font-size:13px;padding:0 4px;transition:color .15s;flex-shrink:0" title="Supprimer">🗑</button>'
      : '';
    var statusSel = isAdmin
      ? '<select onchange="event.preventDefault();NRPForum.changeStatus(\''+opt.cat+'\',\''+_esc(topic.id)+'\',this.value)" style="background:#131318;border:1px solid #26263a;color:#aaa;font-size:10px;border-radius:4px;padding:3px 6px;cursor:pointer;font-family:\'Share Tech Mono\',monospace;letter-spacing:1px">'
        +['ouvert','en_cours','accepte','refuse','ferme'].map(function(s){return '<option value="'+s+'"'+(topic.status===s?' selected':'')+'>'+STATUS_L[s]+'</option>';}).join('')
        +'</select>'
      : _badge(topic.status);

    return '<a href="'+url+'" class="thread" style="text-decoration:none">'
      +'<div class="thread-icon" style="font-size:20px">'+(opt.icon||'💬')+'</div>'
      +'<div class="thread-info" style="min-width:0;flex:1">'
      +  '<div class="thread-title" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'
      +    '<span>'+_esc(topic.title||'Sans titre')+'</span>'
      +    _badge(topic.status)
      +  '</div>'
      +  '<div class="thread-desc" style="font-size:11px;margin-top:2px">'
      +    '<span style="color:#e74c3c">'+_esc(topic.author||'Anonyme')+'</span>'
      +    '<span style="color:#444"> · '+_esc(topic.date)+'</span>'
      +    (replies ? '<span style="color:#555"> · '+replies+' réponse'+(replies>1?'s':'')+'</span>' : '')
      +    (likes   ? '<span style="color:#555"> · ♥ '+likes+'</span>' : '')
      +  '</div>'
      +(excerpt ? '<div style="font-size:11px;color:#333;margin-top:2px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">'+_esc(excerpt)+'</div>' : '')
      +'</div>'
      +'<div style="display:flex;align-items:center;gap:8px;flex-shrink:0" onclick="event.stopPropagation()">'
      +  statusSel + del
      +'</div>'
      +'</a>';
  }

  var NRPForum = {

    renderTopics: function(cat, containerId, opts) {
      opts = opts || {};
      var el = document.getElementById(containerId);
      if (!el) return;
      var topics = NRP.getTopics(cat);
      var cntEl  = document.getElementById(containerId+'-count');
      if (cntEl) cntEl.textContent = topics.length + ' sujet'+(topics.length>1?'s':'');

      if (!topics.length) {
        el.innerHTML = '<div class="thread" style="justify-content:center;padding:40px;background:var(--dark);border:1px solid var(--border);border-top:none"><div style="text-align:center"><div style="font-family:\'Bebas Neue\',sans-serif;font-size:40px;color:#2a2a2a;letter-spacing:3px">VIDE</div><div style="font-size:13px;color:#555;margin-top:4px">'+(opts.emptyMsg||'Aucun sujet')+'</div>'+(opts.newUrl?'<a href="'+opts.newUrl+'" style="display:inline-block;margin-top:16px" class="btn btn-red">Créer</a>':'')+'</div></div>';
        return;
      }
      var html='';
      topics.forEach(function(t){ html+=_topicRow(t,{cat:cat,icon:opts.icon||'💬'}); });
      el.innerHTML = html;
    },

    deleteTopic: function(cat, id, btn) {
      if (!confirm('Supprimer ce topic ?')) return;
      NRP.deleteTopic(cat, id);
      var row = btn ? btn.closest('a') : null;
      if (row) { row.style.opacity='0'; row.style.transition='opacity .3s'; setTimeout(function(){ row.remove(); },300); }
    },

    changeStatus: function(cat, id, status) {
      NRP.setTopicStatus(cat, id, status);
    },

    submitForm: function(cat, buildFn, listUrl) {
      var post = buildFn();
      if (!post) return;
      NRP.addTopic(cat, post);
      var btn = document.querySelector('.btn-submit-topic');
      if (btn) { btn.textContent='✓ Envoyé !'; btn.disabled=true; btn.style.background='#1a9e4a'; }
      setTimeout(function(){ window.location.href=listUrl; }, 900);
    },

    injectAdminBtn: function() {
      var links = document.querySelector('.footer-links');
      if (!links || document.getElementById('nrp-admin-btn')) return;
      var a = document.createElement('a');
      a.href='#'; a.id='nrp-admin-btn'; a.title='Administration';
      a.style.cssText='opacity:.22;transition:opacity .2s;font-size:10px;letter-spacing:1px';
      a.textContent='🔐 Admin';
      a.onmouseenter=function(){a.style.opacity='0.9';};
      a.onmouseleave=function(){a.style.opacity='0.22';};
      a.onclick=function(e){
        e.preventDefault();
        if (typeof NRPAuth!=='undefined' && NRPAuth.isLoggedIn()){
          window.location.href=['adm','in','.html'].join(''); return;
        }
        if (typeof openAdmModal==='function') openAdmModal();
        else _openLoginModal();
      };
      links.appendChild(a);
    },

    applyBanner: function() {
      var el = document.querySelector('.header-top');
      if (!el) return;
      var d = NRP.all();
      if (d.optBandeau===false){el.style.display='none';return;}
      if (d.bannerText) el.textContent = d.bannerText;
    }
  };

  // Modale login admin (pour pages sans modale intégrée)
  function _openLoginModal() {
    var ov = document.getElementById('_nrp_adm_modal');
    if (ov){ ov.style.display='flex'; _fi(); return; }
    ov = document.createElement('div');
    ov.id='_nrp_adm_modal';
    ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.85);backdrop-filter:blur(8px);z-index:9999;display:flex;align-items:center;justify-content:center';
    ov.innerHTML='<div style="background:#0e0e12;border:1px solid #3d1515;border-top:2px solid #e74c3c;border-radius:16px;padding:36px 32px;width:340px;max-width:95vw;box-shadow:0 30px 80px rgba(0,0,0,.8)">'
      +'<button onclick="document.getElementById(\'_nrp_adm_modal\').style.display=\'none\'" style="float:right;background:none;border:none;color:#44445a;font-size:18px;cursor:pointer">✕</button>'
      +'<div style="font-family:\'Bebas Neue\',sans-serif;font-size:24px;letter-spacing:4px;color:#f5f5ff;margin-bottom:4px">ACCÈS ADMIN</div>'
      +'<input id="_nrp_adm_pwd" type="password" placeholder="Code d\'accès" style="width:100%;background:#131318;border:1px solid #26263a;color:#e8e8f2;font-size:18px;padding:12px 16px;border-radius:8px;outline:none;letter-spacing:6px;text-align:center;box-sizing:border-box;margin:16px 0" onkeydown="if(event.key===\'Enter\')NRPForum._doAdmLogin()">'
      +'<button onclick="NRPForum._doAdmLogin()" style="width:100%;background:linear-gradient(135deg,#a02020,#e74c3c);color:#fff;border:none;border-radius:8px;font-size:12px;letter-spacing:3px;padding:12px;cursor:pointer">VALIDER</button>'
      +'<div id="_nrp_adm_err" style="margin-top:8px;font-size:12px;color:#e74c3c;font-family:\'Share Tech Mono\',monospace;text-align:center;min-height:16px"></div>'
      +'</div>';
    ov.addEventListener('click',function(e){if(e.target===ov)ov.style.display='none';});
    document.body.appendChild(ov);
    _fi();
  }
  function _fi(){setTimeout(function(){var i=document.getElementById('_nrp_adm_pwd');if(i)i.focus();},80);}

  NRPForum._doAdmLogin = function() {
    var pwd=(document.getElementById('_nrp_adm_pwd')||{}).value||'';
    if(!pwd) return;
    NRPAuth.login(pwd).then(function(res){
      if(res.ok){ window.location.href=['adm','in','.html'].join(''); }
      else {
        var e=document.getElementById('_nrp_adm_err');
        if(e) e.textContent=res.error||'Erreur.';
        var i=document.getElementById('_nrp_adm_pwd');if(i)i.value='';
      }
    });
  };

  w.NRPForum = NRPForum;
})(window);
