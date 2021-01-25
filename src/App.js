import "./App.css";
import TechnologyRadar from "./components/TechnologyRadar";
import entries from "./entries.json";

function App() {
  const segments = [
    { label: "Languages", color: "#8D2145" },
    { label: "Frameworks", color: "#8D2145" },
    { label: "Data Management", color: "#3DB5BE" },
    { label: "Tools", color: "#83AD78" },
    { label: "Other Topics", color: "#E88744" },
  ];

  return (
    <div className="App">
      <TechnologyRadar
        segments={segments}
        entries={entries}
      />
    </div>
  );
}

export default App;
