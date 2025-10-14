import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold mb-6">RTM Stock</h1>
      <ul className="space-y-3">
        <li>
          <Link className="underline" href="/dealers">Vista Distribuidores</Link>
        </li>
        <li>
          <Link className="underline" href="/internal">Vista Interna</Link>
        </li>
      </ul>
    </main>
  );
}
