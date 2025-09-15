import { ethers } from "ethers"

// Contract addresses (these would be set after deployment)
export const PARKING_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_PARKING_TOKEN_ADDRESS || ""
export const PARKING_SYSTEM_ADDRESS = process.env.NEXT_PUBLIC_PARKING_SYSTEM_ADDRESS || ""

// Contract ABIs (simplified for demo)
export const PARKING_TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
]

export const PARKING_SYSTEM_ABI = [
  "function registerUser(string name, string email, string role, string studentId)",
  "function registerVehicle(string plateNumber, string vehicleType) returns (uint256)",
  "function reserveZone(uint256 zoneId, string plateNumber, uint256 durationHours) returns (uint256)",
  "function completeReservation(uint256 reservationId)",
  "function cancelReservation(uint256 reservationId)",
  "function depositFunds(uint256 amount)",
  "function withdrawFunds(uint256 amount)",
  "function getZoneAvailability(uint256 zoneId) view returns (uint256)",
  "function getUserReservations(address user) view returns (uint256[])",
  "function getUserVehicles(address user) view returns (uint256[])",
  "function getUserBalance(address user) view returns (uint256)",
  "function getActiveReservations(address user) view returns (uint256[])",
  "function parkingZones(uint256) view returns (string name, uint256 totalSlots, uint256 availableSlots, uint256 pricePerHour, bool isActive)",
  "function reservations(uint256) view returns (uint256 zoneId, address user, string plateNumber, uint256 startTime, uint256 endTime, uint256 totalCost, bool isActive, bool isCompleted)",
  "function vehicles(uint256) view returns (string plateNumber, string vehicleType, address owner, bool isRegistered)",
  "function users(address) view returns (string name, string email, string role, string studentId, bool isRegistered)",
  "event UserRegistered(address indexed user, string name, string email)",
  "event VehicleRegistered(uint256 indexed vehicleId, address indexed owner, string plateNumber)",
  "event ReservationMade(uint256 indexed reservationId, address indexed user, uint256 zoneId, uint256 startTime, uint256 endTime)",
  "event ReservationCompleted(uint256 indexed reservationId, address indexed user)",
  "event ReservationCancelled(uint256 indexed reservationId, address indexed user, uint256 refundAmount)",
  "event FundsDeposited(address indexed user, uint256 amount)",
  "event FundsWithdrawn(address indexed user, uint256 amount)",
]

export interface ParkingZone {
  id: number
  name: string
  totalSlots: number
  availableSlots: number
  pricePerHour: number
  isActive: boolean
}

export interface Reservation {
  id: number
  zoneId: number
  user: string
  plateNumber: string
  startTime: number
  endTime: number
  totalCost: number
  isActive: boolean
  isCompleted: boolean
}

