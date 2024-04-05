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
import axios from 'axios';
import router from '../router';
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
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.onmouseenter = this.$swal.stopTimer;
                    toast.onmouseleave = this.$swal.resumeTimer;
                }
            });
            this.isInsert = !this.$route.params.id;
            this.id = this.$route.params.id;
            this.titulo = this.isInsert ? 'Nuevo Permiso' : 'Editar Permiso';
            axios.get('TipoPermiso').then(response => {
                this.tipoPermisos = response.data;
            });
            if (this.$route.params.id) {
                axios.get(`Permiso/${this.$route.params.id}`)
                    .then(response => {
                        let { data } = response;
                        this.nombreEmpleado = data.nombreEmpleado;
                        this.apellidosEmpleado = data.apellidosEmpleado;
                        this.tipoPermisoId = data.tipoPermisoId;
                        this.fechaPermiso = data.fechaPermiso;
                    })
                    .catch(error => {
                        if (error.response.status === 404) {
                            this.toast.fire({
                                title: 'Permiso no encontrado',
                                icon: 'warning'
                            });
                            this.$router.push(`/`);
                        } else {
                            this.$swal.fire({
                                title: 'Ha ocurrido un error inesperado',
                                text: 'Contacte a su administrador!',
                                icon: 'error'
                            });
                            console.error(error.response);
                        }
                    });
            }
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
            axios.post("Permiso", payload).then(response => {
                this.toast.fire({
                    icon: 'success',
                    title: 'Permiso Guardado satisfactoriamente'
                })
                this.$router.push(`/`);
            }).catch(error => {
                if (error.response.status === 400) {
                    for (let key of Object.keys(error.response.data)) {
                        let firstMessage = error.response.data[key][0];
                        this.$swal({ title: firstMessage, icon: 'warning' });
                    }
                } else {
                    this.$swal.fire({
                        title: 'Ha ocurrido un error inesperado',
                        text: 'Contacte a su administrador!',
                        icon: 'error'
                    });
                    console.error(error.response);
                }
            })
        }
    },
    components: { router }
}
</script>