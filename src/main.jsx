import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// In development, unregister any previously-installed service workers.
// A stale SW can serve cached JS chunks and cause "Invalid hook call" / duplicate React issues.
if (import.meta.env.DEV && "serviceWorker" in navigator) {
  navigator.serviceWorker
    .getRegistrations()
    .then((regs) => Promise.all(regs.map((r) => r.unregister())))
    .then(() => ("caches" in window ? caches.keys() : Promise.resolve([])))
    .then((keys) => Promise.all((keys || []).map((k) => caches.delete(k))))
    .catch(() => {
      // ignore
    });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
