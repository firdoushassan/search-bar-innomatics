import React, { useState, useEffect, useRef } from 'react';
import './SearchBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ data }) => {
    const [query, setQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const inputRef = useRef(null);

    const handleInputChange = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setQuery(searchValue);

        // Filter countries based on the query
        const results = data.filter((item) => {
            return (item.country && item.country.toLowerCase().includes(searchValue)) ||
                   (item.capital && item.capital.toLowerCase().includes(searchValue));
        });

        setFilteredResults(results);
        setShowDetails(false); // Hide details when input changes
        setFocusedIndex(-1); // Reset focused index
    };

    function handleSearchClick() {
        if (selectedCountry) {
            setShowDetails(!showDetails); // Toggle the visibility of detailed information
        }
    }

    const handleKeyDown = (event) => {
        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setFocusedIndex((prevIndex) => (prevIndex + 1) % filteredResults.length);
                break;
            case 'ArrowUp':
                event.preventDefault();
                setFocusedIndex((prevIndex) => (prevIndex - 1 + filteredResults.length) % filteredResults.length);
                break;
            case 'Enter':
                if (focusedIndex >= 0 && focusedIndex < filteredResults.length) {
                    handleSuggestionClick(filteredResults[focusedIndex]);
                    inputRef.current.focus();
                }
                break;
            case 'Escape':
                setFilteredResults([]); // Clear suggestions on Escape
                break;
            default:
                break;
        }
    };

    const handleSuggestionClick = (item) => {
        setQuery(item.country); // Fill the selected suggestion into the search bar
        setSelectedCountry(item);
        setFilteredResults([]); // Clear the suggestions list
        setShowDetails(false); // Do not show details immediately
        inputRef.current.focus(); // Refocus the input field
    };

    useEffect(() => {
        inputRef.current.addEventListener('keydown', handleKeyDown);

        return () => {
            inputRef.current.removeEventListener('keydown', handleKeyDown);
        };
    }, [filteredResults, focusedIndex]);

    const highlightText = (text, highlight) => {
        if (!text) return ''; // If text is undefined or null, return an empty string.
        if (!highlight.trim()) return text; // If highlight query is empty, return the original text.
    
        const regex = new RegExp(`(${highlight})`, 'gi');
        const parts = text.split(regex); // Split the text based on the regex match.
    
        return parts.map((part, index) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span key={index} className="highlight">{part}</span>
            ) : (
                part
            )
        );
    };

    return (
        <div className="search-container">
            <div className="search-bar-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by country or capital..."
                    value={query} // Ensure this value is set to the query state
                    onChange={handleInputChange}
                    ref={inputRef}
                />
                <button className="search-button" onClick={handleSearchClick}>
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </button>
                {query && (
                    <ul className="suggestions-list">
                        {filteredResults.map((item, index) => (
                            <li 
                                key={index} 
                                className={`suggestion-item ${index === focusedIndex ? 'focused' : ''}`}
                                onClick={() => handleSuggestionClick(item)}
                            >
                                {highlightText(item.country, query)} ({highlightText(item.capital, query)})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {showDetails && selectedCountry && (
                <div className="country-details">
                    <h2>{selectedCountry.country}</h2>
                    <p><strong>Capital:</strong> {selectedCountry.capital}</p>
                    <p><strong>Population:</strong> {selectedCountry.population}</p>
                    <p><strong>Languages:</strong> {selectedCountry.official_language}</p>
                    <p><strong>Currency:</strong> {selectedCountry.currency}</p>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
