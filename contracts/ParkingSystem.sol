// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// ERC20 Token for parking payments
contract ParkingToken is ERC20, Ownable {
    constructor() ERC20("CIT-U ParkChain Token", "PARK") {
        _mint(msg.sender, 1000000 * 10**decimals()); // Initial supply
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 2; // 2 decimal places for easier pricing
    }
}

// Main parking system contract
contract CITUParkingSystem is Ownable, ReentrancyGuard {
    ParkingToken public parkingToken;

    struct ParkingZone {
        string name;
        uint256 totalSlots;
        uint256 availableSlots;
        uint256 pricePerHour; // Price in PARK tokens
        bool isActive;
    }

    struct Vehicle {
        string plateNumber;
        string vehicleType;
        address owner;
        bool isRegistered;
    }

    struct Reservation {
        uint256 zoneId;
        address user;
        string plateNumber;
        uint256 startTime;
        uint256 endTime;
        uint256 totalCost;
        bool isActive;
        bool isCompleted;
    }

    struct User {
        string name;
        string email;
        string role;
        string studentId;
        bool isRegistered;
        uint256[] vehicleIds;
        uint256[] reservationIds;
    }

    // State variables
    mapping(uint256 => ParkingZone) public parkingZones;
    mapping(uint256 => Vehicle) public vehicles;
    mapping(uint256 => Reservation) public reservations;
    mapping(address => User) public users;
    mapping(address => uint256) public userBalances;
    
    uint256 public nextZoneId = 1;
    uint256 public nextVehicleId = 1;
    uint256 public nextReservationId = 1;

    // Events
    event UserRegistered(address indexed user, string name, string email);
    event VehicleRegistered(uint256 indexed vehicleId, address indexed owner, string plateNumber);
    event ZoneCreated(uint256 indexed zoneId, string name, uint256 totalSlots, uint256 pricePerHour);
    event ReservationMade(uint256 indexed reservationId, address indexed user, uint256 zoneId, uint256 startTime, uint256 endTime);
    event ReservationCompleted(uint256 indexed reservationId, address indexed user);
    event ReservationCancelled(uint256 indexed reservationId, address indexed user, uint256 refundAmount);
    event FundsDeposited(address indexed user, uint256 amount);
    event FundsWithdrawn(address indexed user, uint256 amount);

    constructor(address _parkingToken) {
        parkingToken = ParkingToken(_parkingToken);
        
        // Initialize default parking zones for CIT-U
        createZone("Main Parking Lot", 50, 250); // 2.50 PARK per hour
        createZone("GLE Parking Lot", 30, 200);  // 2.00 PARK per hour
        createZone("Back Gate Parking", 25, 150); // 1.50 PARK per hour
    }

    // User registration
    function registerUser(
        string memory _name,
        string memory _email,
        string memory _role,
        string memory _studentId
    ) external {
        require(!users[msg.sender].isRegistered, "User already registered");
        
        users[msg.sender] = User({
            name: _name,
            email: _email,
            role: _role,
            studentId: _studentId,
            isRegistered: true,
            vehicleIds: new uint256[](0),
            reservationIds: new uint256[](0)
        });

        emit UserRegistered(msg.sender, _name, _email);
    }

    // Vehicle registration
    function registerVehicle(
        string memory _plateNumber,
        string memory _vehicleType
    ) external returns (uint256) {
        require(users[msg.sender].isRegistered, "User must be registered first");
        
        uint256 vehicleId = nextVehicleId++;
        vehicles[vehicleId] = Vehicle({
            plateNumber: _plateNumber,
            vehicleType: _vehicleType,
            owner: msg.sender,
            isRegistered: true
        });

        users[msg.sender].vehicleIds.push(vehicleId);
        
        emit VehicleRegistered(vehicleId, msg.sender, _plateNumber);
        return vehicleId;
    }

    // Create parking zone (admin only)
    function createZone(
        string memory _name,
        uint256 _totalSlots,
        uint256 _pricePerHour
    ) public onlyOwner returns (uint256) {
        uint256 zoneId = nextZoneId++;
        parkingZones[zoneId] = ParkingZone({
            name: _name,
            totalSlots: _totalSlots,
            availableSlots: _totalSlots,
            pricePerHour: _pricePerHour,
            isActive: true
        });

        emit ZoneCreated(zoneId, _name, _totalSlots, _pricePerHour);
        return zoneId;
    }

    // Reserve parking zone
    function reserveZone(
        uint256 _zoneId,
        string memory _plateNumber,
        uint256 _durationHours
    ) external nonReentrant returns (uint256) {
        require(users[msg.sender].isRegistered, "User must be registered");
        require(parkingZones[_zoneId].isActive, "Zone is not active");
        require(parkingZones[_zoneId].availableSlots > 0, "No available slots");
        require(_durationHours > 0 && _durationHours <= 24, "Invalid duration");

        ParkingZone storage zone = parkingZones[_zoneId];
        uint256 totalCost = zone.pricePerHour * _durationHours;
        
        require(userBalances[msg.sender] >= totalCost, "Insufficient balance");

        // Deduct payment
        userBalances[msg.sender] -= totalCost;
        
        // Create reservation
        uint256 reservationId = nextReservationId++;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + (_durationHours * 1 hours);

        reservations[reservationId] = Reservation({
            zoneId: _zoneId,
            user: msg.sender,
            plateNumber: _plateNumber,
            startTime: startTime,
            endTime: endTime,
            totalCost: totalCost,
            isActive: true,
            isCompleted: false
        });

        // Update zone availability
        zone.availableSlots--;
        
        // Update user reservations
        users[msg.sender].reservationIds.push(reservationId);

        emit ReservationMade(reservationId, msg.sender, _zoneId, startTime, endTime);
        return reservationId;
    }

    // Complete reservation
    function completeReservation(uint256 _reservationId) external {
        Reservation storage reservation = reservations[_reservationId];
        require(reservation.user == msg.sender, "Not your reservation");
        require(reservation.isActive, "Reservation not active");
        require(block.timestamp >= reservation.endTime, "Reservation not yet expired");

        reservation.isActive = false;
        reservation.isCompleted = true;

        // Free up the slot
        parkingZones[reservation.zoneId].availableSlots++;

        emit ReservationCompleted(_reservationId, msg.sender);
    }

    // Cancel reservation (with partial refund if cancelled early)
    function cancelReservation(uint256 _reservationId) external nonReentrant {
        Reservation storage reservation = reservations[_reservationId];
        require(reservation.user == msg.sender, "Not your reservation");
        require(reservation.isActive, "Reservation not active");

        uint256 refundAmount = 0;
        
        // Calculate refund based on time remaining
        if (block.timestamp < reservation.startTime) {
            // Full refund if cancelled before start time
            refundAmount = reservation.totalCost;
        } else if (block.timestamp < reservation.endTime) {
            // Partial refund based on remaining time
            uint256 remainingTime = reservation.endTime - block.timestamp;
            uint256 totalDuration = reservation.endTime - reservation.startTime;
            refundAmount = (reservation.totalCost * remainingTime) / totalDuration;
        }

        reservation.isActive = false;
        
        // Process refund
        if (refundAmount > 0) {
            userBalances[msg.sender] += refundAmount;
        }

        // Free up the slot
        parkingZones[reservation.zoneId].availableSlots++;

        emit ReservationCancelled(_reservationId, msg.sender, refundAmount);
    }

    // Deposit funds to user balance
    function depositFunds(uint256 _amount) external {
        require(_amount > 0, "Amount must be greater than 0");
        require(parkingToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        userBalances[msg.sender] += _amount;
        emit FundsDeposited(msg.sender, _amount);
    }

    // Withdraw funds from user balance
    function withdrawFunds(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(userBalances[msg.sender] >= _amount, "Insufficient balance");
        
        userBalances[msg.sender] -= _amount;
        require(parkingToken.transfer(msg.sender, _amount), "Transfer failed");
        
        emit FundsWithdrawn(msg.sender, _amount);
    }

    // View functions
    function getZoneAvailability(uint256 _zoneId) external view returns (uint256) {
        return parkingZones[_zoneId].availableSlots;
    }

    function getUserReservations(address _user) external view returns (uint256[] memory) {
        return users[_user].reservationIds;
    }

    function getUserVehicles(address _user) external view returns (uint256[] memory) {
        return users[_user].vehicleIds;
    }

    function getUserBalance(address _user) external view returns (uint256) {
        return userBalances[_user];
    }

    function getActiveReservations(address _user) external view returns (uint256[] memory) {
        uint256[] memory userReservations = users[_user].reservationIds;
        uint256 activeCount = 0;
        
        // Count active reservations
        for (uint256 i = 0; i < userReservations.length; i++) {
            if (reservations[userReservations[i]].isActive) {
                activeCount++;
            }
        }
        
        // Create array of active reservation IDs
        uint256[] memory activeReservations = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < userReservations.length; i++) {
            if (reservations[userReservations[i]].isActive) {
                activeReservations[index] = userReservations[i];
                index++;
            }
        }
        
        return activeReservations;
    }

    // Admin functions
    function updateZonePrice(uint256 _zoneId, uint256 _newPrice) external onlyOwner {
        require(parkingZones[_zoneId].isActive, "Zone does not exist");
        parkingZones[_zoneId].pricePerHour = _newPrice;
    }

    function toggleZoneStatus(uint256 _zoneId) external onlyOwner {
        require(parkingZones[_zoneId].totalSlots > 0, "Zone does not exist");
        parkingZones[_zoneId].isActive = !parkingZones[_zoneId].isActive;
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 balance = parkingToken.balanceOf(address(this));
        require(parkingToken.transfer(owner(), balance), "Transfer failed");
    }
}
