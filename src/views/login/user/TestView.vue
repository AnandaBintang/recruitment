<template>
    <div id="app">
        <div class="app">
            <QuestionBox
                v-if="questions.length"
                :currentQuestion="questions[index]"
                :next="next"
                :increment="increment"
                :numCorrect="numCorrect"
                :numTotal="numTotal"
            />
        </div>
    </div>
</template>
  
<script>
import axios from 'axios'

import QuestionBox from '@/components/QuestionBox.vue'

export default {
    data() {
        return{
            questions: [],
            index: 0,
            numCorrect: 0,
            numTotal: 0
        }
    },
    mounted() {
        window.addEventListener('beforeunload', () => {
            event.preventDefault()
            event.returnValue = ""
        })
    },
    async created() {
        delete axios.defaults.headers.common["Authorization"];
        const res = await axios.get("https://opentdb.com/api.php?amount=10&category=27&type=multiple")

        let resp = JSON.stringify(res.data.results).replace(/&quot;/g,'`').replace(/&#039;/g, '`');
        this.questions = JSON.parse(resp)
    },
    methods: {
        next() {
            let questionLength = this.questions.length - 1
            if(this.index >= questionLength) {
                alert('you completed the test, your point is ' + this.numCorrect * 10)
            } else {
                this.index++
            }
        },
        increment(isCorrect) {
            if (isCorrect) {
                this.numCorrect++
            }
            this.numTotal++
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
    .quiz {
        background-color: #382a4b;
        padding: 1rem;
        width: 100%;
        max-width: 640px;
    }
    .quiz-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
    }
    .quiz-info .question {
        color: #8F8F8F;
        font-size: 1.25rem;
    }
    .quiz-info.score {
        color: #FFF;
        font-size: 1.25rem;
    }
    .options {
        margin-bottom: 1rem;
    }
    .option {
        padding: 1rem;
        display: block;
        background-color: #271c36;
        margin-bottom: 0.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
    }
    .option:hover {
        /* background-color: #2d213f; */
        opacity: 0.5;
    }
    .selected {
        background-color: #7f57b3;
    }
    .correct {
        background-color: #2cce7d;
    }
    .incorrect {
        background-color: #ff5a5f;
    }
    .option:last-of-type {
        margin-bottom: 0;
    }
    .option.disabled {
        opacity: 0.5;
    }
    .btn-success {
        appearance: none;
        outline: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem 1rem;
        background-color: #00ef80;
        color: #2d213f;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 1.2rem;
        border-radius: 0.5rem;
    }
    .btn-success:hover:enabled {
        background-color: #00a659;
    }
    .btn-primary {
        appearance: none;
        outline: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem 1rem;
        background-color: #6610f2;
        color: #2d213f;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 1.2rem;
        border-radius: 0.5rem;
    }
    .btn-primary:hover:enabled {
        background-color: #4400b0;
    }
    .btn-secondary {
        appearance: none;
        outline: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem 1rem;
        background-color: #adb5bd;
        color: #2d213f;
        font-weight: 700;
        text-transform: uppercase;
        font-size: 1.2rem;
        border-radius: 0.5rem;
    }
    button:disabled {
        opacity: 0.5;
    }
    h2 {
        font-size: 2rem;
        margin-bottom: 2rem;
        text-align: center;
    }
    p {
        color: #8F8F8F;
        font-size: 1.5rem;
        text-align: center;
    }
</style>