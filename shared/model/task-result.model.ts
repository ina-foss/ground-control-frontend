import { type ITaskRequest } from '@/shared/model/task-request.model';

export interface ITaskResult {
  id?: number;
  rawResult?: string | null;
  result?: string | null;
  duration?: number | null;
  tokenPrompt?: number | null;
  tokenResult?: number | null;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
  taskRequest?: ITaskRequest | null;
}

export class TaskResult implements ITaskResult {
  constructor(
    public id?: number,
    public rawResult?: string | null,
    public result?: string | null,
    public duration?: number | null,
    public tokenPrompt?: number | null,
    public tokenResult?: number | null,
    public createdAt?: Date | null,
    public createdBy?: string | null,
    public updatedAt?: Date | null,
    public updatedBy?: string | null,
    public taskRequest?: ITaskRequest | null,
  ) {}
}
