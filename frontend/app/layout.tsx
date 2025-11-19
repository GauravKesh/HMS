import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";

export const metadata = {
  title: "HMS Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 flex">
        <QueryClientProvider client={queryClient}>
          {/* Sidebar is fixed width w-64 */}
          <Sidebar />

          {/* Main content shifted right by sidebar width */}
          <main className="flex-1 ml-64 p-6">
            {children}
          </main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
