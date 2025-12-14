import loadTemplate from '../../utils/loadTemplate.js';

export default class ProductCard extends HTMLElement {
    async connectedCallback() {
        const template = await loadTemplate(
            new URL('./ProductCard.html', import.meta.url)
        );

        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(template.content.cloneNode(true));
    }
}

customElements.define('product-card', ProductCard);
