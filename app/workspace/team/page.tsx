export default function TeamPage() {
  const team: Array<{ name: string; role: string; specialty: string; engagements: string[]; email: string; timezone: string; availability: string; initials: string; color: string }> = [];

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] text-[var(--portal-accent)] tracking-[3px]">// YOUR TEAM</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[var(--portal-text)] tracking-[-1px] mt-1">Your Vazgro Team</h1>
        <p className="font-ibm-mono text-[12px] text-[var(--portal-text-soft)] tracking-[0.5px] mt-1">The people working on your engagements, their roles, and how to reach them.</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {team.map((member) => (
          <div key={member.name} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
              <div
                className="w-12 h-12 flex items-center justify-center shrink-0 font-grotesk text-[14px] font-bold"
                style={{ background: member.color + "20", color: member.color, border: `1px solid ${member.color}40` }}
              >
                {member.initials}
              </div>
              <div className="flex-1">
                <h3 className="font-grotesk text-[16px] font-bold text-[var(--portal-text)]">{member.name}</h3>
                <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)] mt-0.5">{member.role}</p>
                <p className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] mt-0.5">{member.specialty}</p>
              </div>
            </div>

            <div className="border-t border-[var(--portal-border)] pt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] tracking-[1px]">EMAIL</span>
                <a href={`mailto:${member.email}`} className="font-ibm-mono text-[10px] text-[var(--portal-accent)] hover:opacity-80">{member.email}</a>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] tracking-[1px]">TIMEZONE</span>
                <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{member.timezone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] tracking-[1px]">AVAILABILITY</span>
                <span className="font-ibm-mono text-[10px] text-[var(--portal-text-soft)]">{member.availability}</span>
              </div>
              <div className="mt-2">
                <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)] tracking-[1px] block mb-2">ENGAGEMENTS</span>
                <div className="flex flex-wrap gap-1">
                  {member.engagements.map((e) => (
                    <span key={e} className="font-ibm-mono text-[9px] px-2 py-1 bg-[var(--portal-surface-subtle)] text-[var(--portal-text)] border border-[var(--portal-border-strong)]">{e}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {team.length === 0 && (
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6 col-span-2">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No team members assigned yet.</p>
          </div>
        )}
      </div>

      <div className="mt-8 border border-[var(--portal-border)] bg-[var(--portal-surface)] p-6">
        <p className="font-ibm-mono text-[10px] text-[var(--portal-text-muted)] tracking-[2px] mb-2">NEED TO GET IN TOUCH?</p>
        <p className="font-ibm-mono text-[12px] text-[var(--portal-text)] leading-[1.7]">
          For general queries, email <a href="mailto:hello@vazgro.com" className="text-[var(--portal-accent)] hover:opacity-80">hello@vazgro.com</a>.
          For urgent matters during active engagements, contact your Account Lead directly.
          Response time: within 1 business day.
        </p>
      </div>
    </div>
  );
}
