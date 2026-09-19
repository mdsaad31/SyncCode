import { CodeWorkspace } from "@/components/synccode/code-workspace";

export default async function CodePage({ searchParams }: { searchParams: Promise<{ action?: string }> }) {
  const params = await searchParams;
  return <CodeWorkspace action={params.action} />;
}
