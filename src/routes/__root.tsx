import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  createRootRoute,
  HeadContent,
  Link,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { Toaster } from '@/components/ui/sonner'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: '',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap',
      },
    ],
  }),

  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center">
      <div className="space-y-6 max-w-md animate-in fade-in zoom-in duration-500">
        <div className="relative inline-block">
          <h1 className="text-9xl font-black text-primary/10 tracking-tighter">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl font-bold tracking-tight">Oops!</h2>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight">
            Page not found
          </h3>
          <p className="text-muted-foreground text-balanced">
            It seems like the page you are looking for doesn't exist or has been
            moved to a new location.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            to="/"
          >
            Go back home
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            onClick={() => window.history.back()}
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Toaster position="top-right" />
        <Scripts />
      </body>
    </html>
  )
}
