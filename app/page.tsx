import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Shield, Wallet, Clock, MapPin, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CituLogo-1ztnlign29eOM0Xmh9u3bP4m1T4psC.png"
                alt="CIT-U Logo"
                className="h-12 w-12"
              />
              <div>
                <h1 className="text-xl font-bold text-primary">CIT-U ParkChain</h1>
                <p className="text-sm text-muted-foreground">Blockchain Parking System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-secondary text-secondary-foreground">Welcome Home Wildcats! 🎓</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Smart Parking for the
            <span className="text-primary block">Home of Topnotchers</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Experience the future of campus parking with blockchain technology. Reserve zones, pay securely, and never
            worry about finding a spot again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/dashboard">Reserve Parking Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/how-it-works">How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose CIT-U ParkChain?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built specifically for CIT-U's zone-based parking system with cutting-edge blockchain technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Zone-Based Parking</CardTitle>
                <CardDescription>
                  Reserve parking zones instead of specific spots. Perfect for CIT-U's flexible parking layout.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <Shield className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Blockchain Security</CardTitle>
                <CardDescription>
                  Your reservations and payments are secured by immutable blockchain technology.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <Wallet className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Digital Wallet</CardTitle>
                <CardDescription>Seamless MetaMask integration for secure, instant parking payments.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Real-Time Availability</CardTitle>
                <CardDescription>See live parking availability across all campus zones instantly.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <Car className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Smart Reservations</CardTitle>
                <CardDescription>
                  Book your parking spot in advance and never worry about finding space.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>For Everyone</CardTitle>
                <CardDescription>
                  Students, faculty, staff, and visitors - everyone can use the system easily.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Campus Zones Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Campus Parking Zones</h2>
            <p className="text-muted-foreground">Choose from our three main parking areas across the CIT-U campus</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-primary">Main Parking Lot</CardTitle>
                <CardDescription>Primary parking area near the main building</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary mb-2">50 Slots</div>
                <Badge variant="secondary">Most Popular</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-primary">GLE Parking Lot</CardTitle>
                <CardDescription>Convenient access to engineering buildings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary mb-2">30 Slots</div>
                <Badge variant="outline">Engineering Hub</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-primary">Back Gate Parking</CardTitle>
                <CardDescription>Alternative entrance with easy access</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary mb-2">25 Slots</div>
                <Badge variant="outline">Quick Access</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Lead the Future?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join the blockchain revolution in campus parking. Get started today!
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <Link href="/register">Create Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/CituLogo-1ztnlign29eOM0Xmh9u3bP4m1T4psC.png"
                alt="CIT-U Logo"
                className="h-8 w-8"
              />
              <div>
                <div className="font-semibold">CIT-U ParkChain</div>
                <div className="text-sm text-muted-foreground">Cebu Institute of Technology - University</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 CIT-U ParkChain. Powered by blockchain technology.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
