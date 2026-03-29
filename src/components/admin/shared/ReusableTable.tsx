
export interface Column<T> {
    header: string;
    accessor?: keyof T;
    render?: (row: T) => React.ReactNode;
    className?: string;
    headerClassName?: string;
}

interface ReusableTableProps<T> {
    columns: Column<T>[];
    data: T[];
    isLoading?: boolean;
    emptyMessage?: string;
    variant?: 'light' | 'dark';
}

export function ReusableTable<T extends { id?: string | number; _id?: string | number }>({
    columns,
    data,
    isLoading = false,
    emptyMessage = "No data found.",
    variant = "light",
}: ReusableTableProps<T>) {
    const getRowKey = (row: T, index: number): string | number => {
        if (row.id) return row.id;
        if (row._id) return row._id;
        return index;
    };

    if (isLoading) {
        return (
            <div className={`flex justify-center items-center h-64 ${variant === 'dark' ? 'bg-white/5' : 'bg-white/50'} backdrop-blur-sm`}>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className={`p-6 text-center ${variant === 'dark' ? 'text-slate-400' : 'text-gray-500'} italic`}>{emptyMessage}</div>
        );
    }

    const containerClasses = variant === 'dark'
        ? "overflow-x-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
        : "overflow-x-auto bg-white rounded-lg shadow-md";

    const headerClasses = variant === 'dark'
        ? "bg-white/5 border-b border-white/10"
        : "bg-gray-100 border-b border-gray-200";

    const thClasses = variant === 'dark'
        ? "text-slate-200"
        : "text-gray-700";

    const rowClasses = variant === 'dark'
        ? "border-b border-white/5 hover:bg-white/5 text-slate-300"
        : "border-b hover:bg-gray-50 text-gray-700";

    return (
        <div className={containerClasses}>
            <table className="min-w-full text-sm text-left border-collapse">
                <thead className={headerClasses}>
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`px-4 py-4 font-bold uppercase tracking-wider ${thClasses} ${col.headerClassName || ""} ${col.className || ""}`}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={getRowKey(row, rowIndex)}
                            className={`transition duration-150 ${rowClasses}`}
                        >
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className={`px-4 py-4 ${col.className || ""}`}>
                                    {col.render
                                        ? col.render(row)
                                        : col.accessor
                                            ? (row[col.accessor] as React.ReactNode)
                                            : null}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
