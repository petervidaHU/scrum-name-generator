import '@/styles/globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from 'flowbite-react';

const inter = Inter({ subsets: ['latin'] })

/* export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
} */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar
        className="p-6 drop-shadow-md"
        fluid
        rounded
      >
        <Navbar.Toggle />
        <Navbar.Collapse
        >
          <Navbar.Link
            active
            href="#"
          >
            <p>
              Home
            </p>
          </Navbar.Link>
          <Navbar.Link
            active
            href="#"
          >
            <p>
              Home
            </p>
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <main >{children}</main>
    </>
  )
}
