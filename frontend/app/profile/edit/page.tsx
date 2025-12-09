// frontend/app/profile/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { userAPI } from '@/lib/api'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from '@/components/upload/image-upload'
import ProfileEditForm from '@/components/profile/edit-form'
import { AuthUser } from '@/types'

export interface ProfileFormData {
  fullName: string
  bio: string
  travelInterests: string[]
  visitedCountries: string[]
  currentLocation: string
  phoneNumber: string
}

export default function EditProfilePage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<ProfileFormData>({
    fullName: '',
    bio: '',
    travelInterests: [],
    visitedCountries: [],
    currentLocation: '',
    phoneNumber: '',
  })

  useEffect(() => {
    if (user?.profile) {
      setProfileData({
        fullName: user.profile.fullName || '',
        bio: user.profile.bio || '',
        travelInterests: user.profile.travelInterests || [],
        visitedCountries: user.profile.visitedCountries || [],
        currentLocation: user.profile.currentLocation || '',
        phoneNumber: user.profile.phoneNumber || '',
      })
    }
  }, [user])

  // ✅ FIX: Add this function to handle image upload completion
  const handleImageUploadComplete = async (imageUrl: string) => {
    try {
      // Update the profile with the new image URL
      const result = await userAPI.updateProfile({
        ...profileData,
        profileImage: imageUrl
      })
      
      // Update auth context with new user data
      updateUser(result.data.user as unknown as AuthUser)
      
      toast.success('Profile image updated successfully!')
      
      // Optionally refresh the page data
      fetchUserProfile()
    } catch (error) {
      toast.error('Failed to update profile with new image')
    }
  }

  // ✅ FIX: Add function to fetch fresh user data
  const fetchUserProfile = async () => {
    try {
      const result = await userAPI.getProfile()
      updateUser(result.data.user as unknown as AuthUser)
    } catch (error) {
      console.error('Failed to refresh profile:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await userAPI.updateProfile(profileData)
      updateUser(result.data.user as unknown as AuthUser)
      toast.success('Profile updated successfully!')
      router.push('/profile')  // Changed to /profile (own profile)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
              <ImageUpload
                type="profile"
                currentImage={user?.profile?.profileImage ?? undefined}
                onUploadComplete={handleImageUploadComplete}
              />
            </div>

            <ProfileEditForm
              data={profileData}
              onChange={setProfileData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}