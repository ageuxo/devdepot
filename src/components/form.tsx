import styles from './form.module.css';

export default function TagSelector({ tags }: {tags: { name: string, category: string, colour: string}[]}) {
    console.log(tags)

    const tagButtons = tags.map((t: { name: string, category: string, colour: string})=> {
        return (
            <label key={t.name} className={styles.tag} style={{backgroundColor: t.colour}} >
                <input type='checkbox' value={t.name} />
                {t.name}
            </label>
        );
    });

    return (
        <div className={styles.box}>
            <div className={styles.label} >
                Project Tags:<br />
                <div className={styles.tagSelectorBox} >
                    {tagButtons}
                    {tagButtons}
                    {tagButtons}
                    {tagButtons}
                    {tagButtons}
                </div>
            </div>
        </div>
    );
}



