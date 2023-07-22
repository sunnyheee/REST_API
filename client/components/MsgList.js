import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import MsgInput from "./MagInput";
import MsgItem from "./MsgItem";
import fetcher from "../fetcher";

// const originalMsgs = Array(50)
//   .fill(0)
//   .map((_, i) => ({
//     id: 50 - i,
//     userId: getRandomUserId(),
//     timestamp: 1234567890123 + (50 - i) * 1000 * 60,
//     text: `${50 - i} mock text`,
//   }));

// console.log(JSON.stringify(originalMsgs));

const MsgList = () => {
  const { query } = useRouter();
  const userId = query.userId || query.userid || "";
  // const [msgs, setMsgs] = useState(originalMsgs);

  const [msgs, setMsgs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const onCreate = async (text) => {
    const newMsg = await fetcher("post", "/messages", { text, userId });
    if (!newMsg) throw Error("エラー");
    // const newMsg = {
    //   id: msgs.length + 1,
    //   userId: getRandomUserId(),
    //   timestamp: Date.now(),
    //   text: `${msgs.length + 1} ${text}`,
    // };
    setMsgs((msgs) => [newMsg, ...msgs]);
  };

  const onUpdate = async (text, id) => {
    const newMsg = await fetcher("put", `messages/${id}`, { text, userId });
    if (!newMsg) throw Error("エラー");
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1, {
        ...msgs[targetIndex],
        text,
      });
      return newMsgs;
    });
    doneEdit();
  };

  const onDelete = async (id) => {
    const receivedId = await fetcher("delete", `/messages/${id}`, {
      params: { userId },
    });
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === receivedId + "");
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  const doneEdit = () => setEditingId(null);

  const getMessages = async () => {
    const msgs = await fetcher("get", "/messages");
    setMsgs(msgs);
  };

  useEffect(() => {
    getMessages();
  }, []);

  // useEffect안에서는 async를 사용안하기때문에 별도로 만들어서 입력

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="messages">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onUpdate={onUpdate}
            onDelete={() => onDelete(x.id)}
            startEdit={() => setEditingId(x.id)}
            isEditing={editingId === x.id}
            myId={userId}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
