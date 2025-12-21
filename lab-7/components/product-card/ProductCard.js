import loadTemplate from '../../utils/loadTemplate.js';

export default class ProductCard extends HTMLElement {
    #product;

    async connectedCallback() {
        const template = await loadTemplate(
            new URL('./ProductCard.html', import.meta.url)
        );

        this.attachShadow({ mode: 'open' }).appendChild(
            template.content.cloneNode(true)
        );

        this.shadowRoot
            .querySelector('button')
            .addEventListener('click', () => {
                this.dispatchEvent(
                    new CustomEvent('add-to-cart', {
                        detail: this.#product,
                        bubbles: true,
                        composed: true,
                    })
                );
            });

        this.render();
    }

    set product(value) {
        this.#product = value;
        this.render();
    }

    get product() {
        return this.#product;
    }

    render() {
        if (!this.shadowRoot || !this.#product) return;

        const { name, price, image, colors = [], promo } = this.#product;

        this.shadowRoot
            .querySelector('slot[name="name"]')
            .replaceWith(document.createTextNode(name));

        this.shadowRoot
            .querySelector('slot[name="price"]')
            .replaceWith(document.createTextNode(`${price.toFixed(2)} zł`));

        this.shadowRoot.querySelector('.image').innerHTML = `
      <img src="${image}" alt="${name}">
      ${promo ? `<span class="promo">${promo}</span>` : ''}
    `;

        const colorsEl = this.shadowRoot.querySelector('.colors');
        colorsEl.innerHTML = colors.map((c) => `<span>${c}</span>`).join('');
    }
}

customElements.define('product-card', ProductCard);
