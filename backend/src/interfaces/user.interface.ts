export interface User extends Document {
  readonly username: string;
  readonly email: string;
  readonly password: string;
}