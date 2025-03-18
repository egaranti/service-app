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
import { tr } from "date-fns/locale";
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
            <TableHead>Teknik Servis</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead>Tutar</TableHead>
            <TableHead>Durum</TableHead>
            <TableHead>İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                Gösterilecek veri bulunamadı
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPayments.includes(payment.id)}
                    onCheckedChange={() => onSelectPayment(payment.id)}
                    aria-label={`Select payment ${payment.id}`}
                  />
                </TableCell>
                <TableCell>{payment.technicalServiceName}</TableCell>
                <TableCell>
                  {format(new Date(payment.createdAt), "d MMM yyyy", {
                    locale: tr,
                  })}
                </TableCell>
                <TableCell>
                  {payment.totalAllowance.toLocaleString("tr-TR")} ₺
                </TableCell>
                <TableCell>
                  <Tag
                    variant={payment.isInvoiced ? "green" : "yellow"}
                    size="sm"
                  >
                    {payment.isInvoiced ? "Fatura Kesildi" : "Fatura Kesilmedi"}
                  </Tag>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">İşlemler</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onStatusChange(payment.id)}
                      >
                        {payment.isInvoiced
                          ? "Fatura Kesilmedi Olarak İşaretle"
                          : "Fatura Kesildi Olarak İşaretle"}
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
          Toplam {pagination.totalElements} kayıt
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
