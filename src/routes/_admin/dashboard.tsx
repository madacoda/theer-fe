import { createFileRoute } from '@tanstack/react-router'
import { Activity, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react'

import { ChartAreaInteractive } from '@/components/admin/dashboard/area-chart-interactive'
import { TopUsers } from '@/components/admin/dashboard/top-users'
import { TopCategories } from '@/components/admin/dashboard/top-categories'
import { TopAdmins } from '@/components/admin/dashboard/top-admins'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export const Route = createFileRoute('/_admin/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">
              +12 from yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">
              Processed Tickets
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,240</div>
            <p className="text-xs text-muted-foreground">
              +85 this week
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">
              AI Handled (Draft)
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              Needs human resolution
            </p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets Today</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">
              +15% from avg
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ChartAreaInteractive />
        </div>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Users</CardTitle>
            <CardDescription>
              Users with the most ticket submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopUsers />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>
              Most frequent ticket categories this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopCategories />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Admins (Weekly)</CardTitle>
            <CardDescription>
              Agents with the highest resolution rate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TopAdmins />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
