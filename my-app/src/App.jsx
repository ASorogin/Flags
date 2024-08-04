import CountryFlag from '../src/components/CountryFlag';
import ScrollUpButton from '../src/components/ScrollBtn';
import './App.css'

function App() {
  return (
    <div className="App">
      <h1>Country Flag Finder</h1>
      <CountryFlag />
      <ScrollUpButton />
    </div>
  );
}

export default App;
