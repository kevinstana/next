"use client";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

type Person = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
};

const data: Person[] = Array.from({ length: 19 }, (_, index) => ({
  id: index + 1,
  firstName: `John ${index + 1}`,
  lastName: `Doe ${index + 1}`,
  email: `john.doe${index + 1}@example.com`,
  role: index % 2 === 0 ? "Admin" : "User",
  status: index % 3 === 0 ? "inactive" : "active",
  lastLogin: "2023-12-20",
}));

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("firstName", {
    header: "First Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("lastName", {
    header: "Last Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span
        className={`px-2 py-1 rounded-full text-sm ${
          info.getValue() === "active"
            ? "bg-green-500/20 text-green-500"
            : "bg-red-500/20 text-red-500"
        }`}
      >
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("lastLogin", {
    header: "Last Login",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: () => (
      <div className="flex items-center space-x-2">
        <button className="p-1 hover:bg-dark-bg-tertiary rounded transition-colors">
          1
        </button>
        <button className="p-1 hover:bg-dark-bg-tertiary rounded transition-colors">
          2
        </button>
        <button className="p-1 hover:bg-dark-bg-tertiary rounded transition-colors">
          3
        </button>
      </div>
    ),
  }),
];

export default function UsersTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <>
      <div className="flex overflow-hidden">
        <div className="relative overflow-auto shadow-md sm:rounded-lg w-[70vw] max-h-[70rem]">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 dark:bg-custom-gray-1 dark:text-slate-100 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 resize-x text-nowrap"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                  <th
                    scope="col"
                    // className="px-6 py-3 sticky top-0 right-0 bg-gray-200 dark:bg-custom-gray-3"
                    className="px-6 py-3 text-left text-xs font-medium text-dark-text-secondary uppercase tracking-wider whitespace-nowrap"
                  >
                    Action
                  </th>
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-dark-border">
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-dark-bg-tertiary transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 whitespace-nowrap text-sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="px-6 py-3 w-[47vw] flex items-center justify-between border-t border-dark-border">
        <div className="text-sm text-dark-text-secondary">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            data.length
          )}{" "}
          of {data.length} results
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 rounded border border-dark-border hover:bg-dark-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <span className="text-sm text-dark-text-secondary">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <button
            className="px-3 py-1 rounded border border-dark-border hover:bg-dark-bg-tertiary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
