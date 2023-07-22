import MsgInput from "./MagInput";

const MsgItem = ({
  id,
  userId,
  timestamp,
  text,
  onUpdate,
  isEditing,
  startEdit,
  onDelete,
}) => (
  <li className="messages__item">
    <h3>
      {userId}{" "}
      <sub>
        {new Date(timestamp).toLocaleString("ko-KR", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      </sub>
    </h3>
    {isEditing ? (
      <>
        <MsgInput mutate={onUpdate} id={id} text={text} />
      </>
    ) : (
      text
    )}
    <div className="messages__buttons">
      <button onClick={startEdit}>修正</button>
      <button onClick={onDelete}>削除</button>
    </div>
  </li>
);

export default MsgItem;
