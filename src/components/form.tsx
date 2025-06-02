import { FieldErrors, RegisterOptions, UseFormRegister, UseFormWatch } from 'react-hook-form';
import styles from './form.module.css';
import mdStyles from './markdown.module.css'
import { INewProject } from '@/app/new-project/page';
import Markdown from 'react-markdown';

export function TagSelector({ tags, formRegister, errors, requireSelection = false }: {tags: { id: number, name: string, category: string, colour: string}[], formRegister: UseFormRegister<INewProject>, errors: FieldErrors<INewProject>, requireSelection?: boolean }) {

    let opts: RegisterOptions<INewProject, 'tags'> = {}
    if (requireSelection) {
        opts.required = {
            value: true,
            message: 'Please select one or more tags that apply to your project.'
        }
    }

    const tagButtons = tags.map((t: { id: number, name: string, category: string, colour: string})=> {
        return (
            <label key={t.name} className={styles.tag} style={{backgroundColor: t.colour}} >
                <input type='checkbox' value={ t.name} {...formRegister(`tags`, opts) } />
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
                <div className={[styles.tagSelectorBox, errors.tags ? styles.inputerr : styles.input].join(' ')} >
                    {tagButtons}
                </div>
                {errors.tags && <p role="alert" className={styles.error}>{errors.tags.message}</p>}
            </div>
        </div>
    );
}

export function MarkdownEditor({ formRegister, formWatch }: { formRegister: UseFormRegister<INewProject>, formWatch: UseFormWatch<INewProject> }) {
    const input = formWatch('description');
    return (
        <div className={styles.box}>
            <div className={mdStyles.box} >
                Markdown: <br />
                <textarea className={mdStyles.textBox} {...formRegister('description')} rows={input?.split('\n').length} />
            </div>
            <div className={[mdStyles.styled, mdStyles.box].join(" ")} >
                Preview: <br />
                <div className={mdStyles.textBox} >
                    <Markdown>{input}</Markdown>
                </div>
            </div>

        </div>
    );
}
