export default class ShoppingCart extends HTMLElement {
    #items = [];

    connectedCallback() {
        this.render();

        document.addEventListener('add-to-cart', (e) => {
            this.#items.push(e.detail);
            this.render();
        });
    }

    remove(index) {
        this.#items.splice(index, 1);
        this.render();
    }

    render() {
        const total = this.#items.reduce((s, p) => s + p.price, 0);

        this.innerHTML = `
      <h2>Koszyk</h2>
      <ul>
        ${this.#items
            .map(
                (p, i) => `
            <li>
              ${p.name} – ${p.price.toFixed(2)} zł
              <button data-i="${i}">❌</button>
            </li>`
            )
            .join('')}
      </ul>
      <strong>Suma: ${total.toFixed(2)} zł</strong>
    `;

        this.querySelectorAll('button').forEach(
            (btn) => (btn.onclick = () => this.remove(btn.dataset.i))
        );
    }
}

customElements.define('shopping-cart', ShoppingCart);
