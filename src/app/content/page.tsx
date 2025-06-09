import fStyles from '@/components/form.module.css';
import cStyles from './content.module.css';
import { ContentList, ContentUploader } from './content';
import { getUserContent } from './actions';

export default async function Page() {
    const userContent = await getUserContent();
    return (
        <div className={[fStyles.box, cStyles.list].join(" ")} >
            <ContentUploader />
            <ContentList result={userContent}  />
        </div>
    );
}

