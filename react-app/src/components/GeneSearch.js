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
  const [useMorphiCGenesOnly, setUseMorphiCGenesOnly] = useState(false);

  // Fetch suggestions function wrapped with debounce
  const fetchSuggestions = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.length === 0) {
        setSuggestions([]);
        setIsDropdownVisible(false);
        return;
      }
      
      try {
        // Determine the API endpoint based on the checkbox state
        const apiUrl = useMorphiCGenesOnly
          ? `https://46ucfedadd.execute-api.us-east-1.amazonaws.com/api/release-1-gene-search?query=${searchQuery}` : `https://46ucfedadd.execute-api.us-east-1.amazonaws.com/api/gene-search?query=${searchQuery}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        setSuggestions(data);
        setIsDropdownVisible(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300), // 300ms debounce delay
    [useMorphiCGenesOnly] // Add the checkbox state as a dependency
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

  // Handle checkbox toggle
  const handleCheckboxChange = (e) => {
    setUseMorphiCGenesOnly(e.target.checked);
  };

  return (
    <div className="gene-search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a gene  e.g. HEY1, PAX6, PPARG"
        onFocus={() => setIsDropdownVisible(true)}
        onBlur={() => setTimeout(() => setIsDropdownVisible(false), 100)}
        className="icon-search search-box"
      />
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="morphic-genes-checkbox"
          checked={useMorphiCGenesOnly}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="morphic-genes-checkbox" className="checkbox-label">MorPhiC genes only</label>
      </div>
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
