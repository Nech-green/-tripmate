// ╔════════════════════════════════════════╗
// ║  🔑 CONFIG — כל ה-API Keys כאן        ║
// ╚════════════════════════════════════════╝

var CONFIG = {
  GKEY: "AIzaSyDT_qnfBzfXDSMj_1L6fj3CaLOeUZShdXs",
  GCID: "1091307563589-esjbrkmridcuk9qmj0rb7io7b28ctsek.apps.googleusercontent.com",
  firebase: {
    apiKey: "AIzaSyC8-vjiADX4RTsM8qAK0IS2jVo6O0X_SYI",
    authDomain: "mytrip-nech.firebaseapp.com",
    databaseURL: "https://mytrip-nech-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "mytrip-nech",
    storageBucket: "mytrip-nech.firebasestorage.app",
    messagingSenderId: "258059120900",
    appId: "1:258059120900:web:bcbd759d8195dede26a051"
  }
};

// ── Constants ──
var TYPES = ["flight","hotel","restaurant","attraction","transport","custom"];
var TRANSPORT_SUB = ["bus","train","subway","car_rental","taxi","ferry","other"];
var CURS = ["ILS","EUR","USD","GBP","THB","JPY","TRY"];
var DEFAULT_RATES = {ILS:1, EUR:4.05, USD:3.65, GBP:4.68, THB:0.10, JPY:0.024, TRY:0.11};
var TZS = ["Asia/Jerusalem","Europe/Athens","Europe/London","Europe/Paris","Europe/Rome","America/New_York","America/Los_Angeles","Asia/Tokyo","UTC"];
var CLR = {flight:"#4F8CFF", hotel:"#A855F7", restaurant:"#FF6B8A", attraction:"#36D6A0", transport:"#FFB347", custom:"#6C5CE7"};
var EMJ = {flight:"✈️", hotel:"🏨", restaurant:"🍽️", attraction:"📸", transport:"🚌", custom:"📌", bus:"🚌", train:"🚂", subway:"🚇", car_rental:"🚗", taxi:"🚕", ferry:"⛴️", other:"🚐"};
var MCOL = ["#4F8CFF","#FF6B8A","#36D6A0","#FFB347","#A855F7","#00B894","#E84393","#6C5CE7"];
var CL_CATS = ["clothing","toiletries","electronics","documents","health","misc"];
var CL_CAT_E = {clothing:"👕", toiletries:"🧴", electronics:"🔌", documents:"📄", health:"💊", misc:"📦"};
var CL_CAT_HE = {clothing:"ביגוד", toiletries:"כלי רחצה", electronics:"אלקטרוניקה", documents:"מסמכים", health:"בריאות", misc:"שונות"};
var CL_CAT_EN = {clothing:"Clothing", toiletries:"Toiletries", electronics:"Electronics", documents:"Documents", health:"Health", misc:"Misc"};

