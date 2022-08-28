import { defineStore } from "pinia";
import { QuestionInput, QuestionOutput, QuestionValidator } from "../types/validators";
interface IState {
    questions: QuestionOutput[];
}
type TGetters = {
    getByID: (state: IState) => (id: string) => QuestionOutput | undefined;
};
interface IActions {
    upsert: (question: QuestionInput) => void;
    deleteByID: (id: string) => void;
}
const useQuestions = defineStore<"questions", IState, TGetters, IActions>("questions", {
    state: () => ({
        questions: [],
    }),
    persist: true,
    getters: {
        getByID: (state) => (id) => state.questions.find((q) => q.id === id),
    },
    actions: {
        upsert(question) {
            const parsed = QuestionValidator.safeParse(question);
            if (parsed.success) {
                const data = parsed.data;
                let temp = this.questions.find((q) => q.id === data.id);
                if (temp) {
                    Object.assign(temp, data);
                } else {
                    this.questions.push(data);
                }
            }
        },
        deleteByID(id) {
            this.questions = this.questions.filter((q) => q.id !== id);
        },
    },
});
export default useQuestions;
