"use client";

import { Search } from "lucide-react";

import TextInput from "../../atoms/Input";
import Button from "../../atoms/Button";

import styles from "./SearchBar.module.scss";
import { useBlogFiltersStore } from "@/store/blogFiltersStore";

interface Props {
  placeholder?: string;
}

const SearchBar = ({ placeholder = "Search articles" }: Props) => {
  const { query, setQuery, clear } = useBlogFiltersStore();

  return (
    <div className={styles.wrapper} role="search">
      <div className={styles.input}>
        <TextInput
          aria-label="Search blog posts"
          placeholder={placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          leadingIcon={<Search size={16} aria-hidden />}
        />
      </div>
      {query ? (
        <div className={styles.filters}>
          <Button type="button" variant="ghost" onClick={clear}>
            Clear
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default SearchBar;
