import {
  showCart,
  showQuantity,
  showFlowerItems,
  searchItem,
  updateCard,
} from "./functions.js";


fetch("dist/js/mock.json")
  .then((res) => res.json())
  .then((data) => {
    const flowers = data.flower;
    updateCard(flowers)
    showCart();
    showQuantity();
    showFlowerItems(flowers)
    searchItem(flowers);
  });