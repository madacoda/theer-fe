import { Link } from '@tanstack/react-router'
import { ChevronDown, Menu, Search, ShoppingCart } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { isAuthenticated } from '@/lib/auth'

export function PublicNavbar() {
  const isAuth = isAuthenticated()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left: Logo & Categories */}
        <div className="flex items-center gap-6 lg:gap-10">
          <Link className="flex items-center space-x-2" to="/">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground italic">
                C
              </span>
            </div>
            <span className="hidden text-xl font-bold sm:inline-block tracking-tight">
              CLARA<span className="text-primary italic">LEARN</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary">
                  Categories <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuItem>Development</DropdownMenuItem>
                <DropdownMenuItem>Business</DropdownMenuItem>
                <DropdownMenuItem>IT & Software</DropdownMenuItem>
                <DropdownMenuItem>Design</DropdownMenuItem>
                <DropdownMenuItem>Marketing</DropdownMenuItem>
                <DropdownMenuItem>Photography</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        {/* Center: Search Bar (Desktop) */}
        <div className="hidden flex-1 px-8 md:flex max-w-2xl">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              className="w-full bg-muted/50 pl-10 h-10 rounded-full border-transparent focus-visible:ring-primary/20 transition-all hover:bg-muted"
              placeholder="Search for anything..."
              type="search"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <nav className="hidden lg:flex items-center gap-4 mr-2">
            <Link
              className="text-sm font-medium hover:text-primary decoration-primary underline-offset-4 hover:underline"
              to="/"
            >
              Teach on Clara
            </Link>
            {isAuth && (
              <Link className="text-sm font-medium hover:text-primary" to="/">
                My Learning
              </Link>
            )}
          </nav>

          <Button className="relative group" size="icon" variant="ghost">
            <ShoppingCart className="h-5 w-5 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              0
            </span>
          </Button>

          {!isAuth ? (
            <div className="hidden sm:flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link to="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <Link to="/login">Sign up</Link>
              </Button>
            </div>
          ) : (
            <Button asChild className="rounded-full" variant="outline">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          )}

          <div className="flex lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]" side="right">
                <div className="flex flex-col gap-6 py-4">
                  <Link
                    className="text-xl font-bold italic text-primary"
                    to="/"
                  >
                    CLARA LEARN
                  </Link>
                  <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                      Most Popular
                    </h3>
                    <div className="grid gap-2">
                      <Link
                        className="text-lg font-medium hover:text-primary"
                        to="/"
                      >
                        Development
                      </Link>
                      <Link
                        className="text-lg font-medium hover:text-primary"
                        to="/"
                      >
                        Business
                      </Link>
                      <Link
                        className="text-lg font-medium hover:text-primary"
                        to="/"
                      >
                        Design
                      </Link>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex flex-col gap-4">
                      {!isAuth && (
                        <>
                          <Button asChild className="w-full" variant="outline">
                            <Link to="/login">Log in</Link>
                          </Button>
                          <Button asChild className="w-full">
                            <Link to="/login">Sign up</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
