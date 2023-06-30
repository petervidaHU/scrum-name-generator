import { FunctionComponent, ReactNode, useEffect, useState } from "react"
import { createPortal } from "react-dom"

const Portal: FunctionComponent<{children: ReactNode}> = ({ children }) => {
   const [mounted, setMounted] = useState(false)
   const anchor = typeof window !== 'undefined' ? document.querySelector("#myportal") : null;

   useEffect(() => {
      setMounted(true)

      return () => setMounted(false)
   }, [])

   return mounted && anchor
      ? createPortal(children, anchor)
      : null
}

export default Portal
