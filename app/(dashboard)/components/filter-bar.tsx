"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hasActiveFilters } from "@/lib/post-filters";
import { cn } from "@/lib/utils";

import {
  platformOptions,
  statusOptions,
  type FilterOption,
} from "./filter-options";
import { NewPostDialog } from "./composer/new-post-dialog";
import { setFilterParams, usePostFilters } from "@/hooks/use-post-filters";

const noFocusRing =
  "has-[[data-slot=input-group-control]:focus-visible]:border-border has-[[data-slot=input-group-control]:focus-visible]:ring-0";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

const SearchInput = ({ value, onChange }: SearchInputProps) => (
  <InputGroup
    className={cn("h-11 border-border bg-input p-2 md:flex-1", noFocusRing)}
  >
    <InputGroupInput
      aria-label="Search"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    <InputGroupAddon className="shrink-0 text-muted-foreground">
      <Search />
    </InputGroupAddon>
    {value && (
      <InputGroupAddon align="inline-end">
        <Button
          type="button"
          size="icon-xs"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="rounded-full bg-muted text-muted-foreground hover:bg-muted/85 hover:text-foreground"
        >
          <X />
        </Button>
      </InputGroupAddon>
    )}
  </InputGroup>
);

type FilterSelectProps = {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
};

const FilterSelect = ({
  label,
  options,
  value,
  onChange,
}: FilterSelectProps) => (
  <Select
    items={options}
    value={value}
    onValueChange={(next) => onChange(next ?? "all")}
  >
    <SelectTrigger className="min-h-11 min-w-36 flex-1 bg-input md:w-48 md:flex-none">
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="text-muted-foreground">{label}:</span>
        <SelectValue />
      </span>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{label}</SelectLabel>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export const FilterBar = () => {
  const filters = usePostFilters();

  const [query, setQuery] = useState(filters.q);

  useEffect(() => {
    const id = setTimeout(() => setFilterParams({ q: query.trim() }), 250);
    return () => clearTimeout(id);
  }, [query]);

  const clearAll = () => {
    setQuery("");
    setFilterParams({ q: "", status: "all", platform: "all" });
  };

  const isFiltered = hasActiveFilters({ ...filters, q: query });

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex w-full flex-col gap-3 md:flex-row">
        <SearchInput value={query} onChange={setQuery} />

        <div className="flex flex-wrap gap-2.5 md:flex-nowrap">
          <FilterSelect
            label="Status"
            options={statusOptions}
            value={filters.status}
            onChange={(status) => setFilterParams({ status })}
          />
          <FilterSelect
            label="Platform"
            options={platformOptions}
            value={filters.platform}
            onChange={(platform) => setFilterParams({ platform })}
          />
          <NewPostDialog />
        </div>
      </div>

      {isFiltered && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clearAll}
          className="self-start text-muted-foreground"
        >
          <X />
          Clear filters
        </Button>
      )}
    </div>
  );
};
