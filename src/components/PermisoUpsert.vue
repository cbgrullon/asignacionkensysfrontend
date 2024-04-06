<template>
    <div id="permiso-upsert">
        <h3 style="padding-bottom: 1rem;">{{ titulo }}</h3>
        <form @submit.prevent="save">
            <div class="mb-3" v-if="!isInsert">
                <label for="id">#</label>
                <input type="text" class="form-control" disabled :value="id" />
            </div>
            <div class="row">
                <div class="col">
                    <label for="nombreEmpleado" class="form-label">Nombres de empleado</label>
                    <input type="text" class="form-control" id="nombreEmpelado" aria-describedby="Nombre de empleado"
                        v-model="nombreEmpleado" maxlength="100" required>
                </div>
                <div class="col">
                    <label for="apellidosEmpleado" class="form-label">Apellidos de empleado</label>
                    <input type="text" class="form-control" id="apellidosEmpleado" v-model="apellidosEmpleado" required
                        maxlength="100">
                </div>
            </div>
            <div class="mb-3">
                <label for="tipoPermisoId" class="form-label">Tipo de Permiso</label>
                <select id="tipoPermisoId" class="form-select" v-model="tipoPermisoId" required>
                    <option v-for="tp in tipoPermisos" v-bind:key="tp.id" :value="tp.id">{{ tp.descripcion }}</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="tipoPermiso" class="form-label">Fecha del Permiso</label>
                <input type="date" class="form-control" id="fechaPermiso" v-model="fechaPermiso" required>
            </div>
            <button type="submit" class="btn btn-success">Guardar</button>
            <router-link to="/" class="btn btn-danger">Volver</router-link>
        </form>
    </div>
</template>
<script>
import router from '../router';
import constants from '../constants';
import { getPermisoById, getTiposDePermiso, upsertPermiso } from '../services/apiService';
export default {
    name: 'permiso-upsert',
    data() {

        return {
            id: null,
            nombreEmpleado: null,
            apellidosEmpleado: null,
            tipoPermisoId: null,
            fechaPermiso: null,
            tipoPermisos: [],
            titulo: '',
            isInsert: null,
            toast: null
        };

    },
    mounted() {

        this.initialise();

    },
    watch: {
        '$route': 'initialise'
    },
    methods: {
        initialise() {

            this.toast = this.$swal.mixin({
                ...constants.toastConfig,
                didOpen: (toast) => {
                    toast.onmouseenter = this.$swal.stopTimer;
                    toast.onmouseleave = this.$swal.resumeTimer;
                }
            });

            this.isInsert = !this.$route.params.id;
            this.id = this.$route.params.id;
            this.titulo = this.isInsert ? 'Nuevo Permiso' : 'Editar Permiso';


            this.$swal.fire({
                title: 'Cargando ...',
                onBeforeOpen() {
                    Swal.showLoading()
                },
                onAfterClose() {
                    Swal.hideLoading()
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                allowEnterKey: false,
                showConfirmButton: false,
            });

            getTiposDePermiso()
                .then(tipoPermisos => {

                    this.tipoPermisos = tipoPermisos;

                })
                .catch(errorMessage => {

                    this.showWarningToast(errorMessage);
                    this.$router.push(`/`);

                })
                .finally(() => {
                    this.$swal.close();
                });

            if (this.$route.params.id) {

                getPermisoById(this.$route.params.id)
                    .then(permiso => {

                        this.nombreEmpleado = permiso.nombreEmpleado;
                        this.apellidosEmpleado = permiso.apellidosEmpleado;
                        this.tipoPermisoId = permiso.tipoPermisoId;
                        this.fechaPermiso = permiso.fechaPermiso;

                    })
                    .catch(errorMessage => {

                        this.showWarningToast(errorMessage);
                        this.$router.push(`/`);

                    });

            }
        },
        showWarningToast(message) {

            this.$swal.fire({
                title: message,
                icon: 'warning'
            });

        },
        save() {

            let { id, nombreEmpleado, apellidosEmpleado, tipoPermisoId, fechaPermiso } = this;
            let payload = {
                id,
                nombreEmpleado,
                apellidosEmpleado,
                tipoPermisoId,
                fechaPermiso
            }
            upsertPermiso(payload)
                .then(() => {

                    this.toast.fire({
                        icon: 'success',
                        title: 'Permiso Guardado satisfactoriamente'
                    });
                    this.$router.push(`/`);

                })
                .catch(errorMessage => {

                    this.showWarningToast(errorMessage);

                });

        }
    },
    components: { router }
}
</script>