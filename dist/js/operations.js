const nav_aside_cart_list = document.querySelector(".cart-list");
const quantity = document.querySelector(".mini-card__order-qt");

/**
 *Function d'initialisation de la page et des fonctionnalité principale
 *
 */
export async function init() {
  try {
    const flowers = await fetchFlowerData();
    const basket = getBasketFlower();
    displayFlowers(flowers);
    displayCart();
    getFormData();
    if (basket.length > 0) {
      displayCartAmount();
      displayQuantity();
    }
  } catch (error) {
    console.log(`Nous avons rencontrer une erreur: ${error}`);
  }
}

/**
 * Function permettant de récupérer les données du mock.json a partir d'un fetch
 *
 * @returns {promise<Flowers>} Une promise contenant les fleurs récupérer dans le mock.json
 */
export async function fetchFlowerData() {
  try {
    const url = "dist/js/mock.json";
    const res = await fetch(url);
    if (!res.ok)
      throw new Error(`Nous n'arrivons pas a joindre le lien => ${url}`);
    const data = await res.json();
    return data.flower;
  } catch (error) {
    console.log(`Nous avons rencontrer une erreur: ${error}`);
  }
}

/**
 * Function permettant de modifier le DOM
 * afin d'ajouter la liste des fleur à acheter
 *
 * @param {object[]} flowers Liste des fleurs
 */
export function displayBasket() {
  const flowers = getBasketFlower();
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

  deleteOnClick();
}

/**
 *
 * Affiche le contenu du shopping cart.
 * @returns {void}
 */
export function displayCart() {
  const flowers = getBasketFlower();
  let html = flowers
    .map((flower) => {
      return `
    <tr class="shoppingCartArea__element">
    <td class="shoppingCartArea__remove">x</td>
    <td class="shoppingCartArea__image">
      <a class="shoppingCartArea__imgLink" href="#">
        <img src="${flower.image}" alt="${flower.name}" data-imgSrc="${
        flower.image
      }">
      </a>
    </td>
    <td class="shoppingCartArea__info" data-id="${flower.id}">
      <h4>${flower.name}</h4>
    </td>
    <td class="shoppingCartArea__price">${formatCur(flower.price, "en-US")}</td>
    <td class="shoppingCartArea__quantity">
      <div class="shoppingCartArea__min-plus">
        <div class="qtBtn dec">-</div>
        <input type="number" class="shoppingCartArea__qt" value="${
          flower.quantity
        }" id="">
        <div class="qtBtn inc">+</div>
      </div>
    </td>
    <td class="shoppingCartArea__subtotal">${formatCur(
      flower.price * flower.quantity
    )}</td>
  </tr>
  `;
    })
    .join("");

  html =
    html +
    `<tr >
    <td colspan="4">
      <div class="shoppingCartArea__coupon">
        <input
          type="text"
          name="cart-coupon"
          placeholder="Coupon Code"
          class="shoppingCartArea__couponInput"
        />
        <button type="submit" class="shoppingCartArea__couponSubmit">
          Apply Coupon
        </button>
      </div>
    </td>
    <td colspan="2">
      <button
        type="submit"
        class="shoppingCartArea__cartUpdate"
      >
        Update Cart
      </button>
    </td>
  </tr>`;
  const tableBody = document.querySelector(".shoppingCartArea__tbody");
  if (tableBody) {
    tableBody.innerHTML = html;
    updateCart();
  }
}

/**
 * Function de mise a jour de l'interface utilisateur
 *
 * @function updateUI
 */
function updateUI() {
  displayCartAmount();
  displayQuantity();
  displayBasket();
  displayCart();
}

/**
 * Ajout d'un ecouteur d'évènement a l'input de recherche
 * permettant l'affichage des resultats lorsque l'utilisateur
 * commence à ecrire
 *
 * @param {object[]} flowers Tableau d'objet a utiliser pour trouver les données
 * @returns {void}
 */
