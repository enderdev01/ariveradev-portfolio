// A phone shell for showing real screens at true size. The screen keeps a
// 9:19.5 ratio so both phones on the page line up.
export default function Phone({ children, className = "" }) {
  return (
    <div
      className={`mx-auto w-[16.5rem] rounded-[2.6rem] bg-text-primary p-2.5 shadow-[0_32px_64px_-24px_rgba(19,26,39,0.55)] sm:w-[18.5rem] lg:w-[19.5rem] ${className}`.trim()}
    >
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.1rem]">{children}</div>
    </div>
  );
}
