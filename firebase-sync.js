// ════════════════════════════════════════
// Firebase — Auth + Database Sync
// ════════════════════════════════════════

var fbApp = firebase.initializeApp(CONFIG.firebase);
var fbAuth = firebase.auth();
var fbDB = firebase.database();

// ── Auth: support Google, Email/Pass, Anonymous ──
function fbSignInGoogle(onDone){
  var provider = new firebase.auth.GoogleAuthProvider();
  fbAuth.signInWithPopup(provider).then(function(result){
    onDone(result.user);
  }).catch(function(e){ console.error("Google sign-in:",e); });
}

function fbSignInEmail(email, password, isSignUp, onDone, onError){
  if(isSignUp){
    fbAuth.createUserWithEmailAndPassword(email, password).then(function(result){onDone(result.user);}).catch(function(e){onError(e.message);});
  } else {
    fbAuth.signInWithEmailAndPassword(email, password).then(function(result){onDone(result.user);}).catch(function(e){onError(e.message);});
  }
}

function fbSignInAnon(onDone){
  fbAuth.signInAnonymously().then(function(result){onDone(result.user);}).catch(function(e){console.error("Anon:",e);});
}

function fbOnAuth(cb){
  fbAuth.onAuthStateChanged(function(user){ cb(user); });
}

function fbSignOut(cb){
  fbAuth.signOut().then(function(){if(cb)cb();});
}

function fbGetUserName(uid, cb){
  fbDB.ref("users/"+uid+"/name").once("value").then(function(snap){ cb(snap.val()); });
}

function fbSetUserName(uid, name){
  fbDB.ref("users/"+uid+"/name").set(name);
}

function fbGetUserEmail(uid, cb){
  fbDB.ref("users/"+uid+"/email").once("value").then(function(snap){ cb(snap.val()); });
}

function fbSetUserProfile(uid, data){
  fbDB.ref("users/"+uid).update(data);
}

// ── Trip CRUD ──
function fbCreateTrip(myUid, myName, form){
  var tid = xid();
  var inv = Math.random().toString(36).substr(2,6).toUpperCase();
  var days = daysFromRange(form.sd, form.ed);
  var itin = {};
  days.forEach(function(d,i){ itin["d"+i] = d; });
  var cl = defaultChecklist();
  var memId = xid();
  var td = {
    id:tid, name:form.name||"טיול", nameEn:form.nameEn||"Trip",
    sd:form.sd||"2026-01-01", ed:form.ed||"", inv:inv, budget:0,
    createdBy:myUid,
    mems:{}, itin:itin, exps:{}, wl:{}, cl:cl,
    emergency:{police:"",ambulance:"",embassy:"",insurance:""}
  };
  td.mems[memId] = {id:memId, uid:myUid, name:myName, nameEn:myName, av:myName.charAt(0).toUpperCase(), c:MCOL[0], role:"admin"};
  fbDB.ref("trips/"+tid).set(td);
  fbDB.ref("userTrips/"+myUid+"/"+tid).set({id:tid, name:td.name, nameEn:td.nameEn, inv:inv});
  fbDB.ref("invites/"+inv).set(tid);
  return tid;
}

function fbDeleteTrip(tripId, myUid){
  // Remove from user's list
  fbDB.ref("userTrips/"+myUid+"/"+tripId).remove();
  // Optionally remove trip data (only if admin)
  fbDB.ref("trips/"+tripId+"/createdBy").once("value").then(function(snap){
    if(snap.val()===myUid){
      // Admin: delete the whole trip
      fbDB.ref("trips/"+tripId).once("value").then(function(tSnap){
        var td=tSnap.val();
        if(td&&td.inv) fbDB.ref("invites/"+td.inv).remove();
      });
      fbDB.ref("trips/"+tripId).remove();
    }
  });
}

function fbJoinTrip(myUid, myName, code, onSuccess, onFail){
  if(!code){ onFail("No code"); return; }
  fbDB.ref("invites/"+code.toUpperCase()).once("value").then(function(snap){
    var tid = snap.val();
    if(!tid){ onFail("Code not found"); return; }
    fbDB.ref("trips/"+tid).once("value").then(function(tSnap){
      var td = tSnap.val();
      if(!td){ onFail("Trip not found"); return; }
      // Check if already a member
      var already=false;
      if(td.mems){objArr(td.mems).forEach(function(m){if(m.uid===myUid)already=true;});}
      if(already){onSuccess(tid);return;}
      var memId = xid();
      var memCount = Object.keys(td.mems||{}).length;
      fbDB.ref("trips/"+tid+"/mems/"+memId).set({
        id:memId, uid:myUid, name:myName, nameEn:myName,
        av:myName.charAt(0).toUpperCase(), c:MCOL[memCount % MCOL.length], role:"member"
      });
      fbDB.ref("userTrips/"+myUid+"/"+tid).set({id:tid, name:td.name, nameEn:td.nameEn, inv:td.inv});
      onSuccess(tid);
    });
  });
}

function fbListenMyTrips(myUid, cb){
  var ref = fbDB.ref("userTrips/"+myUid);
  ref.on("value", function(snap){ cb(snap.val()||{}); });
  return function(){ ref.off(); };
}

function fbListenTrip(tripId, cb){
  var ref = fbDB.ref("trips/"+tripId);
  ref.on("value", function(snap){ cb(snap.val()); });
  return function(){ ref.off(); };
}

function fbUpdate(tripId, path, val){
  fbDB.ref("trips/"+tripId+"/"+path).set(val);
}

function fbUpdateTrip(tripId, myUid, updates){
  fbDB.ref("trips/"+tripId).update(updates);
  fbDB.ref("userTrips/"+myUid+"/"+tripId).update({name:updates.name, nameEn:updates.nameEn});
}
