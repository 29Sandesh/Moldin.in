/**
 * MOLDIN.IN — Minimal Progressive Enhancement
 * Handles responsive menu disclosure and static brief builder output.
 */

const initNavigation = () => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-links]');
  if (!toggle || !menu) return;

  const setOpen = (isOpen) => {
    toggle.setAttribute('aria-expanded', String(isOpen));
    menu.classList.toggle('is-open', isOpen);
  };

  toggle.addEventListener('click', () => {
    const currentlyOpen = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!currentlyOpen);
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
};

const initBriefForm = () => {
  document.querySelectorAll('[data-brief-form]').forEach((form) => {
    const resultPanel = form.parentElement?.querySelector('[data-brief-result]');
    const summaryBox = resultPanel?.querySelector('[data-brief-summary]');
    const copyBtn = resultPanel?.querySelector('[data-copy-brief]');
    const editBtn = resultPanel?.querySelector('[data-edit-brief]');

    if (!resultPanel || !summaryBox) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const data = new FormData(form);
      const focusList = data.getAll('focus');
      const lines = [
        'MOLDIN — Campaign Brief',
        `Brand / Product: ${String(data.get('brand') || '').trim()}`,
        `Website or Social: ${String(data.get('website') || 'Not shared').trim()}`,
        `Focus: ${focusList.length ? focusList.join(', ') : 'General match'}`,
        `Starting Scope: ${String(data.get('scope') || '').trim()}`,
        `Contact: ${String(data.get('contact') || '').trim()}`,
        data.get('notes') ? `Notes: ${String(data.get('notes')).trim()}` : null
      ].filter(Boolean);

      summaryBox.textContent = lines.join('\n');
      form.hidden = true;
      resultPanel.hidden = false;
      resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(summaryBox.textContent || '');
          const prevText = copyBtn.textContent;
          copyBtn.textContent = 'Copied to clipboard';
          setTimeout(() => {
            copyBtn.textContent = prevText;
          }, 2200);
        } catch {
          copyBtn.textContent = 'Select & copy text above';
        }
      });
    }

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        resultPanel.hidden = true;
        form.hidden = false;
      });
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initBriefForm();
  });
} else {
  initNavigation();
  initBriefForm();
}
