export const Wrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className="w-full max-w-7xl px-4 py-2">{children}</div>;
};
