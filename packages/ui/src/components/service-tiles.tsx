import * as React from "react"
import { IconAppsOff } from "@tabler/icons-react"

import { cn } from "../lib/utils"

export interface ServiceTile {
  title: string
  href: string
  /** Optional tile-specific icon shown in brand red instead of the group's default icon. */
  icon?: React.ReactNode
  /** Optional short description rendered below the title. */
  description?: string
  /** Opens the link in a new tab with rel="noopener noreferrer" when true. */
  external?: boolean
}

export interface ServiceTileGroup {
  heading: string
  /** Group icon shown in brand red on every tile. */
  icon: React.ReactNode
  tiles: ServiceTile[]
  /** Shown in a dashed empty box when the group has no tiles. */
  emptyText?: string
}

export interface ServiceTilesProps {
  groups: ServiceTileGroup[]
  className?: string
}

/**
 * The Beranda service groups: national, korda, and komsat services as
 * white tile cards with a red group icon, two columns on phones and
 * three from the medium breakpoint. A group with no services shows its
 * empty line in a dashed box instead of disappearing, so the member
 * learns the group exists. Tiles in a row always share one height:
 * uneven card bottoms in a grid read as a defect, never as rhythm.
 */
export function ServiceTiles({ groups, className }: ServiceTilesProps) {
  const visible = groups.filter((g) => g.tiles.length > 0 || Boolean(g.emptyText))
  if (visible.length === 0) return null
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {visible.map((group) => (
        <section key={group.heading} aria-label={group.heading}>
          <h2 className="mb-2 text-base font-bold text-brand-ink">{group.heading}</h2>
          {group.tiles.length === 0 ? (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-brand-border bg-card p-4 text-sm text-brand-muted">
              <IconAppsOff className="size-5 shrink-0" aria-hidden="true" />
              <p>{group.emptyText}</p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {group.tiles.map((tile) => (
                <li key={tile.title} className="flex">
                  <a
                    href={tile.href}
                    {...(tile.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="flex min-h-11 w-full flex-col gap-2 rounded-xl border border-brand-border bg-card p-4 font-semibold text-brand-ink hover:border-brand-red focus-visible:outline-2 focus-visible:outline-brand-red"
                  >
                    <span className="text-brand-red">{tile.icon ?? group.icon}</span>
                    {tile.title}
                    {tile.description ? (
                      <span className="text-xs font-normal text-brand-muted">{tile.description}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  )
}
