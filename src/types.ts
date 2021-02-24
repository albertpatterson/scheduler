export interface Todo {
  title: string;
  description: string;
  estimate: number;
  priority: number;
}

export interface ScheduledTodo extends Todo {
  start: Date;
}
