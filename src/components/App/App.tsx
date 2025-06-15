import css from "./App.module.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import { useDebounce } from "use-debounce";
import NoteModal from "../NoteModal/NoteModal";
import SortFilter from "../SortFilter/SortFilter";
import type { Tag } from "../../types/note";

export default function App() {
  const [searchQuery, setQuery] = useState("");

  const [sortQuery, setSortQuery] = useState<Tag>("Personal");

  const [currentPage, setCurrentPage] = useState(1);

  const [modalOnClose, setModalOnClose] = useState(false);

  const onPageChange = ({ selected }: { selected: number }) =>
    setCurrentPage(selected + 1);

  const [debounceQuery] = useDebounce(searchQuery, 500);

  const { data, isSuccess } = useQuery({
    queryKey: ["tasks", debounceQuery, currentPage, sortQuery],
    queryFn: () => fetchNotes({ searchQuery, currentPage, sortQuery }),
    // enabled: query !== "",
  });

  const totalPages = data?.totalPages ?? 0;

  const createNoteBtn = () => {
    setModalOnClose(true);
  };

  const closeModal = () => {
    setModalOnClose(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onSearch={setQuery} />

        <SortFilter changeTag={setSortQuery} />

        {isSuccess && totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        )}

        <button onClick={createNoteBtn} className={css.button}>
          Create note +
        </button>
      </header>

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {modalOnClose && (
        <NoteModal onClose={closeModal} onSuccess={closeModal} />
      )}
    </div>
  );
}
