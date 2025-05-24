import { getAllTags } from "../api/projects/projectActions"
import { NewProjectForm } from "./new-project"

export interface INewProject {
    name: string,
    description: string,
    tags: string[]
}

export default async function NewProjectPage() {
    const allTags = (await getAllTags());
    return (
        <div>
            <NewProjectForm tags={allTags} />
        </div>
    )
}