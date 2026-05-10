// "LabyrinthData"s get merged with defaultLabyrinth (a Labyrinth) to create a Labyrinth (i.e. that has all items defined)
export interface LabyrinthData {
  path: string;
  pathColor?: string;
  travelingColor?: string;
  backgroundColor?: string;
  pathWidth?: number;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
}

export interface Labyrinth {
  path: string;
  pathColor: string;
  travelingColor: string;
  backgroundColor: string;
  pathWidth: number;
  viewBoxWidth: number;
  viewBoxHeight: number;
}

export const defaultLabyrinth: Labyrinth = {
  path: "M112 237V159.5C100.5 155 88.1919 142 88 123C87.8081 104 103 83 128 83C153 83 167.901 103.5 168 123C168.099 142.5 155 155 144 159.5V209.5C181.5 203 216.133 169 216 123C215.867 77 179.967 35 128 35C76.0333 35 40 78 40 123C40 168 71.5 191 80 196.5V176.6C71.5 169.1 56.3889 150.997 56 123C55.5069 87.5 85 51 128 51C171 51 200.155 87 200 123C199.845 159 174 182 160 187V168.8C167 164.1 184 149 184 123C184 95 161.5 67 128 67C94.5 67 72 95 72 123C72 150 90.5 165.5 96 169V221.8C63.5 212.5 24 177 24 123C24 69 68.5 19 128 19C187.5 19 232 67 232 123C232 185.5 179 228 128 227V123",
  pathColor: "white",
  travelingColor: "#b58a47",
  backgroundColor: "black",
  pathWidth: 12,
  viewBoxWidth: 256,
  viewBoxHeight: 256,
};

export const labyrinths: LabyrinthData[] = [defaultLabyrinth];

export const simpleLabyrinth = {
  path: "M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256 a 320,320 0 0,1 -320,320 a 192,192 0 0,1 -192,-192 a 128,128 0 0,0 128,128 a 64,64 0 0,0 64,-64 a 64,64 0 0,1 64,-64 a 64,64 0 0,0 64,-64 a 64,64 0 0,0 -64,-64 a 64,64 0 0,0 -64,64 a 64,64 0 0,1 -64,64 a 128,128 0 0,1 -128,-128",
};

export const simpleSmallLabyrinth = {
  path: "M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256",
};
