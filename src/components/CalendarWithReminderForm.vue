<template>
  <div class="calendar-with-reminder-form" @click="handleClickOutside">
    <div class="calendar-container" @click.stop>
      <a-card hoverable>
        <template #title> Calendar </template>
        <Calendar @select-date="handleSelectDate" />
      </a-card>
    </div>
    <div v-if="isFormVisible" class="reminder-form-container" @click.stop>
      <a-card hoverable>
        <template #title> Reminder </template>
        <ReminderForm :selected-date="selectedDate" />
      </a-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Calendar from "./Calendar.vue";
import ReminderForm from "./ReminderForm.vue";
import { Card } from "ant-design-vue";

export default defineComponent({
  components: {
    Calendar,
    ReminderForm,
    "a-card": Card,
  },
  setup() {
    const selectedDate = ref<number | null>(null);
    const isFormVisible = ref(false);

    function handleSelectDate(date: number) {
      selectedDate.value = date;
      isFormVisible.value = true;
    }

    function handleClickOutside() {
      isFormVisible.value = false;
    }

    return {
      selectedDate,
      isFormVisible,
      handleSelectDate,
      handleClickOutside,
    };
  },
});
</script>

<style scoped src="../styles/calendarWithReminderForm.css"></style>
