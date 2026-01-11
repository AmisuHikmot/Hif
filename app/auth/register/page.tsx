"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, User, Phone, Chrome, Apple } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { signInWithOAuth } from "@/lib/auth/oauth"

export default function RegisterPage() {
  const router = useRouter()
  const { signUp } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await signUp(email, password, {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
      })

      if (error) {
        setError(error.message)
      } else {
        console.log("[v0] Signup successful, redirecting to verify email...")
        router.push("/auth/verify-email?email=" + encodeURIComponent(email))
      }
    } catch (err) {
      console.error("[v0] Unexpected signup error:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignUp = async (provider: "google" | "apple" | "facebook") => {
    setIsOAuthLoading(provider)
    setError(null)

    try {
      console.log("[v0] Starting OAuth signup with provider:", provider)
      const { error: oAuthError } = await signInWithOAuth(provider)

      if (oAuthError) {
        console.error("[v0] OAuth error:", oAuthError.message)
        setError(oAuthError.message)
        setIsOAuthLoading(null)
      }
      // OAuth redirects automatically, no need to redirect manually
    } catch (err) {
      console.error("[v0] Unexpected OAuth error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsOAuthLoading(null)
    }
  }

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Join Hamduk Islamic Foundation community</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="first-name"
                    placeholder="John"
                    className="pl-10"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="pl-10"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 XXX XXX XXXX"
                  className="pl-10"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" required />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-emerald-600 hover:underline dark:text-emerald-400">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-emerald-600 hover:underline dark:text-emerald-400">
                  Privacy Policy
                </Link>
              </Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || isOAuthLoading !== null}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignUp("google")}
              disabled={isOAuthLoading !== null}
              className="w-full"
            >
              {isOAuthLoading === "google" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
              ) : (
                <Chrome className="h-4 w-4" />
              )}
              <span className="sr-only">Sign up with Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignUp("apple")}
              disabled={isOAuthLoading !== null}
              className="w-full"
            >
              {isOAuthLoading === "apple" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
              ) : (
                <Apple className="h-4 w-4" />
              )}
              <span className="sr-only">Sign up with Apple</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthSignUp("facebook")}
              disabled={isOAuthLoading !== null}
              className="w-full"
            >
              {isOAuthLoading === "facebook" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
              ) : (
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
              <span className="sr-only">Sign up with Facebook</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-emerald-600 hover:underline dark:text-emerald-400">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}
