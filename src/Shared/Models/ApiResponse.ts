export class ApiResponse {
  StatusCode: string;
  Data: any;
  Message: string;
  Success:boolean;

  constructor(StatusCode: string, Data: any, Message: string,Success:boolean) {
    this.StatusCode = StatusCode;
    this.Data = Data;
    this.Message = Message;
    this.Success=Success
  }
}
