import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

document.addEventListener('DOMContentLoaded', init);

const api = new ExcursionsAPI();

function init () {
  console.log("admin");
  formElAdmin.addEventListener("submit", handleSubmit);
  api.loadData()
  .then(data => addExcursionsToDOM(data))
  .catch(err => console.error(err))
  // load data to admin panel
}

const apiUrl = 'http://localhost:3000/excursions';
const formElAdmin = document.querySelector(".form");
// const excursionsArray = [];
const ulElement = document.querySelector(".excursions");
let getAccesToId;

const handleSubmit = (e) => {
  e.preventDefault();
  const [name, description, adultPrice, childPrice] = formElAdmin.elements;
  const nameValue = name.value;
  const descriptionValue = description.value;
  const adultPriceValue = adultPrice.value;
  const childPriceValue = childPrice.value;
  passFormData(nameValue, descriptionValue, adultPriceValue, childPriceValue);
  formElAdmin.reset()
};

// let setId = 0;
const passFormData = (name, description, adultPrice, childPrice) => {
  // setId++;
  const obj = {
    // id: setId,
    title: name,
    excDesc: description,
    aPrice: +adultPrice,
    chPrice: +childPrice,
  };

  // excursionsArray.push(obj);
  // addExcursionsToDOM(excursionsArray)
  // console.log(excursionsArray, 'pass form data');
  sendExcursionsToApi(obj)
};

const sendExcursionsToApi = (obj) => {
  // api.addData(obj)
  // .catch(err => console.error(err))
  
  const options = {
    method: 'POST',
    body: JSON.stringify( obj ),
    headers: {'Content-Type': 'application/json'}
  };
  fetch(apiUrl, options)
  .then(res => console.log(res))
  .catch(err => console.error(err))
  .finally(init)
  // api.loadData()
  // .then(data => addExcursionsToDOM(data))
  // .catch(err => console.error(err))
}

const addExcursionsToDOM = (excursionsArray) => {
ulElement.innerHTML = "";
excursionsArray.forEach(el => {
    ulElement.innerHTML += `
    <li data-id=${el.id} class="excursions__item excursions__item--prototype ">
          <header class="excursions__header">
            <h2 class="excursions__title excursions__edit">${el.title}</h2>
            <p class="excursions__description excursions__edit">
             ${el.excDesc}</p>
          </header>
          <form class="excursions__form">
            <div class="excursions__field">
              <label class="excursions__field-name">
                Dorosły: <strong class="excursions__edit">${el.aPrice}</strong>PLN
              </label>
            </div>
            <div class="excursions__field">
              <label class="excursions__field-name">
                Dziecko: <strong class="excursions__edit">${el.chPrice}</strong>PLN
              </label>
            </div>
            <div class="excursions__field excursions__field--submit">
              <input
                class="excursions__field-input excursions__field-input--update"
                value="edytuj"
                type="submit"
              />
              <input
                class="excursions__field-input excursions__field-input--remove"
                value="usuń"
                type="submit"
              />
            </div>
        </form>
      </li>
    `
    const listExcursion = [...ulElement.querySelectorAll('li')];

  getAccesToThelist(listExcursion)
})
};

const getAccesToThelist = (listExcursion) => {
 listExcursion.forEach(li => {
  const form = li.querySelector('form');
    getAccesToTheForm(form)
 })
}

const getAccesToTheForm = (form) => {
  form.addEventListener("click", handleUpdateRemove);  
}


const handleUpdateRemove = (e) => {
e.preventDefault();
if (e.target.value === 'edytuj'){
  // edytuj 
  // console.log(e.target.value)
  const currentListItem = e.target.parentElement.parentElement.parentElement;
  // getTheValueOfCurrentExcursion(currentListItem);
  
  // if(isEditable) {
  //   updateExcursion(currentListItem, isEditable)
  // }
  // else {
  //   e.target.innerText = 'Zapisz';
  //   e.target.contentEditable = true;
  // }
  updateExcursion(e)
}
if (e.target.value === "usuń") {
  // usun
  const currentListItem = e.target.parentElement.parentElement.parentElement;
  deleteExcursion(currentListItem)
 
  // deleteExcursion(currentListItem)
  // console.log(excursionsArray, 'delete excursion')
}
}
const updateExcursion = (e) => {
  const currentListItem = e.target.parentElement.parentElement.parentElement;
  const currentListItemId = +currentListItem.dataset.id;
  const valueToUpdate = currentListItem.querySelectorAll('.excursions__edit');
  const isEditable = [...valueToUpdate].every(value => value.isContentEditable);
  if (isEditable) {
    const data = {
      title: valueToUpdate[0].innerText,
      excDesc: valueToUpdate[1].innerText,
      aPrice: valueToUpdate[2].innerText,
      chPrice: valueToUpdate[3].innerText,
    }
    const options = {
      method: 'PUT',
      body: JSON.stringify( data ),
      headers: { 'Content-Type': 'application/json' }
      }
      fetch(`${apiUrl}/${currentListItemId}`, options)
        .then(resp => console.log(resp))
        .catch(err => console.error(err))
        .finally( () => {
        e.target.innerText = 'edytuj';
        valueToUpdate.forEach(
        value => value.contentEditable = false);
        init})
  }
  else {
    e.target.innerText = 'edytuj';
    valueToUpdate.forEach(value => value.contentEditable = true)
  }
}


const deleteExcursion = (listItem) => {
  const currentListItemId = +listItem.dataset.id;
  console.log(currentListItemId)
  // const id = +listItem.dataset.id;
  const options = {method : 'DELETE'};
        fetch(`${apiUrl}/${currentListItemId}`, options)
        .then(res => console.log(res))
        .catch(err => console.error(err))
        .finally(init)
}

