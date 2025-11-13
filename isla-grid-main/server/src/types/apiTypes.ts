export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export type ApiRequest<T = any> = {
  payload: T;
};
