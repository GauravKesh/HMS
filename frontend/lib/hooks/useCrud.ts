import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const trimTrailing = (u = "") => u.replace(/\/$/, "");

export function useCrud(key: string, url: string) {
  const qc = useQueryClient();
  const base = url;

  const list = useQuery({
    queryKey: [key],
    queryFn: () => api.get(base),
    staleTime: 1000 * 30,
  });

  const create = useMutation({
    mutationFn: (data: any) => api.post(base, data),
    onSuccess: () => qc.invalidateQueries([key]),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: any) => api.put(`${trimTrailing(base)}/${id}/`, data),
    onSuccess: () => qc.invalidateQueries([key]),
  });

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`${trimTrailing(base)}/${id}/`),
    onSuccess: () => qc.invalidateQueries([key]),
  });

  return { list, create, update, remove };
}
