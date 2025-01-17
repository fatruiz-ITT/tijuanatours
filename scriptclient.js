
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


//555555555555555555555555555555555555555555555555555555555555555555555
// Función para mostrar el modal de abono
function mostrarModal() {
    $('#modalAbono').modal('show');
}

// Función para mostrar los datos del banco según la selección
function mostrarDatosBanco() {
    const bancoSeleccionado = document.getElementById('bancoSelect').value;

    // Ocultar todos los datos de los bancos
    const bancos = document.querySelectorAll('.bancoDatos > div');
    bancos.forEach(banco => banco.style.display = 'none');

    // Mostrar los datos del banco seleccionado
    if (bancoSeleccionado) {
        document.getElementById('datosBanco').style.display = 'block';
        document.getElementById('datos' + bancoSeleccionado.charAt(0).toUpperCase() + bancoSeleccionado.slice(1)).style.display = 'block';
    } else {
        document.getElementById('datosBanco').style.display = 'none';
    }
}

// Función para copiar el texto al portapapeles
function copiarTexto(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        alert('Texto copiado al portapapeles');
    });
}

// Función para enviar el recibo por WhatsApp
function enviarRecibo() {
    const nombreCliente = document.getElementById('concepto').value;
    const mensaje = encodeURIComponent(`Hola, mi nombre es ${nombreCliente}. Aquí está mi recibo de pago.`);
    const url = `https://wa.me/6647277107?text=${mensaje}`;
    window.open(url, '_blank');
}

// Función para imprimir solo los datos del modal
function imprimirDatos() {
    const modalContent = document.querySelector('.modal-body'); // Seleccionamos solo el cuerpo del modal

    // Creamos un nuevo documento de impresión
    const printWindow = window.open('', '', 'width=800,height=600');

    // Escribimos el contenido del modal en el nuevo documento
    printWindow.document.write('<html><head><title>Imprimir Datos de Abono</title>');
    printWindow.document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">'); // FontAwesome
    printWindow.document.write('<style> body { font-family: Arial, sans-serif; } .modal-body { font-size: 16px; } .btn { display: none; } </style>'); // Estilos
    printWindow.document.write('</head><body>');
    printWindow.document.write(modalContent.innerHTML); // Insertamos el contenido
    printWindow.document.write('</body></html>');

    // Esperamos a que el contenido se cargue y luego imprimimos
    printWindow.document.close();
    printWindow.print();
}

// Función para cerrar el modal
function cerrarModal() {
    $('#modalAbono').modal('hide');
}

//66666666666666666666666666666666666666666666666666666666666666666

// Función para obtener la descripción del tour desde la pestaña "Tours"


async function mostrarTabla() {
    const tourSeleccionado = document.getElementById('tourSeleccionado').value;
    const nombreSeleccionado = document.getElementById('nombreSeleccionado').value;

    if (tourSeleccionado && nombreSeleccionado) {
        const accessToken = await renovarAccessToken();
        const sheetID = '19FNnOKmaNwF9zLCUEPkBiLyRoAdImPe4EPjL23ZJ39g';
        const sheetName = 'Datos';
        const toursSheetName = 'Tours';  // Nombre de la pestaña donde están los tours

        // Obtener los datos de la pestaña "Datos"
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

        let totalCantidad = 0;  // Sumar todas las cantidades

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
            totalCantidad += parseFloat(row[4]);  // Sumar el valor de la cantidad
        });

        // Tomar los datos de la primera fila de la tabla
        const datosTicket = pagos[0];  // Tomamos la primera fila para los datos

        // Obtener la descripción del tour
        const descripcionTour = await obtenerDescripcionTour(tourSeleccionado, toursSheetName, sheetID, accessToken);

        const datos = {
            nombreCliente: datosTicket[0],
            tour: datosTicket[1],
            fecha: datosTicket[2],  // Fecha del 3er elemento
            cantidadTotal: totalCantidad.toFixed(2),  // Total de las cantidades
            descripcionTour: descripcionTour  // Descripción del tour
        };

        // Guardar los datos en localStorage
        localStorage.setItem('nombreCliente', datos.nombreCliente);
        localStorage.setItem('tour', datos.tour);
        localStorage.setItem('fecha', datos.fecha);
        localStorage.setItem('cantidadTotal', datos.cantidadTotal);
        localStorage.setItem('descripcionTour', datos.descripcionTour);

        // Actualizar la presentación con los datos de la tabla
        await actualizarPresentacionConDatos(datos);

        // Verificar si el cliente está liquidado
        const clienteLiquidado = data.values.some(row => row[0] === nombreSeleccionado && row[1] === tourSeleccionado && row[3] === 'Liquidado');

        if (clienteLiquidado) {
            document.getElementById('descargarTicketBtn').classList.remove('hidden');
            document.getElementById('realizarAbonoBtn').classList.add('hidden');
        } else {
            document.getElementById('descargarTicketBtn').classList.add('hidden');
            document.getElementById('realizarAbonoBtn').classList.remove('hidden');
        }

      //  document.getElementById('tablaPagos').style.display = 'block';  // Mostrar la tabla
    }
}

