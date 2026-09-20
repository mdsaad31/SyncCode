import ChangeDetail from "./change-detail";

export function generateStaticParams() {
  return [{ id: "1042" }, { id: "1041" }, { id: "1040" }];
}

export default function ChangeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <ChangeDetail params={params} />;
}
