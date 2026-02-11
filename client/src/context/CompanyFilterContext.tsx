import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useMemo,
} from "react";

interface CompanyFilterState {
  search: string;
  topRated: boolean;
}

interface CompanyFilterContextValue extends CompanyFilterState {
  setSearch: (value: string) => void;
  setTopRated: (value: boolean) => void;
  setShowAddCompany: (value: boolean) => void;
  showAddCompany: boolean;
}

const CompanyFilterContext = createContext<CompanyFilterContextValue | null>(
  null,
);

export function CompanyFilterProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState<string>("");
  const [topRated, setTopRated] = useState<boolean>(false);
  const [showAddCompany, setShowAddCompany] = useState<boolean>(false);

  const value = useMemo(
    () => ({
      search,
      topRated,
      setSearch,
      setTopRated,
      showAddCompany,
      setShowAddCompany,
    }),
    [search, topRated, showAddCompany],
  );

  return (
    <CompanyFilterContext.Provider value={value}>
      {children}
    </CompanyFilterContext.Provider>
  );
}

export function useCompanyFilter() {
  const ctx = useContext(CompanyFilterContext);
  if (!ctx) {
    throw new Error(
      "UseCompanyFilter must be used inside a companyfilter provider",
    );
  }
  return ctx;
}
