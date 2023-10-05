class ExcursionsAPI {
    constructor() {
        this.apiOrdersUrl = 'http://localhost:3000/orders';
        this.apiExcursionsUrl = 'http://localhost:3000/excursions';
    }
    _fetchExc(options) {
        return fetch(this.apiExcursionsUrl)
        .then(res => {
            if (res.ok) {return res.json();}
            return Promise.reject(res)
        })
    }
   
    loadData() {
       return this._fetchExc();
    }
    
   
    addData(data) {
        const options = {
            method: 'POST',
            body: JSON.stringify( data ),
            headers: {
            'Content-Type': 'application/json'
            }
            };
     return this._fetchExc(options);
           
    }

    updateData(id, data) {
        const options = {
            method: 'PUT',
            body: JSON.stringify( data ),
            headers: {
            'Content-Type': 'application/json'
            }
            };
     return this._fetchExc(options, `/${id}`);
    }


    deleteData(id) {
        const options = {
            method: 'DELETE',
            body: JSON.stringify( data ),
            headers: {
            'Content-Type': 'application/json'
            }
            };
     return this._fetchExc(options, `/${id}`);
    }


    _fetchOrders(options) {
        return fetch(this.apiOrdersUrl)
        .then(res => {
            if (res.ok) {return res.json();}
            return Promise.reject(res)
        })
    }

    addOrder(data) {
        const options = {
            method: 'POST',
            body: JSON.stringify( data ),
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return this._fetchOrders(options);
    }
   
}

export default ExcursionsAPI;