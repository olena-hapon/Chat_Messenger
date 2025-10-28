import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CreateChatModal from "../createChatModal/CreateChatModel";
import ToogleBTN from "../ToogleBtn/ToogleBtn";
import "./chatList.css";

const ChatList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [chatToEdit, setChatToEdit] = useState(null);

  const menuRef = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const token = localStorage.getItem("googleToken");

  // --- Перевірка токена та редирект ---
  useEffect(() => {
    if (!token) {
      navigate("/sign-in");
    }
  }, [token, navigate]);

  // --- Fetch chats ---
  const { data: chats } = useQuery({
    queryKey: ["chats", token],
    queryFn: async () => {
      if (!token) return [];
      const res = await fetch(`${API_URL}/api/chats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("googleToken");
        navigate("/sign-in");
        return [];
      }

      if (!res.ok) throw new Error("Failed to fetch chats");
      return res.json();
    },
    enabled: !!token,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // --- Закриття активного меню при кліку поза ним ---
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Фільтрація чатів ---
  const filteredChats =
    chats?.filter(
      (chat) =>
        chat.participant.firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        chat.participant.lastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
    ) || [];

  // --- Створення нового чату ---
  const handleCreateChat = async (newChat) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/chats`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newChat),
      });
      if (!res.ok) throw new Error("Failed to create chat");
      const createdChat = await res.json();
      queryClient.setQueryData(["chats", token], (oldChats = []) => [
        ...oldChats,
        createdChat,
      ]);
      navigate(`/dashboard/chats/${createdChat._id}`);
      setIsModalOpen(false);
      setSearchQuery("");
    } catch (err) {
      console.log("Error creating chat:", err);
    }
  };

  // --- Видалення чату ---
  const handleDeleteChat = async (chatId) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/chats/${chatId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) throw new Error("Failed to delete chat");
      queryClient.invalidateQueries(["chats", token]);
      setChatToDelete(null);
    } catch (err) {
      console.log("Error deleting chat:", err);
    }
  };

  // --- Редагування чату ---
  const handleEditSave = async () => {
    if (!chatToEdit || !token) return;
    try {
      const res = await fetch(`${API_URL}/api/chats/${chatToEdit._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: chatToEdit.participant.firstName,
          lastName: chatToEdit.participant.lastName,
        }),
      });
      if (!res.ok) throw new Error("Failed to update chat");
      queryClient.invalidateQueries(["chats", token]);
      setChatToEdit(null);
    } catch (err) {
      console.log("Error updating chat:", err);
    }
  };

  const closeModal = () => {
    setChatToDelete(null);
    setChatToEdit(null);
    setIsModalOpen(false);
  };

  return (
    <div className="chatList">
      <div className="chatForm">
        <div className="chatForm_top">
          <img src="/user.png" alt="user" />
          <ToogleBTN />
        </div>

        <div className="chatForm_search">
          <img src="/search.png" alt="search" />
          <input
            className="chatForm_input"
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {!filteredChats.length && !isModalOpen && (
          <button className="delete" onClick={() => setIsModalOpen(true)}>
            No results found. Create a new chat
          </button>
        )}
      </div>

      <div className="list">
        <h3>Chats</h3>
        {filteredChats.map((chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(new Date(chat.createdAt));

          return (
            <Link
              key={chat._id}
              className="listItem"
              to={`/dashboard/chats/${chat._id}`}
            >
              <div className="userInfo">
                <div className="userData">
                  <span>{chat.participant.firstName}</span>
                  <span>{chat.participant.lastName}</span>
                </div>
                <div className="userTitle">
                  {lastMessage?.text
                    ? lastMessage.text.split(" ").slice(0, 5).join(" ") + " ..."
                    : ""}
                </div>
              </div>

              <div className="created">
                <div>{formattedDate}</div>
                <div
                  className="hidden"
                  onClick={() =>
                    setActiveMenu(activeMenu === chat._id ? null : chat._id)
                  }
                >
                  +
                </div>
              </div>

              {activeMenu === chat._id && (
                <div className="activeMenu" ref={menuRef}>
                  <div
                    onClick={() => {
                      setChatToEdit(chat);
                      setActiveMenu(null);
                    }}
                  >
                    edit user
                  </div>
                  <div
                    onClick={() => {
                      setChatToDelete(chat._id);
                      setActiveMenu(null);
                    }}
                  >
                    remove
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {isModalOpen && (
        <CreateChatModal onClose={closeModal} onSave={handleCreateChat} />
      )}

      {chatToDelete && (
        <div className="modalOverlay">
          <div className="modalChat">
            <p>Are you sure you want to delete this chat?</p>
            <button onClick={() => handleDeleteChat(chatToDelete)}>Yes</button>
            <button onClick={closeModal}>No</button>
          </div>
        </div>
      )}

      {chatToEdit && (
        <div className="modalOverlay">
          <div className="modalChat">
            <h3>Edit user</h3>
            <input
              value={chatToEdit.participant.firstName || ""}
              onChange={(e) =>
                setChatToEdit({
                  ...chatToEdit,
                  participant: {
                    ...chatToEdit.participant,
                    firstName: e.target.value,
                  },
                })
              }
            />
            <input
              value={chatToEdit.participant.lastName || ""}
              onChange={(e) =>
                setChatToEdit({
                  ...chatToEdit,
                  participant: {
                    ...chatToEdit.participant,
                    lastName: e.target.value,
                  },
                })
              }
            />
            <button onClick={handleEditSave}>Save</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;
