import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DisplayData = ({ blockWheels }) => {
  // State to store the VIN
  const [VIN, setVin] = useState('');

  // State to store the vehicle data or an error message
  const [vehicleOrError, setVehicleOrError] = useState(null);

  // State to store the current index for dynamic data display
  const [currentIndex, setCurrentIndex] = useState(1);


  const handleGetVehicleData = async () => {
    try {
      if (!VIN) {
        throw new Error("Prosim vnesite VIN številko!");
      }
  
      // Check if the VIN exists in the contract
      const vinExists = await blockWheels.uniqueVIN(VIN);
      if (!vinExists) {
        throw new Error("Vozilo s to VIN številko ne obstaja v sistemu!");
      }
      // Fetch vehicle data if VIN exists
      const result = await blockWheels.displayData(VIN);
      setVehicleOrError(result); // Set vehicle data in state
      //console.log('Vehicle data:', result);
      toast.success('Poročilo o vozilu z VIN številko (' + VIN + ') uspešno pridobljeno');
    } catch (error) {
      console.error('Napaka pri pridobivanju poročila:', error);
      toast.error(error.message); // Display error message as a toast
      //setVehicleOrError(`Error: ${error.message}`); // Set error message with details
    }
  };

  const handleIndexChange = (newIndex) => {
    if (newIndex >= 1 && newIndex <= getNumberOfIndexes(vehicleOrError)) { // Validate index range
      setCurrentIndex(newIndex);
    }
  };

  const getNumberOfIndexes = (data) => {
    if (!data) return 0;

    let maxIndex = 0;
    for (const category in data) {
      if (Array.isArray(data[category])) {
        maxIndex = Math.max(maxIndex, data[category].length);
      }
    }
    return maxIndex;
  };

  const renderStaticData = (data) => {
    return (
      <>
        <p><strong>VIN:</strong> {data.VIN}</p>
        <p><strong>Trenutni lastnik:</strong> {data.owner}</p>
        <p><strong>Vsi lastniki:</strong></p>
        <ul>
          {data.allOwners.map((address, index) => (
            <li key={index}>{address}</li>
          ))}
        </ul>
        <p><strong>Znamka:</strong> {data.brand}</p>
        <p><strong>Model:</strong> {data.model}</p>
        <p><strong>Leto proizvodnje:</strong> {data.yearOfManufacture.toString()}</p>
        <p><strong>Barva:</strong> {data.color}</p>
        <p><strong>Moč motorja:</strong> {data.enginePower.toString()}</p>
        <p><strong>Menjalnik:</strong> {data.transmission}</p>
        <p><strong>Datum prve registracije:</strong> {data.dateOfFirstRegistration.toString()}</p>
        <p><strong>Država prve registracije:</strong> {data.countryOfFirstRegistration}</p>
        <p><strong>Zadnjič spremenjeno:</strong> {new Date(data.timestamp * 1000).toLocaleString()}</p>
      </>
    );
  };

  const renderDynamicData = (data) => {
    return (
      <>
        {data.kilometers && (  // Ensure data.kilometri exists before rendering
          <>
            <h4>Prevoženi kilometri</h4>
            <ul>
              {data.kilometers.filter((km, index) => index === currentIndex - 1).map((km) => ( // Filter by current index
                <li key={`kilometers-${currentIndex}-${km}`}> {/* Unique key with km value */}
                  <strong></strong> {km.toString()}
                </li>
              ))}
            </ul>
          </>
        )}
        {data.services && ( // Ensure data.servisi exists before rendering
          <>
            <h4>Servisi</h4>
            <ul>
              {data.services.filter((service, index) => index === currentIndex - 1).map((service) => ( // Filter by current index
                <li key={`services-${currentIndex}-${service}`}> {/* Unique key with servis value */}
                  <strong></strong> {service}
                </li>
              ))}
            </ul>
          </>
        )}
        {data.tehnicalInspections && ( // Ensure data.tehnicniPregled exists before rendering
          <>
            <h4>Datum tehničnega pregleda</h4>
            <ul>
              {data.tehnicalInspections.filter((inpection, index) => index === currentIndex - 1).map((inspection) => ( // Filter by current index
                <li key={`tehnicalInspections-${currentIndex}-${inspection}`}> {/* Unique key with pregled value */}
                  <strong></strong> {inspection}
                </li>
              ))}
            </ul>
          </>
        )}
        {data.accidents && Array.isArray(data.accidents) && ( // Ensure data.karambolirano is an array
          <>
            <h4>Karambolirano</h4>
            <ul>
              {data.accidents.filter((accident, index) => index === currentIndex - 1).map((accident) => ( // Filter by current index
                <li key={`accidents-${currentIndex}-${accident}`}> {/* Unique key with karambol value */}
                  <strong></strong> {accident}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Spremembe so bile narejene ob */}
        {data.timestamps && Array.isArray(data.timestamps) && (
          <>
            <h4>Spremembe so bile narejene ob:</h4>
            <ul>
              {data.timestamps.filter((_, index) => index === currentIndex - 1).map((timestampsi, index) => ( // Filter by current index
                <li key={`timestamps-${index}`}>
                  {new Date(timestampsi * 1000).toLocaleString()}
                </li>
              ))}
            </ul>
          </>
        )}
      </>
    );
  };
  return (
    <div className="add-vehicle-form">
      <h2>Preveri zgodovino vozila!</h2>
      <input
        type="text"
        placeholder="Vnesite VIN številko vozila"
        value={VIN}
        onChange={(e) => setVin(e.target.value)}
      />
      <button className="submit-btn" onClick={handleGetVehicleData}>
        Pridobi poročilo
      </button>
      {vehicleOrError && vehicleOrError.error ? (
        <p className="error-msg">Error: {vehicleOrError.error}</p>
      ) : null}
      {vehicleOrError && !vehicleOrError.error && vehicleOrError !== null ? (
        <>
          {renderStaticData(vehicleOrError)}
          <h3><p><strong>Vpis: {currentIndex} of {getNumberOfIndexes(vehicleOrError)}</strong></p></h3>
          {renderDynamicData(vehicleOrError)}
          <button className="submit-btn" onClick={() => handleIndexChange(currentIndex - 1)} disabled={currentIndex === 1}>Prejšnji vpis</button>
          <button className="submit-btn1" onClick={() => handleIndexChange(currentIndex + 1)} disabled={currentIndex === getNumberOfIndexes(vehicleOrError)}>Naslednji vpis</button>
        </>
      ) : null}
      <ToastContainer />
    </div>
  );
};

export default DisplayData;