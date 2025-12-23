// frontend/components/profile/edit-form.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { ProfileFormData } from '@/app/profile/edit/page'

interface ProfileEditFormProps {
  data: ProfileFormData
  onChange: (data: ProfileFormData) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export default function ProfileEditForm({
  data,
  onChange,
  onSubmit,
  isLoading
}: ProfileEditFormProps) {
  const [interestInput, setInterestInput] = useState('')
  const [countryInput, setCountryInput] = useState('')

  const addInterest = () => {
    if (interestInput.trim() && !data.travelInterests.includes(interestInput.trim())) {
      onChange({
        ...data,
        travelInterests: [...data.travelInterests, interestInput.trim()]
      })
      setInterestInput('')
    }
  }

  const removeInterest = (interest: string) => {
    onChange({
      ...data,
      travelInterests: data.travelInterests.filter((i: string) => i !== interest)
    })
  }

  const addCountry = () => {
    if (countryInput.trim() && !data.visitedCountries.includes(countryInput.trim())) {
      onChange({
        ...data,
        visitedCountries: [...data.visitedCountries, countryInput.trim()]
      })
      setCountryInput('')
    }
  }

  const removeCountry = (country: string) => {
    onChange({
      ...data,
      visitedCountries: data.visitedCountries.filter((c: string) => c !== country)
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={data.fullName}
          onChange={(e) => onChange({ ...data, fullName: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => onChange({ ...data, bio: e.target.value })}
          rows={4}
          placeholder="Tell others about yourself..."
        />
      </div>

      <div>
        <Label htmlFor="currentLocation">Current Location</Label>
        <Input
          id="currentLocation"
          value={data.currentLocation}
          onChange={(e) => onChange({ ...data, currentLocation: e.target.value })}
          placeholder="City, Country"
        />
      </div>

      <div>
        <Label>Travel Interests</Label>
        <div className="flex gap-2 mb-3">
          <Input
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            placeholder="Add an interest (e.g., hiking, food tours)"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
          />
          <Button type="button" onClick={addInterest}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.travelInterests.map((interest: string, index: number) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {interest}
              <button type="button" onClick={() => removeInterest(interest)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>Visited Countries</Label>
        <div className="flex gap-2 mb-3">
          <Input
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
            placeholder="Add a country"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCountry())}
          />
          <Button type="button" onClick={addCountry}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.visitedCountries.map((country: string, index: number) => (
            <Badge key={index} variant="outline" className="gap-1">
              {country}
              <button type="button" onClick={() => removeCountry(country)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          value={data.phoneNumber}
          onChange={(e) => onChange({ ...data, phoneNumber: e.target.value })}
          placeholder="+1234567890"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}