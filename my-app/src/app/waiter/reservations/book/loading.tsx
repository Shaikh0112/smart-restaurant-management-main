export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
      <div className="skeleton h-28 w-full rounded-xl"></div>
      <div className="skeleton h-96 w-full rounded-xl"></div>
    </div>
  );
}
