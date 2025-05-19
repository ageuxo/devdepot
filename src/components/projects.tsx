import { getProjects } from "@/app/api/projects/route";
import Link from "next/link";

export async function ProjectList() {
  const projects = (await getProjects()).rows;
  const entries = projects.map((p) => (
    ProjectCard(p)
  ));
  return (
    <div className="border p-4 rounded shadow m-4 w-11/12">
      <h1>Projects</h1>
      {entries}
    </div>
  );
}

function ProjectCard(project: { createdAt: Date; createdBy: string; description: string; id: number; name: string; }) {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">{project.name}</h2>
      <p>{project.description}</p>
      <Link href={'/project/'+ project.id} className="text-blue-500" target="_blank">
        View Project
      </Link>
    </div>
  );
}