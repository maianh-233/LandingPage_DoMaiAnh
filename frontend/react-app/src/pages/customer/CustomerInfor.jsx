import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/customer/Profile/ProfileHeader";
import InfoSection from "../../components/customer/Profile/InfoSection";
import AddressList from "../../components/customer/Profile/AddressList";
import EditProfileModal from "../../components/customer/Profile/EditProfileModal";
import AddAddressModal from "../../components/customer/Profile/AddAddressModal";
import { useAuth } from "../../context/AuthContext";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  mapUserToProfile,
  setDefaultAddress,
  updateProfile,
} from "../../services/profileService";

export default function CustomerInfoPage() {
  const navigate = useNavigate();
  const { user: authUser, token, loading: authLoading, updateUser } = useAuth();
  const [user, setUser] = useState({ name: "", email: "", phone: "", birthDate: "" });
  const [addresses, setAddresses] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (authLoading) {
      setLoadingProfile(true);
      return;
    }

    if (!authUser || !token) {
      navigate("/customerlogin");
      return;
    }

    const loadProfile = async () => {
      setLoadingProfile(true);
      setLoadError("");

      try {
        setUser(mapUserToProfile(authUser));
        const data = await getAddresses(token);
        setAddresses(data.addresses || []);
      } catch (error) {
        console.error(error);
        setLoadError(error.message || "Không thể tải thông tin hồ sơ.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [authLoading, authUser, token, navigate]);

  const saveProfile = async (profile) => {
    const data = await updateProfile(token, profile, profile.password || "");
    updateUser(data.user);
    setUser(mapUserToProfile(data.user));
  };

  const addAddress = async (payload) => {
    const data = await createAddress(token, payload);
    setAddresses((prev) => [...prev, data.address]);
  };

  const deleteAddressHandler = useCallback(
    async (id) => {
      await deleteAddress(token, id);
      setAddresses((prev) => {
        const removed = prev.find((a) => a.id === id);
        const next = prev.filter((a) => a.id !== id);

        if (removed?.is_default && next.length > 0) {
          return next.map((a, index) => ({
            ...a,
            is_default: index === 0,
          }));
        }

        return next;
      });
    },
    [token]
  );

  const setDefaultAddressHandler = useCallback(
    async (id) => {
      await setDefaultAddress(token, id);
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          is_default: a.id === id,
        }))
      );
    },
    [token]
  );

  if (loadingProfile) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="relative w-12 h-12 animate-spin">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white via-white/40 to-transparent" />
            <div className="absolute inset-[3px] rounded-full bg-black" />
          </div>

          {/* Text */}
          <span className="text-white/80 text-sm tracking-wide">
            Đang tải dữ liệu...
          </span>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-200 p-4">
        <div className="rounded-2xl border border-red-800 bg-zinc-900 px-6 py-4 text-center max-w-md">
          <p className="text-red-400">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-amber-500 hover:bg-amber-600 text-black font-medium px-6 py-2 rounded-xl"
          >
            Thử lại
          </button>
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
              onDelete={deleteAddressHandler}
              onSetDefault={setDefaultAddressHandler}
            />
          </div>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal
          user={user}
          onClose={() => setEditOpen(false)}
          onSave={saveProfile}
        />
      )}

      {addOpen && (
        <AddAddressModal
          defaultPhone={user.phone}
          onClose={() => setAddOpen(false)}
          onAdd={addAddress}
        />
      )}
    </>
  );
}
