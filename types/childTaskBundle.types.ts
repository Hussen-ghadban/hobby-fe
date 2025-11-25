// --- Task Template (reused) ---
export interface TaskTemplate {
  id: string;
  parentId: string;
  name: string;
  description?: string;
  category?: string;
  priority?: number;
  startDate: string;
  recurrenceType: "DAILY" | "WEEKDAYS" | "CUSTOM_DAYS";
  createdAt: string;
  updatedAt: string;
  recurrenceDays: string[];
}

// --- Create ChildTaskBundle (body: templateIds[]) ---
export interface AddChildTaskBundleFormData {
  templateIds: string[];
}

// --- Update ChildTaskBundle (body: templateIds[]) ---
export interface UpdateChildTaskBundleFormData {
  templateIds: string[];
}

// --- Response Single Bundle ---
export interface ChildTaskBundle {
  id: string;
  createdAt: string;
  templates: TaskTemplate[];
}

// --- Response: create ---
export interface AddChildTaskBundleResponse {
  message: string;
  data: ChildTaskBundle;
}

// --- Response: get all ---
export interface GetAllChildTaskBundlesResponse {
  message: string;
  data: ChildTaskBundle[];
}

// --- Response: update ---
export interface UpdateChildTaskBundleResponse {
  message: string;
  data: ChildTaskBundle;
}
