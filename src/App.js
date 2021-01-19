import './App.css';
import TechnologyRadar from './components/TechnologyRadar';

function App() {
  const entries = [{
    label: "1. JavaScript",
    ring: "Adopt",
    segment: "Languages & Frameworks",
    isNew: true,
    moved: 1
  }, {
    label: "2. Java",
    ring: "Hold",
    segment: "Languages & Frameworks",
    isNew: false,
    moved: -1
  }, {
    label: "1. Python",
    ring: "Adopt",
    segment: "Languages & Frameworks",
  }]
  return (
    <div className="App">
      <TechnologyRadar entries={entries} />
    </div>
  );
}

export default App;
