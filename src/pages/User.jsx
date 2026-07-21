import React, { useEffect, useState } from 'react'
import './About.css'
import UserItem from '../components/UserItem'
import { APIcalls, getAPI } from '../API/apiCalls'
import Loader from '../components/Loader'
import useAPI from '../API/useAPI'

const User = () => {
    // const { data, isLoading, getData, deleteData } = useAPI();
    // useEffect(() => {
    //     getHandleData()
    //     getData("posts", "https://jsonplaceholder.typicode.com/posts");
    //     getData("todos", `https://jsonplaceholder.typicode.com/todos/`);
    // }, [])

    const [isLoading, setLoading] = useState(false)
    const [data, setData] = useState([])
    
    useEffect(() => {
        getHandleData()
    }, [])

    const getHandleData = async () => {
        setLoading(true)
        const res = await APIcalls("https://jsonplaceholder.typicode.com/posts", "GET")
        setData(res)
        setLoading(false)
    }

    const handleDelete = () => {

    }

    return (
        <section id='about' className='about-section'>

            <div className='about-container' style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
                <h1>User Data</h1>
                {
                    isLoading ? <Loader /> : data?.map((item, index) => {
                        return <UserItem item={item} index={index} deleteData={handleDelete} />
                    })
                }
            </div>
        </section>
    )
}

export default User