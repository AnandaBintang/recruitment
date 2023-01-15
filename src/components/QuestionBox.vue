<template>
	<h1>The Quiz</h1>

    <section class="quiz">
        <div class="quiz-info">
            <span class="question">{{ currentQuestion.question }}</span>
            <span class="score">Score Point: {{ numCorrect }}/{{ total }}</span>
        </div>

        <ul class="options">
            <li
            v-for="(answer, index) in shuffledAnswers"
            :key="index"
            @click.prevent="selectAnswer(index)"
            class="option"
            :class="answerClass(index)"
            >
                {{ answer }}
            </li>
        </ul>
        
        <button
            class="btn-success"
            @click="submitAnswer()"
            :disabled="selectedIndex === null || answered"
        >
            Submit
        </button>
        |
        <button
            class="btn-primary"
            @click="next()"
            :disabled="!answered"
        >
            Next
        </button>
    </section>
</template>

<script>
import _ from 'lodash'
export default {
    props: {
        currentQuestion: Object,
        next: Function,
        prev: Function,
        increment: Function,
        numCorrect: Number,
        total: Number
    },
    data() {
        return {
            selectedIndex: null,
            correctIndex: null,
            shuffledAnswers: [],
            answered: false
        }
    },
    watch: {
        currentQuestion: {
            immediate: true,
            handler() {
                this.selectedIndex = null
                this.answered = false
                this.shuffleAnswers()
            }
        }
    },
    methods: {
        selectAnswer(index) {
            this.selectedIndex = index
        },
        submitAnswer() {
            let isCorrect = false
            if (this.selectedIndex === this.correctIndex) {
                isCorrect = true
            }
            this.answered = true
            this.increment(isCorrect)
        },
        shuffleAnswers() {
            let answers = [...this.currentQuestion.incorrect_answers, this.currentQuestion.correct_answer]
            this.shuffledAnswers = _.shuffle(answers)
            this.correctIndex = this.shuffledAnswers.indexOf(this.currentQuestion.correct_answer)
        },
        answerClass(index) {
            let answerClass = ''
            if (!this.answered && this.selectedIndex === index) {
                answerClass = 'selected'
            } else if (this.answered && this.correctIndex === index) {
                answerClass = 'correct'
            } else if (this.answered &&
                this.selectedIndex === index &&
                this.correctIndex !== index
            ) {
                answerClass = 'incorrect'
            }
            return answerClass
        }
    }
}
</script>

<style scoped>
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