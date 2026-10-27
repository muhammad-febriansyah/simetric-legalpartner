import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type DebouncedSearchInputProps = {
    action: string;
    search: string;
    placeholder: string;
    ariaLabel: string;
};

export function DebouncedSearchInput({
    action,
    search,
    placeholder,
    ariaLabel,
}: DebouncedSearchInputProps) {
    const [query, setQuery] = useState(search);

    useEffect(() => {
        setQuery(search);
    }, [search]);

    useEffect(() => {
        const trimmedQuery = query.trim();

        if (trimmedQuery === search.trim()) {
            return;
        }

        const timeout = window.setTimeout(() => {
            router.get(action, trimmedQuery ? { search: trimmedQuery } : {}, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => window.clearTimeout(timeout);
    }, [action, query, search]);

    return (
        <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder}
                className="pl-9"
                aria-label={ariaLabel}
            />
        </div>
    );
}
