import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const kitUid = window.innerWidth < 768 ? '7343a67e82' : 'f8b2bd3ed1'
const kitScript = document.createElement('script')
kitScript.async = true
kitScript.dataset.uid = kitUid
kitScript.src = `https://mathis-ghio-wingfoil.kit.com/${kitUid}/index.js`
document.body.appendChild(kitScript)

createRoot(document.getElementById("root")!).render(<App />);
