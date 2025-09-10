'use client'

import { SubmitHandler, useForm } from "react-hook-form";
import forms from "./form.module.css";
import filter from "./projectFilter.module.css";
import { useState } from "react";
import { TagSuggestor } from "./form";
import { useSearchParams } from "next/navigation";
import { Tag } from "kysely-codegen";

export interface IProjectFilters {
    search: string,
    sort: SortBy,
    direction: SortDirection,
    author: string,
    tags: Tag[]
  }

export type SortDirection = 'asc' | 'desc';
export type SortBy = 'createdAt';
  
export function ProjectFilters({ authors, tags }: { authors: string[], tags: { id: number, name: string, category: string, colour: string}[] }) {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());

    function getParamOrUndefined(param: string) {
        const get = params.get(param);
        if (get != null) {
            return get;
        }
        return undefined;
    }

    const onSubmit: SubmitHandler<IProjectFilters> = async (formData) => {
        const newParams = new URLSearchParams(searchParams.toString());
        
        const author = formData.author;
        if (author) { // if author selected
            newParams.set('author', author);
        } else {
            newParams.delete('author');
        }

        const tags = formData.tags;
        if (tags) { // if tags selected
            newParams.delete('tag');
            for (const tag of tags) {
                newParams.append('tag', tag.name);
            }
        }

        newParams.set('direction', formData.direction);
        newParams.set('sort', formData.sort);

        window.history.pushState(null, '', `?${newParams.toString()}`);
    }

    const [isExpanded, setIsExpanded] = useState(false);

    const {
        register,
        formState: { errors },
        handleSubmit,
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
            <>
                <button type='button' onClick={()=>setIsExpanded(!isExpanded)}>{isExpanded ? 'Less filters' : 'More filters'}</button>
                <div className={forms.box} hidden={!isExpanded} >
                    <label className={filter.label} >
                        Author:
                        <select defaultValue={getParamOrUndefined('author')} className={[filter.select, filter.input].join(" ")} {...register("author")}>
                            <option value='' ></option>
                            {authors && authors.length > 0 && authors.map(a=> (<option key={a} value={a}>{a}</option>) )}
                        </select>
                    </label>
                    <TagSuggestor tags={tags} formControl={control} errors={errors} preSelected={params.getAll('tag')} />
                </div>
                
            </>
            <div className={filter.footer} >
                <label className={filter.label} >
                    Sort by:
                    <select defaultValue={getParamOrUndefined('sort')} className={[filter.select, filter.input].join(" ")} {...register("sort")}>
                        <option value='createdAt' >Date created</option>
                    </select>
                </label>
                <label className={filter.label} >
                    Direction:
                    <select defaultValue={getParamOrUndefined('direction')} className={[filter.select, filter.input].join(" ")} {...register("direction")}>
                        <option value='asc' >Ascending</option>
                        <option value='desc' >Descending</option>
                    </select>
                </label>
                <input value="Apply filter" type="submit" className={[filter.input].join(" ")} />
            </div>
        </form>
    );
}

