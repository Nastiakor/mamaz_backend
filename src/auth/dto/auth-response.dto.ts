export interface AuthResponseDto {
  token: string;
  data: {
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}
