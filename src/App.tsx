import "./App.css";
import { Analytics } from "@vercel/analytics/react";
import Labyrinth from "./Labyrinth";

function App() {
  return (
    <>
      <Labyrinth />

      <Analytics />
    </>
  );
}

export default App;
