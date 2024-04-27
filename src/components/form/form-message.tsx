import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

interface FormResponseMessageType {
  message: string | undefined;
  type?: "success" | "error";
}

export default function FormResponseMessage({
  message,
  type = "success",
}: FormResponseMessageType) {
  if (!message) return;

  return (
    <div
      className={cn(
        "p-3 rounded-md flex items-center gap-x-2 text-sm mt-1",
        type === "success" && "text-emerald-500 bg-emerald-500/15",
        type === "error" && "text-destructive bg-destructive/15"
      )}
    >
      <TriangleAlert height={18} />
      <p>{message}</p>
    </div>
  );
}
