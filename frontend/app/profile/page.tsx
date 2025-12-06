// frontend/app/profile/page.tsx
// frontend/app/profile/page.tsx - OWN PROFILE
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth-context'
import { userAPI } from '@/lib/api'
import { toast } from 'sonner'
import {
  MapPin,
  Calendar,
  Star,
  Users,
  Globe,
  Mail,
  Phone,
  Edit,
  Briefcase,
  Heart,
  MessageSquare,
  Share2,
  Flag,
  Settings,
  LogOut,
  PlusCircle,
  UserCog,
  Shield,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface ProfileUser {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
  isVerified: boolean
  isActive: boolean
  profile?: {
    fullName: string
    profileImage?: string
    bio?: string
    currentLocation?: string
    travelInterests?: string[]
    visitedCountries?: string[]
    phoneNumber?: string
    socialLinks?: string[]
  }
  travelPlans?: Array<{
    id: string
    destination: string
    startDate: string
    endDate: string
    travelType: string
    description?: string
  }>
  reviewsReceived?: Array<{
    id: string
    rating: number
    comment?: string
    author?: {
      profile?: {
        fullName: string
        profileImage?: string
      }
    }
    createdAt: string
  }>
  _count?: {
    travelPlans: number
    reviewsReceived: number
  }
}

export default function OwnProfilePage() {
  const { user: currentUser, logout } = useAuth()
  const router = useRouter()
  const [profileUser, setProfileUser] = useState<ProfileUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<
    'about' | 'plans' | 'reviews' | 'settings'
  >('about')

  useEffect(() => {
    if (!currentUser) {
      router.push('/login')
      return
    }
    fetchProfile()
  }, [currentUser])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      // Use getProfile() for own profile (authenticated)
      const result = await userAPI.getProfile()
      setProfileUser(result.data.user)
    } catch (error) {
      toast.error('Failed to load profile')
      console.error('Profile error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!profileUser || !currentUser) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Profile not found</h2>
          <p className="text-muted-foreground">
            Please log in to view your profile.
          </p>
          <Button onClick={() => router.push('/login')} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  const calculateAverageRating = () => {
    if (
      !profileUser.reviewsReceived ||
      profileUser.reviewsReceived.length === 0
    )
      return 0
    const total = profileUser.reviewsReceived.reduce(
      (sum, review) => sum + review.rating,
      0
    )
    return total / profileUser.reviewsReceived.length
  }

  const averageRating = calculateAverageRating()

  return (
    <div className="container py-8">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage className='object-cover' src={profileUser.profile?.profileImage} />
                <AvatarFallback className="text-3xl">
                  {profileUser.profile?.fullName?.charAt(0).toUpperCase() ||
                    currentUser.email?.charAt(0).toUpperCase() ||
                    'U'}
                </AvatarFallback>
              </Avatar>
              {profileUser.isVerified && (
                <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-blue-500 border-4 border-background flex items-center justify-center">
                  <Badge className="bg-blue-500 text-white w-2 h-2">✓</Badge>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold">
                      {profileUser.profile?.fullName || 'Your Profile'}
                    </h1>
                    <Link href="/profile/edit">
                      <Button size="sm" variant="outline" className="gap-2">
                        <Edit className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    </Link>
                  </div>

                  {profileUser.profile?.currentLocation && (
                    <div className="flex items-center gap-2 text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span>{profileUser.profile.currentLocation}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({profileUser._count?.reviewsReceived || 0} reviews)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span className="font-semibold">
                        {profileUser._count?.travelPlans || 0}
                      </span>
                      <span className="text-muted-foreground">trips</span>
                    </div>
                    {profileUser.role === 'ADMIN' && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-500" />
                        <Badge variant="destructive">Admin</Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-3">
                    <Link href="/travel-plans/new">
                      <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        New Travel Plan
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                  {profileUser.role === 'ADMIN' && (
                    <Link href="/admin/dashboard">
                      <Button variant="secondary" className="gap-2 w-full">
                        <UserCog className="h-4 w-4" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profileUser.profile?.bio && (
                <p className="text-muted-foreground mb-6">
                  {profileUser.profile.bio}
                </p>
              )}

              {/* Travel Interests */}
              {profileUser.profile?.travelInterests &&
                profileUser.profile.travelInterests.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Travel Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profileUser.profile.travelInterests.map(
                        (interest, index) => (
                          <Badge key={index} variant="secondary">
                            {interest}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Account Info */}
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{profileUser.email}</span>
                  {/* <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    ✓ Verified
                  </Badge> */}
                </div>
                {profileUser.profile?.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{profileUser.profile.phoneNumber}</span>
{/*                     <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700"
                    >
                      ✓ Verified
                    </Badge> */}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex border-b mb-8">
        <button
          className={`px-4 py-3 font-medium ${
            activeTab === 'about'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('about')}
        >
          About
        </button>
        <button
          className={`px-4 py-3 font-medium ${
            activeTab === 'plans'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('plans')}
        >
          My Travel Plans ({profileUser.travelPlans?.length || 0})
        </button>
        <button
          className={`px-4 py-3 font-medium ${
            activeTab === 'reviews'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('reviews')}
        >
          My Reviews ({profileUser._count?.reviewsReceived || 0})
        </button>
        <button
          className={`px-4 py-3 font-medium ${
            activeTab === 'settings'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Account Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'about' && (
            <div className="space-y-8">
              {/* Visited Countries */}
              {profileUser.profile?.visitedCountries &&
                profileUser.profile.visitedCountries.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Countries I&apos;ve Visited
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        {profileUser.profile.visitedCountries.map(
                          (country, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-sm py-2 px-3"
                            >
                              {country}
                            </Badge>
                          )
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

              {/* Upcoming Plans */}
              {profileUser.travelPlans &&
                profileUser.travelPlans.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        My Upcoming Travel Plans
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileUser.travelPlans.slice(0, 3).map((plan) => (
                          <div key={plan.id} className="p-4 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">
                                {plan.destination}
                              </h3>
                              <div className="flex gap-2">
                                <Badge>{plan.travelType}</Badge>
                                <Link href={`/travel-plans/${plan.id}/edit`}>
                                  <Button size="sm" variant="ghost">
                                    Edit
                                  </Button>
                                </Link>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(plan.startDate)} -{' '}
                                {formatDate(plan.endDate)}
                              </div>
                            </div>
                            {plan.description && (
                              <p className="text-sm">{plan.description}</p>
                            )}
                            <div className="flex gap-2 mt-3">
                              <Link href={`/travel-plans/${plan.id}/matches`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2"
                                >
                                  <Users className="h-3 w-3" />
                                  View Matches
                                </Button>
                              </Link>
                              <Link href={`/travel-plans/${plan.id}`}>
                                <Button size="sm">View Details</Button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="space-y-4">
              {profileUser.travelPlans && profileUser.travelPlans.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      All My Travel Plans
                    </h3>
                    <Link href="/travel-plans/new">
                      <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        New Plan
                      </Button>
                    </Link>
                  </div>
                  {profileUser.travelPlans.map((plan) => (
                    <Card key={plan.id} className="card-hover">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2">
                              {plan.destination}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(plan.startDate)} -{' '}
                                {formatDate(plan.endDate)}
                              </div>
                              <Badge>{plan.travelType}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/travel-plans/${plan.id}/edit`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                            </Link>
                          </div>
                        </div>

                        {plan.description && (
                          <p className="text-muted-foreground mb-4">
                            {plan.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-sm">
                              <Users className="h-4 w-4" />
                              <span>Looking for companions</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Link href={`/travel-plans/${plan.id}/matches`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2"
                              >
                                <Users className="h-3 w-3" />
                                Matches
                              </Button>
                            </Link>
                            <Link href={`/travel-plans/${plan.id}`}>
                              <Button size="sm">View Details</Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      No travel plans yet
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first travel plan to start finding companions
                    </p>
                    <Link href="/travel-plans/new">
                      <Button className="gap-2">
                        <PlusCircle className="h-4 w-4" />
                        Create Your First Plan
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {profileUser.reviewsReceived &&
              profileUser.reviewsReceived.length > 0 ? (
                <>
                  <h3 className="text-lg font-semibold mb-4">
                    Reviews About Me
                  </h3>
                  {profileUser.reviewsReceived.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage
                              src={review.author?.profile?.profileImage}
                            />
                            <AvatarFallback>
                              {review.author?.profile?.fullName
                                ?.charAt(0)
                                .toUpperCase() || 'A'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-semibold">
                                  {review.author?.profile?.fullName ||
                                    'Anonymous'}
                                </h4>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? 'text-yellow-500 fill-yellow-500'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            {review.comment && (
                              <p className="text-muted-foreground">
                                {review.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                      <Star className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-muted-foreground">
                      Complete your first trip to receive reviews from travel
                      companions
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Security</h4>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Change Password
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Two-Factor Authentication
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Linked Accounts
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Preferences</h4>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Notification Settings
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Privacy Settings
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Email Preferences
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3 text-destructive">
                      Danger Zone
                    </h4>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive border-destructive hover:bg-destructive/10"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive border-destructive hover:bg-destructive/10"
                      >
                        Deactivate Account
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-destructive border-destructive hover:bg-destructive/10"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Account Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Verified</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  ✓ Verified
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Phone Verified</span>
                {profileUser.profile?.phoneNumber ? (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700"
                  >
                    ✓ Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700">
                    Not Added
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Account Type</span>
                <Badge
                  variant={
                    profileUser.role === 'ADMIN' ? 'destructive' : 'outline'
                  }
                >
                  {profileUser.role}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Member Since</span>
                <span className="text-sm text-muted-foreground">2024</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>My Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span>Countries Visited</span>
                </div>
                <span className="font-semibold">
                  {profileUser.profile?.visitedCountries?.length || 0}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Trips Planned</span>
                </div>
                <span className="font-semibold">
                  {profileUser._count?.travelPlans || 0}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Travel Companions</span>
                </div>
                <span className="font-semibold">0</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span>Average Rating</span>
                </div>
                <span className="font-semibold">
                  {averageRating.toFixed(1)}/5
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/travel-plans/new" className="block">
                <Button className="w-full gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Travel Plan
                </Button>
              </Link>
              <Link href="/explore" className="block">
                <Button variant="outline" className="w-full gap-2">
                  <Users className="h-4 w-4" />
                  Find Travel Buddies
                </Button>
              </Link>
              <Link href="/profile/edit" className="block">
                <Button variant="outline" className="w-full gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
