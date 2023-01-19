<template>
    <div class="nav-fixed">
        <DashboardNavbar/>
        <div id="layoutSidenav">
            <DashboardSidebar/>
            <div id="layoutSidenav_content">
                <main>
                    <div class="container-xl px-4 mt-4">
                        <nav class="nav nav-borders">
                            <a class="nav-link active">Status</a>
                        </nav>
                        <hr class="mt-0 mb-4" />
                        <div class="card mb-4">
                            <div class="card-header">Status Lamaran</div>
                            <div class="card-body p-0">
                                <div class="table-responsive table-billing-history">
                                    <table class="table mb-0">
                                        <thead>
                                            <tr>
                                                <th class="border-gray-200" scope="col">ID Lamaran</th>
                                                <th class="border-gray-200 w-25" scope="col">Tanggal</th>
                                                <th class="border-gray-200 w-25" scope="col">Posisi</th>
                                                <th class="border-gray-200 w-25" scope="col">Nilai Tes</th>
                                                <th class="border-gray-200" scope="col">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(statuses, index) in status" :key="statuses.id">
                                                <td>{{ index + 1 }}</td>
                                                <td>{{ statuses.created_at }}</td>
                                                <td>{{ statuses.position }}</td>
                                                <td>{{ statuses.value }}</td>
                                                <td>
                                                    <div v-if="statuses.status == 'Accepted'">
                                                        <span class="badge bg-success text-light">{{ statuses.status }}</span> | 
                                                        <span @click.prevent="showMessage(statuses.id)">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                                        </span>
                                                    </div>
                                                    <span v-else-if="statuses.status == 'Rejected'" class="badge bg-danger text-light">{{ statuses.status }}</span>
                                                    <span v-else class="badge bg-light text-dark">{{ statuses.status }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <div class="modal fade" id="applicationInfo" tabindex="-1" aria-labelledby="applicationInfo" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="applicationInfo">Informasi Lamaran Kerja</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click.prevent="render()"></button>
                        </div>
                        <div class="modal-body tex-center">
                            <textarea id="message" class="form-control" cols="30" rows="10" v-model="message" readonly></textarea>
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

import axios from 'axios'
import Swal from 'sweetalert2'
import router from '@/router'
import { Modal } from 'bootstrap/dist/js/bootstrap.bundle.min'

import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue';
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue';

export default {
    data(){
        return{
            status: [],
            data: '',
            message: ''
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

            if(data.level != 'user') {
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

        const response = await axios.get('get-token')
        this.data = response.data.data

        try {
            const status = await axios.get('status/' + this.data.id)
            this.status = status.data.data

            Swal.close()
        } catch {
            Swal.close()
            router.go()
        }
    },
    mounted() {
        if(localStorage.getItem('reload')) {
            location.reload()
            localStorage.removeItem('reload');
        }
    },
    methods: {
        async showMessage(id) {
            try {
                const res = await axios.get(`get-message/${id}`)
                this.message = res.data.data.message

                const applicationInfo = new Modal('#applicationInfo', {
                    keyboard: false
                })

                applicationInfo.show()
            } catch {
                Swal.fire({
                    icon: "error",
                    title: "Failed!",
                    text: "Server error, silahkan muat ulang website!",
                })
            }
        },
        render(){
            this.message = ''
        }
    },
    components: { DashboardNavbar, DashboardSidebar, DashboardFooter }
}
</script>

<style scoped>
#message {
    resize: none !important;
}
</style>