function searchFlowers(flowers) {
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
            search.innerHTML = displaySearchOutput(items);
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
 * Fonction permettant l'affichage et
 * la mise a jour du montant total des fleur dans le panier d'achat
 * @function
 * @name displayQuantity
 * @return {void}
 */
export function displayQuantity() {
  if (countFlowersInBasket() > 0) {
    quantity.textContent = countFlowersInBasket();
    quantity.classList.remove("dsp-none");
    quantity.classList.add("dsp-flex");
  } else {
    quantity.classList.add("dsp-none");
    quantity.classList.remove("dsp-flex");
  }
}

/**
 * Fonction permettant l'affichage des fleurs dans le DOM
 *
 * @param {object[]} flowers
 * @returns {void}
 */
export function displayFlowers(flowers) {
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
          <span class="price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">${formatCur(
            flower.price,
            "en-US"
          )}</span>
          <span class="past-price">${formatCur(
            flower.price + 2,
            "en-US"
          )}</span>
        </div>
      </div>
      </div>
    </li>`;
    })
    .join(" ");

  const cardItems = document.querySelectorAll(".card__items");

  cardItems.forEach((items) => (items.innerHTML = html));
  addFlowerToBasket(flowers);
  searchFlowers(flowers);
}

/**
 * Fonction permettant de crée le code HTML
 *  pour l'affichage fleurs recherchées
 *
 * @param {object[]} flowers
 * @returns {string} Les données html a integrée dans le DOM
 */
function displaySearchOutput(flowers) {
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
 * Ajout d'un écouteur d'évènement au bouton des produits,
 * qui retrouve et ajoute la fleur correspondant au panier d'achat.
 *
 * @param {object[]} flowers
 * @returns {void}
 */
function addFlowerToBasket(flowers) {
  const btn_add = document.querySelectorAll(".card__img-panel-add");

  btn_add.forEach((button) => {
    button.addEventListener("click", function () {
      const flowerData = findFlowerById(flowers, button.dataset.item);
      addFlowerToLocalStorage(flowerData);
      updateUI();
    });
  });
}

/**
 * function permettant d'ajouter une fleur le localstorage
 *
 * @param {object} flower
 */
function addFlowerToLocalStorage(flower) {
  let cart = getBasketFlower();
  const foundFlower = cart.find((f) => f.id === flower.id);

  if (foundFlower != undefined) {
    foundFlower.quantity++;
  } else {
    flower.quantity = 1;
    cart.push(flower);
  }
  saveFlowerToLocalStorage(cart);
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
 * Fonction permettant le formattage d'un nombre dans le format americain
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
 * @returns {{name, image, price, quantity}|undefined} La liste des fleurs enregistrer dans le localStorage
 */
function getBasketFlower() {
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
function saveFlowerToLocalStorage(flower) {
  localStorage.setItem("flower", JSON.stringify(flower));
}

/**
 * Ajout d'un ecouteur d'évènement attacher
 * au bouton des fleurs dans le panier
 * permettant la suppression progressive
 * des fleurs dans le panier et le localStorage,
 * ainsi que la mise a jour graphique au fur et a mesure.
 *
 */
function deleteOnClick() {
  const btn_remove_flower = document.querySelectorAll(".remove");
  btn_remove_flower.forEach((button) => {
    button.addEventListener("click", function () {
      let cart = getBasketFlower();
      let flower = findFlowerById(cart, button.dataset.item);
      decrementFlowerQuantityInBasket(flower);
      updateUI();
    });
  });
}

/**
 * Met a jour le total de l'article dans le tableau affiché
 * @param {HTMLElement} el - l'element hTML a modifié
 * @returns {void}
 */
function updateSubtotal(el) {
  const priceEl = el.parentNode.parentNode.previousElementSibling;
  const price = parseFloat(priceEl.textContent.slice(1));
  const quantity = Number(
    el.parentNode.parentNode.querySelector(".shoppingCartArea__qt").value
  );
  const subtotal = price * quantity;
  el.parentNode.parentNode.nextElementSibling.textContent = `$${subtotal.toFixed(
    2
  )}`;
}

/**

* incrément la quantité 
* @returns {void} 
*/
function increaseQuantity() {
  const incrBtn = document.querySelectorAll(".inc");

  incrBtn.forEach((button) =>
    button.addEventListener("click", () => {
      const inputValue = button.parentNode.querySelector(
        ".shoppingCartArea__qt"
      );

      inputValue.value++;
      updateSubtotal(button);
    })
  );
}

/**
 * Décremente la quantité
 * @returns {void}
 */
function decreaseQuantity() {
  const decBtn = document.querySelectorAll(".dec");

  decBtn.forEach((button) =>
    button.addEventListener("click", () => {
      const inputValue = button.parentNode.querySelector(
        ".shoppingCartArea__qt"
      );
      if (inputValue.value > 0) {
        inputValue.value--;
        updateSubtotal(button);
      }
    })
  );
}

/**
 *  Supprime la fleur
 * @returns {void}
 */
function deleteCart() {
  const delBtn = document.querySelectorAll(".shoppingCartArea__remove");

  delBtn.forEach((button) => {
    button.addEventListener("click", () => {
      button.parentNode.remove();
    });
  });
}

/**

* UMet a jour les fleur dans le localStorage.
* @returns {void} 
*/
function updateCart() {
  const update = document.querySelector(".shoppingCartArea__cartUpdate");

  increaseQuantity();
  decreaseQuantity();
  deleteCart();

  if (update) {
    update.addEventListener("click", () => {
      const cartRows = document.querySelectorAll(".shoppingCartArea__element");
      let cartUpdates = [];
      cartRows.forEach((row) => {
        const id = row.querySelector(".shoppingCartArea__info").dataset.id;
        const name = row.querySelector(
          ".shoppingCartArea__info h4"
        ).textContent;
        const image = row.querySelector(".shoppingCartArea__image img").dataset
          .imgsrc;
        const price = parseFloat(
          row
            .querySelector(".shoppingCartArea__price")
            .textContent.replace("$", "")
        );
        const quantity = parseInt(
          row.querySelector(".shoppingCartArea__qt").value
        );

        const cartUpdate = { id, name, price, image, quantity };
        cartUpdates.push(cartUpdate);
      });

      saveFlowerToLocalStorage(cartUpdates);
      updateUI();
    });
  }
}

export function getFormData() {
  const purchase_btn = document.querySelector(".checkoutArea__btn");
  if (purchase_btn) {
    purchase_btn.addEventListener("click", () => {
      const formSection = document.querySelector(".checkoutArea");
      const inputs = formSection.querySelectorAll("input, select");
      const formData = {};
      console;
      inputs.forEach((input) => {
        formData[input.name] = input.value;
      });
      console.table(formData);
    });
  }
}

/**
 * Function permettant de diminuer puis de supprimer une fleur dans le localsorage
 *
 * @param {object} flower
 */
function decrementFlowerQuantityInBasket(flower) {
  let cart = getBasketFlower();
  let foundFlower = cart.find((fl) => fl.id == flower.id);
  if (foundFlower.quantity == 1) {
    cart = cart.filter((fl) => fl.id != flower.id);
  } else {
    foundFlower.quantity--;
  }
  saveFlowerToLocalStorage(cart);
}

/**
 * Function permettant de calculer la quantitée des fleurs dans le panier
 *
 * @returns {number} La quantitée total des fleurs
 */
function countFlowersInBasket() {
  let cart = getBasketFlower();
  return Object.entries(cart).reduce((acc, flower) => {
    const [key, value] = flower;
    return acc + Number(value.quantity);
  }, 0);
}

/**
 * Function permettant d'afficher le montant total des fleur dans le DOM
 *
 * @returns {void}
 */
function displayCartAmount() {
  let cart = getBasketFlower();
  const amount = Object.entries(cart).reduce((acc, flower) => {
    const [key, value] = flower;
    return acc + Number(value.price) * Number(value.quantity);
  }, 0);

  const sub_total = document.querySelectorAll(".cart-price");
  sub_total.forEach((price) => (price.innerText = formatCur(amount)));
}
