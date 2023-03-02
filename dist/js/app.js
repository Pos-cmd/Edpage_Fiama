const cardItems = document.querySelectorAll(".card__items");
const nav_aside_menu = document.querySelector(".nav-aside");
const nav_aside_cart = document.querySelector(".nav-aside--cart");
const nav_aside_cart_list = document.querySelector(".cart-list");
const shopping_cart_item = document.getElementById("item-bag");
const overlay = document.querySelector(".overlay");
const toggle_menu = document.querySelector(".burger");
const btn_close_aside = document.querySelectorAll(".nav-aside__close");
const sub_total = document.querySelectorAll(".cart-price");
const quantity = document.querySelector(".mini-card__order-qt");
const input_search = document.querySelectorAll(".input-search");
const response_search = document.querySelectorAll(".search__response");

fetch("/dist/js/mock.json")
  .then((res) => res.json())
  .then((data) => {
    const flowers = data.flower;
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
    showCart();
    showQuantity();

    const btn_add = document.querySelectorAll(".card__img-panel-add");

    btn_add.forEach((button) => {
      button.addEventListener("click", function () {
        const flowerData = findFlowerById(flowers, button.dataset.item);
        addFlower(flowerData);
        showCart();
        showQuantity();
        getCartAmount();
        // console.log(flowerData);
      });
    });

    input_search.forEach((input) => {

      response_search.forEach((search) => {
    
      input.addEventListener("focus", function() {
        input.parentElement.parentElement.classList.add("on");
    
        input.addEventListener("input", function (e) {
          const element = e.target.value.toLowerCase();
          const items = findFlowerByInput(flowers, element);
      
      
    
            if(search.parentElement.classList.contains("on")){
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
        
        input.addEventListener("blur", function(){
          input.parentElement.parentElement.classList.remove("on")
          search.classList.add("dsp-none");
          search.classList.remove("dsp-block");
          input.value = "";
        })
      });
    
    
    });
  });

// * FUNCTION
function showInfo(data) {
  console.table(data);
  console.log(formatCur(data[0].price));
}

function findFlowerById(data, id) {
  const item = data.find((flower) => flower.id == id);

  if (item != undefined) {
    return item;
  }
}

function findFlowerByInput(data, input) {
  const item = data.filter((flower) =>
    flower.name.toLowerCase().includes(input.toLowerCase())
  );

  if (item != undefined) {
    return item;
  } else {
    return "Pas de fleur avec ce nom.";
  }
}

function showSearchOutput(data) {
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

function formatCur(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function getFlowerCart() {
  let flowerCart = localStorage.getItem("flower");
  if (flowerCart == null) {
    return [];
  } else {
    return JSON.parse(flowerCart);
  }
}

function saveFlowerCart(cart) {
  localStorage.setItem("flower", JSON.stringify(cart));
}

function showCart() {
  updateCart(getFlowerCart());
  const btnsRemove = document.querySelectorAll(".remove");
  deleteOnClick(btnsRemove);
  getCartAmount();
}

function updateCart(cart) {
  const html = cart
    .map((flower) => {
      return `<div class="nav-aside__cart--item">
      <div class="nav-aside__cart--img">
        <button class="nav-aside__cart--badge remove" data-item="${flower.id}">
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

function showQuantity() {
  if (getCartQuantity() > 0) {
    quantity.textContent = getCartQuantity();
    quantity.classList.remove("dsp-none");
    quantity.classList.add("dsp-flex");
  } else {
    quantity.classList.add("dsp-none");
    quantity.classList.remove("dsp-flex");
  }
}

function deleteOnClick(nodelist) {
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
// *CRUD

function addFlower(flower) {
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

function removeFlower(flower) {
  let cart = getFlowerCart();
  let foundFlower = cart.find((fl) => fl.id == flower.id);
  if (foundFlower.quantity == 1) {
    cart = cart.filter((fl) => fl.id != flower.id);
  } else {
    foundFlower.quantity--;
  }
  saveFlowerCart(cart);
}

function deleteQuantity(flower) {
  let cart = getFlowerCart();
  cart = cart.filter((fl) => fl.id != flower.id);
  saveFlowerCart(cart);
}

function changeQuantity(flower, quantity) {
  let cart = getFlowerCart();
  let foundFlower = cart.find((fl) => fl.id == flower.id);
  if (foundFlower != undefined) {
    foundFlower.quantity += quantity;
  }
  saveFlowerCart(cart);
}

function getCartQuantity() {
  let cart = getFlowerCart();
  return Object.entries(cart).reduce((acc, flower) => {
    const [key, value] = flower;
    return acc + Number(value.quantity);
  }, 0);
}

function getCartAmount() {
  let cart = getFlowerCart();
  const amount = Object.entries(cart).reduce((acc, flower) => {
    const [key, value] = flower;
    return acc + Number(value.price) * Number(value.quantity);
  }, 0);

  sub_total.forEach(price => price.innerText = formatCur(amount));
}

// * FRONT
shopping_cart_item.addEventListener("click", (e) => {
  nav_aside_cart.classList.add("show-nav-aside");
  overlay.classList.add("on");
});

toggle_menu.addEventListener("click", (e) => {
  nav_aside_menu.classList.add("show-nav-aside");
  overlay.classList.add("on");
  toggle_menu.classList.add("open");
});

btn_close_aside.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    nav_aside_cart.classList.remove("show-nav-aside");
    nav_aside_menu.classList.remove("show-nav-aside");
    overlay.classList.remove("on");
    toggle_menu.classList.remove("open");
  })
);



overlay.addEventListener("click", (e) => {
  nav_aside_cart.classList.remove("show-nav-aside");
  nav_aside_menu.classList.remove("show-nav-aside");
  overlay.classList.remove("on");
  toggle_menu.classList.remove("open");
});
