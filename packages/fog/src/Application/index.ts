import { EventEmitter } from 'events';
import { Configuration } from 'webpack';
import { ConfigContextType, createContext } from '../context';
import { loadConfig } from '../utils';
import { getConfig } from '../configuration';
import { buildInCommands } from '../commands';
import { CommandFn, ConfigHookKeys, HookFn, ObjectType } from '../types';

export default class Application extends EventEmitter {
  private context: ConfigContextType;
  public commands: ObjectType<CommandFn>;
  public hooks: Record<ConfigHookKeys, HookFn[]>;
  public configureWebpackList: ((config: Configuration) => Configuration)[];

  constructor() {
    super();
    this.commands = {};
    this.hooks = {
      onAfterCommand: [],
      onCommand: [],
    };
    this.configureWebpackList = [];
    const config = loadConfig(this);
    this.context = createContext({
      env: process.env.NODE_ENV || 'development',
    });
    this.context.app = this;
    this.context.getWebpackConfig = () => getConfig(this.context);
    this.context.userConfig = config;
    this.init();
  }

  public init() {
    this.commands = {
      ...this.commands,
      ...buildInCommands,
    };
    return this;
  }

  async runCommand(name: string, args: ObjectType) {
    this.context.args = args;
    const fn = this.commands[name];
    if (!fn) {
      throw new Error(`Command: ${name} does not exist.`);
    }
    for (const hook of this.hooks.onCommand) {
      await hook(name, this.context);
    }
    await fn(args, this.context);
    for (const hook of this.hooks.onAfterCommand) {
      await hook(name, this.context);
    }
  }
}
