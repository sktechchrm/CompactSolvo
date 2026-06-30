import { useState, useMemo } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel, flexRender,
  type ColumnDef, type SortingState, type RowSelectionState, type PaginationState,
} from '@tanstack/react-table';
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaFileExcel, FaFilePdf } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { cn } from '../../../utils/cn';
import { Button } from '../Button/Button';

interface DataTableProps<T> {
  data: T[]; columns: ColumnDef<T, unknown>[];
  loading?: boolean; pageSize?: number; pageSizes?: number[];
  searchable?: boolean; searchPlaceholder?: string;
  selectable?: boolean; onSelectionChange?: (rows: T[]) => void;
  exportable?: boolean; onExportExcel?: () => void; onExportPdf?: () => void;
  emptyState?: React.ReactNode; caption?: string; className?: string;
}

function SortIcon({ dir }: { dir: false | 'asc' | 'desc' }) {
  if (dir === 'asc')  return <FaSortUp  className="text-brand-500 text-xs" aria-hidden />;
  if (dir === 'desc') return <FaSortDown className="text-brand-500 text-xs" aria-hidden />;
  return <FaSort className="text-content-disabled text-xs" aria-hidden />;
}

export function DataTable<T>({ data, columns, loading=false, pageSize:initPS=25, pageSizes=[10,25,50,100],
  searchable=true, searchPlaceholder='Search…', selectable=false, onSelectionChange,
  exportable=false, onExportExcel, onExportPdf, emptyState, caption, className }: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex:0, pageSize:initPS });

  const finalCols = useMemo<ColumnDef<T, unknown>[]>(() => {
    if (!selectable) return columns;
    return [{
      id:'__sel__',
      header:({table})=><input type="checkbox" checked={table.getIsAllPageRowsSelected()} onChange={table.getToggleAllPageRowsSelectedHandler()} aria-label="Select all" className="w-4 h-4 rounded accent-brand-500 cursor-pointer" />,
      cell:({row})=><input type="checkbox" checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} aria-label={`Select row ${row.index+1}`} className="w-4 h-4 rounded accent-brand-500 cursor-pointer" />,
      size:44, enableSorting:false,
    }, ...columns];
  }, [columns, selectable]);

  const table = useReactTable({
    data, columns:finalCols,
    state:{ sorting, globalFilter, rowSelection, pagination },
    onSortingChange:setSorting, onGlobalFilterChange:setGlobalFilter,
    onRowSelectionChange:(updater)=>{
      setRowSelection(updater);
      if (onSelectionChange) {
        const next = typeof updater==='function' ? updater(rowSelection) : updater;
        onSelectionChange(Object.keys(next).filter(k=>next[k]).map(k=>data[parseInt(k)]));
      }
    },
    onPaginationChange:setPagination,
    getCoreRowModel:getCoreRowModel(), getSortedRowModel:getSortedRowModel(),
    getFilteredRowModel:getFilteredRowModel(), getPaginationRowModel:getPaginationRowModel(),
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const total = table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {(searchable || exportable) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {searchable && (
            <div className="relative min-w-[220px]">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-content-tertiary text-xs" aria-hidden />
              <input type="search" value={globalFilter} onChange={e=>setGlobalFilter(e.target.value)}
                placeholder={searchPlaceholder} aria-label={searchPlaceholder}
                className="w-full pl-8 pr-3 py-2 text-sm bg-surface border border-border rounded-lg text-content placeholder:text-content-tertiary focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-colors dark:bg-surface-2" />
            </div>
          )}
          {exportable && (
            <div className="flex gap-2">
              {onExportExcel && <Button variant="excel" size="sm" iconLeft={<FaFileExcel />} onClick={onExportExcel}>Excel</Button>}
              {onExportPdf   && <Button variant="pdf"   size="sm" iconLeft={<FaFilePdf />}   onClick={onExportPdf}>PDF</Button>}
            </div>
          )}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border shadow-sm">
        <table className="w-full text-sm border-collapse" role="grid" aria-label={caption} aria-rowcount={total} aria-busy={loading}>
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead>
            {table.getHeaderGroups().map(hg=>(
              <tr key={hg.id} className="bg-surface-secondary dark:bg-surface-2 border-b border-border">
                {hg.headers.map(h=>(
                  <th key={h.id} colSpan={h.colSpan}
                    className={cn('px-4 py-3 text-left text-xs font-semibold text-content-secondary uppercase tracking-wider whitespace-nowrap select-none', h.column.getCanSort()&&'cursor-pointer hover:text-content transition-colors')}
                    onClick={h.column.getToggleSortingHandler()}
                    aria-sort={h.column.getIsSorted()==='asc'?'ascending':h.column.getIsSorted()==='desc'?'descending':h.column.getCanSort()?'none':undefined}
                    style={{ width:h.column.columnDef.size }}>
                    {h.isPlaceholder ? null : (
                      <span className="inline-flex items-center gap-1.5">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {h.column.getCanSort() && <SortIcon dir={h.column.getIsSorted()} />}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={finalCols.length} className="p-0">
                {Array.from({length:8}).map((_,i)=>(
                  <div key={i} className="px-4 py-3 flex gap-4 border-b border-border last:border-0">
                    {Array.from({length:finalCols.length}).map((_,j)=>(
                      <div key={j} className="h-4 rounded animate-shimmer flex-1"
                        style={{background:'linear-gradient(90deg,#E2E8F0 25%,#F1F5F9 50%,#E2E8F0 75%)',backgroundSize:'800px 100%'}} />
                    ))}
                  </div>
                ))}
              </td></tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={finalCols.length} className="py-16 text-center text-content-secondary">
                {emptyState ?? (
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-3xl">📭</span>
                    <span className="text-sm">কোনো তথ্য পাওয়া যায়নি</span>
                    {globalFilter && <button onClick={()=>setGlobalFilter('')} className="text-xs text-brand-500 hover:underline mt-1">Clear search</button>}
                  </div>
                )}
              </td></tr>
            ) : (
              table.getRowModel().rows.map(row=>(
                <tr key={row.id} className={cn('border-b border-border last:border-0 hover:bg-surface-secondary dark:hover:bg-surface-3 transition-colors duration-75', row.getIsSelected()&&'bg-brand-50 dark:bg-brand-950')} aria-selected={selectable?row.getIsSelected():undefined}>
                  {row.getVisibleCells().map(cell=>(
                    <td key={cell.id} className="px-4 py-3 text-content">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && total > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-content-secondary">
          <div className="flex items-center gap-3">
            <span>{pageIndex*pageSize+1}–{Math.min((pageIndex+1)*pageSize,total)} of {total}</span>
            <label className="flex items-center gap-1.5">
              Rows:
              <select value={pageSize} onChange={e=>table.setPageSize(Number(e.target.value))} aria-label="Rows per page"
                className="ml-1 text-sm border border-border rounded px-1.5 py-0.5 bg-surface text-content cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-500">
                {pageSizes.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>
          <nav aria-label="Table pagination" className="flex items-center gap-1">
            {[
              {fn:()=>table.setPageIndex(0), d:!table.getCanPreviousPage(), l:'First page', I:FiChevronsLeft},
              {fn:()=>table.previousPage(),   d:!table.getCanPreviousPage(), l:'Prev page',  I:FiChevronLeft},
              {fn:()=>table.nextPage(),        d:!table.getCanNextPage(),    l:'Next page',  I:FiChevronRight},
              {fn:()=>table.setPageIndex(pageCount-1), d:!table.getCanNextPage(), l:'Last page', I:FiChevronsRight},
            ].map(({fn,d,l,I},i)=>(
              <Button key={i} variant="ghost" size="icon-sm" onClick={fn} disabled={d} aria-label={l}><I aria-hidden /></Button>
            ))}
            <span className="px-2 font-medium text-content">{pageIndex+1}/{pageCount}</span>
          </nav>
        </div>
      )}
    </div>
  );
}
