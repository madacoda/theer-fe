import { Link, useLocation } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const { pathname } = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isUrlActive = (url: string) => {
            if (!url || url === '#') return false
            const normalizedPath = pathname.replace(/\/$/, '')
            const normalizedUrl = url.replace(/\/$/, '')
            return (
              normalizedPath === normalizedUrl ||
              normalizedPath.startsWith(normalizedUrl + '/')
            )
          }

          const isParentActive =
            isUrlActive(item.url) ||
            item.items?.some((subItem) => isUrlActive(subItem.url))

          if (item.items) {
            return (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
                defaultOpen={item.isActive || isParentActive}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isParentActive}
                      tooltip={item.title}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => {
                        const isSubActive =
                          pathname.replace(/\/$/, '') ===
                          subItem.url.replace(/\/$/, '')

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubActive}
                            >
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        )
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isUrlActive(item.url)}
                tooltip={item.title}
              >
                <Link to={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
