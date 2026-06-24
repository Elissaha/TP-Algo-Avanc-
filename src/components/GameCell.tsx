export default function GameCell({
  value,
  isSelected,
  onClick,
  disabled,
}: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-20 h-20 md:w-24 md:h-24
        rounded-full
        border-4 border-amber-950
        text-3xl font-bold
        transition-all duration-300
        hover:scale-110

        ${isSelected ? "ring-4 ring-yellow-300" : ""}

        ${value === "X"
          ? "bg-white text-black"
          : value === "O"
          ? "bg-black text-white"
          : "bg-amber-100"}
      `}
    >
      {value}
    </button>
  );
}