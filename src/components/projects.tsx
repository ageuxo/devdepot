'use client'

import Link from "next/link";
import styles from "./projects.module.css";
import { getProjects, TagData } from "@/app/api/projects/projectActions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DBFilter } from "@/lib/KyselyFilters";
import { SortDirection } from "./projectFilter";

export function ProjectList() {

  const searchParams = useSearchParams();
  const [projects, setProjects] = useState<{ createdBy: string; createdAt: Date; id: number; name: string; description: string; createdByName: string; tags: string; }[]>([]);

  useEffect(() => {
    const filter: DBFilter = {
      type: 'and',
      filters: []
    }

    const author = searchParams.get('author');
    if (author) { // if author selected
      filter.filters.push({ type: 'condition', field: 'user.name', op: 'eq', value: author });
    }
    
    const tags = searchParams.getAll('tag');
    if (tags) { // if tags selected
      if (tags.length > 0) {
        const tagFilters: DBFilter = { type: 'exists', from: 'projectTags', join: { table:'tags', on: 'projectTags.tagId = tags.id'}, filters: [] };

        for (const tag of tags) {
          tagFilters.filters.push({ type: 'condition', field: 'tags.name', op: 'eq', value: tag })
        }

        filter.filters.push(tagFilters);
      }
    }
    
    // Sort direction
    const direction = searchParams.get('direction');
    let sortDir: SortDirection = "asc";
    if (direction == 'desc') {
      sortDir = 'desc';
    }

    getProjects(filter, 'createdAt', sortDir).then((data) => {
      setProjects(data);
    });

  }, [searchParams]);

  const entries = projects.map( (p) => ProjectCard(p) );

  return (
    <div className="border p-4 rounded shadow m-4 w-11/12">
      <h1>Projects</h1>
      {entries}
    </div>
  );
}

function ProjectCard(project: { createdAt: Date; createdBy: string; createdByName: string; description: string; id: number; name: string; tags: string}) {
  const tagEntries: TagData[] = JSON.parse(project.tags);
  const tagCards = tagEntries ? tagEntries.map(TagCard) : TagCard({name: 'error', category: 'error', colour: '#FF0000'}) ;
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