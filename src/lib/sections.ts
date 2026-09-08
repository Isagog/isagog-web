export type SectionId =
  | "visione"
  | "metodologia"
  | "tecnologia"
  | "persone"
  | "contatto";

/**
 * The homepage's reading order. `number` mirrors the draft's own 01–04
 * labelling, which skips the people section.
 */
export const SECTIONS: ReadonlyArray<{
  readonly id: SectionId;
  readonly number: string;
}> = [
  { id: "visione", number: "01" },
  { id: "metodologia", number: "02" },
  { id: "tecnologia", number: "03" },
  { id: "persone", number: "" },
  { id: "contatto", number: "04" },
];

/**
 * The section the reader is currently in: the last one whose top edge has
 * scrolled above `scrollY + offset`. Null while still above the first.
 * Pure so the rail's behaviour is testable without a DOM.
 */
export const computeActiveSection = (
  tops: ReadonlyArray<{ id: SectionId; top: number }>,
  scrollY: number,
  offset = 100
): SectionId | null => {
  let active: SectionId | null = null;
  for (const section of tops) {
    if (section.top <= scrollY + offset) active = section.id;
  }
  return active;
};
