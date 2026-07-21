import { useState } from "react";

const raw = { name: "", age: "", address: "", email: "", phone: "" }
const useCrud = (initialData = []) => {
    const [data, setData] = useState(initialData);
    const [userInput, setUserInput] = useState(raw);

    const loadTodoItem = () => {
        const rawData = localStorage.getItem("todo")
        if (rawData?.length) {
            setData(JSON.parse(rawData))
        } else {
            setData([]);
        }
    }

    const addData = () => {
        const rawData = [...data, userInput]
        setData(rawData);
        localStorage.setItem("todo", JSON.stringify(rawData))
        setUserInput(raw);
    }
    const deleteData = (name) => {
        setData(data.filter((item) => item.name !== name));
    }
    const handleInputChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value });
    }

    return { data, addData, deleteData, handleInputChange, loadTodoItem, userInput };
}

export default useCrud;