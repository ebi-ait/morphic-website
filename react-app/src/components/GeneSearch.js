import React, { useState, useEffect, useCallback } from 'react';
import { navigate } from 'gatsby';

// Debounce function to limit how often the API is called
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const GeneSearch = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Fetch suggestions function wrapped with debounce
  const fetchSuggestions = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length === 0) {
        setSuggestions([]);
        setIsDropdownVisible(false);
        return;
      }
      
      try {
        const response = await fetch(`https://46ucfedadd.execute-api.us-east-1.amazonaws.com/api/gene-search?query=${searchQuery}`);
        const data = await response.json();
        setSuggestions(data);
        setIsDropdownVisible(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300), // 300ms debounce delay
    []
  );

  // Effect to call fetchSuggestions whenever query changes
  useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  // Handle selecting a suggestion
  const handleSuggestionClick = (hgncId) => {
    setIsDropdownVisible(false);
    navigate(`/genes/${hgncId}`);
  };

  return (
    <div className="gene-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a gene"
        onFocus={() => setIsDropdownVisible(true)}
        onBlur={() => setTimeout(() => setIsDropdownVisible(false), 100)}
      />
      {isDropdownVisible && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.HGNC_ID}
              onMouseDown={() => handleSuggestionClick(suggestion.HGNC_ID)}
            >
              <strong>{suggestion.Name}</strong> - {suggestion.Full_Name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GeneSearch;
