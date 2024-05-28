import { createStore } from "vuex";
import { Reminder } from "../types/Reminder";

interface State {
  reminders: Reminder[];
}

export default createStore<State>({
  state: {
    reminders: [],
  },
  mutations: {
    addReminder(state, reminder: Reminder) {
      state.reminders.push(reminder);
    },
    deleteReminder(state, reminderId: number) {
      state.reminders = state.reminders.filter(
        (reminder) => reminder.id !== reminderId
      );
    },
  },
  actions: {
    addReminder({ commit }, reminder: Reminder) {
      commit("addReminder", reminder);
    },
    deleteReminder({ commit }, reminderId: number) {
      commit("deleteReminder", reminderId);
    },
  },
  getters: {
    reminders: (state) => state.reminders,
  },
});
