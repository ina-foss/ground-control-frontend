import { type ITask } from '~/shared/model/task.model';

import { type PromptType } from '~/shared/model/enumerations/prompt-type.model';
export interface IPrompt {
  id?: number;
  name?: string | null;
  prompt?: string | null;
  type?: keyof typeof PromptType | null;
  template?: string | null;
  isDefault?: boolean | null;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
  task?: ITask | null;
}

export class Prompt implements IPrompt {
  constructor(
    public id?: number,
    public name?: string | null,
    public prompt?: string | null,
    public type?: keyof typeof PromptType | null,
    public template?: string | null,
    public isDefault?: boolean | null,
    public createdAt?: Date | null,
    public createdBy?: string | null,
    public updatedAt?: Date | null,
    public updatedBy?: string | null,
    public task?: ITask | null,
  ) {
    this.isDefault = this.isDefault ?? false;
  }
}
