import { init } from "./operations.js";

(async function () {
  try {
    const res = await fetch("dist/js/mock.json");
    const data = await res.json();
    const flowers = await data.flower;
    init(flowers);
  } catch (error) {
    console.log(`Nous avons rencontrer une erreur: ${error}`);
  }
})();
