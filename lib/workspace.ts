export type WorkspaceFileStatus = "clean" | "modified" | "affected";
export type WorkspaceFile = {
  id: string;
  name: string;
  path: string;
  language: "typescript" | "json" | "markdown";
  content: string;
  status?: WorkspaceFileStatus;
};

/** Mock workspace returned by the frontend API boundary. */
export const INITIAL_WORKSPACE_FILES: WorkspaceFile[] = [
  { id: "user-service", name: "UserService.ts", path: "src/services/UserService.ts", language: "typescript", status: "clean", content: "export interface User {\n  id: string;\n  name: string;\n  email: string;\n}\n\nexport async function getUserName(id: string) {\n  const response = await fetch(`/api/users/${id}`);\n  const user: User = await response.json();\n\n  return user.name;\n}" },
  { id: "profile", name: "Profile.tsx", path: "src/components/Profile.tsx", language: "typescript", status: "clean", content: "import { getUserName } from '@/services/UserService';\n\nexport async function Profile({ userId }: { userId: string }) {\n  const name = await getUserName(userId);\n  return <section><h1>{name}</h1></section>;\n}" },
  { id: "profile-test", name: "Profile.test.ts", path: "src/tests/Profile.test.ts", language: "typescript", status: "clean", content: "describe('getUserName', () => {\n  it('returns the API user name', async () => {\n    fetchMock.mockResponseOnce(JSON.stringify({ name: 'Aqib' }));\n  });\n});" },
  { id: "checkout", name: "Checkout.tsx", path: "src/components/Checkout.tsx", language: "typescript", content: "export function Checkout() { return <main>Checkout</main>; }" },
  { id: "header", name: "Header.tsx", path: "src/components/Header.tsx", language: "typescript", content: "export function Header() { return <header>ShopX</header>; }" },
  { id: "order-service", name: "OrderService.ts", path: "src/services/OrderService.ts", language: "typescript", content: "export async function getOrder(id: string) { return fetch(`/api/orders/${id}`); }" },
  { id: "user-type", name: "user.ts", path: "src/types/user.ts", language: "typescript", content: "export type UserRole = 'admin' | 'customer';" },
  { id: "order-type", name: "order.ts", path: "src/types/order.ts", language: "typescript", content: "export type OrderStatus = 'draft' | 'paid';" },
  { id: "dashboard", name: "dashboard.tsx", path: "src/pages/dashboard.tsx", language: "typescript", content: "export default function Dashboard() { return <div>Dashboard</div>; }" },
  { id: "profile-page", name: "profile.tsx", path: "src/pages/profile.tsx", language: "typescript", content: "export default function ProfilePage() { return <div>Profile</div>; }" },
  { id: "user-service-test", name: "UserService.test.ts", path: "tests/UserService.test.ts", language: "typescript", content: "describe('UserService', () => { it('loads a user', () => {}); });" },
  { id: "package", name: "package.json", path: "package.json", language: "json", content: "{\n  \"name\": \"shopx-frontend\",\n  \"private\": true\n}" },
  { id: "readme", name: "README.md", path: "README.md", language: "markdown", content: "# ShopX frontend\n\nA SyncCode demo repository." },
];
