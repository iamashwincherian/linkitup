interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main>
      <div className="flex justify-center items-center h-full min-h-screen bg-orange-50">
        {children}
      </div>
    </main>
  );
}
