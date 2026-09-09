# Three-domain knowledge demo — design

**Date:** 2026-09-09
**Status:** approved in principle, ready for implementation planning

## Objective

Replace the homepage's invented `MUSEO AURORA` card with a three-tab demonstration —
**MUSEO · GIORNALE · CLINICA** — built from Isagog's real client ontologies, in which
each tab proves one of the claims the page makes.

The current card invents everything: a museum, an exhibition, two artworks, two artists.
It illustrates a shape. It cannot demonstrate that the shape is real. These ontologies can.

## Sources

| domain | file | what it is |
|---|---|---|
| MUSEO | `maxxi/resources/maxxi_ontology.ttl` (71 KB, `Isagog/isagog-platform-workspaces`) | schema: 76 classes, 32 object properties, 19 named individuals. **No instances.** |
| GIORNALE | `~/code/mema-core/resources/mema_ontology.ttl` (53 KB) | schema: 32 classes incl. the descriptor family. **No instances.** |
| CLINICA | `~/code/knowledge_retrieval/ontology/onco.ttl` + `kb/graph.ttl` (248 KB) | schema: 41 classes. **230 clinical statements, 247 source quotes.** |

The smaller `maxxi_ontology_actual.ttl` (28 KB, 22 classes) is superseded by the 71 KB
version; use the latter.

### What each source can and cannot support

This section exists because one proposal was already withdrawn for claiming an inference
the ontology does not encode. Every demo below is traceable to an axiom that is actually
present.

**MAXXI — available:** subsumption (`WallText`, `ExhibitionCatalogue` ⊂ `Document` ⊂
`TextualInformation`; `CuratorialNote`, `VisualDescription` ⊂ `TextualInformation`;
`Artist`, `Curator` ⊂ `Person`; `Exhibition` ⊂ `Event`), two inverse pairs
(`author_of`/`authored_by`, `about`/`described_in`), 48 `subPropertyOf`, 29
`someValuesFrom`, `has_medium` (`MaterialArtwork` → `Medium`), `has_technique`
(`Artwork` → `Technique`).

**MAXXI — NOT available:** the accessibility vocabulary (`Audience_Access_Need` and its
four subclasses, eleven support individuals) is **declared but unwired** — no object
property has an access need in domain or range, and no restriction references one.
`:Visitor` is only `ig:Person` participating in a `:Visit`. Any visitor→need→support
demonstration would require inventing the connecting properties and presenting them as
client modelling. **Do not build it.** Revisit if the ontology later wires it.

No property chains, transitive or symmetric properties exist in any of the three.

