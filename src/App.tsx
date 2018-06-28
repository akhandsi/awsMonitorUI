import * as React from 'react';
import './App.css';
import {LandingPage} from "./components/LandingPage/LandingPage";

class App extends React.Component {
  public render() {
    return (
      <div className="App">
        <LandingPage/>
      </div>
    );
  }
}

export default App;
