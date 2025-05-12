'use client'

import { authClient } from "@/lib/auth-client";
import styles from './header.module.css'
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";

export default function AccountTab() {
    const {
        data: session,
        isPending,
        error,
        refetch
    } = authClient.useSession();

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={styles.signInBox}>
            <button onClick={()=>setIsExpanded(!isExpanded)}>{isExpanded ? 'Close' : 'Account'}</button>
            <div>
                {isExpanded &&
                    <div className={styles.accountBox}>
                        {session ? <AccountInfo name={session.user.name} /> : <SignInTab isPending={isPending} error={error} /> }
                    </div>
                }
            </div>
        </div>
    )
    
}

interface ISignInForm {
    email: string,
    password: string
}

const onSubmit: SubmitHandler<ISignInForm> = async (formData) => {
    console.log("Submitted:" + JSON.stringify(formData, null, 4));
    const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: '/'
    }, {
        onRequest(ctx) {
            //TODO show loading modal...
        },
        onError(ctx) {
            console.error(ctx.error);
        },
    })
}

function SignInTab({isPending, error}: {isPending: boolean, error: any}) {
    const {
            register,
            formState: { errors },
            handleSubmit
        } = useForm<ISignInForm>();
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                    <label htmlFor="email" className={styles.label}>
                    Email:
                    </label>
                    <input id="email" className={errors.email ? styles.inputerr : styles.input} {...register("email",
                        {
                            required: "Please enter an email address."
                        })}
                        />
                    {errors.email && <p role="alert" className={styles.error}>{errors.email.message}</p>}

                    <label htmlFor="password" className={styles.label}>
                        Password:
                    </label>
                    <input id="password" className={errors.password ? styles.inputerr : styles.input} type="password" {...register("password",
                        {
                            required: "Please input a password."
                        })}
                        aria-invalid={errors.password ? "true" : "false"}
                        />
                    {errors.password && <p role="alert" className={styles.error}>{errors.password.message}</p>}
                <input className={styles.submit} type="submit" value="Log in"/>
                <Link href='/sign-up'>
                    <p className={styles.signUpLink}>Create a new account.</p>
                </Link>
            </form>
            {error && <p role="alert" className={styles.error}>{error.statusText}</p> }
        </>
    );
}

function AccountInfo({name}: {name: string}) {
    return (
        <>
            <span>{name}</span>
        </>
    )
}