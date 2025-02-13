export interface Continent {
  code: string;
  name: string;
}

export interface ContinentResponse {
  continents: Continent[];
}
