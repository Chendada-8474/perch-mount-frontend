import { fetchWithloginCheck } from "./utils/api"

export function getSpecies() {
    const url = `${window.BACKEND_HOST}/species/`
    return fetchWithloginCheck(url, "GET")
}

export function trieSearch(phrase) {
    return fetch(`${window.BACKEND_HOST}/trie?phrase=${phrase}`)
        .then(res => res.json())
        .then(d => d)
}