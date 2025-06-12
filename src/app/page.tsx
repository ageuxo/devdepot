import { ProjectFilters } from "@/components/projectFilter";
import { ProjectList } from "../components/projects";

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center padding-24">
        <Projects />
      </main>
    </>
  );
}

function Projects() {

  return (
    <div>
      <ProjectFilters />
      <ProjectList />
    </div>
  );
}
