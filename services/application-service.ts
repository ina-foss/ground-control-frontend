export default class ApplicationService {
  constructor(private readonly accessToken: string) {}

  public getDefaultHeader() {
    return { Authorization: `Bearer ${this.accessToken}` };
  }
}