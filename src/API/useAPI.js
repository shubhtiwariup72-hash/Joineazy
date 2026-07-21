import { useState, useEffect } from "react";
import { APIcalls } from "./apiCalls";

const useAPI = () => {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false)

    const getData = async (url) => {
        setLoading(true)
        const res = await APIcalls(url);
        setData(res)
        setLoading(false)
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