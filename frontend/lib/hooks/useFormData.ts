export const getNameById = (list: any[] = [], id?: string | null, field = "name") => {
  if (!id) return "—";
  const item = list.find((x: any) => x.id === id);
  return item ? `${item[field]} (${item.id})` : id;
};
