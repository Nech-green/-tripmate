// ════════════════════════════════════════
// Shared UI Components
// ════════════════════════════════════════
var IS = {width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid var(--bd)",background:"var(--sf)",color:"var(--txt)",fontSize:13,boxSizing:"border-box"};

function Mod(props){
  if(!props.open) return null;
  return React.createElement("div",{style:{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center"},onClick:props.onClose},
    React.createElement("div",{style:{position:"absolute",inset:0,background:"rgba(0,0,0,.45)",backdropFilter:"blur(3px)"}}),
    React.createElement("div",{onClick:function(e){e.stopPropagation();},style:{position:"relative",width:"100%",maxWidth:480,maxHeight:"90vh",background:"var(--card)",borderRadius:"18px 18px 0 0",padding:"16px 18px",overflowY:"auto",animation:"slideUp .25s ease"}},
      React.createElement("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}},
        React.createElement("h2",{style:{fontSize:16,fontWeight:700,color:"var(--txt)",margin:0}},props.title),
        React.createElement("button",{onClick:props.onClose,style:{background:"var(--sf)",border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,color:"var(--mt)",display:"flex",alignItems:"center",justifyContent:"center"}},"✕")
      ),
      props.ch
    )
  );
}

function Fld(props){
  return React.createElement("div",{style:{marginBottom:11}},
    React.createElement("label",{style:{display:"block",fontSize:11,fontWeight:600,color:"var(--mt)",marginBottom:3}},props.l),
    props.ch
  );
}

function Inp(props){
  return React.createElement("input",Object.assign({},props,{style:Object.assign({},IS,props.style||{})}));
}

function Sel(props){
  return React.createElement("select",{value:props.v,onChange:props.fn,style:IS},
    props.ops.map(function(o){return React.createElement("option",{key:o.v,value:o.v},o.l);})
  );
}

function Bt(props){
  var colors={primary:{background:"var(--ac)",color:"#fff"},secondary:{background:"var(--sf)",color:"var(--txt)"},danger:{background:"var(--err)",color:"#fff"},success:{background:"var(--ok)",color:"#fff"}};
  return React.createElement("button",{onClick:props.fn,disabled:props.dis,style:Object.assign({padding:"9px 16px",borderRadius:10,border:"none",fontWeight:700,fontSize:13,cursor:props.dis?"default":"pointer",display:"inline-flex",alignItems:"center",gap:4,opacity:props.dis?0.5:1},colors[props.vr||"primary"]||colors.primary,props.st||{})},props.ch);
}

function Chip(props){
  return React.createElement("button",{onClick:props.fn,style:{padding:"4px 10px",borderRadius:16,border:props.on?"2px solid "+props.c:"1px solid var(--bd)",background:props.on?props.c+"18":"var(--sf)",color:props.on?props.c:"var(--mt)",cursor:"pointer",fontWeight:600,fontSize:11,display:"inline-flex",alignItems:"center",gap:3}},props.ch);
}

function Spinner(){
  return React.createElement("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"60vh"}},
    React.createElement("div",{style:{width:32,height:32,border:"3px solid var(--bd)",borderTopColor:"var(--ac)",borderRadius:"50%",animation:"spin .6s linear infinite"}})
  );
}
