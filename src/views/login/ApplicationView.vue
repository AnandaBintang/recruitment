<template>
    <DashboardNavbar/>
    <div id="layoutSidenav">
        <DashboardSidebar/>
        <div id="layoutSidenav_content">
            <main>
                <div class="container-xl px-4 mt-4">
                    <nav class="nav nav-borders">
                        <a class="nav-link active">Lowongan</a>
                    </nav>
                    <hr class="mt-0 mb-4" />
                    <div class="card mb-4">
                        <div class="card-header">Lowongan Pekerjaan</div>
                        <div class="card-body p-0">
                            <div class="table-responsive table-billing-history">
                                <form>
                                    <table class="table mb-0">
                                        <thead>
                                            <tr>
                                                <th class="border-gray-200" scope="col">#</th>
                                                <th class="border-gray-200" scope="col">Pelamar</th>
                                                <th class="border-gray-200" scope="col">Posisi</th>
                                                <th class="border-gray-200" scope="col">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>Ananda Bintang</td>
                                                <td>Marketing</td>
                                                <td>
                                                    <button class="btn btn-success btn-xs" type="submit">Terima</button>
                                                    <button class="btn btn-danger btn-xs" type="submit">Tolak</button>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </form>
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

import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue';
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue';

export default {
    components: { DashboardNavbar, DashboardSidebar, DashboardFooter }
}
</script>

<style>

</style>