import { UseFormRegister } from 'react-hook-form';
import styles from './form.module.css';
import { INewProject } from '@/app/new-project/page';

export function TagSelector({ tags, formRegister }: {tags: { id: number, name: string, category: string, colour: string}[], formRegister: UseFormRegister<INewProject> }) {

    const tagButtons = tags.map((t: { id: number, name: string, category: string, colour: string})=> {
        return (
            <label key={t.name} className={styles.tag} style={{backgroundColor: t.colour}} >
                <input type='checkbox' value={ t.name} {...formRegister(`tags`) } />
                <span className={styles.tagLabel} >
                    {t.name}
                </span>
            </label>
        );
    });

    return (
        <div className={styles.box}>
            <div className={styles.label} >
                Project Tags:<br />
                <div className={styles.tagSelectorBox} >
                    {tagButtons}
                </div>
            </div>
        </div>
    );
}
