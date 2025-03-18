import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tag,
} from "@egaranti/components";

import { Link } from "react-router-dom";

import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

const PaymentTable = ({
  payments,
  selectedPayments,
  onSelectPayment,
  onSelectAll,
  onStatusChange,
  pagination,
  onPageChange,
}) => {
  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={
                  selectedPayments.length === payments.length &&
                  payments.length > 0
                }
                onCheckedChange={onSelectAll}
                aria-label="Select all"
              />
            </TableHead>
            <TableHead>Servis</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead>Ödeme Sebebi</TableHead>
            <TableHead>Tutar</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No payments found.
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPayments.includes(payment.id)}
                    onCheckedChange={() => onSelectPayment(payment.id)}
                    aria-label={`Select payment ${payment.invoiceNumber}`}
                  />
                </TableCell>
                <TableCell>{payment.providerName}</TableCell>
                <TableCell>
                  {format(new Date(payment.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Link
                    to={`/requests?selectedRequestId=${payment.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {payment.id}
                  </Link>
                </TableCell>
                <TableCell>{payment.totalAllowance.toFixed(2)}</TableCell>
                <TableCell>
                  <Tag
                    variant={payment.isInvoiced ? "green" : "yellow"}
                    size="sm"
                  >
                    {payment.isInvoiced ? "Ödenmedi" : "Ödendi"}
                  </Tag>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white shadow-sm"
                    >
                      <DropdownMenuItem
                        onClick={() => onStatusChange(payment.id)}
                      >
                        {payment.isInvoiced === false ? "Ödenmedi" : "Ödendi"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="text-sm text-gray-500">
          Toplam {pagination.total} kayıt
        </div>
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          pageSize={10}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default PaymentTable;
