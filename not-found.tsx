import Link from 'next/link';
export default function NotFound() {
  return <main className="wrap"><div className="login"><h1>Page not found</h1><p><Link href="/dashboard">Back to dashboard</Link></p></div></main>;
}
