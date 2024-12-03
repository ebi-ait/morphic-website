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
      <span className="search-icon">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.537 13.3474L11.2874 9.16111C11.9887 8.04422 12.3372 6.6874 12.1525 5.23958C11.7914 2.40598 9.36422 0.176336 6.47097 0.0108709C2.93104 -0.195961 -0.0041947 2.57558 4.49999e-06 6.0214C0.0042037 9.23143 2.67909 11.9327 5.93767 12.0195C7.04626 12.0485 8.09186 11.7837 8.99889 11.2997L13.3073 15.5439C13.9245 16.152 14.9198 16.152 15.537 15.5439C16.1543 14.9359 16.1543 13.9555 15.537 13.3474ZM6.10144 9.5665C4.10682 9.5665 2.49013 7.97389 2.49013 6.00899C2.49013 4.04409 4.10682 2.45149 6.10144 2.45149C8.09606 2.45149 9.71275 4.04409 9.71275 6.00899C9.71275 7.97389 8.09606 9.5665 6.10144 9.5665Z"
            fill="#1E1E1E"
          />
        </svg>
      </span>
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
