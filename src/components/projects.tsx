

class Project {
  name: string;
  link: string;
  description: string;
  constructor(name: string, link: string, description: string) {
    this.name = name;
    this.link = link;
    this.description = description;
  }
}

export function ProjectList({ projects }: { projects: Project[] }) {
  const entries = projects.map((project) => (
    < ProjectCard key={project.name} project={project} />
  ));
  return (
    <div className="border p-4 rounded shadow m-4 w-11/12">
      <h1>Projects</h1>
      {entries}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-bold">{project.name}</h2>
      <p>{project.description}</p>
      <a href={project.link} className="text-blue-500" target="_blank">
        View Project
      </a>
    </div>
  );
}