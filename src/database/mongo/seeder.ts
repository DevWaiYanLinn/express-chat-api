import Conversation from "../../model/conversation";
import User from "../../model/user";
import { faker } from "@faker-js/faker";

const seeder = async () => {
  try {
    const randomUsers = faker.helpers.multiple(
      () => {
        return {
          name: faker.internet.userName(),
          email: faker.internet.email(),
          password:
            "$2a$12$80TcaieXQoJKwA0pY1tte.dnbOHyF7wMmxu/lGqWQ.q.p2GzvODkW",
          avatar: `http://192.168.99.139:4000/avatar/${Math.floor(Math.random() * 5) + 1
            }`,
        };
      },
      { count: 10 }
    );
    const users = await User.insertMany(randomUsers);
    let userList = [...users];
    let conversations: any = [];
    users.forEach((user: any, index: number) => {
      userList.splice(0, 1);
      const others = userList.map((m: any) => {
        return { members: [user._id, m._id] };
      });
      conversations = [...conversations, ...others];
    });

    await Conversation.insertMany(conversations);
  } catch (error) {
    console.log(error);
  }
};

export default seeder