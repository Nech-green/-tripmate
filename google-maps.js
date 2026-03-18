// ════════════════════════════════════════
// Google Maps — Loader, Places, Map
// ════════════════════════════════════════
var {useState, useEffect, useRef} = React;

var _gmLoaded=false, _gmCbs=[];
function gMapsLoad(cb){
  if(window.google&&window.google.maps){cb();return;}
  _gmCbs.push(cb);if(_gmLoaded)return;_gmLoaded=true;
  window._gmcb=function(){_gmCbs.forEach(function(f){f();});_gmCbs=[];};
  var s=document.createElement("script");
  s.src="https://maps.googleapis.com/maps/api/js?key="+CONFIG.GKEY+"&libraries=places&callback=_gmcb&language=he";
  s.async=true; document.head.appendChild(s);
}

function PlIn(props){
  var ref=useRef(null);var acRef=useRef(null);
  var _r=useState(false),rdy=_r[0],setRdy=_r[1];
  useEffect(function(){gMapsLoad(function(){setRdy(true);});},[]);
  useEffect(function(){
    if(!rdy||!ref.current||acRef.current)return;
    var ac=new google.maps.places.Autocomplete(ref.current,{fields:["name","geometry","formatted_address","place_id"]});
    ac.addListener("place_changed",function(){
      var p=ac.getPlace();
      if(p&&p.geometry){
        props.onPick({location:p.name||p.formatted_address||"",lat:p.geometry.location.lat(),lng:p.geometry.location.lng()});
        if(ref.current)ref.current.value=p.name||"";
      }
    });
    acRef.current=ac;
  },[rdy]);
  return React.createElement("div",{style:{position:"relative"}},
    React.createElement("input",{ref:ref,defaultValue:props.val||"",placeholder:props.ph||"",style:{width:"100%",padding:"10px 12px 10px 34px",borderRadius:10,border:"1px solid var(--bd)",background:"var(--sf)",color:"var(--txt)",fontSize:13,boxSizing:"border-box"}}),
    React.createElement("span",{style:{position:"absolute",top:10,left:10,fontSize:14,pointerEvents:"none"}},"🔍")
  );
}

function GMap(props){
  var ref=useRef(null);var mi=useRef(null);var mkrs=useRef([]);var lines=useRef([]);
  var _r=useState(false),rdy=_r[0],setRdy=_r[1];
  useEffect(function(){gMapsLoad(function(){setRdy(true);});},[]);
  useEffect(function(){
    if(!rdy||!ref.current)return;
    if(!mi.current){mi.current=new google.maps.Map(ref.current,{center:{lat:37.5,lng:24},zoom:6,mapTypeControl:true,streetViewControl:false,fullscreenControl:true});}
    mkrs.current.forEach(function(m){m.setMap(null);});mkrs.current=[];
    lines.current.forEach(function(l){l.setMap(null);});lines.current=[];
    var map=mi.current;var bounds=new google.maps.LatLngBounds();
    var routePath=[];
    var pts=props.pts||[];
    var attrNum=0;

    pts.forEach(function(p){
      if(!p||!p.lat||!p.lng)return;
      var pos={lat:p.lat,lng:p.lng};bounds.extend(pos);
      var isW=p.isW;var c=isW?"#E84393":(CLR[p.type]||"#888");
      var lab=(props.ln==="he"?p.title:(p.titleEn||p.title))||p.location||"";

      // Determine label by type
      var labelText;
      if(isW){labelText="♥";}
      else if(p.type==="hotel"){labelText="🏨";}
      else if(p.type==="flight"){labelText="✈";}
      else if(p.type==="restaurant"){labelText="🍽";}
      else if(p.type==="transport"){
        labelText=p.transportSub?({bus:"🚌",train:"🚂",subway:"🚇",car_rental:"🚗",taxi:"🚕",ferry:"⛴",other:"🚐"}[p.transportSub]||"🚌"):"🚌";
      }
      else{attrNum++;labelText=String(attrNum);}

      var priceStr=p.price?"<br><span style='color:#36D6A0;font-weight:700'>💰 "+money(p.price,p.priceCur||"ILS")+"</span>":"";

      // Main marker
      var m=new google.maps.Marker({position:pos,map:map,
        label:{text:labelText,color:"#fff",fontWeight:"700",fontSize:isW?"12px":"11px"},
        icon:{path:google.maps.SymbolPath.CIRCLE,scale:isW?11:14,fillColor:c,fillOpacity:1,strokeColor:"#fff",strokeWeight:isW?2:3},
        title:lab});
      var iw=new google.maps.InfoWindow({content:'<div style="font-family:Rubik;min-width:120px;direction:rtl"><b>'+(isW?"❤️ ":"")+(EMJ[p.type]||"📌")+" "+lab+"</b>"+(p.location?"<br><span style='color:#666;font-size:11px'>📍 "+p.location+"</span>":"")+(p.time?"<br><span style='color:#888;font-size:10px'>🕐 "+p.time+"</span>":"")+priceStr+"</div>"});
      m.addListener("click",function(){iw.open(map,m);});
      mkrs.current.push(m);

      if(!isW) routePath.push(pos);

      // Transport: add destination marker + line
      if(p.type==="transport"&&p.toLat&&p.toLng){
        var toPos={lat:p.toLat,lng:p.toLng};
        bounds.extend(toPos);
        routePath.push(toPos);
        var m2=new google.maps.Marker({position:toPos,map:map,
          label:{text:"🏁",color:"#fff",fontWeight:"700",fontSize:"12px"},
          icon:{path:google.maps.SymbolPath.CIRCLE,scale:11,fillColor:"#FFB347",fillOpacity:1,strokeColor:"#fff",strokeWeight:2},
          title:(p.toLocation||"Destination")});
        var iw2=new google.maps.InfoWindow({content:'<div style="font-family:Rubik;direction:rtl"><b>🏁 '+(p.toLocation||"")+'</b><br><span style="color:#888;font-size:10px">'+lab+"</span></div>"});
        m2.addListener("click",function(){iw2.open(map,m2);});
        mkrs.current.push(m2);
        // Draw line between from and to
        var tLine=new google.maps.Polyline({path:[pos,toPos],geodesic:true,strokeColor:c,strokeOpacity:0.7,strokeWeight:3});
        tLine.setMap(map);
        lines.current.push(tLine);
      }
    });

    // Route line (dashed) connecting all stops in order
    if(routePath.length>1){
      var rLine=new google.maps.Polyline({path:routePath,geodesic:true,strokeColor:"#1B3A6B",strokeOpacity:0,strokeWeight:3,
        icons:[{icon:{path:"M 0,-1 0,1",strokeOpacity:1,strokeColor:"#1B3A6B",scale:3},offset:"0",repeat:"15px"}]});
      rLine.setMap(map);
      lines.current.push(rLine);
    }
    if(pts.length>0){map.fitBounds(bounds,50);if(pts.length===1)setTimeout(function(){map.setZoom(13);},300);}
  },[rdy,props.pts,props.ln]);
  return React.createElement("div",{ref:ref,style:{width:"100%",height:380,borderRadius:14,overflow:"hidden",border:"1px solid var(--bd)"}});
}
