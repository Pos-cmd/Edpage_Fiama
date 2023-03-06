const nav_aside_cart_list = document.querySelector(".cart-list");
const sub_total = document.querySelectorAll(".cart-price");
const quantity = document.querySelector(".mini-card__order-qt");
const cardItems = document.querySelectorAll(".card__items");

/**
 * Fonction permettant l'affichage et
 * la mise a jour dans fleur dans le panier d'achat
 * @function
 * @name showCart
 * @return {void}
 */
export function showCart() {
  updateCart(getFlowerCart());
  const btnsRemove = document.querySelectorAll(".remove");
  deleteOnClick(btnsRemove);
  getCartAmount();
}

/**
 * Fonction permettant l'affichage et
 * la mise a jour du montant total des fleur dans le panier d'achat
 * @function
 * @name showQuantity
 * @return {void}
 */
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

/**
 * Fonction permettant l'affichage des fleurs dans la base de donnée
 *
 * @param {object[]} flowers
 * @returns {void}
 */
export function showFlowerItems(flowers) {
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

/**
 * Fonction permettant l'affichage des fleurs dans le DOM
 *
 * @param {object[]} flowers
 * @returns {void}
 */
export function showFlowers(flowers) {
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

/**
 * Ajout d'un ecouteur d'évènement a l'input de recherche
 * permettant l'affichage des resultats lorsque l'utilisateur
 * commence à ecrire
 *
 * @param {object[]} flowers Tableau d'objet a utiliser pour trouver les données
 * @returns {void}
 */
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

/**
 * Fonction permettant de trouver une fleur a partir de son identifiant.
 *
 * @param {object[]} flowers - Liste des fleurs
 * @param {number} id - Identifiant de la fleur recherchée
 * @returns {object|undefined} Les données de la fleur recherché
 */
function findFlowerById(flowers, id) {
  const flower = flowers.find((flower) => flower.id == id);

  if (flower != undefined) {
    return flower;
  }
}

/**
 * Fonction permettant de trouver une fleur a partir d'un mot ou d'une lettre entrée.
 *
 * @param {object[]} flowers  - Liste des fleurs
 * @param {string} input - Un mot se trouvant dans la fleur recherché
 * @returns {object[]|undefined } Les données des fleurs correspondant a l'input recherché
 */
function findFlowerByInput(flowers, input) {
  const flower = flowers.filter((flower) =>
    flower.name.toLowerCase().includes(input.toLowerCase())
  );

  if (flower != undefined) {
    return flower;
  } else {
    return "Pas de fleur avec ce nom.";
  }
}

/**
 * Fonction permettant de crée le code HTML
 *  pour l'affichage fleurs recherchées
 *
 * @param {object[]} flowers
 * @returns {string} Les données html a integrée dans le DOM
 */
function showSearchOutput(flowers) {
  const html = flowers
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

/**
 * Fonction permettant la conversion d'un nombre dans le format americain
 *
 * @param {number} value
 * @returns {string} Le prix formattées dans le format US ($18.00)
 */
function formatCur(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/**
 * Function qui récupère les données des fleurs stocker dans le localstorage
 *
 * @returns {object[]|undefined} La liste des fleurs enregistrer dans le localStorage
 */
function getFlowerCart() {
  let flowerCart = localStorage.getItem("flower");
  if (flowerCart == null) {
    return [];
  } else {
    return JSON.parse(flowerCart);
  }
}

/**
 * Fonction permettant de sauvegarder dans le LocalStorage les données d'une fleur.
 *
 * @param {object} flower  Données de la fleur a ajouter au LocalStorage
 */
function saveFlower(flower) {
  localStorage.setItem("flower", JSON.stringify(flower));
}

/**
 * Function permettant de modifier le DOM
 * afin d'ajouter la liste des fleur à acheter
 *
 * @param {object[]} flowers Liste des fleurs
 */
function updateCart(flowers) {
  const html = flowers
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

/**
 * Function permettant de
 * Supprimer un element dans la liste des fleur a acheter
 *
 * @param {NodeList} nodelist
 */
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

/**
 * function permettant d'ajouter une fleur le localstorage
 *
 * @param {object} flower
 */
function addFlower(flower) {
  let cart = getFlowerCart();
  const foundFlower = cart.find((f) => f.id === flower.id);

  if (foundFlower != undefined) {
    foundFlower.quantity++;
  } else {
    flower.quantity = 1;
    cart.push(flower);
  }
  saveFlower(cart);
}

/**
 * Function permettant de diminuer puis de supprimer une fleur dans le localsorage
 *
 * @param {object} flower
 */
function removeFlower(flower) {
  let cart = getFlowerCart();
  let foundFlower = cart.find((fl) => fl.id == flower.id);
  if (foundFlower.quantity == 1) {
    cart = cart.filter((fl) => fl.id != flower.id);
  } else {
    foundFlower.quantity--;
  }
  saveFlower(cart);
}

/**
 * Function permettant de calculer la quantitée des fleurs à acheter
 *
 * @returns {number} La quantitée total des fleurs
 */
function getCartQuantity() {
  let cart = getFlowerCart();
  return Object.entries(cart).reduce((acc, flower) => {
    const [key, value] = flower;
    return acc + Number(value.quantity);
  }, 0);
}

/**
 * Function permettant d'afficher le montant total des fleur dans le DOM
 */
function getCartAmount() {
  let cart = getFlowerCart();
  const amount = Object.entries(cart).reduce((acc, flower) => {
    const [key, value] = flower;
    return acc + Number(value.price) * Number(value.quantity);
  }, 0);

  sub_total.forEach((price) => (price.innerText = formatCur(amount)));
}
