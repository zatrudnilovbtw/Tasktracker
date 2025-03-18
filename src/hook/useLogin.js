const useLogin = () => {
    const Login = async () => {
        try {
            const respones = await fetch(`http://localhost:8080/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: "Hello", password: "123" })
            })

            if (!respones.ok) {
                const errData = await respones.json()
                throw new Error(errData.message)
            }

            const data = await respones.json()
            console.log(data.token)
        } catch (err) {
            console.log(err.message)
        }
    }

    return { Login }
}

export default useLogin