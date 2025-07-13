document.addEventListener('DOMContentLoaded', () => {

  // --- THEME SWITCHER LOGIC ---
  const themeSwitcher = document.getElementById('themeSwitcher');
  const doc = document.documentElement;

  // Determine and set initial theme
  const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  doc.setAttribute('data-theme', currentTheme);

  // Handle theme switch on button click
  themeSwitcher.addEventListener('click', () => {
    let newTheme = doc.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    doc.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });

  // --- ORIGINAL FORM SCRIPT (UNCHANGED) ---
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxn83uzwrVzpJXTsukN6c1z3HTTzMT_efBMSYSnJXB4hz_lPi3ySrOo5vjjw_3Vtu8U/exec';

  const form = document.getElementById('logForm');
  const submitBtn = document.getElementById('submitBtn');
  const messageDiv = document.getElementById('message');
  const filamentSourceSelect = document.getElementById('filamentSource');
  const filamentDetailsSection = document.getElementById('filamentDetailsSection');
  const clubFilamentWrapper = document.getElementById('clubFilamentWrapper');
  const clubFilamentSelect = document.getElementById('clubFilament');
  const manualFilamentWrapper = document.getElementById('manualFilamentWrapper');
  const manualFilamentInput = document.getElementById('manualFilament');

  async function fetchAndPopulateFilaments() {
    try {
      const response = await fetch(SCRIPT_URL + '?action=getFilaments');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.result !== 'success') throw new Error(result.message);

      const filamentNames = result.data;
      clubFilamentSelect.innerHTML = '<option value="" disabled selected>Loading filaments...</option>';

      if (filamentNames && filamentNames.length > 0) {
        clubFilamentSelect.innerHTML = '<option value="" disabled selected>Select a filament</option>';
        filamentNames.forEach(name => {
          const option = document.createElement('option');
          option.value = name;
          option.textContent = name;
          clubFilamentSelect.appendChild(option);
        });
      } else {
        clubFilamentSelect.innerHTML = '<option value="" disabled>No filaments available.</option>';
      }
      clubFilamentWrapper.classList.remove('hidden');
      manualFilamentWrapper.classList.add('hidden');
    } catch (error) {
      console.error('Error fetching filaments:', error);
      messageDiv.textContent = `Could not load club filaments: ${error.message}. Please use 'Own Filament'.`;
      messageDiv.className = 'message-error';
      clubFilamentWrapper.classList.add('hidden');
      manualFilamentWrapper.classList.remove('hidden');
      manualFilamentInput.required = true;
      clubFilamentSelect.required = false;
      if (filamentSourceSelect.value === 'Clubs') {
        filamentSourceSelect.value = 'Own';
      }
    }
  }

  filamentSourceSelect.addEventListener('change', (e) => {
    const selectedSource = e.target.value;
    filamentDetailsSection.classList.remove('hidden');
    messageDiv.textContent = '';
    messageDiv.className = '';
    if (selectedSource === 'Clubs') {
      clubFilamentSelect.required = true;
      manualFilamentInput.required = false;
      fetchAndPopulateFilaments();
    } else if (selectedSource === 'Own') {
      clubFilamentWrapper.classList.add('hidden');
      manualFilamentWrapper.classList.remove('hidden');
      manualFilamentInput.required = true;
      clubFilamentSelect.required = false;
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    messageDiv.textContent = '';
    messageDiv.className = '';

    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });
    if (data.filamentSource === 'Clubs') {
      data.filamentDetails = data.clubFilament;
    } else {
      data.filamentDetails = data.manualFilament;
    }
    delete data.clubFilament;
    delete data.manualFilament;

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (result.result === "success") {
        messageDiv.textContent = result.message;
        messageDiv.className = 'message-success';
        form.reset();
        filamentDetailsSection.classList.add('hidden');
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Submission Error:', error);
      messageDiv.textContent = 'An error occurred. Please try again. ' + error.message;
      messageDiv.className = 'message-error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit';
    }
  });
});