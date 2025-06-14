import type { Tag } from "../../types/note";
import css from "./SortFilter.module.css";
interface SortFilterProps {
  changeTag: (tag: Tag) => void;
}

export default function SortFilter({ changeTag }: SortFilterProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    changeTag(event.target.value as Tag);
  };

  return (
    <select
      onChange={handleChange}
      id="tag"
      name="tag"
      className={css.select}
      defaultValue="Personal"
    >
      <option value="">All</option>
      <option value="Todo">Todo</option>
      <option value="Work">Work</option>
      <option value="Personal">Personal</option>
      <option value="Meeting">Meeting</option>
      <option value="Shopping">Shopping</option>
    </select>
  );
}
