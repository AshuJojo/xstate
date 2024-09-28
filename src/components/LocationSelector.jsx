import { useEffect, useState } from "react"
import styles from './LocationSelector.module.css';

const LocationSelector = () => {
    const BASE_URL = 'https://crio-location-selector.onrender.com';
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');


    const fetchCountries = async () => {
        try {
            const res = await fetch(`${BASE_URL}/countries`);
            return await res.json();
        } catch (e) {
            console.error('An error occurred while fetching countries');
            return [];
        }
    }
    const fetchStates = async (country) => {
        try {
            const res = await fetch(`${BASE_URL}/country=${country}/states`);
            return await res.json();
        } catch (e) {
            console.error('An error occurred while fetching states');
            return [];
        }
    }
    const fetchCities = async (country, state) => {
        try {
            const res = await fetch(`${BASE_URL}/country=${country}/state=${state}/cities`);
            return await res.json();
        } catch (e) {
            console.error('An error occurred while fetching cities');
            return [];
        }
    }

    useEffect(() => {
        (async () => {
            const countries = await fetchCountries();
            setCountries(countries);
        })();
    }, []);

    useEffect(() => {
        setSelectedState(() => '')
        setStates(() => [])
        setSelectedCity(() => '')
        setCities(() => [])
        if (selectedCountry == '')
            return;

        (async () => {
            const states = await fetchStates(selectedCountry);
            setStates(states);
        })();
    }, [selectedCountry]);

    useEffect(() => {
        setSelectedCity(() => '')
        setCities(() => [])
        if (selectedState == '')
            return;

        (async () => {
            const cities = await fetchCities(selectedCountry, selectedState);
            setCities(cities);
        })();
    }, [selectedState]);

    return (
        <div className={styles.container}>
            <h1>Select Location</h1>

            <br />
            <div style={{ display: "flex", gap: '8px' }}>
                <select value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value) }}>
                    <option value="" disabled>Select Country</option>
                    {countries.length > 0 && countries.map((country, idx) => {
                        return (
                            <option key={idx} value={country}>{country}</option>
                        )
                    })}
                </select>
                <select disabled={selectedCountry === ''} value={selectedState} onChange={(e) => { setSelectedState(e.target.value) }}>
                    <option value="" disabled>Select State</option>
                    {states.length > 0 && states.map((state, idx) => {
                        return (
                            <option key={idx} value={state}>{state}</option>
                        )
                    })}
                </select>
                <select disabled={selectedState === ''} value={selectedCity} onChange={(e) => { setSelectedCity(e.target.value) }}>
                    <option value="" disabled>Select City</option>
                    {cities.length > 0 && cities.map((city, idx) => {
                        return (
                            <option key={idx} value={city}>{city}</option>
                        )
                    })}
                </select>

            </div>
            {selectedCountry && selectedState && selectedCity &&
                <p style={{ fontWeight: "bold" }}>You Selected <span style={{ fontSize: '24px' }}>{selectedCity}</span>, <span style={{ color: 'gray' }}>{selectedState}, {selectedCountry}</span></p>}
        </div>
    )
}

export default LocationSelector