const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Envía el texto plano de un CV al endpoint POST /analizar-cv
 * @param {string} textoCv - Contenido en texto plano del CV
 * @returns {Promise<Object>} Resultado del análisis validado por el backend
 */
export async function analizarCV(textoCv) {
  const response = await fetch(`${API_BASE_URL}/analizar-cv`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ texto_cv: textoCv }),
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

/**
 * Sube un archivo CSV al endpoint POST /procesar-batch usando FormData
 * @param {File} csvFile - Archivo .csv seleccionado por el usuario
 * @returns {Promise<Array<Object>>} Lista de candidatos finalistas analizados
 */
export async function procesarBatchCSV(csvFile) {
  const formData = new FormData();
  formData.append('file', csvFile);

  const response = await fetch(`${API_BASE_URL}/procesar-batch`, {
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

