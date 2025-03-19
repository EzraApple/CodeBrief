import Link from "next/link"
import { Button } from "~/components/ui/button"

export default function NotFound() {
  return (
      <div className="container flex max-w-2xl flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl text-muted-foreground">
          Page not found
        </p>
        <Button asChild>
          <Link href="/">
            Return Home
          </Link>
        </Button>
      </div>
  )
} 