export const addClientHtml = (id, title, excDesc, aPrice, chPrice) => {
return `
<li data-id=${id} class="excursions__item excursions__item--prototype">
<header class="excursions__header">
    <h2 class="excursions__title" data-title="${title}">${title}</h2>
    <p class="excursions__description">${excDesc}</p>
</header>
<form class="excursions__form">
    <div class="excursions__field">
        <label class="excursions__field-name">
            Dorosły: <span class="excursions__price" data-adult="${aPrice}">${aPrice}</span>PLN x <input class="excursions__field-input" name="adults" />
        </label>
    </div>
    <div class="excursions__field">
        <label class="excursions__field-name">
            Dziecko:  <span class="excursions__price" data-child="${chPrice}">${chPrice}</span>PLN x <input class="excursions__field-input" name="children" />
        </label>
    </div>
    <div class="excursions__field excursions__field--submit">
        <input 
            class="excursions__field-input excursions__field-input--submit" 
            value="dodaj do zamówienia"
            type="submit"
        />
    </div>
</form>
</li> 
`
}

{/* <li data-id=${el.id} class="excursions__item excursions__item--prototype">
<header class="excursions__header">
    <h2 class="excursions__title" data-title="${el.title}">${el.title}</h2>
    <p class="excursions__description">${el.excDesc}</p>
</header>
<form class="excursions__form">
    <div class="excursions__field">
        <label class="excursions__field-name">
            Dorosły: <span class="excursions__price" data-adult="${el.aPrice}">${el.aPrice}</span>PLN x <input class="excursions__field-input" name="adults" />
        </label>
    </div>
    <div class="excursions__field">
        <label class="excursions__field-name">
            Dziecko:  <span class="excursions__price" data-child="${el.chPrice}">${el.chPrice}</span>PLN x <input class="excursions__field-input" name="children" />
        </label>
    </div>
    <div class="excursions__field excursions__field--submit">
        <input 
            class="excursions__field-input excursions__field-input--submit" 
            value="dodaj do zamówienia"
            type="submit"
        />
    </div>
</form>
</li> */}
