<template>
  <div class="reminder-form">
    <h3>
      {{
        selectedDate ? `Reminders for the day ${selectedDate}` : "Select a Date"
      }}
    </h3>
    <div v-if="selectedDate">
      <ul class="reminder-list">
        <li v-for="reminder in remindersForDate" :key="reminder.id">
          <span
            :style="{ backgroundColor: reminder.color }"
            class="color-dot"
          ></span>
          {{ reminder.text }} - {{ reminder.weatherDescription }} ({{
            reminder.temperature
          }}°C)
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
          <input
            type="text"
            v-model="newReminder.city"
            @change="fetchWeather"
            required
          />
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
import { getWeather } from "../services/weatherService";
import { message, notification } from "ant-design-vue";

export default defineComponent({
  props: {
    selectedDate: {
      type: Number as PropType<number | null>, // Permitir null
      required: true,
    },
  },
  setup(props) {
    const reminderStore = useReminderStore();
    const weatherData = ref<any>(null); // Usar any

    const isEditing = ref(false);
    const editingReminderId = ref<number | null>(null);

    const newReminder = ref<any>({
      time: "",
      text: "",
      city: "",
      color: "#000000",
      weatherDescription: "",
      temperature: "",
    });

    const remindersForDate = computed(() => {
      return reminderStore.reminders.filter(
        (reminder) => new Date(reminder.date).getDate() === props.selectedDate
      );
    });

    async function fetchWeather() {
      if (!newReminder.value.city.trim()) {
        message.error("City cannot be empty");
        return;
      }

      try {
        const weather = await getWeather(newReminder.value.city.toLowerCase());
        console.log("Weather Data:", weather); // Log del dato del clima
        weatherData.value = weather;
        newReminder.value.weatherDescription = weather.weather[0].description;
        newReminder.value.temperature = weather.main.temp.toString(); // Convertir a string
      } catch (error) {
        notification.error({
          message: "Error",
          description: "City not found. Please enter a valid city name.",
        });
      }
    }

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
        props.selectedDate as number,
        hours,
        minutes
      ).getTime();

      const newReminderObj: Reminder = {
        id: Math.random(),
        text: newReminder.value.text,
        date,
        city: newReminder.value.city,
        color: newReminder.value.color,
        weatherDescription: newReminder.value.weatherDescription,
        temperature: newReminder.value.temperature,
      };

      console.log("New Reminder:", newReminderObj); // Log del nuevo recordatorio
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
        weatherDescription: reminder.weatherDescription,
        temperature: reminder.temperature,
      };
    }

    function updateReminder() {
      if (!editingReminderId.value) return;

      const [hours, minutes] = newReminder.value.time.split(":").map(Number);
      const date = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        props.selectedDate as number,
        hours,
        minutes
      ).getTime();

      const updatedReminder: Reminder = {
        id: editingReminderId.value,
        text: newReminder.value.text,
        date,
        city: newReminder.value.city,
        color: newReminder.value.color,
        weatherDescription: newReminder.value.weatherDescription,
        temperature: newReminder.value.temperature,
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
      newReminder.value = {
        time: "",
        text: "",
        city: "",
        color: "#000000",
        weatherDescription: "",
        temperature: "",
      };
      weatherData.value = null;
    }

    return {
      newReminder,
      remindersForDate,
      addNewReminder,
      editReminder,
      updateReminder,
      deleteReminder,
      isEditing,
      fetchWeather,
      weatherData,
    };
  },
});
</script>

<style scoped src="../styles/reminderForm.css"></style>
