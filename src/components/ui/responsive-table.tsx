import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveTableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveTableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveTableRowProps {
  children: React.ReactNode;
  className?: string;
  mobileCard?: React.ReactNode;
  onClick?: () => void;
}

interface ResponsiveTableHeadProps {
  children?: React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
}

interface ResponsiveTableCellProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
  hideOnMobile?: boolean;
}

const ResponsiveTableContext = React.createContext<{ isMobile: boolean }>({ isMobile: false });

export const ResponsiveTable = React.forwardRef<
  HTMLDivElement,
  ResponsiveTableProps
>(({ className, children }, ref) => {
  const isMobile = useIsMobile();

  return (
    <ResponsiveTableContext.Provider value={{ isMobile }}>
      <div ref={ref} className={cn("w-full", className)}>
        {isMobile ? (
          <div className="space-y-3">{children}</div>
        ) : (
          <ScrollArea className="w-full">
            <table className="w-full caption-bottom text-sm">
              {children}
            </table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </div>
    </ResponsiveTableContext.Provider>
  );
});
ResponsiveTable.displayName = "ResponsiveTable";

export const ResponsiveTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  ResponsiveTableHeaderProps
>(({ className, children, ...props }, ref) => {
  const { isMobile } = React.useContext(ResponsiveTableContext);

  if (isMobile) return null;

  return (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props}>
      {children}
    </thead>
  );
});
ResponsiveTableHeader.displayName = "ResponsiveTableHeader";

export const ResponsiveTableBody = React.forwardRef<
  HTMLTableSectionElement,
  ResponsiveTableBodyProps
>(({ className, children, ...props }, ref) => {
  const { isMobile } = React.useContext(ResponsiveTableContext);

  if (isMobile) {
    return <div className="space-y-3">{children}</div>;
  }

  return (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props}>
      {children}
    </tbody>
  );
});
ResponsiveTableBody.displayName = "ResponsiveTableBody";

export const ResponsiveTableRow = React.forwardRef<
  HTMLTableRowElement,
  ResponsiveTableRowProps
>(({ className, children, mobileCard, onClick, ...props }, ref) => {
  const { isMobile } = React.useContext(ResponsiveTableContext);

  if (isMobile) {
    return (
      <div
        className={cn(
          "rounded-lg border border-border bg-card p-4 space-y-3",
          onClick && "cursor-pointer active:bg-muted/50 transition-colors",
          className
        )}
        onClick={onClick}
      >
        {mobileCard || children}
      </div>
    );
  }

  return (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  );
});
ResponsiveTableRow.displayName = "ResponsiveTableRow";

export const ResponsiveTableHead = React.forwardRef<
  HTMLTableCellElement,
  ResponsiveTableHeadProps
>(({ className, children, hideOnMobile, ...props }, ref) => {
  const { isMobile } = React.useContext(ResponsiveTableContext);

  if (isMobile) return null;

  return (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
});
ResponsiveTableHead.displayName = "ResponsiveTableHead";

export const ResponsiveTableCell = React.forwardRef<
  HTMLTableCellElement,
  ResponsiveTableCellProps
>(({ className, children, label, hideOnMobile, ...props }, ref) => {
  const { isMobile } = React.useContext(ResponsiveTableContext);

  if (isMobile) {
    if (hideOnMobile) return null;
    return null; // Mobile cells are handled via mobileCard prop
  }

  return (
    <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props}>
      {children}
    </td>
  );
});
ResponsiveTableCell.displayName = "ResponsiveTableCell";

// Helper component for mobile card rows
interface MobileCardRowProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const MobileCardRow = ({ label, children, className }: MobileCardRowProps) => (
  <div className={cn("flex items-center justify-between gap-2", className)}>
    <span className="text-xs text-muted-foreground shrink-0">{label}</span>
    <div className="text-sm text-right">{children}</div>
  </div>
);

// Helper component for mobile card header
interface MobileCardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export const MobileCardHeader = ({ title, subtitle, badge, actions }: MobileCardHeaderProps) => (
  <div className="flex items-start justify-between gap-2">
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium truncate">{title}</span>
        {badge}
      </div>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>}
    </div>
    {actions && <div className="flex items-center gap-1 shrink-0">{actions}</div>}
  </div>
);
