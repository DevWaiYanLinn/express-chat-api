import Conversation from "../model/conversation";
import User from "../model/user";

export default async () => {
  const user = await User.insertMany([
    {
      name: "Wai Yan Lin",
      email: "waiyanlin@gmail.com",
      password: "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
    },
    {
      name: "Nyein Thu San",
      email: "nyeinthusan@gmail.com",
      password: "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
    },
  ]);

  await Conversation.insertMany([
    {
      members: [user[0]._id, user[1]._id],
    },
  ]);
};

// try {
//   // seeder()
//   const mongoCollection = await mongoose.connection.db.createCollection(
//     "socket.io-adapter-events",
//     {
//       capped: true,
//       size: 1e6
//     }
//   );
//   await mongoCollection.createIndex(
//     { createdAt: 1 },
//     { expireAfterSeconds: 3600, background: true }
//   );
// } catch (error) {
//   ("b");
// }
