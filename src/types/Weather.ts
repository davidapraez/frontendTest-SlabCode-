export interface WeatherResponse {
  weather: { description: string }[];
  main: { temp: number };
}
