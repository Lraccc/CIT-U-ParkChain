"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, MapPin, Car, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

interface ParkingZone {
  id: string
  name: string
  totalSlots: number
  availableSlots: number
  pricePerHour: number
  description: string
  features: string[]
}

export default function ReservePage() {
  const [selectedZone, setSelectedZone] = useState<string>("")
  const [duration, setDuration] = useState<string>("2")
  const [plateNumber, setPlateNumber] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [reservationSuccess, setReservationSuccess] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  const parkingZones: ParkingZone[] = [
    {
      id: "main",
      name: "Main Parking Lot",
      totalSlots: 50,
      availableSlots: 12,
      pricePerHour: 2.5,
      description: "Primary parking area near the main building with easy access to all facilities.",
      features: ["24/7 Security", "CCTV Coverage", "Well-lit", "Close to Main Building"],
    },
    {
      id: "gle",
      name: "GLE Parking Lot",
      totalSlots: 30,
      availableSlots: 8,
      pricePerHour: 2.0,
      description: "Convenient parking for engineering students and faculty.",
      features: ["Engineering Building Access", "Covered Parking", "EV Charging Stations"],
    },
    {
      id: "back",
      name: "Back Gate Parking",
      totalSlots: 25,
      availableSlots: 15,
      pricePerHour: 1.5,
      description: "Alternative entrance with quick access and competitive rates.",
      features: ["Quick Entry/Exit", "Budget Friendly", "Less Crowded"],
    },
  ]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setPlateNumber(parsedUser.plateNumber || "")

    // Pre-select zone from URL params
    const zoneParam = searchParams.get("zone")
    if (zoneParam) {
      setSelectedZone(zoneParam)
    }
  }, [router, searchParams])

  const calculateTotal = () => {
    const zone = parkingZones.find((z) => z.id === selectedZone)
    if (!zone || !duration) return 0
    return zone.pricePerHour * Number.parseFloat(duration)
  }

  const handleReservation = async () => {
    if (!selectedZone || !duration || !plateNumber) {
      setError("Please fill in all required fields")
      return
    }

    const zone = parkingZones.find((z) => z.id === selectedZone)
    if (!zone || zone.availableSlots === 0) {
      setError("Selected zone is not available")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store reservation in localStorage (in real app, this would be on blockchain)
      const reservation = {
        id: Date.now(),
        zoneId: selectedZone,
        zoneName: zone.name,
        plateNumber,
        duration: Number.parseFloat(duration),
        totalCost: calculateTotal(),
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + Number.parseFloat(duration) * 60 * 60 * 1000).toISOString(),
        status: "active",
      }

      const existingReservations = JSON.parse(localStorage.getItem("reservations") || "[]")
      existingReservations.push(reservation)
      localStorage.setItem("reservations", JSON.stringify(existingReservations))

      setReservationSuccess(true)
    } catch (err) {
      setError("Failed to create reservation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (reservationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center border-green-200">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-700">Reservation Confirmed!</CardTitle>
            <CardDescription>Your parking spot has been successfully reserved</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 mb-2">Reservation Details</div>
              <div className="font-medium">{parkingZones.find((z) => z.id === selectedZone)?.name}</div>
              <div className="text-sm text-muted-foreground">Duration: {duration} hours</div>
              <div className="text-sm text-muted-foreground">Total Cost: ${calculateTotal().toFixed(2)}</div>
            </div>
            <div className="space-y-2">
              <Button className="w-full" asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/reserve">Make Another Reservation</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <img src="/images/citu-logo.png" alt="CIT-U Logo" className="h-8 w-8" />
              <div>
                <h1 className="text-lg font-bold text-primary">Reserve Parking</h1>
                <p className="text-sm text-muted-foreground">Choose your parking zone</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Zone Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Available Parking Zones</h2>
              <p className="text-muted-foreground mb-6">
                Select a parking zone based on your needs and proximity to your destination.
              </p>
            </div>

            <div className="grid gap-4">
              {parkingZones.map((zone) => (
                <Card
                  key={zone.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedZone === zone.id ? "border-primary ring-2 ring-primary/20" : "border-border"
                  } ${zone.availableSlots === 0 ? "opacity-50" : ""}`}
                  onClick={() => zone.availableSlots > 0 && setSelectedZone(zone.id)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          {zone.name}
                          {selectedZone === zone.id && (
                            <Badge className="bg-primary text-primary-foreground">Selected</Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-2">{zone.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${zone.pricePerHour}/hr</div>
                        {zone.availableSlots === 0 ? (
                          <Badge variant="destructive">Full</Badge>
                        ) : (
                          <Badge variant="secondary">{zone.availableSlots} available</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Availability</span>
                        <div className="flex items-center gap-2">
                          <Progress value={(zone.availableSlots / zone.totalSlots) * 100} className="w-24 h-2" />
                          <span className="text-sm font-medium">
                            {zone.availableSlots}/{zone.totalSlots}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {zone.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Reservation Form */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Reservation Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="zone">Selected Zone</Label>
                  <Select value={selectedZone} onValueChange={setSelectedZone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a parking zone" />
                    </SelectTrigger>
                    <SelectContent>
                      {parkingZones.map((zone) => (
                        <SelectItem key={zone.id} value={zone.id} disabled={zone.availableSlots === 0}>
                          {zone.name} - ${zone.pricePerHour}/hr
                          {zone.availableSlots === 0 && " (Full)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (hours)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0.5">30 minutes</SelectItem>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="4">4 hours</SelectItem>
                      <SelectItem value="6">6 hours</SelectItem>
                      <SelectItem value="8">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plateNumber">Vehicle Plate Number</Label>
                  <Input
                    id="plateNumber"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="Enter plate number"
                  />
                </div>

                {selectedZone && duration && (
                  <div className="bg-card border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Zone:</span>
                      <span className="font-medium">{parkingZones.find((z) => z.id === selectedZone)?.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span className="font-medium">{duration} hours</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Rate:</span>
                      <span className="font-medium">
                        ${parkingZones.find((z) => z.id === selectedZone)?.pricePerHour}/hr
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-primary">
                      <span>Total Cost:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  className="w-full"
                  onClick={handleReservation}
                  disabled={!selectedZone || !duration || !plateNumber || isLoading}
                >
                  {isLoading ? "Processing..." : "Reserve Parking Spot"}
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  By reserving, you agree to the parking terms and conditions. Payment will be processed via blockchain.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
