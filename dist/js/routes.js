import { init } from "./operations.js";
import { validateInput } from "./validation.js";

const pageTitle = "Fiama - Flower Shop eCommerce HTML Template";

const routes = {
  "404page": {
    template: "/dist/templates/404.html",
    title: `404 | ${pageTitle}`,
    description: "Page not Found",
  },
  "/": {
    template: "/dist/templates/index.html",
    title: `Home | ${pageTitle}`,
    description: "This is the home page",
  },
  "home": {
    template: "/dist/templates/index.html",
    title: `Home | ${pageTitle}`,
    description: "This is the home page",
  },
  cart: {
    template: "/dist/templates/cart.html",
    title: `Cart | ${pageTitle}`,
    description: "This is the shopping cart page",
  },
  checkout: {
    template: "/dist/templates/checkout.html",
    title: `Checkout | ${pageTitle}`,
    description: "This is the checkout page",
  },
};

const locationHandler = async () => {
  let location = window.location.hash.replace("#", "");
  if (location.length == 0) {
    location = "/";
  }


  const route = routes[location] || routes["404page"];
  const template = await fetch(route.template).then((response) => response.text());
  document.getElementById("content").innerHTML = template;
  await init();
  await validateInput();
  document.title = route.title;
  document
    .querySelector("meta[name=description]")
    .setAttribute("content", route.description);
};


window.addEventListener("hashchange", locationHandler);

locationHandler();