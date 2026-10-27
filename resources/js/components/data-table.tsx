import {
    tableFeatures,
    useTable,
    rowPaginationFeature,
    type ColumnDef,
    type PaginationState,
    type RowData,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type DataTableProps<TData extends RowData> = {
    columns: ColumnDef<typeof dataTableFeatures, TData, any>[];
    data: TData[];
    pageIndex: number;
    pageCount: number;
    total: number;
    from: number | null;
    to: number | null;
    onPageChange: (pageIndex: number) => void;
    emptyMessage: string;
    itemLabel?: string;
};

export const dataTableFeatures = tableFeatures({ rowPaginationFeature });

export function DataTable<TData extends RowData>({
    columns,
    data,
    pageIndex,
    pageCount,
    total,
    from,
    to,
    onPageChange,
    emptyMessage,
    itemLabel = "FAQ",
}: DataTableProps<TData>) {
    const table = useTable({
        features: dataTableFeatures,
        data,
        columns,
        manualPagination: true,
        pageCount,
        state: { pagination: { pageIndex, pageSize: 10 } satisfies PaginationState },
        onPaginationChange: (updater) => {
            const current = { pageIndex, pageSize: 10 };
            const next = typeof updater === "function" ? updater(current) : updater;
            onPageChange(next.pageIndex);
        },
    });

    return (
        <>
            <div className="overflow-x-auto">
                <Table className="min-w-[760px]">
                    <TableHeader className="bg-[#F7F8FD] text-xs uppercase tracking-wide">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <table.FlexRender header={header} />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} className="hover:bg-[#F7F8FD]/70">
                                    {row.getAllCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-28 text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm text-muted-foreground">
                    {total > 0
                        ? `Menampilkan ${from}–${to} dari ${total} ${itemLabel}`
                        : `Belum ada data ${itemLabel.toLowerCase()}.`}
                </p>
                {pageCount > 1 && (
                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={!table.getCanPreviousPage()}
                            onClick={() => table.previousPage()}
                        >
                            <ChevronLeft />
                            Sebelumnya
                        </Button>
                        <span className="px-2 text-sm text-muted-foreground">
                            Halaman {pageIndex + 1} dari {pageCount}
                        </span>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={!table.getCanNextPage()}
                            onClick={() => table.nextPage()}
                        >
                            Berikutnya
                            <ChevronRight />
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
