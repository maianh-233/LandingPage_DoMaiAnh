import { Edit3 } from "lucide-react";

export default function ProfileHeader({ user, onEdit }) {
  return (
    <div className="  bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400 pt-12 pb-10 px-6 text-center relative">
    <button
      onClick={onEdit}
      className="
        absolute top-6 right-6
        bg-zinc-900 text-amber-400
        p-3 rounded-2xl
        shadow-lg shadow-black/40
        hover:bg-zinc-800 hover:scale-105
        transition
      "
    >
      <Edit3 size={20} />
    </button>

      <img
        src={`https://i.pravatar.cc/150?u=${user.email}`}
        className="w-32 h-32 mx-auto rounded-3xl border-4 border-zinc-900 object-cover"
      />

      <h1 className="text-4xl font-bold mt-5 text-zinc-900">
        {user.name}
      </h1>
      <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5
                    bg-zinc-900 text-amber-400
                    rounded-full text-sm font-medium
                    shadow-md">
        <span>👑</span>
        <span>Khách hàng thân thiết</span>
    </div>
    </div>
  );
}