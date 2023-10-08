import "./../css/admin.css";

import ExcursionsAPI from "./ExcursionsAPI";
import { addAdminHtml } from "./htmlAdminStructure";
document.addEventListener("DOMContentLoaded", init);

const api = new ExcursionsAPI();

function init() {
  console.log("admin");
  formElAdmin.addEventListener("submit", handleSubmit);
  api
    .loadData()
    .then((data) => addExcursionsToDOM(data))
    .catch((err) => console.error(err));
}

const formElAdmin = document.querySelector(".form");
const ulElement = document.querySelector(".excursions");

const handleSubmit = (e) => {
  e.preventDefault();
  const [name, description, adultPrice, childPrice] = formElAdmin.elements;
  const nameValue = name.value;
  const descriptionValue = description.value;
  const adultPriceValue = adultPrice.value;
  const childPriceValue = childPrice.value;
  passFormData(nameValue, descriptionValue, adultPriceValue, childPriceValue);
  formElAdmin.reset();
};

const passFormData = (name, description, adultPrice, childPrice) => {
  const obj = {
    title: name,
    excDesc: description,
    aPrice: +adultPrice,
    chPrice: +childPrice,
  };
  sendExcursionsToApi(obj);
};

const sendExcursionsToApi = (obj) => {
  api
    .addData(obj)
    .catch((err) => console.error(err))
    .finally(init);
};

const addExcursionsToDOM = (excursionsArray) => {
  ulElement.innerHTML = "";
  excursionsArray.forEach((el) => {
    ulElement.innerHTML += addAdminHtml(
      el.id,
      el.title,
      el.excDesc,
      el.aPrice,
      el.chPrice
    );
    const listExcursion = [...ulElement.querySelectorAll("li")];
    getAccesToThelist(listExcursion);
  });
};

const getAccesToThelist = (listExcursion) => {
  listExcursion.forEach((li) => {
    const form = li.querySelector("form");
    getAccesToTheForm(form);
  });
};

const getAccesToTheForm = (form) => {
  form.addEventListener("click", handleUpdateRemove);
};

const handleUpdateRemove = (e) => {
  e.preventDefault();
  if (e.target.value === "edytuj") {
    updateExcursion(e);
  }
  if (e.target.value === "usuń") {
    deleteExcursion(e);
  }
};

const updateExcursion = (e) => {
  const currentListItem = e.target.parentElement.parentElement.parentElement;
  const currentListItemId = +currentListItem.dataset.id;
  const valueToUpdate = currentListItem.querySelectorAll(".excursions__edit");
  const isEditable = [...valueToUpdate].every(
    (value) => value.isContentEditable
  );
  if (isEditable) {
    const [title, excDesc, aPrice, chPrice] = valueToUpdate;

    const data = {
      title: title.innerText,
      excDesc: excDesc.innerText,
      aPrice: aPrice.innerText,
      chPrice: chPrice.innerText,
    };
    api
      .updateData(currentListItemId, data)
      .catch((err) => console.error(err))
      .finally(() => {
        e.target.innerText = "edytuj";
        valueToUpdate.forEach((value) => (value.contentEditable = false));
        init();
      });
  } else {
    e.target.innerText = "zapisz";
    valueToUpdate.forEach((value) => (value.contentEditable = true));
  }
};

const deleteExcursion = (e) => {
  const currentListItem = e.target.parentElement.parentElement.parentElement;
  const currentListItemId = +currentListItem.dataset.id;
  api
    .deleteData(currentListItemId)
    .catch((err) => console.error(err))
    .finally(init);
};
