export interface Country {
  id: string;
  name: string;
  path: string;
}

export interface WorldMapData {
  label: string;
  viewBox: string;
  locations: Country[];
}
