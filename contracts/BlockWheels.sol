// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract BlockWheels {
    address public owner;
    
    constructor() {
        owner = msg.sender; // Set the contract deployer as the owner
    }

    struct Vehicle {
        string VIN;
        address owner;
        address[] allOwners;
        string brand;
        string model;
        uint256 yearOfManufacture;
        string color;
        uint256 enginePower;
        string transmission;
        string dateOfFirstRegistration;
        string countryOfFirstRegistration;
        uint256[] kilometers;
        string[] services;
        string[] technicalInspections;
        string[] accidents;
        uint256 timestamp;
        uint256[] timestamps;
    }

    struct OwnershipTransfer {
        address newOwner;
        bool approved;
    }

    modifier onlyOwner(string memory _VIN) {
        require(msg.sender == vehicles[_VIN].owner, "Only the owner of the vehicle can perform this action");
        _;
    }

    mapping(string => Vehicle) public vehicles;
    mapping(string => bool) public uniqueVIN; // Mapping to check VIN uniqueness
    mapping(string => OwnershipTransfer) public ownershipTransfers;

/******************************************Data Entry**********************************************/

    function addVehicle(
        string memory _VIN,
        string memory _brand,
        string memory _model,
        uint256 _yearOfManufacture,
        string memory _color,
        uint256 _enginePower,
        string memory _transmission
    ) public {
        require(!uniqueVIN[_VIN], "A vehicle with this VIN is already registered");
        vehicles[_VIN] = Vehicle({
            VIN: _VIN,
            owner: msg.sender,
            allOwners: new address[](0),
            brand: _brand,
            model: _model,
            yearOfManufacture: _yearOfManufacture,
            color: _color,
            enginePower: _enginePower,
            transmission: _transmission,
            dateOfFirstRegistration: "",
            countryOfFirstRegistration: "",
            kilometers: new uint256[](0) ,
            services: new string[](0) ,
            technicalInspections: new string[](0),
            accidents: new string[](0),
            timestamp: block.timestamp,
            timestamps: new uint256 [](0) 
        });
        uniqueVIN[_VIN] = true;
        vehicles[_VIN].allOwners.push(msg.sender);
    }

    function addVehicleData(
        string memory _VIN,
        string memory _dateOfFirstRegistration,
        string memory _countryOfFirstRegistration,
        uint256 _kilometers,
        string memory _services,
        string memory _technicalInspection,
        string memory _accidents
    ) public onlyOwner(_VIN) {
        uint256 previousKilometers =
        vehicles[_VIN].kilometers.length > 0 ? vehicles[_VIN].kilometers[vehicles[_VIN].kilometers.length - 1] : 0;
        require(_kilometers >= previousKilometers, "New kilometerss must be higher than previously recorded kilometers");
        
        vehicles[_VIN].dateOfFirstRegistration = _dateOfFirstRegistration;
        vehicles[_VIN].countryOfFirstRegistration = _countryOfFirstRegistration;
        vehicles[_VIN].kilometers.push(_kilometers);
        vehicles[_VIN].services.push(_services);
        vehicles[_VIN].technicalInspections.push(_technicalInspection);
        vehicles[_VIN].accidents.push(_accidents);
        vehicles[_VIN].timestamp = block.timestamp;
        vehicles[_VIN].timestamps.push(block.timestamp);
    }

/******************************************Data Display**********************************************/

    function displayData(string memory _VIN) public view returns (Vehicle memory) {
        return vehicles[_VIN];
    }

/******************************************Ownership Transfers**********************************************/

    function transferOwnership(string memory _VIN, address _newOwner) public onlyOwner(_VIN) {
        // Check if the caller is the current owner of the vehicle
        require(msg.sender == vehicles[_VIN].owner, "Only the current owner can transfer ownership");
        vehicles[_VIN].allOwners.push(_newOwner);
        ownershipTransfers[_VIN] = OwnershipTransfer({
            newOwner: _newOwner,
            approved: false
        });
        // Update the current owner
        vehicles[_VIN].owner = _newOwner;
    }
}
