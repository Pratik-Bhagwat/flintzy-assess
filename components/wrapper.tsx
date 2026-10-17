export const Wrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="w-full h-full max-w-7xl px-2 py-1 lg:px-4 lg:py-2 mx-auto">
      {children}
    </div>
  );
};
