import {
  Button,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

// import { Link } from "react-router-dom";
// import { format } from "date-fns";
// import { tr } from "date-fns/locale";
import { MoreHorizontal } from "lucide-react";

const PaymentTable = ({
  payments,
  selectedPayments,
  onSelectPayment,
  onSelectAll,
  onStatusChange,
  filters,
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
                <TableCell>{payment?.createdAt}</TableCell>
                <TableCell>{payment.totalAllowance}</TableCell>
                <TableCell>
                  <Tag variant={payment.invoice ? "green" : "yellow"} size="sm">
                    {payment.invoice ? "Fatura Kesildi" : "Fatura Kesilmedi"}
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
                    <DropdownMenuContent align="end" className="bg-white">
                      <DropdownMenuItem
                        onClick={() => onStatusChange(payment.id)}
                      >
                        {payment.invoice
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
      <div className="flex items-center justify-center p-4">
        <Pagination
          currentPage={filters.page}
          pageSize={10}
          totalPages={filters.totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default PaymentTable;
