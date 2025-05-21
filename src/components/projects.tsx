
import Link from "next/link";
import styles from "./projects.module.css";
import { DBFilter, getProjects, TagData } from "@/app/api/projects/projectActions";
import { Project } from "kysely-codegen";

export async function ProjectList() {
  let filter: DBFilter<Project> = {
    type: "empty",
    filters: []
  }

  const projects = (await getProjects(filter));
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

function ProjectCard(project: { createdAt: Date; createdBy: string; createdByName: string; description: string; id: number; name: string; tags: string}) {
  const tagEntries: TagData[] = JSON.parse(project.tags);
  const tagCards = tagEntries.map(TagCard);
  return (
    <div className={styles.card} key={project.id}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{project.name}</h2>
        <div className={styles.tags} >
          {tagCards}
        </div>
      </div> 
        <Link href={'/user/'+project.createdBy}>
        by: {project.createdByName}
        </Link>
      <p>{project.description}</p>
      <div className={styles.linkArea}>
        <Link href={'/project/'+ project.id} className="text-blue-500" target="_blank">
          View Project
        </Link>
      </div>
    </div>
  );
}

function TagCard(tag: {name: string, category: string, colour: string} ) {
  return (
    <span key={tag.name} className={styles.tag} style={{
      backgroundColor: tag.colour
    }} >{tag.name}</span>
  );
}