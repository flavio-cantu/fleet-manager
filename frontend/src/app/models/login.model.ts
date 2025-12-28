export class LoginRequest {
  constructor(
    public username: string,
    public password: string,
  ) {}
}


export class LoginResponse {
  constructor(
    public token: string,
    public message: string,
    public empty: boolean,
    public userId:number
  ) {}
}

