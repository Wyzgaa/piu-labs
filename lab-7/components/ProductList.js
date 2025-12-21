import productsData from '../data.json' with { type: 'json' };

export default class ProductList extends HTMLElement {
  set products(value) {
    this.render(value);
  }

  connectedCallback() {
    this.products = productsData;
  }

  render(products) {
    this.innerHTML = '';
    this.classList.add('products');

    products.forEach(product => {
      const card = document.createElement('product-card');
      card.product = product; 
      this.appendChild(card);
    });
  }
}

customElements.define('product-list', ProductList);
