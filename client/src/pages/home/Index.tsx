import Companies from "./Companies";
import FilterAndSearch from "./FilterAndSearch";

export default function Home() {
  return (
    <main className="px-4">
      <FilterAndSearch />
      <Companies />
    </main>
  );
}
