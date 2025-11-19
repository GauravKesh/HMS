// lib/hooks/useNameLookup.ts
export type Person = { id: string; name?: string; [k: string]: any };

/**
 * Builds lookup maps for patients & doctors and returns helper functions.
 * Keeps logic pure and fast (O(1) lookups).
 */
export function useNameLookup(patients: Person[] = [], doctors: Person[] = []) {
  // build maps once per call
  const patientMap = new Map<string, Person>();
  const doctorMap = new Map<string, Person>();

  for (const p of patients) patientMap.set(String(p.id), p);
  for (const d of doctors) doctorMap.set(String(d.id), d);

  function getPatientName(id: string | null | undefined) {
    if (!id) return "—";
    const p = patientMap.get(String(id));
    return p ? `${p.name} (${p.id})` : String(id);
  }

  function getDoctorName(id: string | null | undefined) {
    if (!id) return "—";
    const d = doctorMap.get(String(id));
    return d ? `${d.name} (${d.id})` : String(id);
  }

  return { getPatientName, getDoctorName, patientMap, doctorMap };
}
