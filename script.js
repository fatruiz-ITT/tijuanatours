

        // Función para renovar el token de acceso
        async function renovarAccessToken() {
            const clientId = '217452065709-eoi637u5kp9929b3laob6in6a6skknjv.apps.googleusercontent.com';
            const clientSecret = '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';
            const refreshToken = '1//04YzbTZvht8juCgYIARAAGAQSNwF-L9Ir9GmX3DjgLJnUPsgP889ElWofH2CYxZFwreBsPbLwdSpVXUNw-lsly-p8cuf0Nhje4U4';

            const body = new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            });

            try {
                const response = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: body.toString(),
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.access_token;
                } else {
                    console.error('Error al renovar el token de acceso:', await response.text());
                    alert('No se pudo renovar el token de acceso.');
                }
            } catch (error) {
                console.error('Error al renovar el token:', error);
            }
        }

        // Función para cargar los tours desde Google Sheets
        async function cargarTours() {
            const accessToken = await renovarAccessToken();  // Obtener el token renovado
            const sheetID = '19FNnOKmaNwF9zLCUEPkBiLyRoAdImPe4EPjL23ZJ39g';
            const sheetName = 'Tours';

            // Realizar la solicitud a Google Sheets API con el token de acceso
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}!A:A`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            const data = await response.json();

            const selectElement = document.getElementById('tourSeleccionado');
            data.values.forEach((row, index) => {
                if (index > 0) { // Para saltar la primera fila (encabezado)
                    const option = document.createElement('option');
                    option.value = row[0];
                    option.textContent = row[0];
                    selectElement.appendChild(option);
                }
            });
        }

        async function subirArchivoGoogleDrive(file) {
          const folderId = '1t-c62OfAAxTEKYUSCPUb-gbRQRe0kWgs';  // ID de la carpeta de Google Drive
          const accessToken = await renovarAccessToken();  // Asegúrate de obtener el token de acceso

          const formData = new FormData();
          formData.append('metadata', new Blob([JSON.stringify({
              name: file.name,
              parents: [folderId]  // Carpeta de destino
          })], { type: 'application/json' }));
          formData.append('file', file);  // El archivo a subir

          try {
              const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
                  method: 'POST',
                  headers: {
                      'Authorization': `Bearer ${accessToken}`,
                  },
                  body: formData,
              });

              if (response.ok) {
                  const data = await response.json();
                  const fileUrl = `https://drive.google.com/file/d/${data.id}/view`;  // URL del archivo subido
                  console.log('Archivo subido exitosamente:', fileUrl);
                  return fileUrl;
              } else {
                  const errorData = await response.json();
                  console.error('Error al subir archivo:', errorData);
                  return null;
              }
          } catch (error) {
              console.error('Error al subir archivo:', error);
              return null;
          }
      }

        // Función para registrar la reservación en Google Sheets
        async function registrarReservacion(event) {
    event.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    const accessToken = await renovarAccessToken(); // Obtener el token renovado
    const sheetID = '19FNnOKmaNwF9zLCUEPkBiLyRoAdImPe4EPjL23ZJ39g'; // ID de tu hoja de cálculo
    const sheetName = 'Datos'; // Nombre de la pestaña donde deseas almacenar los datos

    const nombreCliente = document.getElementById('nombreCliente').value;
    const tourSeleccionado = document.getElementById('tourSeleccionado').value;
    const fechaTour = new Date(document.getElementById('fechaTour').value);
    const fechaFormateada = `${fechaTour.getDate()} de ${fechaTour.toLocaleString('es-ES', { month: 'long' })} de ${fechaTour.getFullYear()}`;
    const abono = document.getElementById('abono').checked ? 'Abono' : 'Liquidado';
    const cantidadReserva = document.getElementById('cantidadReserva').value;
    const cantidadAsientos = document.getElementById('cantidadAsientos').value; // Nuevo dato
    const evidenciaDeposito = document.getElementById('evidenciaDeposito').files[0];
    const fechaActual = new Date().toLocaleString('es-ES'); // Fecha actual

    // Si se sube un archivo, se obtiene el enlace
    const fileURL = evidenciaDeposito ? await subirArchivoGoogleDrive(evidenciaDeposito) : 'No se subió archivo';

    // Crear el cuerpo de la solicitud para Google Sheets
    const body = {
        values: [
            [
                nombreCliente,    // Columna A
                tourSeleccionado, // Columna B
                fechaFormateada,  // Columna C
                abono,            // Columna D
                cantidadReserva,  // Columna E
                fileURL,          // Columna F
                fechaActual,      // Columna G
                cantidadAsientos  // Columna H (nuevo dato)
            ]
        ]
    };

    try {
        // Enviar la solicitud a la API de Google Sheets
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}!A1:H1:append?valueInputOption=USER_ENTERED`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (response.ok) {
            alert('Reservación registrada exitosamente.');
        } else {
            const errorData = await response.json();
            console.error('Error al registrar la reservación:', errorData);
        }
    } catch (error) {
        console.error('Error al registrar la reservación:', error);
    }
}


        // Función para cargar los nombres desde Google Sheets y llenar el datalist
        // Función para cargar los nombres desde Google Sheets y llenar el datalist
async function cargarNombres() {
    const accessToken = await renovarAccessToken(); // Obtener el token renovado
    const sheetID = '19FNnOKmaNwF9zLCUEPkBiLyRoAdImPe4EPjL23ZJ39g'; // ID de la hoja de cálculo
    const sheetName = 'Datos'; // Nombre de la pestaña donde están los nombres

    try {
        // Realizar la solicitud a Google Sheets API para obtener los nombres
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}!A:A`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            const datalist = document.getElementById('clientes');
            datalist.innerHTML = ''; // Limpiar las opciones previas

            // Recorrer los datos y agregar opciones al datalist
            if (data.values) {
                data.values.forEach((row, index) => {
                    if (index > 0) { // Saltar la fila de encabezado
                        const option = document.createElement('option');
                        option.value = row[0]; // El nombre del cliente está en la columna A
                        datalist.appendChild(option);
                    }
                });
            }
        } else {
            console.error('Error al cargar nombres:', await response.text());
        }
    } catch (error) {
        console.error('Error al cargar nombres:', error);
    }
}

// Llamar a cargarNombres cuando la página cargue
window.onload = function () {
    cargarNombres(); // Llenar el datalist con los nombres de clientes
    cargarTours();   // Llenar la lista de tours
};


        // Llamada para cargar los nombres cuando la página se haya cargado
        window.onload = function() {
            cargarTours();  // Cargar tours
            cargarNombres();  // Cargar nombres de clientes
        };

        // Llamada para cargar los tours cuando la página se haya cargado
        window.onload = cargarTours;

        // Asignar el evento al formulario
        document.getElementById('formularioReservacion').addEventListener('submit', registrarReservacion);
