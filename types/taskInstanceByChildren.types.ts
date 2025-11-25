export type TaskInstance = {
  id: string;
  date: string;
  status: "PENDING" | "COMPLETED" | "SKIPPED";
  notes: string;
  templateName: string;
  templateCategory: string;
  recurrenceType: string;
};

export type TaskChildGroup = {
  id: string;
  name: string;
  color: string;
  tasks: TaskInstance[];
};

export type TaskInstanceByChildrenResponse = {
  message: string;
  data: TaskChildGroup[];
};
