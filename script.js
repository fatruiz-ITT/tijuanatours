

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
      const telefonoCliente = document.getElementById('telefonoCliente').value; // Nuevo dato
      const tourSeleccionado = document.getElementById('tourSeleccionado').value;
      const fechaTour = new Date(document.getElementById('fechaTour').value);
      const fechaFormateada = `${fechaTour.getDate()} de ${fechaTour.toLocaleString('es-ES', { month: 'long' })} de ${fechaTour.getFullYear()}`;
      const abono = document.getElementById('abono').checked ? 'Abono' : 'Liquidado';
      const cantidadReserva = document.getElementById('cantidadReserva').value;
      const cantidadAsientos = document.getElementById('cantidadAsientos').value;
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
                  cantidadAsientos, // Columna H
                  telefonoCliente   // Columna I (nuevo dato)
              ]
          ]
      };

      try {
          // Enviar la solicitud a la API de Google Sheets
          const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}!A1:I1:append?valueInputOption=USER_ENTERED`, {
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

  // SECCCION MODAL PARA EL BOTON FLOTANTE

  // Función para cargar los tours en el dropdown del modal
async function cargarToursDisponibilidad() {
    const accessToken = await renovarAccessToken();
    const sheetID = '19FNnOKmaNwF9zLCUEPkBiLyRoAdImPe4EPjL23ZJ39g';
    const sheetName = 'Tours';

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}!A:A`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        const dropdown = document.getElementById('tourDisponibilidad');
        dropdown.innerHTML = '<option value="">Selecciona un tour</option>'; // Limpiar opciones previas

        data.values.forEach((row, index) => {
            if (index > 0) {
                const option = document.createElement('option');
                option.value = row[0];
                option.textContent = row[0];
                dropdown.appendChild(option);
            }
        });
    }
}

// Función para cargar el nombre basado en el número de teléfono
async function cargarDatosPorTelefono() {
    const accessToken = await renovarAccessToken(); // Obtener el token renovado
    const sheetID = '19FNnOKmaNwF9zLCUEPkBiLyRoAdImPe4EPjL23ZJ39g'; // ID de tu hoja de cálculo
    const sheetName = 'Datos'; // Nombre de la pestaña donde se almacenan los datos

    const telefonoCliente = document.getElementById('telefonoCliente').value.trim(); // Obtener el teléfono ingresado y eliminar espacios

    if (!telefonoCliente) {
        alert('Por favor, ingresa un número de teléfono.');
        return;
    }

    try {
        // Obtener todos los datos de la hoja de cálculo
        const response = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`, // Token en el encabezado
                },
            }
        );

        if (!response.ok) {
            console.error('Error al obtener los datos:', response.statusText);
            alert('Error al conectar con la hoja de cálculo.');
            return;
        }

        const data = await response.json();
        const rows = data.values;

        // Buscar el número de teléfono en la columna I
        let foundRow = null;
        rows.forEach(row => {
            if (row[8] && row[8].trim() === telefonoCliente) {
                foundRow = row;
            }
        });

        if (foundRow) {
            // Si se encuentra, cargar los datos en los inputs correspondientes
            document.getElementById('nombreCliente').value = foundRow[0] || ''; // Columna A (Nombre)
            document.getElementById('tourSeleccionado').value = foundRow[1] || ''; // Columna B (Tour seleccionado)
            document.getElementById('cantidadAsientos').value = foundRow[7] || ''; // Columna H (Cantidad de asientos)

            // Parsear la fecha y cargarla
            const fechaTour = foundRow[6] || ''; // Columna G (Fecha del tour)
            if (fechaTour) {
                const [dia, mes, año] = fechaTour.split(' de ');
                const meses = {
                    enero: '01', febrero: '02', marzo: '03', abril: '04', mayo: '05', junio: '06',
                    julio: '07', agosto: '08', septiembre: '09', octubre: '10', noviembre: '11', diciembre: '12'
                };
                const fechaFormateada = `${año}-${meses[mes.toLowerCase()]}-${dia.padStart(2, '0')}`;
                document.getElementById('fechaTour').value = fechaFormateada; // Asignar al input tipo date
            }

            alert('Datos cargados exitosamente.');
        } else {
            // Si no se encuentra, limpiar los campos
            document.getElementById('nombreCliente').value = '';
            document.getElementById('tourSeleccionado').value = '';
            document.getElementById('cantidadAsientos').value = '';
            document.getElementById('fechaTour').value = '';
            alert('El número de teléfono no está registrado.');
        }
    } catch (error) {
        console.error('Error al cargar los datos:', error);

    }
}

// Evento para ejecutar la función al hacer clic en el botón "Validar"
document.getElementById('validarTelefono').addEventListener('click', cargarDatosPorTelefono);


// Función para mostrar la disponibilidad de asientos
async function validarDisponibilidad() {
    const tourSeleccionado = document.getElementById('tourDisponibilidad').value;
    if (!tourSeleccionado) {
        alert('Selecciona un tour.');
        return;
    }

    const accessToken = await renovarAccessToken();
    const sheetID = '19FNnOKmaNwF9zLCUEPkBiLyRoAdImPe4EPjL23ZJ39g';
    const sheetName = 'Datos';

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}!A:I`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (response.ok) {
        const data = await response.json();
        const filas = data.values;
        let totalAsientos = 0;
        const reservas = {};
        const clientesContados = new Set();  // Usamos un Set para asegurarnos de contar solo una vez a cada cliente

        filas.forEach((fila, index) => {
            if (index > 0 && fila[1] === tourSeleccionado) { // Columna B: Nombre del tour
                const nombreCliente = fila[0]; // Columna A: Nombre del cliente
                const cantidadAsientos = parseInt(fila[7]) || 0; // Columna H: Cantidad de asientos reservados

                // Solo contar una vez por cliente
                if (!clientesContados.has(nombreCliente)) {
                    reservas[nombreCliente] = cantidadAsientos;
                    clientesContados.add(nombreCliente);
                }
            }
        });

        // Calcular el total de asientos
        totalAsientos = Object.values(reservas).reduce((total, cantidad) => total + cantidad, 0);

        // Mostrar total de asientos
        document.getElementById('totalAsientos').style.display = 'block';
        document.getElementById('cantidadTotal').textContent = totalAsientos;

        // Mostrar la tabla
        const tbody = document.getElementById('tablaReservasBody');
        tbody.innerHTML = '';
        for (const nombreCliente in reservas) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${nombreCliente}</td><td>${reservas[nombreCliente]}</td>`;
            tbody.appendChild(row);
        }
        document.getElementById('tablaReservas').style.display = 'table';
    } else {
        console.error('Error al obtener datos:', await response.text());
    }
}


// Evento para cargar tours en el modal
document.getElementById('modalDisponibilidad').addEventListener('show.bs.modal', cargarToursDisponibilidad);

// Evento para validar disponibilidad cuando se selecciona un tour
document.getElementById('tourDisponibilidad').addEventListener('change', validarDisponibilidad);
