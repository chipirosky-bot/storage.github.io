const explorer = document.getElementById("explorer");

async function loadFolder(id = "root") {
  // const res = await fetch(`http://localhost:3000/api/folder/${id}`);
  //const res = await fetch(`${API_URL}/folder/root`);
  const res = await fetch(`/api/folder/${id}`);

  const data = await res.json();

  explorer.innerHTML = "";
  
  if(id != "root"){
    const div = document.createElement("div");
    div.className = "item folder";
    div.innerHTML = `
        <img src="assets\\directory_open_cool-0.png" />
        <span>..</span>
    `;
    if(id.parent_id == "NULL"){
        div.onclick = () => loadFolder("root");
    }
    else{
        div.onclick = () => loadFolder(id.parent_id);
    }
    div.onmouseenter = () => {
        div.classList.add("selected")
    };
    div.onmouseleave = () => {
        div.classList.remove("selected")
    };
    
    explorer.appendChild(div);
  }

  data.folders.forEach(folder => {
    const div = document.createElement("div");
    div.className = "item folder";
    div.innerHTML = `
      <img src="assets\\directory_open_file_mydocs-5.png" />
      <span>${folder.name}</span>
    `;
    div.onclick = () => loadFolder(folder.id);
    explorer.appendChild(div);
    div.onmouseenter = () => {
        div.classList.add("selected")
    };
    div.onmouseleave = () => {
        div.classList.remove("selected")
    };
  });

  data.files.forEach(file => {
    const div = document.createElement("div");
    div.className = "item file";
    div.innerHTML = `
      <img src="assets\\font_bitmap-0.png" />
      <span>${file.name}</span>
    `;
    explorer.appendChild(div);
    div.ondblclick = () => {
        downloadFile(file.id)
    };
    div.onmouseenter = () => {
        div.classList.add("selected")
    };
    div.onmouseleave = () => {
        div.classList.remove("selected")
    };
  });
}


function downloadFile(fileId) {
  //window.location.href = `${API_URL}/file/${fileId}/download`;
   // window.location.href = `http://localhost:3000/api/file/${fileId}/download`
  window.open(`/api/file/${fileId}/download`, "_blank");
  //descargarArchivo(fileId)
}


descargarArchivo();


loadFolder();
