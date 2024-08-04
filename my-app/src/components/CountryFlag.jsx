import { useState, useEffect } from 'react';

function CountryFlag() {
  const [country, setCountry] = useState('');
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [category, setCategory] = useState('general');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Fetch all countries data initially
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        if (response.ok) {
          setAllCountries(data);
          setFilteredCountries(data);
          // Load favorites from localStorage
          const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
          setFavorites(savedFavorites);
        }
      } catch (err) {
        console.error('An error occurred while fetching countries:', err);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // Filter countries whenever the search input or category changes
    const filterCountries = () => {
      let filtered = allCountries;

      if (category === 'favorites') {
        filtered = allCountries.filter((c) => favorites.includes(c.cca3));
      } else {
        filtered = filtered.filter((c) =>
          c.name.common.toLowerCase().includes(country.toLowerCase())
        );
      }

      setFilteredCountries(filtered);
    };

    filterCountries();
  }, [country, category, allCountries, favorites]);

  const handleFilterChange = (e) => {
    setCountry(e.target.value);
  };

  const toggleFavorite = (country) => {
    const updatedFavorites = favorites.includes(country.cca3)
      ? favorites.filter((fav) => fav !== country.cca3)
      : [...favorites, country.cca3];

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <div>
      <input
        type="text"
        value={country}
        onChange={handleFilterChange}
        placeholder="Enter country name"
      />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="general">General Info</option>
        <option value="languages">Languages</option>
        <option value="currencies">Currencies</option>
        <option value="favorites">Favorites</option>
      </select>
      <div>
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <div key={country.cca3} style={{ margin: '20px 0', display: 'flex', alignItems: 'center' }}>
              <img
                src={country.flags.svg}
                alt={country.flags.alt || `Flag of ${country.name.common}`}
                style={{ maxWidth: '100px', marginRight: '20px' }}
              />
              <div>
                <h2>{country.name.common}</h2>
                <button onClick={() => toggleFavorite(country)}>
                  {favorites.includes(country.cca3) ? '★' : '☆'} Favorite
                </button>
                {category === 'general' && (
                  <div>
                    <p><strong>Capital:</strong> {country.capital ? country.capital[0] : 'N/A'}</p>
                    <p><strong>Region:</strong> {country.region}</p>
                    <p><strong>Subregion:</strong> {country.subregion}</p>
                    <p><strong>Population:</strong> {country.population ? country.population.toLocaleString() : 'N/A'}</p>
                    <p><strong>Area:</strong> {country.area ? country.area.toLocaleString() : 'N/A'} km²</p>
                    <p><strong>Timezones:</strong> {country.timezones ? country.timezones.join(', ') : 'N/A'}</p>
                  </div>
                )}
                {category === 'languages' && (
                  <p><strong>Languages:</strong> {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                )}
                {category === 'currencies' && (
                  <p><strong>Currencies:</strong> {country.currencies
                    ? Object.values(country.currencies)
                        .map(currency => `${currency.name} (${currency.symbol})`)
                        .join(', ')
                    : 'N/A'}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No countries found</p>
        )}
      </div>
    </div>
  );
}

export default CountryFlag;
