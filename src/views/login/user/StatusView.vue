<template>
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
                                            <th class="border-gray-200" scope="col">Tanggal</th>
                                            <th class="border-gray-200" scope="col">Posisi</th>
                                            <th class="border-gray-200" scope="col">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(statuses, index) in status" :key="statuses.id">
                                            <td>{{ index + 1 }}</td>
                                            <td>{{ statuses.created_at }}</td>
                                            <td>{{ statuses.position }}</td>
                                            <td><span class="badge bg-light text-dark">{{ statuses.status }}</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <DashboardFooter/>
        </div>
    </div>
</template>

<script>
import '@/load/login'

import axios from 'axios'
import Swal from 'sweetalert2'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue';
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue';

export default {
    data(){
        return{
            status: [],
            data: ''
        }
    },
    async created() {
        Swal.fire({
            title: 'Loading Data!',
            didOpen: () => {
                Swal.showLoading();
            },
        });

        const response = await axios.get('user')
        this.data = response.data.data

        try {
            const status = await axios.get('status/' + this.data.id)
            this.status = status.data.data
            Swal.close();
        } catch {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Server error, silahkan muat ulang website!",
            })
        }
    },
    components: { DashboardNavbar, DashboardSidebar, DashboardFooter }
}
</script>

<style>

</style>