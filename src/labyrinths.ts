// "LabyrinthData"s get merged with defaultLabyrinth (a Labyrinth) to create a Labyrinth (i.e. that has all items defined)
export interface LabyrinthData {
  path: string;
  pathColor?: string;
  travelingColor?: string;
  pathWidth?: number;
}

export interface Labyrinth {
  path: string;
  pathColor: string;
  travelingColor: string;
  pathWidth: number;
}

export const defaultLabyrinth: Labyrinth = {
  path: "M104 234V157C92 151.5 80.1919 139 80 120C79.8081 101 95 80 120 80C145 80 159.901 100.5 160 120C160.099 139.5 148 150.5 136 157V206.5C175 199.5 208.133 166 208 120C207.867 74 171.967 32 120 32C68.0333 32 32 75 32 120C32 165 64 189.5 72 194V174C72 174 47.8834 156.5 48 120C48.1166 83.5 76.5 48 120 48C163.5 48 192.155 84 192 120C191.845 156 166 179 152 184V166C160 159 176 148 176 120C176 92 154 64 120 64C86 64 64 92 64 120C64 148 80 160.5 88 166V219C57.5 210 16 176 16 120C16 64 60.5 16 120 16C179.5 16 224 64 224 120C224 176 177 224 120 224V120",
  pathColor: "white",
  travelingColor: "#b58a47",
  pathWidth: 12,
};

export const labyrinths: LabyrinthData[] = [defaultLabyrinth];

export const simpleLabyrinth = {
  path: "M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256 a 320,320 0 0,1 -320,320 a 192,192 0 0,1 -192,-192 a 128,128 0 0,0 128,128 a 64,64 0 0,0 64,-64 a 64,64 0 0,1 64,-64 a 64,64 0 0,0 64,-64 a 64,64 0 0,0 -64,-64 a 64,64 0 0,0 -64,64 a 64,64 0 0,1 -64,64 a 128,128 0 0,1 -128,-128",
};

export const simpleSmallLabyrinth = {
  path: "M 512,64 a 192,192 0 0,1 192,192 a 192,192 0 0,1 -192,192 a 256,256 0 0,0 256,-256",
};
