export interface Country {
  code: string;
  name: string;
}

export interface ApiResponse {
  countries: Country[];
}
