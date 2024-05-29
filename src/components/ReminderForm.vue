<template>
  <div class="reminder-form">
    <h3>
      {{ selectedDate ? `Reminders for ${selectedDate}` : "Select a Date" }}
    </h3>
    <div v-if="selectedDate">
      <ul>
        <li v-for="reminder in remindersForDate" :key="reminder.id">
          <span
            :style="{ backgroundColor: reminder.color }"
            class="color-dot"
          ></span>
          {{ reminder.text }}
          <button @click="editReminder(reminder)">Edit</button>
          <button @click="deleteReminder(reminder.id)">Delete</button>
        </li>
      </ul>
      <h4>{{ isEditing ? "Edit Reminder" : "Add New Reminder" }}</h4>
      <form @submit.prevent="isEditing ? updateReminder() : addNewReminder()">
        <label>
          Time:
          <input type="time" v-model="newReminder.time" required />
        </label>
        <label>
          Text (max 30 chars):
          <input
            type="text"
            v-model="newReminder.text"
            maxlength="30"
            required
          />
        </label>
        <label>
          City:
          <input type="text" v-model="newReminder.city" required />
        </label>
        <label>
          Color:
          <input type="color" v-model="newReminder.color" />
        </label>
        <button type="submit">
          {{ isEditing ? "Update Reminder" : "Add Reminder" }}
        </button>
      </form>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, PropType } from "vue";
import { useReminderStore } from "../store/reminderStore";
import { Reminder } from "../types/Reminder";

export default defineComponent({
  props: {
    selectedDate: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const reminderStore = useReminderStore();

    const isEditing = ref(false);
    const editingReminderId = ref<number | null>(null);

    const newReminder = ref({
      time: "",
      text: "",
      city: "",
      color: "#000000", // Default color
    });

    const remindersForDate = computed(() => {
      return reminderStore.reminders.filter(
        (reminder) => new Date(reminder.date).getDate() === props.selectedDate
      );
    });

    function addNewReminder() {
      if (!newReminder.value.text.trim()) {
        alert("Reminder text cannot be empty");
        return;
      }
      if (!newReminder.value.city.trim()) {
        alert("City cannot be empty");
        return;
      }

      const [hours, minutes] = newReminder.value.time.split(":").map(Number);
      const date = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        props.selectedDate,
        hours,
        minutes
      ).getTime();

      const newReminderObj: Reminder = {
        id: Math.random(),
        text: newReminder.value.text,
        date,
        city: newReminder.value.city,
        color: newReminder.value.color,
      };

      reminderStore.addReminder(newReminderObj);
      resetForm();
    }

    function editReminder(reminder: Reminder) {
      isEditing.value = true;
      editingReminderId.value = reminder.id;
      newReminder.value = {
        time: new Date(reminder.date).toTimeString().slice(0, 5),
        text: reminder.text,
        city: reminder.city,
        color: reminder.color,
      };
    }

    function updateReminder() {
      if (!editingReminderId.value) return;

      const [hours, minutes] = newReminder.value.time.split(":").map(Number);
      const date = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        props.selectedDate,
        hours,
        minutes
      ).getTime();

      const updatedReminder: Reminder = {
        id: editingReminderId.value,
        text: newReminder.value.text,
        date,
        city: newReminder.value.city,
        color: newReminder.value.color,
      };

      reminderStore.updateReminder(updatedReminder);
      resetForm();
    }

    function deleteReminder(id: number) {
      reminderStore.deleteReminder(id);
    }

    function resetForm() {
      isEditing.value = false;
      editingReminderId.value = null;
      newReminder.value = { time: "", text: "", city: "", color: "#000000" };
    }

    return {
      newReminder,
      remindersForDate,
      addNewReminder,
      editReminder,
      updateReminder,
      deleteReminder,
      isEditing,
    };
  },
});
</script>
<style scoped>
.reminder-form {
  padding: 20px;
  background-color: #f5f5f5;
  border-left: 1px solid #ddd;
  overflow-y: auto; /* Agrega scroll vertical si es necesario */
}
.reminder-form h3,
.reminder-form h4 {
  margin-bottom: 10px;
}
.reminder-form form {
  display: flex;
  flex-direction: column;
}
.reminder-form form label {
  margin-bottom: 10px;
}
.reminder-form form button {
  align-self: flex-start;
}
.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}
</style>
