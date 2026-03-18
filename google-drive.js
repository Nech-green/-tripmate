// ════════════════════════════════════════
// Google Drive — Photo Sharing
// ════════════════════════════════════════

// Load Google Identity Services script
(function(){
  if(document.getElementById("gis-script")) return;
  var s=document.createElement("script");
  s.id="gis-script";
  s.src="https://accounts.google.com/gsi/client";
  s.async=true;
  document.head.appendChild(s);
})();

function driveAuth(callback){
  if(!window.google||!window.google.accounts){
    setTimeout(function(){driveAuth(callback);},500);
    return;
  }
  var client=google.accounts.oauth2.initTokenClient({
    client_id: CONFIG.GCID,
    scope: "https://www.googleapis.com/auth/drive.file",
    callback: function(resp){
      if(resp.access_token) callback(resp.access_token);
    }
  });
  client.requestAccessToken();
}

function driveFindOrCreateFolder(token, folderName, savedId, callback){
  if(savedId){
    callback(savedId);
    return;
  }
  // Search for existing
  fetch("https://www.googleapis.com/drive/v3/files?q=name%3D%27"+encodeURIComponent(folderName)+"%27+and+mimeType%3D%27application/vnd.google-apps.folder%27+and+trashed%3Dfalse&fields=files(id,name)",{
    headers:{"Authorization":"Bearer "+token}
  }).then(function(r){return r.json();}).then(function(data){
    if(data.files&&data.files.length>0){
      callback(data.files[0].id);
    } else {
      // Create
      fetch("https://www.googleapis.com/drive/v3/files",{
        method:"POST",
        headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},
        body:JSON.stringify({name:folderName,mimeType:"application/vnd.google-apps.folder"})
      }).then(function(r){return r.json();}).then(function(f){
        if(f.id){
          // Make accessible by link
          fetch("https://www.googleapis.com/drive/v3/files/"+f.id+"/permissions",{
            method:"POST",
            headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},
            body:JSON.stringify({role:"writer",type:"anyone"})
          }).catch(function(){});
          callback(f.id);
        }
      });
    }
  }).catch(function(){});
}

function driveListPhotos(token, folderId, callback){
  fetch("https://www.googleapis.com/drive/v3/files?q=%27"+folderId+"%27+in+parents+and+trashed%3Dfalse+and+mimeType+contains+%27image%27&fields=files(id,name,thumbnailLink,webContentLink,webViewLink,createdTime)&orderBy=createdTime+desc&pageSize=50",{
    headers:{"Authorization":"Bearer "+token}
  }).then(function(r){return r.json();}).then(function(data){
    callback(data.files||[]);
  }).catch(function(){callback([]);});
}

function driveUploadPhoto(token, folderId, file, callback){
  var metadata=JSON.stringify({name:file.name,parents:[folderId]});
  var form=new FormData();
  form.append("metadata",new Blob([metadata],{type:"application/json"}));
  form.append("file",file);
  fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,thumbnailLink,webContentLink,webViewLink,createdTime",{
    method:"POST",
    headers:{"Authorization":"Bearer "+token},
    body:form
  }).then(function(r){return r.json();}).then(function(f){
    if(f.id){
      // Make accessible
      fetch("https://www.googleapis.com/drive/v3/files/"+f.id+"/permissions",{
        method:"POST",
        headers:{"Authorization":"Bearer "+token,"Content-Type":"application/json"},
        body:JSON.stringify({role:"reader",type:"anyone"})
      }).catch(function(){});
      callback(f);
    }
  }).catch(function(){callback(null);});
}
