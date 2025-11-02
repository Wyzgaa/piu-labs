const columns = document.querySelectorAll('.column');

// Losowanie kolorów
const randomColor = () =>
    '#' + Math.floor(Math.random() * 16777215).toString(16);

// Zapis aktualnego stanu tablicy
function saveState() {
    const data = Array.from(columns).map((col) => ({
        status: col.dataset.status,
        cards: Array.from(col.querySelectorAll('.card')).map((card) => ({
            id: card.dataset.id,
            text: card.querySelector('.text').innerText,
            color: card.style.backgroundColor,
        })),
    }));
    localStorage.setItem('kanbanData', JSON.stringify(data));
}

function loadState() {
    const data = JSON.parse(localStorage.getItem('kanbanData') || '[]');
    data.forEach((colData) => {
        const col = document.querySelector(
            `.column[data-status="${colData.status}"] .cards`
        );
        colData.cards.forEach((card) =>
            addCard(col, card.text, card.color, card.id)
        );
    });
    updateCounts();
}

// Tworzenie karty
function addCard(
    container,
    text = 'Nowa karta',
    color = randomColor(),
    id = Date.now()
) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = id;
    card.style.backgroundColor = color;

    card.innerHTML = `
        <div class="delete">×</div>
        <div class="text" contenteditable="true">${text}</div>
        <div class="card-controls">
            <button class="left">←</button>
            <button class="color">🎨</button>
            <button class="right">→</button>
        </div>
    `;

    container.appendChild(card);
    updateCounts();
    saveState();
}

// Aktualizacja liczników
function updateCounts() {
    columns.forEach((col) => {
        const count = col.querySelectorAll('.card').length;
        col.querySelector('.count').textContent = count;
    });
}

// Przyciski
document.body.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    const column = e.target.closest('.column');
    const cardsContainer = column?.querySelector('.cards');

    if (e.target.classList.contains('add')) {
        addCard(cardsContainer);
    }

    if (e.target.classList.contains('delete')) {
        card.remove();
        updateCounts();
        saveState();
    }

    if (e.target.classList.contains('color')) {
        card.style.backgroundColor = randomColor();
        saveState();
    }

    if (e.target.classList.contains('colorize')) {
        cardsContainer.querySelectorAll('.card').forEach((c) => {
            c.style.backgroundColor = randomColor();
        });
        saveState();
    }

    if (e.target.classList.contains('sort')) {
        const sorted = Array.from(cardsContainer.children).sort((a, b) => {
            return a
                .querySelector('.text')
                .innerText.localeCompare(b.querySelector('.text').innerText);
        });
        sorted.forEach((c) => cardsContainer.appendChild(c));
        saveState();
    }

    // Przenoszenie karty w prawo
    if (e.target.classList.contains('right')) {
        const next = column.nextElementSibling?.querySelector('.cards');
        if (next) {
            next.appendChild(card);
            updateCounts();
            saveState();
        }
    }

    // Przenoszenie karty w lewo
    if (e.target.classList.contains('left')) {
        const prev = column.previousElementSibling?.querySelector('.cards');
        if (prev) {
            prev.appendChild(card);
            updateCounts();
            saveState();
        }
    }
});

document.body.addEventListener('input', (e) => {
    if (e.target.classList.contains('text')) {
        saveState();
    }
});

loadState();
