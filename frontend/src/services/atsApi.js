/**
 * Sube uno o varios archivos PDF y los criterios de la vacante al endpoint POST /analizar-pdf usando FormData
 * @param {File|File[]|FileList|Object} filesOrPayload - Archivo(s) PDF o payload con { files, criterios_vacante }
 * @param {string|null} [criteriosVacante=''] - Criterios opcionales de la vacante deseada
 * @returns {Promise<Object|Object[]>} Resultado(s) del análisis validado por el backend
 */
export async function analizarPDF(filesOrPayload, criteriosVacante = '') {
  const formData = new FormData();

  let filesList = [];
  let criterios = '';

  if (filesOrPayload instanceof File || filesOrPayload instanceof Blob) {
    filesList = [filesOrPayload];
    criterios = criteriosVacante || '';
  } else if (Array.isArray(filesOrPayload)) {
    filesList = filesOrPayload;
    criterios = criteriosVacante || '';
  } else if (typeof FileList !== 'undefined' && filesOrPayload instanceof FileList) {
    filesList = Array.from(filesOrPayload);
    criterios = criteriosVacante || '';
  } else if (filesOrPayload && typeof filesOrPayload === 'object') {
    const rawFiles = filesOrPayload.files || filesOrPayload.file;
    if (Array.isArray(rawFiles)) {
      filesList = rawFiles;
    } else if (typeof FileList !== 'undefined' && rawFiles instanceof FileList) {
      filesList = Array.from(rawFiles);
    } else if (rawFiles) {
      filesList = [rawFiles];
    }
    criterios = filesOrPayload.criterios_vacante || '';
  }

  // Se añaden los archivos con las llaves 'files' y 'file' para máxima compatibilidad
  for (const f of filesList) {
    formData.append('files', f);
  }
  if (filesList.length === 1) {
    formData.append('file', filesList[0]);
  }

  if (criterios && typeof criterios === 'string' && criterios.trim() !== '') {
    formData.append('criterios_vacante', criterios.trim());
  } else {
    formData.append('criterios_vacante', '');
  }

  // Sin header manual de Content-Type: el navegador asigna multipart/form-data y el boundary automáticamente
  const response = await fetch('https://smart-ats-0c5l.onrender.com/analizar-pdf', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorDetail = `Error HTTP ${response.status} (${response.statusText})`;
    try {
      const errorData = await response.json();
      if (errorData?.detail) {
        errorDetail = typeof errorData.detail === 'string'
          ? errorData.detail
          : JSON.stringify(errorData.detail);
      }
    } catch {
      // Si la respuesta no es JSON válido, mantenemos el mensaje HTTP base
    }
    throw new Error(errorDetail);
  }

  return await response.json();
}

// Alias para compatibilidad con llamadas existentes
export const analizarCV = analizarPDF;

/**
 * Sube un archivo CSV al endpoint POST /procesar-batch usando FormData
 * @param {File} csvFile - Archivo .csv seleccionado por el usuario
 * @returns {Promise<Array<Object>>} Lista de candidatos finalistas analizados
 */
export async function procesarBatchCSV(csvFile) {
  const formData = new FormData();
  formData.append('file', csvFile);

  const response = await fetch('https://smart-ats-0c5l.onrender.com/procesar-batch', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorDetail = `Error HTTP ${response.status} (${response.statusText})`;
    try {
      const errorData = await response.json();
      if (errorData?.detail) {
        errorDetail = typeof errorData.detail === 'string'
          ? errorData.detail
          : JSON.stringify(errorData.detail);
      }
    } catch {
      // Si la respuesta no es JSON válido, mantenemos el mensaje HTTP base
    }
    throw new Error(errorDetail);
  }

  return await response.json();
}
