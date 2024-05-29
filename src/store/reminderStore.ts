import { defineStore } from "pinia";
import { Reminder } from "../types/Reminder";

interface ReminderState {
  reminders: Reminder[];
}

export const useReminderStore = defineStore("reminder", {
  state: (): ReminderState => ({
    reminders: [],
  }),
  getters: {
    getRemindersByDate: (state) => {
      return (date: number) =>
        state.reminders.filter(
          (reminder) => new Date(reminder.date).getDate() === date
        );
    },
  },
  actions: {
    addReminder(reminder: Reminder) {
      this.reminders.push(reminder);
    },
    updateReminder(updatedReminder: Reminder) {
      const index = this.reminders.findIndex(
        (reminder) => reminder.id === updatedReminder.id
      );
      if (index !== -1) {
        this.reminders[index] = updatedReminder;
      }
    },
    deleteReminder(reminderId: number) {
      this.reminders = this.reminders.filter(
        (reminder) => reminder.id !== reminderId
      );
    },
  },
});
