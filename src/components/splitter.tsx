import clsx from "clsx";

type SplitterProps = {
  className?: string;
};

export const Splitter = ({ className }: SplitterProps) => {
  return <div className={clsx("flex h-px bg-gray-100", className)} />;
};
