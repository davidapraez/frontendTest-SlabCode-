<template>
  <div class="calendar">
    <div class="header">
      <div v-for="day in days" :key="day" class="day">{{ day }}</div>
    </div>
    <div class="body">
      <div v-for="week in weeks" :key="week[0].date" class="week">
        <div
          v-for="day in week"
          :key="day.date"
          class="date"
          @click="selectDate(day.date)"
        >
          {{ day.date !== 0 ? day.date : "" }}
          <ul v-if="day.date !== 0" class="reminders-list">
            <li
              v-for="reminder in getReminders(day.date)"
              :key="reminder.id"
              class="reminder-item"
            >
              <span
                :style="{ backgroundColor: reminder.color }"
                class="color-dot"
              ></span>
              {{ reminder.text }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useReminderStore } from "../store/reminderStore";
import { Reminder } from "../types/Reminder";

export default defineComponent({
  setup(_, { emit }) {
    const reminderStore = useReminderStore();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const weeks = ref(generateWeeks());

    function getReminders(date: number): Reminder[] {
      return reminderStore.getRemindersByDate(date);
    }

    function selectDate(date: number) {
      if (date !== 0) {
        emit("select-date", date);
      }
    }

    return {
      days,
      weeks,
      getReminders,
      selectDate,
    };
  },
});

function generateWeeks() {
  const weeks = [];
  let currentDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  let endDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  while (currentDay <= endDay) {
    let week = [];
    for (let i = 0; i < 7; i++) {
      if (currentDay.getMonth() === new Date().getMonth()) {
        week.push({ date: currentDay.getDate() });
      } else {
        week.push({ date: 0 });
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}
</script>

<style scoped>
.calendar {
  width: 100%;
}
.header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #3f51b5;
  color: white;
}
.day {
  padding: 10px;
  text-align: center;
}
.body {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
}
.week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
.date {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
  position: relative;
}
.color-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}
.reminders-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.reminder-item {
  display: flex;
  align-items: center;
}
</style>
