import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

function FilterComp() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [filterOptions, setFilterOptions] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState('');

  const options = [
    { value: 'Alphabets', label: 'Alphabets' },
    { value: 'Numbers', label: 'Numbers' },
    { value: 'HighestLowercase', label: 'Highest Lowercase Alphabet' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedJson = JSON.parse(jsonInput);
      setError('');  
      const response = await axios.post('https://bajaj-backend-36l1.onrender.com/bfhl', parsedJson);
      setResponseData(response.data);
    } catch (err) {
      setError('Invalid JSON format. Please correct it.');
      setResponseData(null);
    }
  };

  const handleFilterChange = (selectedOptions) => {
    setFilterOptions(selectedOptions);
  
    if (!responseData) return;
  
    let filtered = '';
    const numbers = responseData.numbers || [];
    const alphabets = responseData.alphabets || [];
    const highestLowercase = responseData.highest_lowercase_alphabet || [];
  
    if (selectedOptions.some(opt => opt.value === 'Numbers')) {
      filtered += 'Numbers: ' + numbers.join(', ') + '; ';
    }
    if (selectedOptions.some(opt => opt.value === 'Alphabets')) {
      filtered += 'Alphabets: ' + alphabets.join(', ') + '; ';
    }
    if (selectedOptions.some(opt => opt.value === 'HighestLowercase')) {
      filtered += 'Highest Lowercase Alphabet: ' + (highestLowercase[0] || '') + '; ';
    }
    setFilteredResponse(filtered);
  };
  
  return (
    <div className="App">
      <h1>JSON Filter Application</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter JSON:
          <input 
            type="text" 
            value={jsonInput} 
            onChange={(e) => setJsonInput(e.target.value)} 
            placeholder='{"data":["A","1","z"]}'
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {responseData && (
        <>
          <Select
            isMulti
            options={options}
            onChange={handleFilterChange}
          />
          <div>
            <h2>Filtered Response:</h2>
            <p>{filteredResponse}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default FilterComp;
