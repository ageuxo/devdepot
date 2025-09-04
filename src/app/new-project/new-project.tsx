'use client'

import { SignInTab } from "@/components/account";
import { MarkdownEditor, TagSelector } from "@/components/form";
import { authClient } from "@/lib/auth-client";
import { SubmitHandler, useForm } from "react-hook-form";
import { INewProject } from "./page";
import styles from "@/components/form.module.css";
import modalStyles from "@/components/dialogModal.module.css";
import { createProject, NewProjectResult } from "./actions";
import { MouseEventHandler, useRef, useState } from "react";
import Link from "next/link";

export function NewProjectForm({ tags }: { tags: { id: number, name: string, category: string, colour: string }[] } ) {

    const modalRef = useRef<HTMLDialogElement | null>(null);
    const [result, setResult] = useState<NewProjectResult | undefined>();

    function openModal() {
        modalRef.current?.showModal();
    }

    function debugSetModalResultSuccess() {
        setResult({ status: "success", id: 2, name: "debug modal example"});
        openModal();
    }

    function closeModal() {
        modalRef.current?.close();
    }

    const onSubmit: SubmitHandler<INewProject> = async (formData) => {
        const foundTags = formData.tags.map(name => tags.find(tag => tag.name == name)).filter(t => t != undefined);
        const projectResult = await createProject({ name: formData.name, description: formData.description, tags: foundTags });
        if (projectResult) {
            setResult(projectResult);
            openModal();
        }
    }

    const {
        data: session,
        error
    } = authClient.useSession();

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch    } = useForm<INewProject>({
        defaultValues: {
            tags: []
        }
    });

    if (!session) {
        return (
            <>
                <div className={styles.error}>
                    <h3>You need to be signed in to create a new project.</h3>
                    <p>Please sign in:</p>
                </div>
                < SignInTab error={error} />
            </>
        )
    }


    return (
        <>
            <dialog ref={modalRef} className={modalStyles.dialog} >
                <ResultDisplay result={result} onClick={closeModal}  />
            </dialog>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <h1 className={styles.title}>Create a new project</h1>
                <div className={styles.box}>
                    <label className={styles.label}>
                        Project Name:<br />
                        <input className={errors.name ? styles.inputerr : styles.input} {...register("name",
                            {
                                required: "Please enter a name for your new project.",
                                })}
                        />
                        {errors.name && <p role="alert" className={styles.error}>{errors.name.message}</p>}
                    </label>
                </div>
                <div className={styles.box}>
                    <label className={styles.label}>
                        Project Description:<br />
                        <MarkdownEditor formRegister={register} formWatch={watch} />
                        {errors.description && <p role="alert" className={styles.error}>{errors.description.message}</p>}
                    </label>
                </div>
                <TagSelector tags={tags} formRegister={register} errors={errors} requireSelection={true} />
                <input className={styles.submit} type="submit" value={"Create"} />
            </form>
        </>

    );
}

function ResultDisplay({ result, onClick }: { result: NewProjectResult | undefined, onClick: MouseEventHandler<HTMLButtonElement> }) {
    if (!result) {
        return (
            <div className={modalStyles.modal} >
                <p role="alert" className={styles.error}>An unknown error has occured, please try again later.</p>
                <button autoFocus type="button" onClick={onClick} >Close</button>
            </div>
        );
    }
    return (
        <div className={modalStyles.modal}>
            { result.status == 'success'
                ?   <p>Project created successfully: <Link href={`/project/${result.id}`}>{result.name}</Link> </p>
                :   (<>
                            <p role="alert" className={styles.error}>An error occurred while creating project, please try again later...</p>
                            <p role="alert" className={styles.error}>Reason: {result.msg} </p>
                            <button autoFocus type="button" onClick={onClick} >Close</button>
                    </>)
            }
        </div>
    )
}