const cardItems = document.querySelectorAll(".card__items");

fetch("dist/js/mock.json")
  .then((res) => res.json())
  .then((data) => showCard(data.flower));

function showInfo(data) {
  console.table(data);
  console.log(formatCur(data[0].price));
}

function formatCur(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function showCard(data) {
  data
    .map((flower) => {
      const flowerName = flower.name;
      const flowerPrice = flower.price;
      const flowerImg = flower.image;

      return (HTML = `
        <li class="card__item" itemprop="itemListElement" itemscope itemtype="http://schema.org/Product">
        <div class="card__item-prop">
        <div class="card__item-img">
          <div class="card__img-badge">
            <span>10</span>
          </div>
          <a  class="card__img-link"
            ><img src=${flowerImg} alt=${flowerName}
          /></a>
          <ul class="card__img-panel">
            <li class="card__img-panel-search">
              <a ><i class="fa-solid fa-magnifying-glass"></i></a>
            </li>
            <li class="card__img-panel-add">
              <a ><i class="fa-solid fa-basket-shopping card__icon"></i><span class="card__text">ADD TO CART</span></a>
            </li>
            <li class="card__img-panel-view">
              <a ><i class="fa-solid fa-shuffle"></i></a>
            </li>
          </ul>
        </div>
        <div class="card__item-info">
          <div class="card__item-title" itemprop="name">${flowerName.toUpperCase()}</div>
          <div class="card__item-desc">
            <span class="price" itemprop="offers" itemscope itemtype="http://schema.org/Offer">$18.00</span>
            <span class="past-price">$${formatCur(flowerPrice, "en-US")}</span>
          </div>
        </div>
        </div>
      </li>
        `);
    })
    .forEach((card) => {
      cardItems.forEach((items) => (items.innerHTML += card));
    });
}
