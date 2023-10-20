import Conversation from "../../model/conversation";
import User from "../../model/user";

export default async () => {
  const users = await User.insertMany([
    {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
      avatar: `http://192.168.99.139:4000/avatar/${
        Math.floor(Math.random() * 5) + 1
      }`,
    },
    {
      name: "Jane Smith",
      email: "janesmith@example.com",
      password: "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
      avatar: `http://192.168.99.139:4000/avatar/${
        Math.floor(Math.random() * 5) + 1
      }`,
    },
    {
      name: "Bob Johnson",
      email: "bjohnson@example.com",
      password: "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
      avatar: `http://192.168.99.139:4000/avatar/${
        Math.floor(Math.random() * 5) + 1
      }`,
    },
    {
      name: "Alice Brown",
      email: "alicebrown@example.com",
      password: "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
      avatar: `http://192.168.99.139:4000/avatar/${
        Math.floor(Math.random() * 5) + 1
      }`,
    },
    {
      name: "Charlie Wilson",
      email: "charliewilson@example.com",
      password: "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
      avatar: `http://192.168.99.139:4000/avatar/${
        Math.floor(Math.random() * 5) + 1
      }`,
    },
    {
      name: "Emily Davis",
      email: "emilydavis@example.com",
      password: "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
      avatar: `http://192.168.99.139:4000/avatar/${
        Math.floor(Math.random() * 5) + 1
      }`,
    },
    {
      name: "Frank Miller",
      email: "frankmiller@example.com",
      password: "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
      avatar: `http://192.168.99.139:4000/avatar/${
        Math.floor(Math.random() * 5) + 1
      }`,
    },
    {
      name: "Grace Taylor",
      email: "gracetaylor@example.com",
      password: "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
      avatar: `http://192.168.99.139:4000/avatar/${
        Math.floor(Math.random() * 5) + 1
      }`,
    },
    {
      name: "Henry Clark",
      email: "henryclark@example.com",
      password: "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
      avatar: `http://192.168.99.139:4000/avatar/${
        Math.floor(Math.random() * 5) + 1
      }`,
    },
    {
      name: "Isabella Moore",
      email: "isabellamoore@example.com",
      password: "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
      avatar: `http://192.168.99.139:4000/avatar/${
        Math.floor(Math.random() * 5) + 1
      }`,
    },
  ]);
  let userList = [...users];
  let conversations: any = [];
  users.forEach((user: any, index: number) => {
    userList.splice(index, 1);
    const others = userList.map((m: any) => {
      return { members: [user._id, m._id] };
    });
    conversations = [...conversations, ...others];
  });

  await Conversation.insertMany(conversations);
};
