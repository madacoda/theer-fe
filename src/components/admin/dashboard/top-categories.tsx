export function TopCategories() {
  const categories = [
    { name: 'Billing Issues', count: 145, color: 'bg-red-500' },
    { name: 'Technical Support', count: 120, color: 'bg-blue-500' },
    { name: 'Feature Requests', count: 85, color: 'bg-green-500' },
    { name: 'Account Access', count: 64, color: 'bg-yellow-500' },
    { name: 'General Inquiry', count: 42, color: 'bg-gray-500' },
  ]

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <div key={category.name} className="flex items-center">
          <div className={`w-2 h-10 rounded-full ${category.color} mr-4`} />
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{category.name}</p>
            <p className="text-sm text-muted-foreground">Most frequent category</p>
          </div>
          <div className="ml-auto font-medium">{category.count}</div>
        </div>
      ))}
    </div>
  )
}
