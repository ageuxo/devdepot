'use client'

import { SignInTab } from "@/components/account";
import { TagSelector } from "@/components/form";
import { authClient } from "@/lib/auth-client";
import { SubmitHandler, useForm } from "react-hook-form";
import { INewProject } from "./page";
import styles from "@/components/form.module.css";

export function NewProjectForm({ tags }: { tags: { id: number, name: string, category: string, colour: string }[] } ) {

    const onSubmit: SubmitHandler<INewProject> = async (formData) => {
        console.log(formData);
        /* createProject(formData) */
    }

    const {
        data: session,
        error
    } = authClient.useSession();

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        control
    } = useForm<INewProject>({
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
                        <textarea className={errors.description ? styles.inputerr : styles.input} {...register("description",
                            {
                                required: "Please enter a description for your new project.",
                                })}
                        />
                        {errors.description && <p role="alert" className={styles.error}>{errors.description.message}</p>}
                    </label>
                </div>
                <TagSelector tags={tags} formRegister={register} errors={errors} requireSelection={true} />
                <input className={styles.submit} type="submit" value={"Create"} />
            </form>
        </>

    );
}