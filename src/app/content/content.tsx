'use client'

import fStyles from '@/components/form.module.css';
import cStyles from './content.module.css';
import { SubmitHandler, useForm } from "react-hook-form";
import { ActionResult, IUserContent, uploadUserContent } from './actions';

interface IContentUpload {
    content: FileList,
    name: string,
    description: string
}

export function ContentUploader() {
    const {
            register,
            formState: { errors },
            handleSubmit,
            watch
        } = useForm<IContentUpload>();

    const onSubmit: SubmitHandler<IContentUpload> = async (formData) => {
        if (formData.content.length == 1) {
            const file = formData.content[0];
            uploadUserContent(file, formData.name, formData.description);
        }
    }

    const fileValue = watch('content');

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={fStyles.form} name='Content upload form'>
            <label className={[(errors.content ? fStyles.inputerr : fStyles.input), fStyles.contentInput].join(' ')} >
                    <>{fileValue?.item(0) ? fileValue.item(0)?.name : 'Click here to select a file for upload...'}</>
                <input className={fStyles.contentInput} type='file' accept='image/png,image/jpeg' style={{ opacity: 0, width: '1px', height: '1px' }} {...register('content', { required: 'Please click here to pick a file to upload.' })} />
                {errors.content && <p role="alert" className={fStyles.error}>{errors.content.message}</p>}
            </label>
            <label className={fStyles.label} >
                Name: <br />
                <input className={errors.name ? fStyles.inputerr : fStyles.input} placeholder={fileValue?.item(0)?.name} {...register('name', { required: 'Please give a name to your content.' })} />
                {errors.name && <p role="alert" className={fStyles.error}>{errors.name.message}</p>}
            </label>
            <label className={fStyles.label} >
                Description: <br />
                <p className={fStyles.description} >{fileValue?.item(0)?.type.includes('image/png') || fileValue?.item(0)?.type.includes('image/jpeg') ? 'Image hover text (alt text) for accessability.' : 'Brief description of the downloadable content'}</p>
                <input className={errors.description ? fStyles.inputerr : fStyles.input} {...register('description', { required: 'Please click here to pick a file to upload.' })} />
                {errors.description && <p role="alert" className={fStyles.error}>{errors.description.message}</p>}
            </label>

            <input className={fStyles.submit} type='submit' value={'Upload'} />
        </form>
    );
}

export function ContentList({ result }: { result: ActionResult<IUserContent[]> }) {
    const images: IUserContent[] = [];
    const downloads: IUserContent[] = [];
    if (result.type == 'success' && result.result) {
        for (const entry of result.result) {
            if (entry.type == 'image') {
                images.push(entry);
            } else if (entry.type == 'download') {
                downloads.push(entry);
            }
        }
    }

    return (
        <div className={[fStyles.box, cStyles.list].join(' ')}>
            <div>
                <span className={fStyles.title} >Images</span>
                <div className={cStyles.contentList} >
                    {images.length > 0 ? images.map(ImageContent) : <span className={cStyles.imgContent} >No image content found.</span>}
                </div>
            </div>
            <div>
                <span className={fStyles.title} >Downloadables</span>
                <div className={cStyles.contentList} >
                    {downloads.length > 0 ? downloads.map(DownloadableContent) : <span className={cStyles.dlContent} >No downloadable content found.</span>}
                </div>
            </div>
        </div>
    )
}

function ImageContent( content: IUserContent ) {
    return (
        <div key={content.id} className={cStyles.imgContent} >
            <h3 className={fStyles.title} >{content.name}</h3>
            <img src={content.path} />
        </div>
    );
}

function DownloadableContent( content: IUserContent ) {
    return (
        <div key={content.id} className={cStyles.dlContent} >
            <h3 className={fStyles.title} >{content.name}</h3>
        </div>
    );
}