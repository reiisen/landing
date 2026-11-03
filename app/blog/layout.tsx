import { Sidebar } from "@/react/sidebar";

export default function Layout({ children }: LayoutProps<'/blog'>) {
  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <Sidebar />
      {children}
    </main>
  )
}