**MEMA — available:** the `EntityDescriptor` family, whose own `rdfs:comment` values
distinguish origin: `AIDescriptor` ("generato da sistemi di IA"), `HumanDescriptor`
("creato da annotatori umani"), `DBPediaDescriptor`, `WikipediaDescriptor`,
`GeonamesDescriptor`, and `ContextualDescriptor` ("come caratterizzata al momento di una
specifica menzione"). Plus `Article`, `Author`, `Mention`, `Fact`, `Summary`, `Topic`,
`Tag` and 28 object properties.

**ONCO — available:** `polarity` (197 Asserted, 30 Negated), certainty grades (7
Suspected, 6 Probable, 4 Certain, 3 Possible), `sourceDocument` + `sourceQuote` +
`sourceLineStart/End` on essentially every statement, `informationSource`, `supersedes`,
`CausalAttribution`, `Susceptibility`.

## Data policy

**CLINICA uses real graph data.** The owner has confirmed it is synthetic. It is
nonetheless **pseudonymised before use**, because it reads as a named patient's cancer
record on a public marketing site:

- `kb:patient` label `"FERRETTI Marco"` → a plainly fictional name
- `onco:patientCode "PZ-8841207"` → an obviously placeholder code
- named practitioners (e.g. `kb:prat-monti`) and the facility (`kb:org-san-rocco`) →
  neutral placeholders

Clinical *content* — the statements, quotes, polarities, certainty grades, line numbers —
is preserved exactly. That is the part being demonstrated.

**MUSEO and GIORNALE use illustrative instances** against the real schema, because those
files contain no instance data. Every class and property name shown is real; the individuals
are invented. Each tab carries the same disclosure the current card does
("scenario illustrativo"), so a visitor is never misled about which is which.

**The mema RDF endpoint is deliberately not used.** Reaching it needs an SSH tunnel into
Isagog infrastructure, and it would put *il manifesto's* editorial content on a public
marketing page. The provenance argument is carried entirely by the descriptor types,
which the local schema provides. Decision recorded 2026-09-09.

**Client IP.** MAXXI and il manifesto are named clients whose case studies are already
public on this site. Only class and property names appear — a few dozen terms, not the
ontologies. The vendored excerpts (below) live in the repo but are **not** served: only
`public/` reaches the web.

## The three tabs

Each tab leads one claim. Together they argue that one system does all three.

### MUSEO — inference

**Claim:** the answer was derived, not stored.

**Question:** *"Cosa posso leggere su quest'opera?"*

**Traversal:** invert `about`/`described_in` from the artwork, then let subsumption over
`TextualInformation` gather three *different* classes — a `WallText`, an
`ExhibitionCatalogue` entry, and a `CuratorialNote`. No stored fact says "these three
documents concern this artwork."

**Second question:** *"Quali altre opere usano la stessa tecnica?"* — `has_technique`
out and back.

**Refusal question:** an artwork with no textual information attached. The system says so
rather than generalising from the exhibition.

### GIORNALE — provenance

**Claim:** every fact carries where it came from, and they are not equal.

**Question:** an archive query returning several facts, each tagged by descriptor class:
`HumanDescriptor` (an editor annotated it), `AIDescriptor` (a model extracted it),
`DBPediaDescriptor` / `WikipediaDescriptor` (linked to an external source),
`ContextualDescriptor` (true *as of that article's date*, not necessarily now).

The visual point: the same answer contains claims of visibly different standing, and the
reader can see which is which.

**Refusal question:** a fact whose only support is an `AIDescriptor` with no human or
external corroboration — shown as unconfirmed rather than asserted.

### CLINICA — refusal

**Claim:** it says "non lo so", and can prove the gap is documented.

Real graph data. **One question — *"È allergico alla penicillina?"* — with three
different honest answers depending on when it is asked.** The graph records the whole
epistemic history across three letters and seven months:

| doc | date | polarity | source quote |
|---|---|---|---|
| L1 | 2025-02 | `Reported` | *"reazione cutanea a penicillina in età pediatrica; episodio non documentato"* (line 22) |
| L1 | 2025-02 | `Negated` | *"mai sottoposto a test allergologico"* (line 22) |
| L2 | 2025-04 | `Reported` | *"in considerazione dell'allergia riferita a penicillina"* (line 41) — the unverified label is steering treatment |
| L3 | 2025-09 | `RuledOut` | *"il paziente è stato de-labellato: può assumere beta-lattamici penicillinici"* (line 44) |

This single thread demonstrates all three site claims at once:

- **"sa dire come lo sa"** — every step carries document, line and verbatim quote.
- **"sa dire: non lo so"** — between February and September the honest answer was
  *reported by the patient, never tested*. That is a documented uncertainty, not a gap in
  the system, and the graph can prove the difference.
- **reasoning** — `RuledOut` supersedes `Reported`. The answer today differs from the
  answer in April, and the system can say when it changed and on what evidence.

It also carries real clinical weight: an unverified penicillin label routinely pushes
patients onto worse antibiotics for years, and de-labelling is the correction. A confident
system that answered "yes, allergic" from the first letter would have been wrong, and
harmful.

Second question — *"BCL2?"* — a plainly `Asserted` fact (`"BCL2+"`, L1 line 51,
immunoistochimica) so the contrast with the allergy thread is visible.

Third — *"localizzazione ossea?"* — `Suspected`, *"in attesa di conferma istologica"*
(L3 line 52), with the competing hypothesis held open rather than collapsed.

## Technical design

**Placement.** Replaces `knowledge-card.tsx` in the homepage's `Apertura`. The
`DemoSlot` on `/approach` stays empty and available.

**Rendering.** The tab strip and question picker are client-side (`useState`), but the
**default tab and its default question are server-rendered**, so the section is
meaningful before hydration. `/project` and `/blog` already demonstrate what a
hydration-dependent section looks like when JS does not arrive; the homepage must not
join them.

**Data shape.** Graph structure lives in a typed module per domain — nodes with a class
name, edges with a property name, evidence with document and line. Node *labels* are
locale keys, not literals, so the "copy never lives in components" rule holds and
`it.ts`/`en.ts` stay structurally identical. Per the Italian-first deferral, English
values carry the Italian text for now.

**Verification.** Vendor the specific subgraphs used into the repo (excerpt only, a few
dozen triples per domain) and add a test asserting every class name, property name and —
for CLINICA — every quoted string and line number displayed still exists in its source.
Without this, these become invented examples wearing real class names within a month.
The same discipline caught the article-title drift in the previous plan.

**Accessibility.** The tab strip is a real tablist (`role="tablist"`, arrow-key
navigation, `aria-selected`), not styled divs. The graph is decorative-by-default with
the answer and evidence available as text.

## Out of scope

- Wiring MAXXI's accessibility vocabulary — that is an ontology change, not a site change.
- Live SPARQL against any endpoint. The demo is static.
- Replacing the `DemoSlot` on `/approach`.
- English translation of homepage-origin copy; the deferral stands.

## Assumptions

- The clinical graph is synthetic, per the owner, and is pseudonymised regardless.
- Showing class and property names from client ontologies is acceptable; their case
  studies are already public.
- The 71 KB `maxxi_ontology.ttl` is the current one.
