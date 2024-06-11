import React, { useState } from 'react';
import Select from 'react-select'; // Step 2: Import Select

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddVehicle = ({ blockWheels, signer }) => {
  const [VIN, setVin] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [yearOfManufacture, setYearOfManufacture] = useState('');
  const [color, setColor] = useState('');
  const [enginePower, setEnginePower] = useState('');
  const [transmission, setTransmission] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!blockWheels) {
      console.error("BlockWheels contract not connected");
      return;
    }

    try {
      const contractWithSigner = blockWheels.connect(signer);
      const tx = await contractWithSigner.addVehicle(
        VIN,
        brand,
        model,
        yearOfManufacture,
        color,
        enginePower,
        transmission
      );
      //console.log("transmission", transmission);
      //console.log("yearOfManufacture", yearOfManufacture);

      await tx.wait();
      //console.log("Transaction successful!");
      toast.success('Vozilo z VIN številko (' + VIN + ') uspešno dodano!');
      // Clear form after successful transaction (optional)
      setVin('');
      setBrand('');
      setModel('');
      setYearOfManufacture('');
      setColor('');
      setEnginePower('');
      setTransmission('');
    } catch (error) {
      console.error("Error calling addVehicle:", error);
      if (error.message.includes("Vozilo s to VIN stevilko je ze zapisano")) {
        toast.error('Vozilo s to VIN številko (' + VIN + ') že obstaja.'); 
      } else {
        toast.error('Napaka pri dodajanju vozila. Prosimo preverite podatke in ponovno izpolnite vnosna polja!'); 
      }
    }
  };

  const yearOptions = Array.from({ length: 80 }, (_, index) => {
    const year = new Date().getFullYear() - index;
    return { value: year, label: year.toString() };
  });

  const handleChange = selectedOption => {
    setYearOfManufacture(selectedOption ? selectedOption.value : '');
  };

  const menjalnikOptions = [
    { value: 'Ročni', label: 'Ročni' },
    { value: 'Avtomatski', label: 'Avtomatski' },
  ];

  const handleMenjalnikChange = selectedOption_menjalnik => {
    console.log(selectedOption_menjalnik); // Debugging line to see what is passed
    setTransmission(selectedOption_menjalnik ? selectedOption_menjalnik.label : '');
  };

  return (
    <>
    <form className="add-vehicle-form" onSubmit={handleSubmit}>
    <h2>Dodajte svoje vozilo v sistem!</h2>
      <label htmlFor="VIN">VIN:</label>
      <input
        type="text"
        id="VIN"
        placeholder="VIN številka vašega vozila"
        value={VIN}
        onChange={(e) => setVin(e.target.value)}
      />
      <label htmlFor="brand">Znamka:</label>
      <input
        type="text"
        id="brand"
        placeholder="Znamka vašega vozila"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />
      <label htmlFor="model">Model:</label>
      <input
        type="text"
        id="model"
        placeholder="Model vašega vozila"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />
      <label htmlFor="yearOfManufacture">Leto proizvodnje:</label>
      <div className="select-wrapper">
        <Select
          id="yearOfManufacture"
          value={yearOptions.find(option => option.value === yearOfManufacture)}
          onChange={handleChange}
          options={yearOptions}
          placeholder="Izberi leto proizvodnje..."
          isClearable={true}
          styles={{
            control: (provided) => ({
              ...provided,
              fontSize: '14px', 
            }),
            menu: (provided) => ({
              ...provided,
              fontSize: '14px', 
            }),
            option: (provided) => ({
              ...provided,
              fontSize: '14px', 
            }),
          }}
        />
      </div>
      <label htmlFor="color">Barva:</label>
      <input
        type="text"
        id="color"
        placeholder="Barva vašega vozila"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <label htmlFor="enginePower">Moč motorja(kW):</label>
      <input
        type="text"
        id="enginePower"
        placeholder="Moč motorja vašega vozila v kilowatih (kW)"
        value={enginePower}
        onChange={(e) => setEnginePower(e.target.value)}
      />
      <label htmlFor="transmission">Menjalnik:</label>
      <div className="select-wrapper">
      <Select
      id="transmission"
      value={menjalnikOptions.find(option => option.label === transmission)}
      onChange={handleMenjalnikChange}
      options={menjalnikOptions}
      placeholder="Menjalnik vašega vozila"
      isClearable={true}
      styles={{
        control: (provided) => ({
          ...provided,
          fontSize: '14px', 
        }),
        menu: (provided) => ({
          ...provided,
          fontSize: '14px', 
        }),
        option: (provided) => ({
          ...provided,
          fontSize: '14px', 
        }),
      }}
      />
      </div>
      <button className="submit-btn" type="submit">Dodaj vozilo</button>
    </form>
    <ToastContainer />
    </>
  );
};

export default AddVehicle;
