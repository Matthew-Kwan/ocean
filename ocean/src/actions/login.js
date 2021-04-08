// environment configutations
import ENV from './../config.js'
const API_HOST = ENV.api_host

export const login = (username, password, setUser) => {

  const obj = {
    username: username,
    password: password
  }

  const request = new Request(`${API_HOST}/api/users/login`, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  })

  // send the request
  const promise = fetch(request)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then(json => {
      // if the user exists, setUser to user
      if (json.user !== undefined) {
        setUser(json.user)
        return json.user
      }
    })
    .catch(error => {
      console.log(error);
    })

  return promise
}

export const logout = (setUser) => {
  const url = `${API_HOST}/api/users/logout`

  const promise = fetch(url)
    .then(res => {
      setUser({})
      return res
    })
    .catch(error => {
      console.log(error)
    })

  return promise
}