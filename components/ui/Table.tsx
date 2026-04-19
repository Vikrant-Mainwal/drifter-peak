import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Generic table — pass headers + rows as config
export interface Column<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  render?: (row: T) => ReactNode;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T>({
  columns, data, keyField, loading, emptyMessage = "No data found", onRowClick,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto border" style={{ borderColor: "var(--border)" }}>
      <table className="w-full min-w-[600px]">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
            {columns.map(col => (
              <th key={String(col.key)}
                className="px-4 py-3 text-left font-mono text-[9px] tracking-[0.3em]"
                style={{ color: "var(--muted)", width: col.width }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={String(row[keyField])}
              onClick={() => onRowClick?.(row)}
              className={cn(
                "border-b transition-colors",
                onRowClick && "cursor-pointer hover:bg-white/[0.01]"
              )}
              style={{ borderColor: "var(--border)", animationDelay: `${i * 40}ms` }}>
              {columns.map(col => (
                <td key={String(col.key)} className="px-4 py-4">
                  {col.render
                    ? col.render(row)
                    : <span className="font-body text-sm" style={{ color: "var(--fg)" }}>
                        {String(row[col.key as keyof T] ?? "")}
                      </span>
                  }
                </td>
              ))}
            </tr>
          ))}
          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-16 text-center font-mono text-xs tracking-widest"
                style={{ color: "var(--muted)" }}>
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}