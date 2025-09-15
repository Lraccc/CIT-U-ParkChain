"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Shield, ExternalLink, Search, Copy, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface BlockchainRecord {
  id: string
  type: "reservation" | "payment" | "cancellation" | "completion"
  transactionHash: string
  blockNumber: number
  timestamp: string
  gasUsed: string
  gasPrice: string
  status: "confirmed" | "pending" | "failed"
  details: any
}

export default function BlockchainPage() {
  const [user, setUser] = useState<any>(null)
  const [records, setRecords] = useState<BlockchainRecord[]>([])
  const [searchHash, setSearchHash] = useState("")
  const [filteredRecords, setFilteredRecords] = useState<BlockchainRecord[]>([])
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Mock blockchain records
    const mockRecords: BlockchainRecord[] = [
      {
        id: "1",
        type: "reservation",
        transactionHash: "0x1234567890abcdef1234567890abcdef12345678901234567890abcdef123456",
        blockNumber: 18542156,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        gasUsed: "84,532",
        gasPrice: "15.2",
        status: "confirmed",
        details: {
          zone: "Main Parking Lot",
          duration: 3,
          cost: 7.5,
        },
      },
      {
        id: "2",
        type: "payment",
        transactionHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        blockNumber: 18542155,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 - 30000).toISOString(),
        gasUsed: "52,341",
        gasPrice: "14.8",
        status: "confirmed",
        details: {
          amount: 7.5,
          from: "User Wallet",
          to: "Parking System",
        },
      },
      {
        id: "3",
        type: "completion",
        transactionHash: "0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
        blockNumber: 18541892,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        gasUsed: "41,256",
        gasPrice: "16.1",
        status: "confirmed",
        details: {
          zone: "GLE Parking Lot",
          duration: 2,
        },
      },
      {
        id: "4",
        type: "cancellation",
        transactionHash: "0x890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        blockNumber: 18541654,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        gasUsed: "38,742",
        gasPrice: "13.9",
        status: "confirmed",
        details: {
          zone: "Back Gate Parking",
          refund: 3.0,
        },
      },
    ]

    setRecords(mockRecords)
    setFilteredRecords(mockRecords)
  }, [router])

  useEffect(() => {
    if (searchHash) {
      const filtered = records.filter((record) =>
        record.transactionHash.toLowerCase().includes(searchHash.toLowerCase()),
      )
      setFilteredRecords(filtered)
    } else {
      setFilteredRecords(records)
    }
  }, [searchHash, records])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess("Hash copied to clipboard!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const formatHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "reservation":
        return "bg-blue-100 text-blue-800"
      case "payment":
        return "bg-green-100 text-green-800"
      case "completion":
        return "bg-purple-100 text-purple-800"
      case "cancellation":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
                <h1 className="text-lg font-bold text-primary">Blockchain Records</h1>
                <p className="text-sm text-muted-foreground">Transparent transaction history</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Blockchain Transparency
            </CardTitle>
            <CardDescription>
              All parking transactions are recorded on the blockchain for complete transparency and immutability. You
              can verify any transaction using the hash on a blockchain explorer.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter transaction hash to search..."
                  value={searchHash}
                  onChange={(e) => setSearchHash(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={() => setSearchHash("")} className="bg-transparent">
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Success Message */}
        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transaction Records */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No records found</h3>
                <p className="text-muted-foreground">
                  {searchHash ? "No transactions match your search." : "No blockchain records available."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRecords.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Badge className={getTypeColor(record.type)} variant="secondary">
                          {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(record.status)} variant="secondary">
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Block #{record.blockNumber.toLocaleString()} • {new Date(record.timestamp).toLocaleString()}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Transaction Hash */}
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="text-sm font-medium">Transaction Hash</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {formatHash(record.transactionHash)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(record.transactionHash)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={`https://etherscan.io/tx/${record.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium mb-2">Gas Information</div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div>Gas Used: {record.gasUsed}</div>
                          <div>Gas Price: {record.gasPrice} Gwei</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium mb-2">Transaction Details</div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {record.type === "reservation" && (
                            <>
                              <div>Zone: {record.details.zone}</div>
                              <div>Duration: {record.details.duration} hours</div>
                              <div>Cost: ${record.details.cost}</div>
                            </>
                          )}
                          {record.type === "payment" && (
                            <>
                              <div>Amount: ${record.details.amount}</div>
                              <div>From: {record.details.from}</div>
                              <div>To: {record.details.to}</div>
                            </>
                          )}
                          {record.type === "completion" && (
                            <>
                              <div>Zone: {record.details.zone}</div>
                              <div>Duration: {record.details.duration} hours</div>
                            </>
                          )}
                          {record.type === "cancellation" && (
                            <>
                              <div>Zone: {record.details.zone}</div>
                              <div>Refund: ${record.details.refund}</div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
