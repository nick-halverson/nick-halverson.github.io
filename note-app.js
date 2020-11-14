setTimeout(() => {
    renderApp();
});

function renderApp() {
    
    const oldNoteAppContainer = document.getElementById('note-app--renderSavedNotes-container');

    if (oldNoteAppContainer) {
        oldNoteAppContainer.remove();
    }

    const noteAppContainer = document.createElement('div');
    noteAppContainer.innerHTML = `
        <div id="note-app--renderSavedNotes-container" class="note-app--renderSavedNotes-container">
            <div>
                <div>This is the note app</div>
                <a href="index.html">back to home</a>
                <br>
            </div>
            <div class="note-app--notes-container">
                <div id="new-note-container" class="note-app--new-note-container">
                    <button onclick="newNoteClicked()">New Note</button>
                </div>

                <div id="saved-notes-container" class="note-app--saved-notes-container">
                    <button 
                        onclick="deleteAllNotes()"
                        style="${areThereAnySavedNotes() ? '' : 'display: none;'}"
                    >Delete All</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(noteAppContainer);

    renderSavedNotes();
}

function renderSavedNotes() {
    const savedNotesContainer = document.getElementById('saved-notes-container');

    const savedNotes = getSavedNotesFromLocalStorage();
    
    addSavedNotesToSavedNotesContainer(savedNotes, savedNotesContainer)
}

function addSavedNotesToSavedNotesContainer(savedNotes, savedNotesContainer) {
    const savedNotesAsHTMLElements = convertSavedNotesToHTMLElements(savedNotes);
    
    savedNotesAsHTMLElements.forEach(note => {        
        savedNotesContainer.appendChild(note)
    });
}

function convertSavedNotesToHTMLElements(savedNotes) {
    const savedNotesAsHTMLElements = savedNotes.reduce((result, currentNote) => {
        return [...result, generateHTMLElementForNote(currentNote)];
    }, []);
    
    return savedNotesAsHTMLElements;
}

function generateHTMLElementForNote(note) {
    const noteElement = document.createElement('div');
    const noteId = generateRandomId();
    noteElement.innerHTML = `
        <div id="${noteId}" class="note-app--saved-note-container">
            <h3>${note.title}</h3>
            <div>${note.body}</div>
            <div><button onclick="${deleteNote(noteId)}">delete</div>
        </div>
    `;
    return noteElement
}

function deleteNote(noteId) {
    const savedNotes = getSavedNotesFromLocalStorage();
    const newSavedNotes = savedNotes.filter(note => note.id !== noteId);
    setUpdatedNotesToLocalStorage(newSavedNotes);
}

function areThereAnySavedNotes() {
    console.log('calling areThereAnySavedNotes()')
    const savedNotes = getSavedNotesFromLocalStorage();
    console.log('savedNotes:', savedNotes);
    if (savedNotes.length === 0) {
        return false;
    }
    else {
        return true;
    }
}

function newNoteClicked() {
    const newNote = document.createElement('div');
    const noteId = generateRandomId();
    const noteTitleId = generateRandomId();
    const noteBodyId = generateRandomId();
    newNote.innerHTML = `
        <div id="${noteId}" class="note-app--new-note">
            <h3>New Note</h3>
            <div>
                <input 
                    type="text" 
                    id="${noteTitleId}"
                    placeholder="Title..."
                >
            </div>
            <div>
                <textarea 
                    id="${noteBodyId}"
                    placeholder="Details..."
                ></textarea>
            </div>
            <div>
                <button onclick="saveNote(${noteId}, ${noteTitleId}, ${noteBodyId})">Save</button>
            </div>
        </div>
    `;

    const newNoteContainer = document.getElementById('new-note-container')
    newNoteContainer.appendChild(newNote);
}

function saveNote(noteId, noteTitleId, noteBodyId) {
    const noteTitle = document.getElementById(noteTitleId).value;
    const noteBody = document.getElementById(noteBodyId).value;

    const newNote = buildNote(noteId, noteTitle, noteBody);
    const previouslySavedNotes = getSavedNotesFromLocalStorage();


    const newNotes = generateNewNotes(previouslySavedNotes, newNote);

    setUpdatedNotesToLocalStorage(newNotes);
    renderApp();
}

function buildNote(id, title, body) {
    return {
        id,
        title,
        body
    };
}

function generateRandomId() {
    return Math.ceil(Math.random() * 100000);
}

function getSavedNotesFromLocalStorage() {
    const notesJSON = localStorage.getItem('Notes');
    if (
        notesJSON === null ||
        notesJSON === undefined
    ) {
        return []
    }
    else {
        const notesObj = JSON.parse(notesJSON);
        return notesObj.notes;
    }
}

function generateNewNotes(previouslySavedNotes, newNote) {
    return {
        notes: [
            ...previouslySavedNotes,
            newNote
        ]
    }
}

function setUpdatedNotesToLocalStorage(newNotes) {
    localStorage.setItem(`Notes`, JSON.stringify(newNotes));
}

function deleteAllNotes() {
    localStorage.removeItem('Notes');
    renderApp();
}