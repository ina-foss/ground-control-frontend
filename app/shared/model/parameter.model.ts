import { type ITask } from '~/shared/model/task.model';

import { type ParameterType } from '~/shared/model/enumerations/parameter-type.model';
export interface IParameter {
  id?: number;
  key?: string | null;
  type?: keyof typeof ParameterType | null;
  task?: ITask | null;
}

export class Parameter implements IParameter {
  constructor(
    public id?: number,
    public key?: string | null,
    public type?: keyof typeof ParameterType | null,
    public task?: ITask | null,
  ) {}
}
