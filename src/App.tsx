import { Outlet } from "react-router";
import "./App.css";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <>
      <Outlet />
      <Analytics />
    </>
  );
}

export default App;
