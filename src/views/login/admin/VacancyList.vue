<template>
    <div class="nav-fixed">
        <DashboardNavbar/>
        <div id="layoutSidenav">
            <DashboardSidebar/>
            <div id="layoutSidenav_content">
                <main>
                    <div class="container-xl px-4 mt-4">
                        <nav class="nav nav-borders">
                            <a class="nav-link active">Lowongan Pekerjaan</a>
                        </nav>
                        <hr class="mt-0 mb-4" />
                        <div class="card mb-4">
                            <div class="card-header">Daftar Lowongan Pekerjaan</div>
                            <div class="card-body p-0 mb-3">
                                <div class="row">
                                    <div class="col-lg-10 offset-lg-1">
                                        <div class="table-responsive table-billing-history mt-3">
                                            <DataTable
                                                class="table table-hover display" 
                                                :data="vacancy"
                                                :columns="columns"
                                                :options="{responsive: true, select: 'single', autoWidth: false,dom: 'Bflrtip', buttons: buttons}"
                                                ref="table"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Posisi Kerja</th>
                                                        <th>Nilai Minimal</th>
                                                        <th>Kuota</th>
                                                        <th>Status</th>
                                                        <th>Dibuat pada</th>
                                                    </tr>
                                                </thead>
                                            </DataTable>
                                            <div class="mt-3 mb-3" v-if="level != 'hrd'">
                                                <a class="btn btn-sm btn-primary" @click.prevent="openForm()"><i class="fa fa-plus"></i></a> |
                                                <button class="btn btn-sm btn-danger" @click.prevent="remove()" title="Delete User"><i class="fa fa-trash"></i></button> |
                                                <button class="btn btn-sm btn-warning" @click.prevent="edit()" title="Edit User"><i class="fa fa-pen"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <input type="hidden" name="idJob" id="idJob" readonly>
                <div class="modal fade" id="vacancyForm" data-bs-backdrop="static" tabindex="-1" aria-labelledby="vacancyForm" aria-hidden="true">
                    <form @submit.prevent="input()">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                            <div class="modal-header">
                                <h1 class="modal-title fs-5">Data Lowongan Kerja</h1>
                                <button type="button" class="btn-close" @click.prevent="render()" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="mb-3">
                                    <label class="col-form-label">Posisi</label>
                                    <input type="text" class="form-control" v-model="this.form.position" required placeholder="Enter a Position Name">
                                </div>
                                <div class="mb-3">
                                    <label class="col-form-label">Nilai Minimal</label>
                                    <input type="number" class="form-control" v-model="this.form.minVal" required placeholder="Enter a Minimum Value">
                                </div>
                                <div class="mb-3">
                                    <label class="col-form-label">Kuota</label>
                                    <input type="number" class="form-control" v-model="this.form.quota" required placeholder="Enter a Quota">
                                </div>
                                <div class="mb-3">
                                    <label class="col-form-label">Aktif</label>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" id="active" name="active" v-model="this.form.active">
                                    </div>
                                </div>
                                <hr>
                                <div class="mb-3">
                                    <label class="col-form-label">Syarat Khusus</label>
                                    <div class="mb-3" v-for="(input, index) in info" :key="`listInput-${index}`">
                                        <div class="row">
                                            <div class="col-md-8">
                                                <input type="text" class="form-control" v-model="input.detail" required placeholder="Enter a Minimum Requirement">
                                            </div>
                                            <div class="col-md-4">
                                                <button class="btn btn-sm btn-success" @click.prevent="addField(info)"><i class="fas fa-plus-circle"></i></button> |
                                                <button class="btn btn-sm btn-danger" @click.prevent="removeField(index, info)"><i class="fas fa-minus"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="closeModal" @click.prevent="render()">Close</button>
                                <button type="submit" class="btn btn-primary">Save</button>
                            </div>
                            </div>
                        </div>
                    </form>
                </div>
                <DashboardFooter/>
            </div>
        </div>
    </div>
</template>

<script>
import '@/load/login'
import 'datatables.net-select'
import 'datatables.net-responsive-bs5'
import 'datatables.net-buttons/js/buttons.print'

