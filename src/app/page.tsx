import { ProjectList } from "../components/projects";

export default function Home() { // Make this use database
  return (
    <>
      <main className="flex flex-col items-center padding-24">
        < ProjectList />
      </main>
    </>
  );
}
