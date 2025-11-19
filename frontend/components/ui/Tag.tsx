export const Tag = ({ status }: any) => {
  const map: any = {
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    paid: "bg-green-200 text-green-800",
  };
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
};
