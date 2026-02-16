import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function TopUsers() {
  const users = [
    { name: 'Olivia Martin', email: 'olivia.martin@email.com', tickets: 24, avatar: 'OM' },
    { name: 'Jackson Lee', email: 'jackson.lee@email.com', tickets: 19, avatar: 'JL' },
    { name: 'Isabella Nguyen', email: 'isabella.nguyen@email.com', tickets: 15, avatar: 'IN' },
    { name: 'William Kim', email: 'will@email.com', tickets: 12, avatar: 'WK' },
    { name: 'Sofia Davis', email: 'sofia.davis@email.com', tickets: 9, avatar: 'SD' },
  ]

  return (
    <div className="space-y-8">
      {users.map((user) => (
        <div key={user.email} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{user.avatar}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="ml-auto font-medium">{user.tickets} Tickets</div>
        </div>
      ))}
    </div>
  )
}
