import { type IDeploymentModel } from '@/shared/model/deployment-model.model';
import { type INamespace } from '@/shared/model/namespace.model';

import { type TaskType } from '@/shared/model/enumerations/task-type.model';
import { type ToolStatus } from '@/shared/model/enumerations/tool-status.model';
export interface ITask {
  id?: number;
  name?: string;
  type?: keyof typeof TaskType;
  status?: keyof typeof ToolStatus;
  categories?: string | null;
  description?: string | null;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
  deploymentModels?: IDeploymentModel[] | null;
  namespace?: INamespace | null;
}

export class Task implements ITask {
  constructor(
    public id?: number,
    public name?: string,
    public type?: keyof typeof TaskType,
    public status?: keyof typeof ToolStatus,
    public categories?: string | null,
    public description?: string | null,
    public createdAt?: Date | null,
    public createdBy?: string | null,
    public updatedAt?: Date | null,
    public updatedBy?: string | null,
    public deploymentModels?: IDeploymentModel[] | null,
    public namespace?: INamespace | null,
  ) {}
}
