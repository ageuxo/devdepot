import { ProjectList } from "./projects";

const projects = [
  {
    name: "Project 1",
    description: "This is the first project",
    link: "https://example.com/project1",
  },
  {
    name: "Project 2",
    description: "This is the second project",
    link: "https://example.com/project2",
  },
];

export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center padding-24">
        < ProjectList projects={projects} />
      </main>
    </>
  );
}
