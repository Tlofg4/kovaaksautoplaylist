const fs = require('fs').promises;
const path = require('path');

// Configuración general
const CONFIG = {
  outputFolder: 'playlists_descargadas', // Carpeta donde se guardarán los JSON
  delayBetweenRequestsMs: 500,           // Pausa en milisegundos entre peticiones para no saturar la API
};

// Cabeceras simulando un navegador para evitar bloqueos
const headers = {
  "accept": "application/json, text/plain, */*",
  "accept-language": "es-419,es;q=0.9,en;q=0.8",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-site",
  "Referer": "https://www.kovaaks.com/"
};

// Función auxiliar para esperar entre peticiones
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Busca una playlist en la API oficial de KovaaK's por su sharecode
 */
async function fetchPlaylistDetails(sharecode) {
  const url = `https://kovaaks.com/webapp-backend/playlist/playlists?page=0&max=5&search=${encodeURIComponent(sharecode)}`;
  
  try {
    const res = await fetch(url, { method: "GET", headers });
    if (!res.ok) {
      console.error(`❌ Error HTTP ${res.status} al buscar ${sharecode}`);
      return null;
    }
    
    const json = await res.json();
    
    if (json && json.data && json.data.length > 0) {
      // Buscar la playlist que coincida exactamente con el sharecode
      const match = json.data.find(p => p.playlistCode === sharecode);
      return match || json.data[0]; // Si no hay coincidencia exacta, devuelve el primer resultado
    }
    
    return null;
  } catch (err) {
    console.error(`❌ Error de conexión al buscar ${sharecode}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('🚀 Iniciando descarga de playlists...');
  
  // Extraer los códigos de README.md
  let readmeContent;
  try {
    readmeContent = await fs.readFile(path.join(__dirname, 'README.md'), 'utf-8');
  } catch (err) {
    console.error(`❌ Error leyendo README.md:`, err.message);
    return;
  }
  
  const regex = /KovaaKs[A-Za-z0-9]+/g;
  const matches = readmeContent.match(regex) || [];
  const PLAYLIST_SHARECODES = [...new Set(matches)]; // Eliminar duplicados

  console.log(`Encontrados ${PLAYLIST_SHARECODES.length} códigos únicos en el README.md.`);
  
  // 1. Crear la carpeta de salida si no existe
  const outputDir = path.join(__dirname, CONFIG.outputFolder);
  try {
    await fs.mkdir(outputDir, { recursive: true });
    console.log(`📁 Carpeta de destino lista: ${outputDir}`);
  } catch (err) {
    console.error(`❌ Error creando la carpeta de salida:`, err.message);
    return;
  }

  // Buscar archivos que ya existen para omitirlos
  let existingFiles = [];
  try {
    existingFiles = await fs.readdir(outputDir);
  } catch (err) {
    // Si hay error (ej. no existe), se queda vacío
  }
  
  const codesToDownload = PLAYLIST_SHARECODES.filter(code => {
    // Comprobamos si el sharecode ya está en el nombre del archivo
    return !existingFiles.some(file => file.includes(`_${code}.json`));
  });

  console.log(`\n📊 Progreso: Ya tienes ${PLAYLIST_SHARECODES.length - codesToDownload.length} playlists descargadas.`);
  console.log(`⏳ Faltan descargar ${codesToDownload.length} playlists.\n`);

  if (codesToDownload.length === 0) {
    console.log('🎉 ¡Todas las playlists ya están descargadas!');
    return;
  }

  // 2. Iterar sobre la lista de códigos que queremos descargar
  for (let i = 0; i < codesToDownload.length; i++) {
    const sharecode = codesToDownload[i];
    console.log(`\n⏳ [${i + 1}/${codesToDownload.length}] Buscando playlist: ${sharecode}...`);
    
    const playlistData = await fetchPlaylistDetails(sharecode);
    
    if (playlistData) {
      // Limpiar el nombre de la playlist para que sea válido como nombre de archivo
      let cleanName = playlistData.playlistName 
        ? playlistData.playlistName.replace(/[^a-zA-Z0-9_\- ]/g, '').trim().replace(/ /g, '_') 
        : 'Playlist';
      
      // Formato del archivo: Nombre_Sharecode.json
      const fileName = `${cleanName}_${sharecode}.json`;
      const filePath = path.join(outputDir, fileName);
      
      try {
        // Guardamos cada playlist en un archivo JSON por separado
        await fs.writeFile(filePath, JSON.stringify(playlistData, null, 2), 'utf-8');
        console.log(`✅ Guardada exitosamente como: "${fileName}"`);
      } catch (err) {
        console.error(`❌ Error al guardar el archivo ${fileName}:`, err.message);
      }
    } else {
      console.log(`⚠️ No se encontró la playlist con código: ${sharecode}`);
    }
    
    // 3. Pausa de cortesía para no saturar la API
    if (i < codesToDownload.length - 1) {
      await sleep(CONFIG.delayBetweenRequestsMs);
    }
  }
  
  console.log('\n🎉 ¡Proceso de descarga completado!');
}

run();
