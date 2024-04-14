import { fetchWithloginCheck } from "./utils/api"

export function dataExport(
    projectIDs = null,
    perchMountIDs = null,
    startTime = null,
    endTime = null,
    prey = null,
    taxonOrdersByHuman = null,
    taxonOrdersByAI = null,
    unreviewedData = false,
    preview = true
) {
    if (preview) {
        var endPoint = new URL(`${window.BACKEND_HOST}/preview_export/`)
    } else {
        var endPoint = new URL(`${window.BACKEND_HOST}/data_export/`)
    }
    var params = new URLSearchParams()

    if (projectIDs) {
        params.append("project_ids", projectIDs.join(','))
    }

    if (perchMountIDs) {
        params.append("perch_mount_ids", perchMountIDs.join(','))
    }

    if (startTime != null) {
        params.append("start_time", startTime)
    }

    if (endTime != null) {
        params.append("end_time", endTime)
    }

    if (prey) {
        console.log(prey)
        params.append("prey", prey)
    }

    if (taxonOrdersByHuman) {
        params.append("taxon_orders_by_human", taxonOrdersByHuman.join(','))
    }

    if (taxonOrdersByAI) {
        params.append("taxon_orders_by_ai", taxonOrdersByAI.join(','))
    }

    if (unreviewedData) {
        params.append("unreviewed_data", unreviewedData)
    }
    endPoint.search = params

    return fetchWithloginCheck(endPoint.href, "GET")
}



export function getExportHistoriesByExportor(exportor) {
    var endPoint = new URL(`${window.BACKEND_HOST}/export_histories/`)
    var params = new URLSearchParams()
    params.append('exportor', exportor)
    endPoint.search = params
    return fetchWithloginCheck(endPoint.href, "GET")
}