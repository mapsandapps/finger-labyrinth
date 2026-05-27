export interface Intersection {
  point: {
    x: number;
    y: number;
  };
  angle1: number; // degrees
  angle2: number; // degrees
  path: string;
  bridgePath: string;
  offsetOver: number;
  offsetUnder: number;
}

export interface CenterCircleData {
  cx?: number;
  cy?: number;
  r?: number;
}

export interface CenterCircle {
  cx: number;
  cy: number;
  r: number;
}

// "LabyrinthData"s get merged with defaultLabyrinth (a Labyrinth) to create a Labyrinth (i.e. that has all items defined)
export interface LabyrinthData {
  path: string;
  roundedPath?: string;
  pathColor?: string;
  travelingColor?: string;
  backgroundColor?: string;
  pathWidth?: number;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  centerCircle?: CenterCircleData;
}

export interface Bridge {
  path: string;
  bridgePath: string;
  offsetOver: number;
  offsetUnder: number;
}

export interface Labyrinth {
  path: string;
  pathColor: string;
  travelingColor: string;
  backgroundColor: string;
  pathWidth: number;
  viewBoxWidth: number;
  viewBoxHeight: number;
  bridges?: Bridge[];
  startCircle: CenterCircle;
  centerCircle: CenterCircle;
}

interface Palette {
  backgroundColor: string;
  pathColor: string;
  travelingColor: string;
}

// many from https://coolors.co/palettes/popular/calm
const palettes: Record<string, Palette> = {
  steelBlue: {
    backgroundColor: "#b58a47",
    pathColor: "white",
    travelingColor: "steelblue",
  },
  brickRed: {
    backgroundColor: "#d1d1d1",
    pathColor: "white",
    travelingColor: "#a60000",
  },
  // https://coolors.co/palette/f6bd60-f7ede2-f5cac3-84a59d-f28482
  sweetSummerMelody: {
    backgroundColor: "#84a59d",
    pathColor: "#f7ede2",
    travelingColor: "#f6bd60",
  },
  // TODO: unused
  darkGreen: {
    backgroundColor: "darkGreen",
    pathColor: "green",
    travelingColor: "sandybrown",
  },
  // https://coolors.co/palette/114b5f-1a936f-88d498-c6dabf-f3e9d2
  greenOasis: {
    backgroundColor: "#114b5f",
    pathColor: "#1a936f",
    travelingColor: "#c6dabf",
  },
  // https://coolors.co/palette/ccd5ae-e9edc9-fefae0-faedcd-d4a373
  goldenSummerFields: {
    backgroundColor: "#ccd5ae",
    pathColor: "#fefae0",
    travelingColor: "#d4a373",
  },
  // https://coolors.co/palette/264653-2a9d8f-e9c46a-f4a261-e76f51
  sunnyBeachDay: {
    backgroundColor: "#264653",
    pathColor: "#2a9d8f",
    travelingColor: "#e9c46a",
  },
  // https://coolors.co/palette/03045e-023e8a-0077b6-0096c7-00b4d8-48cae4-90e0ef-ade8f4-caf0f8
  oceanBlueSerenity: {
    backgroundColor: "#023e8a",
    pathColor: "#caf0f8",
    travelingColor: "#00b4d8",
  },
  // https://coolors.co/palette/606c38-283618-fefae0-dda15e-bc6c25
  oliveGardenFeast: {
    backgroundColor: "#283618",
    pathColor: "#606c38",
    travelingColor: "#fefae0",
  },
  // https://coolors.co/palette/8e9aaf-cbc0d3-efd3d7-feeafa-dee2ff
  softLavender: {
    backgroundColor: "#22223b",
    pathColor: "#4a4e69",
    travelingColor: "#f2e9e4",
  },
  // https://coolors.co/palette/22577a-38a3a5-57cc99-80ed99-c7f9cc
  coolWaters: {
    pathColor: "#57cc99",
    backgroundColor: "#22577a",
    travelingColor: "#c7f9cc",
  },
  // https://coolors.co/palette/ef476f-ffd166-06d6a0-118ab2-073b4c
  watermelonSorbet: {
    backgroundColor: "#073b4c",
    pathColor: "#ffd166",
    travelingColor: "#ef476f",
  },
  // https://coolors.co/palette/353535-3c6e71-ffffff-d9d9d9-284b63
  monochromeBeach: {
    backgroundColor: "#284b63",
    pathColor: "#353535",
    travelingColor: "#3c6e71",
  },
  // https://coolors.co/palette/ff9f1c-ffbf69-ffffff-cbf3f0-2ec4b6
  tropicalSunrise: {
    backgroundColor: "#CBF3F0",
    pathColor: "#2EC4B6",
    travelingColor: "#FF9F1C",
  },
  // https://coolors.co/palette/d4e09b-f6f4d2-cbdfbd-f19c79-a44a3f
  pastelComfort: {
    backgroundColor: "#a44a3f",
    pathColor: "#d4e09b",
    travelingColor: "#f6f4d2",
  },
  // https://coolors.co/palette/ffbe0b-fb5607-ff006e-8338ec-3a86ff
  vibrantColorFiesta: {
    backgroundColor: "#8338ec",
    pathColor: "#3a86ff",
    travelingColor: "#ffbe0b",
  },
};

export const defaultLabyrinth = {
  path: "M112 237V159.5C100.5 155 88.1919 142 88 123C87.8081 104 103 83 128 83C153 83 167.901 103.5 168 123C168.099 142.5 155 155 144 159.5V209.5C181.5 203 216.133 169 216 123C215.867 77 179.967 35 128 35C76.0333 35 40 78 40 123C40 168 71.5 191 80 196.5V176.6C71.5 169.1 56.3889 150.997 56 123C55.5069 87.5 85 51 128 51C171 51 200.155 87 200 123C199.845 159 174 182 160 187V168.8C167 164.1 184 149 184 123C184 95 161.5 67 128 67C94.5 67 72 95 72 123C72 150 90.5 165.5 96 169V221.8C63.5 212.5 24 177 24 123C24 69 68.5 19 128 19C187.5 19 232 67 232 123C232 185.5 179 228 128 227V123",
  pathColor: "white",
  travelingColor: "#b58a47",
  backgroundColor: "black",
  pathWidth: 12,
  viewBoxWidth: 256,
  viewBoxHeight: 256,
};

