const nav_aside_cart_list = document.querySelector(".cart-list");
const sub_total = document.querySelectorAll(".cart-price");
const quantity = document.querySelector(".mini-card__order-qt");
const cardItems = document.querySelectorAll(".card__items");

export function findFlowerById(data, id) {
  const item = data.find((flower) => flower.id == id);

  if (item != undefined) {
    return item;
  }
}

export function findFlowerByInput(data, input) {
  const item = data.filter((flower) =>
    flower.name.toLowerCase().includes(input.toLowerCase())
  );

  if (item != undefined) {
    return item;
  } else {
    return "Pas de fleur avec ce nom.";
  }
}

export function showSearchOutput(data) {
  const html = data
    .map((response) => {
      return `
        <li class="search__response--item">
          <a href="#" class="search__response--link">
            <span class="response-name">${response.name}</span>
          </a>
        </li>
  
        `;
    })
    .join(" ");

  return html;
}

export function formatCur(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function getFlowerCart() {
  let flowerCart = localStorage.getItem("flower");
  if (flowerCart == null) {
    return [];
  } else {
    return JSON.parse(flowerCart);
  }
}

export function saveFlowerCart(cart) {
  localStorage.setItem("flower", JSON.stringify(cart));
}

export function showCart() {
  updateCart(getFlowerCart());
  const btnsRemove = document.querySelectorAll(".remove");
  deleteOnClick(btnsRemove);
  getCartAmount();
}

export function updateCart(cart) {
  const html = cart
    .map((flower) => {
      return `<div class="nav-aside__cart--item">
        <div class="nav-aside__cart--img">
          <button class="nav-aside__cart--badge remove" data-item="${
            flower.id
          }">
           <i class="fas fa-trash-can"></i>
          </button>
          <a  class="nav-aside__cart--link"
            ><img src="${flower.image}" alt="${flower.name}"
          /></a>
        </div>
        <div class="nav-aside__cart--info">
          <div class="nav-aside__cart--title" itemprop="name">${flower.name.toUpperCase()}</div>
          <div class="nav-aside__cart--desc">
            <span class="price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">${
              flower.quantity
            } X ${formatCur(flower.price, "en-US")}</span>
          </div>
        </div>
  
    </div>`;
    })
    .join(" ");

  nav_aside_cart_list.innerHTML = html;
}

export function updateCard(flowers) {
  const html = flowers
    .map((flower) => {
      return `<li class="card__item" itemprop="itemListElement" itemscope itemtype="http://schema.org/Product">
      <div class="card__item-prop">
      <div class="card__item-img">
        <div class="card__img-badge">
          <span>10</span>
        </div>
        <a  class="card__img-link"
          ><img src=${flower.image} alt=${flower.name}
        /></a>
        <div class="card__img-panel">
          <button class="card__img-panel-search">
            <a ><i class="fa-solid fa-magnifying-glass"></i></a>
          </button>
          <button class="card__img-panel-add" data-item=${flower.id}>
            <a ><i class="fa-solid fa-basket-shopping card__icon"></i><span class="card__text">ADD TO CART</span></a>
          </button>
          <button class="card__img-panel-view">
            <a ><i class="fa-solid fa-shuffle"></i></a>
          </button>
        </div>
      </div>
      <div class="card__item-info">
        <div class="card__item-title" itemprop="name">${flower.name.toUpperCase()}</div>
        <div class="card__item-desc">
          <span class="price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">$18.00</span>
          <span class="past-price">${formatCur(flower.price, "en-US")}</span>
        </div>
      </div>
      </div>
    </li>`;
    })
    .join(" ");

  cardItems.forEach((items) => (items.innerHTML = html));
}

export function showQuantity() {
  if (getCartQuantity() > 0) {
    quantity.textContent = getCartQuantity();
    quantity.classList.remove("dsp-none");
    quantity.classList.add("dsp-flex");
  } else {
    quantity.classList.add("dsp-none");
    quantity.classList.remove("dsp-flex");
  }
}

export function deleteOnClick(nodelist) {
  const btn_remove_flower = nodelist;
  btn_remove_flower.forEach((button) => {
    button.addEventListener("click", function () {
      let cart = getFlowerCart();
      let flower = findFlowerById(cart, button.dataset.item);
      removeFlower(flower);
      showQuantity();
      showCart();
    });
  });
}

export function addFlower(flower) {
  let cart = getFlowerCart();
  const foundFlower = cart.find((f) => f.id === flower.id);

  if (foundFlower != undefined) {
    foundFlower.quantity++;
  } else {
    flower.quantity = 1;
    cart.push(flower);
  }
  saveFlowerCart(cart);
}

export function removeFlower(flower) {
  let cart = getFlowerCart();
  let foundFlower = cart.find((fl) => fl.id == flower.id);
  if (foundFlower.quantity == 1) {
    cart = cart.filter((fl) => fl.id != flower.id);
  } else {
    foundFlower.quantity--;
  }
  saveFlowerCart(cart);
}

export function deleteQuantity(flower) {
  let cart = getFlowerCart();
  cart = cart.filter((fl) => fl.id != flower.id);
  saveFlowerCart(cart);
}

export function changeQuantity(flower, quantity) {
  let cart = getFlowerCart();
  let foundFlower = cart.find((fl) => fl.id == flower.id);
  if (foundFlower != undefined) {
    foundFlower.quantity += quantity;
  }
  saveFlowerCart(cart);
}

export function getCartQuantity() {
  let cart = getFlowerCart();
  return Object.entries(cart).reduce((acc, flower) => {
    const [key, value] = flower;
    return acc + Number(value.quantity);
  }, 0);
}

export function getCartAmount() {
  let cart = getFlowerCart();
  const amount = Object.entries(cart).reduce((acc, flower) => {
    const [key, value] = flower;
    return acc + Number(value.price) * Number(value.quantity);
  }, 0);

  sub_total.forEach((price) => (price.innerText = formatCur(amount)));
}

export function searchItem(flowers) {
  const input_search = document.querySelectorAll(".input-search");
  const response_search = document.querySelectorAll(".search__response");

  input_search.forEach((input) => {
    response_search.forEach((search) => {
      input.addEventListener("focus", function () {
        input.parentElement.parentElement.classList.add("on");

        input.addEventListener("input", function (e) {
          const element = e.target.value.toLowerCase();
          const items = findFlowerByInput(flowers, element);

          if (search.parentElement.classList.contains("on")) {
            search.innerHTML = showSearchOutput(items);
          }
          if (element != "") {
            search.classList.add("dsp-block");
            search.classList.remove("dsp-none");
          } else {
            search.classList.remove("dsp-block");
            search.classList.add("dsp-none");
          }
        });
      });

      input.addEventListener("blur", function () {
        input.parentElement.parentElement.classList.remove("on");
        search.classList.add("dsp-none");
        search.classList.remove("dsp-block");
        input.value = "";
      });
    });
  });
}

export function showFlowerItems(flowers){
    const btn_add = document.querySelectorAll(".card__img-panel-add");

    btn_add.forEach((button) => {
      button.addEventListener("click", function () {
        const flowerData = findFlowerById(flowers, button.dataset.item);
        addFlower(flowerData);
        showCart();
        showQuantity();
        getCartAmount();
      });
    });
}
