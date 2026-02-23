export interface INamespace {
  id?: number;
  name?: string | null;
  isDefault?: boolean | null;
  createdAt?: Date | null;
  createdBy?: string | null;
  updatedAt?: Date | null;
  updatedBy?: string | null;
}

export class Namespace implements INamespace {
  constructor(
    public id?: number,
    public name?: string | null,
    public isDefault?: boolean | null,
    public createdAt?: Date | null,
    public createdBy?: string | null,
    public updatedAt?: Date | null,
    public updatedBy?: string | null,
  ) {
    this.isDefault = this.isDefault ?? false;
  }
}
