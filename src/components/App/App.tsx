import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import type { createNoteValues } from "../../types/note";

import css from "./App.module.css";
import { useState } from "react";
import Pagination from "../Pagination/Pagination";
import NoteModal from "../NoteModal/NoteModal";
import SearchBox from "../SearchBox/SearchBox";
import { useDebounce } from "use-debounce";
import Loader from "../Loader/Loader";

function App() {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  const { data, isLoading } = useQuery({
    queryKey: ["todos", currentPage, debouncedQuery],
    queryFn: () => fetchNotes(currentPage, 10, debouncedQuery),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleCreateNote = (newTodo: createNoteValues) => {
    createMutation.mutate(newTodo);
  };

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleDeleteNote = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onSearch={setSearchQuery} />
        {data && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        {
          <button className={css.button} onClick={() => setIsModalOpen(true)}>
            Create note +
          </button>
        }
      </header>
      {isLoading && <Loader />}
      {data && <NoteList notes={data.notes} onDelete={handleDeleteNote} />}
      {isModalOpen && (
        <NoteModal
          onClose={() => setIsModalOpen(false)}
          onSubmitNote={handleCreateNote}
        />
      )}
    </div>
  );
}

export default App;
