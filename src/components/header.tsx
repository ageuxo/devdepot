import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <Link href="/" className="text-2xl font-bold">
            <h1 className="text-2xl">Projects</h1>
        </Link>
    </header>
  );
}