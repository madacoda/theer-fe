import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function TopAdmins() {
  const admins = [
    { name: 'Admin Sarah', resolved: 156, avatar: 'AS' },
    { name: 'Admin John', resolved: 142, avatar: 'AJ' },
    { name: 'Admin Michael', resolved: 128, avatar: 'AM' },
    { name: 'Admin Emma', resolved: 115, avatar: 'AE' },
  ]

  return (
    <div className="space-y-8">
      {admins.map((admin) => (
        <div key={admin.name} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{admin.avatar}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{admin.name}</p>
            <p className="text-sm text-muted-foreground">Top resolver this week</p>
          </div>
          <div className="ml-auto font-medium text-green-600">+{admin.resolved}</div>
        </div>
      ))}
    </div>
  )
}
