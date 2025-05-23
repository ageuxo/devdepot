'use client'

import styles from "@/components/form.module.css"
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {useForm, SubmitHandler} from "react-hook-form";

interface ISignUpForm {
    email: string,
    displayname: string,
    password: string,
    verifyPass: string
}

export function SignUpForm() {
    const router = useRouter();

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch
    } = useForm<ISignUpForm>();
    const password = watch('password');

    let [submitError, setSubmitError] = useState("");

    const onSubmit: SubmitHandler<ISignUpForm> = async (formData) => {
        const { data, error } = await authClient.signUp.email({
            email: formData.email,
            name: formData.displayname,
            password: formData.password,
        }, {
            onRequest(ctx) {
                //TODO show loading modal...
            },
            onError(ctx) {
                console.log(ctx.error);
                if (ctx.error.code == "USER_ALREADY_EXISTS") {
                    setSubmitError(`A user already exists with the email ${formData.email}. Please sign in instead.`);
                } else {
                    setSubmitError(ctx.error.message);
                }
            },
            onSuccess(ctx) {
                router.push('/');
            }
        })
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} key={"sign-up-form"} className={styles.form}>
            <h1 className={styles.title}>Register new account</h1>
            <div className={styles.box}>
                <label className={styles.label}>
                    Email:<br />
                    <input className={errors.email ? styles.inputerr : styles.input} {...register("email",
                        {
                            required: "Please enter an email address.",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Please enter a valid email address."
                            }
                            })}
                    />
                    {errors.email && <p role="alert" className={styles.error}>{errors.email.message}</p>}
                </label>
            </div>
            <div className={styles.box}>
                <label className={styles.label}>
                    Display name:<br />
                    <input className={errors.displayname ? styles.inputerr : styles.input} {...register("displayname",
                        {
                            required: "Please enter a display name.",
                            minLength: {
                                value: 5,
                                message: "Your display name needs to be at least 5 characters long."
                            },
                            maxLength: {
                                value: 15,
                                message: "Your display name can be at most 24 characters long."
                            }
                            })}
                            aria-invalid={errors.displayname ? "true" : "false"}
                        />
                        {errors.displayname && <p role="alert" className={styles.error}>{errors.displayname.message}</p>}
                </label>
            </div>
            <div className={styles.box}>
                <label className={styles.label}>
                    Password:<br />
                    <input className={errors.password ? styles.inputerr : styles.input} type="password" {...register("password",
                        {
                            required: "Please input a password.", 
                            minLength: {
                                value: 8,
                                message: "Your password has to be at least 8 characters, or longer."
                            },
                            maxLength: {
                                value: 256,
                                message: "Your password has to be a max of 256 characters long."
                            }
                        })}
                        aria-invalid={errors.password ? "true" : "false"}
                    />
                    {errors.password && <p role="alert" className={styles.error}>{errors.password.message}</p>}
                </label>
            </div>
            <div className={styles.box}>
                <label className={styles.label}>
                    Verify Password:<br />
                    <input className={errors.verifyPass ? styles.inputerr : styles.input} type="password" {...register("verifyPass",
                        {
                            required: "Please verify password.",
                            validate: (value) => value === password || "Passwords do not match."
                            
                        })}
                        aria-invalid={errors.verifyPass ? "true" : "false"}
                    />
                    {errors.verifyPass && <p role="alert" className={styles.error}>{errors.verifyPass.message}</p>}
                </label>
            </div>

            {submitError &&
                <div className={styles.box}>
                    <p role='alert' className={styles.error}>{submitError}</p>
                </div>
            }

            <input className={styles.submit} type="submit" value={"Register"}/>
        </form>
    )
}