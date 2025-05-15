'use client'
import { useForm, SubmitHandler } from "react-hook-form";
import styles from "../sign-up/signup.module.css";
import { authClient } from "@/lib/auth-client";
import { SignInTab } from "@/components/account";

interface NewProjectForm {
    name: string,
    description: string
}

const onSubmit: SubmitHandler<NewProjectForm> = async (formData) => {
    
}

export default function NewProjectForm() {
    const {
        data: session,
        error
    } = authClient.useSession();

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch
    } = useForm<NewProjectForm>();

    if (!session) {
        return (
            <>
                <div className={styles.error}>
                    <h3>You need to be signed in to create a new project.</h3>
                    <p>Please sign in:</p>
                </div>
                < SignInTab isPending={false} error={error} />
            </>
        )
    }

    return (
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
                        <input className={errors.description ? styles.inputerr : styles.input} {...register("description",
                            {
                                required: "Please enter a name for your new project.",
                                })}
                        />
                        {errors.description && <p role="alert" className={styles.error}>{errors.description.message}</p>}
                    </label>
                </div>

                
            </form>
    );
}