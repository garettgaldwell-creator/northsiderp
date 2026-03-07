/**
 * NorthSide RP — Système Utilisateurs v2
 */
(function(w) {
  'use strict';
  var _UK = 'nrp_users_v1';
  var _SK = 'nrp_user_session';

  function _enc(obj) { try { return btoa(encodeURIComponent(JSON.stringify(obj))); } catch(e){ return null; } }
  function _dec(str) { try { return JSON.parse(decodeURIComponent(atob(str))); } catch(e){ return null; } }
  function _loadUsers() { try { var r=localStorage.getItem(_UK); return r?(_dec(r)||[]):[];} catch(e){return[];} }
  function _saveUsers(a) { try { var e=_enc(a); if(e) localStorage.setItem(_UK,e); } catch(e){} }
  function _loadSess() { try { return JSON.parse(localStorage.getItem(_SK)||'null')||null; } catch(e){return null;} }
  function _saveSess(o) { try { localStorage.setItem(_SK,JSON.stringify(o)); } catch(e){} }
  function _clearSess() { try { localStorage.removeItem(_SK); } catch(e){} }

  function _hash(p) {
    var h=0x811c9dc5, s='nrp_usr_salt_'+p.length;
    for(var i=0;i<p.length;i++){h^=p.charCodeAt(i);h=(h*0x01000193)>>>0;}
    for(var j=0;j<s.length;j++){h^=s.charCodeAt(j);h=(h*0x01000193)>>>0;}
    return h.toString(16).padStart(8,'0')+(h^0xdeadbeef).toString(16).padStart(8,'0');
  }

  var COLORS=['#e74c3c','#e67e22','#f1c40f','#2ecc71','#1abc9c','#3498db','#9b59b6','#e91e63'];
  function _color(p){var h=0;for(var i=0;i<p.length;i++)h+=p.charCodeAt(i);return COLORS[h%COLORS.length];}

  var ROLES={
    membre:    {label:'Membre',     color:'#aaa'},
    vip:       {label:'VIP',        color:'#f59e0b'},
    staff:     {label:'Staff',      color:'#3b9fd8'},
    moderateur:{label:'Modérateur', color:'#8b5cf6'},
    admin:     {label:'Admin',      color:'#e74c3c'}
  };

  function _esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

  var NRPUsers = {
    register: function(pseudo, email, password, steamid) {
      if(!pseudo||pseudo.length<3) return {ok:false,error:'Pseudo trop court (3 min).'};
      if(pseudo.length>20) return {ok:false,error:'Pseudo trop long (20 max).'};
      if(!/^[a-zA-Z0-9_\-]+$/.test(pseudo)) return {ok:false,error:'Pseudo : lettres, chiffres, _ ou - uniquement.'};
      if(!email||!email.includes('@')) return {ok:false,error:'Email invalide.'};
      if(!password||password.length<6) return {ok:false,error:'Mot de passe trop court (6 min).'};
      var users=_loadUsers();
      if(users.find(function(u){return u.pseudo.toLowerCase()===pseudo.toLowerCase();}))
        return {ok:false,error:'Ce pseudo est déjà pris.'};
      if(users.find(function(u){return u.email.toLowerCase()===email.toLowerCase();}))
        return {ok:false,error:'Cet email est déjà utilisé.'};
      var user={
        id:Date.now()+'-'+Math.random().toString(36).slice(2,6),
        pseudo:pseudo, email:email, steamid:steamid||'',
        pwd:_hash(password),
        role:users.length===0?'admin':'membre',
        color:_color(pseudo),
        joined:new Date().toLocaleDateString('fr-FR'),
        posts:0, bio:'', banned:false
      };
      users.push(user); _saveUsers(users);
      _saveSess({id:user.id,pseudo:user.pseudo,role:user.role,color:user.color,expiry:Date.now()+86400000*30});
      return {ok:true,user:user};
    },

    login: function(pseudo, password) {
      var users=_loadUsers();
      var user=users.find(function(u){return u.pseudo.toLowerCase()===pseudo.toLowerCase();});
      if(!user) return {ok:false,error:'Pseudo introuvable.'};
      if(user.banned) return {ok:false,error:'Ce compte est banni.'};
      if(user.pwd!==_hash(password)) return {ok:false,error:'Mot de passe incorrect.'};
      _saveSess({id:user.id,pseudo:user.pseudo,role:user.role,color:user.color,expiry:Date.now()+86400000*30});
      return {ok:true,user:user};
    },

    logout: function(){_clearSess();},

    current: function(){
      var s=_loadSess();
      if(!s||Date.now()>s.expiry){_clearSess();return null;}
      return s;
    },

    isLoggedIn: function(){return !!this.current();},

    get: function(pseudo){
      return _loadUsers().find(function(u){return u.pseudo.toLowerCase()===pseudo.toLowerCase();})||null;
    },

    incPosts: function(pseudo){
      var users=_loadUsers();
      var u=users.find(function(u){return u.pseudo.toLowerCase()===pseudo.toLowerCase();});
      if(u){u.posts=(u.posts||0)+1;_saveUsers(users);}
    },

    roleOf: function(pseudo){
      var u=this.get(pseudo);
      return u?(ROLES[u.role]||ROLES.membre):ROLES.membre;
    },

    all: function(){return _loadUsers();},

    /* Rend le header dynamique selon connexion */
    applyHeader: function(){
      var s=this.current();
      var actions=document.querySelector('.header-actions');
      var mobileActions=document.querySelector('.mobile-menu-actions');
      if(!actions) return;
      if(s){
        var r=ROLES[s.role]||ROLES.membre;
        var initial=s.pseudo[0].toUpperCase();
        var av='<div style="width:30px;height:30px;border-radius:50%;background:'+_esc(s.color||'#e74c3c')+';display:inline-flex;align-items:center;justify-content:center;font-family:\'Bebas Neue\',sans-serif;font-size:14px;color:#fff;flex-shrink:0;border:2px solid rgba(255,255,255,.15)">'+initial+'</div>';
        actions.innerHTML='<div style="display:flex;align-items:center;gap:10px">'+av+'<div style="display:flex;flex-direction:column;gap:1px"><span style="font-family:\'Bebas Neue\',sans-serif;font-size:14px;letter-spacing:2px;color:#f5f5ff">'+_esc(s.pseudo)+'</span><span style="font-family:\'Share Tech Mono\',monospace;font-size:9px;letter-spacing:1px;color:'+r.color+'">'+r.label+'</span></div><button onclick="NRPUsers.logout();location.reload()" class="btn btn-ghost" style="padding:5px 10px;font-size:10px;letter-spacing:2px">Déco</button></div>';
        if(mobileActions) mobileActions.innerHTML='<button onclick="NRPUsers.logout();location.reload()" class="btn btn-ghost" style="flex:1">Déconnexion</button>';
      }
    }
  };

  w.NRPUsers=NRPUsers;
  w._NRP_ROLES=ROLES;
})(window);
