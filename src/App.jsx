import { useState, useEffect } from 'react';
import Split from 'react-split';
import { nanoid } from 'nanoid';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';

const App = () => {
  //get notes from local storage, if there are any
  const [notes, setNotes] = useState(
    //if it's a function, it doesn't run every time the state changes
    //it's called lazy state initialization
    //just an arrow function with an implicit return
    () => JSON.parse(localStorage.getItem("notes")) || []
  );

  const [currentNoteId, setCurrentNoteId] = useState(
    (notes[0] && notes[0].id) || ''
  );


  // save notes to local storage
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes]);

  // new notes are added at the top
  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Title of your note"
    }
    setNotes(prevNotes => [newNote, ...prevNotes])
    setCurrentNoteId(newNote.id)
  }

  function updateNote(text) {
    setNotes(oldNotes => oldNotes.map(oldNote => {
      return oldNote.id === currentNoteId
        ? { ...oldNote, body: text }
        : oldNote
    }))
  }

  function findCurrentNote() {
    return notes.find(note => {
      return note.id === currentNoteId
    }) || notes[0]
  }

  return (
    <main>
      {notes.length > 0
        ?
        <Split
          sizes={[30, 70]}
          direction="horizontal"
          className="split"
          minSize={[100, 300]}
          gutterSize={5}
          snapOffset={30}>
          <Sidebar 
            notes={notes}
            currentNote={findCurrentNote()}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
          />
          {
            currentNoteId &&
            notes.length > 0 &&
            <Editor
              currentNote={findCurrentNote()}
              updateNote={updateNote}
            />
          }

        </Split>
        :
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button
            className="first-note"
            onClick={createNewNote}
          >
            Create one now
          </button>
        </div>
      }


    </main>
  )
}

export default App