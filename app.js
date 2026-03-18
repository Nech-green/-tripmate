// ════════════════════════════════════════
// TripMate — Main App (JSX)
// ════════════════════════════════════════
var {useState, useEffect, useRef, useMemo, useCallback} = React;

// ── Item Form ──
function IForm(props){
  var t=L[props.ln]; var ln=props.ln;
  var blank={type:"attraction",title:"",titleEn:"",time:"",endTime:"",location:"",lat:0,lng:0,notes:"",
    flightNum:"",tzOrigin:"Asia/Jerusalem",tzDest:"Europe/Athens",terminal:"",gate:"",
    checkInDate:"",checkOutDate:"",
    transportSub:"bus",fromLocation:"",fromLat:0,fromLng:0,toLocation:"",toLat:0,toLng:0,
    price:0,priceCur:"ILS",customCatName:"",files:[]};
  var _d=useState(props.item?Object.assign({},blank,props.item):blank),d=_d[0],setD=_d[1];
  var mk=ln==="he"?"title":"titleEn";
  var s=function(k,v){setD(function(p){var n=Object.assign({},p);n[k]=v;return n;});};

  return <div>
    <Fld l={t.cat||""} ch={<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
      {TYPES.map(function(tp){return <Chip key={tp} on={d.type===tp} c={CLR[tp]} fn={function(){s("type",tp);}} ch={<span>{EMJ[tp]} {t.ty[tp]}</span>} />;})}
    </div>} />
    {d.type==="custom" && <Fld l={t.customCat} ch={<Inp value={d.customCatName||""} onChange={function(e){s("customCatName",e.target.value);}} />} />}
    <Fld l={t.title} ch={<Inp value={d[mk]} onChange={function(e){s(mk,e.target.value);}} />} />
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
      <Fld l={t.time} ch={<Inp type="time" value={d.time} onChange={function(e){s("time",e.target.value);}} />} />
      <Fld l={t.end} ch={<Inp type="time" value={d.endTime||""} onChange={function(e){s("endTime",e.target.value);}} />} />
    </div>

    {d.type==="flight" && <div style={{background:"var(--acS)",borderRadius:10,padding:10,marginBottom:11}}>
      <div style={{fontSize:11,fontWeight:700,color:"var(--ac)",marginBottom:6}}>✈️ {t.ty.flight}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <Fld l={t.fnum} ch={<Inp value={d.flightNum||""} onChange={function(e){s("flightNum",e.target.value);}} placeholder="LY 315" />} />
        <Fld l={t.term} ch={<Inp value={d.terminal||""} onChange={function(e){s("terminal",e.target.value);}} placeholder="T3" />} />
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <Fld l={t.tz1} ch={<Sel v={d.tzOrigin||"UTC"} fn={function(e){s("tzOrigin",e.target.value);}} ops={TZS.map(function(z){return{v:z,l:z.split("/").pop()};})} />} />
        <Fld l={t.tz2} ch={<Sel v={d.tzDest||"UTC"} fn={function(e){s("tzDest",e.target.value);}} ops={TZS.map(function(z){return{v:z,l:z.split("/").pop()};})} />} />
      </div>
      <Fld l={t.gate} ch={<Inp value={d.gate||""} onChange={function(e){s("gate",e.target.value);}} placeholder="B12" />} />
    </div>}

    {d.type==="hotel" && <div style={{background:"#A855F712",borderRadius:10,padding:10,marginBottom:11}}>
      <div style={{fontSize:11,fontWeight:700,color:"#A855F7",marginBottom:6}}>🏨 {t.ty.hotel}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <Fld l={t.checkIn+" 📅"} ch={<Inp type="date" value={d.checkInDate||""} onChange={function(e){s("checkInDate",e.target.value);}} />} />
        <Fld l={t.checkOut+" 📅"} ch={<Inp type="date" value={d.checkOutDate||""} onChange={function(e){s("checkOutDate",e.target.value);}} />} />
      </div>
    </div>}

    {d.type==="transport" && <div style={{background:"#FFB34712",borderRadius:10,padding:10,marginBottom:11}}>
      <div style={{fontSize:11,fontWeight:700,color:"#FFB347",marginBottom:6}}>🚌 {t.transType}</div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
        {TRANSPORT_SUB.map(function(ts){return <Chip key={ts} on={d.transportSub===ts} c="#FFB347" fn={function(){s("transportSub",ts);}} ch={<span>{EMJ[ts]||"🚐"} {t.trSub[ts]||ts}</span>} />;})}
      </div>
      <Fld l={t.fromLoc+" 📍"} ch={<PlIn val={d.fromLocation||""} ph={t.search} onPick={function(loc){setD(function(p){return Object.assign({},p,{fromLocation:loc.location,fromLat:loc.lat,fromLng:loc.lng});});}} />} />
      <Fld l={t.toLoc+" 📍"} ch={<PlIn val={d.toLocation||""} ph={t.search} onPick={function(loc){setD(function(p){return Object.assign({},p,{toLocation:loc.location,toLat:loc.lat,toLng:loc.lng});});}} />} />
    </div>}

    {d.type!=="transport" && <Fld l={"📍 "+t.loc} ch={<div>
      <PlIn val={d.location} ph={t.search} onPick={function(loc){setD(function(p){return Object.assign({},p,loc);});}} />
      {d.lat!==0 && <p style={{fontSize:9,color:"var(--ac)",marginTop:3}}>✓ {d.location}</p>}
    </div>} />}

    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8}}>
      <Fld l={"💰 "+t.price} ch={<Inp type="number" value={d.price||""} onChange={function(e){s("price",parseFloat(e.target.value)||0);}} placeholder="0" />} />
      <Fld l={t.cur} ch={<Sel v={d.priceCur||"ILS"} fn={function(e){s("priceCur",e.target.value);}} ops={CURS.map(function(c){return{v:c,l:c};})} />} />
    </div>

    <Fld l={t.notes} ch={<textarea value={d.notes} onChange={function(e){s("notes",e.target.value);}} style={Object.assign({},IS,{minHeight:50})} />} />

    <Fld l={"📎 "+(ln==="he"?"מסמכים / תמונות":"Documents / Photos")} ch={<div>
      <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:6}}>
        {(d.files||[]).map(function(f,fi){return <span key={fi} style={{display:"flex",alignItems:"center",gap:3,padding:"3px 7px",borderRadius:6,background:"var(--sf)",border:"1px solid var(--bd)",fontSize:9}}>
          {f.type==="image"?"🖼️":"📄"} {(f.name||"file").slice(0,15)}
          <button onClick={function(){var nf=(d.files||[]).slice();nf.splice(fi,1);s("files",nf);}} style={{background:"none",border:"none",color:"var(--mt)",cursor:"pointer",padding:0,fontSize:10}}>✕</button>
        </span>;})}
      </div>
      <div style={{display:"flex",gap:6}}>
        <label style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"7px 10px",borderRadius:8,border:"2px dashed var(--bd)",cursor:"pointer",fontSize:10,fontWeight:600,color:"var(--mt)"}}>
          📄 {ln==="he"?"מסמך":"Doc"}
          <input type="file" accept=".pdf,.doc,.docx,.txt" style={{display:"none"}} onChange={function(e){var f=e.target.files&&e.target.files[0];if(!f)return;s("files",(d.files||[]).concat([{name:f.name,type:"doc"}]));e.target.value="";}} />
        </label>
        <label style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:4,padding:"7px 10px",borderRadius:8,border:"2px dashed var(--bd)",cursor:"pointer",fontSize:10,fontWeight:600,color:"var(--mt)"}}>
          📷 {ln==="he"?"תמונה":"Photo"}
          <input type="file" accept="image/*" style={{display:"none"}} onChange={function(e){var f=e.target.files&&e.target.files[0];if(!f)return;s("files",(d.files||[]).concat([{name:f.name,type:"image"}]));e.target.value="";}} />
        </label>
      </div>
    </div>} />

    <div style={{display:"flex",gap:6,marginTop:8}}>
      <Bt ch={"✓ "+t.save} fn={function(){props.onSave(d);}} st={{flex:1,justifyContent:"center"}} />
      {props.isEd&&props.onDel && <Bt vr="danger" ch="🗑" fn={props.onDel} />}
      <Bt vr="secondary" ch={t.cancel} fn={props.onCancel} />
    </div>
  </div>;
}

