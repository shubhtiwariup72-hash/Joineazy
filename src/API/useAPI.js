import { useState, useEffect } from "react";
import { APIcalls } from "./apiCalls";

const useAPI = () => {
    const [data, setData] = useState({ posts: [], todos: [] });
    const [isLoading, setLoading] = useState({ posts: false, todos: false })

    const getData = async (key, url) => {
        setLoading((prev) => ({ ...prev, key: true }))
        const res = await APIcalls(url);
        setLoading((prev) => ({ ...prev, key: false }))
        setData((prev) => ({ ...prev, [key]: res }))
    }

    const postData = async (url, body) => {
        setLoading(true)
        const res = await APIcalls(url, "POST", body);
        setLoading(false)
    }

    const updateData = async (url, body) => {
        setLoading(true)
        const res = await APIcalls(url, "PUT", body);
        setLoading(false)
    }

    const deleteData = async (url) => {
        setLoading(true)
        const res = await APIcalls(url, "DELETE");
        setLoading(false)

    }



    return { data, isLoading, getData, postData, updateData, deleteData }
}

export default useAPI