import "@workspace/ui/globals.css";
import ReactDOM from "react-dom/client";

import { App } from "./app.js";

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
