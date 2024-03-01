import { ref, computed } from "vue";
import apiService from "@/services/api.service.js";

export function useOfdOptions() {
  /// DATA

  const ofdItems = ref([]);

  /// COMPUTED

  const optionsOfd = computed(() => {
    return [{ name: "Нет", value: null }].concat(
      ofdItems.value.map((item) => {
        return { name: item.name, value: item.id };
      })
    );
  });

  /// RUN

  apiService
    .getPaymentsSettings({ settings_type: "ofd", enabled: 1 })
    .then((items) => {
      ofdItems.value = items;
    })
    .catch(console.warn);

  /// EXPOSE

  return { optionsOfd };
}
