const CARTITEMS = '.cart__items';

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ sku, name, image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const adicionaProduto = async () => {
  const data = await fetchProducts('computador');
  const items = document.querySelector('.items');
  const { results } = data;
  results.forEach((element) => {
    const { id: sku, title: name, thumbnail: image } = element;
    const product = createProductItemElement({ sku, name, image });
    items.appendChild((product));
 });
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  event.target.remove();
  const cartItems = document.querySelector(CARTITEMS);
  const itensNoCarrinho = cartItems.innerHTML;
  saveCartItems(itensNoCarrinho);
};

const createCartItemElement = ({ sku, name, salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const adicionaItemAoCarrinho = async (id) => {
  const data = await fetchItem(id);
  const cartItems = document.querySelector(CARTITEMS);
  const { id: sku, title: name, price: salePrice } = data;
  const product = createCartItemElement({ sku, name, salePrice });
  cartItems.appendChild((product));
  const itensNoCarrinho = cartItems.innerHTML;
  saveCartItems(itensNoCarrinho);
};

const listCardItens = () => {
  const listSaveCardItems = getSavedCartItems('cartItems');
  const cartItems = document.querySelector(CARTITEMS);
  cartItems.innerHTML = listSaveCardItems.trim();
  const cartItem = document.querySelectorAll('.cart__item');
  cartItem.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
};

const listenerItems = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((element) => {
    const parent = element.parentElement;
    const primeiroFilho = parent.firstChild;
    element.addEventListener('click', () => {
      adicionaItemAoCarrinho(primeiroFilho.innerText);
    });
  });
};

  const limpaCarrinho = () => {
    const buttonEmptyCart = document.querySelector('.empty-cart');
    const cartItems = document.querySelector('.cart__items');
    buttonEmptyCart.addEventListener('click', () => {
      cartItems.innerHTML = '';
      saveCartItems('');
      localStorage.clear();
    });
  };

window.onload = async () => {
  limpaCarrinho();
  await adicionaProduto();
  listenerItems();
  listCardItens();
};
