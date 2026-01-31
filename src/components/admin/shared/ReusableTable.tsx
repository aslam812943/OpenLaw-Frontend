
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
}

export function ReusableTable<T extends { id?: string | number; _id?: string | number }>({
    columns,
    data,
    isLoading = false,
    emptyMessage = "No data found.",
}: ReusableTableProps<T>) {
    const getRowKey = (row: T, index: number): string | number => {
        if (row.id) return row.id;
        if (row._id) return row._id;
        return index;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 bg-white/50 backdrop-blur-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600"></div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500 italic">{emptyMessage}</div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
            <table className="min-w-full text-sm text-left border-collapse">
                <thead className="bg-gray-100 border-b border-gray-200">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                className={`px-4 py-3 font-semibold text-gray-700 ${col.headerClassName || ""} ${col.className || ""}`}
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
                            className="border-b hover:bg-gray-50 transition duration-150"
                        >
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className={`px-4 py-3 ${col.className || ""}`}>
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
