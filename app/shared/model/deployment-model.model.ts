import type { ITask } from '~/shared/model/task.model';

import type { DeploymentModelType } from '~/shared/model/enumerations/deployment-model-type.model';
export interface IDeploymentModel {
  id?: number;
  name?: string | null;
  type?: keyof typeof DeploymentModelType | null;
  parameters?: string | null;
  isDefault?: boolean | null;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
  tasks?: ITask[] | null;
}

export class DeploymentModel implements IDeploymentModel {
  constructor(
    public id?: number,
    public name?: string | null,
    public type?: keyof typeof DeploymentModelType | null,
    public parameters?: string | null,
    public isDefault?: boolean | null,
    public createdAt?: Date | null,
    public createdBy?: string | null,
    public updatedAt?: Date | null,
    public updatedBy?: string | null,
    public tasks?: ITask[] | null,
  ) {
    this.isDefault = this.isDefault ?? false;
  }
}
