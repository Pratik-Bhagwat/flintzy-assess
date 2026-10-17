"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";

import {
  platformOptions,
  statusOptions,
  type FilterOption,
} from "./filter-options";
import { NewPostDialog } from "./composer/new-post-dialog";

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
  defaultValue?: string;
};

const FilterSelect = ({
  label,
  options,
  defaultValue = "all",
}: FilterSelectProps) => (
  <Select items={options} defaultValue={defaultValue}>
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
  const [query, setQuery] = useState("");

  return (
    <div className="flex w-full flex-col gap-3 md:flex-row">
      <SearchInput value={query} onChange={setQuery} />

      <div className="flex flex-wrap gap-2.5 md:flex-nowrap">
        <FilterSelect label="Status" options={statusOptions} />
        <FilterSelect label="Platform" options={platformOptions} />
        <NewPostDialog />
      </div>
    </div>
  );
};
