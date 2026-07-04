import {
  Building2,
  Home,
  Map,
  MapPin,
  Phone,
  Plus,
  Star,
  Trash2,
  User,
} from "lucide-react";

/* ================= CONSTANTS ================= */
const ADDRESS_TYPE_LABELS = {
  HOME: "Nhà riêng",
  WORK: "Công ty",
  OTHER: "Khác",
};

/* ================= ICON BY TYPE ================= */
const AddressTypeIcon = ({ type }) => {
  switch (type) {
    case "HOME":
      return <Home size={14} />;
    case "WORK":
      return <Building2 size={14} />;
    default:
      return <Map size={14} />;
  }
};

/* ================= MAIN COMPONENT ================= */
export default function AddressList({
  addresses = [],
  onAdd,
  onDelete,
  onSetDefault,
}) {
  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-3">
          <MapPin className="text-amber-400" />
          Địa chỉ của tôi
        </h2>

        <button
          onClick={onAdd}
          className="bg-amber-500 hover:bg-amber-600 w-full sm:w-auto px-5 py-3 rounded-2xl flex justify-center items-center gap-2 font-medium text-black"
        >
          <Plus size={18} />
          Thêm địa chỉ
        </button>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {addresses.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-700 bg-zinc-800/50 p-10 text-center">
          <MapPin className="mx-auto text-amber-400 mb-3" size={32} />
          <p className="text-zinc-400">Bạn chưa có địa chỉ giao hàng nào.</p>
          <button
            onClick={onAdd}
            className="mt-4 text-amber-400 hover:text-amber-300 font-medium"
          >
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      ) : (
        /* ================= HORIZONTAL LIST ================= */
        <div
          className="
            flex gap-4 overflow-x-auto pb-4
            snap-x snap-mandatory
            px-1
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {addresses.map((addr) => {
            const isDefault = addr.is_default;

            return (
              <div
                key={addr.id}
                className={`
                  snap-start flex-shrink-0
                  w-[85vw] sm:w-[360px]
                  p-5 rounded-3xl
                  bg-zinc-800 border
                  ${isDefault
                    ? "border-amber-400 ring-2 ring-amber-400/40"
                    : "border-zinc-700"}
                `}
              >
                {/* ================= TOP ================= */}
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-zinc-100 text-base">
                      <User size={16} className="text-amber-400" />
                      {addr.receiver_name}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <Phone size={14} />
                      {addr.receiver_phone}
                    </div>
                  </div>

                  {isDefault && (
                    <span className="flex items-center gap-1 bg-amber-400 text-black text-xs px-3 py-1 rounded-full whitespace-nowrap">
                      <Star size={12} />
                      Mặc định
                    </span>
                  )}
                </div>

                {/* ================= TYPE ================= */}
                <div className="mt-4">
                  <span className="inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-zinc-700 text-zinc-300">
                    <AddressTypeIcon type={addr.address_type} />
                    {ADDRESS_TYPE_LABELS[addr.address_type] ||
                      addr.address_type}
                  </span>
                </div>

                {/* ================= ADDRESS ================= */}
                <div className="mt-3 text-sm text-zinc-300 leading-relaxed">
                  <p>{addr.address_line}</p>
                  <p className="text-zinc-400 mt-1">
                    {addr.ward}, {addr.district}, {addr.province}
                  </p>
                </div>

                {addr.postal_code && (
                  <p className="text-xs text-zinc-500 mt-1">
                    Mã bưu điện: {addr.postal_code}
                  </p>
                )}

                {/* ================= ACTIONS ================= */}
                <div className="flex justify-between items-center mt-5 gap-3">
                  {!isDefault && (
                    <button
                      onClick={() => onSetDefault(addr.id)}
                      className="text-amber-400 text-sm px-4 py-2 rounded-xl border border-amber-400/40 hover:bg-amber-400/10"
                    >
                      Đặt làm mặc định
                    </button>
                  )}

                  <button
                    onClick={() => onDelete(addr.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20"
                  >
                    <Trash2 className="text-red-400" size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}