/**
 * MOLDIN.india — Progressive Enhancement
 * Handles scroll header state, responsive nav, quick access dialog, and brief desk.
 */

const initHeader = () => {
  const header = document.querySelector('[data-site-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-links]');

  if (header && !header.classList.contains('site-header--solid')) {
    const syncScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', syncScroll, { passive: true });
    syncScroll();
  }

  if (toggle && menu) {
    const setOpen = (isOpen) => {
      toggle.setAttribute('aria-expanded', String(isOpen));
      menu.classList.toggle('is-open', isOpen);
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      setOpen(!open);
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
  }
};

const initAccessDialog = () => {
  const dialog = document.querySelector('[data-access-dialog]');
  if (!dialog) return;

  const openers = document.querySelectorAll('[data-open-dialog]');
  const closers = dialog.querySelectorAll('[data-close-dialog]');

  const closeDialog = () => {
    dialog.hidden = true;
    document.body.style.overflow = '';
  };

  openers.forEach((btn) => {
    btn.addEventListener('click', () => {
      dialog.hidden = false;
      document.body.style.overflow = 'hidden';
    });
  });

  closers.forEach((btn) => btn.addEventListener('click', closeDialog));

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !dialog.hidden) closeDialog();
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
        'MOLDIN.india — Brand Brief',
        `Brand / Product: ${String(data.get('brand') || '').trim()}`,
        `Website or @Handle: ${String(data.get('website') || 'Not shared').trim()}`,
        `Focus: ${focusList.length ? focusList.join(', ') : 'Creator Campaign'}`,
        `Batch Size: ${String(data.get('scope') || '').trim()}`,
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
          const prev = copyBtn.textContent;
          copyBtn.textContent = 'Copied Brief';
          setTimeout(() => {
            copyBtn.textContent = prev;
          }, 2200);
        } catch {
          copyBtn.textContent = 'Select text to copy';
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
    initHeader();
    initAccessDialog();
    initBriefForm();
  });
} else {
  initHeader();
  initAccessDialog();
  initBriefForm();
}
