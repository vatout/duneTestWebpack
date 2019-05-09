const initialState = {
    licence: {fetching: false, licence: null, idTable: null, error: null, message: null },
    tokenConnect: {fetching: false, tokenConnect: null, professorId: null, error: null },
    tokenSession: {tokenSession: null},
    games: {installed: null, notInstalled: null},
    installation: {download: false, error: false, installation: false, message: null},
    files: {results: null},
    professor: {professorId: null, nom: null, prenom: null, email: null, error: null, success: null },
    welcome: {connection: true },
    loader: {loading: false},
    process: {start: false, idGp: null, end: false, error: false, message: null, players: null},
    students: {error: false, success: false, content: null},
    classes: {pending: false, classes: null, success: null, error: null, errorCode: null}
}

export default initialState;