import axios from 'axios'
import Swal from 'sweetalert2'
import router from '@/router'
import { ref } from 'vue'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min'
import DataTable from "datatables.net-vue3"
import DataTableLib from "datatables.net-bs5"
import ButtonsHtml5 from "datatables.net-buttons/js/buttons.html5"
import pdfFonts from "pdfmake/build/vfs_fonts"
import pdfmake from "pdfmake"
import JsZip from "jszip"

import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue';
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue';

export default {
    data() {
        return{
            vacancy: ref([]),
            id: null,
            level: null,
            info: [{detail:''}],
            form: {
                position: '',
                minVal: '',
                quota: '',
                active: true
            },
            columns:[
                {
                    data:null,
                    render: function(data,type,row,meta){
                        return `${meta.row+1}`
                    }
                },
                {data:'position'},
                {data:'minimum_value'},
                {
                    data: null,
                    render: function(data) {
                        return `${data.quota} Orang`
                    }
                },
                {
                    data:null,
                    className: 'dt-center',
                    render: function(data) {
                        if(data.active) {
                            return '<button class="btn btn-sm btn-success"></button>'
                        } else {
                            return '<button class="btn btn-sm btn-danger"></button>'
                        }
                    }
                },
                {
                    data: null,
                    render: function(data) {
                        return data.updated_at.replace('T', ' | ').replace('.000000Z', '')
                    }
                },
                {data:'id', visible: false, searchable: false,},
            ],
            buttons: [
                {
                    title: `Daftar Lowongan Pekerjaan`,
                    extend: 'pdf',
                    exportOptions: {
                        columns: [ 0, 1, 2 ]
                    },
                    text: '<i class="fas fa-solid fa-file-pdf"></i> PDF',
                    className: 'btn btn-sm btn-danger'
                },
                {
                    title: `Daftar Lowongan Pekerjaan`,
                    extend: 'csv',
                    exportOptions: {
                        columns: [ 0, 1, 2 ]
                    },
                    text: '<i class="fas fa-solid fa-file-csv"></i> CSV',
                    className: 'btn btn-sm btn-success'
                },
                {
                    title: `Daftar Lowongan Pekerjaan`,
                    extend: 'print',
                    exportOptions: {
                        columns: [ 0, 1, 2 ]
                    },
                    text: '<i class="fas fa-solid fa-print"></i> Print',
                    className: 'btn btn-sm btn-dark'
                },
                {
                    title: `Daftar Lowongan Pekerjaan`,
                    extend: 'copy',
                    exportOptions: {
                        columns: [ 0, 1, 2 ]
                    },
                    text: '<i class="fas fa-solid fa-copy"></i> Copy',
                    className: 'btn btn-sm btn-warning'
                },
            ]
        }
    },
    async beforeRouteEnter() {
        if(!localStorage.getItem('token')) {
            return router.push({
                path: 'page-not-found'
            })
        } else {
            const response = await axios.get('get-token')
            let data = response.data.data

            if(data.level == 'user') {
                return router.push({
                    path: 'page-not-found'
                })
            }
        }
    },
    async created() {
        Swal.fire({
            title: 'Loading Data!',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try{
            const level = await axios.get('get-token')
            const response = await axios.get('job')
            
            this.level = level.data.data.level
            this.vacancy = response.data.data
            
            Swal.close()
        } catch {
            Swal.close()
        }
    },
    beforeMount() {
        window.JsZip = JsZip
        pdfmake.vfs = pdfFonts.pdfMake.vfs
        DataTable.use(DataTableLib)
        DataTable.use(pdfmake)
        DataTable.use(ButtonsHtml5)
    },
    methods: {
        openForm() {
            const vacancyForm = new Modal('#vacancyForm', {
                keyboard: false
            })
            vacancyForm.show()
        },
        async input() {
            if(!this.editForm){
                try {
                    const response = await axios.post('job', {
                        position: this.form.position,
                        minimum_value: this.form.minVal,
                        quota: this.form.quota,
                        active: this.form.active,
                        info: this.info
                    })
    
                    Swal.fire({
                        icon: 'success',
                        title: response.data.status,
                        text: response.data.message,
                    })

                    document.getElementById('closeModal').click()

                    this.render()
                } catch {
                    Swal.fire({
                        icon: "error",
                        title: "Failed!",
                        text: "Server error, silahkan muat ulang website!",
                    })
                }
            } else {
                try {
                    const response = await axios.put(`job/${this.id}`, {
                        position: this.form.position,
                        minimum_value: this.form.minVal,
                        quota: this.form.quota,
                        active: this.form.active,
                        info: this.info
                    })

                    Swal.fire({
                        icon: 'success',
                        title: response.data.status,
                        text: response.data.message,
                    })

                    document.getElementById('closeModal').click()

                    this.render()
                } catch {
                    Swal.fire({
                        icon: "error",
                        title: "Failed!",
                        text: "Server error, silahkan muat ulang website!",
                    })
                }
            }
        },
        async edit(){
            let dt = this.$refs.table.dt();
            let id = document.getElementById("idJob")

            dt.rows({ selected: true }).every(function () {
                id.value = this.data().id;
            })

            if(id.value) {
                this.id = parseInt(id.value)
                this.editForm = true

                const info = await axios.get(`info/${this.id}`)
                const res = await axios.get(`job/${this.id}`)

                let status = true

                if(res.data.data.active == 0) status = false
                
                this.info = info.data.data
                this.form.position = res.data.data.position
                this.form.minVal = res.data.data.minimum_value
                this.form.quota = res.data.data.quota
                this.form.active = status
    
                this.openForm()
            }
        },
        async resetPassword(id){
            Swal.fire({
                title: 'Anda Yakin ingin Mereset Password User?',
                icon: 'warning',
                showCancelButton: true,
                cancelButtonColor: '#22bb33',
                confirmButtonText: 'Yakin',
                confirmButtonColor: '#d33',
                reverseButtons: false,
                allowEscapeKey: false,
                allowOutsideClick: false
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.put(`reset-password/${id}`)
                        .then(response => {
                            Swal.fire({
                                icon: 'success',
                                title: response.data.status,
                                text: response.data.message,
                            })
                        }).catch(() => {
                            Swal.fire({
                                icon: "error",
                                title: "Failed!",
                                text: "Server error, silahkan muat ulang website!",
                            })
                        })
                    }
            })
        },
        async remove(){
            let dt = this.$refs.table.dt();
            let id = document.getElementById("idJob")

            dt.rows({ selected: true }).every(function () {
                id.value = this.data().id;
            })
            
            if(id.value) {
                Swal.fire({
                    title: 'Anda Yakin ingin Menghapus Lowongan Pekerjaan?',
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonColor: '#22bb33',
                    confirmButtonText: 'Yakin',
                    confirmButtonColor: '#d33',
                    reverseButtons: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            dt.rows({ selected: true }).every(function () {
                                let selectedData = this.data();
                                axios.delete(`job/${selectedData.id}`)
                                .then(res => {
                                    Swal.fire({
                                        icon: "success",
                                        title: "Success!",
                                        text: res.data.message,
                                    })
                                }).catch(() => {
                                    Swal.fire({
                                        icon: "error",
                                        title: "Failed!",
                                        text: "Server error, silahkan muat ulang website!"
                                    })
                                })
                            });
    
                            this.render()
                        } else {
                            this.render()
                        }
                })
            }
        },
        addField(info) {
            info.push({});
        },
        removeField(index, info) {
            info.splice(index, 1)
        },
        async render() {
            let id = document.getElementById("idJob")
            id.value = null

            this.editForm = false
            this.id = null
            this.form.position = ''
            this.form.minVal = ''
            this.form.quota = ''
            this.form.active = true
            this.info = [{detail:''}]

            try {
                const response = await axios.get('job')

                this.vacancy = response.data.data
            } catch {
                this.vacancy = []
            }
        }
    },
    components: { DashboardNavbar, DashboardSidebar, DashboardFooter, DataTable }
}
</script>

<style scoped>
@import 'datatables.net-bs5';
</style>