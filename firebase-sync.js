// ════════════════════════════════════════
// Firebase — Auth + Database Sync
// ════════════════════════════════════════

var fbApp = firebase.initializeApp(CONFIG.firebase);
var fbAuth = firebase.auth();
var fbDB = firebase.database();

// ── Auth helpers ──
function fbSignIn(onDone){
  fbAuth.signInAnonymously().catch(function(e){ console.error("Auth:",e); });
  fbAuth.onAuthStateChanged(function(user){
    if(user) onDone(user);
  });
}

function fbGetUserName(uid, cb){
  fbDB.ref("users/"+uid+"/name").once("value").then(function(snap){ cb(snap.val()); });
}

function fbSetUserName(uid, name){
  fbDB.ref("users/"+uid+"/name").set(name);
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
    mems:{}, itin:itin, exps:{}, wl:{}, cl:cl,
    emergency:{police:"",ambulance:"",embassy:"",insurance:""}
  };
  td.mems[memId] = {id:memId, uid:myUid, name:myName, nameEn:myName, av:myName.charAt(0).toUpperCase(), c:MCOL[0]};
  fbDB.ref("trips/"+tid).set(td);
  fbDB.ref("userTrips/"+myUid+"/"+tid).set({id:tid, name:td.name, nameEn:td.nameEn, inv:inv});
  fbDB.ref("invites/"+inv).set(tid);
  return tid;
}

function fbJoinTrip(myUid, myName, code, onSuccess, onFail){
  if(!code){ onFail("No code"); return; }
  fbDB.ref("invites/"+code.toUpperCase()).once("value").then(function(snap){
    var tid = snap.val();
    if(!tid){ onFail("Code not found"); return; }
    fbDB.ref("trips/"+tid).once("value").then(function(tSnap){
      var td = tSnap.val();
      if(!td){ onFail("Trip not found"); return; }
      var memId = xid();
      var memCount = Object.keys(td.mems||{}).length;
      fbDB.ref("trips/"+tid+"/mems/"+memId).set({
        id:memId, uid:myUid, name:myName, nameEn:myName,
        av:myName.charAt(0).toUpperCase(), c:MCOL[memCount % MCOL.length]
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
