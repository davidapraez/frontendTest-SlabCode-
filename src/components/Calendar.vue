<template>
  <div class="calendar-container">
    <div class="calendar">
      <div class="header">
        <div v-for="day in days" :key="day" class="day">{{ day }}</div>
      </div>
      <div class="body">
        <div v-for="(week, index) in weeks" :key="index" class="week">
          <div
            v-for="day in week"
            :key="day.date"
            class="date"
            @click="selectDate(day.date)"
          >
            <div>{{ day.date }}</div>
            <div v-if="getReminders(day.date).length" class="reminders">
              <div
                v-for="reminder in getReminders(day.date)"
                :key="reminder.id"
                class="reminder"
              >
                <span
                  :style="{ backgroundColor: reminder.color }"
                  class="color-dot"
                ></span>
                {{ reminder.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ReminderForm :selectedDate="selectedDate" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useReminderStore } from "../store/reminderStore";
import { Reminder } from "../types/Reminder";
import dayjs from "dayjs";
import "dayjs/locale/es";
import ReminderForm from "./ReminderForm.vue";

dayjs.locale("es");

export default defineComponent({
  components: {
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

    const reminders = computed(() => reminderStore.reminders);

    function getReminders(date: number): Reminder[] {
      if (!date) return [];
      return reminders.value.filter(
        (reminder) =>
          dayjs(reminder.date).date() === date &&
          dayjs(reminder.date).month() === dayjs().month() &&
          dayjs(reminder.date).year() === dayjs().year()
      );
    }

    function selectDate(date: number) {
      selectedDate.value = date;
    }

    return {
      days,
      weeks,
      selectedDate,
      getReminders,
      selectDate,
    };
  },
});

function generateWeeks() {
  const weeks = [];
  let currentDay = dayjs().startOf("month").toDate();
  let endDay = dayjs().endOf("month").toDate();

  while (currentDay <= endDay) {
    let week = [];
    for (let i = 0; i < 7; i++) {
      if (dayjs(currentDay).month() === dayjs().month()) {
        week.push({ date: dayjs(currentDay).date() });
      } else {
        week.push({ date: 0 });
      }
      currentDay = dayjs(currentDay).add(1, "day").toDate();
    }
    weeks.push(week);
  }
  return weeks;
}
</script>
<style scoped>
.calendar-container {
  display: flex;
}
.calendar {
  flex: 2;
  display: grid;
  grid-template-rows: auto 1fr;
  overflow: hidden; /* Evita el desbordamiento */
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
  overflow-y: auto;
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
.reminders {
  margin-top: 5px;
}
.reminder {
  display: flex;
  align-items: center;
  margin: 2px 0;
}
.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
