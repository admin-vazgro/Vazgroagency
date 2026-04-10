export default function TeamPage() {
  const team = [
    {
      name: "Rohith M.",
      role: "Account Lead",
      specialty: "Strategy & Brand",
      engagements: ["Brand & Website Package"],
      email: "rohith@vazgro.com",
      timezone: "GMT (London)",
      availability: "Mon–Fri, 9am–6pm",
      initials: "RM",
      color: "#D6E264",
    },
    {
      name: "Priya K.",
      role: "Senior Designer",
      specialty: "Visual Identity & UI",
      engagements: ["Brand & Website Package"],
      email: "priya@vazgro.com",
      timezone: "GMT (London)",
      availability: "Mon–Fri, 10am–7pm",
      initials: "PK",
      color: "#FF6B35",
    },
    {
      name: "Aisha B.",
      role: "Social Strategist",
      specialty: "Content & Growth",
      engagements: ["Social Media Management"],
      email: "aisha@vazgro.com",
      timezone: "GMT (London)",
      availability: "Mon–Fri, 9am–5pm",
      initials: "AB",
      color: "#D6E264",
    },
    {
      name: "Tom W.",
      role: "Content Producer",
      specialty: "Video & Copywriting",
      engagements: ["Social Media Management"],
      email: "tom@vazgro.com",
      timezone: "GMT (London)",
      availability: "Tue–Sat, 10am–6pm",
      initials: "TW",
      color: "#FF6B35",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[#1D1D1D] pb-6">
        <span className="font-ibm-mono text-[10px] text-[#D6E264] tracking-[3px]">// YOUR TEAM</span>
        <h1 className="font-grotesk text-[32px] font-bold text-[#F5F5F0] tracking-[-1px] mt-1">Your Vazgro Team</h1>
        <p className="font-ibm-mono text-[12px] text-[#888] tracking-[0.5px] mt-1">The people working on your engagements, their roles, and how to reach them.</p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {team.map((member) => (
          <div key={member.name} className="border border-[#1D1D1D] bg-[#0F0F0F] p-6">
            <div className="flex items-start gap-4 mb-4">
              {/* Avatar */}
              <div
                className="w-12 h-12 flex items-center justify-center shrink-0 font-grotesk text-[14px] font-bold"
                style={{ background: member.color + "20", color: member.color, border: `1px solid ${member.color}40` }}
              >
                {member.initials}
              </div>
              <div className="flex-1">
                <h3 className="font-grotesk text-[16px] font-bold text-[#F5F5F0]">{member.name}</h3>
                <p className="font-ibm-mono text-[11px] text-[#888] mt-0.5">{member.role}</p>
                <p className="font-ibm-mono text-[10px] text-[#555] mt-0.5">{member.specialty}</p>
              </div>
            </div>

            <div className="border-t border-[#1D1D1D] pt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-ibm-mono text-[10px] text-[#555] tracking-[1px]">EMAIL</span>
                <a href={`mailto:${member.email}`} className="font-ibm-mono text-[10px] text-[#D6E264] hover:opacity-80">{member.email}</a>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-ibm-mono text-[10px] text-[#555] tracking-[1px]">TIMEZONE</span>
                <span className="font-ibm-mono text-[10px] text-[#888]">{member.timezone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-ibm-mono text-[10px] text-[#555] tracking-[1px]">AVAILABILITY</span>
                <span className="font-ibm-mono text-[10px] text-[#888]">{member.availability}</span>
              </div>
              <div className="mt-2">
                <span className="font-ibm-mono text-[10px] text-[#555] tracking-[1px] block mb-2">ENGAGEMENTS</span>
                <div className="flex flex-wrap gap-1">
                  {member.engagements.map((e) => (
                    <span key={e} className="font-ibm-mono text-[9px] px-2 py-1 bg-[#1A1A1A] text-[#AAAAAA] border border-[#2D2D2D]">{e}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border border-[#1D1D1D] bg-[#0F0F0F] p-6">
        <p className="font-ibm-mono text-[10px] text-[#666] tracking-[2px] mb-2">NEED TO GET IN TOUCH?</p>
        <p className="font-ibm-mono text-[12px] text-[#AAAAAA] leading-[1.7]">
          For general queries, email <a href="mailto:hello@vazgro.com" className="text-[#D6E264] hover:opacity-80">hello@vazgro.com</a>.
          For urgent matters during active engagements, contact your Account Lead directly.
          Response time: within 1 business day.
        </p>
      </div>
    </div>
  );
}
