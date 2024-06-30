import { useState } from "react";

// const initialFriends = [
//   {
//     id: 118836,
//     name: "Clark",
//     image: "https://i.pravatar.cc/48?u=118836",
//     balance: -7,
//   },
//   {
//     id: 933372,
//     name: "Sarah",
//     image: "https://i.pravatar.cc/48?u=933372",
//     balance: 20,
//   },
//   {
//     id: 499476,
//     name: "Anthony",
//     image: "https://i.pravatar.cc/48?u=499476",
//     balance: 0,
//   },
// ];
const initialFriends = [];
export default function App() {
  const [addIsOpen, setAddIsOpen] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [curFriend, setCurFriend] = useState();

  // Add friend
  function handleAddFriend(newFriend) {
    setFriends((friends) => [...friends, newFriend]);
    setAddIsOpen(false);
  }

  // Select friend
  function handleSelectFriend(friend) {
    setCurFriend((cur) => (cur?.id === friend.id ? null : friend));
    setAddIsOpen(false);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          onSelectFriend={handleSelectFriend}
          friends={friends}
          curFriend={curFriend}
        />
        {addIsOpen ? <FormAddFriend onAddFriend={handleAddFriend} /> : null}
        <Button onClick={() => setAddIsOpen(!addIsOpen)}>
          {addIsOpen ? "Close" : "Add freind"}
        </Button>
      </div>
      <div>
        {curFriend && (
          <FormSplitBill
            curFriend={curFriend}
            setFriends={setFriends}
            setCurFriend={setCurFriend}
            key={curFriend.id}
          />
        )}
      </div>
    </div>
  );
}
function Button({ onClick, children }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function FriendsList({ onSelectFriend, friends, curFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          onSelectFriend={onSelectFriend}
          curFriend={curFriend}
          key={friend.id}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, curFriend }) {
  const isSelected = friend.id === curFriend?.id;

  return (
    <li className={isSelected ? "selected" : null}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={(e) => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");

  const [image, setImage] = useState("https://i.pravatar.cc/48?u=499476");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      name,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48?u=499476");
  }

  return (
    <form className="form-add-friend" onSubmit={(e) => handleSubmit(e)}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <label>📷Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      ></input>
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ setFriends, curFriend, setCurFriend }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const [whoToPay, setWhoToPay] = useState("user");

  // Handle submit
  function handleSubmit(e) {
    e.preventDefault();

    if (!bill) return;

    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === curFriend.id
          ? {
              ...friend,
              balance:
                whoToPay === "user"
                  ? friend.balance + (bill - userExpense)
                  : friend.balance - userExpense,
            }
          : friend
      )
    );
    setCurFriend(null);
  }

  return (
    <form className="form-split-bill" onSubmit={(e) => handleSubmit(e)}>
      <h2>Split a bill with {curFriend.name}</h2>
      <label>💰Bill value</label>
      <input
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>
      <label>🧍Your expense</label>
      <input
        value={userExpense}
        onChange={(e) => setUserExpense(Number(e.target.value))}
      ></input>
      <label>🧑‍🤝‍🧑{curFriend.name}'s expense</label>
      <input value={bill - userExpense} disabled></input>
      <label>🤑Who is paying the bill?</label>
      <select value={whoToPay} onChange={(e) => setWhoToPay(e.target.value)}>
        <option value="user">You</option>
        <option value="freind">{curFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
