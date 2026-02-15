import { Link } from '@tanstack/react-router'
import { Facebook, Globe, Instagram, Linkedin, Twitter } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function PublicFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link className="flex items-center space-x-2 mb-4" to="/">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground italic">
                  C
                </span>
              </div>
              <span className="text-xl font-bold tracking-tight">
                CLARA<span className="text-primary italic">LEARN</span>
              </span>
            </Link>
            <p className="text-muted-foreground max-w-xs mb-6 text-sm leading-relaxed">
              Empowering learners worldwide with premium quality courses from
              industry experts. Start your journey today and unlock your
              potential.
            </p>
            <div className="flex gap-4">
              <Button
                className="h-9 w-9 rounded-full"
                size="icon"
                variant="ghost"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                className="h-9 w-9 rounded-full"
                size="icon"
                variant="ghost"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button
                className="h-9 w-9 rounded-full"
                size="icon"
                variant="ghost"
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                className="h-9 w-9 rounded-full"
                size="icon"
                variant="ghost"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Discovery</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors"
                  to="/"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors"
                  to="/"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors"
                  to="/"
                >
                  Certificates
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors"
                  to="/"
                >
                  Career tracks
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Teach</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors"
                  to="/"
                >
                  Teach on Clara
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors"
                  to="/"
                >
                  Best practices
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors"
                  to="/"
                >
                  Course quality
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors"
                  to="/"
                >
                  Instructor awards
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors"
                  to="/"
                >
                  About us
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors"
                  to="/"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors"
                  to="/"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground hover:text-primary transition-colors"
                  to="/"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              className="h-9 rounded-full gap-2"
              size="sm"
              variant="outline"
            >
              <Globe className="h-4 w-4" />
              English
            </Button>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              © {currentYear} Clara Learn, Inc.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link
              className="hover:text-primary underline-offset-4 hover:underline"
              to="/"
            >
              Terms of Use
            </Link>
            <Link
              className="hover:text-primary underline-offset-4 hover:underline"
              to="/"
            >
              Privacy Policy
            </Link>
            <Link
              className="hover:text-primary underline-offset-4 hover:underline"
              to="/"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