// ════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════
function App(){
  var _ln=useState("he"),ln=_ln[0],setLn=_ln[1];
  var _uid=useState(null),myUid=_uid[0],setMyUid=_uid[1];
  var _name=useState(""),myName=_name[0],setMyName=_name[1];
  var _authed=useState(false),authed=_authed[0],setAuthed=_authed[1];
  var _trips=useState({}),trips=_trips[0],setTrips=_trips[1];
  var _aId=useState(null),aId=_aId[0],setAId=_aId[1];
  var _trip=useState(null),trip=_trip[0],setTrip=_trip[1];
  var _loading=useState(true),loading=_loading[0],setLoading=_loading[1];
  var _authMode=useState("choose"),authMode=_authMode[0],setAuthMode=_authMode[1];
  var _authEmail=useState(""),authEmail=_authEmail[0],setAuthEmail=_authEmail[1];
  var _authPass=useState(""),authPass=_authPass[0],setAuthPass=_authPass[1];
  var _authErr=useState(""),authErr=_authErr[0],setAuthErr=_authErr[1];
  var t=L[ln];

  // Auth listener
  useEffect(function(){
    fbOnAuth(function(user){
      if(user){
        setMyUid(user.uid);
        fbGetUserName(user.uid, function(n){
          if(n){setMyName(n);setAuthed(true);}
          else if(user.displayName){
            fbSetUserProfile(user.uid,{name:user.displayName,email:user.email||""});
            setMyName(user.displayName);setAuthed(true);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  },[]);

  // Back button: push state when entering a trip
  useEffect(function(){
    if(aId){
      window.history.pushState({tripId:aId},"");
    }
    function onPop(e){
      if(aId){
        e.preventDefault();
        setAId(null);setTrip(null);
      }
    }
    window.addEventListener("popstate",onPop);
    return function(){window.removeEventListener("popstate",onPop);};
  },[aId]);

  useEffect(function(){
    if(!myUid) return;
    return fbListenMyTrips(myUid, function(data){setTrips(data);});
  },[myUid]);

  useEffect(function(){
    if(!aId){setTrip(null);return;}
    return fbListenTrip(aId, function(data){
      if(data) setTrip(data);
      else {setTrip(null);setAId(null);}
    });
  },[aId]);

  // Handle auth
  function doGoogleSignIn(){
    fbSignInGoogle(function(user){
      setMyUid(user.uid);
      fbSetUserProfile(user.uid,{name:user.displayName||"",email:user.email||""});
      setMyName(user.displayName||"");setAuthed(true);
    });
  }
  function doEmailAuth(isSignUp){
    setAuthErr("");
    fbSignInEmail(authEmail,authPass,isSignUp,function(user){
      setMyUid(user.uid);
      fbGetUserName(user.uid,function(n){if(n){setMyName(n);setAuthed(true);}else{setAuthMode("name");}});
    },function(err){setAuthErr(err);});
  }
  function doSaveName(){
    if(myName.trim()&&myUid){fbSetUserProfile(myUid,{name:myName.trim()});setMyName(myName.trim());setAuthed(true);}
  }

  if(loading) return <Spinner />;

  // ── Auth Screen ──
  if(!myUid) return <div style={{maxWidth:400,margin:"0 auto",padding:"50px 20px",textAlign:"center"}}>
    <h1 style={{fontSize:30,fontWeight:800,color:"var(--txt)",marginBottom:4}}>✈️ TripMate</h1>
    <p style={{color:"var(--mt)",marginBottom:30,fontSize:13}}>{ln==="he"?"תכנון טיולים קבוצתי":"Group Trip Planner"}</p>

    {authMode==="choose" && <div>
      <Bt ch={<span>🔵 {ln==="he"?"התחבר עם גוגל":"Sign in with Google"}</span>} fn={doGoogleSignIn} st={{width:"100%",justifyContent:"center",padding:"13px 20px",fontSize:14,marginBottom:10,background:"#4285F4"}} />
      <Bt ch={<span>📧 {ln==="he"?"אימייל וסיסמה":"Email & Password"}</span>} fn={function(){setAuthMode("email");}} vr="secondary" st={{width:"100%",justifyContent:"center",padding:"13px 20px",fontSize:14,marginBottom:10}} />
      <button onClick={function(){fbSignInAnon(function(user){setMyUid(user.uid);setAuthMode("name");});}} style={{background:"none",border:"none",color:"var(--mt)",cursor:"pointer",fontSize:12,marginTop:8}}>{ln==="he"?"המשך בלי חשבון (אנונימי)":"Continue without account"}</button>
    </div>}

    {authMode==="email" && <div>
      <Fld l={ln==="he"?"אימייל":"Email"} ch={<Inp type="email" value={authEmail} onChange={function(e){setAuthEmail(e.target.value);}} />} />
      <Fld l={ln==="he"?"סיסמה":"Password"} ch={<Inp type="password" value={authPass} onChange={function(e){setAuthPass(e.target.value);}} />} />
      {authErr && <p style={{color:"var(--err)",fontSize:11,marginBottom:8}}>{authErr}</p>}
      <Bt ch={ln==="he"?"התחבר":"Sign In"} fn={function(){doEmailAuth(false);}} st={{width:"100%",justifyContent:"center",marginBottom:8}} />
      <Bt ch={ln==="he"?"צור חשבון חדש":"Create Account"} fn={function(){doEmailAuth(true);}} vr="secondary" st={{width:"100%",justifyContent:"center",marginBottom:8}} />
      <button onClick={function(){setAuthMode("choose");}} style={{background:"none",border:"none",color:"var(--mt)",cursor:"pointer",fontSize:11}}>← {ln==="he"?"חזור":"Back"}</button>
    </div>}

    {authMode==="name" && <div>
      <p style={{color:"var(--mt)",marginBottom:16}}>{ln==="he"?"איך קוראים לך?":"What's your name?"}</p>
      <Inp value={myName} onChange={function(e){setMyName(e.target.value);}} style={{textAlign:"center",fontSize:16,marginBottom:16}} />
      <Bt ch={t.setName} fn={doSaveName} st={{width:"100%",justifyContent:"center",padding:"12px 20px",fontSize:15}} />
    </div>}

    <button onClick={function(){setLn(ln==="he"?"en":"he");}} style={{background:"none",border:"none",color:"var(--mt)",cursor:"pointer",marginTop:20,fontSize:12}}>{ln==="he"?"English":"עברית"}</button>
  </div>;

  // ── Name screen (for anon users) ──
  if(!authed) return <div style={{maxWidth:400,margin:"0 auto",padding:"60px 20px",textAlign:"center"}}>
    <h1 style={{fontSize:28,fontWeight:800,color:"var(--txt)",marginBottom:8}}>✈️ TripMate</h1>
    <p style={{color:"var(--mt)",marginBottom:24}}>{ln==="he"?"איך קוראים לך?":"What's your name?"}</p>
    <Inp value={myName} onChange={function(e){setMyName(e.target.value);}} style={{textAlign:"center",fontSize:16,marginBottom:16}} />
    <Bt ch={t.setName} fn={doSaveName} st={{width:"100%",justifyContent:"center",padding:"12px 20px",fontSize:15}} />
  </div>;

  if(!aId||!trip) return <TripList trips={objArr(trips)} ln={ln} setLn={setLn} t={t} myName={myName} myUid={myUid}
    onCreate={function(f){var tid=fbCreateTrip(myUid,myName,f);setAId(tid);}}
    onJoin={function(code){fbJoinTrip(myUid,myName,code,function(tid){setAId(tid);},function(msg){alert(msg);});}}
    onPick={function(id2){setAId(id2);}}
    onDelete={function(tid){if(confirm(ln==="he"?"למחוק את הטיול?":"Delete this trip?")){fbDeleteTrip(tid,myUid);}}}
    onLogout={function(){fbSignOut(function(){setMyUid(null);setAuthed(false);setMyName("");});}}
    onEditName={function(newName){if(newName&&myUid){fbSetUserName(myUid,newName);setMyName(newName);}}} />;

  return <TripView trip={trip} aId={aId} myUid={myUid} myName={myName} ln={ln} setLn={setLn} t={L[ln]} onBack={function(){setAId(null);setTrip(null);}} />;
}

// ── Trip List Screen ──
function TripList(props){
  var t=props.t; var ln=props.ln;
  var _m=useState(null),mod=_m[0],setMod=_m[1];
  var _f=useState({name:"",nameEn:"",sd:"",ed:""}),f=_f[0],setF=_f[1];
  var _jc=useState(""),jc=_jc[0],setJc=_jc[1];
  var _editingName=useState(false),editingName=_editingName[0],setEditingName=_editingName[1];
  var _newName=useState(props.myName),newName=_newName[0],setNewName=_newName[1];
  return <div style={{maxWidth:480,margin:"0 auto",padding:"28px 16px",minHeight:"100vh"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
      <h1 style={{fontSize:22,fontWeight:800,color:"var(--txt)"}}>✈️ TripMate</h1>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <button onClick={function(){setMod("profile");setNewName(props.myName);}} style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",color:"var(--ac)",fontWeight:700}}>{(props.myName||"?").charAt(0).toUpperCase()}</button>
        <button onClick={function(){props.setLn(ln==="he"?"en":"he");}} style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:8,padding:"4px 10px",cursor:"pointer",fontSize:11,fontWeight:600,color:"var(--txt)"}}>{ln==="he"?"EN":"עב"}</button>
      </div>
    </div>
    {props.trips.length===0 && <p style={{textAlign:"center",padding:40,color:"var(--mt)"}}>✈️ {t.noT}</p>}
    {props.trips.map(function(tr){return <div key={tr.id} style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:14,padding:14,marginBottom:8,display:"flex",alignItems:"center",gap:8}}>
      <button onClick={function(){props.onPick(tr.id);}} style={{flex:1,background:"none",border:"none",cursor:"pointer",textAlign:"inherit",padding:0}}>
        <h3 style={{fontSize:15,fontWeight:700,color:"var(--txt)",margin:0}}>{ln==="he"?tr.name:tr.nameEn||tr.name}</h3>
        <p style={{fontSize:11,color:"var(--mt)",margin:"2px 0 0"}}>{t.invite}: {tr.inv}</p>
      </button>
      <button onClick={function(){props.onDelete(tr.id);}} style={{background:"none",border:"none",color:"var(--mt)",cursor:"pointer",opacity:.4,fontSize:14,flexShrink:0}}>🗑</button>
    </div>;})}
    <div style={{display:"flex",gap:8,marginTop:12}}>
      <button onClick={function(){setF({name:"",nameEn:"",sd:"",ed:""});setMod("new");}} style={{flex:1,padding:14,borderRadius:12,border:"2px dashed var(--bd)",background:"transparent",color:"var(--ac)",cursor:"pointer",fontWeight:700,fontSize:14}}>+ {t.newT}</button>
      <button onClick={function(){setJc("");setMod("join");}} style={{flex:1,padding:14,borderRadius:12,background:"var(--acS)",border:"1px solid var(--bd)",color:"var(--ac)",cursor:"pointer",fontWeight:700,fontSize:14}}>🔗 {t.join}</button>
    </div>
    <Mod open={mod==="new"} onClose={function(){setMod(null);}} title={t.newT} ch={<div>
      <Fld l={t.tName} ch={<Inp value={ln==="he"?f.name:f.nameEn} onChange={function(e){if(ln==="he")setF(Object.assign({},f,{name:e.target.value}));else setF(Object.assign({},f,{nameEn:e.target.value}));}} />} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        <Fld l={t.start} ch={<Inp type="date" value={f.sd} onChange={function(e){setF(Object.assign({},f,{sd:e.target.value}));}} />} />
        <Fld l={t.stop} ch={<Inp type="date" value={f.ed} onChange={function(e){setF(Object.assign({},f,{ed:e.target.value}));}} />} />
      </div>
      <Bt ch={t.create} fn={function(){props.onCreate(f);setMod(null);}} st={{width:"100%",justifyContent:"center",marginTop:8}} />
    </div>} />
    <Mod open={mod==="join"} onClose={function(){setMod(null);}} title={t.join} ch={<div>
      <Fld l={t.joinCode} ch={<Inp value={jc} onChange={function(e){setJc(e.target.value.toUpperCase());}} style={{textAlign:"center",fontSize:18,letterSpacing:3,fontWeight:700}} />} />
      <Bt ch={t.joinBtn} fn={function(){props.onJoin(jc);setMod(null);}} st={{width:"100%",justifyContent:"center",marginTop:8}} />
    </div>} />
    <Mod open={mod==="profile"} onClose={function(){setMod(null);}} title={ln==="he"?"פרופיל":"Profile"} ch={<div>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{width:50,height:50,borderRadius:"50%",background:"var(--ac)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,margin:"0 auto 8px"}}>{(props.myName||"?").charAt(0).toUpperCase()}</div>
        <p style={{fontSize:14,fontWeight:700,color:"var(--txt)",margin:0}}>{props.myName}</p>
      </div>
      <Fld l={ln==="he"?"שם תצוגה":"Display Name"} ch={<Inp value={newName} onChange={function(e){setNewName(e.target.value);}} />} />
      <Bt ch={ln==="he"?"שמור שם":"Save Name"} fn={function(){if(newName.trim()){props.onEditName(newName.trim());setMod(null);}}} st={{width:"100%",justifyContent:"center",marginBottom:10}} />
      <Bt ch={ln==="he"?"🚪 התנתק":"🚪 Sign Out"} vr="danger" fn={function(){props.onLogout();setMod(null);}} st={{width:"100%",justifyContent:"center"}} />
    </div>} />
  </div>;
}

// ── Trip View Screen ── (the big one, but now without services code)
// Rate fetcher
function fetchRates(setCvRates,current){
  fetch("https://api.exchangerate-api.com/v4/latest/ILS").then(function(r){return r.json();}).then(function(data){
    if(data&&data.rates){var nr=Object.assign({},current);CURS.forEach(function(c){if(data.rates[c])nr[c]=parseFloat((1/data.rates[c]).toFixed(3));});setCvRates(nr);}
  }).catch(function(){});
}

function TripView(props){
  var trip=props.trip; var aId=props.aId; var ln=props.ln; var t=L[ln]; var isR=ln==="he";
  var _tab=useState("home"),tab=_tab[0],setTab=_tab[1];
  var _mod=useState(null),mod=_mod[0],setMod=_mod[1];
  var _eIt=useState(null),eIt=_eIt[0],setEIt=_eIt[1];
  var _sD=useState(0),sD=_sD[0],setSd=_sD[1];
  var _vA=useState(""),vA=_vA[0],setVA=_vA[1];
  var _eS=useState("list"),eS=_eS[0],setES=_eS[1];
  var _mD=useState(-1),mD=_mD[0],setMD=_mD[1];
  var _mvW=useState(null),mvW=_mvW[0],setMvW=_mvW[1];
  var _ne=useState({desc:"",amount:"",currency:"EUR",paidBy:"",splitBetween:[],scope:"shared"}),ne=_ne[0],setNe=_ne[1];
  var _nw=useState({title:"",titleEn:"",location:"",lat:0,lng:0,notes:""}),nw=_nw[0],setNw=_nw[1];
  var _nm=useState(""),nm=_nm[0],setNm=_nm[1];
  var _tf=useState({}),tf=_tf[0],setTf=_tf[1];
  var _cp=useState(false),cp=_cp[0],setCp=_cp[1];
  var _nci=useState({text:"",textEn:"",cat:"misc",qty:1}),nci=_nci[0],setNci=_nci[1];
  var _clCat=useState("all"),clCat=_clCat[0],setClCat=_clCat[1];
  var _cvAmt=useState(""),cvAmt=_cvAmt[0],setCvAmt=_cvAmt[1];
  var _cvFrom=useState("EUR"),cvFrom=_cvFrom[0],setCvFrom=_cvFrom[1];
  var _cvTo=useState("ILS"),cvTo=_cvTo[0],setCvTo=_cvTo[1];
  var _cvRates=useState(Object.assign({},DEFAULT_RATES)),cvRates=_cvRates[0],setCvRates=_cvRates[1];
  // Auto-fetch rates on mount
  useEffect(function(){fetchRates(setCvRates,DEFAULT_RATES);},[]);
  // Drive
  var _gTok=useState(null),gTok=_gTok[0],setGTok=_gTok[1];
  var _gPhotos=useState([]),gPhotos=_gPhotos[0],setGPhotos=_gPhotos[1];
  var _gFolder=useState(null),gFolder=_gFolder[0],setGFolder=_gFolder[1];
  var _gLoad=useState(false),gLoad2=_gLoad[0],setGLoad2=_gLoad[1];
  var _gUp=useState(false),gUp=_gUp[0],setGUp=_gUp[1];

  function updF(path,val){fbUpdate(aId,path,val);}

  var mems=objArr(trip.mems||{});
  var exps=objArr(trip.exps||{});
  var wl=objArr(trip.wl||{});
  var itin=objArr(trip.itin||{}).sort(function(a,b){return a.dn-b.dn;});
  var cl=objArr(trip.cl||{});
  if(!vA&&mems.length>0) setVA(mems[0].id);
  var me=mems.find(function(m){return m.id===vA;})||mems[0]||{id:"",name:"?",nameEn:"?",av:"?",c:"#888"};
  var myS=pSpent(trip.exps,vA);
  var totS=exps.reduce(function(s,e){return e?s+toILS(e.amount||0,e.currency||"ILS"):s;},0);
  var setts=settle(trip.exps,trip.mems);
  var day=itin[sD]||itin[0]||{dn:1,dt:"",items:{}};
  var dayItems=objArr(day.items||{});
  var dayCost=dayItems.reduce(function(s,it){return s+toILS(it.price||0,it.priceCur||"ILS");},0);

  var mPts=[];
  if(mD===-1){itin.forEach(function(d){objArr(d.items||{}).forEach(function(i){if(i&&i.lat&&i.lng)mPts.push(Object.assign({},i));});});}
  else if(itin[mD]){objArr(itin[mD].items||{}).forEach(function(i){if(i&&i.lat&&i.lng)mPts.push(Object.assign({},i));});}
  wl.forEach(function(w){if(w&&w.lat&&w.lng)mPts.push(Object.assign({},w,{isW:true}));});

  var nav=[{k:"home",e:"🏠",l:t.home},{k:"itinerary",e:"📅",l:t.itin},{k:"map",e:"🗺️",l:t.map},{k:"expenses",e:"💰",l:t.exp},{k:"more",e:"⚙️",l:t.more}];
  var fab=function(fn){return <button onClick={fn} style={{position:"fixed",bottom:70,left:isR?16:"auto",right:isR?"auto":16,width:50,height:50,borderRadius:14,background:"var(--cta)",color:"#fff",border:"none",boxShadow:"0 4px 16px rgba(255,107,52,.35)",cursor:"pointer",fontSize:22,display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>+</button>;};
  function shareLink(){var url=window.location.origin+window.location.pathname+"?join="+trip.inv;if(navigator.clipboard){navigator.clipboard.writeText(url);setCp(true);setTimeout(function(){setCp(false);},2000);}if(navigator.share){navigator.share({title:"TripMate",text:t.joinCode+": "+trip.inv,url:url}).catch(function(){});}}

  // Drive helpers
  function connectDrive(){
    driveAuth(function(token){
      setGTok(token);setGLoad2(true);
      var folderName="TripMate - "+(trip.name||trip.nameEn||"Trip");
      driveFindOrCreateFolder(token,folderName,trip.driveFolderId||null,function(fid){
        setGFolder(fid);
        if(!trip.driveFolderId) updF("driveFolderId",fid);
        driveListPhotos(token,fid,function(photos){setGPhotos(photos);setGLoad2(false);});
      });
    });
  }
  function doUpload(file){
    if(!gTok||!gFolder) return;
    setGUp(true);
    driveUploadPhoto(gTok,gFolder,file,function(f){
      if(f) setGPhotos(function(prev){return [f].concat(prev);});
      setGUp(false);
    });
  }

  return <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh"}}>
    <header style={{position:"sticky",top:0,zIndex:90,background:"var(--nav)",backdropFilter:"blur(16px)",borderBottom:"1px solid var(--bd)",padding:"9px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <button onClick={props.onBack} style={{background:"var(--sf)",border:"none",borderRadius:8,width:30,height:30,cursor:"pointer",fontSize:14,color:"var(--txt)",display:"flex",alignItems:"center",justifyContent:"center"}}>←</button>
        <div><h1 style={{fontSize:15,fontWeight:800,color:"var(--txt)",margin:0}}>{ln==="he"?trip.name:trip.nameEn}</h1><p style={{fontSize:9,color:"var(--mt)",margin:0}}>{trip.sd} — {trip.ed}</p></div>
      </div>
      <div style={{display:"flex",gap:4}}>
        <button onClick={function(){setTf({name:trip.name,nameEn:trip.nameEn,sd:trip.sd,ed:trip.ed,budget:trip.budget||0});setMod("editT");}} style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:8,padding:"4px 7px",cursor:"pointer",fontSize:12,color:"var(--txt)"}}>✏️</button>
        <button onClick={function(){props.setLn(ln==="he"?"en":"he");}} style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:8,padding:"4px 8px",cursor:"pointer",fontSize:10,fontWeight:600,color:"var(--txt)"}}>{ln==="he"?"EN":"עב"}</button>
      </div>
    </header>

    <main style={{padding:14,paddingBottom:78}}>
      {/* HOME */}
      {tab==="home" && <div>
        <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:10}}>
          <span style={{fontSize:10,color:"var(--mt)",fontWeight:600}}>{t.view}</span>
          {mems.map(function(m){return <button key={m.id} onClick={function(){setVA(m.id);}} style={{width:24,height:24,borderRadius:"50%",border:vA===m.id?"2.5px solid "+m.c:"2.5px solid transparent",background:m.c,color:"#fff",fontSize:9,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{m.av}</button>;})}
        </div>
        <div style={{background:"linear-gradient(135deg,var(--gA),var(--gB))",borderRadius:16,padding:18,color:"#fff",marginBottom:14}}>
          <p style={{fontSize:11,opacity:.8,margin:0,color:"#fff"}}>{t.myB} — {ln==="he"?me.name:me.nameEn}</p>
          <p style={{fontSize:28,fontWeight:800,margin:"4px 0",color:"#fff"}}>{money(Math.round(myS),"ILS")}</p>
          <p style={{fontSize:11,opacity:.6,margin:0,color:"#fff"}}>{t.grpB}: {money(Math.round(totS),"ILS")}</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:16}}>
          {[{k:"itinerary",e:"📅",l:t.itin},{k:"map",e:"🗺️",l:t.map},{k:"expenses",e:"💰",l:t.exp},{k:"photos",e:"📷",l:t.photos},{k:"more",e:"👥",l:t.grp},{k:"checklist",e:"✅",l:t.chk}].map(function(a){return <button key={a.k} onClick={function(){setTab(a.k);}} style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:12,padding:"10px 4px",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}><span style={{fontSize:20}}>{a.e}</span><span style={{fontSize:10,fontWeight:600,color:"var(--txt)"}}>{a.l}</span></button>;})}
        </div>
        {itin.length>0 && objArr((itin[0]||{}).items||{}).slice(0,4).map(function(it){if(!it)return null;return <div key={it.id||Math.random()} style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:10,padding:10,marginBottom:6,display:"flex",alignItems:"center",gap:8,borderRight:"3px solid "+(CLR[it.type]||"#888")}}><span style={{fontSize:18}}>{it.transportSub?EMJ[it.transportSub]:(EMJ[it.type]||"📌")}</span><div style={{flex:1}}><p style={{fontSize:12,fontWeight:600,color:"var(--txt)",margin:0}}>{ln==="he"?it.title:it.titleEn||it.title}</p><p style={{fontSize:10,color:"var(--mt)",margin:0}}>{it.time||""} · {it.location||""}</p></div>{it.price>0 && <span style={{fontSize:10,fontWeight:700,color:"var(--ok)"}}>{money(it.price,it.priceCur||"ILS")}</span>}</div>;})}
      </div>}

      {/* ITINERARY */}
      {tab==="itinerary" && <div>
        <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:8}}>{itin.map(function(d,i){return <button key={i} onClick={function(){setSd(i);}} style={{flexShrink:0,padding:"7px 15px",borderRadius:10,border:sD===i?"2px solid var(--ac)":"1px solid var(--bd)",background:sD===i?"var(--ac)":"var(--card)",color:sD===i?"#fff":"var(--txt)",cursor:"pointer"}}><div style={{fontSize:10}}>{t.day} {d.dn}</div><div style={{fontSize:9,opacity:.6}}>{(d.dt||"").slice(5)}</div></button>;})}
          <button onClick={function(){var dn=itin.length+1;var last=itin[itin.length-1];var nd="";if(last&&last.dt){var dd=new Date(last.dt);dd.setDate(dd.getDate()+1);nd=dd.toISOString().split("T")[0];}updF("itin/d"+itin.length,{dn:dn,dt:nd,items:{}});}} style={{flexShrink:0,padding:"7px 15px",borderRadius:10,border:"2px dashed var(--bd)",background:"transparent",color:"var(--mt)",cursor:"pointer"}}>+</button>
        </div>
        {dayCost>0 && <div style={{background:"var(--acS)",borderRadius:8,padding:"6px 10px",marginBottom:8,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:10,color:"var(--mt)"}}>{t.day} {day.dn} {t.total}:</span><span style={{fontSize:12,fontWeight:700,color:"var(--ac)"}}>{money(Math.round(dayCost),"ILS")}</span></div>}
        {dayItems.length===0 && <p style={{textAlign:"center",padding:30,color:"var(--mt)"}}>{t.noI}</p>}
        {dayItems.map(function(it,idx){if(!it)return null;var emoji=it.transportSub?EMJ[it.transportSub]:(EMJ[it.type]||"📌");var typeName=it.type==="transport"&&it.transportSub?(t.trSub[it.transportSub]||""):(t.ty[it.type]||"");
          return <div key={it.id||idx} onClick={function(){setEIt(it);setMod("editI");}} style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:11,padding:11,marginBottom:8,borderTop:"3px solid "+(CLR[it.type]||"#888"),cursor:"pointer"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:10,fontWeight:600,color:CLR[it.type]||"#888"}}>{emoji} {typeName} · {it.time||""}{it.endTime?" — "+it.endTime:""}</span><div style={{display:"flex",gap:4,alignItems:"center"}}>{it.price>0 && <span style={{fontSize:10,fontWeight:700,color:"var(--ok)",background:"var(--ok)"+"15",padding:"1px 6px",borderRadius:5}}>{money(it.price,it.priceCur||"ILS")}</span>}<span style={{color:"var(--mt)",fontSize:11}}>✏️</span></div></div>
            <p style={{fontSize:13,fontWeight:700,color:"var(--txt)",margin:"0 0 2px"}}>{ln==="he"?it.title:it.titleEn||it.title}</p>
            <p style={{fontSize:10,color:"var(--mt)",margin:0}}>📍 {it.location||""}</p>
            {it.flightNum && <span style={{fontSize:9,fontWeight:700,color:CLR.flight,background:CLR.flight+"15",padding:"1px 6px",borderRadius:4,display:"inline-block",marginTop:3}}>{it.flightNum}{it.terminal?" · T"+it.terminal:""}{it.gate?" · Gate "+it.gate:""}</span>}
            {it.checkInDate && <span style={{fontSize:9,color:"#A855F7",display:"inline-block",marginTop:3,marginRight:6}}>🔑 {it.checkInDate} → {it.checkOutDate||""}</span>}
            {it.transportSub&&it.fromLocation && <p style={{fontSize:9,color:"var(--warn)",marginTop:3}}>{it.fromLocation} → {it.toLocation||""}</p>}
            {it.files&&it.files.length>0 && <span style={{fontSize:8,color:"var(--ac)",marginTop:2,display:"inline-block"}}>📎 {it.files.length} {ln==="he"?"קבצים":"files"}</span>}
          </div>;})}
        {fab(function(){setEIt(null);setMod("addI");})}
        <Mod open={mod==="addI"||mod==="editI"} onClose={function(){setMod(null);}} title={mod==="addI"?t.add+" "+t.itin:t.edit} ch={
          <IForm item={mod==="editI"?eIt:null} isEd={mod==="editI"} ln={ln}
            onSave={function(d){var itemId=mod==="editI"&&eIt?eIt.id:xid();updF("itin/d"+sD+"/items/"+itemId,Object.assign({},d,{id:itemId}));setMod(null);}}
            onDel={eIt?function(){updF("itin/d"+sD+"/items/"+eIt.id,null);setMod(null);}:null}
            onCancel={function(){setMod(null);}} />} />
      </div>}

      {/* MAP */}
      {tab==="map" && <div>
        <div style={{display:"flex",gap:4,overflowX:"auto",marginBottom:10}}>
          <button onClick={function(){setMD(-1);}} style={{flexShrink:0,padding:"6px 11px",borderRadius:8,border:mD===-1?"2px solid var(--ac)":"1px solid var(--bd)",background:mD===-1?"var(--ac)":"var(--card)",color:mD===-1?"#fff":"var(--txt)",cursor:"pointer",fontSize:11,fontWeight:600}}>{t.all}</button>
          {itin.map(function(_,i){return <button key={i} onClick={function(){setMD(i);}} style={{flexShrink:0,padding:"6px 11px",borderRadius:8,border:mD===i?"2px solid var(--ac)":"1px solid var(--bd)",background:mD===i?"var(--ac)":"var(--card)",color:mD===i?"#fff":"var(--txt)",cursor:"pointer",fontSize:11,fontWeight:600}}>{t.day} {i+1}</button>;})}
        </div>
        <GMap pts={mPts} ln={ln} />
        <div style={{marginTop:10}}>{mPts.map(function(p,i){if(!p)return null;return <div key={(p.id||"")+i} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 0",borderBottom:"1px solid var(--bd)"}}><span style={{width:22,height:22,borderRadius:"50%",background:p.isW?"#E84393":(CLR[p.type]||"#888"),color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0}}>{p.isW?"♥":i+1}</span><div style={{flex:1}}><p style={{fontSize:12,fontWeight:600,color:"var(--txt)",margin:0}}>{ln==="he"?p.title:p.titleEn||p.title}</p><p style={{fontSize:9,color:"var(--mt)",margin:0}}>{p.location||""}</p></div>{p.price>0 && <span style={{fontSize:9,fontWeight:700,color:"var(--ok)"}}>{money(p.price,p.priceCur||"ILS")}</span>}</div>;})}</div>
      </div>}

      {/* PHOTOS */}
      {tab==="photos" && <div>
        <h2 style={{fontSize:16,fontWeight:700,color:"var(--txt)",margin:"0 0 12px"}}>📷 {t.photos}</h2>
        {!gTok && <div style={{textAlign:"center",padding:30}}>
          <p style={{fontSize:40,marginBottom:12}}>📸</p>
          <p style={{color:"var(--mt)",marginBottom:16,fontSize:13}}>{ln==="he"?"התחבר לגוגל דרייב כדי לשתף תמונות":"Connect Google Drive to share photos"}</p>
          <Bt ch={ln==="he"?"🔗 התחבר לדרייב":"🔗 Connect Drive"} fn={connectDrive} st={{padding:"12px 24px",fontSize:14}} />
        </div>}
        {gTok && <div>
          <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:14,borderRadius:12,border:"2px dashed var(--bd)",background:"var(--sf)",cursor:"pointer",marginBottom:14,opacity:gUp?0.5:1}}>
            <span style={{fontSize:20}}>📷</span><span style={{fontSize:13,fontWeight:600,color:"var(--ac)"}}>{gUp?(ln==="he"?"מעלה...":"Uploading..."):(ln==="he"?"העלה תמונה":"Upload Photo")}</span>
            <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={function(e){var files=e.target.files;if(!files)return;for(var i=0;i<files.length;i++){doUpload(files[i]);}e.target.value="";}} disabled={gUp} />
          </label>
          {gFolder && <a href={"https://drive.google.com/drive/folders/"+gFolder} target="_blank" rel="noopener" style={{display:"block",textAlign:"center",fontSize:11,color:"var(--ac)",marginBottom:14,textDecoration:"none"}}>📂 {ln==="he"?"פתח תיקייה בדרייב":"Open Drive Folder"}</a>}
          {gLoad2 && <Spinner />}
          {!gLoad2&&gPhotos.length===0 && <p style={{textAlign:"center",padding:20,color:"var(--mt)"}}>📸 {ln==="he"?"העלו את התמונה הראשונה!":"Upload the first photo!"}</p>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>{gPhotos.map(function(ph){var thumb=ph.thumbnailLink||("https://drive.google.com/thumbnail?id="+ph.id+"&sz=w300");var dl=ph.webContentLink||("https://drive.google.com/uc?export=download&id="+ph.id);return <div key={ph.id} style={{position:"relative",borderRadius:10,overflow:"hidden",background:"var(--sf)",aspectRatio:"1"}}><a href={ph.webViewLink||("#")} target="_blank" rel="noopener"><img src={thumb} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}} /></a><a href={dl} target="_blank" rel="noopener" style={{position:"absolute",bottom:4,right:4,width:24,height:24,borderRadius:6,background:"rgba(0,0,0,.5)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",fontSize:12}}>⬇</a></div>;})}</div>
          {gPhotos.length>0 && <button onClick={function(){if(gTok&&gFolder){setGLoad2(true);driveListPhotos(gTok,gFolder,function(photos){setGPhotos(photos);setGLoad2(false);});}}} style={{display:"block",margin:"14px auto 0",background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:11,color:"var(--ac)",fontWeight:600}}>🔄 {ln==="he"?"רענן":"Refresh"}</button>}
        </div>}
      </div>}

      {/* EXPENSES */}
      {tab==="expenses" && <div>
        <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:8}}><span style={{fontSize:10,color:"var(--mt)",fontWeight:600}}>{t.view}</span>{mems.map(function(m){return <button key={m.id} onClick={function(){setVA(m.id);}} style={{width:22,height:22,borderRadius:"50%",border:vA===m.id?"2px solid "+m.c:"2px solid transparent",background:m.c,color:"#fff",fontSize:8,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{m.av}</button>;})}</div>
        <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:11,padding:12,marginBottom:10,display:"flex",justifyContent:"space-between"}}><div><p style={{fontSize:10,color:"var(--mt)",margin:0}}>{t.spent}</p><p style={{fontSize:20,fontWeight:800,color:"var(--txt)",margin:0}}>{money(Math.round(myS),"ILS")}</p></div><div style={{textAlign:"end"}}><p style={{fontSize:10,color:"var(--mt)",margin:0}}>{t.total}</p><p style={{fontSize:14,fontWeight:700,color:"var(--ac)",margin:0}}>{money(Math.round(totS),"ILS")}</p></div></div>
        <div style={{display:"flex",gap:2,background:"var(--sf)",borderRadius:8,padding:2,marginBottom:10}}><button onClick={function(){setES("list");}} style={{flex:1,padding:7,borderRadius:6,border:"none",background:eS==="list"?"var(--card)":"transparent",color:eS==="list"?"var(--txt)":"var(--mt)",fontWeight:eS==="list"?700:500,fontSize:11,cursor:"pointer"}}>{t.hist}</button><button onClick={function(){setES("bal");}} style={{flex:1,padding:7,borderRadius:6,border:"none",background:eS==="bal"?"var(--card)":"transparent",color:eS==="bal"?"var(--txt)":"var(--mt)",fontWeight:eS==="bal"?700:500,fontSize:11,cursor:"pointer"}}>{t.bal}</button></div>
        {eS==="list"&&exps.map(function(ex){if(!ex)return null;var py=mems.find(function(m){return m.id===ex.paidBy;});return <div key={ex.id} style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:10,padding:10,marginBottom:6}}><div style={{display:"flex",justifyContent:"space-between"}}><div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{width:26,height:26,borderRadius:"50%",background:(py&&py.c)||"#888",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700}}>{(py&&py.av)||"?"}</span><div><p style={{fontSize:12,fontWeight:600,color:"var(--txt)",margin:0}}>{ln==="he"?ex.desc:ex.descEn||ex.desc}</p><p style={{fontSize:9,color:"var(--mt)",margin:0}}>{ex.scope==="personal"?"🔒":"👥"} {ex.scope==="personal"?t.pers:t.share}</p></div></div><div style={{display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:13,fontWeight:700,color:"var(--txt)"}}>{money(ex.amount||0,ex.currency||"ILS")}</span><button onClick={function(){updF("exps/"+ex.id,null);}} style={{background:"none",border:"none",color:"var(--mt)",cursor:"pointer",opacity:.3,fontSize:12}}>🗑</button></div></div></div>;})}
        {eS==="bal"&&<div>{setts.length===0&&<p style={{textAlign:"center",padding:20,color:"var(--mt)"}}>✓ {t.ok}</p>}{setts.map(function(s,i){var fr=mems.find(function(m){return m.id===s.from;});var to2=mems.find(function(m){return m.id===s.to;});return <div key={i} style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:10,padding:11,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,fontWeight:600,color:"var(--txt)"}}>{fr?(ln==="he"?fr.name:fr.nameEn):"?"} {t.owes} {to2?(ln==="he"?to2.name:to2.nameEn):"?"}</span><span style={{fontSize:14,fontWeight:800,color:"var(--err)"}}>{money(s.a,(exps[0]&&exps[0].currency)||"EUR")}</span></div>;})}</div>}
        {fab(function(){setNe({desc:"",amount:"",currency:"EUR",paidBy:mems[0]?mems[0].id:"",splitBetween:mems.map(function(m){return m.id;}),scope:"shared"});setMod("addE");})}
        <Mod open={mod==="addE"} onClose={function(){setMod(null);}} title={t.add+" "+t.exp} ch={<div>
          <div style={{display:"flex",gap:2,background:"var(--sf)",borderRadius:6,padding:2,marginBottom:10}}><button onClick={function(){setNe(Object.assign({},ne,{scope:"shared"}));}} style={{flex:1,padding:6,borderRadius:5,border:"none",background:ne.scope==="shared"?"var(--card)":"transparent",color:ne.scope==="shared"?"var(--txt)":"var(--mt)",fontWeight:ne.scope==="shared"?700:500,fontSize:11,cursor:"pointer"}}>{t.shE}</button><button onClick={function(){setNe(Object.assign({},ne,{scope:"personal"}));}} style={{flex:1,padding:6,borderRadius:5,border:"none",background:ne.scope==="personal"?"var(--card)":"transparent",color:ne.scope==="personal"?"var(--txt)":"var(--mt)",fontWeight:ne.scope==="personal"?700:500,fontSize:11,cursor:"pointer"}}>{t.prE}</button></div>
          <Fld l={t.desc} ch={<Inp value={ne.desc} onChange={function(e){setNe(Object.assign({},ne,{desc:e.target.value}));}} />} />
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8}}><Fld l={t.amount} ch={<Inp type="number" value={ne.amount} onChange={function(e){setNe(Object.assign({},ne,{amount:e.target.value}));}} />} /><Fld l={t.cur} ch={<Sel v={ne.currency} fn={function(e){setNe(Object.assign({},ne,{currency:e.target.value}));}} ops={CURS.map(function(c){return{v:c,l:c};})} />} /></div>
          <Fld l={t.paid} ch={<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{mems.map(function(m){return <Chip key={m.id} on={ne.paidBy===m.id} c={m.c} fn={function(){setNe(Object.assign({},ne,{paidBy:m.id}));}} ch={<span>{ln==="he"?m.name:m.nameEn}</span>} />;})}</div>} />
          <Bt ch={t.save} fn={function(){if(!ne.amount||!ne.desc)return;var eid=xid();var ex=Object.assign({},ne,{id:eid,amount:parseFloat(ne.amount),descEn:ne.desc,date:new Date().toISOString().split("T")[0],category:"misc"});if(ex.scope==="personal")ex.splitBetween=[ex.paidBy];updF("exps/"+eid,ex);setMod(null);}} st={{width:"100%",justifyContent:"center",marginTop:8}} />
        </div>} />
      </div>}

      {/* MORE: group, wishlist, checklist, emergency, converter */}
      {tab==="more" && <div>
        <div style={{display:"flex",gap:4,overflowX:"auto",marginBottom:12}}>{[{k:"group",e:"👥",l:t.grp},{k:"wishlist",e:"❤️",l:t.wish},{k:"checklist",e:"✅",l:t.chk},{k:"emergency",e:"🆘",l:t.emergency},{k:"converter",e:"💱",l:t.converter}].map(function(st){return <button key={st.k} onClick={function(){setTab(st.k);}} style={{flexShrink:0,padding:"6px 12px",borderRadius:8,background:"var(--card)",border:"1px solid var(--bd)",cursor:"pointer",fontSize:11,fontWeight:600,color:"var(--txt)"}}>{st.e} {st.l}</button>;})}</div>
        {/* Group content */}
        <div style={{background:"linear-gradient(135deg,var(--gA),var(--gB))",borderRadius:14,padding:18,color:"#fff",marginBottom:14}}>
          <h2 style={{fontSize:17,fontWeight:800,color:"#fff",margin:"0 0 10px"}}>{ln==="he"?trip.name:trip.nameEn}</h2>
          <div style={{background:"rgba(255,255,255,.14)",borderRadius:8,padding:"7px 10px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><div><p style={{fontSize:8,color:"rgba(255,255,255,.5)",margin:0}}>{t.invite}</p><p style={{fontSize:15,fontWeight:800,letterSpacing:3,color:"#fff",margin:0}}>{trip.inv}</p></div><button onClick={function(){if(navigator.clipboard){navigator.clipboard.writeText(trip.inv);setCp(true);setTimeout(function(){setCp(false);},2000);}}} style={{background:"rgba(255,255,255,.2)",border:"none",borderRadius:6,padding:"4px 8px",color:"#fff",cursor:"pointer",fontSize:10,fontWeight:600}}>{cp?"✓":t.copy}</button></div>
          <button onClick={shareLink} style={{width:"100%",padding:8,borderRadius:8,background:"rgba(255,255,255,.12)",border:"none",color:"#fff",cursor:"pointer",fontSize:11,fontWeight:600}}>🔗 {t.shareLink}</button>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><h3 style={{fontSize:14,fontWeight:700,color:"var(--txt)",margin:0}}>{t.mems} ({mems.length})</h3><button onClick={function(){setNm("");setMod("addM");}} style={{background:"var(--acS)",border:"none",borderRadius:7,padding:"5px 10px",cursor:"pointer",color:"var(--ac)",fontSize:10,fontWeight:600}}>+ {t.addM}</button></div>
        {mems.map(function(m){return <div key={m.id} style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:10,padding:10,marginBottom:6,display:"flex",alignItems:"center",gap:8}}><span style={{width:34,height:34,borderRadius:"50%",background:m.c,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700}}>{m.av}</span><div style={{flex:1}}><p style={{fontSize:13,fontWeight:700,color:"var(--txt)",margin:0}}>{ln==="he"?m.name:m.nameEn}</p><p style={{fontSize:9,color:"var(--mt)",margin:0}}>{money(Math.round(pSpent(trip.exps,m.id)),"ILS")} {t.spent}</p></div>{mems.length>1&&<button onClick={function(){updF("mems/"+m.id,null);}} style={{background:"none",border:"none",color:"var(--mt)",cursor:"pointer",opacity:.3,fontSize:12}}>🗑</button>}</div>;})}
        <Mod open={mod==="addM"} onClose={function(){setMod(null);}} title={t.addM} ch={<div><Fld l={t.name} ch={<Inp value={nm} onChange={function(e){setNm(e.target.value);}} />} /><Bt ch={t.save} fn={function(){if(!nm)return;var mid=xid();updF("mems/"+mid,{id:mid,name:nm,nameEn:nm,av:nm.charAt(0).toUpperCase(),c:MCOL[mems.length%MCOL.length]});setMod(null);}} st={{width:"100%",justifyContent:"center"}} /></div>} />
      </div>}

      {/* WISHLIST */}
      {tab==="wishlist" && <div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><h2 style={{fontSize:16,fontWeight:700,color:"var(--txt)",margin:0}}>❤️ {t.wish}</h2><Bt ch={"+ "+t.addW} fn={function(){setNw({title:"",titleEn:"",location:"",lat:0,lng:0,notes:""});setMod("addW");}} st={{padding:"5px 10px",fontSize:10}} /></div>
        {wl.length===0&&<p style={{textAlign:"center",padding:30,color:"var(--mt)"}}>{t.noW}</p>}
        {wl.map(function(w){if(!w)return null;return <div key={w.id} style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:11,padding:11,marginBottom:7,borderRight:"3px solid #E84393"}}><div style={{display:"flex",justifyContent:"space-between"}}><div><p style={{fontSize:13,fontWeight:600,color:"var(--txt)",margin:0}}>{ln==="he"?w.title:w.titleEn||w.title}</p><p style={{fontSize:10,color:"var(--mt)",margin:"2px 0 0"}}>📍 {w.location||""}</p></div><div style={{display:"flex",gap:3}}><button onClick={function(){setMvW(mvW===w.id?null:w.id);}} style={{background:"var(--acS)",border:"none",borderRadius:5,padding:"3px 7px",cursor:"pointer",color:"var(--ac)",fontSize:9,fontWeight:600}}>{t.move}</button><button onClick={function(){updF("wl/"+w.id,null);}} style={{background:"none",border:"none",color:"var(--mt)",cursor:"pointer",opacity:.3,fontSize:12}}>🗑</button></div></div>{mvW===w.id&&<div style={{display:"flex",gap:4,marginTop:7,paddingTop:7,borderTop:"1px solid var(--bd)",flexWrap:"wrap"}}>{itin.map(function(d,i){return <button key={i} onClick={function(){var itemId=xid();updF("itin/d"+i+"/items/"+itemId,Object.assign({},w,{id:itemId,time:"",endTime:""}));updF("wl/"+w.id,null);setMvW(null);}} style={{padding:"5px 10px",borderRadius:6,border:"1px solid var(--bd)",background:"var(--sf)",cursor:"pointer",fontSize:10,fontWeight:600,color:"var(--txt)"}}>{t.day} {d.dn}</button>;})}</div>}</div>;})}
        <Mod open={mod==="addW"} onClose={function(){setMod(null);}} title={t.addW} ch={<div>
          <Fld l={t.title} ch={<Inp value={ln==="he"?nw.title:nw.titleEn} onChange={function(e){var v=e.target.value;if(ln==="he")setNw(Object.assign({},nw,{title:v,titleEn:v}));else setNw(Object.assign({},nw,{titleEn:v,title:v}));}} />} />
          <Fld l={"📍 "+t.loc} ch={<PlIn val={nw.location} ph={t.search} onPick={function(loc){setNw(Object.assign({},nw,loc));}} />} />
          <Bt ch={t.save} fn={function(){if(!nw.title&&!nw.titleEn)return;var wid=xid();updF("wl/"+wid,Object.assign({},nw,{id:wid,type:"attraction"}));setMod(null);}} st={{width:"100%",justifyContent:"center",marginTop:6}} />
        </div>} />
      </div>}

      {/* CHECKLIST */}
      {tab==="checklist" && <div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><h2 style={{fontSize:16,fontWeight:700,color:"var(--txt)",margin:0}}>✅ {t.chk}</h2><Bt ch={"+ "+t.addItem} fn={function(){setNci({text:"",textEn:"",cat:"misc",qty:1});setMod("addCl");}} st={{padding:"5px 10px",fontSize:10}} /></div>
        <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:10}}><span style={{fontSize:10,color:"var(--mt)",fontWeight:600}}>{t.view}</span>{mems.map(function(m){return <button key={m.id} onClick={function(){setVA(m.id);}} style={{width:22,height:22,borderRadius:"50%",border:vA===m.id?"2px solid "+m.c:"2px solid transparent",background:m.c,color:"#fff",fontSize:8,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{m.av}</button>;})}</div>

        {/* Drill-down: if no category selected, show category cards */}
        {clCat==="all" && CL_CATS.map(function(cat){
          var catItems=cl.filter(function(c){return c&&c.cat===cat;});
          var checked=catItems.filter(function(c){return c.ck&&c.ck[vA];}).length;
          var total=catItems.length;
          if(total===0) return null;
          return <button key={cat} onClick={function(){setClCat(cat);}} style={{width:"100%",background:"var(--card)",border:"1px solid var(--bd)",borderRadius:12,padding:14,marginBottom:8,cursor:"pointer",textAlign:"inherit",display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:26}}>{CL_CAT_E[cat]}</span>
            <div style={{flex:1}}>
              <p style={{fontSize:14,fontWeight:700,color:"var(--txt)",margin:0}}>{ln==="he"?CL_CAT_HE[cat]:CL_CAT_EN[cat]}</p>
              <p style={{fontSize:10,color:"var(--mt)",margin:"2px 0 0"}}>{checked}/{total} {ln==="he"?"סומנו":"checked"}</p>
            </div>
            <div style={{width:36,height:36,borderRadius:"50%",background:checked===total?"var(--ok)":"var(--sf)",border:"2px solid "+(checked===total?"var(--ok)":"var(--bd)"),display:"flex",alignItems:"center",justifyContent:"center"}}>
              {checked===total ? <span style={{color:"#fff",fontSize:16}}>✓</span> : <span style={{fontSize:10,fontWeight:700,color:"var(--ac)"}}>{Math.round(checked/total*100)}%</span>}
            </div>
          </button>;
        })}

        {/* If category selected, show items + back button */}
        {clCat!=="all" && <div>
          <button onClick={function(){setClCat("all");}} style={{background:"var(--sf)",border:"1px solid var(--bd)",borderRadius:8,padding:"5px 12px",cursor:"pointer",marginBottom:10,fontSize:11,fontWeight:600,color:"var(--ac)",display:"flex",alignItems:"center",gap:4}}>← {t.all}</button>
          <h3 style={{fontSize:14,fontWeight:700,color:"var(--txt)",margin:"0 0 8px"}}>{CL_CAT_E[clCat]} {ln==="he"?CL_CAT_HE[clCat]:CL_CAT_EN[clCat]}</h3>
          {cl.filter(function(c){return c&&c.cat===clCat;}).map(function(c){if(!c)return null;var ck=c.ck&&c.ck[vA];return <div key={c.id} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",background:"var(--card)",border:"1px solid var(--bd)",borderRadius:8,marginBottom:5}}>
            <button onClick={function(){updF("cl/"+c.id+"/ck/"+vA,!ck);}} style={{width:22,height:22,borderRadius:6,border:"2px solid "+(ck?"var(--ok)":"var(--bd)"),background:ck?"var(--ok)":"transparent",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0,cursor:"pointer"}}>{ck?"✓":""}</button>
            <div style={{flex:1}}>
              <span style={{fontSize:13,color:ck?"var(--mt)":"var(--txt)",textDecoration:ck?"line-through":"none"}}>{ln==="he"?c.text:c.textEn||c.text}</span>
              <span style={{display:"inline-flex",alignItems:"center",gap:2,marginRight:4,marginLeft:4}}>
                <span style={{fontSize:10,color:"var(--warn)"}}>×</span>
                <input type="number" value={c.qty||1} onChange={function(e){var nq=parseInt(e.target.value)||1;updF("cl/"+c.id+"/qty",nq);}} style={{width:28,padding:"1px 2px",borderRadius:4,border:"1px solid var(--bd)",background:"var(--sf)",color:"var(--txt)",fontSize:10,textAlign:"center",boxSizing:"border-box"}} onClick={function(e){e.stopPropagation();}} />
              </span>
            </div>
            <button onClick={function(){updF("cl/"+c.id,null);}} style={{background:"none",border:"none",color:"var(--mt)",cursor:"pointer",opacity:.3,fontSize:11}}>🗑</button>
          </div>;})}
        </div>}

        <Mod open={mod==="addCl"} onClose={function(){setMod(null);}} title={t.addItem} ch={<div>
          <Fld l={ln==="he"?"פריט":"Item"} ch={<Inp value={ln==="he"?nci.text:nci.textEn} onChange={function(e){var v=e.target.value;if(ln==="he")setNci(Object.assign({},nci,{text:v,textEn:v}));else setNci(Object.assign({},nci,{textEn:v,text:v}));}} />} />
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Fld l={t.qty} ch={<Inp type="number" value={nci.qty} onChange={function(e){setNci(Object.assign({},nci,{qty:parseInt(e.target.value)||1}));}} />} /><Fld l={t.cat} ch={<Sel v={nci.cat} fn={function(e){setNci(Object.assign({},nci,{cat:e.target.value}));}} ops={CL_CATS.map(function(c2){return{v:c2,l:(ln==="he"?CL_CAT_HE[c2]:CL_CAT_EN[c2])+" "+CL_CAT_E[c2]};})} />} /></div>
          <Bt ch={t.save} fn={function(){if(!nci.text&&!nci.textEn)return;var cid=xid();updF("cl/"+cid,{id:cid,text:nci.text,textEn:nci.textEn,cat:nci.cat,qty:nci.qty,ck:{}});setMod(null);}} st={{width:"100%",justifyContent:"center",marginTop:6}} />
        </div>} />
      </div>}

      {/* EMERGENCY */}
      {tab==="emergency" && <div>
        <h2 style={{fontSize:16,fontWeight:700,color:"var(--txt)",margin:"0 0 6px"}}>🆘 {t.emergency}</h2>
        <p style={{fontSize:11,color:"var(--mt)",marginBottom:12}}>{t.emDesc}</p>
        {["police","ambulance","embassy","insurance"].map(function(k){var val=(trip.emergency&&trip.emergency[k])||"";return <div key={k} style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:10,padding:10,marginBottom:6}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>{k==="police"?"🚔":k==="ambulance"?"🚑":k==="embassy"?"🏛️":"🛡️"}</span><div><p style={{fontSize:12,fontWeight:600,color:"var(--txt)",margin:0}}>{t[k]}</p>{val&&<a href={"tel:"+val} style={{fontSize:13,fontWeight:700,color:"var(--ac)",textDecoration:"none"}}>{val}</a>}</div></div><button onClick={function(){var num=prompt(t[k]+":",val);if(num!==null)updF("emergency/"+k,num);}} style={{background:"var(--sf)",border:"none",borderRadius:6,padding:"4px 8px",cursor:"pointer",fontSize:10,color:"var(--ac)"}}>✏️</button></div></div>;})}
      </div>}

      {/* CONVERTER */}
      {tab==="converter" && <div>
        <h2 style={{fontSize:16,fontWeight:700,color:"var(--txt)",margin:"0 0 12px"}}>💱 {t.converter}</h2>
        <Fld l={t.amount} ch={<Inp type="number" value={cvAmt} onChange={function(e){setCvAmt(e.target.value);}} style={{fontSize:18,fontWeight:700,textAlign:"center"}} />} />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}><Fld l={ln==="he"?"מ-":"From"} ch={<Sel v={cvFrom} fn={function(e){setCvFrom(e.target.value);}} ops={CURS.map(function(c){return{v:c,l:c};})} />} /><Fld l={ln==="he"?"ל-":"To"} ch={<Sel v={cvTo} fn={function(e){setCvTo(e.target.value);}} ops={CURS.map(function(c){return{v:c,l:c};})} />} /></div>
        {cvAmt&&<div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:12,padding:16,textAlign:"center",marginBottom:12}}><p style={{fontSize:12,color:"var(--mt)",margin:"0 0 4px"}}>{t.result}</p><p style={{fontSize:28,fontWeight:800,color:"var(--ac)",margin:0}}>{money(parseFloat((parseFloat(cvAmt)*(cvRates[cvFrom]||1)/(cvRates[cvTo]||1)).toFixed(3)),cvTo)}</p><p style={{fontSize:10,color:"var(--mt)",marginTop:4}}>{t.rate}: 1 {cvFrom} = {((cvRates[cvFrom]||1)/(cvRates[cvTo]||1)).toFixed(3)} {cvTo}</p></div>}
        <div style={{background:"var(--card)",border:"1px solid var(--bd)",borderRadius:12,padding:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><p style={{fontSize:12,fontWeight:700,color:"var(--txt)",margin:0}}>{ln==="he"?"שערי חליפין (ל-₪)":"Exchange Rates (to ₪)"}</p><button onClick={function(){fetchRates(setCvRates,cvRates);}} style={{background:"var(--acS)",border:"none",borderRadius:6,padding:"3px 8px",cursor:"pointer",color:"var(--ac)",fontSize:9,fontWeight:600}}>🔄 {ln==="he"?"עדכן מהרשת":"Update"}</button></div>
          {CURS.map(function(c){return <div key={c} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:11,fontWeight:600,color:"var(--txt)",width:35}}>{c}</span><span style={{fontSize:10,color:"var(--mt)"}}>=</span><input type="number" step="0.001" value={cvRates[c]||""} onChange={function(e){var nr=Object.assign({},cvRates);nr[c]=parseFloat(e.target.value)||0;setCvRates(nr);}} style={{flex:1,padding:"4px 8px",borderRadius:6,border:"1px solid var(--bd)",background:"var(--sf)",color:"var(--txt)",fontSize:11,boxSizing:"border-box"}} /><span style={{fontSize:10,color:"var(--mt)"}}>₪</span></div>;})}</div>
      </div>}
    </main>

    <nav style={{position:"fixed",bottom:0,left:0,right:0,zIndex:100,background:"var(--nav)",backdropFilter:"blur(16px)",borderTop:"1px solid var(--bd)",display:"flex",justifyContent:"space-around",padding:"6px 0 env(safe-area-inset-bottom,6px)"}}>{nav.map(function(n){return <button key={n.k} onClick={function(){setTab(n.k);}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1,background:"none",border:"none",cursor:"pointer",padding:"5px 12px",color:tab===n.k?"var(--ac)":"var(--mt)"}}><span style={{fontSize:20}}>{n.e}</span><span style={{fontSize:9,fontWeight:tab===n.k?700:500}}>{n.l}</span>{tab===n.k&&<span style={{width:4,height:4,borderRadius:"50%",background:"var(--ac)"}} />}</button>;})}</nav>

    <Mod open={mod==="editT"} onClose={function(){setMod(null);}} title={t.editT} ch={<div>
      <Fld l={t.tName} ch={<Inp value={ln==="he"?tf.name:tf.nameEn} onChange={function(e){if(ln==="he")setTf(Object.assign({},tf,{name:e.target.value}));else setTf(Object.assign({},tf,{nameEn:e.target.value}));}} />} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Fld l={t.start} ch={<Inp type="date" value={tf.sd} onChange={function(e){setTf(Object.assign({},tf,{sd:e.target.value}));}} />} /><Fld l={t.stop} ch={<Inp type="date" value={tf.ed} onChange={function(e){setTf(Object.assign({},tf,{ed:e.target.value}));}} />} /></div>
      <Fld l={t.budget+" (₪)"} ch={<Inp type="number" value={tf.budget||0} onChange={function(e){setTf(Object.assign({},tf,{budget:parseFloat(e.target.value)||0}));}} />} />
      <Bt ch={t.save} fn={function(){fbUpdateTrip(aId,props.myUid,{name:tf.name||trip.name,nameEn:tf.nameEn||trip.nameEn,sd:tf.sd||trip.sd,ed:tf.ed||trip.ed,budget:tf.budget||0});setMod(null);}} st={{width:"100%",justifyContent:"center",marginTop:6}} />
    </div>} />
  </div>;
}

ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
