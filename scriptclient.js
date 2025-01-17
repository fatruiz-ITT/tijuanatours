
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
async function verTicket(link) {
    console.log("Enlace recibido:", link);  // Verifica el enlace

    if (link) {
        const ticketIframe = document.getElementById('ticketIframe');
        const modalTicket = $('#modalTicket');

        // Extraer el ID del archivo de Google Drive
        const fileIdMatch = link.match(/d\/([^\/]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
            const fileId = fileIdMatch[1];
            const iframeUrl = `https://drive.google.com/file/d/${fileId}/preview`;

            console.log("URL del iframe generado:", iframeUrl); // Verifica el enlace del iframe

             ticketIframe.src = iframeUrl;

            // Usar jQuery para mostrar el modal con el ID modalTicket
            modalTicket.modal('show');  // Abre el modal usando jQuery
        } else {
            alert('No se pudo extraer un ID de archivo válido de Google Drive.');
        }

        // Ejecutar la lógica para limpiar la presentación si es necesario
        try {
            const accessToken = await renovarAccessToken();
            if (accessToken) {
                const presentationId = '1EG90To9snj1qIGFwyRmRRrNqIdpPUAIarOft8gdeW9I';
                await limpiarTextoPresentacion(presentationId, accessToken);
            }
        } catch (error) {
            console.error("Error al procesar la solicitud:", error);
            alert("Hubo un error al procesar tu solicitud. Inténtalo de nuevo.");
        }
    } else {
        alert('No se encontró un enlace válido para el ticket.');
    }
}

// Función para cerrar el modal
function closeModal() {
  const ticketIframe = document.getElementById('ticketIframe');
    ticketIframe.src = ''; // Limpia el iframe
    $('#modalTicket').modal('hide'); // Cierra el modal usando jQuery
}




async function mostrarTabla() {
    const tourSeleccionado = document.getElementById('tourSeleccionado').value;
    const nombreSeleccionado = document.getElementById('nombreSeleccionado').value;

    if (tourSeleccionado && nombreSeleccionado) {
        const accessToken = await renovarAccessToken();
        const sheetID = '19FNnOKmaNwF9zLCUEPkBiLyRoAdImPe4EPjL23ZJ39g';
        const sheetName = 'Datos';
        const toursSheetName = 'Tours';

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

        let totalCantidad = 0;

        // Verificar si el cliente está liquidado
        const clienteLiquidado = data.values.some(row => row[0] === nombreSeleccionado && row[1] === tourSeleccionado && row[3] === 'Liquidado');

        pagos.forEach((row, index) => {
            const tr = document.createElement('tr');

            let ticketColumn = '';
            if (!clienteLiquidado) {
                ticketColumn = `<td><span style="color: blue; text-decoration: underline; cursor: pointer;" onclick="verTicket('${row[5]}')">Ver Ticket</span></td>`;
            }

            tr.innerHTML = `
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
                <td>${index + 1}</td>
                <td>${row[4]}</td>
                ${ticketColumn}
            `;
            tablaBody.appendChild(tr);
            totalCantidad += parseFloat(row[4]);
        });

        const datosTicket = pagos[0];
        const descripcionTour = await obtenerDescripcionTour(tourSeleccionado, toursSheetName, sheetID, accessToken);

        const datos = {
            nombreCliente: datosTicket[0],
            tour: datosTicket[1],
            fecha: datosTicket[2],
            cantidadTotal: totalCantidad.toFixed(2),
            descripcionTour: descripcionTour
        };

        await actualizarPresentacionConDatos(datos);

        // Mostrar u ocultar botones según el estado de liquidación
        if (clienteLiquidado) {
            document.getElementById('descargarTicketBtn').classList.remove('hidden');
            document.getElementById('realizarAbonoBtn').classList.add('hidden');
        } else {
            document.getElementById('descargarTicketBtn').classList.add('hidden');
            document.getElementById('realizarAbonoBtn').classList.remove('hidden');
        }
    }
}


// Función para obtener la descripción del tour
async function obtenerDescripcionTour(tourSeleccionado, toursSheetName, sheetID, accessToken) {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${toursSheetName}?majorDimension=ROWS`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    const data = await response.json();
    const tourRow = data.values.find(row => row[0] === tourSeleccionado);

    return tourRow ? tourRow[1] : 'Descripción no disponible';
}

async function generarrecibo() {
    const spreadsheetId = '19FNnOKmaNwF9zLCUEPkBiLyRoAdImPe4EPjL23ZJ39g';  // ID de tu hoja de cálculo
    const accessToken = await renovarAccessToken();  // Obtener el token de acceso

    // Obtener la fecha actual
    const fechaActual = new Date();
    const mes = fechaActual.toLocaleString('default', { month: 'short' }).toUpperCase();  // Ejemplo: 'ENE'
    const mesInicial = mes === "ENE" ? "E" : mes[0];  // Ejemplo: 'E'

    // Determinar la columna correspondiente al mes
    let columna;
    switch (mesInicial) {
        case 'E': columna = 'A'; break; // Enero
        case 'F': columna = 'B'; break; // Febrero
        case 'M': columna = 'C'; break; // Marzo
        case 'A': columna = 'D'; break; // Abril
        case 'J': columna = 'F'; break; // Junio
        case 'J': columna = 'G'; break; // Julio
        case 'A': columna = 'H'; break; // Agosto
        case 'S': columna = 'I'; break; // Septiembre
        case 'O': columna = 'J'; break; // Octubre
        case 'N': columna = 'K'; break; // Noviembre
        case 'D': columna = 'L'; break; // Diciembre
    }

    // Leer los valores actuales en la columna correspondiente
    const range = `Recibos!${columna}2:${columna}`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!response.ok) {
        console.error('Error al leer los recibos existentes:', await response.json());
        return null;
    }

    const data = await response.json();
    let ultimoRecibo = "E25-000";  // Valor por defecto si no hay recibos previos

    if (data.values && data.values.length > 0) {
        ultimoRecibo = data.values[data.values.length - 1][0];  // Último recibo registrado
    }

    // Incrementar el número del recibo
    const reciboNuevo = incrementarRecibo(ultimoRecibo, mesInicial);

    // Guardar el nuevo recibo en Google Sheets
    const body = { values: [[reciboNuevo]] };

    try {
        const responseInsert = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Recibos!${columna}2:${columna}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        if (responseInsert.ok) {
            console.log('Recibo registrado exitosamente:', reciboNuevo);
            return reciboNuevo; // Retornar el recibo generado
        } else {
            console.error('Error al registrar el recibo:', await responseInsert.json());
            return null;
        }
    } catch (error) {
        console.error('Error al registrar el recibo:', error);
        return null;
    }
}


async function actualizarPresentacionConDatos(datos) {
  const accessToken = await renovarAccessToken();  // Obtener el token de acceso

  // Proceder con la actualización de la presentación de Google Slides
    const presentationId = '1EG90To9snj1qIGFwyRmRRrNqIdpPUAIarOft8gdeW9I';  // ID de la presentación
    const urlSlides = `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`;

    const requests = [
        {
            "replaceAllText": {
                "containsText": { "text": "CLIENTE:", "matchCase": true },
                "replaceText": `CLIENTE: ${datos.nombreCliente}`
            }
        },
        {
            "replaceAllText": {
                "containsText": { "text": "TOUR RESERVADO:", "matchCase": true },
                "replaceText": `TOUR RESERVADO: ${datos.tour}`
            }
        },
        {
            "replaceAllText": {
                "containsText": { "text": "FECHA DEL TOUR:", "matchCase": true },
                "replaceText": `FECHA DEL TOUR: ${datos.fecha}`
            }
        },
        {
            "replaceAllText": {
                "containsText": { "text": "DESCRIPCIÓN DEL TOUR:", "matchCase": true },
                "replaceText": `DESCRIPCIÓN DEL TOUR: ${datos.descripcionTour}`
            }
        },
        {
            "replaceAllText": {
                "containsText": { "text": "TOTAL PAGADO:", "matchCase": true },
                "replaceText": `TOTAL PAGADO: $ ${datos.cantidadTotal}`
            }
        }
    ];

    const responseSlides = await fetch(urlSlides, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests })
    });

    if (!responseSlides.ok) {
        console.error('Error al actualizar la presentación:', await responseSlides.json());
    }
}

// Función para incrementar el número del recibo
function incrementarRecibo(ultimoRecibo, mesInicial) {
    const prefix = `${mesInicial}${ultimoRecibo.slice(1, 3)}`;  // 'E25', 'F25', etc.
    let numero = parseInt(ultimoRecibo.slice(4)) + 1;  // Extraer el número y sumarle 1
    let nuevoNumero = numero.toString().padStart(3, '0');  // Formatear con 3 dígitos
    return `${prefix}-${nuevoNumero}`;  // Retornar el nuevo recibo
}

// Descargar presentación como PDF
async function descargarPresentacionComoPDF(reciboNuevo) {
    const presentationId = '1EG90To9snj1qIGFwyRmRRrNqIdpPUAIarOft8gdeW9I';
    const accessToken = await renovarAccessToken();

    // Actualizar la presentación con el número del recibo
    const urlSlides = `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`;

    const requests = [
        {
            replaceAllText: {
                containsText: { text: "RECIBO#:", matchCase: true },
                replaceText: `RECIBO#: ${reciboNuevo}` // Reemplazamos con el nuevo número de recibo
            }
        }
    ];

    const responseUpdate = await fetch(urlSlides, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests })
    });

    if (!responseUpdate.ok) {
        console.error('Error al actualizar la presentación:', await responseUpdate.json());
        return;
    }

    console.log('Presentación actualizada con el recibo:', reciboNuevo);

    // Mostrar mensaje de alerta
    alert(`Tu recibo se ha generado, enseguida empezará la descarga. No olvides compartirlo por WhatsApp a Tijuana Tours`);

    // Descargar el archivo como PDF
    const url = `https://www.googleapis.com/drive/v3/files/${presentationId}/export?mimeType=application/pdf`;

    const responseDownload = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!responseDownload.ok) {
        console.error('Error al descargar el PDF:', await responseDownload.json());
        return;
    }

    const blob = await responseDownload.blob();
    const urlBlob = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = urlBlob;
    a.download = `ReciboTijuanaTour_${reciboNuevo}.pdf`;
    a.click();
}


