export const addAdminHtml = (id, title, excDesc, aPrice, chPrice) => {
    return `<li data-id=${id} class="excursions__item excursions__item--prototype ">
    <header class="excursions__header">
      <h2 class="excursions__title excursions__edit">${title}</h2>
      <p class="excursions__description excursions__edit">
       ${excDesc}</p>
    </header>
    <form class="excursions__form">
      <div class="excursions__field">
        <label class="excursions__field-name">
          Dorosły: <strong class="excursions__edit">${aPrice}</strong>PLN
        </label>
      </div>
      <div class="excursions__field">
        <label class="excursions__field-name">
          Dziecko: <strong class="excursions__edit">${chPrice}</strong>PLN
        </label>
      </div>
      <div class="excursions__field excursions__field--submit">
        <button value="edytuj">edytuj
        </button>
        <button value="usuń">usuń
        </button>
      </div>
  </form>
</li>`
} 


  