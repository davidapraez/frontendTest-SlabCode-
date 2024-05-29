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
          @click="openAddReminderModal(day.date)"
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
    <div class="controls">
      <a-button type="primary" @click="openAddReminderModal"
        >Add New Reminder</a-button
      >
    </div>

    <ReminderForm :selected-date="selectedDate" v-if="isFormVisible" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useReminderStore } from "../store/reminderStore";
import { Reminder } from "../types/Reminder";
import ReminderForm from "./ReminderForm.vue";
import { Button } from "ant-design-vue";

export default defineComponent({
  components: {
    "a-button": Button,
    ReminderForm,
  },
  setup() {
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

    const selectedDate = ref<number | null>(null);
    const isFormVisible = ref(false);

    function getReminders(date: number): Reminder[] {
      return reminderStore.getRemindersByDate(date);
    }

    function openAddReminderModal(date?: number) {
      selectedDate.value = date || new Date().getDate();
      isFormVisible.value = true;
    }

    return {
      days,
      weeks,
      getReminders,
      openAddReminderModal,
      selectedDate,
      isFormVisible,
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
  display: grid;
  grid-template-rows: auto 1fr;
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
.controls {
  margin-top: 20px;
  text-align: center;
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
