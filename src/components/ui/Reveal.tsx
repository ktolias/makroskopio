import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  as?: ElementType
  y?: number
}

export function Reveal({ children, delay = 0, className, as = 'div', y = 22 }: RevealProps) {
  const Comp = motion[as as keyof typeof motion] as ElementType
  const props: HTMLMotionProps<'div'> = {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-12% 0px -12% 0px' },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }
  return (
    <Comp className={className} {...props}>
      {children}
    </Comp>
  )
}
