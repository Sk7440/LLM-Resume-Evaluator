import "./globals.css";

export const metadata = { title: "Matchline | Resume evaluator", description: "Evaluate resume fit against a target role." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
