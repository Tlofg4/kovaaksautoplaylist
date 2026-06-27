const fs = require('fs').promises;
const path = require('path');

const CONFIG = {
  outputFolder: 'playlists_descargadas',
  delayBetweenRequestsMs: 500,
};

const headers = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "es-419,es;q=0.9,en;q=0.8",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "Referer": "https://www.kovaaks.com/"
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchPlaylistDetails(sharecode) {
  const url = `https://kovaaks.com/webapp-backend/playlist/playlists?page=0&max=5&search=${encodeURIComponent(sharecode)}`;
  try {
    const res = await fetch(url, { method: "GET", headers });
    if (!res.ok) return null;
    const json = await res.json();
    if (json && json.data && json.data.length > 0) {
      const match = json.data.find(p => p.playlistCode === sharecode);
      return match || json.data[0];
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function processDirectory(dirPath) {
  const folderName = path.basename(dirPath);
  console.log(`\n=================================================`);
  console.log(`📁 Procesando carpeta: ${folderName}`);
  
  let files;
  try {
    files = await fs.readdir(dirPath);
  } catch (err) {
    return;
  }

  const mdFiles = files.filter(f => f.toLowerCase().endsWith('.md'));
  if (mdFiles.length === 0) {
    console.log(`⚠️ No se encontraron archivos .md en ${folderName}`);
    return;
  }

  let allMatches = [];
  const regex = /kovaaks[a-z0-9]+/gi;

  for (const mdFile of mdFiles) {
    try {
      const content = await fs.readFile(path.join(dirPath, mdFile), 'utf-8');
      const matches = content.match(regex) || [];
      allMatches.push(...matches);
    } catch (err) {
      console.error(`❌ Error leyendo ${mdFile}:`, err.message);
    }
  }

  const uniqueSharecodes = [...new Set(allMatches)];
  if (uniqueSharecodes.length === 0) {
    console.log(`⚠️ No se encontraron códigos de KovaaKs en los archivos .md de ${folderName}`);
    return;
  }

  console.log(`Encontrados ${uniqueSharecodes.length} códigos únicos.`);

  const outputDir = path.join(dirPath, CONFIG.outputFolder);
  await fs.mkdir(outputDir, { recursive: true });

  let existingFiles = [];
  try {
    existingFiles = await fs.readdir(outputDir);
  } catch (err) {}

  const codesToDownload = uniqueSharecodes.filter(code => {
    return !existingFiles.some(file => file.includes(`_${code}.json`));
  });

  if (codesToDownload.length === 0) {
    console.log(`🎉 ¡Todas las playlists ya están descargadas en ${folderName}!`);
    return;
  }

  console.log(`⏳ Faltan descargar ${codesToDownload.length} playlists en ${folderName}...`);

  for (let i = 0; i < codesToDownload.length; i++) {
    const sharecode = codesToDownload[i];
    console.log(`   [${i + 1}/${codesToDownload.length}] Buscando: ${sharecode}...`);
    
    const playlistData = await fetchPlaylistDetails(sharecode);
    if (playlistData) {
      let cleanName = playlistData.playlistName 
        ? playlistData.playlistName.replace(/[^a-zA-Z0-9_\- ]/g, '').trim().replace(/ /g, '_') 
        : 'Playlist';
      const fileName = `${cleanName}_${sharecode}.json`;
      
      try {
        await fs.writeFile(path.join(outputDir, fileName), JSON.stringify(playlistData, null, 2), 'utf-8');
      } catch (err) {}
    } else {
      console.log(`   ⚠️ No se encontró: ${sharecode}`);
    }
    
    if (i < codesToDownload.length - 1) {
      await sleep(CONFIG.delayBetweenRequestsMs);
    }
  }
  console.log(`✅ Finalizado con la carpeta ${folderName}`);
}

async function runAll() {
  const rootDir = __dirname;
  let items;
  try {
    items = await fs.readdir(rootDir, { withFileTypes: true });
  } catch (err) {
    console.error("Error leyendo directorio principal", err);
    return;
  }

  let directories = items
    .filter(item => item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules')
    .map(item => path.join(rootDir, item.name));

  const targetFolder = process.argv[2];
  if (targetFolder) {
    directories = directories.filter(dir => path.basename(dir) === targetFolder);
    if (directories.length === 0) {
      console.log(`⚠️ No se encontró la carpeta: ${targetFolder}`);
      return;
    }
  }

  console.log('🚀 Iniciando escaneo...');
  
  for (const dir of directories) {
    await processDirectory(dir);
  }
  
  console.log('\n🎉 ¡PROCESO TOTAL COMPLETADO!');
}

runAll();
