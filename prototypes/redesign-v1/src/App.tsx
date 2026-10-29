import * as React from "react";
import { PortalView } from "./views/Portal";
import { ProfileView } from "./views/Profile";

type View = "portal" | "profile";

const VIEWS: { id: View; label: string }[] = [
  { id: "portal", label: "Portal" },
  { id: "profile", label: "Profil" },
];

export function App() {
  const [view, setView] = React.useState<View>("portal");
  return (
    <div className="min-h-screen">
      <div className="fixed right-3 bottom-3 z-50 flex items-center gap-1 rounded-full bg-neutral-900/90 p-1 shadow-lg" role="tablist" aria-label="Pilih permukaan">
        <span className="px-2 text-[10px] font-semibold tracking-wide text-white/60 uppercase">Proto</span>
        {VIEWS.map((v) => (
          <button
            key={v.id}
            role="tab"
            aria-selected={view === v.id}
            onClick={() => setView(v.id)}
            className={view === v.id ? "rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900" : "rounded-full px-3 py-1.5 text-xs font-semibold text-white/80 hover:text-white"}
          >
            {v.label}
          </button>
        ))}
      </div>
      {view === "portal" && <PortalView onNavigate={setView} />}
      {view === "profile" && <ProfileView onNavigate={setView} />}
    </div>
  );
}
