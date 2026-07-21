export const APIcalls = async (url, method = "GET", body) => {
    const response = await fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    const result = await response.json()
    return result;
}