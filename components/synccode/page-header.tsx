import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

/** Shared page identity block. Keeps page titles and actions on one grid. */
export function PageHeader({ title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("sc-page-header", className)}>
      <div className="min-w-0">
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="sc-page-header-actions">{actions}</div> : null}
    </header>
  );
}
