"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Mail, Lock, Chrome, Apple } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { signInWithOAuth } from "@/lib/auth/oauth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, isAuthenticated, isLoading: authLoading } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const redirectPath = searchParams.get("redirect") || "/dashboard"

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log("[v0] User already authenticated, redirecting to:", redirectPath)
      router.push(redirectPath)
    }
  }, [isAuthenticated, authLoading, router, redirectPath])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSigningIn(true)
    setError(null)

    try {
      console.log("[v0] Attempting login with email:", email)
      const { error: signInError } = await signIn(email, password)

      if (signInError) {
        console.error("[v0] Login error:", signInError.message)
        setError(signInError.message)
        setIsSigningIn(false)
      } else {
        console.log("[v0] Login successful, context will trigger redirect via useEffect")
        // The useEffect above will handle the redirect when isAuthenticated updates
      }
    } catch (err) {
      console.error("[v0] Unexpected login error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsSigningIn(false)
    }
  }

  const handleOAuthLogin = async (provider: "google" | "apple" | "facebook") => {
    setIsOAuthLoading(provider)
    setError(null)

    try {
      console.log("[v0] Starting OAuth login with provider:", provider)
      const { error: oAuthError } = await signInWithOAuth(provider)

      if (oAuthError) {
        console.error("[v0] OAuth error:", oAuthError.message)
        setError(oAuthError.message)
        setIsOAuthLoading(null)
      }
      // OAuth redirects automatically via callback page
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
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your Hamduk Islamic Foundation account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
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
                      disabled={isSigningIn}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isSigningIn}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSigningIn}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" disabled={isSigningIn} />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={isSigningIn}>
                  {isSigningIn ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="phone">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="+234 XXX XXX XXXX" required disabled={isSigningIn} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-phone">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="password-phone"
                      type={showPassword ? "text" : "password"}
                      className="pl-10 pr-10"
                      required
                      disabled={isSigningIn}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSigningIn}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember-phone" disabled={isSigningIn} />
                  <Label htmlFor="remember-phone" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={isSigningIn}>
                  {isSigningIn ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin("google")}
              disabled={isOAuthLoading !== null}
              className="w-full"
            >
              {isOAuthLoading === "google" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
              ) : (
                <Chrome className="h-4 w-4" />
              )}
              <span className="sr-only">Sign in with Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin("apple")}
              disabled={isOAuthLoading !== null}
              className="w-full"
            >
              {isOAuthLoading === "apple" ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-600" />
              ) : (
                <Apple className="h-4 w-4" />
              )}
              <span className="sr-only">Sign in with Apple</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuthLogin("facebook")}
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
              <span className="sr-only">Sign in with Facebook</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-emerald-600 hover:underline dark:text-emerald-400">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  )
}
