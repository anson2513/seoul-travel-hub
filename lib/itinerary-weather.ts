export const outdoorWeatherPlaceIds = [
  "63-skypicnic",
  "n-seoul-tower",
  "haneul-park",
  "yeouido-hangang-park",
  "cheonggyecheon",
  "bukchon",
] as const;

export const outdoorWeatherPlaceIdSet = new Set<string>(
  outdoorWeatherPlaceIds,
);

export type OutdoorWeatherRiskType =
  | "rain"
  | "cold"
  | "strong_wind"
  | "thunderstorm";

export type OutdoorWeatherRisk = {
  type: OutdoorWeatherRiskType;
  label: string;
};

export type OutdoorWeatherTarget = {
  itemId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "available" | "unavailable";
  severity: "safe" | "warning";
  minTemperature: number | null;
  maxTemperature: number | null;
  minApparentTemperature: number | null;
  rainChance: number | null;
  maxWindSpeed: number | null;
  maxWindGust: number | null;
  risks: OutdoorWeatherRisk[];
  backupPlan?: string;
};

export type OutdoorWeatherResponse = {
  source: "Open-Meteo";
  updatedAt: string;
  targets: OutdoorWeatherTarget[];
};
