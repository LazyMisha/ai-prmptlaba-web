/**
 * Passthrough layout for inner pages route group.
 * Individual page layouts (enhance, saved, history) handle Header configuration.
 */
export default function InnerGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
