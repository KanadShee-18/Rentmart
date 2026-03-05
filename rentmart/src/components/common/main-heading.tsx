import { cn } from "@/lib/utils";

export const MainHeading = ({
  headingText,
  headingAs = "h2",
  className,
}: {
  headingText: string;
  className?: string;
  headingAs?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) => {
  const Heading = headingAs;
  return (
    <Heading
      className={cn(
        "text-xl font-semibold text-shadow-xs text-neutral-600 dark:text-neutral-300 tracking-tight",
        className,
      )}
    >
      {headingText}
    </Heading>
  );
};
