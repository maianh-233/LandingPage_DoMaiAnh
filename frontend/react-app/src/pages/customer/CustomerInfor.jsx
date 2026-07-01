import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/customer/Profile/ProfileHeader";
import InfoSection from "../../components/customer/Profile/InfoSection";
import AddressList from "../../components/customer/Profile/AddressList";
import EditProfileModal from "../../components/customer/Profile/EditProfileModal";
import AddAddressModal from "../../components/customer/Profile/AddAddressModal";
import { useAuth } from "../../context/AuthContext";

const USER_INIT = {
  name: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0123 456 789",
  birthDate: "1995-06-15",
};

const ADDRESS_INIT = [
 {
    id: "addr-1",
    user_id: "user-1",
    receiver_name: "Nguyễn Văn A",
    receiver_phone: "0123 456 789",
    province: "TP. Hồ Chí Minh",
    district: "Quận 1",
    ward: "Phường Bến Nghé",
    address_line: "123 Nguyễn Thị Minh Khai",
    postal_code: "700000",
    is_default: true,
    address_type: "HOME",
    created_at: "2024-05-01T08:30:00",
    updated_at: "2024-05-01T08:30:00",
  },
  {
    id: "addr-2",
    user_id: "user-1",
    receiver_name: "Nguyễn Văn A",
    receiver_phone: "0987 654 321",
    province: "TP. Hồ Chí Minh",
    district: "Quận Bình Thạnh",
    ward: "Phường 25",
    address_line: "Landmark 81, Vinhomes Central Park",
    postal_code: "700000",
    is_default: false,
    address_type: "WORK",
    created_at: "2024-05-10T09:00:00",
    updated_at: "2024-05-10T09:00:00",
  },
  {
    id: "addr-3",
    user_id: "user-1",
    receiver_name: "Nguyễn Văn A",
    receiver_phone: "0909 111 222",
    province: "Đà Nẵng",
    district: "Hải Châu",
    ward: "Phường Thạch Thang",
    address_line: "45 Trần Phú",
    postal_code: "550000",
    is_default: false,
    address_type: "OTHER",
    created_at: "2024-06-01T14:20:00",
    updated_at: "2024-06-01T14:20:00",
  },
];

export default function CustomerInfoPage() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState(USER_INIT);
  const [addresses, setAddresses] = useState(ADDRESS_INIT);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (authLoading) {
      setLoadingProfile(true);
      return;
    }

    if (!authUser) {
      navigate("/customerlogin");
      return;
    }

    setUser({
      name: authUser.fullName || "Người dùng",
      email: authUser.email || "",
      phone: authUser.phone || "",
      birthDate: authUser.dateOfBirth
        ? new Date(authUser.dateOfBirth).toISOString().split("T")[0]
        : "",
    });
    setLoadingProfile(false);
  }, [authLoading, authUser, navigate]);

  const deleteAddress = useCallback(
    (id) => setAddresses((prev) => prev.filter((a) => a.id !== id)),
    []
  );

  const addAddress = (addr) => {
    setAddresses((prev) => [...prev, addr]);
    setAddOpen(false);
  };

  if (loadingProfile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-200">
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-4">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <span>Đang tải thông tin người dùng...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-h-screen bg-zinc-950 text-zinc-200">
        <div className="w-full min-h-screen bg-zinc-900 border border-zinc-800 md:my-6 md:rounded-3xl overflow-hidden">
          <ProfileHeader user={user} onEdit={() => setEditOpen(true)} />

          <div className="p-6 md:p-10 space-y-12">
            <InfoSection user={user} />
            <AddressList
              addresses={addresses}
              onAdd={() => setAddOpen(true)}
              onDelete={deleteAddress}
            />
          </div>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSave={setUser}
        />
      )}

      {addOpen && (
        <AddAddressModal
          phone={user.phone}
          onClose={() => setAddOpen(false)}
          onAdd={addAddress}
        />
      )}
    </>
  );
}