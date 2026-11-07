/**
 * Sube un archivo PDF y los criterios de la vacante al endpoint POST /analizar-pdf usando FormData
 * @param {File|Object} fileOrPayload - Archivo PDF seleccionado por el usuario u objeto { file, criterios_vacante }
 * @param {string|null} [criteriosVacante=''] - Criterios opcionales de la vacante deseada
 * @returns {Promise<Object>} Resultado del análisis validado por el backend
 */
export async function analizarPDF(fileOrPayload, criteriosVacante = '') {
  const formData = new FormData();

  let file = null;
  let criterios = '';

  if (fileOrPayload instanceof File || fileOrPayload instanceof Blob) {
    file = fileOrPayload;
    criterios = criteriosVacante || '';
  } else if (fileOrPayload && typeof fileOrPayload === 'object') {
    file = fileOrPayload.file;
    criterios = fileOrPayload.criterios_vacante || '';
  }

  if (file) {
    formData.append('file', file);
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
