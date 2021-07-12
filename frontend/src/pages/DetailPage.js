import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import {useHttp} from "../hooks/http.hook";
import {useSnackbar} from "notistack";
import {ChaptersList} from "../components/ChaptersList";
import {Loader} from "../components/Loader";

export const DetailPage = () => {
    const [fanfic, setFanfic] = useState()
    const [chapters, setChapters] = useState()
    const fanficId = useParams().id
    const {error, request, clearError} = useHttp()
    const {enqueueSnackbar} = useSnackbar()

    async function updateFanfic(fanfic) {
        const fandomById = await request('/api/fandom/byId', 'POST', {fandomId: fanfic.fandom})
        const authorById = await request('/api/user/byId', 'POST', {userId: fanfic.author})
        const tagsById = await request('/api/tag/byIds', 'POST', {tagsIds: fanfic.tags})
        const fandom = fandomById.map(e => e.title).toString()
        const author = authorById.map(e => e.firstname + " " + e.lastname).toString()
        const tags = tagsById.map(e => e.title)
        return ({...fanfic, fandom, author, tags})
    }

    async function getChapters(fanfic) {
        try {
            return await request(
                '/api/chapter/chaptersByIds',
                'POST',
                {chapterIds: fanfic.chapters})
        } catch (e) {}
    }

    useEffect(() => {
        async function getFanfic() {
            return await request(`/api/fanfic/${fanficId}`, 'GET')
        }
        getFanfic()
            .then(result => {
                getChapters(result).then(allChapters => setChapters(allChapters))
                updateFanfic(result).then(newFanfic => setFanfic(newFanfic))
            })
    }, [request])

    useEffect(() => {
        if (error) {
            enqueueSnackbar(JSON.stringify(error), {variant: "error"})
            clearError()
        }
    }, [error, enqueueSnackbar, clearError])

    if (fanfic === undefined){
        return <Loader/>
    } else return (
        <div>
            <ChaptersList fanfic={fanfic} chapters={chapters}/>
        </div>

    )
}