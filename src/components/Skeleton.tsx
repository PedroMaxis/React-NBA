const Skeleton = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse rounded-xl bg-white/5 ${className}`} aria-hidden="true" />
);

export const ListaSkeleton = ({ itens = 6, className = "h-40" }: { itens?: number; className?: string }) => (
  <div role="status" aria-label="Carregando" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: itens }, (_, i) => (
      <Skeleton key={i} className={className} />
    ))}
  </div>
);

export default Skeleton;
