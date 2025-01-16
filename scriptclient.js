
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

        // Función para cargar los nombres según el tour seleccionado y obtener el link del ticket
        async function actualizarNombres() {
            const tourSeleccionado = document.getElementById('tourSeleccionado').value;

            if (tourSeleccionado) {
                const accessToken = await renovarAccessToken();
                const sheetID = '19FNnOKmaNwF9zLCUEPkBiLyRoAdImPe4EPjL23ZJ39g';
                const sheetName = 'Datos';

                const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?majorDimension=ROWS`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                const data = await response.json();
                const selectElement = document.getElementById('nombreSeleccionado');
                selectElement.innerHTML = '<option value="">Selecciona tu nombre</option>'; // Limpiar las opciones anteriores

                // Filtrar los nombres que coincidan con el tour seleccionado
                const clientes = data.values.filter(row => row[1] === tourSeleccionado);

                // Eliminar duplicados usando un Set
                const clientesUnicos = [...new Set(clientes.map(row => row[0]))];

                // Agregar los clientes únicos al dropdown
                clientesUnicos.forEach(cliente => {
                    const option = document.createElement('option');
                    option.value = cliente;
                    option.textContent = cliente;
                    selectElement.appendChild(option);
                });

            } else {
                // Si no hay tour seleccionado, limpiar el dropdown de nombres
                const selectElement = document.getElementById('nombreSeleccionado');
                selectElement.innerHTML = '<option value="">Selecciona tu nombre</option>';
            }
        }




        // Función para mostrar la tabla con los datos de pagos
        async function mostrarTabla() {
            const tourSeleccionado = document.getElementById('tourSeleccionado').value;
            const nombreSeleccionado = document.getElementById('nombreSeleccionado').value;

            if (tourSeleccionado && nombreSeleccionado) {
                const accessToken = await renovarAccessToken();
                const sheetID = '19FNnOKmaNwF9zLCUEPkBiLyRoAdImPe4EPjL23ZJ39g';
                const sheetName = 'Datos';

                const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?majorDimension=ROWS`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });

                const data = await response.json();
                const pagos = data.values.filter(row => row[0] === nombreSeleccionado && row[1] === tourSeleccionado);

                // Limpiar la tabla antes de mostrar los nuevos datos
                const tablaBody = document.getElementById('tablaBody');
                tablaBody.innerHTML = '';

                pagos.forEach((row, index) => {
           const tr = document.createElement('tr');
           tr.innerHTML = `
               <td>${row[0]}</td>
               <td>${row[1]}</td>
               <td>${row[2]}</td>
               <td>${index + 1}</td>
               <td>${row[4]}</td>
               <td><span style="color: blue; text-decoration: underline; cursor: pointer;" onclick="verTicket('${row[5]}')">Ver Ticket</span></td>
           `;
           tablaBody.appendChild(tr);
       });

                document.getElementById('tablaPagos').style.display = 'block';  // Mostrar la tabla
            }
        }

        // Función para mostrar el ticket en una nueva ventana emergente
        function verTicket(ticketUrl) {
            const iframe = document.getElementById('ticketIframe');
            iframe.src = ticketUrl;  // Poner el enlace del ticket en el iframe
            const myModal = new bootstrap.Modal(document.getElementById('ticketModal'));
            myModal.show();  // Mostrar el modal
          }

        // Inicializar la carga de tours
        window.onload = function () {
            cargarTours();
        };
