'use client'

import * as React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const description = 'Ticket inputs per day'

const chartData = [
  { date: '2024-04-01', total: 120, ai_resolved: 45 },
  { date: '2024-04-02', total: 145, ai_resolved: 55 },
  { date: '2024-04-03', total: 167, ai_resolved: 60 },
  { date: '2024-04-04', total: 132, ai_resolved: 48 },
  { date: '2024-04-05', total: 180, ai_resolved: 75 },
  { date: '2024-04-06', total: 155, ai_resolved: 70 },
  { date: '2024-04-07', total: 98, ai_resolved: 40 },
  { date: '2024-04-08', total: 110, ai_resolved: 45 },
  { date: '2024-04-09', total: 130, ai_resolved: 60 },
  { date: '2024-04-10', total: 145, ai_resolved: 65 },
  { date: '2024-04-11', total: 160, ai_resolved: 80 },
  { date: '2024-04-12', total: 125, ai_resolved: 55 },
  { date: '2024-04-13', total: 115, ai_resolved: 50 },
  { date: '2024-04-14', total: 85, ai_resolved: 35 },
  { date: '2024-04-15', total: 120, ai_resolved: 55 },
  { date: '2024-04-16', total: 140, ai_resolved: 65 },
  { date: '2024-04-17', total: 155, ai_resolved: 75 },
  { date: '2024-04-18', total: 170, ai_resolved: 85 },
  { date: '2024-04-19', total: 145, ai_resolved: 70 },
  { date: '2024-04-20', total: 110, ai_resolved: 45 },
  { date: '2024-04-21', total: 95, ai_resolved: 40 },
  { date: '2024-04-22', total: 130, ai_resolved: 60 },
  { date: '2024-04-23', total: 150, ai_resolved: 70 },
  { date: '2024-04-24', total: 165, ai_resolved: 80 },
  { date: '2024-04-25', total: 140, ai_resolved: 65 },
  { date: '2024-04-26', total: 135, ai_resolved: 60 },
  { date: '2024-04-27', total: 105, ai_resolved: 45 },
  { date: '2024-04-28', total: 90, ai_resolved: 40 },
  { date: '2024-04-29', total: 125, ai_resolved: 60 },
  { date: '2024-04-30', total: 150, ai_resolved: 75 },
  { date: '2024-05-01', total: 160, ai_resolved: 80 },
  { date: '2024-05-02', total: 175, ai_resolved: 90 },
  { date: '2024-05-03', total: 145, ai_resolved: 70 },
  { date: '2024-05-04', total: 120, ai_resolved: 55 },
  { date: '2024-05-05', total: 100, ai_resolved: 45 },
  { date: '2024-05-06', total: 140, ai_resolved: 70 },
  { date: '2024-05-07', total: 155, ai_resolved: 80 },
  { date: '2024-05-08', total: 165, ai_resolved: 90 },
  { date: '2024-05-09', total: 180, ai_resolved: 100 },
  { date: '2024-05-10', total: 160, ai_resolved: 85 },
  { date: '2024-05-11', total: 130, ai_resolved: 65 },
  { date: '2024-05-12', total: 110, ai_resolved: 50 },
  { date: '2024-05-13', total: 145, ai_resolved: 75 },
  { date: '2024-05-14', total: 165, ai_resolved: 90 },
  { date: '2024-05-15', total: 185, ai_resolved: 110 },
  { date: '2024-05-16', total: 170, ai_resolved: 95 },
  { date: '2024-05-17', total: 155, ai_resolved: 80 },
  { date: '2024-05-18', total: 135, ai_resolved: 65 },
  { date: '2024-05-19', total: 120, ai_resolved: 55 },
  { date: '2024-05-20', total: 150, ai_resolved: 80 },
  { date: '2024-05-21', total: 160, ai_resolved: 90 },
  { date: '2024-05-22', total: 175, ai_resolved: 105 },
  { date: '2024-05-23', total: 180, ai_resolved: 115 },
  { date: '2024-05-24', total: 155, ai_resolved: 90 },
  { date: '2024-05-25', total: 130, ai_resolved: 70 },
  { date: '2024-05-26', total: 115, ai_resolved: 60 },
  { date: '2024-05-27', total: 145, ai_resolved: 85 },
  { date: '2024-05-28', total: 160, ai_resolved: 95 },
  { date: '2024-05-29', total: 170, ai_resolved: 105 },
  { date: '2024-05-30', total: 155, ai_resolved: 90 },
  { date: '2024-05-31', total: 140, ai_resolved: 80 },
  { date: '2024-06-01', total: 125, ai_resolved: 65 },
  { date: '2024-06-02', total: 105, ai_resolved: 50 },
  { date: '2024-06-03', total: 150, ai_resolved: 90 },
  { date: '2024-06-04', total: 170, ai_resolved: 110 },
  { date: '2024-06-05', total: 185, ai_resolved: 125 },
  { date: '2024-06-06', total: 165, ai_resolved: 105 },
  { date: '2024-06-07', total: 150, ai_resolved: 90 },
  { date: '2024-06-08', total: 130, ai_resolved: 75 },
  { date: '2024-06-09', total: 115, ai_resolved: 60 },
  { date: '2024-06-10', total: 160, ai_resolved: 100 },
  { date: '2024-06-11', total: 180, ai_resolved: 120 },
  { date: '2024-06-12', total: 195, ai_resolved: 135 },
  { date: '2024-06-13', total: 175, ai_resolved: 115 },
  { date: '2024-06-14', total: 165, ai_resolved: 105 },
  { date: '2024-06-15', total: 140, ai_resolved: 85 },
  { date: '2024-06-16', total: 125, ai_resolved: 70 },
  { date: '2024-06-17', total: 165, ai_resolved: 110 },
  { date: '2024-06-18', total: 185, ai_resolved: 130 },
  { date: '2024-06-19', total: 210, ai_resolved: 155 },
  { date: '2024-06-20', total: 190, ai_resolved: 140 },
  { date: '2024-06-21', total: 175, ai_resolved: 125 },
  { date: '2024-06-22', total: 150, ai_resolved: 100 },
  { date: '2024-06-23', total: 135, ai_resolved: 85 },
  { date: '2024-06-24', total: 170, ai_resolved: 120 },
  { date: '2024-06-25', total: 195, ai_resolved: 145 },
  { date: '2024-06-26', total: 220, ai_resolved: 170 },
  { date: '2024-06-27', total: 200, ai_resolved: 150 },
  { date: '2024-06-28', total: 185, ai_resolved: 135 },
  { date: '2024-06-29', total: 160, ai_resolved: 110 },
  { date: '2024-06-30', total: 145, ai_resolved: 95 },
]

