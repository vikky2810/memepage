import React from 'react';
import Header from './components/header';
import MemeList from './components/memelist';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <MemeList />
    </div>
  );
}

export default App;