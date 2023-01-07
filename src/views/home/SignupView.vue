<template>
    <section class="page-section" id="contact">
        <div class="container px-4 px-lg-5">
            <div class="row gx-4 gx-lg-5 justify-content-center">
                <div class="col-lg-8 col-xl-6 text-center">
                    <h2 class="mt-0">Signup</h2>
                    <hr class="divider" />
                    <p class="text-muted mb-5">Daftar untuk menjadi bagian dari kami!</p>
                </div>
            </div>
            <div class="row gx-4 gx-lg-5 justify-content-center mb-5">
                <div class="col-lg-6">
                    <form id="contactForm" @submit.prevent="submitForm">
                        <div class="form-floating mb-3">
                            <input class="form-control" id="name" type="text" placeholder="Masukkan Username atau Email" v-model="username" required/>
                            <label for="name">Username</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input class="form-control" id="email" type="email" placeholder="name@example.com" v-model="email" required/>
                            <label for="email">Email address</label>
                        </div>
                        <div class="form-floating mb-3">
                            <MazPhoneNumberInput
                                v-model="phone"
                                fetch-country
                                show-code-on-list
                                color="info"
                                :preferred-countries="['ID', 'FR', 'BE', 'DE', 'US', 'GB']"
                                :ignored-countries="['AC']"
                            />
                            <label for="phone">Phone number</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input class="form-control" id="pass" type="password" placeholder="Masukkan Password" v-model="password" required/>
                            <label for="name">Password</label>
                        </div>
                        <div class="form-floating mb-3">
                            <input class="form-control" id="passConfirm" type="password" placeholder="Masukkan Password" v-model="password_confirm" required/>
                            <label for="name">Password Confirm</label>
                        </div>
                        <div class="d-grid"><button type="submit" class="btn btn-primary btn-xl" id="submitButton">Daftar</button></div>
                    </form>
                </div>
            </div>
            <div class="row gx-4 gx-lg-5 justify-content-center">
                <div class="col-lg-4 text-center mb-5 mb-lg-0">
                    <p>Sudah Terdaftar? <router-link to="/login">Login</router-link></p>
                    <i class="bi-phone fs-2 mb-3 text-muted"></i>
                    <div>+62 8xx xxx xxx</div>
                    <div class="d-grid"><router-link to="/" class="btn btn-primary btn-sm mt-3">Kembali ke Beranda</router-link></div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    import '@/load/home'
    
    import router from '@/router'
    import axios from 'axios'
    import Swal from 'sweetalert2'

    import MazPhoneNumberInput from 'maz-ui/components/MazPhoneNumberInput'


    export default {
        data() {
            return {
                username: '',
                email: '',
                phone: '',
                password: '',
                password_confirm: '',
            }
        },
        methods: {
            async submitForm() {
                if (this.password == this.password_confirm) {
                    try {
                        const response = await axios.post('user', {
                            name: this.username,
                            email: this.email,
                            level: 'user',
                            phone_number: this.phone,
                            password: this.password_confirm,
                        })
        
                        Swal.fire({
                            icon: 'success',
                            title: response.data.status,
                            text: response.data.message,
                        })
        
                        router.push({
                            name: 'Login',
                        })
                    } catch (e) {
                        Swal.fire({
                            icon: 'error',
                            title: e.response.data.status,
                            text: e.response.data.message,
                        })
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "Password doesn't match",
                    })
                }
            },
        },
        components: {
            MazPhoneNumberInput
        },
    }
</script>

<style scoped>
@import 'maz-ui/css/main.css';
</style>