<template>
    <div id="layoutSidenav_nav">
        <nav class="sidenav shadow-right sidenav-light">
            <div class="sidenav-menu">
                <div class="nav accordion" id="accordionSidenav">
                    <div class="sidenav-menu-heading">Home</div>
                    <router-link class="nav-link" active-class="active" to="/dashboard">
                        <div class="nav-link-icon"><VueFeather type="activity"></VueFeather></div>
                        Dashboard
                    </router-link>
                    <div class="sidenav-menu-heading">Pages</div>
                    <div v-if="data.level == 'admin' || data.level == 'hrd' || data.level == 'direktur'">
                        <router-link class="nav-link" active-class="active" to="/vacancy-list">
                            <div class="nav-link-icon"><VueFeather type="briefcase"></VueFeather></div>
                            Lowongan
                        </router-link>
                        <router-link class="nav-link" active-class="active" to="/application">
                            <div class="nav-link-icon"><VueFeather type="archive"></VueFeather></div>
                            Lamaran
                        </router-link>
                        <a class="nav-link" :class="{ collapsed: collapsed }" href="#" data-bs-toggle="collapse" data-bs-target="#collapseAccount" aria-expanded="false" aria-controls="collapseAccount">
                            <div class="nav-link-icon"><VueFeather type="users"></VueFeather></div>
                            Akun
                            <div class="sidenav-collapse-arrow"><i class="fas fa-angle-down"></i></div>
                        </a>
                        <div class="collapse" :class="{ show: !collapsed }" id="collapseAccount" data-bs-parent="#accordionSidenav">
                            <nav class="sidenav-menu-nested nav accordion" id="accordionSidenavPages">
                                <router-link class="nav-link" active-class="active" to="/account/admin">Admin</router-link>
                                <router-link class="nav-link" active-class="active" to="/account/direktur">Direktur</router-link>
                                <router-link class="nav-link" active-class="active" to="/account/hrd">HRD</router-link>
                                <router-link class="nav-link" active-class="active" to="/account/user">User</router-link>
                            </nav>
                        </div>
                    </div>
                    <div v-if="data.level == 'user'">
                        <router-link class="nav-link" active-class="active" to="/profile">
                            <div class="nav-link-icon"><VueFeather type="user"></VueFeather></div>
                            Data Diri
                        </router-link>
                        <router-link class="nav-link" active-class="active" to="/vacancy">
                            <div class="nav-link-icon"><VueFeather type="briefcase"></VueFeather></div>
                            Lowongan
                        </router-link>
                        <router-link class="nav-link" active-class="active" to="/status">
                            <div class="nav-link-icon"><VueFeather type="info"></VueFeather></div>
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
import axios from 'axios'
import VueFeather from 'vue-feather';

export default {
    data: function() {
        return {
            data: '',
            collapsed: true,
            route: this.$route.name,
        }
    },
    async created() {
        const response = await axios.get('get-token')
        this.data = response.data.data

        if(this.route == 'Account') {
            this.collapsed = false
        }
    },
    components: {
        VueFeather
    },
}
</script>

<style>

</style>