export interface Vehicle {
  id: number
  plateNumber: string
  vehicleType: string
  owner: string
  isRegistered: boolean
}

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.Signer | null = null
  private parkingTokenContract: ethers.Contract | null = null
  private parkingSystemContract: ethers.Contract | null = null

  async connectWallet(): Promise<string> {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask is not installed")
    }

    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()

      // Initialize contracts
      if (PARKING_TOKEN_ADDRESS && PARKING_SYSTEM_ADDRESS) {
        this.parkingTokenContract = new ethers.Contract(PARKING_TOKEN_ADDRESS, PARKING_TOKEN_ABI, this.signer)

        this.parkingSystemContract = new ethers.Contract(PARKING_SYSTEM_ADDRESS, PARKING_SYSTEM_ABI, this.signer)
      }

      const address = await this.signer.getAddress()
      return address
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw error
    }
  }

  async getWalletAddress(): Promise<string> {
    if (!this.signer) {
      throw new Error("Wallet not connected")
    }
    return await this.signer.getAddress()
  }

  async getTokenBalance(address: string): Promise<number> {
    if (!this.parkingTokenContract) {
      throw new Error("Contract not initialized")
    }

    const balance = await this.parkingTokenContract.balanceOf(address)
    return Number.parseFloat(ethers.formatUnits(balance, 2)) // 2 decimals for PARK token
  }

  async getUserBalance(address: string): Promise<number> {
    if (!this.parkingSystemContract) {
      throw new Error("Contract not initialized")
    }

    const balance = await this.parkingSystemContract.getUserBalance(address)
    return Number.parseFloat(ethers.formatUnits(balance, 2))
  }

  async registerUser(name: string, email: string, role: string, studentId: string): Promise<string> {
    if (!this.parkingSystemContract) {
      throw new Error("Contract not initialized")
    }

    const tx = await this.parkingSystemContract.registerUser(name, email, role, studentId)
    await tx.wait()
    return tx.hash
  }

  async registerVehicle(plateNumber: string, vehicleType: string): Promise<string> {
    if (!this.parkingSystemContract) {
      throw new Error("Contract not initialized")
    }

    const tx = await this.parkingSystemContract.registerVehicle(plateNumber, vehicleType)
    await tx.wait()
    return tx.hash
  }

  async getParkingZones(): Promise<ParkingZone[]> {
    if (!this.parkingSystemContract) {
      throw new Error("Contract not initialized")
    }

    const zones: ParkingZone[] = []

    // Get the first 3 zones (Main, GLE, Back Gate)
    for (let i = 1; i <= 3; i++) {
      try {
        const zone = await this.parkingSystemContract.parkingZones(i)
        zones.push({
          id: i,
          name: zone.name,
          totalSlots: Number(zone.totalSlots),
          availableSlots: Number(zone.availableSlots),
          pricePerHour: Number.parseFloat(ethers.formatUnits(zone.pricePerHour, 2)),
          isActive: zone.isActive,
        })
      } catch (error) {
        console.error(`Error fetching zone ${i}:`, error)
        break
      }
    }

    return zones
  }

  async reserveZone(zoneId: number, plateNumber: string, durationHours: number): Promise<string> {
    if (!this.parkingSystemContract) {
      throw new Error("Contract not initialized")
    }

    const tx = await this.parkingSystemContract.reserveZone(zoneId, plateNumber, durationHours)
    await tx.wait()
    return tx.hash
  }

  async getUserReservations(address: string): Promise<Reservation[]> {
    if (!this.parkingSystemContract) {
      throw new Error("Contract not initialized")
    }

    const reservationIds = await this.parkingSystemContract.getUserReservations(address)
    const reservations: Reservation[] = []

    for (const id of reservationIds) {
      try {
        const reservation = await this.parkingSystemContract.reservations(id)
        reservations.push({
          id: Number(id),
          zoneId: Number(reservation.zoneId),
          user: reservation.user,
          plateNumber: reservation.plateNumber,
          startTime: Number(reservation.startTime),
          endTime: Number(reservation.endTime),
          totalCost: Number.parseFloat(ethers.formatUnits(reservation.totalCost, 2)),
          isActive: reservation.isActive,
          isCompleted: reservation.isCompleted,
        })
      } catch (error) {
        console.error(`Error fetching reservation ${id}:`, error)
      }
    }

    return reservations
  }

  async depositFunds(amount: number): Promise<string> {
    if (!this.parkingTokenContract || !this.parkingSystemContract) {
      throw new Error("Contracts not initialized")
    }

    const amountWei = ethers.parseUnits(amount.toString(), 2)

    // First approve the parking system to spend tokens
    const approveTx = await this.parkingTokenContract.approve(PARKING_SYSTEM_ADDRESS, amountWei)
    await approveTx.wait()

    // Then deposit the funds
    const depositTx = await this.parkingSystemContract.depositFunds(amountWei)
    await depositTx.wait()

    return depositTx.hash
  }

  async cancelReservation(reservationId: number): Promise<string> {
    if (!this.parkingSystemContract) {
      throw new Error("Contract not initialized")
    }

    const tx = await this.parkingSystemContract.cancelReservation(reservationId)
    await tx.wait()
    return tx.hash
  }

  async completeReservation(reservationId: number): Promise<string> {
    if (!this.parkingSystemContract) {
      throw new Error("Contract not initialized")
    }

    const tx = await this.parkingSystemContract.completeReservation(reservationId)
    await tx.wait()
    return tx.hash
  }

  // Utility function to format timestamp to readable date
  formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString()
  }

  // Check if user is connected to the correct network
  async checkNetwork(): Promise<boolean> {
    if (!this.provider) {
      return false
    }

    const network = await this.provider.getNetwork()
    // For demo purposes, we'll accept any network
    // In production, you'd check for specific networks like Polygon testnet
    return true
  }
}

// Singleton instance
export const blockchainService = new BlockchainService()

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}
