import PlateformeNavbar from "@/components/plateforme/PlateformeNavbar";

export default function PlateformeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-germe-cream">
      <PlateformeNavbar />
      {children}
    </div>
  );
}
