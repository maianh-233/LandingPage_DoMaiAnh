export default function ExtraInfo() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
      
      <div>
        <strong className="text-gray-300">Chuẩn kết nối:</strong>{" "}
        <span className="text-gray-400">Bluetooth 5.3</span>
      </div>

      <div>
        <strong className="text-gray-300">Thời lượng pin:</strong>{" "}
        <span className="text-gray-400">Lên đến 30 giờ</span>
      </div>

      <div>
        <strong className="text-gray-300">Chống ồn:</strong>{" "}
        <span className="text-gray-400">Active Noise Cancelling (ANC)</span>
      </div>

      <div>
        <strong className="text-gray-300">Độ trễ:</strong>{" "}
        <span className="text-gray-400">Low Latency Mode</span>
      </div>

      <div>
        <strong className="text-gray-300">Tương thích:</strong>{" "}
        <span className="text-gray-400">iOS, Android, Windows, macOS</span>
      </div>

      <div>
        <strong className="text-gray-300">Bảo hành:</strong>{" "}
        <span className="text-gray-400">12 tháng chính hãng</span>
      </div>

    </div>
  );
}