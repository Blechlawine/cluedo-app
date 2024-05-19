import { defineStore } from "pinia";
import { type QuestionInput, type QuestionOutput, QuestionValidator } from "../types/validators";
import { ref } from "vue";

const useQuestions = defineStore(
    "questions",
    () => {
        const questions = ref<QuestionOutput[]>([]);

        function getByID(id: string): QuestionOutput | undefined {
            return questions.value.find((q) => q.id === id);
        }

        function upsert(question: QuestionInput) {
            const parsed = QuestionValidator.safeParse(question);
            if (parsed.success) {
                const data = parsed.data;
                const temp = questions.value.find((q) => q.id === data.id);
                if (temp) {
                    Object.assign(temp, data);
                } else {
                    questions.value.push(data);
                }
            }
        }

        function deleteByID(id: string) {
            questions.value = questions.value.filter((q) => q.id !== id);
        }

        return {
            questions,
            getByID,
            upsert,
            deleteByID,
        };
    },
    {
        persist: true,
    },
);
export default useQuestions;
