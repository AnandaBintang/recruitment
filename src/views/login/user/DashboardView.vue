<template>
    <DashboardNavbar/>
    <div id="layoutSidenav">
        <DashboardSidebar/>
        <div id="layoutSidenav_content">
            <main>
                <header class="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
                    <div class="container-xl px-4">
                        <div class="page-header-content pt-4">
                            <div class="row align-items-center justify-content-between">
                                <div class="col-auto mt-4">
                                    <h1 class="page-header-title">
                                        <div class="page-header-icon"><i data-feather="activity"></i></div>
                                        Dashboard
                                    </h1>
                                    <div class="page-header-subtitle">Example dashboard overview and content summary</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>
                <!-- Main page content-->
                <div class="container-xl px-4 mt-n10">
                    <div class="row">
                        <div class="col-xl-4 mb-4">
                            <!-- Dashboard example card 1-->
                            <router-link to="/profile" class="card lift h-100" href="#!">
                                <div class="card-body d-flex justify-content-center flex-column">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="me-3">
                                            <i class="feather-xl text-primary mb-3" data-feather="package"></i>
                                            <h5>Data Diri</h5>
                                            <!-- <div class="text-muted small">To create informative visual elements on your pages</div> -->
                                        </div>
                                        <img src="@/assets/img/illustrations/browser-stats.svg" alt="..." style="width: 8rem" />
                                    </div>
                                </div>
                            </router-link>
                        </div>
                        <div class="col-xl-4 mb-4">
                            <!-- Dashboard example card 2-->
                            <router-link to="/vacancy" class="card lift h-100" href="#!">
                                <div class="card-body d-flex justify-content-center flex-column">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="me-3">
                                            <i class="feather-xl text-secondary mb-3" data-feather="book"></i>
                                            <h5>Lowongan Pekerjaan</h5>
                                            <!-- <div class="text-muted small">To keep you on track when working with our toolkit</div> -->
                                        </div>
                                        <img src="@/assets/img/illustrations/processing.svg" alt="..." style="width: 8rem" />
                                    </div>
                                </div>
                            </router-link>
                        </div>
                        <div class="col-xl-4 mb-4">
                            <!-- Dashboard example card 3-->
                            <router-link to="/status" class="card lift h-100" href="#!">
                                <div class="card-body d-flex justify-content-center flex-column">
                                    <div class="d-flex align-items-center justify-content-between">
                                        <div class="me-3">
                                            <i class="feather-xl text-green mb-3" data-feather="layout"></i>
                                            <h5>Lamaran</h5>
                                            <!-- <div class="text-muted small">To help get you started when building your new UI</div> -->
                                        </div>
                                        <img src="@/assets/img/illustrations/windows.svg" alt="..." style="width: 8rem" />
                                    </div>
                                </div>
                            </router-link>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-xxl-8">
                            <div class="card mb-4">
                                <div class="card-body py-5">
                                    <div class="d-flex flex-column justify-content-center">
                                        <img class="img-fluid mb-4" src="@/assets/img/illustrations/data-report.svg" alt="" style="height: 10rem" />
                                        <div class="text-center px-0 px-lg-5">
                                            <h5>New reports are here! Generate custom reports now!</h5>
                                            <p class="mb-4">Our new report generation system is now online. You can start creating custom reporting for any documents available on your account.</p>
                                            <a class="btn btn-primary p-3" href="#!">Get Started</a>
                                        </div>
                                    </div>
                                </div>
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

import DashboardNavbar from '@/components/dashboard/DashboardNavbar.vue'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar.vue'
import DashboardFooter from '@/components/dashboard/DashboardFooter.vue'

export default {
    components: {
        DashboardNavbar,
        DashboardSidebar,
        DashboardFooter
    },
    mounted() {
        if(localStorage.getItem('reload')) {
            location.reload()
            localStorage.removeItem('reload');
        }
    }
}
</script>

<style>

</style>