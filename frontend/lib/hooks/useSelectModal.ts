import { useState } from "react";

export function useSelectModal() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [callback, setCallback] = useState<(item: any) => void>(() => () => {});

  function show(t: string, list: any[], cb: (item: any) => void) {
    setTitle(t);
    setItems(list);
    setCallback(() => cb);
    setOpen(true);
  }

  function select(item: any) {
    callback(item);
    setOpen(false);
  }

  return { open, title, items, show, select, close: () => setOpen(false) };
}
