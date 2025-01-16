

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

        // Función para registrar la reservación en Google Sheets
        async function registrarReservacion(event) {
            event.preventDefault();  // Prevenir el comportamiento por defecto del formulario
        
            const accessToken = await renovarAccessToken();  // Obtener el token renovado
            const sheetID = '19FNnOKmaNwF9zLCUEPkBiLyRoAdImPe4EPjL23ZJ39g';
            const sheetName = 'Datos';
        
            const nombreCliente = document.getElementById('nombreCliente').value;
            const tourSeleccionado = document.getElementById('tourSeleccionado').value;
            const fechaTour = new Date(document.getElementById('fechaTour').value);
            const fechaFormateada = `${fechaTour.getDate() - 1} de ${fechaTour.toLocaleString('es-ES', { year: 'numeric' })}`;  // Formatear fecha
            const abono = document.getElementById('abono').checked ? 'Abono' : 'Liquidado';
            const cantidadReserva = document.getElementById('cantidadReserva').value;
            const fechaActual = new Date().toLocaleString('es-ES');  // Fecha actual
        
            const fileInput = document.getElementById('evidenciaDeposito');
            const file = fileInput.files[0];
        
            // Subir el archivo a Google Drive
            let fileUrl = '';
            if (file) {
                fileUrl = await subirArchivoGoogleDrive(file, accessToken);
            }
        
            const body = {
                values: [
                    [
                        nombreCliente,
                        tourSeleccionado,
                        fechaFormateada,
                        abono,
                        cantidadReserva,
                        fileUrl,  // Aquí se guarda el enlace al archivo en Google Drive
                        fechaActual,
                    ]
                ]
            };
        
            try {
                const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}!A1:G1:append?valueInputOption=USER_ENTERED`, {
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
                    console.error('Error al registrar la reservación:', await response.text());
                }
            } catch (error) {
                console.error('Error al registrar:', error);
            }
        }
        
        // Función para subir el archivo a Google Drive
        async function subirArchivoGoogleDrive(file, accessToken) {
            const formData = new FormData();
            formData.append('file', file);
            
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
                    return `https://drive.google.com/file/d/${data.id}/view`;
                } else {
                    console.error('Error al subir el archivo a Google Drive:', await response.text());
                    return '';
                }
            } catch (error) {
                console.error('Error al subir archivo:', error);
                return '';
            }
        }


        // Llamada para cargar los tours cuando la página se haya cargado
        window.onload = cargarTours;

        // Asignar el evento al formulario
        document.getElementById('formularioReservacion').addEventListener('submit', registrarReservacion);
