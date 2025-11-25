export type TaskStatus = "PENDING" | "COMPLETED" | "SKIPPED";


export interface TaskInstance {
id: string;
templateId: string;
childId: string;
date: string; // e.g. "2025-11-11" or ISO string
status: TaskStatus;
completedAt?: string | null;
notes?: string | null;
createdAt: string;


// Optional includes from backend
template?: import("./taskTemplate.types").TaskTemplate;
child?: import("./child.types").Child;
}


export interface AddTaskInstanceFormData {
templateId: string;
childId: string;
date: string; // "YYYY-MM-DD"
status?: TaskStatus;
notes?: string;
}


export interface UpdateTaskInstanceFormData {
status?: TaskStatus;
notes?: string;
}


export interface ApiListResponse<T> {
message: string;
data: T;
}

export interface UpdateTaskInstanceStatusResponse {
message: string;
data: TaskInstance;
}

