import { CheckCircle2, Music2, Palette } from 'lucide-react'

function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-mlooker-bg px-6 py-16 text-slate-100">
      <section className="w-full max-w-3xl rounded-2xl border border-mlooker-border bg-mlooker-surface p-8 shadow-glow">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-mlooker-tech/40 bg-mlooker-tech/10 px-3 py-1 text-sm text-mlooker-tech">
          <Music2 className="h-4 w-4" />
          Tarjeta T-13 completada
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Mlooker Frontend Inicializado
        </h1>
        <p className="mt-3 text-mlooker-muted">
          SPA creada con React + Vite, Tailwind CSS y Lucide React lista para
          construir los módulos de negocio.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <InfoCard icon={CheckCircle2} title="React + Vite" subtitle="Base moderna y rápida" />
          <InfoCard icon={Palette} title="Tailwind CSS" subtitle="Estilos listos para maquetar" />
          <InfoCard icon={Music2} title="Lucide" subtitle="Iconografía limpia integrada" />
        </div>
      </section>
    </main>
  )
}

function InfoCard({ icon: Icon, title, subtitle }) {
  return (
    <article className="rounded-xl border border-mlooker-border bg-mlooker-card p-4">
      <Icon className="h-5 w-5 text-mlooker-accent" />
      <h2 className="mt-3 font-semibold">{title}</h2>
      <p className="text-sm text-mlooker-muted">{subtitle}</p>
    </article>
  )
}

export default App
