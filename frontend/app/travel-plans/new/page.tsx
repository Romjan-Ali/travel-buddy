// frontend/app/travel-plans/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useAuth, useProtectedRoute } from '@/lib/auth-context'
import { travelPlanAPI } from '@/lib/api'
import { toast } from 'sonner'
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Users, 
  Globe, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react'

const travelPlanSchema = z.object({
  destination: z.string().min(2, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  budget: z.string().min(1, 'Budget is required'),
  travelType: z.enum(['SOLO', 'FAMILY', 'FRIENDS', 'COUPLE', 'BUSINESS']),
  description: z.string().optional(),
  isPublic: z.boolean().default(true),
})

type TravelPlanFormData = z.infer<typeof travelPlanSchema>

export default function NewTravelPlanPage() {
  const router = useRouter()
  useProtectedRoute()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TravelPlanFormData>({
    resolver: zodResolver(travelPlanSchema),
    defaultValues: {
      travelType: 'SOLO',
      isPublic: true,
    },
  })

  const isPublic = watch('isPublic')
  const startDate = watch('startDate')
  const endDate = watch('endDate')

  const onSubmit = async (data: TravelPlanFormData) => {
    setIsLoading(true)
    try {
      const response = await travelPlanAPI.create(data)
      toast.success('Travel plan created successfully!')
      router.push(`/travel-plans/${response.data.travelPlan.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create travel plan')
      console.error('Create travel plan error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const travelTypes = [
    { value: 'SOLO', label: 'Solo Travel', icon: '👤' },
    { value: 'FAMILY', label: 'Family Trip', icon: '👨‍👩‍👧‍👦' },
    { value: 'FRIENDS', label: 'Friends Trip', icon: '👥' },
    { value: 'COUPLE', label: 'Couple Trip', icon: '💑' },
    { value: 'BUSINESS', label: 'Business Trip', icon: '💼' },
  ]

  const budgetOptions = [
    'Budget ($500-1000)',
    'Moderate ($1000-2000)',
    'Luxury ($2000-5000)',
    'Flexible',
  ]

  return (
    <div className="container py-8">
      <Button
        variant="ghost"
        className="mb-6 gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Travel Plans
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Create New Travel Plan
          </CardTitle>
          <CardDescription>
            Share your travel plans to find compatible travel buddies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Destination */}
            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="destination"
                  placeholder="e.g., Tokyo, Japan"
                  className="pl-10"
                  {...register('destination')}
                  disabled={isLoading}
                />
              </div>
              {errors.destination && (
                <p className="text-sm text-destructive">{errors.destination.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Be specific about city and country for better matches
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    className="pl-10"
                    {...register('startDate')}
                    disabled={isLoading}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="date"
                    className="pl-10"
                    {...register('endDate')}
                    disabled={isLoading}
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errors.endDate && (
                  <p className="text-sm text-destructive">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {startDate && endDate && new Date(startDate) > new Date(endDate) && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">
                  End date must be after start date
                </p>
              </div>
            )}

            {/* Travel Type */}
            <div className="space-y-2">
              <Label>Travel Type *</Label>
              <Select
                onValueChange={(value: TravelPlanFormData['travelType']) => 
                  setValue('travelType', value)
                }
                defaultValue="SOLO"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select travel type" />
                </SelectTrigger>
                <SelectContent>
                  {travelTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.travelType && (
                <p className="text-sm text-destructive">{errors.travelType.message}</p>
              )}
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label>Budget Range *</Label>
              <Select
                onValueChange={(value) => setValue('budget', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{option}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.budget && (
                <p className="text-sm text-destructive">{errors.budget.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell potential travel buddies about your plans, interests, and what you're looking for..."
                className="min-h-[120px]"
                {...register('description')}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Include activities you&apos;re interested in, accommodation preferences, or any specific requirements
              </p>
            </div>

            {/* Visibility */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label className="text-base">Make this plan public</Label>
                <p className="text-sm text-muted-foreground">
                  {isPublic 
                    ? 'Other travelers can see and request to join your plan'
                    : 'Only you can see this plan'
                  }
                </p>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={(checked) => setValue('isPublic', checked)}
                disabled={isLoading}
              />
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gap-2"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : (
                  <>
                    <MapPin className="h-4 w-4" />
                    Create Travel Plan
                  </>
                )}
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-4 border-t">
              <p>Tip: Complete profiles and detailed plans get 3x more matches!</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}