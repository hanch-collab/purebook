"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// ── Types ────────────────────────────────────────────────────────
interface Specialist {
  id: string; staffId: string; firstName: string; lastName: string;
  availability: { dayOfWeek: string; startTime: string; endTime: string }[];
}
interface AppointmentService {
  id: string; startTime: string; endTime: string;
  service: { name: string; appointmentColour: string; backgroundColour: string };
  specialist: { id: string };
}
interface Appointment {
  id: string; status: string; customer: { firstName: string; lastName: string };
  services: AppointmentService[];
}

// ── Constants ────────────────────────────────────────────────────
const HOUR_START = 8;
const HOUR_END   = 19;
const CELL_H     = 54; // px per hour

function timeToY(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return ((h + m / 60) - HOUR_START) * CELL_H;
}
function timeToHeight(start: string, end: string): number {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  return ((eh + em / 60) - (sh + sm / 60)) * CELL_H - 4;
}
function fmt12(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  const d  = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${d}:${String(m).padStart(2, "0")} ${ap}`;
}
function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}
function toYMD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ── Status colours ───────────────────────────────────────────────
const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  CONFIRMED:   { bg: "#EDF5E8", text: "#3A6020", label: "Confirmed"   },
  UNCONFIRMED: { bg: "#FBF3E0", text: "#7A5610", label: "Unconfirmed" },
  IN_PROGRESS: { bg: "#E6F1FB", text: "#0C447C", label: "In progress" },
  COMPLETED:   { bg: "#F0F0F0", text: "#555555", label: "Completed"   },
  NO_SHOW:     { bg: "#FDE8E8", text: "#7C1010", label: "No show"     },
  CANCELLED:   { bg: "#F0F0F0", text: "#888888", label: "Cancelled"   },
};

// ── Now-line ─────────────────────────────────────────────────────
function NowLine() {
  const [top, setTop] = useState<number | null>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    function update() {
      const now = new Date();
      const h = now.getHours() + now.getMinutes() / 60;
      if (h < HOUR_START || h > HOUR_END) { setTop(null); return; }
      setTop((h - HOUR_START) * CELL_H);
      setLabel(now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    }
    update();
    const t = setInterval(update, 30000);
    return () => clearInterval(t);
  }, []);

  if (top === null) return null;
  return (
    <div className="absolute left-0 right-0 z-10 pointer-events-none" style={{ top }}>
      <div className="absolute left-[-46px] top-[-9px] bg-pb-gold text-white text-[9px] font-semibold px-1.5 py-0.5 rounded">
        {label}
      </div>
      <div className="relative h-[1.5px] bg-pb-gold">
        <div className="absolute left-[-1px] top-[-3.5px] w-2 h-2 rounded-full bg-pb-gold" />
      </div>
    </div>
  );
}

// ── Appointment card ─────────────────────────────────────────────
function ApptCard({ appt, svc }: { appt: Appointment; svc: AppointmentService }) {
  const top = timeToY(svc.startTime);
  const ht  = Math.max(timeToHeight(svc.startTime, svc.endTime), 20);
  const badge = STATUS_BADGE[appt.status] ?? STATUS_BADGE.UNCONFIRMED;
  const bg  = svc.service.backgroundColour || "#FAF3E0";
  const bd  = svc.service.appointmentColour || "#C9A84C";
  const cancelled = appt.status === "CANCELLED";

  return (
    <div
      className="absolute left-1 right-1 rounded-md px-2 py-1.5 cursor-pointer overflow-hidden z-[3] border-l-[3px]"
      style={{
        top, height: ht, background: bg, borderLeftColor: bd,
        opacity: cancelled ? 0.5 : 1,
      }}
    >
      <div className="text-[10px] font-medium truncate" style={{ color: bd }}>
        {svc.service.name}
      </div>
      {ht > 32 && (
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-[10px] flex-1 truncate opacity-85" style={{ color: bd }}>
            {appt.customer.firstName} {appt.customer.lastName}
          </span>
          <span className="text-[8px] font-medium px-1 py-0.5 rounded" style={{ background: badge.bg, color: badge.text }}>
            {badge.label}
          </span>
        </div>
      )}
      {ht > 48 && (
        <div className="text-[9px] mt-0.5 opacity-70" style={{ color: bd }}>
          {fmt12(svc.startTime)} – {fmt12(svc.endTime)}
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────
export default function CalendarPage() {
  const router = useRouter();
  const [date, setDate]             = useState(new Date());
  const [specialists, setSpec]      = useState<Specialist[]>([]);
  const [appointments, setAppts]    = useState<Appointment[]>([]);
  const [loading, setLoading]       = useState(true);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/calendar/day?date=${toYMD(date)}`)
      .then(r => r.json())
      .then(d => { setSpec(d.specialists || []); setAppts(d.appointments || []); setLoading(false); });
  }, [date]);

  // Scroll to 8am on load
  useEffect(() => {
    if (!loading && gridRef.current) {
      gridRef.current.scrollTop = 0;
    }
  }, [loading]);

  function navDate(delta: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + delta);
    setDate(d);
  }

  const hours = Array.from({ length: HOUR_END - HOUR_START }, (_, i) => HOUR_START + i);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-pb-bg">

      {/* ── Top bar ── */}
      <div className="h-[52px] px-4 flex items-center gap-2.5 border-b border-pb-border bg-pb-bg flex-shrink-0">
        <span className="text-[18px] text-pb-text tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Calendar</span>

        {/* Date nav */}
        <div className="flex items-center gap-1.5 ml-1.5">
          <button onClick={() => navDate(-1)} className="w-[26px] h-[26px] rounded-md border border-pb-border bg-transparent text-pb-muted flex items-center justify-center text-sm">‹</button>
          <div className="text-[12px] font-medium text-pb-text min-w-[148px] text-center px-2.5 py-1 rounded-md bg-[#EAE6E0]">
            {fmtDate(date)}
          </div>
          <button onClick={() => navDate(1)} className="w-[26px] h-[26px] rounded-md border border-pb-border bg-transparent text-pb-muted flex items-center justify-center text-sm">›</button>
        </div>

        <button onClick={() => setDate(new Date())} className="px-2.5 py-1 border border-pb-border rounded-md text-[11px] text-[#4A4740] font-medium">Today</button>

        {/* Day / Week toggle */}
        <div className="flex bg-[#E8E3DC] rounded-lg p-0.5 gap-px ml-1.5">
          <button className="px-3 py-1 rounded-md text-[11px] font-medium bg-pb-bg text-pb-text">Day</button>
          <button className="px-3 py-1 rounded-md text-[11px] font-medium text-pb-muted">Week</button>
        </div>

        <div className="flex-1" />

        <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-pb-text text-pb-gold rounded-lg text-[12px] font-medium">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M12 5v14M5 12h14"/></svg>
          Add
        </button>
      </div>

      {/* ── Sub-toolbar ── */}
      <div className="h-9 px-4 flex items-center gap-2 border-b border-pb-border bg-[#EDE9E3] flex-shrink-0">
        <button className="flex items-center gap-1.5 px-2.5 py-1 border border-pb-border rounded-md bg-pb-bg text-[11px] text-[#4A4740]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          Everyone
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3"><path d="M6 9l6 6 6-6"/></svg>
        </button>
        <button className="flex items-center gap-1.5 px-2.5 py-1 border border-pb-border rounded-md bg-pb-bg text-[11px] text-[#4A4740]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M4 6h16M7 12h10M10 18h4"/></svg>
          Filters
        </button>
        <div className="w-px h-3.5 bg-pb-border" />
        <div className="flex items-center gap-1.5 text-[11px] text-[#4A4740]">
          <div className="w-8 h-[17px] rounded-full bg-[#DDD8D0] relative">
            <div className="absolute w-[13px] h-[13px] rounded-full bg-white top-[2px] left-[2px] shadow-sm" />
          </div>
          Appointments
        </div>
        <div className="flex-1" />
        <span className="text-[10px] text-pb-muted">Business hours shown per specialist</span>
      </div>

      {/* ── Calendar grid ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Time column */}
        <div className="w-[50px] flex-shrink-0 border-r border-pb-border bg-pb-bg overflow-hidden">
          <div className="h-[52px] border-b border-pb-border" />
          {hours.map(h => (
            <div key={h} className="flex items-start justify-end pr-2 pt-0.5 text-[10px] text-[#B0AA9E]" style={{ height: CELL_H }}>
              {h === 12 ? "12:00 PM" : h > 12 ? `${h-12}:00 PM` : `${h}:00 AM`}
            </div>
          ))}
        </div>

        {/* Scrollable grid */}
        <div ref={gridRef} className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full text-pb-muted text-sm">Loading…</div>
          ) : (
            <div style={{ minWidth: "max-content" }}>

              {/* Specialist headers — sticky */}
              <div className="flex sticky top-0 z-10 bg-white border-b border-pb-border" style={{ minWidth: "max-content" }}>
                {specialists.map(s => {
                  const initials = `${s.firstName[0]}${s.lastName[0]}`;
                  const count = appointments.filter(a =>
                    a.services.some(sv => sv.specialist.id === s.id)
                  ).length;
                  return (
                    <div key={s.id} className="w-[185px] flex-shrink-0 px-3 py-2 flex items-center gap-2 border-r border-pb-border last:border-r-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-pb-text flex-shrink-0 bg-[#E8D5A8]">
                        {initials}
                      </div>
                      <div>
                        <div className="text-[11px] font-medium text-pb-text">{s.firstName} {s.lastName}</div>
                        <div className="text-[9px] text-pb-muted">{count} appointment{count !== 1 ? "s" : ""}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Body row */}
              <div className="flex" style={{ minWidth: "max-content" }}>
                {specialists.map(s => {
                  const specAppts = appointments.filter(a =>
                    a.services.some(sv => sv.specialist.id === s.id)
                  );
                  return (
                    <div
                      key={s.id}
                      className="w-[185px] flex-shrink-0 relative border-r border-pb-border last:border-r-0"
                      style={{ height: (HOUR_END - HOUR_START) * CELL_H }}
                    >
                      {/* Hour cells */}
                      {hours.map(h => (
                        <div
                          key={h}
                          className="border-b border-[#EAE6E0] cursor-pointer hover:bg-pb-gold/5"
                          style={{
                            height: CELL_H,
                            background: h < HOUR_START || h >= HOUR_END ? "#EDE9E3" : undefined,
                          }}
                        />
                      ))}

                      {/* Appointment cards */}
                      {specAppts.map(appt =>
                        appt.services
                          .filter(sv => sv.specialist.id === s.id)
                          .map(sv => <ApptCard key={sv.id} appt={appt} svc={sv} />)
                      )}

                      {/* Now line */}
                      <NowLine />
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
