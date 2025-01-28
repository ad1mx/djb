import { CommandConfig, CommandExecute } from "@/src/types/command";

export const config: CommandConfig = {
  description: "xxx",
  args: [
    {
      name: "bbb",
      description: "qwasd",
    },
    {
      name: "xqweas",
      description: "qweeee",
    },
  ],
};

const PingTest: CommandExecute = (client, message, cmdName, args) => {
  console.log(args.keys());
};
