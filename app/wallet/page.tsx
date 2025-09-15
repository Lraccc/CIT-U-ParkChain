"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Wallet, Plus, Minus, ExternalLink, AlertCircle, CheckCircle, Copy, Car } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { blockchainService } from "@/lib/blockchain"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "payment"
  amount: number
  timestamp: string
  status: "pending" | "completed" | "failed"
  hash?: string
}

export default function WalletPage() {
  const [user, setUser] = useState<any>(null)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [tokenBalance, setTokenBalance] = useState(0)
  const [systemBalance, setSystemBalance] = useState(25.5)
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Load mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        type: "deposit",
        amount: 50.0,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        hash: "0x1234567890abcdef1234567890abcdef12345678",
      },
      {
        id: "2",
        type: "payment",
        amount: -7.5,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        hash: "0xabcdef1234567890abcdef1234567890abcdef12",
      },
      {
        id: "3",
        type: "payment",
        amount: -4.0,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: "completed",
        hash: "0x567890abcdef1234567890abcdef1234567890ab",
      },
    ]
    setTransactions(mockTransactions)

    // Check if wallet was previously connected
    const savedWalletAddress = localStorage.getItem("walletAddress")
    if (savedWalletAddress) {
      setWalletAddress(savedWalletAddress)
      setWalletConnected(true)
      setTokenBalance(125.75) // Mock balance
    }
  }, [router])

  const connectWallet = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === "undefined") {
        throw new Error("MetaMask is not installed. Please install MetaMask to continue.")
      }

      const address = await blockchainService.connectWallet()
      setWalletAddress(address)
      setWalletConnected(true)
      localStorage.setItem("walletAddress", address)

      // Get token balance (mock for demo)
      setTokenBalance(125.75)
      setSuccess("Wallet connected successfully!")
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeposit = async () => {
    if (!depositAmount || Number.parseFloat(depositAmount) <= 0) {
      setError("Please enter a valid deposit amount")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const amount = Number.parseFloat(depositAmount)
      setSystemBalance((prev) => prev + amount)
      setTokenBalance((prev) => prev - amount)

      // Add transaction record
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "deposit",
        amount: amount,
        timestamp: new Date().toISOString(),
        status: "completed",
        hash: `0x${Math.random().toString(16).substr(2, 40)}`,
      }
      setTransactions((prev) => [newTransaction, ...prev])

      setDepositAmount("")
      setSuccess(`Successfully deposited $${amount.toFixed(2)} to your parking wallet!`)
    } catch (err: any) {
      setError(err.message || "Failed to deposit funds")
    } finally {
      setIsLoading(false)
    }
  }

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number.parseFloat(withdrawAmount) <= 0) {
      setError("Please enter a valid withdrawal amount")
      return
    }

    const amount = Number.parseFloat(withdrawAmount)
    if (amount > systemBalance) {
      setError("Insufficient balance for withdrawal")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSystemBalance((prev) => prev - amount)
      setTokenBalance((prev) => prev + amount)

      // Add transaction record
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        type: "withdrawal",
        amount: -amount,
        timestamp: new Date().toISOString(),
        status: "completed",
        hash: `0x${Math.random().toString(16).substr(2, 40)}`,
      }
      setTransactions((prev) => [newTransaction, ...prev])

      setWithdrawAmount("")
      setSuccess(`Successfully withdrew $${amount.toFixed(2)} to your MetaMask wallet!`)
    } catch (err: any) {
      setError(err.message || "Failed to withdraw funds")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setSuccess("Address copied to clipboard!")
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <Plus className="h-4 w-4 text-green-600" />
      case "withdrawal":
        return <Minus className="h-4 w-4 text-blue-600" />
      case "payment":
        return <Wallet className="h-4 w-4 text-red-600" />
      default:
        return <Wallet className="h-4 w-4" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "text-green-600"
      case "withdrawal":
        return "text-blue-600"
      case "payment":
        return "text-red-600"
      default:
        return "text-foreground"
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
                <h1 className="text-lg font-bold text-primary">Digital Wallet</h1>
                <p className="text-sm text-muted-foreground">Manage your parking funds</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallet Connection & Balances */}
          <div className="lg:col-span-2 space-y-6">
            {/* Wallet Connection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  MetaMask Connection
                </CardTitle>
                <CardDescription>Connect your MetaMask wallet to manage PARK tokens</CardDescription>
              </CardHeader>
              <CardContent>
                {!walletConnected ? (
                  <div className="text-center py-6">
                    <div className="mb-4">
                      <img src="/metamask-fox-logo.jpg" alt="MetaMask" className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
                      <p className="text-muted-foreground mb-4">
                        Connect your MetaMask wallet to deposit, withdraw, and manage your PARK tokens.
                      </p>
                    </div>
                    <Button onClick={connectWallet} disabled={isLoading} className="w-full sm:w-auto">
                      {isLoading ? "Connecting..." : "Connect MetaMask"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium text-green-800">Wallet Connected</div>
                          <div className="text-sm text-green-600">{formatAddress(walletAddress)}</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(walletAddress)}
                        className="bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">MetaMask Balance</div>
                        <div className="text-2xl font-bold text-primary">{tokenBalance.toFixed(2)} PARK</div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Parking Wallet</div>
                        <div className="text-2xl font-bold text-secondary">${systemBalance.toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deposit/Withdraw */}
            {walletConnected && (
              <Card>
                <CardHeader>
                  <CardTitle>Manage Funds</CardTitle>
                  <CardDescription>Deposit or withdraw PARK tokens to/from your parking wallet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {/* Deposit */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-green-700">Deposit to Parking Wallet</h3>
                      <div className="space-y-2">
                        <Label htmlFor="depositAmount">Amount (PARK)</Label>
                        <Input
                          id="depositAmount"
                          type="number"
                          placeholder="0.00"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <Button onClick={handleDeposit} disabled={isLoading || !depositAmount} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        {isLoading ? "Processing..." : "Deposit"}
                      </Button>
                    </div>

                    {/* Withdraw */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-blue-700">Withdraw to MetaMask</h3>
                      <div className="space-y-2">
                        <Label htmlFor="withdrawAmount">Amount (USD)</Label>
                        <Input
                          id="withdrawAmount"
                          type="number"
                          placeholder="0.00"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          min="0"
                          step="0.01"
                          max={systemBalance}
                        />
                      </div>
                      <Button
                        onClick={handleWithdraw}
                        disabled={isLoading || !withdrawAmount}
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Minus className="h-4 w-4 mr-2" />
                        {isLoading ? "Processing..." : "Withdraw"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alerts */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Transaction History */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your latest wallet activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Wallet className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No transactions yet</p>
                    </div>
                  ) : (
                    transactions.slice(0, 10).map((transaction, index) => (
                      <div key={transaction.id}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getTransactionIcon(transaction.type)}
                            <div>
                              <div className="font-medium capitalize">{transaction.type}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(transaction.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${getTransactionColor(transaction.type)}`}>
                              {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                            </div>
                            <Badge
                              variant={transaction.status === "completed" ? "secondary" : "outline"}
                              className="text-xs"
                            >
                              {transaction.status}
                            </Badge>
                          </div>
                        </div>
                        {transaction.hash && (
                          <div className="mt-2 ml-7">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                              onClick={() => copyToClipboard(transaction.hash!)}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              {formatAddress(transaction.hash)}
                            </Button>
                          </div>
                        )}
                        {index < transactions.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/reserve">
                    <Car className="h-4 w-4 mr-2" />
                    Reserve Parking
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/history">
                    <Wallet className="h-4 w-4 mr-2" />
                    View History
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                  <Link href="/blockchain">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Blockchain Explorer
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
