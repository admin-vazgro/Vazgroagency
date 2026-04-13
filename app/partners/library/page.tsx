import {
  firstParam,
  getPartnerContext,
  type PartnerSearchParams,
} from "@/app/partners/lib";

type LibraryItem = {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
};

function categoryLabel(value: string | null) {
  return value ? value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "General";
}

export default async function PartnerLibraryPage(props: {
  searchParams?: Promise<PartnerSearchParams>;
}) {
  const { admin } = await getPartnerContext();
  const searchParams = props.searchParams ? await props.searchParams : {};

  const query = (firstParam(searchParams.q) || "").trim().toLowerCase();
  const category = firstParam(searchParams.category) || "all";

  const { data, error } = await admin
    .from("library_items")
    .select("id, title, category, description, file_url, thumbnail_url, created_at")
    .eq("visible_to_partners", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const items = (data ?? []) as LibraryItem[];
  const categories = ["all", ...new Set(items.map((item) => item.category).filter((value): value is string => !!value))];

  const filtered = items.filter((item) => {
    const categoryOk = category === "all" || item.category === category;
    const searchOk =
      !query ||
      item.title.toLowerCase().includes(query) ||
      (item.description ?? "").toLowerCase().includes(query) ||
      (item.category ?? "").toLowerCase().includes(query);
    return categoryOk && searchOk;
  });

  return (
    <div className="p-8">
      <div className="mb-8 border-b border-[var(--portal-border)] pb-6">
        <span className="font-ibm-mono text-[10px] tracking-[3px] text-[var(--portal-accent)]">// SALES LIBRARY</span>
        <h1 className="mt-1 font-grotesk text-[32px] font-normal tracking-[-1px] text-[var(--portal-text)]">Sales Library</h1>
        <p className="mt-1 font-ibm-mono text-[12px] tracking-[0.5px] text-[var(--portal-text-soft)]">
          Read-only access to partner-ready decks, case studies, pricing sheets, and brand assets.
        </p>
      </div>

      <form method="get" className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-1 flex-col gap-2">
          <label className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">SEARCH</label>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Pitch deck, pricing, case study..."
            className="w-full border border-[var(--portal-border-strong)] bg-[var(--portal-surface)] px-4 py-3 font-ibm-mono text-[11px] text-[var(--portal-text)] placeholder:text-[var(--portal-text-dim)] focus:border-[var(--portal-accent)] focus:outline-none"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-ibm-mono text-[9px] tracking-[2px] text-[var(--portal-text-dim)]">CATEGORY</label>
          <select name="category" defaultValue={category} className="border border-[var(--portal-border-strong)] bg-[var(--portal-surface)] px-4 py-3 font-ibm-mono text-[11px] text-[var(--portal-text)] focus:border-[var(--portal-accent)] focus:outline-none">
            {categories.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "ALL" : categoryLabel(option).toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="border border-[var(--portal-border-strong)] px-4 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]">
          APPLY
        </button>
      </form>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {filtered.map((item) => (
          <div key={item.id} className="border border-[var(--portal-border)] bg-[var(--portal-surface)] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent)]">{categoryLabel(item.category).toUpperCase()}</p>
                <h2 className="mt-2 font-grotesk text-[22px] font-normal text-[var(--portal-text)]">{item.title}</h2>
              </div>
              <span className="font-ibm-mono text-[10px] text-[var(--portal-text-dim)]">
                {new Date(item.created_at).toLocaleDateString("en-GB")}
              </span>
            </div>
            {item.description ? (
              <p className="mt-4 font-ibm-mono text-[11px] leading-[1.7] text-[var(--portal-text-soft)]">{item.description}</p>
            ) : null}
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {item.file_url ? (
                <a
                  href={item.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[var(--portal-accent)] px-4 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-accent-contrast)]"
                >
                  OPEN ASSET
                </a>
              ) : null}
              {item.thumbnail_url ? (
                <a
                  href={item.thumbnail_url}
                  target="_blank"
                  rel="noreferrer"
                  className="border border-[var(--portal-border-strong)] px-4 py-3 font-ibm-mono text-[10px] tracking-[2px] text-[var(--portal-text-soft)]"
                >
                  PREVIEW
                </a>
              ) : null}
            </div>
          </div>
        ))}
        {!filtered.length ? (
          <div className="border border-[var(--portal-border)] bg-[var(--portal-surface)] px-6 py-10 xl:col-span-2">
            <p className="font-ibm-mono text-[11px] text-[var(--portal-text-soft)]">No partner-facing assets match the current filter.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
