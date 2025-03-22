import type * as React from "react"

export const ChartTitle = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-lg font-semibold">{children}</div>
}

export const ChartGrid = () => {
  return null
}

export const ChartXAxis = ({ dataKey }: { dataKey: string }) => {
  return null
}

export const ChartYAxis = () => {
  return null
}

export const ChartBar = ({ dataKey, fill }: { dataKey: string; fill: string }) => {
  return null
}

export const ChartLine = ({
  dataKey,
  stroke,
  type,
  activeDot,
}: { dataKey: string; stroke: string; type: string; activeDot: any }) => {
  return null
}

export const ChartPie = ({
  data,
  dataKey,
  nameKey,
  cx,
  cy,
  outerRadius,
  label,
  children,
}: {
  data: any[]
  dataKey: string
  nameKey: string
  cx: string
  cy: string
  outerRadius: number
  label: any
  children: React.ReactNode
}) => {
  return null
}

ChartPie.Cell = ({ fill }: { fill: string }) => {
  return null
}

export const ChartArea = ({
  type,
  dataKey,
  stroke,
  fill,
}: { type: string; dataKey: string; stroke: string; fill: string }) => {
  return null
}

export const ChartTooltip = () => {
  return null
}

export const ChartLegend = () => {
  return null
}

export const Chart = ({ type, children, layout }: { type: string; children: React.ReactNode; layout?: string }) => {
  return null
}

export const ChartContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={className}>{children}</div>
}

