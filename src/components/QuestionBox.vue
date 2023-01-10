<template>
	<h1>The Quiz</h1>

    <section class="quiz">
        <div class="quiz-info">
            <span class="question">{{ currentQuestion.question }}</span>
            <span class="score">Score Point: {{ numCorrect }}/{{ numTotal }}</span>
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
        numTotal: Number
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
</style>