// frontend/app/unauthorized/page.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Shield, Lock, ArrowLeft, Home, AlertCircle, UserCog } from "lucide-react"

const reasonMessages: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
  "admin-access-required": {
    title: "Admin Access Required",
    description:
      "This page is restricted to administrators only. Please contact your system administrator if you believe you should have access.",
    icon: <UserCog className="h-6 w-6" />,
  },
  "login-required": {
    title: "Login Required",
    description: "You need to be logged in to access this page. Please sign in to continue.",
    icon: <Lock className="h-6 w-6" />,
  },
  "insufficient-permissions": {
    title: "Insufficient Permissions",
    description: "Your account does not have the required permissions to access this resource.",
    icon: <Shield className="h-6 w-6" />,
  },
  "account-suspended": {
    title: "Account Suspended",
    description: "Your account has been suspended. Please contact support for more information.",
    icon: <AlertCircle className="h-6 w-6" />,
  },
  "verification-required": {
    title: "Verification Required",
    description:
      "Your account needs to be verified before accessing this feature. Please check your email for verification instructions.",
    icon: <Shield className="h-6 w-6" />,
  },
} as const

export default function UnauthorizedPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [reason] = useState(() => {
    const reasonParam = searchParams.get("reason")
    return reasonParam && reasonMessages[reasonParam] ? reasonParam : "admin-access-required"
  })

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  const handleGoHome = () => {
    router.push("/")
  }

  const handleGoToLogin = () => {
    router.push("/login")
  }

  const { title, description, icon } = reasonMessages[reason] || reasonMessages["admin-access-required"]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              {icon}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-500">{title}</CardTitle>
          <CardDescription className="text-base">Access Denied</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <AlertTitle className="text-red-800 dark:text-red-300">Security Notice</AlertTitle>
            <AlertDescription className="text-red-700 dark:text-red-400">{description}</AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-semibold">What you can do:</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {reason === "admin-access-required" && (
                <>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>Contact your system administrator for access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>Return to your dashboard or home page</span>
                  </li>
                </>
              )}

              {reason === "login-required" && (
                <>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>Log in with your account credentials</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>Create a new account if you don&apos;t have one</span>
                  </li>
                </>
              )}

              {reason === "verification-required" && (
                <>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>Check your email for verification link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>Contact support if you didn&apos;t receive the email</span>
                  </li>
                </>
              )}

              <li className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                <span>Contact support if you believe this is an error</span>
              </li>
            </ul>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-sm mb-2 text-blue-800 dark:text-blue-300">Need Help?</h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              Contact our support team at{" "}
              <a href="mailto:support@travelbuddy.com" className="underline font-medium">
                support@travelbuddy.com
              </a>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <Button variant="outline" onClick={handleGoBack} className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>

            {reason === "login-required" ? (
              <Button onClick={handleGoToLogin} className="gap-2">
                <Lock className="h-4 w-4" />
                Go to Login
              </Button>
            ) : (
              <Button onClick={handleGoHome} className="gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            )}
          </div>

          <div className="text-center w-full pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Error Code:{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded text-xs">
                ACCESS_DENIED_{reason.toUpperCase().replace("-", "_")}
              </code>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
