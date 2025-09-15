"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Users,
  Car,
  DollarSign,
  BarChart3,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Edit,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AdminStats {
  totalUsers: number
  activeReservations: number
  totalRevenue: number
  occupancyRate: number
  dailyReservations: number
  monthlyGrowth: number
}

interface ParkingZone {
  id: string
  name: string
  totalSlots: number
  availableSlots: number
  pricePerHour: number
  isActive: boolean
  revenue: number
}

interface UserData {
  id: string
  name: string
  email: string
  role: string
  joinDate: string
  totalSpent: number
  activeReservations: number
  status: "active" | "suspended"
}

interface ReservationData {
  id: string
  user: string
  zone: string
  plateNumber: string
  startTime: string
  endTime: string
  status: "active" | "completed" | "cancelled"
  amount: number
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    activeReservations: 23,
    totalRevenue: 15420.75,
    occupancyRate: 68,
    dailyReservations: 45,
    monthlyGrowth: 12.5,
  })

  const [zones, setZones] = useState<ParkingZone[]>([
    {
      id: "main",
      name: "Main Parking Lot",
      totalSlots: 50,
      availableSlots: 12,
      pricePerHour: 2.5,
      isActive: true,
      revenue: 8750.25,
    },
    {
      id: "gle",
      name: "GLE Parking Lot",
      totalSlots: 30,
      availableSlots: 8,
      pricePerHour: 2.0,
      isActive: true,
      revenue: 4320.5,
    },
    {
      id: "back",
      name: "Back Gate Parking",
      totalSlots: 25,
      availableSlots: 15,
      pricePerHour: 1.5,
      isActive: true,
      revenue: 2350.0,
    },
  ])

  const [users, setUsers] = useState<UserData[]>([
    {
      id: "1",
      name: "Juan Dela Cruz",
      email: "juan.delacruz@cit.edu",
      role: "student",
      joinDate: "2024-01-15",
      totalSpent: 125.75,
      activeReservations: 1,
      status: "active",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria.santos@cit.edu",
      role: "faculty",
      joinDate: "2023-08-20",
      totalSpent: 340.25,
      activeReservations: 0,
      status: "active",
    },
    {
      id: "3",
      name: "Pedro Garcia",
      email: "pedro.garcia@cit.edu",
      role: "staff",
      joinDate: "2024-02-10",
      totalSpent: 89.5,
      activeReservations: 2,
      status: "suspended",
    },
  ])

  const [reservations, setReservations] = useState<ReservationData[]>([
    {
      id: "1",
      user: "Juan Dela Cruz",
      zone: "Main Parking Lot",
      plateNumber: "ABC 1234",
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
      status: "active",
      amount: 7.5,
    },
    {
      id: "2",
      user: "Pedro Garcia",
      zone: "GLE Parking Lot",
      plateNumber: "XYZ 5678",
      startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(),
      status: "active",
      amount: 5.0,
    },
  ])

  const [editingZone, setEditingZone] = useState<string | null>(null)
  const [newZonePrice, setNewZonePrice] = useState("")
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    // Check if user is admin (in real app, this would be verified server-side)
    if (parsedUser.role !== "admin" && parsedUser.email !== "admin@cit.edu") {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
  }, [router])

  const updateZonePrice = (zoneId: string) => {
    if (!newZonePrice || Number.parseFloat(newZonePrice) <= 0) {
      setError("Please enter a valid price")
      return
    }

    setZones((prev) =>
      prev.map((zone) => (zone.id === zoneId ? { ...zone, pricePerHour: Number.parseFloat(newZonePrice) } : zone)),
    )

    setEditingZone(null)
    setNewZonePrice("")
    setSuccess("Zone price updated successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const toggleZoneStatus = (zoneId: string) => {
    setZones((prev) => prev.map((zone) => (zone.id === zoneId ? { ...zone, isActive: !zone.isActive } : zone)))
    setSuccess("Zone status updated successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "suspended" : "active" } : user,
      ),
    )
    setSuccess("User status updated successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const cancelReservation = (reservationId: string) => {
    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status: "cancelled" } : reservation,
      ),
    )
    setSuccess("Reservation cancelled successfully!")
    setTimeout(() => setSuccess(""), 3000)
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
                <h1 className="text-lg font-bold text-primary">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">System Management</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Success/Error Messages */}
        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                <TrendingUp className="h-3 w-3" />+{stats.monthlyGrowth}% this month
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Car className="h-4 w-4" />
                Active Reservations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.activeReservations}</div>
              <div className="text-sm text-muted-foreground mt-1">{stats.dailyReservations} today</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">${stats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-1">All time</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Occupancy Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.occupancyRate}%</div>
              <Progress value={stats.occupancyRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="zones" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="zones">Parking Zones</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Parking Zones Tab */}
          <TabsContent value="zones" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Parking Zone Management
                </CardTitle>
                <CardDescription>Manage parking zones, pricing, and availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {zones.map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{zone.name}</h3>
                          <Badge variant={zone.isActive ? "secondary" : "destructive"}>
                            {zone.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
                          <span>
                            {zone.availableSlots}/{zone.totalSlots} available
                          </span>
                          <span>${zone.pricePerHour}/hr</span>
                          <span>Revenue: ${zone.revenue.toLocaleString()}</span>
                        </div>
                        <Progress
                          value={((zone.totalSlots - zone.availableSlots) / zone.totalSlots) * 100}
                          className="mt-2 w-48"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        {editingZone === zone.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              placeholder="New price"
                              value={newZonePrice}
                              onChange={(e) => setNewZonePrice(e.target.value)}
                              className="w-24"
                              step="0.1"
                              min="0"
                            />
                            <Button size="sm" onClick={() => updateZonePrice(zone.id)}>
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingZone(null)}
                              className="bg-transparent"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingZone(zone.id)
                                setNewZonePrice(zone.pricePerHour.toString())
                              }}
                              className="bg-transparent"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={zone.isActive ? "destructive" : "default"}
                              onClick={() => toggleZoneStatus(zone.id)}
                            >
                              {zone.isActive ? "Disable" : "Enable"}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((userData) => (
                    <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{userData.name}</h3>
                          <Badge variant="outline" className="capitalize">
                            {userData.role}
                          </Badge>
                          <Badge variant={userData.status === "active" ? "secondary" : "destructive"}>
                            {userData.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
                          <span>{userData.email}</span>
                          <span>Joined: {new Date(userData.joinDate).toLocaleDateString()}</span>
                          <span>Spent: ${userData.totalSpent}</span>
                          <span>Active: {userData.activeReservations}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={userData.status === "active" ? "destructive" : "default"}
                          onClick={() => toggleUserStatus(userData.id)}
                        >
                          {userData.status === "active" ? "Suspend" : "Activate"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Active Reservations
                </CardTitle>
                <CardDescription>Monitor and manage current parking reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reservations
                    .filter((r) => r.status === "active")
                    .map((reservation) => (
                      <div key={reservation.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{reservation.user}</h3>
                            <Badge className="bg-green-100 text-green-800">Active</Badge>
                          </div>
                          <div className="flex items-center gap-6 mt-2 text-sm text-muted-foreground">
                            <span>{reservation.zone}</span>
                            <span>{reservation.plateNumber}</span>
                            <span>Start: {new Date(reservation.startTime).toLocaleString()}</span>
                            <span>End: {new Date(reservation.endTime).toLocaleString()}</span>
                            <span>${reservation.amount}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="destructive" onClick={() => cancelReservation(reservation.id)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  {reservations.filter((r) => r.status === "active").length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No active reservations</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Revenue by Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {zones.map((zone) => (
                      <div key={zone.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{zone.name}</span>
                          <span className="font-medium">${zone.revenue.toLocaleString()}</span>
                        </div>
                        <Progress value={(zone.revenue / Math.max(...zones.map((z) => z.revenue))) * 100} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">System Uptime</span>
                      <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Blockchain Sync</span>
                      <Badge className="bg-green-100 text-green-800">Synced</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Smart Contracts</span>
                      <Badge className="bg-green-100 text-green-800">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payment Processing</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
