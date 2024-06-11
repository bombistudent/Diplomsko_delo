import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AddVehicleData = ({ blockWheels, signer }) => {
  const [VIN, setVin] = useState('');
  const [dateOfFirstRegistration, setDateOfFirstRegistration] = useState('');
  const [countryOfFirstRegistration, setCountryOfFirstRegistration] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [services, setServices] = useState('');
  const [technicalInspection, setTehnicalInspection] = useState('');
  const [accidents, setAccidents] = useState('');

  const handleSubmitaddVehicleData = async (e) => {
    e.preventDefault();

    if (!blockWheels) {
      console.error("BlockWheels contract not connected");
      return;
    }

    const kilometriParsed = parseInt(kilometers, 10);

    // Function to format the date to DD.MM.YYYY
    const formatDate = (dateString) => {
      const [year, month, day] = dateString.split('-');
      return `${day}.${month}.${year}`;
    };

    const formattedDatumPrveRegistracije = formatDate(dateOfFirstRegistration);
    const formattedTehnicniPregled = formatDate(technicalInspection);

    /*console.log("VIN:", VIN);
    console.log("Datum Prve Registracije:", formattedDatumPrveRegistracije);
    console.log("Drzava Prve Registracije:", countryOfFirstRegistration);
    console.log("Kilometri:", kilometriParsed);
    console.log("Servisi:", services);
    console.log("Tehnicni Pregled:", formattedTehnicniPregled);
    console.log("Karambolirano:", accidents);*/

    try {
      const contractWithSigner = blockWheels.connect(signer);
      console.log("Connected to contract with signer");

      const tx = await contractWithSigner.addVehicleData(
        VIN,
        formattedDatumPrveRegistracije,
        countryOfFirstRegistration,
        kilometriParsed,
        services,
        formattedTehnicniPregled,
        accidents
      );

      console.log("Transaction hash:", tx.hash);
      await tx.wait();
      console.log("Podatki uspešno vpisani!");
      toast.success('Podatki za vozilo z VIN številko (' + VIN + ') uspešno vpisani!');
      // Clear form after successful transaction (optional)
      setVin('');
      setDateOfFirstRegistration('');
      setCountryOfFirstRegistration('');
      setKilometers('');
      setServices('');
      setTehnicalInspection('');
      setAccidents('');
    } catch (error) {
      console.error("Napaka pri vpisu podatkov:", error);
      if (error.message.includes("Only the owner of the vehicle can perform this action")) {
        toast.error('Samo lastnik vozila lahko vnaša podatke za vozilo s to VIN številko: ' + VIN + ''); // Show specific error message
      } else {
        toast.error('Napaka pri vpisu podatkov. Prosimo preverite podatke in ponovno izpolnite vnosna polja!'); // Show generic error message
      }
    }
  };

  return (
    <div className="add-vehicle-form">
      <h2>Tukaj lahko redno vpisujete podatke o svojem vozilu!</h2>
      <h5>Če se podatki v katerem polju niso spremenili jih lahko pustite prazne!</h5>
      <form onSubmit={handleSubmitaddVehicleData}>
        <label htmlFor="VIN">VIN:</label>
        <input
          type="text"
          id="VIN"
          placeholder="VIN številka vašega vozila"
          value={VIN}
          onChange={(e) => setVin(e.target.value)}
        />
        <label htmlFor="dateOfFirstRegistration">Datum prve registracije:</label>
        <input
          type="date"
          id="dateOfFirstRegistration"
          placeholder="Datum, ko ste prvič registrirali vozilo"
          value={dateOfFirstRegistration}
          onChange={(e) => setDateOfFirstRegistration(e.target.value)}
        />
        <label htmlFor="countryOfFirstRegistration">Država prve registracije:</label>
        <input
          type="text"
          id="countryOfFirstRegistration"
          placeholder="Država, kjer ste prvič registrirali vozilo"
          value={countryOfFirstRegistration}
          onChange={(e) => setCountryOfFirstRegistration(e.target.value)}
        />
        <label htmlFor="kilometers">Kilometri:</label>
        <input
          type="text"
          id="kilometers"
          placeholder="Trenutno število prevoženih kilometrov"
          value={kilometers}
          onChange={(e) => setKilometers(e.target.value)}
        />
        <label htmlFor="services">Servisi:</label>
        <input
          type="text"
          id="services"
          placeholder="Servisi, ki so bili opravili na vozilu"
          value={services}
          onChange={(e) => setServices(e.target.value)}
        />
        <label htmlFor="technicalInspection">Datum tehničnega pregleda:</label>
        <input
          type="date"
          id="technicalInspection"
          placeholder="Datum, ko ste opravili tehnični pregled"
          value={technicalInspection}
          onChange={(e) => setTehnicalInspection(e.target.value)}
        />
        <label htmlFor="accidents">Karambolirano:</label>
        <input
          type="text"
          id="accidents"
          placeholder="Ali je bilo vozilo vpleteno v prometno nesrečo (da/ne)"
          value={accidents}
          onChange={(e) => setAccidents(e.target.value)}
        />
        <button className="submit-btn" type="submit">Vpiši podatke</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddVehicleData;
