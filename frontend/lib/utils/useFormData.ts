export const useFormData = () => {
  return (e: any) => {
    e.preventDefault();
    const fm = new FormData(e.target);
    return Object.fromEntries(fm);
  };
};
