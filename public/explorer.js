const explorer = document.getElementById("explorer");
let highestZ = 100;
let offsetX = 0;
let offsetY = 0;
let draggingWindow = null;

const res = null
const data = null

async function loadData(id = "root") {
  res = await fetch(`https://storage-github-io.onrender.com/api/folder/${id}`)
  data = await res.json();
}

async function loadFolder(id = "root") {
  // const res = await fetch(`http://localhost:3000/api/folder/${id}`);
  //const res = await fetch(`${API_URL}/folder/root`);
  //const res = await fetch(`/api/folder/${id}`);
  const res = await fetch(`https://storage-github-io.onrender.com/api/folder/${id}`)
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
  //window.location.href = `api/file/${fileId}/download`;
}

function selectedFolder(id, bol){
  const folder = document.getElementById(id)
  if(bol){
    folder.classList.add("selected");
  }
  else{
    folder.classList.remove("selected")
  }
}

function closeWindow() {
  const win = document.querySelector('.window');
  //win.style.visibility = 'hidden';
  win.style.opacity = 0;
  setTimeout(() => win.style.display = 'none', 200);
}

function closeWindowInicial() {
  const win = document.querySelector('.window');
  win.style.display = 'none';
}

function openWindow() {
  loadFolder()
  const win = document.querySelector('.window');
  win.style.display = 'block';
  setTimeout(() => win.style.opacity = 1, 10);
}

function startDrag(e) {
  const win = document.querySelector('.window');
  //const win = document.getElementById(id);
  draggingWindow = win;

  //focusWindow(id);

  offsetX = e.clientX - win.offsetLeft;
  offsetY = e.clientY - win.offsetTop;

  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
  if (!draggingWindow) return;

  draggingWindow.style.left = (e.clientX - offsetX) + 'px';
  draggingWindow.style.top  = (e.clientY - offsetY) + 'px';
}

function stopDrag() {
  draggingWindow = null;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', stopDrag);
}

function minimizeWindow() {
  const win = document.querySelector('.window');
  win.style.display = 'none';
}

function maximizeWindow() {
  const win = document.querySelector('.window');

  if (win.classList.contains('maximized')) {
    // Restaurar
    win.style.top = win.dataset.top;
    win.style.left = win.dataset.left;
    win.style.width = win.dataset.width;
    win.style.height = win.dataset.height;
    win.classList.remove('maximized');
  } else {
    // Guardar estado
    win.dataset.top = win.style.top;
    win.dataset.left = win.style.left;
    win.dataset.width = win.style.width;
    win.dataset.height = win.style.height;

    win.style.top = '0';
    win.style.left = '0';
    win.style.width = '100vw';
    win.style.height = 'calc(100vh - 32px)'; /* respeta taskbar */
    win.classList.add('maximized');
  }
}


function toggleWindow() {
  const win = document.querySelector('.window');
  if (win.style.display === 'none') {
    openWindow();
  } else {
    minimizeWindow();
  }
}

/* 
//multiple ventana

function focusWindow() {
  const win = document.querySelector('.window');
  //const win = document.getElementById(id);

  document.querySelectorAll('.window').forEach(w =>
    w.classList.remove('active')
  );

  highestZ++;
  win.style.zIndex = highestZ;
  win.classList.add('active');
}
function closeWindow(id) {
  document.getElementById(id).style.display = 'none';
}

function openWindow(id) {
  document.getElementById(id).style.display = 'block';
}
*/

// loadFolder();
closeWindowInicial()