// ── Translations ──
var L = {
he:{home:"בית",itin:"מסלול",exp:"הוצאות",map:"מפה",grp:"קבוצה",wish:"משאלות",chk:"צ'קליסט",more:"עוד",photos:"תמונות",
day:"יום",add:"הוסף",save:"שמור",cancel:"ביטול",del:"מחק",edit:"ערוך",
title:"כותרת",time:"שעה",end:"סיום",loc:"מיקום",notes:"הערות",search:"חפש בגוגל מפות...",
fnum:"מספר טיסה",tz1:"שעון מוצא",tz2:"שעון יעד",term:"טרמינל",gate:"שער",
checkIn:"צ'ק-אין",checkOut:"צ'ק-אאוט",transType:"סוג תחבורה",fromLoc:"מנקודה",toLoc:"לנקודה",
price:"מחיר",upload:"העלה",desc:"תיאור",amount:"סכום",cur:"מטבע",paid:"שולם ע\"י",
pers:"אישי",share:"משותף",owes:"חייב/ת",ok:"מיושב!",total:"סה\"כ",
myB:"התקציב שלי",grpB:"קבוצתי",spent:"הוצאתי",view:"הצג:",
mems:"חברים",invite:"קוד הזמנה",copy:"העתק",addM:"הוסף חבר",name:"שם",
noI:"אין פריטים",trips:"הטיולים שלי",newT:"טיול חדש",editT:"עריכת טיול",
tName:"שם הטיול",start:"התחלה",stop:"סיום",create:"צור",budget:"תקציב",
noT:"אין טיולים — צור או הצטרף!",addW:"הוסף",move:"העבר ליום",noW:"ריקה!",
shE:"משותפת",prE:"אישית",all:"הכל",hist:"היסטוריה",bal:"מאזנים",
join:"הצטרף לטיול",joinCode:"הכנס קוד",joinBtn:"הצטרף",shareLink:"שתף לינק",copied:"הועתק!",
loading:"טוען...",yourName:"השם שלך",setName:"המשך",
qty:"כמות",cat:"קטגוריה",addItem:"הוסף פריט",customCat:"קטגוריה מותאמת",catName:"שם הקטגוריה",
emergency:"חירום",emDesc:"מספרי טלפון חשובים",police:"משטרה",ambulance:"אמבולנס",embassy:"שגרירות",insurance:"ביטוח",
converter:"המרת מטבע",rate:"שער",result:"תוצאה",
ty:{flight:"טיסה",hotel:"מלון",restaurant:"מסעדה",attraction:"אטרקציה",transport:"תחבורה",custom:"מותאם"},
trSub:{bus:"אוטובוס",train:"רכבת",subway:"סאבווי",car_rental:"השכרת רכב",taxi:"מונית",ferry:"מעבורת",other:"אחר"},
cl:["דרכון","ביטוח","מטען יד","מתאם","תרופות","מטבע","מפות","הזמנות"]},
en:{home:"Home",itin:"Itinerary",exp:"Expenses",map:"Map",grp:"Group",wish:"Wishlist",chk:"Checklist",more:"More",photos:"Photos",
day:"Day",add:"Add",save:"Save",cancel:"Cancel",del:"Delete",edit:"Edit",
title:"Title",time:"Time",end:"End",loc:"Location",notes:"Notes",search:"Search Google Maps...",
fnum:"Flight #",tz1:"Origin TZ",tz2:"Dest TZ",term:"Terminal",gate:"Gate",
checkIn:"Check-in",checkOut:"Check-out",transType:"Transport Type",fromLoc:"From",toLoc:"To",
price:"Price",upload:"Upload",desc:"Description",amount:"Amount",cur:"Currency",paid:"Paid by",
pers:"Personal",share:"Shared",owes:"owes",ok:"Settled!",total:"Total",
myB:"My Budget",grpB:"Group",spent:"I spent",view:"View:",
mems:"Members",invite:"Invite",copy:"Copy",addM:"Add Member",name:"Name",
noI:"No items",trips:"My Trips",newT:"New Trip",editT:"Edit Trip",
tName:"Trip Name",start:"Start",stop:"End",create:"Create",budget:"Budget",
noT:"No trips yet!",addW:"Add",move:"To Day",noW:"Empty!",
shE:"Shared",prE:"Personal",all:"All",hist:"History",bal:"Balances",
join:"Join Trip",joinCode:"Enter code",joinBtn:"Join",shareLink:"Share Link",copied:"Copied!",
loading:"Loading...",yourName:"Your Name",setName:"Continue",
qty:"Qty",cat:"Category",addItem:"Add Item",customCat:"Custom Category",catName:"Category Name",
emergency:"Emergency",emDesc:"Important numbers",police:"Police",ambulance:"Ambulance",embassy:"Embassy",insurance:"Insurance",
converter:"Currency Converter",rate:"Rate",result:"Result",
ty:{flight:"Flight",hotel:"Hotel",restaurant:"Restaurant",attraction:"Attraction",transport:"Transport",custom:"Custom"},
trSub:{bus:"Bus",train:"Train",subway:"Subway",car_rental:"Car Rental",taxi:"Taxi",ferry:"Ferry",other:"Other"},
cl:["Passport","Insurance","Carry-on","Adapter","Meds","Currency","Maps","Bookings"]}
};

// ── Helper functions ──
var xid = function(){ return "x"+Math.random().toString(36).substr(2,8); };
var money = function(n,c){ return ({ILS:"₪",EUR:"€",USD:"$",GBP:"£",THB:"฿",JPY:"¥",TRY:"₺"}[c]||"")+Math.round(n).toLocaleString(); };
var toILS = function(a,c){ return a*(DEFAULT_RATES[c]||1); };
var objArr = function(o){ return o ? Object.values(o) : []; };

function pSpent(exps,uid2){
  var t=0; if(!exps) return 0;
  objArr(exps).forEach(function(e){
    if(!e||!e.splitBetween) return;
    var sb=objArr(e.splitBetween);
    if(e.scope==="personal"&&e.paidBy===uid2) t+=toILS(e.amount,e.currency);
    else if(e.scope==="shared"&&sb.indexOf(uid2)>=0) t+=toILS(e.amount/sb.length,e.currency);
  });
  return t;
}

