import axios from "axios";
import constants from "../constants";

function getTiposDePermiso() {
    return new Promise((resolve, reject) => {

        axios.get('/TipoPermiso')
            .then(response => {

                return resolve(response.data);

            })
            .catch(error => {

                console.error(error.response);
                return reject(constants.genericErrorMessage);

            });

    });
}

function getPermisos() {

    return new Promise((resolve, reject) => {

        axios.get('/Permiso')
            .then(response => {

                let permisos = response.data.map(x => {

                    return {
                        ...x,
                        formattedFechaPermiso: new Date(x.fechaPermiso).toLocaleDateString()
                    }

                });
                return resolve(permisos);

            })
            .catch(error => {

                return reject(getPermisoErrorMessage(error));

            });

    });

}
function getPermisoById(id) {

    return new Promise((resolve, reject) => {

        axios.get(`/Permiso/${id}`)
            .then(response => {

                return resolve(response.data);

            })
            .catch(error => {

                return reject(getPermisoErrorMessage(error));

            });

    });

}
function upsertPermiso(permiso) {

    return new Promise((resolve, reject) => {

        axios.post('/Permiso', permiso)
            .then(response => {

                return resolve(response.data);

            })
            .catch(error => {

                let errorMessage = getPermisoErrorMessage(error);
                return reject(errorMessage);

            });

    });

}

function deletePermisoById(id) {
    return new Promise((resolve, reject) => { 

        axios.delete(`/Permiso/${id}`)
            .then(response => {
    
                return resolve();
    
            })
            .catch(error => {
    
                return reject(getPermisoErrorMessage(error));
    
            });

    });
}

function getPermisoErrorMessage(error) {

    if(!error || !error.response || !error.response.status){

        return constants.genericErrorMessage;

    }


    if (error.response.status === 404) {

        return constants.permisoNotFoundErrorMessage;

    }
    else if (error.response.status === 400) {

        let firstKey = Object.keys(error.response.data)[0];
        let firstMessage = error.response.data[firstKey][0];
        return firstMessage;

    }
    else {

        console.error(error);
        return constants.genericErrorMessage;

    }
}
export { getTiposDePermiso, getPermisos, getPermisoById, upsertPermiso, deletePermisoById };