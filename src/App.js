import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import BlockWheels from './abis/BlockWheels.json';
import config from './config.json';
import './App.css'; 



import AddVehicle from './components/AddVehicle';
import AddVehicleData from './components/AddVehicleData';
import DisplayData from './components/DisplayData';
import TransferOwnership from './components/TransferOwnership';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [blockWheels, setBlockWheels] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('AddVehicle');

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum); // Initialize ethers provider (metamask)
        const network = await provider.getNetwork();
        const address = config[network.chainId].BlockWheels.address;
        const blockWheelsContract = new ethers.Contract(address, BlockWheels, provider);
        setBlockWheels(blockWheelsContract);

        const signer = provider.getSigner();
        setSigner(signer);

        setError('');
      } catch (error) {
        console.error('Error loading blockchain data:', error);
        setError('Error loading blockchain data. Please make sure you are connected to an Ethereum wallet.');
        toast.error('Error loading blockchain data. Please make sure you are connected to an Ethereum wallet.'); // Display error toast
      }
    };

    loadBlockchainData();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'AddVehicle':
        return <AddVehicle blockWheels={blockWheels} signer={signer} />;
      case 'AddVehicleData':
        return <AddVehicleData blockWheels={blockWheels} signer={signer} />;
      case 'DisplayData':
        return <DisplayData blockWheels={blockWheels} />;
      case 'TransferOwnership':
        return <TransferOwnership blockWheels={blockWheels} signer={signer} />;
      default:
        return null;
    }
  };
 

  return (
    <div className="container">
      <header>
        <h2 className="header__title">
          <strong>Block</strong>Wheels
        </h2>
      </header>
      <div className="tabs">
        <button className={activeTab === 'AddVehicle' ? 'active' : ''} onClick={() => setActiveTab('AddVehicle')}>Dodaj Vozilo</button>
        <button className={activeTab === 'AddVehicleData' ? 'active' : ''} onClick={() => setActiveTab('AddVehicleData')}>Vpis Podatkov</button>
        <button className={activeTab === 'DisplayData' ? 'active' : ''} onClick={() => setActiveTab('DisplayData')}>Preverjanje Zgodovine Vozila</button>
        <button className={activeTab === 'TransferOwnership' ? 'active' : ''} onClick={() => setActiveTab('TransferOwnership')}>Prenos Digitalnega Lastništva</button>
      </div>
      <div className="tab-content">
        {error && <p className="error"> {error}</p>}
        {renderTabContent()}
      </div>
      <ToastContainer containerId="coitainerA" />
    </div>
    
  );
}
export default App;