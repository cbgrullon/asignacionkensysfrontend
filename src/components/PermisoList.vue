<template>
    <div id="permiso-list">
        <h3 style="padding-bottom: 1rem;">Listado de permisos</h3>
        <router-link class="btn btn-success" v-bind:to="{ name: 'permiso-upsert' }"><i class="bi bi-plus"></i></router-link>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Nombres del Empleado</th>
                    <th scope="col">Apellidos del Empleado</th>
                    <th scope="col">Tipo de Permiso</th>
                    <th scope="col">Fecha de permiso</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="permiso in permisos" v-bind:key="permiso.id">
                    <td># {{ permiso.id }}</td>
                    <td>{{ permiso.nombreEmpleado }}</td>
                    <td>{{ permiso.apellidosEmpleado }}</td>
                    <td>{{ permiso.tipoPermiso.descripcion }}</td>
                    <td>{{ permiso.formattedFechaPermiso }}</td>
                    <td>
                        <router-link class="btn btn-primary"
                            v-bind:to="{ name: 'permiso-upsert', params: { id: permiso.id } }"><i
                                class="bi bi-pen"></i></router-link>
                        <button class="btn btn-danger" @click="deletePermiso(permiso.id)"><i
                                class="bi bi-trash"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import constants from '../constants';
import { getPermisos, deletePermisoById } from '../services/apiService';
export default {
    name: 'permiso-list',
    data() {
        return {
            permisos: [],
            toast: null
        }
    },
    mounted() {
        this.initialise();
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

            getPermisos().then(permisos => {

                this.permisos = permisos;

            }).catch(errorMessage => {

                this.showWarningToast(errorMessage);

            }).finally(() => {
                this.$swal.close();
            })

        },
        showWarningToast(message) {

            this.$swal.fire({
                title: message,
                icon: 'warning'
            });

        },
        deletePermiso(id) {

            this.$swal.fire({
                title: "Esta seguro que quiere eliminar este permiso?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar"
            })
                .then((result) => {

                    if (result.isConfirmed) {

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

                        deletePermisoById(id)
                            .then(() => {

                                this.toast.fire({
                                    icon: 'success',
                                    title: 'Permiso eliminado'
                                });
                                this.initialise();

                            })
                            .catch(errorMessage => {

                                this.showWarningToast(errorMessage);

                            })
                            .finally(() => {

                                this.$swal.close();

                            })
                    }

                });
        }
    }
}
</script>