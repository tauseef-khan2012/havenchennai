import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <Link href="/booking" className="text-blue-600 underline">Start booking</Link>
    </main>
  )
}

