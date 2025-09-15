"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Car, Wallet, Clock, MapPin, History, Settings, LogOut, Plus, CreditCard, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  email: string
  name: string
  role: string
  studentId?: string
  plateNumber: string
  vehicleType: string
}

interface ParkingZone {
  id: string
  name: string
  totalSlots: number
  availableSlots: number
  pricePerHour: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [walletBalance, setWalletBalance] = useState(25.5)
  const [activeReservation, setActiveReservation] = useState<any>(null)
  const router = useRouter()

  const parkingZones: ParkingZone[] = [
    { id: "main", name: "Main Parking Lot", totalSlots: 50, availableSlots: 12, pricePerHour: 2.5 },
    { id: "gle", name: "GLE Parking Lot", totalSlots: 30, availableSlots: 8, pricePerHour: 2.0 },
    { id: "back", name: "Back Gate Parking", totalSlots: 25, availableSlots: 15, pricePerHour: 1.5 },
  ]

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Simulate active reservation
    setActiveReservation({
      zone: "Main Parking Lot",
      startTime: "2:30 PM",
      endTime: "5:30 PM",
      cost: 7.5,
    })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/images/citu-logo.png" alt="CIT-U Logo" className="h-10 w-10" />
              <div>
                <h1 className="text-lg font-bold text-primary">CIT-U ParkChain</h1>
                <p className="text-sm text-muted-foreground">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">Manage your parking reservations and wallet</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Button className="h-auto p-4 flex-col gap-2" asChild>
                    <Link href="/reserve">
                      <Car className="h-6 w-6" />
                      Reserve Parking
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent" asChild>
                    <Link href="/wallet">
                      <CreditCard className="h-6 w-6" />
                      Add Funds
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Active Reservation */}
            {activeReservation && (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Clock className="h-5 w-5" />
                    Active Reservation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{activeReservation.zone}</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Start Time:</span>
                        <div className="font-medium">{activeReservation.startTime}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">End Time:</span>
                        <div className="font-medium">{activeReservation.endTime}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-muted-foreground">Total Cost:</span>
                      <span className="font-bold text-primary">${activeReservation.cost}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Parking Zones */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Available Parking Zones
                </CardTitle>
                <CardDescription>Real-time availability across campus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {parkingZones.map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium">{zone.name}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="text-sm text-muted-foreground">
                            {zone.availableSlots} of {zone.totalSlots} available
                          </div>
                          <Progress value={(zone.availableSlots / zone.totalSlots) * 100} className="w-20 h-2" />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">${zone.pricePerHour}/hr</div>
                        <Button size="sm" className="mt-2" asChild>
                          <Link href={`/reserve?zone=${zone.id}`}>Reserve</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Digital Wallet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">${walletBalance.toFixed(2)}</div>
                  <p className="text-sm text-muted-foreground mb-4">Available Balance</p>
                  <Button className="w-full" asChild>
                    <Link href="/wallet">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Funds
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Info
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Plate Number:</span>
                    <div className="font-medium">{user.plateNumber}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Vehicle Type:</span>
                    <div className="font-medium capitalize">{user.vehicleType}</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent" asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Update Vehicle
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/history">
                      <History className="h-4 w-4 mr-2" />
                      Parking History
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/blockchain">
                      <Shield className="h-4 w-4 mr-2" />
                      Blockchain Records
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
