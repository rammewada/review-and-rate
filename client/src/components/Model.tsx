import type { ReactNode } from "react";

export default function Model({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="relative max-h-[90vh] w-full max-w-lg   rounded-3xl bg-white shadow-2xl overflow-y-auto">
        <div className="absolute z-0 -top-16 -left- w-35 h-35 rounded-full custom-gradient opacity-20" />
        <div className="absolute z-0 rotate-45 -top-13 -left-14 w-35 h-35 rounded-full custom-gradient " />
        {children}
      </div>
    </div>
  );
}
