'use client'

import { SubmitHandler, useForm } from "react-hook-form";
import forms from "./form.module.css";
import filter from "./projectFilter.module.css";

interface IProjectFilters {
    search: string,
    sort: 'newest' | 'oldest',
    direction: 'asc' | 'desc'
  }

export function ProjectFilters() {

    const onSubmit: SubmitHandler<IProjectFilters> = async (formData) => {
        console.log(formData);
    }

    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        control
    } = useForm<IProjectFilters>();

    return (
        <form className={forms.form} onSubmit={handleSubmit(onSubmit)} >
            <label className={filter.label} >
                Filter:
                <input type='search' placeholder='search filter' className={[filter.input, filter.search].join(" ")} {...register("search")}
                />
                {errors.search && <p role="alert" className={forms.error}>{errors.search.message}</p>}
            </label>
            <div className={filter.footer} >
                <label className={filter.label} >
                    Sort by:
                    <select className={[filter.select, filter.input].join(" ")} {...register("sort")}>
                        <option value='newest' >Newest</option>
                        <option value='oldest' >Oldest</option>
                    </select>
                </label>
                <label className={filter.label} >
                    Direction:
                    <select className={[filter.select, filter.input].join(" ")} {...register("direction")}>
                        <option value='desc' >Descending</option>
                        <option value='asc' >Ascending</option>
                    </select>
                </label>
                <input value="Apply filter" type="submit" className={[filter.input].join(" ")} />
            </div>
        </form>
    );
}

