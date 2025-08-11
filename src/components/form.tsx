import { FieldErrors, RegisterOptions, UseFormRegister, UseFormWatch } from 'react-hook-form';
import styles from './form.module.css';
import mdStyles from './markdown.module.css'
import { INewProject } from '@/app/new-project/page';
import Markdown from 'react-markdown';
import { MouseEventHandler, useDeferredValue, useState } from 'react';
import { IProjectFilters } from './projectFilter';

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

export function TagSuggestor({ tags, formRegister, errors }: { tags: { id: number, name: string, category: string, colour: string }[], formRegister: UseFormRegister<IProjectFilters>, errors: FieldErrors<INewProject> }) {
    const [selectedTags, setSelected] = useState<{ id: number, name: string, category: string, colour: string }[]>([]);

    function addSelectedTag(tag: { id: number, name: string, category: string, colour: string }) {
        setSelected(s => {
            if (s.find(t => t.id == tag.id)) { // If tag already selected, return copy self
                return [...s];
            }
            return [...s, tag];
        });
    }

    function removeSelectedTag(tag: { id: number, name: string, category: string, colour: string }) {
        setSelected(s => [...s.filter(t => t.id != tag.id)])
    }

    function clickableTag(tag: { id: number, name: string, category: string, colour: string }, onClick: MouseEventHandler, idPrefix: string) {
        const buttonId = `${idPrefix}-${tag.id}`;
        return (
            <label htmlFor={buttonId} key={tag.name} className={[styles.tag, styles.clickable].join(" ")} style={{backgroundColor: tag.colour}} >
                <button type='button' id={buttonId} onClick={onClick} className={[styles.tag, styles.clickable].join(" ")} >{tag.name}</button>
            </label>
        );
    }

    function FilteredTagButtons({tags, filter}: {tags: { id: number, name: string, category: string, colour: string }[], filter: string}) {
        const tagButtons = tags
                .filter(t => {
                    if (filter.length > 0) {
                        return t.name.includes(filter.toLowerCase());
                    }
                    return true;
                }).map(t => clickableTag(t, ()=> addSelectedTag(t), "option"));
                // TODO: make this sort by closeness to filter string

        return (
            <div className={styles.tagSuggestorDropdown} >
                {tagButtons}
            </div>
        )
    }

    const [filter, setFilter] = useState('');
    const deferredFilter = useDeferredValue(filter);

    const selectedTagCards = selectedTags.map(t => clickableTag(t, ()=> removeSelectedTag(t), "selected"));

    return (
            <div className={styles.tagSuggestorBox} >
                Tags:<br />
                <div className={styles.tagSuggestorSelected} >
                    {selectedTagCards}
                </div>
                <div className={styles.tagSuggestorInput} >
                    <input type='text' value={filter} onChange={e => setFilter(e.target.value)} className={[styles.input, styles.tagSuggestorInput].join(" ")} />
                    <FilteredTagButtons tags={tags} filter={deferredFilter} />
                </div>
                {errors.tags && <p role="alert" className={styles.error}>{errors.tags.message}</p>}
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
