import './App.css';
import TechnologyRadar from './TechnologyRadar';
import queryString from 'query-string';

function App() {
  const params = queryString.parse(window.location.search);
  const entries = params.entries ? JSON.parse(params.entries) : undefined;
  const rings = params.rings ? JSON.parse(params.rings) : undefined;

  return (
    <div className="App">
      <TechnologyRadar entries={entries} rings={rings} />
    </div>
  );
}

export default App;
