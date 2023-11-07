import { useEffect, useState } from "react";
import client, { databases } from "../config/appwriteConfig";
import { ID, Query } from "appwrite";
import { Trash2 } from "react-feather";
import Header from "../components/Header";
import { useAuth } from "../context/authContext";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const MESSAGES_ID = import.meta.env.VITE_APPWRITE_COL_MESSAGES_ID;

export default function Room() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    getMessages();

    const unsubcribe = client.subscribe(
      `databases.${DATABASE_ID}.collections.${MESSAGES_ID}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create",
          )
        ) {
          console.log("A message was created");
          setMessages((prevState) => [response.payload, ...prevState]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete",
          )
        ) {
          console.log("A message was deleted");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id),
          );
        }
      },
    );

    return () => unsubcribe();
  }, []);

  const getMessages = async () => {
    const response = await databases.listDocuments(DATABASE_ID, MESSAGES_ID, [
      Query.orderDesc("$createdAt"),
    ]);
    setMessages(response.documents);
  };

  const createMessage = async (e) => {
    e.preventDefault();
    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };
    await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_COL_MESSAGES_ID,
      ID.unique(),
      payload,
    );
    setMessageBody("");
  };

  const deleteMessage = async (message_id) => {
    await databases.deleteDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      import.meta.env.VITE_APPWRITE_COL_MESSAGES_ID,
      message_id,
    );
  };

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form id="message--form" onSubmit={createMessage}>
          <div>
            <textarea
              required
              maxLength="250"
              placeholder="Say something..."
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              value={messageBody}
            ></textarea>
          </div>

          <div className="send-btn--wrapper">
            <input
              className="btn btn--secondary"
              type="submit"
              onClick={createMessage}
              value="send"
            />
          </div>
        </form>

        <div>
          {messages.map((message) => (
            <div key={message.$id} className={"message--wrapper"}>
              <div className="message--header">
                <p>
                  {message?.username ? (
                    <span> {message?.username}</span>
                  ) : (
                    "Anonymous user"
                  )}

                  <small className="message-timestamp">
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                </p>

                {/* {message.$permissions.includes(
                  `delete(\"user:${user.$id}\")`,
                ) && ( */}
                <Trash2
                  className="delete--btn"
                  onClick={() => {
                    deleteMessage(message.$id);
                  }}
                />
                {/* )} */}
              </div>

              <div
                className={
                  "message--body" +
                  (message.user_id === user.$id ? " message--body--owner" : "")
                }
              >
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
