import './../css/admin.css';

import ExcursionsAPI from './ExcursionsAPI';

document.addEventListener('DOMContentLoaded', init);

const api = new ExcursionsAPI();

function init () {
  console.log("admin");
  formElAdmin.addEventListener("submit", handleSubmit);

}

const apiUrl = 'http://localhost:3000/excursions';
const formElAdmin = document.querySelector(".form");
const excursionsArray = [];
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

let setId = 0;
const passFormData = (name, description, adultPrice, childPrice) => {
  setId++;
  const obj = {
    id: setId,
    title: name,
    excDesc: description,
    aPrice: +adultPrice,
    chPrice: +childPrice,
  };

  excursionsArray.push(obj);
  addExcursionsToDOM(excursionsArray)
  console.log(excursionsArray, 'pass form data');
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
}

const addExcursionsToDOM = (excursionsArray) => {
ulElement.innerHTML = "";
excursionsArray.forEach(el => {
    ulElement.innerHTML += `
    <li data-id=${el.id} class="excursions__item excursions__item--prototype">
          <header class="excursions__header">
            <h2 class="excursions__title">${el.title}</h2>
            <p class="excursions__description">
             ${el.excDesc}</p>
          </header>
          <form class="excursions__form">
            <div class="excursions__field">
              <label class="excursions__field-name">
                Dorosły: <strong>${el.aPrice}</strong>PLN
              </label>
            </div>
            <div class="excursions__field">
              <label class="excursions__field-name">
                Dziecko: <strong>${el.chPrice}</strong>PLN
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
  console.log(e.target.value)
  const currentListItem = e.target.parentElement.parentElement.parentElement;
  getTheValueOfCurrentExcursion(currentListItem);
}
if (e.target.value === "usuń") {
  // usun
  console.log(e.target.value)
  const currentListItem = e.target.parentElement.parentElement.parentElement;
  deleteExcursion(currentListItem)
  console.log(excursionsArray, 'delete excursion')
}
}


const getTheValueOfCurrentExcursion = (listItem) => {
  formElAdmin.removeEventListener('submit', handleSubmit);
  getAccesToId = +listItem.dataset.id;
  for (let i = 0; i < excursionsArray.length; i++) {
    if (getAccesToId === excursionsArray[i].id) {
      const [name, description, adultPrice, childPrice] = formElAdmin.elements;
      name.value = excursionsArray[i].title;
      description.value = excursionsArray[i].excDesc;
      adultPrice.value = excursionsArray[i].aPrice;
      childPrice.value = excursionsArray[i].chPrice;
      formElAdmin.addEventListener('submit', handleUpdateSubmit)
    }
    
  }
}

const updateExcursion = (name, description, adultPrice, childPrice) => {
  let updateObject = {
    id: getAccesToId,
    title: name,
    excDesc: description,
    aPrice: +adultPrice,
    chPrice: +childPrice,
  }
  const matchIdObj = excursionsArray.find(el => el.id === updateObject.id);

  if (matchIdObj) {
    matchIdObj.id = getAccesToId
    matchIdObj.title = name;
    matchIdObj.excDesc = description;
    matchIdObj.aPrice = adultPrice;
    matchIdObj.chPrice = childPrice;
    formElAdmin.removeEventListener('submit', handleUpdateSubmit)
    formElAdmin.addEventListener('submit', handleSubmit);
    const options = {
      method: 'PUT',
      body: JSON.stringify( matchIdObj ),
      headers: { 'Content-Type': 'application/json'}
    };
    fetch(`${apiUrl}/${getAccesToId}`, options) 
    .then(res => console.log(res))
    .catch(err => console.error(err))
     
  
  }
  addExcursionsToDOM(excursionsArray);
  }
  
const handleUpdateSubmit = (e) => {
e.preventDefault();
const [name, description, adultPrice, childPrice] = formElAdmin.elements;

  const nameValue = name.value;
  const descriptionValue = description.value;
  const adultPriceValue = parseInt(adultPrice.value);
  const childPriceValue = parseInt(childPrice.value);
  updateExcursion(nameValue, descriptionValue, adultPriceValue, childPriceValue);
  formElAdmin.reset();

}


const deleteExcursion = (listItem) => {
  const currentListItemId = +listItem.dataset.id;
  for (let i = 0; i < excursionsArray.length; i++) {
    if (currentListItemId === excursionsArray[i].id) {
      excursionsArray.splice(i, 1);
      const displayCurrentExcursions = addExcursionsToDOM(excursionsArray);
      const options = {method : 'DELETE'};
      fetch(`${apiUrl}/${currentListItemId}`, options)
      .then(res => console.log(res))
      .catch(err => console.error(err))
    }
  }
  formElAdmin.addEventListener("submit", handleSubmit);
} 
