import { getRandomColor } from './helpers.js';

const STORAGE_KEY = 'shapes_state';

class Store {
    constructor() {
        this.state = this.loadState();
        this.subscribers = [];
        if (!Array.isArray(this.state.shapes)) {
            this.state.shapes = [];
        }
    }

    loadState() {
        try {
            const serializedState = localStorage.getItem(STORAGE_KEY);
            if (serializedState === null) {
                return { shapes: [] };
            }
            return JSON.parse(serializedState);
        } catch (err) {
            console.error(err);
            return { shapes: [] };
        }
    }

    saveState() {
        try {
            const serializedState = JSON.stringify(this.state);
            localStorage.setItem(STORAGE_KEY, serializedState);
        } catch (err) {
            console.error(err);
        }
    }

    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }

    getCounters() {
        const { shapes } = this.state;
        const squareCount = shapes.filter((s) => s.type === 'square').length;
        const circleCount = shapes.filter((s) => s.type === 'circle').length;

        return {
            square: squareCount,
            circle: circleCount,
            total: shapes.length,
        };
    }

    subscribe(subscriber) {
        this.subscribers.push(subscriber);
    }

    notify() {
        this.saveState();
        this.subscribers.forEach((subscriber) => subscriber(this.getState()));
    }

    addShape(type) {
        if (type !== 'square' && type !== 'circle') return;

        const newShape = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            type: type,
            color: getRandomColor(),
        };

        this.state.shapes.push(newShape);
        this.notify();
    }

    removeShape(id) {
        const initialLength = this.state.shapes.length;
        this.state.shapes = this.state.shapes.filter(
            (shape) => shape.id !== id
        );
        if (this.state.shapes.length !== initialLength) {
            this.notify();
        }
    }

    recolorShapes(type) {
        let changed = false;
        this.state.shapes = this.state.shapes.map((shape) => {
            if (shape.type === type) {
                changed = true;
                return { ...shape, color: getRandomColor() };
            }
            return shape;
        });

        if (changed) {
            this.notify();
        }
    }
}

export const store = new Store();
