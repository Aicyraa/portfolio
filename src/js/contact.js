/* ============================================================
   CONTACT FORM VALIDATION
   Client-side only; no data leaves the page.
   ============================================================ */
import { $, $$ } from './utils.js';

function errorFor(field) {
  const label = field.closest('.field')?.querySelector('label')?.textContent.trim() || 'This field';
  if (field.validity.valueMissing) return `${label} is required.`;
  if (field.validity.typeMismatch) return 'Please enter a valid email address.';
  if (field.validity.tooShort) return `Please use at least ${field.minLength} characters.`;
  return field.validationMessage;
}

function showError(field, message) {
  const output = document.getElementById(`${field.id}-err`);
  if (output) output.textContent = message;
  field.setAttribute('aria-invalid', message ? 'true' : 'false');
}

export function initContactForm() {
  const form = $('#form');
  const okMessage = $('#ok');
  if (!form) return;

  const fields = $$('input, textarea', form);

  form.addEventListener('submit', event => {
    event.preventDefault();
    let firstInvalid = null;

    fields.forEach(field => {
      const message = field.checkValidity() ? '' : errorFor(field);
      showError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      if (okMessage) okMessage.hidden = true;
      firstInvalid.focus();
      return;
    }

    form.reset();
    fields.forEach(field => showError(field, ''));
    if (okMessage) {
      okMessage.hidden = false;
      okMessage.focus();
    }
  });

  fields.forEach(field => {
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') {
        showError(field, field.checkValidity() ? '' : errorFor(field));
      }
    });
  });
}
