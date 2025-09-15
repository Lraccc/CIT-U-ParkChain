"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { MapPin, Car, Shield, Zap } from "lucide-react"
import Link from "next/link"

interface ParkingZoneCardProps {
  zone: {
    id: string
    name: string
    totalSlots: number
    availableSlots: number
    pricePerHour: number
    description: string
    features: string[]
  }
  isSelected?: boolean
  onSelect?: () => void
  showReserveButton?: boolean
}

export function ParkingZoneCard({
  zone,
  isSelected = false,
  onSelect,
  showReserveButton = true,
}: ParkingZoneCardProps) {
  const availabilityPercentage = (zone.availableSlots / zone.totalSlots) * 100

  const getAvailabilityColor = () => {
    if (availabilityPercentage > 50) return "text-green-600"
    if (availabilityPercentage > 20) return "text-yellow-600"
    return "text-red-600"
  }

  const getFeatureIcon = (feature: string) => {
    if (feature.includes("Security") || feature.includes("CCTV")) return <Shield className="h-3 w-3" />
    if (feature.includes("EV") || feature.includes("Charging")) return <Zap className="h-3 w-3" />
    return <Car className="h-3 w-3" />
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border"
      } ${zone.availableSlots === 0 ? "opacity-50" : ""}`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {zone.name}
              {isSelected && <Badge className="bg-primary text-primary-foreground">Selected</Badge>}
            </CardTitle>
            <CardDescription className="mt-2">{zone.description}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">${zone.pricePerHour}/hr</div>
            {zone.availableSlots === 0 ? (
              <Badge variant="destructive">Full</Badge>
            ) : (
              <Badge variant="secondary" className={getAvailabilityColor()}>
                {zone.availableSlots} available
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Availability</span>
            <div className="flex items-center gap-2">
              <Progress value={availabilityPercentage} className="w-24 h-2" />
              <span className="text-sm font-medium">
                {zone.availableSlots}/{zone.totalSlots}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {zone.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                {getFeatureIcon(feature)}
                {feature}
              </Badge>
            ))}
          </div>

          {showReserveButton && zone.availableSlots > 0 && (
            <Button className="w-full mt-4" asChild>
              <Link href={`/reserve?zone=${zone.id}`}>Reserve This Zone</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
