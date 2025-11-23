import { store } from './store.js';

const shapesContainer = document.getElementById('shapes-container');
const squareCountEl = document.getElementById('square-count');
const circleCountEl = document.getElementById('circle-count');
const totalCountEl = document.getElementById('total-count');

function createShapeElement(shape) {
    const el = document.createElement('div');
    el.className = `shape ${shape.type}`;
    el.style.backgroundColor = shape.color;
    el.setAttribute('data-id', shape.id);
    el.setAttribute('data-type', shape.type);
    return el;
}

function updateShapesList(newStateShapes) {
    const currentShapeIds = new Set(
        Array.from(shapesContainer.children).map((el) =>
            el.getAttribute('data-id')
        )
    );
    const newShapeIds = new Set(newStateShapes.map((s) => s.id));
    const allShapesInDOM = Array.from(shapesContainer.children);

    allShapesInDOM.forEach((el) => {
        const id = el.getAttribute('data-id');
        if (!newShapeIds.has(id)) {
            el.remove();
        }
    });

    newStateShapes.forEach((shape) => {
        let el = document.querySelector(`.shape[data-id="${shape.id}"]`);

        if (!el) {
            el = createShapeElement(shape);
            shapesContainer.appendChild(el);
        } else {
            if (el.style.backgroundColor !== shape.color) {
                el.style.backgroundColor = shape.color;
            }
        }
    });
}

function updateCounters() {
    const counters = store.getCounters();
    squareCountEl.textContent = counters.square;
    circleCountEl.textContent = counters.circle;
    totalCountEl.textContent = counters.total;
}

function updateUI(state) {
    updateShapesList(state.shapes);
    updateCounters();
}

function setupEventListeners() {
    shapesContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('shape')) {
            const idToRemove = target.getAttribute('data-id');
            if (idToRemove) {
                store.removeShape(idToRemove);
            }
        }
    });

    document
        .getElementById('add-square')
        .addEventListener('click', () => store.addShape('square'));
    document
        .getElementById('add-circle')
        .addEventListener('click', () => store.addShape('circle'));
    document
        .getElementById('recolor-squares')
        .addEventListener('click', () => store.recolorShapes('square'));
    document
        .getElementById('recolor-circles')
        .addEventListener('click', () => store.recolorShapes('circle'));
}

export function initUI() {
    setupEventListeners();
    store.subscribe(updateUI);

    const initialState = store.getState();
    updateUI(initialState);
}
