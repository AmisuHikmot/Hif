"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
            <Mail className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          <CardDescription>
            We&apos;ve sent a verification email to {email ? <strong>{email}</strong> : "your email address"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account. If you don&apos;t see it, check your spam folder.
          </p>
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm">
              <strong>What happens next?</strong>
            </p>
            <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside text-left">
              <li>Click the verification link in your email</li>
              <li>You&apos;ll be redirected to complete your profile</li>
              <li>Start exploring your member dashboard</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button asChild className="w-full">
            <Link href="/auth/login">Go to Login</Link>
          </Button>
          <Link
            href="/auth/register"
            className="text-sm text-emerald-600 hover:underline dark:text-emerald-400 flex items-center justify-center"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to registration
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