// Función para obtener la descripción del tour desde la pestaña "Tours"
async function obtenerDescripcionTour(tourSeleccionado, toursSheetName, sheetID, accessToken) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${toursSheetName}?majorDimension=ROWS`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    const tourRow = data.values.find(row => row[0] === tourSeleccionado);

    // Si encontramos el tour, tomamos el dato de la columna B (índice 1)
    if (tourRow) {
        return tourRow[1];  // Retornar la descripción del tour desde la columna B
    } else {
        return 'Descripción no disponible';  // Si no encontramos el tour
    }
}

async function actualizarPresentacionConDatos(datos) {
    const presentationId = '1EG90To9snj1qIGFwyRmRRrNqIdpPUAIarOft8gdeW9I';  // ID de tu presentación
    const accessToken = await renovarAccessToken();

    const url = `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`;

    // Preparar las solicitudes para reemplazar el texto completo
    const requests = [
        {
            "replaceAllText": {
                "containsText": {
                    "text": "CLIENTE:.*",  // Buscar 'CLIENTE:' seguido de cualquier texto
                    "matchCase": true
                },
                "replaceText": `CLIENTE: ${datos.nombreCliente}`  // Reemplazar con el nuevo nombre del cliente
            }
        },
        {
            "replaceAllText": {
                "containsText": {
                    "text": "TOUR RESERVADO:.*",  // Buscar 'TOUR RESERVADO:' seguido de cualquier texto
                    "matchCase": true
                },
                "replaceText": `TOUR RESERVADO: ${datos.tour}`  // Reemplazar con el nuevo tour
            }
        },
        {
            "replaceAllText": {
                "containsText": {
                    "text": "FECHA DEL TOUR:.*",  // Buscar 'FECHA DEL TOUR:' seguido de cualquier texto
                    "matchCase": true
                },
                "replaceText": `FECHA DEL TOUR: ${datos.fecha}`  // Reemplazar con la nueva fecha
            }
        },
        {
            "replaceAllText": {
                "containsText": {
                    "text": "DESCRIPCIÓN DEL TOUR:.*",  // Buscar 'DESCRIPCIÓN DEL TOUR:' seguido de cualquier texto
                    "matchCase": true
                },
                "replaceText": `DESCRIPCIÓN DEL TOUR: ${datos.descripcionTour}`  // Reemplazar con la nueva descripción
            }
        },
        {
            "replaceAllText": {
                "containsText": {
                    "text": "TOTAL PAGADO:.*",  // Buscar 'TOTAL PAGADO:' seguido de cualquier texto
                    "matchCase": true
                },
                "replaceText": `TOTAL PAGADO: $ ${datos.cantidadTotal}`  // Reemplazar con el nuevo precio
            }
        }
    ];

    // Solicitar actualización de la presentación
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests })
    });

    const result = await response.json();
    console.log('Resultado de la actualización de la presentación:', result);
    if (result.error) {
        console.error('Error al actualizar la presentación:', result.error);
    } else {
        console.log('Actualización exitosa');
    }
    return result;
}


// Función para descargar la presentación como PDF
async function descargarPresentacionComoPDF() {
    const presentationId = '1EG90To9snj1qIGFwyRmRRrNqIdpPUAIarOft8gdeW9I';
    const accessToken = await renovarAccessToken();

    const url = `https://www.googleapis.com/drive/v3/files/${presentationId}/export?mimeType=application/pdf`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const blob = await response.blob();
    const urlBlob = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = 'Recibo_TijuanaTours.pdf';
    a.click();
}

// Este código ya está configurado para llamar a la función de descarga cuando se hace clic en el botón
document.getElementById('descargarTicketBtn').addEventListener('click', async function() {
    await descargarPresentacionComoPDF();  // Llamar a la función para descargar el PDF
});
