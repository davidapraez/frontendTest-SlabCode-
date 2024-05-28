<template>
  <div class="calendar">
    <div class="header">
      <div v-for="day in days" :key="day" class="day">{{ day }}</div>
    </div>
    <div class="body">
      <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="week">
        <div v-for="day in week" :key="day.date" class="date">
          <span v-if="day.date !== 0">{{ day.date }}</span>
          <div v-for="reminder in getReminders(day.date)" :key="reminder.id">
            {{ reminder.text }}
          </div>
          <button v-if="day.date !== 0" @click="addTestReminder(day.date)">
            Add Reminder
          </button>
        </div>
      </div>
    </div>
    <div class="controls">
      <button @click="addTestReminder(randomDate())">
        Add Random Test Reminder
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useCalendar } from "../hooks/useCalendar";
import { Reminder } from "../types/Reminder";

export default defineComponent({
  setup() {
    const { days, weeks, reminders, addReminder, deleteReminder } =
      useCalendar();

    function getReminders(date: number): Reminder[] {
      if (date === 0) return []; // No mostrar recordatorios en días vacíos
      return reminders.value.filter(
        (reminder: Reminder) => reminder.date === date
      );
    }

    function addTestReminder(date: number) {
      const newReminder: Reminder = {
        id: Math.random(),
        text: "Test Reminder",
        date: date,
        city: "Test City",
      };
      addReminder(newReminder);
    }

    function randomDate(): number {
      return Math.floor(Math.random() * 31) + 1;
    }

    return {
      days,
      weeks,
      getReminders,
      addReminder,
      deleteReminder,
      addTestReminder,
      randomDate,
    };
  },
});
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
}
.controls {
  margin-top: 20px;
  text-align: center;
}
</style>