// Función para renovar el token de acceso utilizando el refresh token
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
            return data.access_token;  // Retorna el nuevo token de acceso
        } else {
            console.error('Error al renovar el token de acceso:', await response.text());
            alert('No se pudo renovar el token de acceso.');
        }
    } catch (error) {
        console.error('Error al renovar el token:', error);
    }
}

// Función para limpiar los textos en la presentación usando el token de acceso
async function limpiarTextoPresentacion(presentationId, accessToken) {
    if (!accessToken) {
        console.error("El token de acceso es necesario.");
        return;
    }

    // Configuración de los headers con el token de acceso
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    const slideServiceUrl = `https://slides.googleapis.com/v1/presentations/${presentationId}`;

    try {
        // Obtener las diapositivas de la presentación
        const response = await fetch(slideServiceUrl, { headers });

        // Verifica el contenido de la respuesta
        const data = await response.json();
        console.log("Respuesta de la API:", data); // Ver la respuesta de la API

        if (!data.slides) {
            console.error("No se pudieron obtener las diapositivas");
            return;
        }

        // Definir las claves de texto que deben ser borradas
        const keysToDelete = [
            'FECHA DEL TOUR: ',
            'CLIENTE: ',
            'TOUR RESERVADO: ',
            'DESCRIPCIÓN DEL TOUR: ',
            'RECIBO#: ',
            'TOTAL PAGADO: '
        ];

        let deletedTexts = [];
        const slides = data.slides;

        // Recorremos las diapositivas
        for (let slide of slides) {
            console.log(`Revisando diapositiva: ${slide.objectId}`);  // Ver la diapositiva en la consola
            // Recorremos los elementos de la diapositiva
            for (let element of slide.pageElements) {
                if (element.shape && element.shape.text) {
                    // Accedemos al contenido del texto
                    const textElements = element.shape.text.textElements;
                    let textContent = textElements.map(te => te.textRun ? te.textRun.content : '').join('');
                    console.log("Texto encontrado:", textContent);  // Ver el texto que se encuentra

                    // Recorremos las claves de texto que necesitamos borrar
                    for (let key of keysToDelete) {
                        if (textContent.includes(key)) {
                            const index = textContent.indexOf(key) + key.length;
                            const newText = textContent.slice(0, index);  // Mantener solo la clave y borrar lo que sigue

                            // Solicitud para reemplazar el texto en la presentación
                            const requestBody = {
                                requests: [{
                                    replaceAllText: {
                                        containsText: { text: textContent },
                                        replaceText: newText,
                                    }
                                }]
                            };

                            // Realizar la actualización de la presentación
                            await fetch(slideServiceUrl + ":batchUpdate", {
                                method: 'POST',
                                headers: headers,
                                body: JSON.stringify(requestBody)
                            });

                            // Registrar los textos borrados
                            deletedTexts.push(textContent.slice(index).trim());  // Borramos el texto posterior a la clave
                        }
                    }
                }
            }
        }

        // Mostrar los textos borrados en consola
        if (deletedTexts.length === 0) {
            console.log("No se borraron textos.");
        } else {
            console.log("Textos borrados:");
            deletedTexts.forEach(deletedText => {
                console.log(deletedText);  // Muestra lo que se ha borrado
            });
        }
    } catch (error) {
        console.error("Error al modificar la presentación:", error);
    }
}

// Evento para descargar y limpiar
document.getElementById('descargarTicketBtn').addEventListener('click', async function () {
    try {
        const reciboNuevo = await generarrecibo();

        if (!reciboNuevo) {
            alert("Hubo un problema al generar el recibo. Inténtalo nuevamente.");
            return;
        }

        console.log('Recibo generado:', reciboNuevo);

        await descargarPresentacionComoPDF(reciboNuevo);

        // Limpiar la presentación si es necesario
        const accessToken = await renovarAccessToken();
        if (accessToken) {
            const presentationId = '1EG90To9snj1qIGFwyRmRRrNqIdpPUAIarOft8gdeW9I';
            await limpiarTextoPresentacion(presentationId, accessToken);
        }
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        alert("Hubo un error al procesar tu solicitud. Inténtalo de nuevo.");
    }
});


// Evento para descargar y limpiar
document.getElementById('realizarAbonoBtn').addEventListener('click', async function () {
    const accessToken = await renovarAccessToken(); // Obtén el token de acceso
    if (accessToken) {
        const presentationId = '1EG90To9snj1qIGFwyRmRRrNqIdpPUAIarOft8gdeW9I'; // ID de tu presentación
        limpiarTextoPresentacion(presentationId, accessToken);
    }
});
