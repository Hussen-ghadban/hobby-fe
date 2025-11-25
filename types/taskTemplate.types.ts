export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  priority?: number;         // number input
  startDate: string;
  recurrenceType: "DAILY" | "WEEKDAYS" | "CUSTOM_DAYS"; // explicit options
  recurrenceDays?: string[]; // only used if recurrenceType === CUSTOM_DAYS
}

export interface AddTaskTemplateFormData {
  name: string;
  description?: string;
  category?: string;
  priority?: number;
  startDate: string;
  recurrenceType: "DAILY" | "WEEKDAYS" | "CUSTOM_DAYS";
  recurrenceDays?: string[]; // optional for custom days
}

export interface UpdateTaskTemplateFormData extends Partial<AddTaskTemplateFormData> {}
