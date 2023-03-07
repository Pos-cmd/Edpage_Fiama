import {
  displayBasket,
} from "./operations.js";

const nav_aside_menu = document.querySelector(".nav-aside");
const nav_aside_cart = document.querySelector(".nav-aside--cart");
const shopping_cart_item = document.getElementById("item-bag");
const overlay = document.querySelector(".overlay");
const toggle_menu = document.querySelector(".burger");
const btn_close_aside = document.querySelectorAll(".nav-aside__close");

shopping_cart_item.addEventListener("click", (e) => {
  displayBasket();
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
