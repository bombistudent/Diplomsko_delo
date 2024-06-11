import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TransferOwnership = ({ blockWheels, signer }) => {
  const [VIN, setVin] = useState('');
  const [newOwner, setNewOwner] = useState('');

  const handleTransferOwnership = async (e) => {
    e.preventDefault();

    if (!blockWheels) {
      console.error("BlockWheels contract not connected");
      return;
    }

    try {
      const contractWithSigner = blockWheels.connect(signer);
      const tx = await contractWithSigner.transferOwnership(
        VIN,
        newOwner
      );

      await tx.wait();
      console.log("Ownership transferred successfully!");
      toast.success('Lastništvo vozila z VIN šteilko ('+ VIN +') uspešno preneseno na lastnika ('+ newOwner+')!');
      // Clear form after successful transaction
      setVin('');
      setNewOwner('');
    } catch (error) {
      if (error.message.includes("Only the owner of the vehicle can perform this action")) {
        toast.error('Samo lastnik vozila lahko prenese lastništvo za vozilo z VIN številko: ' + VIN + ''); // Show specific error message
        console.error("Error transferring ownership:", error);
      } else {
        toast.error('Napaka pri prenosu lastništva. Prosimo preverite podatke in ponovno izpolnite vnosna polja!'); // Show generic error message
      }


    }
  };

  return (
    <div>
      <form className="add-vehicle-form" onSubmit={handleTransferOwnership}>
      <h2>Prenesite digitalno lastništvo kupcu vozila!</h2>
        <label htmlFor="VIN">VIN:</label>
        <input
          type="text"
          id="VIN"
          placeholder='Vnesite VIN številko vozila'
          value={VIN}
          onChange={(e) => setVin(e.target.value)}
        />
        <label htmlFor="newOwner">Novi Lastnik:</label>
        <input
          type="text"
          id="newOwner"
          placeholder='Vnesite kupčev naslov denarnice'
          value={newOwner}
          onChange={(e) => setNewOwner(e.target.value)}
        />
        <button className="submit-btn" type="submit">Prenesi Lastništvo</button>
      </form>
      <ToastContainer />
    </div>
  );
  
};

export default TransferOwnership;
