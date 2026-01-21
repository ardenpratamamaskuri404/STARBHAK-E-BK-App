export default function ButtonPrimary({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 rounded-xl bg-[#6E8CFB] hover:bg-[#5b78e5] text-white font-semibold transition-all shadow"
    >
      {children}
    </button>
  );
}
