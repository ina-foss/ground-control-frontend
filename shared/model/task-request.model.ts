import { type ITask } from '@/shared/model/task.model';

export interface ITaskRequest {
  id?: number;
  name?: string;
  prompt?: string | null;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
  task?: ITask | null;
}

export class TaskRequest implements ITaskRequest {
  constructor(
    public id?: number,
    public name?: string,
    public prompt?: string | null,
    public createdAt?: Date | null,
    public createdBy?: string | null,
    public updatedAt?: Date | null,
    public updatedBy?: string | null,
    public task?: ITask | null,
  ) {}
}
