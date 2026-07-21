import React, { useEffect, useState } from 'react'
import './About.css'
import UserItem from '../components/UserItem'
import { getAPI } from '../API/apiCalls'
import Loader from '../components/Loader'
import useAPI from '../API/useAPI'

const User = () => {
    const { data, isLoading, getData, deleteData } = useAPI();
    useEffect(() => {
        getData("posts", "https://jsonplaceholder.typicode.com/posts");
        getData("todos", "https://jsonplaceholder.typicode.com/todos/");
    }, [])

    const handleDelete = (id) => {
        const raw = deleteData(`https://jsonplaceholder.typicode.com/posts/${id}`);

    }

    return (
        <section id='about' className='about-section'>

            <div className='about-container' style={{ maxHeight: '80vh', overflowY: 'scroll' }}>
                <h1>User Data</h1>
                {
                    isLoading?.posts ? <Loader /> : data?.posts?.map((item, index) => {
                        return <UserItem item={item} index={index} deleteData={handleDelete} />
                    })
                }
            </div>
        </section>
    )
}

export default User