// NOTE: should not be used except in getLabyrinthFromIndex
export const labyrinths: LabyrinthData[] = [
  {
    ...defaultLabyrinth,
    centerCircle: {
      cx: 128,
      cy: 123,
      r: 30,
    },
    backgroundColor: "red",
  },
  {
    path: "M 132 448 L 132 272 L 92 272 L 92 432 L 52 432 L 52 172 A 120 120 0 0 1 152 53.5 L 152 94.5 A 80 80 0 0 0 92 172 L 92 232 L 132 232 L 132 172 A 40 40 0 0 1 212 172 L 212 232 L 252 232 L 252 172 A 80 80 0 0 0 192 94.5 L 192 53.5 A 120 120 0 0 1 292 172 L 292 432 L 252 432 L 252 272 L 212 272 L 212 432 L 172 432 L 172 172",
    ...palettes.steelBlue,
    viewBoxWidth: 344,
    viewBoxHeight: 472,
    pathWidth: 34,
    centerCircle: {
      cx: 172,
      cy: 172,
    },
  },
  {
    path: "M118 237V216.5C117.5 209.5 115.5 204 107 202C80 195.647 54 167 52 138.5C51.7895 135.5 53.3766 133.414 56 133C58.6234 132.586 61.2159 134.5 61.5 137C64 159 79.9999 179 96 187C105 191 115.021 186.123 117.5 179C119.979 171.877 117.5 164.5 110.5 160.5C98.6428 153.724 94.1429 144.5 92 137C91 133.5 88 132.95 86 133.5C84 134.05 82.125 136 82.5 139C83.5 147 91 161.5 105.5 169.3C108 170.645 108.881 173.515 107.5 176C106.119 178.485 103.181 179.452 100.5 178C88.5 171.5 71 154.5 71 128C71 100 91 77.098 117 72C120.956 71.2244 122.772 73.7342 123 76.5C123.228 79.2658 121.5 81.5 118.5 82C95 87 84.5 106 82.5 117C81.9545 120 83.259 122.354 86 123C88.741 123.646 91 122.5 92 119.5C94.5 107.5 106.5 91 128 91C149.5 91 165 109 165 128C165 147 152 158.5 141 162.5C138.5 163.5 137.034 166.377 138 169C138.966 171.623 141.956 172.881 144.5 172C157.5 167.5 175 152.5 175 128C175 103 156 85 137 82C134 81.5263 132.448 78.7614 133 76C133.552 73.2386 135.5 71.5 139 72C163.5 76.5 180.3 97 184.3 119C184.755 121.5 187.358 123.268 190 123C192.642 122.732 194.5 120 194 116.5C190 91 166.5 61 128 61C88 61 64.5 93.5 61.5 118.5C61.1412 121.49 58.6406 123.285 56 123C53.3594 122.715 51.5 120.5 51.7 117C56.7 85 82 55.5 119 51.5C122.5 51 123.367 48.3225 123 46C122.633 43.6775 120.98 41.1561 118 41.5C79 46 41 79 41 128C41 177 79.2459 205.5 104 211.5C108 213 108.311 215.412 107.5 218C106.689 220.588 104.751 222.161 101.5 221.3C67.5 212.3 31 178 31 128C31 77 71 31 128 31C185 31 221.5 78 224.5 117.5C224.5 120.5 222.761 122.724 220 123C217.239 123.276 214.91 122.5 214.5 118.5C210.5 79.5 179.5 47 138.5 41.5C135.761 41.1325 133 43 133 46C133 49 134 51.125 137 51.5C176.5 56.4375 204.918 89.7237 205 128C205.082 166.276 177 197.6 142.5 203.6C139.29 204.158 137.609 207 138 209.5C138.391 212 141.5 214 144 213.5C192 203.9 211.5 165 214.5 138C214.889 134.5 217.387 133.032 220 133.3C222.613 133.568 224.811 135.503 224.5 138.5C220.5 177 192 213.8 146 223.3C138.294 224.892 131.458 220.8 129 213.5C126.542 206.2 130 196.5 140 194C182.5 184.893 193 150 194 138.5C194.304 135 192.623 133.414 190 133C187.377 132.586 184.717 134.535 184.3 137C181 156.5 169 173 148 181.5C139.5 184.5 130 179.5 128 170V128",
    pathWidth: 8,
    ...palettes.brickRed,
    centerCircle: {
      r: 18,
    },
  },
  {
    path: "M 24 104 H 72 V 80 A 24 24 90 1 1 120 80 A 8 8 90 0 1 112 88 H 104 V 80 A 8 8 90 0 0 88 80 V 104 H 112 A 24 24 90 0 0 136 80 A 40 40 90 0 0 56 80 V 88 H 48 A 8 8 90 0 1 40 80 A 56 56 90 0 1 152 80 A 40 40 0 0 1 112 120 H 88 V 144 A 24 24 0 0 1 40 144 A 8 8 0 0 1 48 136 H 56 V 144 A 8 8 0 0 0 72 144 V 120 H 48 A 24 24 0 0 0 24 144 A 40 40 0 0 0 104 144 V 136",
    ...palettes.sweetSummerMelody,
    centerCircle: {
      cx: 104,
      cy: 136,
    },
  },
  {
    path: "M 192 80 V 112 H 176 V 80 H 80 V 192 H 64 V 176 H 176 V 128 H 160 V 64 H 32 V 160 H 144 V 48 H 192 V 32 H 16 V 48 H 128 V 192 H 112 V 112",
    pathColor: "black",
    backgroundColor: "white",
    travelingColor: "#b58a47",
    pathWidth: 8,
  },
  {
    path: "M 120 56 L 120 64 A 8 8 0 0 0 128 72 A 8 8 0 0 0 136 64 L 136 32 A 8 8 0 0 0 128 24 L 104 24 L 72 24 L 64 24 A 8 8 0 0 0 56 32 L 56 64 A 8 8 0 0 0 64 72 L 80 72 A 8 8 0 0 1 88 80 L 88 128 A 8 8 0 0 0 96 136 A 8 8 0 0 1 104 144 L 104 176 A 8 8 0 0 1 96 184 L 64 184 A 8 8 0 0 1 56 176 A 8 8 0 0 0 48 168 A 8 8 0 0 1 40 160 L 40 144 A 8 8 0 0 1 48 136 A 8 8 0 0 0 56 128 L 56 96 A 8 8 0 0 1 64 88 L 144 88 A 8 8 0 0 0 152 80 L 152 64 A 8 8 0 0 1 160 56 A 8 8 0 0 0 168 48 L 168 32 A 8 8 0 0 0 160 24 A 8 8 0 0 0 152 32 A 8 8 0 0 1 144 40 L 32 40 A 8 8 0 0 0 24 48 L 24 120 L 24 144 A 8 8 0 0 0 32 152 L 80 152 A 8 8 0 0 1 88 160 A 8 8 0 0 0 96 168 L 144 168 A 8 8 0 0 0 152 160 L 152 112 A 8 8 0 0 1 160 104 L 176 104 A 8 8 0 0 1 184 112 L 184 176 A 8 8 0 0 1 176 184 L 128 184 A 8 8 0 0 1 120 176 L 120 128 A 8 8 0 0 0 112 120 L 48 120 A 8 8 0 0 1 40 112 A 8 8 0 0 1 48 104 L 64 104 A 8 8 0 0 0 72 96 L 72 64 A 8 8 0 0 1 80 56 L 96 56 A 8 8 0 0 1 104 64 L 104 104",
    pathWidth: 12,
    viewBoxWidth: 208,
    viewBoxHeight: 208,
    ...palettes.greenOasis,
  },
  {
    path: "M 24 184 L 24 120 L 24 112 A 8 8 0 0 1 32 104 A 8 8 0 0 1 40 112 L 40 176 A 8 8 0 0 0 48 184 L 96 184 A 8 8 0 0 0 104 176 A 8 8 0 0 0 96 168 L 80 168 A 8 8 0 0 1 72 160 L 72 144 A 8 8 0 0 1 80 136 L 144 136 A 8 8 0 0 0 152 128 L 152 48 A 8 8 0 0 0 144 40 L 80 40 A 8 8 0 0 0 72 48 A 8 8 0 0 1 64 56 A 8 8 0 0 0 56 64 L 56 144 A 8 8 0 0 0 64 152 L 80 152 A 8 8 0 0 0 88 144 L 88 32 A 8 8 0 0 1 96 24 L 128 24 A 8 8 0 0 1 136 32 L 136 96 A 8 8 0 0 0 144 104 L 160 104 A 8 8 0 0 1 168 112 L 168 160 A 8 8 0 0 1 160 168 L 128 168 A 8 8 0 0 1 120 160 A 8 8 0 0 0 112 152 A 8 8 0 0 1 104 144 L 104 128 A 8 8 0 0 0 96 120 L 80 120 A 8 8 0 0 1 72 112 L 72 80 A 8 8 0 0 1 80 72 L 160 72 A 8 8 0 0 0 168 64 A 8 8 0 0 0 160 56 L 112 56 A 8 8 0 0 0 104 64 L 104 104",
    viewBoxWidth: 208,
    viewBoxHeight: 208,
    ...palettes.softLavender,
  },
  {
    path: "M 136 104 L 136 48 A 8 8 0 0 1 144 40 A 8 8 0 0 0 152 32 A 8 8 0 0 0 144 24 L 128 24 A 8 8 0 0 0 120 32 A 8 8 0 0 1 112 40 L 96 40 A 8 8 0 0 0 88 48 L 88 128 A 8 8 0 0 1 80 136 A 8 8 0 0 0 72 144 L 72 240 A 8 8 0 0 1 64 248 A 8 8 0 0 1 56 240 L 56 224 A 8 8 0 0 1 64 216 L 160 216 A 8 8 0 0 1 168 224 A 8 8 0 0 1 160 232 A 8 8 0 0 1 152 224 L 152 208 A 8 8 0 0 1 160 200 A 8 8 0 0 0 168 192 A 8 8 0 0 0 160 184 L 48 184 A 8 8 0 0 1 40 176 L 40 128 A 8 8 0 0 0 32 120 A 8 8 0 0 0 24 128 A 8 8 0 0 0 32 136 L 48 136 A 8 8 0 0 1 56 144 L 56 192 A 8 8 0 0 0 64 200 L 96 200 A 8 8 0 0 1 104 208 L 104 224 A 8 8 0 0 0 112 232 L 128 232 A 8 8 0 0 0 136 224 L 136 144 A 8 8 0 0 1 144 136 A 8 8 0 0 1 152 144 L 152 160 A 8 8 0 0 1 144 168 L 96 168 A 8 8 0 0 0 88 176 L 88 240 A 8 8 0 0 0 96 248 L 176 248 A 8 8 0 0 0 184 240 L 184 120 L 184 32 A 8 8 0 0 0 176 24 A 8 8 0 0 0 168 32 L 168 80 A 8 8 0 0 1 160 88 L 48 88 A 8 8 0 0 1 40 80 A 8 8 0 0 1 48 72 L 112 72 A 8 8 0 0 1 120 80 L 120 96 A 8 8 0 0 1 112 104 L 64 104 A 8 8 0 0 0 56 112 A 8 8 0 0 0 64 120 L 160 120 A 8 8 0 0 0 168 112 A 8 8 0 0 0 160 104 A 8 8 0 0 1 152 96 L 152 64 A 8 8 0 0 0 144 56 L 112 56 A 8 8 0 0 0 104 64 L 104 136",
    viewBoxWidth: 208,
    viewBoxHeight: 272,
    ...palettes.oliveGardenFeast,
  },
  {
    path: "M 24 24 L 32 24 A 8 8 0 0 1 40 32 A 8 8 0 0 1 32 40 A 8 8 0 0 0 24 48 A 8 8 0 0 0 32 56 L 112 56 A 8 8 0 0 1 120 64 A 8 8 0 0 1 112 72 L 32 72 A 8 8 0 0 0 24 80 L 24 128 A 8 8 0 0 0 32 136 L 96 136 A 8 8 0 0 0 104 128 L 104 112 A 8 8 0 0 1 112 104 L 128 104 A 8 8 0 0 0 136 96 L 136 64 A 8 8 0 0 1 144 56 A 8 8 0 0 1 152 64 L 152 144 A 8 8 0 0 1 144 152 L 80 152 A 8 8 0 0 1 72 144 L 72 48 A 8 8 0 0 1 80 40 L 144 40 A 8 8 0 0 0 152 32 A 8 8 0 0 0 144 24 L 96 24 A 8 8 0 0 0 88 32 L 88 88",
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.oceanBlueSerenity,
  },
  {
    path: "M 40 136 L 56 136 L 144 136 A 8 8 0 0 0 152 128 L 152 48 A 8 8 0 0 0 144 40 L 64 40 A 8 8 0 0 1 56 32 A 8 8 0 0 1 64 24 A 8 8 0 0 1 72 32 L 72 144 A 8 8 0 0 1 64 152 L 32 152 A 8 8 0 0 1 24 144 L 24 120 L 24 96 A 8 8 0 0 1 32 88 A 8 8 0 0 1 40 96 L 40 112 A 8 8 0 0 0 48 120 A 8 8 0 0 0 56 112 L 56 64 A 8 8 0 0 1 64 56 L 128 56 A 8 8 0 0 0 136 48 L 136 32 A 8 8 0 0 0 128 24 L 96 24 A 8 8 0 0 0 88 32 L 88 88",
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.sunnyBeachDay,
  },
  {
    path: "M 120 72 L 120 144 A 8 8 0 0 0 128 152 A 8 8 0 0 0 136 144 A 8 8 0 0 0 128 136 L 64 136 A 8 8 0 0 1 56 128 A 8 8 0 0 1 64 120 L 80 120 A 8 8 0 0 0 88 112 A 8 8 0 0 1 96 104 L 128 104 A 24 24 0 0 0 152 80 L 152 56 L 152 48 A 8 8 0 0 0 144 40 L 128 40 A 8 8 0 0 0 120 48 A 8 8 0 0 0 128 56 A 8 8 0 0 1 136 64 L 136 80 A 8 8 0 0 1 128 88 L 112 88 A 8 8 0 0 0 104 96 L 104 144 A 8 8 0 0 1 96 152 L 48 152 A 8 8 0 0 1 40 144 L 40 80 A 8 8 0 0 0 32 72 A 8 8 0 0 1 24 64 L 24 48 A 8 8 0 0 1 32 40 L 96 40 A 8 8 0 0 1 104 48 L 104 64 A 8 8 0 0 1 96 72 L 64 72 A 8 8 0 0 0 56 80 L 56 96 A 8 8 0 0 1 48 104 L 32 104 A 8 8 0 0 1 24 96 A 8 8 0 0 1 32 88 L 64 88 A 8 8 0 0 0 72 80 L 72 64 A 8 8 0 0 1 80 56 A 8 8 0 0 1 88 64 L 88 88",
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.goldenSummerFields,
  },
  {
    path: "M 152 152 L 152 128 A 24 24 0 0 0 128 104 A 24 24 0 0 1 104 80 L 104 64 A 24 24 0 0 1 128 40 L 144 40 A 8 8 0 0 0 152 32 A 8 8 0 0 0 144 24 L 80 24 A 8 8 0 0 0 72 32 A 8 8 0 0 1 64 40 L 48 40 A 8 8 0 0 0 40 48 L 40 80 A 8 8 0 0 0 48 88 A 8 8 0 0 0 56 80 A 8 8 0 0 1 64 72 A 8 8 0 0 1 72 80 L 72 112 A 8 8 0 0 1 64 120 L 48 120 A 8 8 0 0 0 40 128 A 8 8 0 0 0 48 136 L 80 136 A 8 8 0 0 1 88 144 A 8 8 0 0 0 96 152 L 112 152 A 24 24 0 0 0 136 128 L 136 96 A 8 8 0 0 1 144 88 A 8 8 0 0 0 152 80 L 152 64 A 8 8 0 0 0 144 56 L 128 56 A 8 8 0 0 0 120 64 L 120 112 A 8 8 0 0 1 112 120 L 96 120 A 8 8 0 0 1 88 112 A 8 8 0 0 0 80 104 L 48 104 A 24 24 0 0 1 24 80 A 24 24 0 0 1 48 56 L 80 56 A 8 8 0 0 1 88 64 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.coolWaters,
  },
  {
    // path: "M 56 152 L 24 152 L 24 56 L 88 56 L 88 24 L 72 24 L 72 88 L 40 88 L 40 136 L 88 136 L 88 120 L 56 120 L 56 24 L 40 24 L 40 40 L 104 40 L 104 24 L 120 24 L 120 56 L 104 56 L 104 152 L 72 152 L 72 104 L 120 104 L 120 88 L 152 88 L 152 72 L 88 72 L 88 88 ",
    path: "M 56 152 L 32 152 A 8 8 0 0 1 24 144 L 24 80 A 24 24 0 0 1 48 56 L 80 56 A 8 8 0 0 0 88 48 L 88 32 A 8 8 0 0 0 80 24 A 8 8 0 0 0 72 32 L 72 80 A 8 8 0 0 1 64 88 L 48 88 A 8 8 0 0 0 40 96 L 40 112 A 24 24 0 0 0 64 136 L 80 136 A 8 8 0 0 0 88 128 A 8 8 0 0 0 80 120 L 64 120 A 8 8 0 0 1 56 112 L 56 32 A 8 8 0 0 0 48 24 A 8 8 0 0 0 40 32 A 8 8 0 0 0 48 40 L 96 40 A 8 8 0 0 0 104 32 A 8 8 0 0 1 112 24 A 8 8 0 0 1 120 32 L 120 48 A 8 8 0 0 1 112 56 A 8 8 0 0 0 104 64 L 104 144 A 8 8 0 0 1 96 152 L 80 152 A 8 8 0 0 1 72 144 L 72 128 A 24 24 0 0 1 96 104 L 112 104 A 8 8 0 0 0 120 96 A 8 8 0 0 1 128 88 L 144 88 A 8 8 0 0 0 152 80 A 8 8 0 0 0 144 72 L 96 72 A 8 8 0 0 0 88 80 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.watermelonSorbet,
  },
  {
    // "path": "M 152 88 L 152 24 L 24 24 L 24 72 L 104 72 L 104 136 L 24 136 L 24 152 L 120 152 L 120 40 L 136 40 L 136 104 L 152 104 L 152 120 L 24 120 L 24 88 L 56 88 L 56 40 L 104 40 L 104 56 L 88 56 L 88 88 ",
    path: "M 152 88 L 152 48 A 24 24 0 0 0 128 24 L 48 24 A 24 24 0 0 0 24 48 A 24 24 0 0 0 48 72 L 80 72 A 24 24 0 0 1 104 96 L 104 112 A 24 24 0 0 1 80 136 L 32 136 A 8 8 0 0 0 24 144 A 8 8 0 0 0 32 152 L 80 152 A 40 40 0 0 0 120 112 L 120 48 A 8 8 0 0 1 128 40 A 8 8 0 0 1 136 48 L 136 96 A 8 8 0 0 0 144 104 A 8 8 0 0 1 152 112 A 8 8 0 0 1 144 120 L 32 120 A 8 8 0 0 1 24 112 L 24 96 A 8 8 0 0 1 32 88 L 48 88 A 8 8 0 0 0 56 80 L 56 64 A 24 24 0 0 1 80 40 L 96 40 A 8 8 0 0 1 104 48 A 8 8 0 0 1 96 56 A 8 8 0 0 0 88 64 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.monochromeBeach,
  },
  {
    path: "M 24 88 L 24 104 L 56 104 L 56 88 L 40 88 L 40 120 L 136 120 L 136 24 L 120 24 L 120 40 L 56 40 L 56 72 L 24 72 L 24 24 L 104 24 L 104 136 L 120 136 L 120 72 L 88 72 L 88 88 ",
    roundedPath:
      "M 24 88 L 24 96 A 8 8 0 0 0 32 104 L 48 104 A 8 8 0 0 0 56 96 A 8 8 0 0 0 48 88 A 8 8 0 0 0 40 96 L 40 112 A 8 8 0 0 0 48 120 L 96 120 A 40 40 0 0 0 136 80 L 136 32 A 8 8 0 0 0 128 24 A 8 8 0 0 0 120 32 A 8 8 0 0 1 112 40 L 64 40 A 8 8 0 0 0 56 48 L 56 64 A 8 8 0 0 1 48 72 L 32 72 A 8 8 0 0 1 24 64 L 24 48 A 24 24 0 0 1 48 24 L 64 24 A 40 40 0 0 1 104 64 L 104 128 A 8 8 0 0 0 112 136 A 8 8 0 0 0 120 128 L 120 80 A 8 8 0 0 0 112 72 L 96 72 A 8 8 0 0 0 88 80 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
  },
  {
    path: "M 88 24 L 72 24 L 72 56 L 104 56 L 104 88 L 152 88 L 152 56 L 120 56 L 120 40 L 104 40 L 104 24 L 152 24 L 152 40 L 136 40 L 136 104 L 152 104 L 152 120 L 104 120 L 104 136 L 152 136 L 152 152 L 88 152 L 88 136 L 72 136 L 72 152 L 24 152 L 24 136 L 56 136 L 56 56 L 24 56 L 24 120 L 72 120 L 72 72 L 120 72 L 120 104 L 40 104 L 40 40 L 88 40 L 88 88 ",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.tropicalSunrise,
  },
  {
    path: "M 24 56 L 24 24 L 72 24 L 72 104 L 120 104 L 120 72 L 24 72 L 24 152 L 40 152 L 40 136 L 104 136 L 104 40 L 152 40 L 152 120 L 40 120 L 40 40 L 88 40 L 88 24 L 136 24 L 136 152 L 56 152 L 56 56 L 88 56 L 88 88 ",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.pastelComfort,
  },
  {
    // "path": "M 136 72 L 136 40 L 88 40 L 88 24 L 104 24 L 104 88 L 136 88 L 136 152 L 104 152 L 104 120 L 88 120 L 88 136 L 40 136 L 40 152 L 72 152 L 72 120 L 40 120 L 40 104 L 24 104 L 24 72 L 40 72 L 40 40 L 72 40 L 72 24 L 24 24 L 24 56 L 56 56 L 56 104 L 72 104 L 72 56 L 120 56 L 120 24 L 152 24 L 152 120 L 120 120 L 120 72 L 88 72 L 88 88 ",
    path: "M 136 72 L 136 48 A 8 8 0 0 0 128 40 L 96 40 A 8 8 0 0 1 88 32 A 8 8 0 0 1 96 24 A 8 8 0 0 1 104 32 L 104 80 A 8 8 0 0 0 112 88 L 128 88 A 8 8 0 0 1 136 96 L 136 144 A 8 8 0 0 1 128 152 L 112 152 A 8 8 0 0 1 104 144 L 104 128 A 8 8 0 0 0 96 120 A 8 8 0 0 0 88 128 A 8 8 0 0 1 80 136 L 48 136 A 8 8 0 0 0 40 144 A 8 8 0 0 0 48 152 L 64 152 A 8 8 0 0 0 72 144 L 72 128 A 8 8 0 0 0 64 120 L 48 120 A 8 8 0 0 1 40 112 A 8 8 0 0 0 32 104 A 8 8 0 0 1 24 96 L 24 80 A 8 8 0 0 1 32 72 A 8 8 0 0 0 40 64 L 40 48 A 8 8 0 0 1 48 40 L 64 40 A 8 8 0 0 0 72 32 A 8 8 0 0 0 64 24 L 32 24 A 8 8 0 0 0 24 32 L 24 48 A 8 8 0 0 0 32 56 L 48 56 A 8 8 0 0 1 56 64 L 56 96 A 8 8 0 0 0 64 104 A 8 8 0 0 0 72 96 L 72 80 A 24 24 0 0 1 96 56 L 112 56 A 8 8 0 0 0 120 48 L 120 32 A 8 8 0 0 1 128 24 L 144 24 A 8 8 0 0 1 152 32 L 152 112 A 8 8 0 0 1 144 120 L 128 120 A 8 8 0 0 1 120 112 L 120 80 A 8 8 0 0 0 112 72 L 96 72 A 8 8 0 0 0 88 80 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.vibrantColorFiesta,
  },
  {
    path: "M 120 56 L 120 104 L 40 104 L 40 136 L 24 136 L 24 120 L 152 120 L 152 40 L 24 40 L 24 88 L 40 88 L 40 24 L 56 24 L 56 136 L 104 136 L 104 24 L 136 24 L 136 152 L 72 152 L 72 24 L 88 24 L 88 88 ",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.oliveGardenFeast,
  },
  {
    path: "M 104 152 L 80 152 A 8 8 0 0 1 72 144 A 8 8 0 0 0 64 136 L 48 136 A 8 8 0 0 1 40 128 L 40 112 A 8 8 0 0 1 48 104 L 64 104 A 8 8 0 0 1 72 112 A 8 8 0 0 0 80 120 L 128 120 A 8 8 0 0 1 136 128 A 8 8 0 0 1 128 136 A 8 8 0 0 0 120 144 A 8 8 0 0 0 128 152 L 144 152 A 8 8 0 0 0 152 144 L 152 80 A 8 8 0 0 0 144 72 A 8 8 0 0 0 136 80 L 136 96 A 8 8 0 0 1 128 104 L 96 104 A 8 8 0 0 0 88 112 L 88 128 A 8 8 0 0 0 96 136 A 8 8 0 0 0 104 128 L 104 80 A 8 8 0 0 1 112 72 A 8 8 0 0 0 120 64 L 120 32 A 8 8 0 0 0 112 24 L 32 24 A 8 8 0 0 0 24 32 L 24 144 A 8 8 0 0 0 32 152 L 48 152 A 8 8 0 0 0 56 144 L 56 64 A 8 8 0 0 0 48 56 A 8 8 0 0 0 40 64 L 40 80 A 8 8 0 0 0 48 88 L 64 88 A 8 8 0 0 0 72 80 L 72 48 A 8 8 0 0 1 80 40 A 8 8 0 0 1 88 48 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.sweetSummerMelody,
  },
  {
    path: "M 88 152 L 24 152 L 24 24 L 56 24 L 56 40 L 40 40 L 40 72 L 56 72 L 56 56 L 120 56 L 120 136 L 88 136 L 88 120 L 56 120 L 56 88 L 40 88 L 40 136 L 72 136 L 72 24 L 136 24 L 136 88 L 152 88 L 152 136 L 136 136 L 136 152 L 104 152 L 104 72 L 152 72 L 152 40 L 88 40 L 88 88 ",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.watermelonSorbet,
  },
  {
    path: "M 152 72 L 152 64 A 8 8 0 0 0 144 56 L 112 56 A 8 8 0 0 1 104 48 L 104 32 A 8 8 0 0 0 96 24 L 64 24 A 8 8 0 0 0 56 32 A 8 8 0 0 1 48 40 L 32 40 A 8 8 0 0 0 24 48 L 24 144 A 8 8 0 0 0 32 152 L 128 152 A 8 8 0 0 0 136 144 L 136 80 A 8 8 0 0 0 128 72 A 8 8 0 0 0 120 80 A 8 8 0 0 0 128 88 L 144 88 A 8 8 0 0 1 152 96 L 152 128 A 8 8 0 0 1 144 136 L 112 136 A 8 8 0 0 1 104 128 A 8 8 0 0 0 96 120 L 64 120 A 8 8 0 0 1 56 112 L 56 64 A 8 8 0 0 1 64 56 L 80 56 A 8 8 0 0 1 88 64 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.monochromeBeach,
  },
  {
    path: "M 24 40 L 24 32 A 8 8 0 0 1 32 24 L 96 24 A 8 8 0 0 1 104 32 A 8 8 0 0 0 112 40 L 144 40 A 8 8 0 0 1 152 48 L 152 80 A 8 8 0 0 1 144 88 L 112 88 A 8 8 0 0 0 104 96 L 104 128 A 8 8 0 0 1 96 136 L 80 136 A 8 8 0 0 1 72 128 L 72 96 A 8 8 0 0 0 64 88 A 8 8 0 0 0 56 96 L 56 144 A 8 8 0 0 0 64 152 L 112 152 A 8 8 0 0 0 120 144 L 120 80 A 8 8 0 0 0 112 72 L 32 72 A 8 8 0 0 1 24 64 A 8 8 0 0 1 32 56 L 128 56 A 8 8 0 0 1 136 64 L 136 112 A 8 8 0 0 1 128 120 L 48 120 A 8 8 0 0 1 40 112 L 40 48 A 8 8 0 0 1 48 40 L 80 40 A 8 8 0 0 1 88 48 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.oceanBlueSerenity,
  },
  {
    path: "M 40 24 L 32 24 A 8 8 0 0 0 24 32 L 24 96 A 8 8 0 0 0 32 104 L 128 104 A 8 8 0 0 1 136 112 A 8 8 0 0 1 128 120 L 80 120 A 8 8 0 0 1 72 112 L 72 48 A 8 8 0 0 0 64 40 L 48 40 A 8 8 0 0 0 40 48 L 40 144 A 8 8 0 0 0 48 152 L 128 152 A 8 8 0 0 0 136 144 A 8 8 0 0 0 128 136 L 64 136 A 8 8 0 0 1 56 128 L 56 32 A 8 8 0 0 1 64 24 L 80 24 A 8 8 0 0 1 88 32 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.sunnyBeachDay,
  },
  {
    // path: "M 152 152 L 152 136 L 120 136 L 120 104 L 104 104 L 104 24 L 152 24 L 152 72 L 24 72 L 24 88 L 56 88 L 56 56 L 40 56 L 40 120 L 24 120 L 24 104 L 56 104 L 56 152 L 136 152 L 136 88 L 152 88 L 152 120 L 72 120 L 72 24 L 88 24 L 88 88 ",
    path: "M 152 152 L 152 144 A 8 8 0 0 0 144 136 L 128 136 A 8 8 0 0 1 120 128 L 120 112 A 8 8 0 0 0 112 104 A 8 8 0 0 1 104 96 L 104 32 A 8 8 0 0 1 112 24 L 144 24 A 8 8 0 0 1 152 32 L 152 64 A 8 8 0 0 1 144 72 L 32 72 A 8 8 0 0 0 24 80 A 8 8 0 0 0 32 88 L 48 88 A 8 8 0 0 0 56 80 L 56 64 A 8 8 0 0 0 48 56 A 8 8 0 0 0 40 64 L 40 112 A 8 8 0 0 1 32 120 A 8 8 0 0 1 24 112 A 8 8 0 0 1 32 104 L 48 104 A 8 8 0 0 1 56 112 L 56 144 A 8 8 0 0 0 64 152 L 128 152 A 8 8 0 0 0 136 144 L 136 96 A 8 8 0 0 1 144 88 A 8 8 0 0 1 152 96 L 152 112 A 8 8 0 0 1 144 120 L 80 120 A 8 8 0 0 1 72 112 L 72 32 A 8 8 0 0 1 80 24 A 8 8 0 0 1 88 32 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.tropicalSunrise,
  },
  {
    path: "M 152 152 L 152 128 A 8 8 0 0 0 144 120 L 80 120 A 8 8 0 0 1 72 112 L 72 96 A 8 8 0 0 0 64 88 L 48 88 A 8 8 0 0 0 40 96 L 40 144 A 8 8 0 0 0 48 152 L 80 152 A 8 8 0 0 0 88 144 L 88 112 A 8 8 0 0 0 80 104 L 64 104 A 8 8 0 0 1 56 96 L 56 80 A 8 8 0 0 0 48 72 L 32 72 A 8 8 0 0 0 24 80 L 24 128 A 8 8 0 0 0 32 136 L 112 136 A 8 8 0 0 0 120 128 L 120 48 A 8 8 0 0 0 112 40 L 96 40 A 8 8 0 0 1 88 32 A 8 8 0 0 1 96 24 L 128 24 A 8 8 0 0 1 136 32 L 136 144 A 8 8 0 0 1 128 152 L 112 152 A 8 8 0 0 1 104 144 L 104 64 A 8 8 0 0 0 96 56 L 48 56 A 8 8 0 0 1 40 48 L 40 32 A 8 8 0 0 1 48 24 L 64 24 A 8 8 0 0 1 72 32 L 72 64 A 8 8 0 0 0 80 72 A 8 8 0 0 1 88 80 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.softLavender,
  },
  {
    path: "M 88 24 L 88 32 A 8 8 0 0 1 80 40 L 64 40 A 8 8 0 0 1 56 32 A 8 8 0 0 1 64 24 A 8 8 0 0 1 72 32 L 72 48 A 8 8 0 0 0 80 56 L 112 56 A 8 8 0 0 1 120 64 L 120 96 A 8 8 0 0 0 128 104 L 144 104 A 8 8 0 0 1 152 112 L 152 128 A 8 8 0 0 1 144 136 L 64 136 A 8 8 0 0 1 56 128 L 56 80 A 8 8 0 0 1 64 72 A 8 8 0 0 1 72 80 A 8 8 0 0 1 64 88 L 48 88 A 8 8 0 0 0 40 96 L 40 144 A 8 8 0 0 0 48 152 L 128 152 A 8 8 0 0 0 136 144 L 136 32 A 8 8 0 0 0 128 24 L 112 24 A 8 8 0 0 0 104 32 L 104 64 A 8 8 0 0 1 96 72 A 8 8 0 0 0 88 80 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.coolWaters,
  },
  {
    path: "M 120 152 L 144 152 A 8 8 0 0 0 152 144 A 8 8 0 0 0 144 136 L 128 136 A 8 8 0 0 1 120 128 A 8 8 0 0 1 128 120 A 8 8 0 0 0 136 112 L 136 96 A 8 8 0 0 0 128 88 A 8 8 0 0 1 120 80 L 120 48 A 8 8 0 0 1 128 40 L 144 40 A 8 8 0 0 1 152 48 L 152 96 A 8 8 0 0 1 144 104 L 112 104 A 8 8 0 0 0 104 112 L 104 144 A 8 8 0 0 1 96 152 L 80 152 A 8 8 0 0 1 72 144 A 8 8 0 0 0 64 136 L 48 136 A 8 8 0 0 0 40 144 A 8 8 0 0 0 48 152 A 8 8 0 0 0 56 144 L 56 112 A 8 8 0 0 1 64 104 A 8 8 0 0 1 72 112 A 8 8 0 0 1 64 120 L 48 120 A 8 8 0 0 1 40 112 L 40 32 A 8 8 0 0 1 48 24 L 80 24 A 8 8 0 0 1 88 32 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.pastelComfort,
  },
  {
    path: "M 104 152 L 112 152 A 8 8 0 0 0 120 144 L 120 64 A 8 8 0 0 1 128 56 L 144 56 A 8 8 0 0 0 152 48 A 8 8 0 0 0 144 40 L 64 40 A 8 8 0 0 0 56 48 L 56 144 A 8 8 0 0 1 48 152 A 8 8 0 0 1 40 144 A 8 8 0 0 1 48 136 L 128 136 A 8 8 0 0 1 136 144 A 8 8 0 0 0 144 152 A 8 8 0 0 0 152 144 L 152 128 A 8 8 0 0 0 144 120 L 48 120 A 8 8 0 0 1 40 112 L 40 48 A 8 8 0 0 0 32 40 A 8 8 0 0 1 24 32 A 8 8 0 0 1 32 24 L 64 24 A 8 8 0 0 1 72 32 L 72 144 A 8 8 0 0 0 80 152 A 8 8 0 0 0 88 144 L 88 112 A 8 8 0 0 1 96 104 L 144 104 A 8 8 0 0 0 152 96 A 8 8 0 0 0 144 88 L 112 88 A 8 8 0 0 1 104 80 L 104 64 A 8 8 0 0 0 96 56 L 32 56 A 8 8 0 0 0 24 64 A 8 8 0 0 0 32 72 L 128 72 A 8 8 0 0 0 136 64 L 136 32 A 8 8 0 0 0 128 24 L 96 24 A 8 8 0 0 0 88 32 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.oceanBlueSerenity,
  },
  {
    path: "M 104 24 L 112 24 A 8 8 0 0 1 120 32 A 8 8 0 0 1 112 40 A 8 8 0 0 0 104 48 L 104 64 A 8 8 0 0 1 96 72 L 48 72 A 8 8 0 0 0 40 80 A 8 8 0 0 0 48 88 L 64 88 A 8 8 0 0 1 72 96 A 8 8 0 0 0 80 104 A 8 8 0 0 1 88 112 A 8 8 0 0 0 96 120 A 8 8 0 0 0 104 112 L 104 96 A 8 8 0 0 1 112 88 L 128 88 A 8 8 0 0 1 136 96 L 136 112 A 8 8 0 0 1 128 120 A 8 8 0 0 1 120 112 L 120 80 A 8 8 0 0 1 128 72 A 8 8 0 0 0 136 64 L 136 32 A 8 8 0 0 1 144 24 A 8 8 0 0 1 152 32 L 152 48 A 8 8 0 0 1 144 56 L 48 56 A 8 8 0 0 1 40 48 L 40 32 A 8 8 0 0 1 48 24 L 80 24 A 8 8 0 0 1 88 32 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.sunnyBeachDay,
  },
  {
    path: "M 104 88 L 104 72 L 120 72 L 120 56 L 72 56 L 72 104 L 152 104 L 152 152 L 24 152 L 24 136 L 40 136 L 40 40 L 72 40 L 72 24 L 152 24 L 152 88 L 120 88 L 120 120 L 24 120 L 24 24 L 56 24 L 56 136 L 136 136 L 136 40 L 88 40 L 88 88 ",
    // roundedPath: "M 104 88 L 104 80 A 8 8 0 0 1 112 72 A 8 8 0 0 0 120 64 A 8 8 0 0 0 112 56 L 80 56 A 8 8 0 0 0 72 64 L 72 96 A 8 8 0 0 0 80 104 L 144 104 A 8 8 0 0 1 152 112 L 152 144 A 8 8 0 0 1 144 152 L 32 152 A 8 8 0 0 1 24 144 A 8 8 0 0 1 32 136 A 8 8 0 0 0 40 128 L 40 48 A 8 8 0 0 1 48 40 L 64 40 A 8 8 0 0 0 72 32 A 8 8 0 0 1 80 24 L 144 24 A 8 8 0 0 1 152 32 L 152 80 A 8 8 0 0 1 144 88 L 128 88 A 8 8 0 0 0 120 96 L 120 112 A 8 8 0 0 1 112 120 L 32 120 A 8 8 0 0 1 24 112 L 24 32 A 8 8 0 0 1 32 24 L 48 24 A 8 8 0 0 1 56 32 L 56 128 A 8 8 0 0 0 64 136 L 128 136 A 8 8 0 0 0 136 128 L 136 48 A 8 8 0 0 0 128 40 L 96 40 A 8 8 0 0 0 88 48 L 88 88",
    pathWidth: 12,
    viewBoxWidth: 176,
    viewBoxHeight: 176,
    ...palettes.oliveGardenFeast,
  },
];

export const simpleLabyrinth = {
  path: "M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256 a 320,320 0 0,1 -320,320 a 192,192 0 0,1 -192,-192 a 128,128 0 0,0 128,128 a 64,64 0 0,0 64,-64 a 64,64 0 0,1 64,-64 a 64,64 0 0,0 64,-64 a 64,64 0 0,0 -64,-64 a 64,64 0 0,0 -64,64 a 64,64 0 0,1 -64,64 a 128,128 0 0,1 -128,-128",
};

export const simpleSmallLabyrinth = {
  path: "M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256",
};
