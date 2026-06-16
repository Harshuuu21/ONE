export function SceneHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-7">
      <p className="mb-2 text-xs uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
      <h1 className="font-serif text-3xl font-medium leading-tight tracking-tight text-balance md:text-4xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
          {subtitle}
        </p>
      )}
    </div>
  )
}
