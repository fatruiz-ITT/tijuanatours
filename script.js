<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Presentación Fatima Ruiz</title>
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
/>
<script type="text/javascript"src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<style>
  *, *::before, *::after {
    box-sizing: border-box;
  }
  body {
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 24px 12px;
    color: #0d47a1;
    min-height: 100vh;
    display: flex;
    justify-content: center;
  }
  .cards-container {
    display: flex;
    gap: 28px;
    max-width: 1200px;
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
  }
  .card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 20px rgb(25 118 210 / 0.25);
    padding: 32px 28px;
    flex: 1 1 320px;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .card:hover, .card:focus-within {
    transform: translateY(-6px);
    box-shadow: 0 14px 28px rgb(25 118 210 / 0.4);
  }

  /* CARD INTRO */
  .card-intro {
    background: #e8f0fe;
    color: #0d47a1;
    align-items: center;
    text-align: center;
  }
  .profile-photo {
    width: 160px;
    height: 160px;
    border-radius: 50%;
    margin-bottom: 24px;
    border: 5px solid #1976d2;
    box-shadow: 0 0 24px #1976d2aa;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  .profile-photo:hover {
    transform: scale(1.05);
  }
  .card-intro h1 {
    font-size: 2.4rem;
    font-weight: 700;
    margin-bottom: 24px;
    letter-spacing: 0.04em;
  }
  .intro-list {
    list-style: none;
    padding-left: 0;
    font-size: 1.1rem;
    line-height: 1.6;
    max-width: 480px;
    margin: 0 auto;
  }
  .intro-list li {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 14px;
    color: #1a237e;
  }
  .intro-list li i {
    color: #1976d2;
    font-size: 1.4rem;
    min-width: 28px;
  }
  .btn-cv {
    margin-top: 30px;
    align-self: center;
    padding: 14px 36px;
    font-size: 1.2rem;
    border-radius: 14px;
    border: none;
    background: linear-gradient(90deg, #0d47a1, #1976d2);
    color: white;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 6px 12px rgb(25 118 210 / 0.6);
    transition: background 0.3s ease, box-shadow 0.3s ease;
  }
  .btn-cv:hover,
  .btn-cv:focus {
    background: linear-gradient(90deg, #1565c0, #0d47a1);
    box-shadow: 0 8px 20px rgb(25 118 210 / 0.8);
    outline: none;
  }

  /* CARD CONTACT ACADEMIC, PERSONAL, LABORAL ETC */
  .card-contacts {
    padding-top: 12px;
  }
  .card-contacts h2 {
    color: #0d47a1;
    margin-bottom: 28px;
    font-weight: 800;
    font-size: 2rem;
    letter-spacing: 0.05em;
    text-align: center;
  }
  .contact-list {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    max-width: 480px;
  }
  .contact-item {
    display: flex;
    align-items: center;
    gap: 16px;
    background: #e3f2fd;
    color: #0d47a1;
    padding: 16px 22px;
    border-radius: 14px;
    margin-bottom: 18px;
    cursor: pointer;
    border: 3px solid transparent;
    transition: border-color 0.3s ease, background-color 0.3s ease;
    font-weight: 600;
    font-size: 1.1rem;
    box-shadow: 0 3px 8px rgb(25 118 210 / 0.15);
  }
  .contact-item i {
    font-size: 1.6rem;
    color: #0d47a1;
    min-width: 28px;
    transition: color 0.3s ease;
  }
  .contact-item:hover,
  .contact-item:focus {
    border-color: #1976d2;
    outline: none;
    background: #d0e3fc;
  }

  /* CARD WHATSAPP */
  .card-whatsapp {
    background: #e8f0fe;
    color: #01579b;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 20px;
  }
  .card-whatsapp h2 {
    margin-bottom: 20px;
    font-weight: 700;
    font-size: 2rem;
    letter-spacing: 0.03em;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 14px;
  }
  .btn-whatsapp {
    background: #1976d2;
    border: none;
    color: white;
    padding: 16px 36px;
    font-size: 1.2rem;
    border-radius: 14px;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 6px 14px rgb(25 118 210 / 0.6);
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
    text-decoration: none;
  }
  .btn-whatsapp:hover,
  .btn-whatsapp:focus {
    background-color: #0d47a1;
    box-shadow: 0 8px 24px rgb(13 71 161 / 0.8);
    outline: none;
  }
  .phone-note {
    margin-top: 16px;
    font-style: italic;
    font-size: 1rem;
    color: #0d47a1cc;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }
  .phone-note i {
    color: #25d366;
    font-size: 1.3rem;
  }
  .whatsapp-img {
    width: 180px;
    margin-top: 10px;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgb(25 118 210 / 0.3);
    object-fit: contain;
  }

  /* MODALES */
  dialog {
    border-radius: 18px;
    box-shadow: 0 0 32px rgb(0 0 0 / 0.4);
    transition: transform 0.3s ease, opacity 0.3s ease;
    max-width: 90vw;
    padding: 24px 28px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  dialog#modalCV {
    width: 480px;
    height: 600px;
  }
  dialog#modalContact {
    max-width: 520px;
  }
  dialog h3 {
    margin-top: 0;
    color: #0d47a1;
    font-weight: 800;
    font-size: 1.8rem;
  }
  dialog p {
    font-size: 1.1rem;
    color: #1565c0;
    line-height: 1.5;
  }
  .close-tooltip {
    align-self: flex-end;
    background: transparent;
    border: none;
    font-size: 1.8rem;
    cursor: pointer;
    color: #0d47a1;
    transition: color 0.3s ease;
  }
  .close-tooltip:hover,
  .close-tooltip:focus {
    color: #1976d2;
    outline: none;
  }
  /* Formulario contacto */
  form {
    margin-top: 14px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  label {
    font-weight: 600;
    color: #0d47a1;
    font-size: 1rem;
  }
  input[type="text"],
  input[type="email"],
  input[type="url"],
  textarea,
  input[type="file"] {
    padding: 10px 14px;
    border-radius: 10px;
    border: 2px solid #1976d2;
    font-size: 1rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    resize: vertical;
  }
  textarea {
    min-height: 80px;
  }
  input[type="file"] {
    padding: 6px 10px;
  }
  input[type="submit"] {
    background: linear-gradient(90deg, #0d47a1, #1976d2);
    border: none;
    padding: 14px 0;
    font-size: 1.2rem;
    border-radius: 14px;
    cursor: pointer;
    color: white;
    font-weight: 700;
    transition: background 0.3s ease;
  }
  input[type="submit"]:hover,
  input[type="submit"]:focus {
    background: linear-gradient(90deg, #1565c0, #0d47a1);
    outline: none;
  }
  /* Mensajes de validación */
  .error-msg {
    color: #b00020;
    font-size: 0.9rem;
    font-weight: 600;
    margin-top: -10px;
  }
  .success-msg {
    color: #0d7a00;
    font-size: 1rem;
    font-weight: 700;
    margin-top: 10px;
  }

  /* Iframe preview CV */
  #cvPreview {
    width: 100%;
    height: 480px;
    border-radius: 14px;
    border: 2px solid #1976d2;
    box-shadow: 0 8px 20px rgb(25 118 210 / 0.35);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .cards-container {
      flex-direction: column;
      align-items: center;
    }
    .card {
      max-width: 95vw;
    }
    .intro-list {
      font-size: 1rem;
    }
  }
</style>
</head>
<body>
<main class="cards-container" role="main" aria-label="Presentación de Fatima Ruiz">

  <!-- Introducción -->
  <section class="card card-intro" tabindex="0" aria-labelledby="intro-title" aria-describedby="intro-desc">
    <img
      class="profile-photo"
      src="https://i.ibb.co/vx7Q7JMN/471992212-10228017750210493-295032562643749720-n-1.jpg"
      alt="Foto de perfil de Fatima Ruiz"
      width="160"
      height="160"
    />
    <h1 id="intro-title">Fatima Ruiz</h1>
    <ul class="intro-list" id="intro-desc">
    <li><i class="fa-solid fa-code"></i> Ingeniera en Informática con más de 6 años de experiencia</li>
    <li><i class="fa-solid fa-laptop-code"></i> Experta en Google Cloud y seguridad de datos</li>
    <li><i class="fa-solid fa-people-group"></i> Líder de equipos con experiencia como Program Manager</li>
    <li><i class="fa-solid fa-briefcase"></i> Proyectos en sectores Tecnológico, Bancario y de Salud</li>
    <li><i class="fa-solid fa-graduation-cap"></i> Egresada de la primera generación de Informática (ITT)</li>
    <li><i class="fa-solid fa-location-dot"></i> Ubicada en Tijuana, México</li>
  </ul>
    <button
      class="btn-cv"
      aria-haspopup="dialog"
      aria-controls="modalCV"
      id="btnOpenCV"
      type="button"
    >
      <i class="fa-solid fa-eye"></i> Ver CV
    </button>
  </section>

  <!-- Contactos -->
  <section class="card card-contacts" tabindex="0" aria-labelledby="contacts-title">
    <h2 id="contacts-title">Contactos</h2>
    <ul class="contact-list">
      <li
        class="contact-item"
        tabindex="0"
        role="button"
        data-contact-type="Académico"
        aria-haspopup="dialog"
        aria-controls="modalContact"
      >
        <i class="fa-solid fa-book"></i> Contacto Académico
      </li>
      <li
        class="contact-item"
        tabindex="0"
        role="button"
        data-contact-type="Personal"
        aria-haspopup="dialog"
        aria-controls="modalContact"
      >
        <i class="fa-solid fa-user"></i> Contacto Personal
      </li>
      <li
        class="contact-item"
        tabindex="0"
        role="button"
        data-contact-type="Laboral"
        aria-haspopup="dialog"
        aria-controls="modalContact"
      >
        <i class="fa-solid fa-briefcase"></i> Contacto Exclusivamente Laboral
      </li>
      <li>
        <a href="https://www.linkedin.com/in/fatima-ruiz" target="_blank" rel="noopener noreferrer" class="contact-item" style="text-decoration:none;">
          <i class="fa-brands fa-linkedin"></i> LinkedIn
        </a>
      </li>
      <li>
        <a href="https://www.facebook.com/fatichikis" target="_blank" rel="noopener noreferrer" class="contact-item" style="text-decoration:none;">
          <i class="fa-brands fa-facebook"></i> Facebook
        </a>
      </li>
      <li>
        <a href="https://www.tiktok.com/@fatimaruiz254" target="_blank" rel="noopener noreferrer" class="contact-item" style="text-decoration:none;">
          <i class="fa-brands fa-tiktok"></i> TikTok
        </a>
      </li>
    </ul>
  </section>

  <!-- WhatsApp -->
  <section class="card card-whatsapp" tabindex="0" aria-labelledby="whatsapp-title">
    <h2 id="whatsapp-title">
      <i class="fa-brands fa-whatsapp"></i> Contacto Directo
    </h2>
    <a
      href="https://wa.me/526644402478?text=Hola%20Fatima,%20me%20gustaria%20contactarte%20por%20mensaje."
      class="btn-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enviar mensaje por WhatsApp a Fatima Ruiz"
    >
      <i class="fa-brands fa-whatsapp"></i> Enviar mensaje
    </a>
    <p class="phone-note" title="Solo mensajes, no disponible para llamadas">
      <i class="fa-solid fa-message"></i> Solo mensajes, no disponible para llamadas
    </p>
    <img
      class="profile-photo"
      src="https://avatars.githubusercontent.com/u/131306116?v=3"
      alt="Foto de perfil de Fatima Ruiz"
      width="160"
      height="160"
    />
  </section>
</main>

<!-- Modal Ver CV -->
<dialog id="modalCV" aria-modal="true" aria-labelledby="modalCVTitle" aria-describedby="modalCVDesc">
  <button class="close-tooltip" aria-label="Cerrar modal CV">&times;</button>
  <h3 id="modalCVTitle">Currículum Vitae - Fatima Ruiz</h3>
  <iframe
    id="cvPreview"
    src="https://drive.google.com/file/d/1iak6HhUbLnYGLjElmBlalr3xrJj0f-g8/preview"
    title="Preview Currículum Vitae"
    frameborder="0"
  ></iframe>
</dialog>

<!-- Modal Contacto -->
<dialog id="modalContact" aria-modal="true" aria-labelledby="modalContactTitle" aria-describedby="modalContactDesc">
  <button class="close-tooltip" aria-label="Cerrar modal contacto">&times;</button>
  <h3 id="modalContactTitle">Contacto</h3>
  <p id="modalContactDesc" role="alert" aria-live="polite" style="display:flex;align-items:center;gap:12px; font-size:1.1rem;">
    <i class="fa-solid fa-shield-halved" style="color:#1976d2; font-size:1.6rem;"></i>
    Hola, que tal. Por motivos de seguridad no muestro mi correo directamente, pero aquí puedes contactarme.
    Una vez que reciba tu mensaje, te contactaré de nuevo.
  </p>
  <form id="contactForm" novalidate>
    <input type="hidden" id="contactSubject" name="subject" value="" />
    <label for="userEmail"><i class="fa-solid fa-envelope"></i> Tu correo electrónico:</label>
    <input
      type="email"
      id="userEmail"
      name="userEmail"
      placeholder="tucorreo@ejemplo.com"
      required
      aria-describedby="emailError"
      autocomplete="email"
    />
    <div id="emailError" class="error-msg" aria-live="assertive"></div>

    <label for="userMessage"><i class="fa-solid fa-comment"></i> Mensaje:</label>
    <textarea
      id="userMessage"
      name="userMessage"
      placeholder="Escribe tu mensaje aquí..."
      required
      aria-describedby="messageError"
      rows="5"
    ></textarea>
    <div id="messageError" class="error-msg" aria-live="assertive"></div>
<!-- Esto es un comentario en HTML -->
<!--
    <label for="userFile"><i class="fa-solid fa-file-upload"></i> Adjuntar archivo (opcional):</label>
    <input type="file" id="userFile" name="userFile" aria-describedby="fileInfo" accept=".pdf,.doc,.jpg,.png" />
 -->

    <label for="userLink"><i class="fa-solid fa-link"></i> Adjuntar enlace (opcional):</label>
    <input
      type="url"
      id="userLink"
      name="userLink"
      placeholder="https://"
      pattern="https?://.+"
      aria-describedby="linkError"
    />
    <div id="linkError" class="error-msg" aria-live="assertive"></div>

    <input type="submit" value="Enviar" aria-label="Enviar mensaje de contacto" />
    <p id="formStatus" class="success-msg" role="alert" aria-live="polite"></p>
  </form>
</dialog>
<script>
  // Abrir modal CV
  const btnOpenCV = document.getElementById('btnOpenCV');
  const modalCV = document.getElementById('modalCV');
  btnOpenCV.addEventListener('click', () => {
    modalCV.showModal();
  });

  // Cerrar modales con el botón
  document.querySelectorAll('.close-tooltip').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.target.closest('dialog').close();
      clearForm();
      clearStatus();
    });
  });

  // Abrir modal Contacto con título dinámico según opción
  const contactItems = document.querySelectorAll('.contact-item[data-contact-type]');
  const modalContact = document.getElementById('modalContact');
  const modalContactTitle = document.getElementById('modalContactTitle');
  const contactSubjectInput = document.getElementById('contactSubject');

  contactItems.forEach((item) => {
    item.addEventListener('click', () => {
      const contactType = item.getAttribute('data-contact-type');
      modalContactTitle.textContent = `Contacto ${contactType}`;
      contactSubjectInput.value = `Mensaje desde formulario: Contacto ${contactType}`;
      modalContact.showModal();
    });
  });

  // Inicializar EmailJS
  emailjs.init('aNnTjgEp-VTuLpRIi'); // Tu clave pública

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userEmail = document.getElementById('userEmail').value.trim();
    const userMessage = document.getElementById('userMessage').value.trim();
    const userLink = document.getElementById('userLink').value.trim();
    const contactOption = document.getElementById('contactSubject').value || "Sin asunto";

    // Validación básica
    if (!userEmail || !userMessage) {
      formStatus.textContent = 'Por favor completa los campos requeridos.';
      formStatus.style.color = 'red';
      return;
    }

    const fechaActual = new Date().toLocaleString('es-MX', {
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const motivoLimpio = contactOption.split(': ')[1]?.trim() || contactOption;

    // Mostrar mensaje de envío
    formStatus.textContent = 'Espere, enviando mensaje...';
    formStatus.style.color = 'black';

    const templateParams = {
      user_email: userEmail,
      message: userMessage,
      link: userLink || 'No proporcionado',
      subject: contactOption,
      contact_option: contactOption,
      motivo: motivoLimpio,
      fecha: fechaActual,
    };

    try {
      await emailjs.send('service_375bq4q', 'template_n05eahg', templateParams, 'aNnTjgEp-VTuLpRIi');

      formStatus.textContent = 'Mensaje enviado correctamente. ¡Gracias!';
      formStatus.style.color = 'green';
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = 'Hubo un problema al enviar el mensaje. Intenta de nuevo.';
      formStatus.style.color = 'red';
      console.error('EmailJS error:', error);
    }
  });

  function clearForm() {
    contactForm.reset();
    emailError.textContent = '';
    messageError.textContent = '';
    linkError.textContent = '';
  }

  function clearStatus() {
    formStatus.textContent = '';
  }
</script>

</body>
</html>
