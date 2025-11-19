export const getNameById = (list: any[], id: string, field = "name") => {
  const item = list?.find((x: any) => x.id === id);
  return item ? `${item[field]} (${item.id})` : id;
};