const chartConfig = {
  tickets: {
    label: 'Tickets',
  },
  total: {
    label: 'Total Tickets',
    color: 'var(--chart-1)',
  },
  ai_resolved: {
    label: 'AI Resolved',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState('90d')

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date('2024-06-30')
    let daysToSubtract = 90
    if (timeRange === '30d') {
      daysToSubtract = 30
    } else if (timeRange === '7d') {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0 border-0 shadow-none">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row px-0">
        <div className="grid flex-1 gap-1">
          <CardTitle>Ticket Inputs per Day</CardTitle>
          <CardDescription>
            Showing incoming tickets and AI-resolved tickets
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            aria-label="Select a value"
            className="w-[160px] rounded-lg sm:ml-auto"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem className="rounded-lg" value="90d">
              Last 3 months
            </SelectItem>
            <SelectItem className="rounded-lg" value="30d">
              Last 30 days
            </SelectItem>
            <SelectItem className="rounded-lg" value="7d">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-0 pt-4 sm:pt-6">
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTotal" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-total)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAi" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ai_resolved)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ai_resolved)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="date"
              minTickGap={32}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }}
                />
              }
            />
            <Area
              dataKey="ai_resolved"
              fill="url(#fillAi)"
              stackId="a"
              stroke="var(--color-ai_resolved)"
              type="natural"
            />
            <Area
              dataKey="total"
              fill="url(#fillTotal)"
              stackId="a"
              stroke="var(--color-total)"
              type="natural"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
