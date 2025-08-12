import { ProjectFilters } from "@/components/projectFilter";
import { ProjectList } from "../components/projects";
import { getAllProjectsAuthorNames, getAllTags } from "./api/projects/projectActions";

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center padding-24">
        <Projects />
      </main>
    </>
  );
}

async function Projects() {
  const authors = (await getAllProjectsAuthorNames()).rows.map(author => author.name);
  const tags = (await getAllTags())

  return (
    <>
      <ProjectFilters authors={authors} tags={tags} />
      <ProjectList />
    </>
  );
}
