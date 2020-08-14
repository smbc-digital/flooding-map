import fetch from 'cross-fetch'

const fetchWithTimeout = (url, options, timeout = 10000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('Timeout')), timeout)
        })
    ])
}

const GetUserFriendlyTerminology = (subjectCode) => {
    switch (subjectCode) {
        case 'GFLO':
        case 'CWFD':
        case 'OOH1':
        case 'PRFL':
        case 'ADVI':
            return 'Flooding'
        case 'CWGU':
            return 'Blocked grid or drain'
        case 'BRIV':
            return 'High water levels on a river or stream'
        default:
            return ''
    }
}

export {
    fetchWithTimeout,
    GetUserFriendlyTerminology
}