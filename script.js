
/**
 * Portfolio de Rubén Martínez González
 * Funcionalidades generales
 */

function mostrarMensaje(texto) {
  const mensaje = document.getElementById('copied-message');

  if (!mensaje) return;

  mensaje.textContent = texto;
  mensaje.classList.add('show');

  clearTimeout(mensaje._timer);
  mensaje._timer = setTimeout(() => {
    mensaje.classList.remove('show');
  }, 2400);
}

async function copiarCorreo(email) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
    } else {
      const input = document.createElement('textarea');
      input.value = email;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      input.style.left = '-9999px';
      document.body.appendChild(input);
      input.focus();
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }

    mostrarMensaje('Correo copiado al portapapeles');
  } catch (error) {
    mostrarMensaje('No se pudo copiar automáticamente. El correo es: ' + email);
  }
}

// Actualizar automáticamente el año del footer
document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
