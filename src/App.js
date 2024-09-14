import React from 'react';
import './App.css';
import data from './data.json'; // Import the JSON file
import SearchBar from './components/SearchBar';

function App() {
    return (
        <div className="App">
            <h1>Search Bar Innomatics</h1>
            <SearchBar data={data} />
        </div>
    );
}

export default App;
