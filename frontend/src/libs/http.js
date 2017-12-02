import Util from './util';

function ajax (options) {
    return new Promise((resolve, reject) => {
        Util.ajax(options).then(res => {
            if (res.statusText === 'OK') {
                resolve(res.data);
            } else {
                reject(new Error(res.statusText));
            }
        }).catch(err => {
            if (reject) {
                reject(err);
            }
        });
    });
}

let http = {
    baseUrl: Util.baseUrl,
    get (options) {
        options.params = options.data || {};
        return ajax({
            method: 'GET',
            ...options
        });
    },
    post (options) {
        return ajax({
            method: 'POST',
            ...options
        });
    },
    patch (options) {
        return ajax({
            method: 'PATCH',
            ...options
        });
    },
    delete (options) {
        return ajax({
            method: 'DELETE',
            ...options
        });
    }
};

export default http;
