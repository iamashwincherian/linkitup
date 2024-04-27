import { Card } from "@/components/ui/card";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main>
      <div className="flex justify-center items-center h-full min-h-screen">
        {children}
      </div>
    </main>
  );
}
