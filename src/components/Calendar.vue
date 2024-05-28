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
          <a-button
            v-if="day.date !== 0"
            type="primary"
            @click="openAddReminderModal(day.date)"
          >
            Add Reminder
          </a-button>
        </div>
      </div>
    </div>
    <div class="controls">
      <a-button type="primary" @click="openAddReminderModal"
        >Add New Reminder</a-button
      >
    </div>

    <a-modal
      v-model:visible="isModalOpen"
      title="Add New Reminder"
      @ok="addNewReminder"
      @cancel="closeAddReminderModal"
    >
      <a-form @submit.prevent="addNewReminder">
        <a-form-item label="Date" required>
          <a-date-picker v-model:value="newReminder.date" />
        </a-form-item>
        <a-form-item label="Time" required>
          <a-time-picker v-model:value="newReminder.time" format="HH:mm" />
        </a-form-item>
        <a-form-item label="Reminder (max 30 chars)" required>
          <a-input v-model:value="newReminder.text" maxlength="30" />
        </a-form-item>
        <a-form-item label="City" required>
          <a-input v-model:value="newReminder.city" />
        </a-form-item>
        <a-form-item label="Color" required>
          <input type="color" v-model="newReminder.color" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useReminderStore } from "../store/reminderStore";
import { Reminder } from "../types/Reminder";

import {
  DatePicker,
  TimePicker,
  Button,
  Modal,
  Form,
  FormItem,
  Input,
} from "ant-design-vue";

export default defineComponent({
  components: {
    "a-date-picker": DatePicker,
    "a-time-picker": TimePicker,
    "a-button": Button,
    "a-modal": Modal,
    "a-form": Form,
    "a-form-item": FormItem,
    "a-input": Input,
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

    const isModalOpen = ref(false);
    const newReminder = ref({
      date: null,
      time: null,
      text: "",
      city: "",
      color: "#000000", // Añadir color por defecto
    });

    function getReminders(date: number): Reminder[] {
      if (date === 0) return [];
      return reminderStore.getRemindersByDate(date);
    }

    function openAddReminderModal(date?: number) {
      if (date) {
        newReminder.value.date = new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          date
        );
      } else {
        newReminder.value.date = new Date(); // Configura la fecha actual por defecto
      }
      isModalOpen.value = true;
    }

    function closeAddReminderModal() {
      isModalOpen.value = false;
    }

    function addNewReminder() {
      const reminderDate = newReminder.value.date;
      const reminderTime = newReminder.value.time;
      const date = new Date(
        reminderDate.getFullYear(),
        reminderDate.getMonth(),
        reminderDate.getDate(),
        reminderTime.getHours(),
        reminderTime.getMinutes()
      ).getTime();

      const newReminderObj: Reminder = {
        id: Math.random(),
        text: newReminder.value.text,
        date,
        city: newReminder.value.city,
        color: newReminder.value.color,
      };

      reminderStore.addReminder(newReminderObj);
      closeAddReminderModal();
    }

    return {
      days,
      weeks,
      getReminders,
      addNewReminder,
      openAddReminderModal,
      closeAddReminderModal,
      isModalOpen,
      newReminder,
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
</style>
