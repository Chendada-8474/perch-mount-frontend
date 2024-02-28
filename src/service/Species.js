
export function getSpecies() {
    return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/species/`)
        .then((res) => res.json())
        .then((d) => d);
}

export function trieSearch(phrase) {
    return fetch(`http://${import.meta.env.VITE_BACKEND_HOST}/trie?phrase=${phrase}`)
        .then(res => res.json())
        .then(d => d)
}