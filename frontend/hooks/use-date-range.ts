"use client"

import { useState } from "react"

export const useDateRange = () => {
  const [date, setDate] = useState<
    | {
        from: Date | undefined
        to: Date | undefined
      }
    | undefined
  >(undefined)

  return { date, setDate }
}

