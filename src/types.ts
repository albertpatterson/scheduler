export interface Todo {
  title: string;
  description: string;
  estimate: number;
  priority: number;
}

export interface ScheduledTodo extends Todo {
  start: number; //the start minute eg 600 = 60*10 = 10 AM
}
