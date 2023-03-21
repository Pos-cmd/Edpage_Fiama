import { getBasketFlower, getCartAmount } from "./operations.js";

/**
 * Vérifie si le nom passé est valide.
 * Un nom valide doit avoir au minimum 3 caractères et doit contenir que des lettres ou apostrophe.
 * @param {string} name - Le nom a vérifier.
 * @returns {boolean} - True si le nom est valide, false dans le cas contraire.
 */
function isValidName(name) {
  // le nom et prénom doivent avoir plus de 3 caractères et ne contenant pas de chiffre
  const regex = /^[a-zA-Z'\-]{3,}$/;
  return regex.test(name.value);
}

/**
 * Vérifie si l'email passer est dans un format correct.
 * @param {string} email - L'adresse email a vérifier.
 * @returns {boolean} - True si l'email est valide, false dans le cas contraire.
 */
function isValidEmail(email) {
  // L’email doit avoir un format valide
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.value);
}

/**
 * Vérifie si le numéro de téléphone est dans un format correct.
 *
 * @param {string} phoneNumber - Le numéro a vérifier.
 * @returns {boolean} - True si le numéro est valide, false dans le cas contraire.
 */
function isValidPhoneNumber(phoneNumber) {
  const regex = /^(?:\d{8}|\d{2}[ -]?\d{2}[ -]?\d{2}[ -]?\d{2})$/;
  return regex.test(phoneNumber.value);
}

/**
 * Insere un message d'erreur pour un elément du formulaire.
 *
 * @param {HTMLElement} input - L'élément a qui appliquer l'erreur.
 * @param {string} message - Le message d'erreur a affiché.
 * @returns {void}
 */
function setError(input, message) {
  const formItem = input.parentElement;
  const small = formItem.querySelector("small");

  if (formItem.classList.contains("success")) {
    formItem.classList.remove("success");
  }

  if (!formItem.classList.contains("error")) {
    formItem.className += " error";
  }
  small.innerText = message;
}

/**
 * Insère un message de succès pour un elément du formulaire.
 *
 * @param {HTMLElement} input - L'élément a qui appliquer le succès.
 * @param {string} message - Le message de succès a affiché.
 * @returns {void}
 */
function setSuccess(input) {
  const formItem = input.parentElement;
  const small = formItem.querySelector("small");

  if (formItem.classList.contains("error")) {
    formItem.classList.remove("error");
  }

  if (!formItem.classList.contains("success")) {
    formItem.className += " success";
  }
  small.innerText = "Valid field.";
}

/**
 *Vérifie si le formulaire est valide est fait le traitement.
 *
 *@async
 *@function validateInput
 *@returns {Promise<void>}
 */

export async function validateInput() {
  const firstNameInput = document.getElementById("firstname");
  const lastNameInput = document.getElementById("lastname");
  const emailInput = document.getElementById("email");
  const phoneNumber = document.getElementById("phoneNumber");
  const address = document.getElementById("address");
  const city = document.getElementById("city");
  const paymentList = document.querySelector(".payment__accord");
  const btnSubmit = document.querySelector(".checkoutArea__btn");
  const paymentType = document.querySelectorAll(".paymentType");
  const smallList = document.querySelectorAll("small");
  const form = document.querySelector("form");

  let hasError = {};

  if (btnSubmit) {
    btnSubmit.addEventListener("click", function (e) {
      e.preventDefault();

      if (!isValidName(firstNameInput)) {
        let msg =
          "The first name must have more than 3 characters and must not contain any numbers.";
        setError(firstNameInput, msg);
        hasError.firstNameInput = true;
      } else {
        setSuccess(firstNameInput);
        hasError.firstNameInput = false;
      }

      if (!isValidName(lastNameInput)) {
        let msg =
          "The first name must have more than 3 characters and must not contain any numbers.";
        setError(lastNameInput, msg);
        hasError.lastNameInput = true;
      } else {
        setSuccess(lastNameInput);
        hasError.lastNameInput = false;
      }

      if (!city.value) {
        let msg = "Please fill in this field.";
        setError(city, msg);
        hasError.city = true;
      } else {
        setSuccess(city);
        hasError.city = false;
      }

      if (!address.value) {
        let msg = "Please fill in this field.";
        setError(address, msg);
        hasError.address = true;
      } else {
        setSuccess(address);
        hasError.address = false;
      }

      if (!isValidEmail(emailInput)) {
        let msg = "The email must have a valid format.";
        setError(emailInput, msg);
        hasError.emailInput = true;
      } else {
        setSuccess(emailInput);
        hasError.emailInput = false;
      }

      if (!isValidPhoneNumber(phoneNumber)) {
        let msg = "Please provide a valid phone number (XX-XX-XX-XX).";
        setError(phoneNumber, msg);
        hasError.phoneNumber = true;
      } else {
        setSuccess(phoneNumber);
        hasError.phoneNumber = false;
      }

      if (![...paymentType].some((payment) => payment.checked)) {
        let msg = "Please select at least one payment method.";
        setError(paymentList, msg);
        hasError.paymentList = true;
      } else {
        setSuccess(paymentList);
        hasError.paymentList = false;
      }

      if (Object.keys(getBasketFlower()).length === 0) {
        hasError.cart = true;
        alert("The basket is empty");
      } else {
        hasError.cart = false;
      }

      if (!Object.entries(hasError).some((error) => error[1])) {
        const inputs = form.elements;
        const formData = {};
        Array.from(inputs).forEach((input) => {
          if (
            input.type === "radio" &&
            input.name === "card-check" &&
            input.checked
          ) {
            formData[input.name] = input.value;
          } else if (input.type != "radio") {
            formData[input.name] = input.value;
          }
        });
        console.table(formData);
        console.table(getBasketFlower());
        console.log(`Le montant total s'élève a ${getCartAmount()}$"`);
        [...smallList].forEach((small) => (small.innerText = ""));
        form.reset();
      }
    });
  }
}
