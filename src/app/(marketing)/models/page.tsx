'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { SearchIcon, Zap } from 'lucide-react'

type ModelConfig = {
  id: string
  model_name: string
  context_window: number
  supports_streaming: boolean
  description: string | null
}

export default function ModelsPage() {
  const [models, setModels] = useState<ModelConfig[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('model_configs')
      .select('id, model_name, context_window, supports_streaming, description')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setModels(data)
        setLoading(false)
      })
  }, [])

  const filtered = models.filter((m) =>
    m.model_name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col">
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-bold text-4xl tracking-tight md:text-5xl">
            {models.length > 0 ? `${models.length}+` : '37+'} Model AI Premium
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Akses semua model AI terbaik melalui satu endpoint OpenAI-compatible.
            Dikembangkan oleh Sribuai API Router.
          </p>
        </div>
      </section>

      <section className="px-4 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Cari model..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
              <SearchIcon className="size-8 opacity-40" />
              <p className="text-sm">Model tidak ditemukan.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((model) => (
                <div
                  key={model.id}
                  className="flex flex-col rounded-lg border bg-card p-5 transition-shadow duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge
                      variant="outline"
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-blue-300 text-blue-700 bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:bg-blue-950/40"
                    >
                      Sribuai AI
                    </Badge>
                    {model.supports_streaming && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Zap className="size-3 text-amber-500" />
                        Streaming
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-base leading-snug">{model.model_name}</h3>

                  {model.description && (
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed flex-1">
                      {model.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 mt-4 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      Context:&nbsp;
                      <span className="font-medium text-foreground">
                        {model.context_window >= 1_000_000
                          ? `${model.context_window / 1_000_000}M`
                          : `${model.context_window / 1_000}K`}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Button render={<a href="/register" />} nativeButton={false}>
              Mulai Gratis Sekarang
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
