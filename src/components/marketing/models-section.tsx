'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type ModelConfig = {
  id: string
  model_name: string
  context_window: number
  supports_streaming: boolean
}

export function ModelsSection() {
  const [models, setModels] = useState<ModelConfig[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('model_configs')
      .select('id, model_name, context_window, supports_streaming')
      .eq('is_active', true)
      .order('sort_order')
      .then(({ data }) => { if (data) setModels(data) })
  }, [])

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="font-bold text-3xl tracking-tight md:text-4xl">
            Model AI yang Tersedia
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Akses {models.length > 0 ? `${models.length}+` : '37+'} model AI premium melalui satu API
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
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
              <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                <span>
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

        <div className="mt-10 text-center">
          <Button variant="outline" render={<Link href="/models" />} nativeButton={false}>Lihat Semua Model</Button>
        </div>
      </div>
    </section>
  )
}

