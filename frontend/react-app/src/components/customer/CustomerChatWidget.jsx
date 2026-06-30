import { useEffect, useRef, useState } from "react";
import {
  MessageCircle,
  SendHorizontal,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";

/* Gợi ý nhanh */
const quickReplies = [
  "Sản phẩm bán chạy",
  "Chính sách đổi trả",
  "Thời gian giao hàng",
  "Tư vấn size giúp mình",
];

export default function CustomerChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Xin chào 👋 Lunaria có thể hỗ trợ gì cho bạn hôm nay?",
    },
  ]);

  const bottomRef = useRef(null);

  /* Auto scroll xuống tin mới */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text) {
    const content = text.trim();
    if (!content) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), sender: "user", text: content },
      {
        id: Date.now() + 1,
        sender: "bot",
        text:
          "Cảm ơn bạn đã liên hệ 💛 Nhân viên Lunaria sẽ phản hồi trong ít phút nhé!",
      },
    ]);

    setInput("");
  }

  return (
    <>
      {/* ================= CHAT BOX ================= */}
      {isOpen && (
        <div
          className={`
            fixed bottom-24 right-5 z-50
            bg-zinc-900 border border-zinc-800
            rounded-2xl shadow-2xl overflow-hidden
            flex flex-col transition-all duration-300

            /* Mobile */
            w-[95vw] h-[80vh]

            /* Desktop */
            sm:w-[360px] sm:h-[520px]
            ${isExpanded ? "sm:w-[560px] sm:h-[620px]" : ""}
          `}
        >
          {/* HEADER */}
          <div className="h-14 px-4 bg-zinc-800 border-b border-zinc-700 flex items-center justify-between shrink-0">
            <div>
              <p className="font-semibold text-zinc-100">
                Lunaria Support
              </p>
              <p className="text-xs text-emerald-400">
                Đang trực tuyến
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExpanded((p) => !p)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-zinc-700"
              >
                {isExpanded ? (
                  <Minimize2 size={16} />
                ) : (
                  <Maximize2 size={16} />
                )}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-zinc-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[85%] sm:max-w-[80%]
                    px-3 py-2 rounded-2xl text-sm leading-relaxed
                    ${
                      m.sender === "user"
                        ? "bg-orange-500 text-black rounded-br-md"
                        : "bg-zinc-800 text-zinc-100 rounded-bl-md"
                    }
                  `}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* FOOTER */}
          <div className="border-t border-zinc-800 px-3 py-3 space-y-2 shrink-0">
            {/* QUICK REPLY */}
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {quickReplies.map((item) => (
                <button
                  key={item}
                  onClick={() => sendMessage(item)}
                  className="
                    text-xs px-2.5 py-1.5 rounded-lg
                    bg-zinc-800 hover:bg-zinc-700
                    transition-colors
                  "
                >
                  {item}
                </button>
              ))}
            </div>

            {/* INPUT */}
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && sendMessage(input)
                }
                placeholder="Nhập tin nhắn..."
                className="
                  flex-1 h-11 rounded-xl bg-zinc-800
                  border border-zinc-700 px-3 text-sm
                  outline-none focus:border-orange-500
                "
              />

              <button
                onClick={() => sendMessage(input)}
                className="
                  w-11 h-11 rounded-xl
                  bg-orange-500 text-black
                  flex items-center justify-center
                  hover:bg-orange-400 transition-colors
                "
              >
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FLOAT BUTTON (LUÔN ĐỨNG IM) ================= */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="
          fixed bottom-5 right-5 z-50
          w-14 h-14 rounded-full
          bg-orange-500 text-black
          flex items-center justify-center
          shadow-lg hover:bg-orange-400
          transition-colors
        "
        title="Chat với Lunaria"
      >
        <MessageCircle size={24} />
      </button>
    </>
  );
}