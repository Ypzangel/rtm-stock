export const metadata = {
  title: "RTM Stock",
  description: "RTM Equipment – Stock Viewer (dealers & internal)"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[#0B0C10] text-white">{children}</body>
    </html>
  );
}
