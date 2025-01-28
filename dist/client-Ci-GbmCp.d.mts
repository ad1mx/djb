import { BitFieldResolvable, PermissionsString, OmitPartialGroupDMChannel, Message, Collection, Client as Client$1 } from 'discord.js';

interface CommandArg {
    name: string;
    description: string;
    type?: "string" | "number" | "boolean" | "user";
    required?: boolean;
}
interface CommandConfig {
    description: string;
    args?: CommandArg[];
    /**
     * List of required permissions to execute command
     */
    permissions?: BitFieldResolvable<PermissionsString, number>[];
    /**
     * List of role ID's that are allowed to execute command
     */
    roles?: string[];
    /**
     * If true, Only developer can execute command
     */
    dev?: boolean;
}
type CommandExecute = (client: Client, message: OmitPartialGroupDMChannel<Message>, commandName: string, args: Map<string, string>) => void;
type Command = {
    config: CommandConfig;
    execute: CommandExecute;
};

interface CommandCollection<commandName = string, data = Command> extends Collection<commandName, data> {
}
declare class Client extends Client$1 {
    commands?: CommandCollection;
}
type ClientConfig = {
    prefix: string;
    developerIDs?: string[];
};

export { type CommandCollection as C, Client as a, type ClientConfig as b, type CommandArg as c, type CommandConfig as d, type CommandExecute as e, type Command as f };
