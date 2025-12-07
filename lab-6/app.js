import { Ajax } from './ajax-lib.js';

const api = new Ajax({
    baseURL: 'https://jsonplaceholder.typicode.com/',
    timeout: 5000,
});

// UI elementy
const btnLoad = document.getElementById('btn-load');
const btnError = document.getElementById('btn-error');
const btnReset = document.getElementById('btn-reset');
const list = document.getElementById('posts');
const message = document.getElementById('message');
const loader = document.getElementById('loader');

function showMessage(msg, isError = false) {
    message.textContent = msg;
    message.style.color = isError ? 'red' : 'green';
}

function showLoader(show) {
    loader.style.display = show ? 'block' : 'none';
}

function resetView() {
    list.innerHTML = '';
    message.textContent = '';
}

// Obsługa pobierania poprawnych danych
btnLoad.addEventListener('click', async () => {
    resetView();
    showLoader(true);

    try {
        const posts = await api.get('posts?_limit=10');
        showLoader(false);

        posts.forEach((p) => {
            const li = document.createElement('li');
            li.textContent = p.title;
            list.appendChild(li);
        });

        showMessage('Pobrano dane 👍');
    } catch (err) {
        showLoader(false);
        showMessage(err.message, true);
    }
});

// Pobranie wywołujące błąd
btnError.addEventListener('click', async () => {
    resetView();
    showLoader(true);

    try {
        await api.get('wrong-endpoint'); // celowy błąd
    } catch (err) {
        showLoader(false);
        showMessage('Błąd: ' + err.message, true);
    }
});

// Reset
btnReset.addEventListener('click', resetView);
