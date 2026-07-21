import type { AuditSummary } from "~features/global-mode"

interface GlobalModeSummaryProps {
  summary: AuditSummary | undefined
}

export function GlobalModeSummary({ summary }: GlobalModeSummaryProps) {
  if (!summary) {
    return <p className="text-xs text-gray-500">Scanning this page…</p>
  }

  return (
    <div className="flex flex-col gap-1 text-xs text-gray-600">
      <div className="flex items-center justify-between">
        <span>Issues found</span>
        <span className="font-medium text-gray-900">{summary.totalIssues}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>Fixed automatically</span>
        <span className="font-medium text-emerald-600">{summary.autoFixed}</span>
      </div>
      {summary.remaining > 0 ? (
        <div className="flex items-center justify-between">
          <span>Need manual review</span>
          <span className="font-medium text-amber-600">{summary.remaining}</span>
        </div>
      ) : null}
    </div>
  )
}
