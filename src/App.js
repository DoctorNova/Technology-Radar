import './App.css';
import TechnologyRadar from './components/TechnologyRadar';

function App() {
  const entries = [{
    label: "1",
    title: "JavaScript",
    ring: "Adopt",
    segment: "Languages & Frameworks",
    isNew: true,
    moved: true
  }, {
    label: "2",
    title: "Java",
    ring: "Hold",
    segment: "Languages & Frameworks",
    isNew: false,
    moved: true
  }, {
    label: "3",
    title: "Python",
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
