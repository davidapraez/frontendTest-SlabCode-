import { computed, ref } from "vue";
import { useStore } from "vuex";
import { Reminder } from "../types/Reminder";

export function useCalendar() {
  const store = useStore();
  const days = ref([
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]);

  const weeks = computed(() => {
    const weeks = [];
    let currentDay = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    let endDay = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );

    while (currentDay <= endDay) {
      let week = [];
      for (let i = 0; i < 7; i++) {
        week.push({
          date: currentDay.getDate(),
        });
        currentDay.setDate(currentDay.getDate() + 1);
      }
      weeks.push(week);
    }
    return weeks;
  });

  const reminders = computed(() => store.getters.reminders);

  function addReminder(reminder: Reminder) {
    store.dispatch("addReminder", reminder);
  }

  function deleteReminder(reminderId: number) {
    store.dispatch("deleteReminder", reminderId);
  }

  return {
    days,
    weeks,
    reminders,
    addReminder,
    deleteReminder,
  };
}
