import "@wooorm/starry-night/style/dark"

export default function Layout({ children }: LayoutProps<'/blog/[slug]'>) {

  return (
    <>
      {children}
    </>
  )
}
