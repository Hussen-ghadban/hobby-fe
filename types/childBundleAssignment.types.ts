import { Child } from "./child.types";
import { TaskTemplate } from "./taskTemplate.types";

// --- Bundle (minimal form inside some responses) ---
export interface ChildTaskBundleLite {
  id: string;
  createdAt: string;
}

// --- Bundle with templates (when included fully in create response) ---
export interface ChildTaskBundleFull {
  id: string;
  createdAt: string;
  templates: TaskTemplate[];
}

// --- Base assignment object ---
export interface ChildBundleAssignment {
  id: string;
  bundleId: string;
  createdAt: string;

  children: Child[];

  // depending on endpoint, backend returns either of these:
  bundle: ChildTaskBundleLite | ChildTaskBundleFull;
}

// ---------- Request Bodies ----------

// Add new assignment
export interface AddChildBundleAssignmentFormData {
  bundleId: string;
  childIds: string[];
}

// Update assignment children
export interface UpdateChildBundleAssignmentFormData {
  childIds: string[];
}

// ---------- Responses ----------

export interface AddChildBundleAssignmentResponse {
  message: string;
  data: ChildBundleAssignment;
}

export interface GetChildBundleAssignmentResponse {
  message: string;
  data: ChildBundleAssignment;
}

export interface UpdateChildBundleAssignmentResponse {
  message: string;
  data: ChildBundleAssignment;
}
