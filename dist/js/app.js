import {
  showCart,
  showQuantity,
  showFlowerItems,
  searchItem,
  showFlowers,
} from "./functions.js";

fetch("dist/js/mock.json")
  .then((res) => res.json())
  .then((data) => {
    const flowers = data.flower;
    showFlowers(flowers);
    showCart();
    showQuantity();
    showFlowerItems(flowers);
    searchItem(flowers);
  })
  .catch((error) =>
    console.log(`Nous avons pas pue recuperer les donner : ${error}`)
  );
