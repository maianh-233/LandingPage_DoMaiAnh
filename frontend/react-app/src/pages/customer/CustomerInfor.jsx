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
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-200">
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-4">
          <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <span>Đang tải thông tin người dùng...</span>
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
