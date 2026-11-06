/**
 * Envía el texto plano de un CV y los criterios de la vacante al endpoint POST /analizar-cv
 * @param {string|Object} textoCvOrPayload - Contenido en texto plano del CV u objeto con { texto_cv, criterios_vacante }
 * @param {string|null} [criteriosVacante=null] - Criterios opcionales de la vacante deseada
 * @returns {Promise<Object>} Resultado del análisis validado por el backend
 */
export async function analizarCV(textoCvOrPayload, criteriosVacante = null) {
  let texto_cv = '';
  let criterios_vacante = null;

  if (typeof textoCvOrPayload === 'object' && textoCvOrPayload !== null) {
    texto_cv = textoCvOrPayload.texto_cv ?? '';
    criterios_vacante = textoCvOrPayload.criterios_vacante ?? null;
  } else {
    texto_cv = textoCvOrPayload;
    criterios_vacante = criteriosVacante;
  }

  const payload = {
    criterios_vacante: (typeof criterios_vacante === 'string' && criterios_vacante.trim() !== '')
      ? criterios_vacante.trim()
      : (criterios_vacante || null),
    texto_cv: texto_cv,
  };

  const response = await fetch('https://smart-ats-0c5l.onrender.com/analizar-cv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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

