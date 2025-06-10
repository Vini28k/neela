import { cn } from "@/lib/utils";

export function Toaster() {
  return (
    <div className={cn("fixed bottom-0 right-0 z-[100] max-w-[420px] p-4")}>
      {/* Sonner toast notifications will be rendered here */}
    </div>
  );
}