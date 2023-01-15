<template>
    <div id="app">
        <div class="app">
            <QuestionBox
                v-if="questions.length"
                :currentQuestion="questions[index]"
                :next="next"
                :increment="increment"
                :numCorrect="numCorrect"
                :total="questionTotal"
            />
        </div>
    </div>
</template>
  
<script>
import axios from 'axios'
import Swal from 'sweetalert2'
import router from '@/router'

import QuestionBox from '@/components/QuestionBox.vue'

export default {
    data() {
        return{
            questions: [],
            index: 0,
            numCorrect: 0,
            questionTotal: 0,
            shouldPrevent: false
        }
    },
    beforeMount() {
        window.addEventListener('beforeunload', this.unload)
    },
    beforeUnmount() {
        window.removeEventListener('beforeunload', this.unload)
    },
    async created() {
        delete axios.defaults.headers.common["Authorization"];
        const res = await axios.get("https://opentdb.com/api.php?amount=3&category=19&type=multiple")

        let resp = JSON.stringify(res.data.results).replace(/&quot;/g,'`').replace(/&#039;/g, '`');
        this.questions = JSON.parse(resp)
        this.questionTotal = Object.keys(JSON.parse(resp)).length
    },
    methods: {
        unload(e) {
            if(!this.shouldPrevent) {
                e.preventDefault()
                e.returnValue = ""
            }
        },
        async next() {
            let questionLength = this.questions.length - 1
            if(this.index >= questionLength) {
                const res = await axios.get(`job/${this.$route.params.job}`)
                let minVal = res.data.data.minimum_value
                let val = Math.round(this.numCorrect * (100/this.questionTotal))

                if(val > minVal) {
                    try {
                        const input = await axios.post('status', {
                            user_id: this.$route.params.id,
                            job_id: this.$route.params.job,
                            value: val
                        })

                        if(input) {
                            Swal.fire({
                                icon: "success",
                                title: "Success!",
                                text: "Pendaftaran berhasil, mohon menunggu untuk hasilnya!",
                                allowEscapeKey: false,
                                allowOutsideClick: false
                            }).then((result) => {
                                if(result.isConfirmed) {
                                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')

                                    localStorage.setItem('reload', '1')

                                    router.push({
                                        name: 'Status'
                                    })
                                }
                            })
                        } else {
                            Swal.fire({
                                icon: "error",
                                title: "Error!",
                                text: "Server error, silahkan muat ulang website!",
                            })
                        }
                    } catch {
                        Swal.fire({
                            icon: "error",
                            title: "Error!",
                            text: "Server error, silahkan muat ulang website!",
                        })
                    }
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: "Maaf anda gagal, nilai anda tidak memenuhi syarat!",
                        allowEscapeKey: false,
                        allowOutsideClick: false
                    }).then((result) => {
                        if(result.isConfirmed) {
                            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
                            
                            localStorage.setItem('reload', '1')

                            router.push({
                                name: 'Vacancy'
                            })
                        }
                    })
                }
            } else {
                this.index++
            }
        },
        increment(isCorrect) {
            if (isCorrect) {
                this.numCorrect++
            }
        }
    },
    components: { QuestionBox }
}
</script>

<style>
    * {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Montserrat', sans-serif;
    }
    body {
        background-color: #271c36;
        color: #FFF;
    }
    .app {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        height: 100vh;
    }
    h1 {
        font-size: 2rem;
        margin-bottom: 2rem;
    }
</style>