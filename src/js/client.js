import "./../css/main.css"
import "./../css/client.css";


import ExcursionsAPI from "./ExcursionsAPI";
import { addClientHtml } from "./htmlClientStructure";
import { fields } from "./formFields";
document.addEventListener("DOMContentLoaded", init);

const api = new ExcursionsAPI();

function init() {
  console.log("client");
  loadExcursions();
}

const formArray = [];
let basket = [];

const loadExcursions = () => {
  api.loadData()
  .then((data) => addExcursionToDom(data))
    .catch((err) => console.error(err));
};

const addExcursionToDom = (excursionsArr) => {
  const ulElement = document.querySelector(".excursions");
  excursionsArr.forEach((el) => {
    ulElement.innerHTML += addClientHtml(
      el.id,
      el.title,
      el.excDesc,
      el.aPrice,
      el.chPrice
    );
  });
  getListItemForm(ulElement);
};

const getListItemForm = (excursionsList) => {
  const listItem = [...excursionsList.children];
  listItem.forEach(function (li) {
    const formEl = li.querySelector("form");
    formArray.push(formEl);
  });
  passTheValue(formArray);
};

const getAdultPrice = (form) => {
  const adultPrice =
    form.firstElementChild.firstElementChild.firstElementChild.dataset.adult;
  return adultPrice;
};
const getChildPrice = (form) => {
  const childPrice =
    form.firstElementChild.nextElementSibling.firstElementChild
      .firstElementChild.dataset.child;
  return childPrice;
};

const getTitleOfTravel = (form) => {
  const titleofTravel =
    form.previousElementSibling.firstElementChild.dataset.title;
  return titleofTravel;
};
const passTheValue = (forms) => {
  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault(e);
      const parentId = +form.parentElement.dataset.id;
      const titleofTravel = getTitleOfTravel(form);
      const adultP = getAdultPrice(form);
      const childP = getChildPrice(form);
      const adultNum = parseInt(form.querySelector("[name=adults]").value);
      const childNum = parseInt(form.querySelector("[name=children]").value);
      if (adultNum > 0 && adultNum < 11 && childNum > 0 && childNum < 11) {
        if (!isNaN(adultNum) || !isNaN(childNum)) {
          const obj = {
            id: parentId,
            title: titleofTravel,
            adultNumber: adultNum,
            adultPrice: +adultP,
            childNumber: childNum,
            childPrice: +childP,
            sum: childNum * childP + adultNum * adultP,
          };
          if (!basket.some((el) => el.id === obj.id)) {
            basket.push(obj);
            displayBasketData(basket);
          }
        }
      } else {
        alert("Wpisujemy tylko liczby w przedziale od 1 do 10 :)");
      }
    });
  });
};

const displayBasketData = (basket) => {
  const summaryList = document.querySelector(".summary");
  summaryList.innerHTML = "";
  let total = 0;
  basket.forEach((exc) => {
    total += exc.sum;
    summaryList.innerHTML += `
        <li data-id=${exc.id} class="summary__item summary__item--prototype">
        <h3 class="summary__title">
          <span class="summary__name">${exc.title}</span>
          <strong class="summary__total-price"> : ${exc.sum} PLN</strong>
          <a href="#" class="summary__btn-remove" title="usuń" data-id=${exc.id}>X</a>
        </h3>
        <p class="summary__prices">dorośli:${exc.adultNumber} x ${exc.adultPrice}PLN, dzieci:${exc.childNumber} x ${exc.childPrice}PLN</p>
      </li>
        `;
  });
  const removeBtn = document.querySelectorAll(".summary__btn-remove");
  removeBtn.forEach((btn) => {
    btn.addEventListener("click", deleteBasketData);
  });
  totalPrice.innerHTML = `${total} PLN`;
  // console.log(basket)
};

const totalPrice = document.querySelector(".order__total-price-value");

const deleteBasketData = (e) => {
  const currentBtn = e.target;
  const currentBtnId = +currentBtn.dataset.id;
  for (let i = 0; i < basket.length; i++) {
    if (basket[i].id === currentBtnId) {
      basket.splice(i, 1);
      const updateBasket = displayBasketData(basket);
    }
  }
};

const validate = (formEl) => {
  const listErrors = document.querySelector(".order__list-errors");
  listErrors.innerText = "";
  const errors = [];
  fields.forEach((field) => {
    const value = formEl.elements[field.name].value;
    if (field) {
      if (value.length === 0) {
        errors.push(`Dane w polu ${field.label} są wymagane!`);
      }
    }
    if (field.pattern) {
      const reg = new RegExp(field.pattern);
      if (!reg.test(value)) {
        errors.push(`Dane w polu ${field.label} są nieprawidłowe!`);
      }
    }
  });

  if (errors.length === 0) {
    sendOrderToApi(formEl);
    basket = [];
    totalPrice.innerHTML = `0 PLN`;
    const summaryList = document.querySelector(".summary");
    summaryList.innerText = "";
    fields.forEach((el) => {
      formEl[el.name].value = "";
    });
    formArray.forEach((item) => {
      const adultInput = item.querySelector("[name=adults]");
      const childInput = item.querySelector("[name=children]");
      adultInput.value = "";
      childInput.value = "";
    });
  } else {
    errors.forEach((text) => {
      const li = document.createElement("li");
      li.classList.add(".order__errors-item");
      li.style.color = "red";
      li.innerText = text;
      listErrors.appendChild(li);
    });
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  const formEl = e.target;
  validate(formEl);
};

const sendOrderToApi = (formEl) => {
  const [name, email] = formEl.elements;

  const objBasket = {
    name: name.value,
    email: email.value,

    excurions: basket,
  }

  api.addOrder(objBasket)
  .catch((err) => console.error(err))
};

const orderForm = document.querySelector(".order");
orderForm.addEventListener("submit", handleSubmit);
