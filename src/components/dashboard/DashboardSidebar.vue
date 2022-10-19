<template>
    <div id="layoutSidenav_nav">
        <nav class="sidenav shadow-right sidenav-light">
            <div class="sidenav-menu">
                <div class="nav accordion" id="accordionSidenav">
                    <div class="sidenav-menu-heading d-sm-none">Account</div>
                    <a class="nav-link d-sm-none" href="#!">
                        <div class="nav-link-icon"><i data-feather="bell"></i></div>
                        Alerts
                        <span class="badge bg-warning-soft text-warning ms-auto">4 New!</span>
                    </a>
                    <a class="nav-link d-sm-none" href="#!">
                        <div class="nav-link-icon"><i data-feather="mail"></i></div>
                        Messages
                        <span class="badge bg-success-soft text-success ms-auto">2 New!</span>
                    </a>
                    <div class="sidenav-menu-heading">Home</div>
                    <router-link v-if="data.level == 1" class="nav-link" active-class="active" to="/adminboard">
                        <div class="nav-link-icon"><i data-feather="grid"></i></div>
                        Dashboard
                    </router-link>
                    <router-link v-else class="nav-link" active-class="active" to="/dashboard">
                        <div class="nav-link-icon"><i data-feather="grid"></i></div>
                        Dashboard
                    </router-link>
                    <div class="sidenav-menu-heading">Pages</div>
                    <div v-if="data.level == 1">
                        <router-link class="nav-link" active-class="active" to="/application">
                            <div class="nav-link-icon"><i data-feather="grid"></i></div>
                            Lamaran Kerja
                        </router-link>
                    </div>
                    <div v-else>
                        <router-link class="nav-link" active-class="active" to="/profile">
                        <div class="nav-link-icon"><i data-feather="grid"></i></div>
                        Data Diri
                        </router-link>
                        <router-link class="nav-link" active-class="active" to="/vacancy">
                            <div class="nav-link-icon"><i data-feather="grid"></i></div>
                            Lowongan
                        </router-link>
                        <router-link class="nav-link" active-class="active" to="/status">
                            <div class="nav-link-icon"><i data-feather="grid"></i></div>
                            Status Lamaran
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="sidenav-footer">
                <div class="sidenav-footer-content">
                    <div class="sidenav-footer-subtitle">Logged in as:</div>
                    <div class="sidenav-footer-title">{{ data.name }}</div>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
export default {
    data: function() {
        return {
            data: JSON.parse(localStorage.getItem('user'))
        }
    },
}
</script>

<style>

</style>