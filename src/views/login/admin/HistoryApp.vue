<template>
    <div class="nav-fixed">
        <DashboardNavbar/>
        <div id="layoutSidenav">
            <DashboardSidebar/>
            <div id="layoutSidenav_content">
                <main>
                    <div class="container-xl px-4 mt-4">
                        <nav class="nav nav-borders">
                            <a class="nav-link active">Lamaran</a>
                        </nav>
                        <hr class="mt-0 mb-4" />
                        <div class="card mb-4">
                            <div class="card-header">Riwayat Lamaran Pekerjaan</div>
                            <div class="card-body p-0 mb-3">
                                <div class="row">
                                    <div class="col-lg-10 offset-lg-1">
                                        <div class="table-responsive table-billing-history mt-3">
                                            <DataTable
                                                class="table table-hover display" 
                                                :data="applicant"
                                                :columns="columns"
                                                :options="{responsive: true, select: 'single', autoWidth: false,dom: 'Bflrtip', buttons: buttons, }"
                                                ref="table"
                                            >
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>Pelamar</th>
                                                        <th>Posisi</th>
                                                        <th>Status</th>
                                                        <th>Dibuat pada</th>
                                                    </tr>
                                                </thead>
                                            </DataTable>
                                            <div class="mt-3 mb-3">
                                                <button class="btn btn-danger btn-sm" type="submit" @click.prevent="restore()" v-if="level != 'direktur'"><i class="fa fa-rotate-left"></i></button> |
                                                <button class="btn btn-warning btn-sm" type="submit" @click.prevent="openInfo()"><i class="fa fa-info"></i></button> |
                                                <button class="btn btn-success btn-sm" type="submit" @click.prevent="accept()" v-if="level != 'direktur'"><i class="fa fa-arrow-right"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <input type="hidden" name="idApp" id="idApp" readonly>
                <input type="hidden" name="idUser" id="idUser" readonly>
                <div class="modal fade" id="applicantInfo" tabindex="-1" aria-labelledby="vacancyInfo" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="vacancyInfo">Informasi Pelamar Kerja</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click.prevent="render()"></button>
                        </div>
                        <div class="modal-body tex-center">
                            <img class="img-account-profile rounded-circle d-flex mb-2" :src="image" alt="" />
                            <hr>
                            <a :href="cv">Download CV</a>
                            <hr>
                            <h5>Nilai Tes Tulis : {{ value }}</h5>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click.prevent="render()">Close</button>
                        </div>
                        </div>
                    </div>
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
            applicant: ref([]),
            cv: null,
            level: null,
            image: null,
            value: null,
            columns:[
                {data:null, render: function(data,type,row,meta)
                    {return `${meta.row+1}`}},
                {data:'full_name'},
                {data:'position'},
                {
                    data:null,
                    className: 'dt-center',
                    render: function(data) {
                        if(data.status == 'Accepted') {
                            return `<span class="badge bg-success text-light">${data.status}</span>`
                        } else {
                            return `<span class="badge bg-danger text-light">${data.status}</span>`
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
                {data:'user_id', visible: false, searchable: false,},
            ],
            buttons: [
                {
                    title: `Data Riwayat Lamaran Kerja`,
                    extend: 'pdf',
                    exportOptions: {
                        columns: [ 0, 1, 2, 3 ]
                    },
                    text: '<i class="fas fa-solid fa-file-pdf"></i> PDF',
                    className: 'btn btn-sm btn-danger'
                },
                {
                    title: `Data Riwayat Lamaran Kerja`,
                    extend: 'csv',
                    exportOptions: {
                        columns: [ 0, 1, 2, 3 ]
                    },
                    text: '<i class="fas fa-solid fa-file-csv"></i> CSV',
                    className: 'btn btn-sm btn-success'
                },
                {
                    title: `Data Riwayat Lamaran Kerja`,
                    extend: 'print',
                    exportOptions: {
                        columns: [ 0, 1, 2, 3 ]
                    },
                    text: '<i class="fas fa-solid fa-print"></i> Print',
                    className: 'btn btn-sm btn-dark'
                },
                {
                    title: `Data Riwayat Lamaran Kerja`,
                    extend: 'copy',
                    exportOptions: {
                        columns: [ 0, 1, 2, 3 ]
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
            const response = await axios.get('get-app')
            
            this.level = level.data.data.level
            this.applicant = response.data.data

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
        async openInfo() {
            let dt = this.$refs.table.dt();
            let id = document.getElementById("idUser")
            let app = document.getElementById("idApp")

            dt.rows({ selected: true }).every(function () {
                id.value = this.data().user_id;
                app.value = this.data().id;
            })

            if(id.value) {
                try {
                    const response = await axios.get(`profile/${id.value}`)

                    this.cv = 'http://recruitment.test/docs/' + response.data.data.cv + '?version=1'
                    this.image = 'http://recruitment.test/images/' + response.data.data.image + '?version=1'

                    const value = await axios.get(`get-val/${app.value}`)
                    this.value = value.data.data.value

                    const applicantInfo = new Modal('#applicantInfo', {
                        keyboard: false
                    })

                    applicantInfo.show()
                } catch {
                    Swal.fire({
                        icon: "error",
                        title: "Failed!",
                        text: "Server error, silahkan muat ulang website!",
                    })
                }
            }
        },
        async accept() {
            let dt = this.$refs.table.dt();
            let id = document.getElementById("idApp")

            dt.rows({ selected: true }).every(function () {
                id.value = this.data().id;
            })

            if(id.value) {
                try {
                    Swal.fire({
                        title: 'Anda Yakin ingin menerima pelamar ini?',
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonColor: '#22bb33',
                        confirmButtonText: 'Yakin',
                        cancelButtonColor: '#d33',
                        reverseButtons: false,
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            axios.post(`receive-app/${id.value}`)
                            .then(res => {
                                Swal.fire({
                                    icon: "success",
                                    title: "Success!",
                                    text: res.data.message,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        this.render()
                                    }
                                })
                            })
                        } else {
                            this.render()
                        }
                    })
                } catch {
                    Swal.fire({
                        icon: "error",
                        title: "Failed!",
                        text: "Server error, silahkan muat ulang website!",
                    })
                }
            }
        },
        async restore() {
            let dt = this.$refs.table.dt();
            let id = document.getElementById("idApp")

            dt.rows({ selected: true }).every(function () {
                id.value = this.data().id;
            })

            if(id.value) {
                try {
                    Swal.fire({
                    title: 'Pulihkan lamaran menjadi pending?',
                    icon: 'question',
                    showCancelButton: true,
                    cancelButtonColor: '#22bb33',
                    confirmButtonText: 'Yakin',
                    confirmButtonColor: '#d33',
                    reverseButtons: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false
                    }).then((result) => {
                        if (result.isConfirmed) {
                            axios.post(`restore-app/${id.value}`)
                            .then(res => {
                                Swal.fire({
                                    icon: "success",
                                    title: "Success!",
                                    text: res.data.message,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        this.render()
                                    }
                                })
                            })
                        } else {
                            this.render()
                        }
                    })
                } catch {
                    Swal.fire({
                        icon: "error",
                        title: "Failed!",
                        text: "Server error, silahkan muat ulang website!",
                    })
                }
            }
        },
        async render(){
            try{
                const response = await axios.get('get-app')

                this.applicant = response.data.data

                let idApp = document.getElementById("idApp")
                let idUser = document.getElementById("idUser")
                idApp.value = null
                idUser.value = null

                Swal.close()
            } catch {
                Swal.close()

            }
        }
    },
    components: { DashboardNavbar, DashboardSidebar, DashboardFooter, DataTable }
}
</script>

<style>
@import 'datatables.net-bs5';
</style>