function settle(exps,mems){
  if(!exps||!mems) return [];
  var arr=objArr(exps); var marr=objArr(mems);
  var b={}; marr.forEach(function(m){b[m.id]=0;});
  arr.filter(function(e){return e&&e.scope==="shared"&&e.splitBetween;}).forEach(function(e){
    var sb=objArr(e.splitBetween); var s=e.amount/sb.length;
    if(b[e.paidBy]!==undefined) b[e.paidBy]+=e.amount;
    sb.forEach(function(u){if(b[u]!==undefined) b[u]-=s;});
  });
  var d=[],c=[]; marr.forEach(function(m){ var v=Math.round(b[m.id]*100)/100; if(v<-0.01) d.push({id:m.id,a:-v}); if(v>0.01) c.push({id:m.id,a:v}); });
  d.sort(function(a,b2){return b2.a-a.a;}); c.sort(function(a,b2){return b2.a-a.a;});
  var r=[],di=0,ci=0;
  while(di<d.length&&ci<c.length){ var t2=Math.min(d[di].a,c[ci].a); if(t2>0.01) r.push({from:d[di].id,to:c[ci].id,a:Math.round(t2*100)/100}); d[di].a-=t2; c[ci].a-=t2; if(d[di].a<0.01)di++; if(c[ci].a<0.01)ci++; }
  return r;
}

function daysFromRange(sd,ed){
  var days=[]; var s=new Date(sd); var e=new Date(ed);
  if(isNaN(s.getTime())||isNaN(e.getTime())) return [{dn:1,dt:sd||"2026-01-01",items:{}}];
  var n=1; while(s<=e){ days.push({dn:n,dt:s.toISOString().split("T")[0],items:{}}); s.setDate(s.getDate()+1); n++; if(n>30) break; }
  if(days.length===0) days.push({dn:1,dt:sd,items:{}});
  return days;
}

function defaultChecklist(){
  var cl={};
  var items=[
    {t:"דרכון",e:"Passport",c:"documents"},{t:"ביטוח נסיעות",e:"Travel Insurance",c:"documents"},{t:"כרטיסי טיסה",e:"Flight Tickets",c:"documents"},{t:"הזמנות מלון",e:"Hotel Bookings",c:"documents"},{t:"צילום דרכון",e:"Passport Copy",c:"documents"},
    {t:"חולצות",e:"T-shirts",c:"clothing",q:7},{t:"מכנסיים",e:"Pants",c:"clothing",q:3},{t:"תחתונים",e:"Underwear",c:"clothing",q:7},{t:"גרביים",e:"Socks",c:"clothing",q:7},{t:"בגד ים",e:"Swimsuit",c:"clothing",q:2},{t:"נעלי הליכה",e:"Walking Shoes",c:"clothing"},{t:"כפכפים",e:"Flip Flops",c:"clothing"},{t:"ז'קט",e:"Jacket",c:"clothing"},
    {t:"משחת שיניים",e:"Toothpaste",c:"toiletries"},{t:"מברשת שיניים",e:"Toothbrush",c:"toiletries"},{t:"שמפו",e:"Shampoo",c:"toiletries"},{t:"קרם הגנה",e:"Sunscreen",c:"toiletries"},{t:"דאודורנט",e:"Deodorant",c:"toiletries"},
    {t:"מטען טלפון",e:"Phone Charger",c:"electronics"},{t:"שקע/מתאם",e:"Adapter",c:"electronics"},{t:"אוזניות",e:"Headphones",c:"electronics"},{t:"פאוור בנק",e:"Power Bank",c:"electronics"},
    {t:"תרופות קבועות",e:"Regular Meds",c:"health"},{t:"אקמול",e:"Painkillers",c:"health"},{t:"פלסטרים",e:"Band-aids",c:"health"},
    {t:"מטען יד",e:"Carry-on",c:"misc"},{t:"מזוודה",e:"Suitcase",c:"misc"},{t:"כסף מקומי",e:"Local Currency",c:"misc"},{t:"מפות אופליין",e:"Offline Maps",c:"misc"}
  ];
  items.forEach(function(item,i){var cid="c"+i; cl[cid]={id:cid,text:item.t,textEn:item.e,cat:item.c,qty:item.q||1,ck:{}}; });
  return cl;
}
