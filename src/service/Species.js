import { fetchWithloginCheck } from "./utils/api"

export function getSpecies() {
    const url = `http://${import.meta.env.VITE_BACKEND_HOST}/species/`
    return fetchWithloginCheck(url, "GET")
}

export function trieSearch(phrase) {
    return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/trie?phrase=${phrase}`)
        .then(res => res.json())
        .then(d => d)
}