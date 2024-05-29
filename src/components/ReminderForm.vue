<template>
  <div class="reminder-form">
    <h3>
      {{ selectedDate ? `Reminders for ${selectedDate}` : "Select a Date" }}
    </h3>
    <div v-if="selectedDate">
      <ul class="reminder-list">
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
import { message, notification } from "ant-design-vue";

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
        message.error("Reminder text cannot be empty");
        return;
      }
      if (!newReminder.value.city.trim()) {
        message.error("City cannot be empty");
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
      notification.success({
        message: "Success",
        description: "Reminder added successfully",
      });
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
      notification.info({
        message: "Updated",
        description: "Reminder updated successfully",
      });
      resetForm();
    }

    function deleteReminder(id: number) {
      reminderStore.deleteReminder(id);
      notification.error({
        message: "Deleted",
        description: "Reminder deleted successfully",
      });
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
.color-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 5px;
}
.reminder-list {
  list-style-type: none;
  padding: 0;
}
</style>
