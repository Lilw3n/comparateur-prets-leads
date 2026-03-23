
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model TierList
 * 
 */
export type TierList = $Result.DefaultSelection<Prisma.$TierListPayload>
/**
 * Model TierListItem
 * 
 */
export type TierListItem = $Result.DefaultSelection<Prisma.$TierListItemPayload>
/**
 * Model TierListVote
 * 
 */
export type TierListVote = $Result.DefaultSelection<Prisma.$TierListVotePayload>
/**
 * Model SiteConfig
 * 
 */
export type SiteConfig = $Result.DefaultSelection<Prisma.$SiteConfigPayload>
/**
 * Model LinkSuggestion
 * 
 */
export type LinkSuggestion = $Result.DefaultSelection<Prisma.$LinkSuggestionPayload>
/**
 * Model MusicPlaylist
 * 
 */
export type MusicPlaylist = $Result.DefaultSelection<Prisma.$MusicPlaylistPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

export type Role = (typeof Role)[keyof typeof Role]


export const TierRank: {
  S: 'S',
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D'
};

export type TierRank = (typeof TierRank)[keyof typeof TierRank]


export const SuggestionStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type SuggestionStatus = (typeof SuggestionStatus)[keyof typeof SuggestionStatus]


export const LinkSuggestionKind: {
  LIST_FULL: 'LIST_FULL',
  LIST_ITEM: 'LIST_ITEM',
  HOME_TEASER: 'HOME_TEASER'
};

export type LinkSuggestionKind = (typeof LinkSuggestionKind)[keyof typeof LinkSuggestionKind]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type TierRank = $Enums.TierRank

export const TierRank: typeof $Enums.TierRank

export type SuggestionStatus = $Enums.SuggestionStatus

export const SuggestionStatus: typeof $Enums.SuggestionStatus

export type LinkSuggestionKind = $Enums.LinkSuggestionKind

export const LinkSuggestionKind: typeof $Enums.LinkSuggestionKind

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tierList`: Exposes CRUD operations for the **TierList** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TierLists
    * const tierLists = await prisma.tierList.findMany()
    * ```
    */
  get tierList(): Prisma.TierListDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tierListItem`: Exposes CRUD operations for the **TierListItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TierListItems
    * const tierListItems = await prisma.tierListItem.findMany()
    * ```
    */
  get tierListItem(): Prisma.TierListItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tierListVote`: Exposes CRUD operations for the **TierListVote** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TierListVotes
    * const tierListVotes = await prisma.tierListVote.findMany()
    * ```
    */
  get tierListVote(): Prisma.TierListVoteDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.siteConfig`: Exposes CRUD operations for the **SiteConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SiteConfigs
    * const siteConfigs = await prisma.siteConfig.findMany()
    * ```
    */
  get siteConfig(): Prisma.SiteConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.linkSuggestion`: Exposes CRUD operations for the **LinkSuggestion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LinkSuggestions
    * const linkSuggestions = await prisma.linkSuggestion.findMany()
    * ```
    */
  get linkSuggestion(): Prisma.LinkSuggestionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.musicPlaylist`: Exposes CRUD operations for the **MusicPlaylist** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more MusicPlaylists
    * const musicPlaylists = await prisma.musicPlaylist.findMany()
    * ```
    */
  get musicPlaylist(): Prisma.MusicPlaylistDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.5.0
   * Query Engine version: 280c870be64f457428992c43c1f6d557fab6e29e
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    TierList: 'TierList',
    TierListItem: 'TierListItem',
    TierListVote: 'TierListVote',
    SiteConfig: 'SiteConfig',
    LinkSuggestion: 'LinkSuggestion',
    MusicPlaylist: 'MusicPlaylist'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "tierList" | "tierListItem" | "tierListVote" | "siteConfig" | "linkSuggestion" | "musicPlaylist"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      TierList: {
        payload: Prisma.$TierListPayload<ExtArgs>
        fields: Prisma.TierListFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TierListFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TierListFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListPayload>
          }
          findFirst: {
            args: Prisma.TierListFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TierListFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListPayload>
          }
          findMany: {
            args: Prisma.TierListFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListPayload>[]
          }
          create: {
            args: Prisma.TierListCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListPayload>
          }
          createMany: {
            args: Prisma.TierListCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TierListCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListPayload>[]
          }
          delete: {
            args: Prisma.TierListDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListPayload>
          }
          update: {
            args: Prisma.TierListUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListPayload>
          }
          deleteMany: {
            args: Prisma.TierListDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TierListUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TierListUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListPayload>[]
          }
          upsert: {
            args: Prisma.TierListUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListPayload>
          }
          aggregate: {
            args: Prisma.TierListAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTierList>
          }
          groupBy: {
            args: Prisma.TierListGroupByArgs<ExtArgs>
            result: $Utils.Optional<TierListGroupByOutputType>[]
          }
          count: {
            args: Prisma.TierListCountArgs<ExtArgs>
            result: $Utils.Optional<TierListCountAggregateOutputType> | number
          }
        }
      }
      TierListItem: {
        payload: Prisma.$TierListItemPayload<ExtArgs>
        fields: Prisma.TierListItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TierListItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TierListItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListItemPayload>
          }
          findFirst: {
            args: Prisma.TierListItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TierListItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListItemPayload>
          }
          findMany: {
            args: Prisma.TierListItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListItemPayload>[]
          }
          create: {
            args: Prisma.TierListItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListItemPayload>
          }
          createMany: {
            args: Prisma.TierListItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TierListItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListItemPayload>[]
          }
          delete: {
            args: Prisma.TierListItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListItemPayload>
          }
          update: {
            args: Prisma.TierListItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListItemPayload>
          }
          deleteMany: {
            args: Prisma.TierListItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TierListItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TierListItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListItemPayload>[]
          }
          upsert: {
            args: Prisma.TierListItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListItemPayload>
          }
          aggregate: {
            args: Prisma.TierListItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTierListItem>
          }
          groupBy: {
            args: Prisma.TierListItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<TierListItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.TierListItemCountArgs<ExtArgs>
            result: $Utils.Optional<TierListItemCountAggregateOutputType> | number
          }
        }
      }
      TierListVote: {
        payload: Prisma.$TierListVotePayload<ExtArgs>
        fields: Prisma.TierListVoteFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TierListVoteFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListVotePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TierListVoteFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListVotePayload>
          }
          findFirst: {
            args: Prisma.TierListVoteFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListVotePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TierListVoteFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListVotePayload>
          }
          findMany: {
            args: Prisma.TierListVoteFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListVotePayload>[]
          }
          create: {
            args: Prisma.TierListVoteCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListVotePayload>
          }
          createMany: {
            args: Prisma.TierListVoteCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TierListVoteCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListVotePayload>[]
          }
          delete: {
            args: Prisma.TierListVoteDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListVotePayload>
          }
          update: {
            args: Prisma.TierListVoteUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListVotePayload>
          }
          deleteMany: {
            args: Prisma.TierListVoteDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TierListVoteUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TierListVoteUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListVotePayload>[]
          }
          upsert: {
            args: Prisma.TierListVoteUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TierListVotePayload>
          }
          aggregate: {
            args: Prisma.TierListVoteAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTierListVote>
          }
          groupBy: {
            args: Prisma.TierListVoteGroupByArgs<ExtArgs>
            result: $Utils.Optional<TierListVoteGroupByOutputType>[]
          }
          count: {
            args: Prisma.TierListVoteCountArgs<ExtArgs>
            result: $Utils.Optional<TierListVoteCountAggregateOutputType> | number
          }
        }
      }
      SiteConfig: {
        payload: Prisma.$SiteConfigPayload<ExtArgs>
        fields: Prisma.SiteConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SiteConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SiteConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteConfigPayload>
          }
          findFirst: {
            args: Prisma.SiteConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SiteConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteConfigPayload>
          }
          findMany: {
            args: Prisma.SiteConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteConfigPayload>[]
          }
          create: {
            args: Prisma.SiteConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteConfigPayload>
          }
          createMany: {
            args: Prisma.SiteConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SiteConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteConfigPayload>[]
          }
          delete: {
            args: Prisma.SiteConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteConfigPayload>
          }
          update: {
            args: Prisma.SiteConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteConfigPayload>
          }
          deleteMany: {
            args: Prisma.SiteConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SiteConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SiteConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteConfigPayload>[]
          }
          upsert: {
            args: Prisma.SiteConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteConfigPayload>
          }
          aggregate: {
            args: Prisma.SiteConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSiteConfig>
          }
          groupBy: {
            args: Prisma.SiteConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<SiteConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.SiteConfigCountArgs<ExtArgs>
            result: $Utils.Optional<SiteConfigCountAggregateOutputType> | number
          }
        }
      }
      LinkSuggestion: {
        payload: Prisma.$LinkSuggestionPayload<ExtArgs>
        fields: Prisma.LinkSuggestionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LinkSuggestionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkSuggestionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LinkSuggestionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkSuggestionPayload>
          }
          findFirst: {
            args: Prisma.LinkSuggestionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkSuggestionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LinkSuggestionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkSuggestionPayload>
          }
          findMany: {
            args: Prisma.LinkSuggestionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkSuggestionPayload>[]
          }
          create: {
            args: Prisma.LinkSuggestionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkSuggestionPayload>
          }
          createMany: {
            args: Prisma.LinkSuggestionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LinkSuggestionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkSuggestionPayload>[]
          }
          delete: {
            args: Prisma.LinkSuggestionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkSuggestionPayload>
          }
          update: {
            args: Prisma.LinkSuggestionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkSuggestionPayload>
          }
          deleteMany: {
            args: Prisma.LinkSuggestionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LinkSuggestionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LinkSuggestionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkSuggestionPayload>[]
          }
          upsert: {
            args: Prisma.LinkSuggestionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkSuggestionPayload>
          }
          aggregate: {
            args: Prisma.LinkSuggestionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLinkSuggestion>
          }
          groupBy: {
            args: Prisma.LinkSuggestionGroupByArgs<ExtArgs>
            result: $Utils.Optional<LinkSuggestionGroupByOutputType>[]
          }
          count: {
            args: Prisma.LinkSuggestionCountArgs<ExtArgs>
            result: $Utils.Optional<LinkSuggestionCountAggregateOutputType> | number
          }
        }
      }
      MusicPlaylist: {
        payload: Prisma.$MusicPlaylistPayload<ExtArgs>
        fields: Prisma.MusicPlaylistFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MusicPlaylistFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPlaylistPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MusicPlaylistFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPlaylistPayload>
          }
          findFirst: {
            args: Prisma.MusicPlaylistFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPlaylistPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MusicPlaylistFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPlaylistPayload>
          }
          findMany: {
            args: Prisma.MusicPlaylistFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPlaylistPayload>[]
          }
          create: {
            args: Prisma.MusicPlaylistCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPlaylistPayload>
          }
          createMany: {
            args: Prisma.MusicPlaylistCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MusicPlaylistCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPlaylistPayload>[]
          }
          delete: {
            args: Prisma.MusicPlaylistDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPlaylistPayload>
          }
          update: {
            args: Prisma.MusicPlaylistUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPlaylistPayload>
          }
          deleteMany: {
            args: Prisma.MusicPlaylistDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MusicPlaylistUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MusicPlaylistUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPlaylistPayload>[]
          }
          upsert: {
            args: Prisma.MusicPlaylistUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MusicPlaylistPayload>
          }
          aggregate: {
            args: Prisma.MusicPlaylistAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMusicPlaylist>
          }
          groupBy: {
            args: Prisma.MusicPlaylistGroupByArgs<ExtArgs>
            result: $Utils.Optional<MusicPlaylistGroupByOutputType>[]
          }
          count: {
            args: Prisma.MusicPlaylistCountArgs<ExtArgs>
            result: $Utils.Optional<MusicPlaylistCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    tierList?: TierListOmit
    tierListItem?: TierListItemOmit
    tierListVote?: TierListVoteOmit
    siteConfig?: SiteConfigOmit
    linkSuggestion?: LinkSuggestionOmit
    musicPlaylist?: MusicPlaylistOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    tierLists: number
    tierVotes: number
    linkSuggestionsSubmitted: number
    linkSuggestionsReviewed: number
    musicPlaylistsCreated: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tierLists?: boolean | UserCountOutputTypeCountTierListsArgs
    tierVotes?: boolean | UserCountOutputTypeCountTierVotesArgs
    linkSuggestionsSubmitted?: boolean | UserCountOutputTypeCountLinkSuggestionsSubmittedArgs
    linkSuggestionsReviewed?: boolean | UserCountOutputTypeCountLinkSuggestionsReviewedArgs
    musicPlaylistsCreated?: boolean | UserCountOutputTypeCountMusicPlaylistsCreatedArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTierListsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TierListWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountTierVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TierListVoteWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLinkSuggestionsSubmittedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinkSuggestionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLinkSuggestionsReviewedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinkSuggestionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMusicPlaylistsCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MusicPlaylistWhereInput
  }


  /**
   * Count Type TierListCountOutputType
   */

  export type TierListCountOutputType = {
    items: number
    votes: number
    linkSuggestions: number
  }

  export type TierListCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    items?: boolean | TierListCountOutputTypeCountItemsArgs
    votes?: boolean | TierListCountOutputTypeCountVotesArgs
    linkSuggestions?: boolean | TierListCountOutputTypeCountLinkSuggestionsArgs
  }

  // Custom InputTypes
  /**
   * TierListCountOutputType without action
   */
  export type TierListCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListCountOutputType
     */
    select?: TierListCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TierListCountOutputType without action
   */
  export type TierListCountOutputTypeCountItemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TierListItemWhereInput
  }

  /**
   * TierListCountOutputType without action
   */
  export type TierListCountOutputTypeCountVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TierListVoteWhereInput
  }

  /**
   * TierListCountOutputType without action
   */
  export type TierListCountOutputTypeCountLinkSuggestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinkSuggestionWhereInput
  }


  /**
   * Count Type TierListItemCountOutputType
   */

  export type TierListItemCountOutputType = {
    linkSuggestions: number
  }

  export type TierListItemCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    linkSuggestions?: boolean | TierListItemCountOutputTypeCountLinkSuggestionsArgs
  }

  // Custom InputTypes
  /**
   * TierListItemCountOutputType without action
   */
  export type TierListItemCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItemCountOutputType
     */
    select?: TierListItemCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TierListItemCountOutputType without action
   */
  export type TierListItemCountOutputTypeCountLinkSuggestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinkSuggestionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    passwordHash: string | null
    role: $Enums.Role | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    passwordHash: number
    role: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    passwordHash?: true
    role?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    passwordHash: string
    role: $Enums.Role
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    tierLists?: boolean | User$tierListsArgs<ExtArgs>
    tierVotes?: boolean | User$tierVotesArgs<ExtArgs>
    linkSuggestionsSubmitted?: boolean | User$linkSuggestionsSubmittedArgs<ExtArgs>
    linkSuggestionsReviewed?: boolean | User$linkSuggestionsReviewedArgs<ExtArgs>
    musicPlaylistsCreated?: boolean | User$musicPlaylistsCreatedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    passwordHash?: boolean
    role?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "passwordHash" | "role" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tierLists?: boolean | User$tierListsArgs<ExtArgs>
    tierVotes?: boolean | User$tierVotesArgs<ExtArgs>
    linkSuggestionsSubmitted?: boolean | User$linkSuggestionsSubmittedArgs<ExtArgs>
    linkSuggestionsReviewed?: boolean | User$linkSuggestionsReviewedArgs<ExtArgs>
    musicPlaylistsCreated?: boolean | User$musicPlaylistsCreatedArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      tierLists: Prisma.$TierListPayload<ExtArgs>[]
      tierVotes: Prisma.$TierListVotePayload<ExtArgs>[]
      linkSuggestionsSubmitted: Prisma.$LinkSuggestionPayload<ExtArgs>[]
      linkSuggestionsReviewed: Prisma.$LinkSuggestionPayload<ExtArgs>[]
      musicPlaylistsCreated: Prisma.$MusicPlaylistPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      passwordHash: string
      role: $Enums.Role
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tierLists<T extends User$tierListsArgs<ExtArgs> = {}>(args?: Subset<T, User$tierListsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tierVotes<T extends User$tierVotesArgs<ExtArgs> = {}>(args?: Subset<T, User$tierVotesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    linkSuggestionsSubmitted<T extends User$linkSuggestionsSubmittedArgs<ExtArgs> = {}>(args?: Subset<T, User$linkSuggestionsSubmittedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    linkSuggestionsReviewed<T extends User$linkSuggestionsReviewedArgs<ExtArgs> = {}>(args?: Subset<T, User$linkSuggestionsReviewedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    musicPlaylistsCreated<T extends User$musicPlaylistsCreatedArgs<ExtArgs> = {}>(args?: Subset<T, User$musicPlaylistsCreatedArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MusicPlaylistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.tierLists
   */
  export type User$tierListsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListInclude<ExtArgs> | null
    where?: TierListWhereInput
    orderBy?: TierListOrderByWithRelationInput | TierListOrderByWithRelationInput[]
    cursor?: TierListWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TierListScalarFieldEnum | TierListScalarFieldEnum[]
  }

  /**
   * User.tierVotes
   */
  export type User$tierVotesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteInclude<ExtArgs> | null
    where?: TierListVoteWhereInput
    orderBy?: TierListVoteOrderByWithRelationInput | TierListVoteOrderByWithRelationInput[]
    cursor?: TierListVoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TierListVoteScalarFieldEnum | TierListVoteScalarFieldEnum[]
  }

  /**
   * User.linkSuggestionsSubmitted
   */
  export type User$linkSuggestionsSubmittedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    where?: LinkSuggestionWhereInput
    orderBy?: LinkSuggestionOrderByWithRelationInput | LinkSuggestionOrderByWithRelationInput[]
    cursor?: LinkSuggestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LinkSuggestionScalarFieldEnum | LinkSuggestionScalarFieldEnum[]
  }

  /**
   * User.linkSuggestionsReviewed
   */
  export type User$linkSuggestionsReviewedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    where?: LinkSuggestionWhereInput
    orderBy?: LinkSuggestionOrderByWithRelationInput | LinkSuggestionOrderByWithRelationInput[]
    cursor?: LinkSuggestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LinkSuggestionScalarFieldEnum | LinkSuggestionScalarFieldEnum[]
  }

  /**
   * User.musicPlaylistsCreated
   */
  export type User$musicPlaylistsCreatedArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistInclude<ExtArgs> | null
    where?: MusicPlaylistWhereInput
    orderBy?: MusicPlaylistOrderByWithRelationInput | MusicPlaylistOrderByWithRelationInput[]
    cursor?: MusicPlaylistWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MusicPlaylistScalarFieldEnum | MusicPlaylistScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model TierList
   */

  export type AggregateTierList = {
    _count: TierListCountAggregateOutputType | null
    _min: TierListMinAggregateOutputType | null
    _max: TierListMaxAggregateOutputType | null
  }

  export type TierListMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    anime: string | null
    category: string | null
    resourceUrl: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TierListMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    anime: string | null
    category: string | null
    resourceUrl: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TierListCountAggregateOutputType = {
    id: number
    title: number
    description: number
    anime: number
    category: number
    resourceUrl: number
    createdById: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TierListMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    anime?: true
    category?: true
    resourceUrl?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TierListMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    anime?: true
    category?: true
    resourceUrl?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TierListCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    anime?: true
    category?: true
    resourceUrl?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TierListAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TierList to aggregate.
     */
    where?: TierListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TierLists to fetch.
     */
    orderBy?: TierListOrderByWithRelationInput | TierListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TierListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TierLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TierLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TierLists
    **/
    _count?: true | TierListCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TierListMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TierListMaxAggregateInputType
  }

  export type GetTierListAggregateType<T extends TierListAggregateArgs> = {
        [P in keyof T & keyof AggregateTierList]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTierList[P]>
      : GetScalarType<T[P], AggregateTierList[P]>
  }




  export type TierListGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TierListWhereInput
    orderBy?: TierListOrderByWithAggregationInput | TierListOrderByWithAggregationInput[]
    by: TierListScalarFieldEnum[] | TierListScalarFieldEnum
    having?: TierListScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TierListCountAggregateInputType | true
    _min?: TierListMinAggregateInputType
    _max?: TierListMaxAggregateInputType
  }

  export type TierListGroupByOutputType = {
    id: string
    title: string
    description: string | null
    anime: string | null
    category: string
    resourceUrl: string | null
    createdById: string
    createdAt: Date
    updatedAt: Date
    _count: TierListCountAggregateOutputType | null
    _min: TierListMinAggregateOutputType | null
    _max: TierListMaxAggregateOutputType | null
  }

  type GetTierListGroupByPayload<T extends TierListGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TierListGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TierListGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TierListGroupByOutputType[P]>
            : GetScalarType<T[P], TierListGroupByOutputType[P]>
        }
      >
    >


  export type TierListSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    anime?: boolean
    category?: boolean
    resourceUrl?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    items?: boolean | TierList$itemsArgs<ExtArgs>
    votes?: boolean | TierList$votesArgs<ExtArgs>
    linkSuggestions?: boolean | TierList$linkSuggestionsArgs<ExtArgs>
    _count?: boolean | TierListCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tierList"]>

  export type TierListSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    anime?: boolean
    category?: boolean
    resourceUrl?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tierList"]>

  export type TierListSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    anime?: boolean
    category?: boolean
    resourceUrl?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tierList"]>

  export type TierListSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    anime?: boolean
    category?: boolean
    resourceUrl?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TierListOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "anime" | "category" | "resourceUrl" | "createdById" | "createdAt" | "updatedAt", ExtArgs["result"]["tierList"]>
  export type TierListInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
    items?: boolean | TierList$itemsArgs<ExtArgs>
    votes?: boolean | TierList$votesArgs<ExtArgs>
    linkSuggestions?: boolean | TierList$linkSuggestionsArgs<ExtArgs>
    _count?: boolean | TierListCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TierListIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TierListIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TierListPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TierList"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs>
      items: Prisma.$TierListItemPayload<ExtArgs>[]
      votes: Prisma.$TierListVotePayload<ExtArgs>[]
      linkSuggestions: Prisma.$LinkSuggestionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      anime: string | null
      category: string
      resourceUrl: string | null
      createdById: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tierList"]>
    composites: {}
  }

  type TierListGetPayload<S extends boolean | null | undefined | TierListDefaultArgs> = $Result.GetResult<Prisma.$TierListPayload, S>

  type TierListCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TierListFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TierListCountAggregateInputType | true
    }

  export interface TierListDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TierList'], meta: { name: 'TierList' } }
    /**
     * Find zero or one TierList that matches the filter.
     * @param {TierListFindUniqueArgs} args - Arguments to find a TierList
     * @example
     * // Get one TierList
     * const tierList = await prisma.tierList.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TierListFindUniqueArgs>(args: SelectSubset<T, TierListFindUniqueArgs<ExtArgs>>): Prisma__TierListClient<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TierList that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TierListFindUniqueOrThrowArgs} args - Arguments to find a TierList
     * @example
     * // Get one TierList
     * const tierList = await prisma.tierList.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TierListFindUniqueOrThrowArgs>(args: SelectSubset<T, TierListFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TierListClient<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TierList that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListFindFirstArgs} args - Arguments to find a TierList
     * @example
     * // Get one TierList
     * const tierList = await prisma.tierList.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TierListFindFirstArgs>(args?: SelectSubset<T, TierListFindFirstArgs<ExtArgs>>): Prisma__TierListClient<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TierList that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListFindFirstOrThrowArgs} args - Arguments to find a TierList
     * @example
     * // Get one TierList
     * const tierList = await prisma.tierList.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TierListFindFirstOrThrowArgs>(args?: SelectSubset<T, TierListFindFirstOrThrowArgs<ExtArgs>>): Prisma__TierListClient<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TierLists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TierLists
     * const tierLists = await prisma.tierList.findMany()
     * 
     * // Get first 10 TierLists
     * const tierLists = await prisma.tierList.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tierListWithIdOnly = await prisma.tierList.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TierListFindManyArgs>(args?: SelectSubset<T, TierListFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TierList.
     * @param {TierListCreateArgs} args - Arguments to create a TierList.
     * @example
     * // Create one TierList
     * const TierList = await prisma.tierList.create({
     *   data: {
     *     // ... data to create a TierList
     *   }
     * })
     * 
     */
    create<T extends TierListCreateArgs>(args: SelectSubset<T, TierListCreateArgs<ExtArgs>>): Prisma__TierListClient<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TierLists.
     * @param {TierListCreateManyArgs} args - Arguments to create many TierLists.
     * @example
     * // Create many TierLists
     * const tierList = await prisma.tierList.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TierListCreateManyArgs>(args?: SelectSubset<T, TierListCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TierLists and returns the data saved in the database.
     * @param {TierListCreateManyAndReturnArgs} args - Arguments to create many TierLists.
     * @example
     * // Create many TierLists
     * const tierList = await prisma.tierList.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TierLists and only return the `id`
     * const tierListWithIdOnly = await prisma.tierList.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TierListCreateManyAndReturnArgs>(args?: SelectSubset<T, TierListCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TierList.
     * @param {TierListDeleteArgs} args - Arguments to delete one TierList.
     * @example
     * // Delete one TierList
     * const TierList = await prisma.tierList.delete({
     *   where: {
     *     // ... filter to delete one TierList
     *   }
     * })
     * 
     */
    delete<T extends TierListDeleteArgs>(args: SelectSubset<T, TierListDeleteArgs<ExtArgs>>): Prisma__TierListClient<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TierList.
     * @param {TierListUpdateArgs} args - Arguments to update one TierList.
     * @example
     * // Update one TierList
     * const tierList = await prisma.tierList.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TierListUpdateArgs>(args: SelectSubset<T, TierListUpdateArgs<ExtArgs>>): Prisma__TierListClient<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TierLists.
     * @param {TierListDeleteManyArgs} args - Arguments to filter TierLists to delete.
     * @example
     * // Delete a few TierLists
     * const { count } = await prisma.tierList.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TierListDeleteManyArgs>(args?: SelectSubset<T, TierListDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TierLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TierLists
     * const tierList = await prisma.tierList.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TierListUpdateManyArgs>(args: SelectSubset<T, TierListUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TierLists and returns the data updated in the database.
     * @param {TierListUpdateManyAndReturnArgs} args - Arguments to update many TierLists.
     * @example
     * // Update many TierLists
     * const tierList = await prisma.tierList.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TierLists and only return the `id`
     * const tierListWithIdOnly = await prisma.tierList.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TierListUpdateManyAndReturnArgs>(args: SelectSubset<T, TierListUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TierList.
     * @param {TierListUpsertArgs} args - Arguments to update or create a TierList.
     * @example
     * // Update or create a TierList
     * const tierList = await prisma.tierList.upsert({
     *   create: {
     *     // ... data to create a TierList
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TierList we want to update
     *   }
     * })
     */
    upsert<T extends TierListUpsertArgs>(args: SelectSubset<T, TierListUpsertArgs<ExtArgs>>): Prisma__TierListClient<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TierLists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListCountArgs} args - Arguments to filter TierLists to count.
     * @example
     * // Count the number of TierLists
     * const count = await prisma.tierList.count({
     *   where: {
     *     // ... the filter for the TierLists we want to count
     *   }
     * })
    **/
    count<T extends TierListCountArgs>(
      args?: Subset<T, TierListCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TierListCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TierList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TierListAggregateArgs>(args: Subset<T, TierListAggregateArgs>): Prisma.PrismaPromise<GetTierListAggregateType<T>>

    /**
     * Group by TierList.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TierListGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TierListGroupByArgs['orderBy'] }
        : { orderBy?: TierListGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TierListGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTierListGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TierList model
   */
  readonly fields: TierListFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TierList.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TierListClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    items<T extends TierList$itemsArgs<ExtArgs> = {}>(args?: Subset<T, TierList$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    votes<T extends TierList$votesArgs<ExtArgs> = {}>(args?: Subset<T, TierList$votesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    linkSuggestions<T extends TierList$linkSuggestionsArgs<ExtArgs> = {}>(args?: Subset<T, TierList$linkSuggestionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TierList model
   */
  interface TierListFieldRefs {
    readonly id: FieldRef<"TierList", 'String'>
    readonly title: FieldRef<"TierList", 'String'>
    readonly description: FieldRef<"TierList", 'String'>
    readonly anime: FieldRef<"TierList", 'String'>
    readonly category: FieldRef<"TierList", 'String'>
    readonly resourceUrl: FieldRef<"TierList", 'String'>
    readonly createdById: FieldRef<"TierList", 'String'>
    readonly createdAt: FieldRef<"TierList", 'DateTime'>
    readonly updatedAt: FieldRef<"TierList", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TierList findUnique
   */
  export type TierListFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListInclude<ExtArgs> | null
    /**
     * Filter, which TierList to fetch.
     */
    where: TierListWhereUniqueInput
  }

  /**
   * TierList findUniqueOrThrow
   */
  export type TierListFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListInclude<ExtArgs> | null
    /**
     * Filter, which TierList to fetch.
     */
    where: TierListWhereUniqueInput
  }

  /**
   * TierList findFirst
   */
  export type TierListFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListInclude<ExtArgs> | null
    /**
     * Filter, which TierList to fetch.
     */
    where?: TierListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TierLists to fetch.
     */
    orderBy?: TierListOrderByWithRelationInput | TierListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TierLists.
     */
    cursor?: TierListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TierLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TierLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TierLists.
     */
    distinct?: TierListScalarFieldEnum | TierListScalarFieldEnum[]
  }

  /**
   * TierList findFirstOrThrow
   */
  export type TierListFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListInclude<ExtArgs> | null
    /**
     * Filter, which TierList to fetch.
     */
    where?: TierListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TierLists to fetch.
     */
    orderBy?: TierListOrderByWithRelationInput | TierListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TierLists.
     */
    cursor?: TierListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TierLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TierLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TierLists.
     */
    distinct?: TierListScalarFieldEnum | TierListScalarFieldEnum[]
  }

  /**
   * TierList findMany
   */
  export type TierListFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListInclude<ExtArgs> | null
    /**
     * Filter, which TierLists to fetch.
     */
    where?: TierListWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TierLists to fetch.
     */
    orderBy?: TierListOrderByWithRelationInput | TierListOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TierLists.
     */
    cursor?: TierListWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TierLists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TierLists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TierLists.
     */
    distinct?: TierListScalarFieldEnum | TierListScalarFieldEnum[]
  }

  /**
   * TierList create
   */
  export type TierListCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListInclude<ExtArgs> | null
    /**
     * The data needed to create a TierList.
     */
    data: XOR<TierListCreateInput, TierListUncheckedCreateInput>
  }

  /**
   * TierList createMany
   */
  export type TierListCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TierLists.
     */
    data: TierListCreateManyInput | TierListCreateManyInput[]
  }

  /**
   * TierList createManyAndReturn
   */
  export type TierListCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * The data used to create many TierLists.
     */
    data: TierListCreateManyInput | TierListCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TierList update
   */
  export type TierListUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListInclude<ExtArgs> | null
    /**
     * The data needed to update a TierList.
     */
    data: XOR<TierListUpdateInput, TierListUncheckedUpdateInput>
    /**
     * Choose, which TierList to update.
     */
    where: TierListWhereUniqueInput
  }

  /**
   * TierList updateMany
   */
  export type TierListUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TierLists.
     */
    data: XOR<TierListUpdateManyMutationInput, TierListUncheckedUpdateManyInput>
    /**
     * Filter which TierLists to update
     */
    where?: TierListWhereInput
    /**
     * Limit how many TierLists to update.
     */
    limit?: number
  }

  /**
   * TierList updateManyAndReturn
   */
  export type TierListUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * The data used to update TierLists.
     */
    data: XOR<TierListUpdateManyMutationInput, TierListUncheckedUpdateManyInput>
    /**
     * Filter which TierLists to update
     */
    where?: TierListWhereInput
    /**
     * Limit how many TierLists to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TierList upsert
   */
  export type TierListUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListInclude<ExtArgs> | null
    /**
     * The filter to search for the TierList to update in case it exists.
     */
    where: TierListWhereUniqueInput
    /**
     * In case the TierList found by the `where` argument doesn't exist, create a new TierList with this data.
     */
    create: XOR<TierListCreateInput, TierListUncheckedCreateInput>
    /**
     * In case the TierList was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TierListUpdateInput, TierListUncheckedUpdateInput>
  }

  /**
   * TierList delete
   */
  export type TierListDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListInclude<ExtArgs> | null
    /**
     * Filter which TierList to delete.
     */
    where: TierListWhereUniqueInput
  }

  /**
   * TierList deleteMany
   */
  export type TierListDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TierLists to delete
     */
    where?: TierListWhereInput
    /**
     * Limit how many TierLists to delete.
     */
    limit?: number
  }

  /**
   * TierList.items
   */
  export type TierList$itemsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemInclude<ExtArgs> | null
    where?: TierListItemWhereInput
    orderBy?: TierListItemOrderByWithRelationInput | TierListItemOrderByWithRelationInput[]
    cursor?: TierListItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TierListItemScalarFieldEnum | TierListItemScalarFieldEnum[]
  }

  /**
   * TierList.votes
   */
  export type TierList$votesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteInclude<ExtArgs> | null
    where?: TierListVoteWhereInput
    orderBy?: TierListVoteOrderByWithRelationInput | TierListVoteOrderByWithRelationInput[]
    cursor?: TierListVoteWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TierListVoteScalarFieldEnum | TierListVoteScalarFieldEnum[]
  }

  /**
   * TierList.linkSuggestions
   */
  export type TierList$linkSuggestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    where?: LinkSuggestionWhereInput
    orderBy?: LinkSuggestionOrderByWithRelationInput | LinkSuggestionOrderByWithRelationInput[]
    cursor?: LinkSuggestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LinkSuggestionScalarFieldEnum | LinkSuggestionScalarFieldEnum[]
  }

  /**
   * TierList without action
   */
  export type TierListDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListInclude<ExtArgs> | null
  }


  /**
   * Model TierListItem
   */

  export type AggregateTierListItem = {
    _count: TierListItemCountAggregateOutputType | null
    _avg: TierListItemAvgAggregateOutputType | null
    _sum: TierListItemSumAggregateOutputType | null
    _min: TierListItemMinAggregateOutputType | null
    _max: TierListItemMaxAggregateOutputType | null
  }

  export type TierListItemAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type TierListItemSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type TierListItemMinAggregateOutputType = {
    id: string | null
    tierListId: string | null
    label: string | null
    rank: $Enums.TierRank | null
    linkUrl: string | null
    sortOrder: number | null
    createdAt: Date | null
  }

  export type TierListItemMaxAggregateOutputType = {
    id: string | null
    tierListId: string | null
    label: string | null
    rank: $Enums.TierRank | null
    linkUrl: string | null
    sortOrder: number | null
    createdAt: Date | null
  }

  export type TierListItemCountAggregateOutputType = {
    id: number
    tierListId: number
    label: number
    rank: number
    linkUrl: number
    sortOrder: number
    createdAt: number
    _all: number
  }


  export type TierListItemAvgAggregateInputType = {
    sortOrder?: true
  }

  export type TierListItemSumAggregateInputType = {
    sortOrder?: true
  }

  export type TierListItemMinAggregateInputType = {
    id?: true
    tierListId?: true
    label?: true
    rank?: true
    linkUrl?: true
    sortOrder?: true
    createdAt?: true
  }

  export type TierListItemMaxAggregateInputType = {
    id?: true
    tierListId?: true
    label?: true
    rank?: true
    linkUrl?: true
    sortOrder?: true
    createdAt?: true
  }

  export type TierListItemCountAggregateInputType = {
    id?: true
    tierListId?: true
    label?: true
    rank?: true
    linkUrl?: true
    sortOrder?: true
    createdAt?: true
    _all?: true
  }

  export type TierListItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TierListItem to aggregate.
     */
    where?: TierListItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TierListItems to fetch.
     */
    orderBy?: TierListItemOrderByWithRelationInput | TierListItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TierListItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TierListItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TierListItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TierListItems
    **/
    _count?: true | TierListItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TierListItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TierListItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TierListItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TierListItemMaxAggregateInputType
  }

  export type GetTierListItemAggregateType<T extends TierListItemAggregateArgs> = {
        [P in keyof T & keyof AggregateTierListItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTierListItem[P]>
      : GetScalarType<T[P], AggregateTierListItem[P]>
  }




  export type TierListItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TierListItemWhereInput
    orderBy?: TierListItemOrderByWithAggregationInput | TierListItemOrderByWithAggregationInput[]
    by: TierListItemScalarFieldEnum[] | TierListItemScalarFieldEnum
    having?: TierListItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TierListItemCountAggregateInputType | true
    _avg?: TierListItemAvgAggregateInputType
    _sum?: TierListItemSumAggregateInputType
    _min?: TierListItemMinAggregateInputType
    _max?: TierListItemMaxAggregateInputType
  }

  export type TierListItemGroupByOutputType = {
    id: string
    tierListId: string
    label: string
    rank: $Enums.TierRank
    linkUrl: string | null
    sortOrder: number
    createdAt: Date
    _count: TierListItemCountAggregateOutputType | null
    _avg: TierListItemAvgAggregateOutputType | null
    _sum: TierListItemSumAggregateOutputType | null
    _min: TierListItemMinAggregateOutputType | null
    _max: TierListItemMaxAggregateOutputType | null
  }

  type GetTierListItemGroupByPayload<T extends TierListItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TierListItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TierListItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TierListItemGroupByOutputType[P]>
            : GetScalarType<T[P], TierListItemGroupByOutputType[P]>
        }
      >
    >


  export type TierListItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tierListId?: boolean
    label?: boolean
    rank?: boolean
    linkUrl?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    tierList?: boolean | TierListDefaultArgs<ExtArgs>
    linkSuggestions?: boolean | TierListItem$linkSuggestionsArgs<ExtArgs>
    _count?: boolean | TierListItemCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tierListItem"]>

  export type TierListItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tierListId?: boolean
    label?: boolean
    rank?: boolean
    linkUrl?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    tierList?: boolean | TierListDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tierListItem"]>

  export type TierListItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tierListId?: boolean
    label?: boolean
    rank?: boolean
    linkUrl?: boolean
    sortOrder?: boolean
    createdAt?: boolean
    tierList?: boolean | TierListDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tierListItem"]>

  export type TierListItemSelectScalar = {
    id?: boolean
    tierListId?: boolean
    label?: boolean
    rank?: boolean
    linkUrl?: boolean
    sortOrder?: boolean
    createdAt?: boolean
  }

  export type TierListItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tierListId" | "label" | "rank" | "linkUrl" | "sortOrder" | "createdAt", ExtArgs["result"]["tierListItem"]>
  export type TierListItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tierList?: boolean | TierListDefaultArgs<ExtArgs>
    linkSuggestions?: boolean | TierListItem$linkSuggestionsArgs<ExtArgs>
    _count?: boolean | TierListItemCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TierListItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tierList?: boolean | TierListDefaultArgs<ExtArgs>
  }
  export type TierListItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tierList?: boolean | TierListDefaultArgs<ExtArgs>
  }

  export type $TierListItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TierListItem"
    objects: {
      tierList: Prisma.$TierListPayload<ExtArgs>
      linkSuggestions: Prisma.$LinkSuggestionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tierListId: string
      label: string
      rank: $Enums.TierRank
      linkUrl: string | null
      sortOrder: number
      createdAt: Date
    }, ExtArgs["result"]["tierListItem"]>
    composites: {}
  }

  type TierListItemGetPayload<S extends boolean | null | undefined | TierListItemDefaultArgs> = $Result.GetResult<Prisma.$TierListItemPayload, S>

  type TierListItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TierListItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TierListItemCountAggregateInputType | true
    }

  export interface TierListItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TierListItem'], meta: { name: 'TierListItem' } }
    /**
     * Find zero or one TierListItem that matches the filter.
     * @param {TierListItemFindUniqueArgs} args - Arguments to find a TierListItem
     * @example
     * // Get one TierListItem
     * const tierListItem = await prisma.tierListItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TierListItemFindUniqueArgs>(args: SelectSubset<T, TierListItemFindUniqueArgs<ExtArgs>>): Prisma__TierListItemClient<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TierListItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TierListItemFindUniqueOrThrowArgs} args - Arguments to find a TierListItem
     * @example
     * // Get one TierListItem
     * const tierListItem = await prisma.tierListItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TierListItemFindUniqueOrThrowArgs>(args: SelectSubset<T, TierListItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TierListItemClient<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TierListItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListItemFindFirstArgs} args - Arguments to find a TierListItem
     * @example
     * // Get one TierListItem
     * const tierListItem = await prisma.tierListItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TierListItemFindFirstArgs>(args?: SelectSubset<T, TierListItemFindFirstArgs<ExtArgs>>): Prisma__TierListItemClient<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TierListItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListItemFindFirstOrThrowArgs} args - Arguments to find a TierListItem
     * @example
     * // Get one TierListItem
     * const tierListItem = await prisma.tierListItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TierListItemFindFirstOrThrowArgs>(args?: SelectSubset<T, TierListItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__TierListItemClient<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TierListItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TierListItems
     * const tierListItems = await prisma.tierListItem.findMany()
     * 
     * // Get first 10 TierListItems
     * const tierListItems = await prisma.tierListItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tierListItemWithIdOnly = await prisma.tierListItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TierListItemFindManyArgs>(args?: SelectSubset<T, TierListItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TierListItem.
     * @param {TierListItemCreateArgs} args - Arguments to create a TierListItem.
     * @example
     * // Create one TierListItem
     * const TierListItem = await prisma.tierListItem.create({
     *   data: {
     *     // ... data to create a TierListItem
     *   }
     * })
     * 
     */
    create<T extends TierListItemCreateArgs>(args: SelectSubset<T, TierListItemCreateArgs<ExtArgs>>): Prisma__TierListItemClient<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TierListItems.
     * @param {TierListItemCreateManyArgs} args - Arguments to create many TierListItems.
     * @example
     * // Create many TierListItems
     * const tierListItem = await prisma.tierListItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TierListItemCreateManyArgs>(args?: SelectSubset<T, TierListItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TierListItems and returns the data saved in the database.
     * @param {TierListItemCreateManyAndReturnArgs} args - Arguments to create many TierListItems.
     * @example
     * // Create many TierListItems
     * const tierListItem = await prisma.tierListItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TierListItems and only return the `id`
     * const tierListItemWithIdOnly = await prisma.tierListItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TierListItemCreateManyAndReturnArgs>(args?: SelectSubset<T, TierListItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TierListItem.
     * @param {TierListItemDeleteArgs} args - Arguments to delete one TierListItem.
     * @example
     * // Delete one TierListItem
     * const TierListItem = await prisma.tierListItem.delete({
     *   where: {
     *     // ... filter to delete one TierListItem
     *   }
     * })
     * 
     */
    delete<T extends TierListItemDeleteArgs>(args: SelectSubset<T, TierListItemDeleteArgs<ExtArgs>>): Prisma__TierListItemClient<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TierListItem.
     * @param {TierListItemUpdateArgs} args - Arguments to update one TierListItem.
     * @example
     * // Update one TierListItem
     * const tierListItem = await prisma.tierListItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TierListItemUpdateArgs>(args: SelectSubset<T, TierListItemUpdateArgs<ExtArgs>>): Prisma__TierListItemClient<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TierListItems.
     * @param {TierListItemDeleteManyArgs} args - Arguments to filter TierListItems to delete.
     * @example
     * // Delete a few TierListItems
     * const { count } = await prisma.tierListItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TierListItemDeleteManyArgs>(args?: SelectSubset<T, TierListItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TierListItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TierListItems
     * const tierListItem = await prisma.tierListItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TierListItemUpdateManyArgs>(args: SelectSubset<T, TierListItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TierListItems and returns the data updated in the database.
     * @param {TierListItemUpdateManyAndReturnArgs} args - Arguments to update many TierListItems.
     * @example
     * // Update many TierListItems
     * const tierListItem = await prisma.tierListItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TierListItems and only return the `id`
     * const tierListItemWithIdOnly = await prisma.tierListItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TierListItemUpdateManyAndReturnArgs>(args: SelectSubset<T, TierListItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TierListItem.
     * @param {TierListItemUpsertArgs} args - Arguments to update or create a TierListItem.
     * @example
     * // Update or create a TierListItem
     * const tierListItem = await prisma.tierListItem.upsert({
     *   create: {
     *     // ... data to create a TierListItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TierListItem we want to update
     *   }
     * })
     */
    upsert<T extends TierListItemUpsertArgs>(args: SelectSubset<T, TierListItemUpsertArgs<ExtArgs>>): Prisma__TierListItemClient<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TierListItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListItemCountArgs} args - Arguments to filter TierListItems to count.
     * @example
     * // Count the number of TierListItems
     * const count = await prisma.tierListItem.count({
     *   where: {
     *     // ... the filter for the TierListItems we want to count
     *   }
     * })
    **/
    count<T extends TierListItemCountArgs>(
      args?: Subset<T, TierListItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TierListItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TierListItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TierListItemAggregateArgs>(args: Subset<T, TierListItemAggregateArgs>): Prisma.PrismaPromise<GetTierListItemAggregateType<T>>

    /**
     * Group by TierListItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TierListItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TierListItemGroupByArgs['orderBy'] }
        : { orderBy?: TierListItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TierListItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTierListItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TierListItem model
   */
  readonly fields: TierListItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TierListItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TierListItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tierList<T extends TierListDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TierListDefaultArgs<ExtArgs>>): Prisma__TierListClient<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    linkSuggestions<T extends TierListItem$linkSuggestionsArgs<ExtArgs> = {}>(args?: Subset<T, TierListItem$linkSuggestionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TierListItem model
   */
  interface TierListItemFieldRefs {
    readonly id: FieldRef<"TierListItem", 'String'>
    readonly tierListId: FieldRef<"TierListItem", 'String'>
    readonly label: FieldRef<"TierListItem", 'String'>
    readonly rank: FieldRef<"TierListItem", 'TierRank'>
    readonly linkUrl: FieldRef<"TierListItem", 'String'>
    readonly sortOrder: FieldRef<"TierListItem", 'Int'>
    readonly createdAt: FieldRef<"TierListItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TierListItem findUnique
   */
  export type TierListItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemInclude<ExtArgs> | null
    /**
     * Filter, which TierListItem to fetch.
     */
    where: TierListItemWhereUniqueInput
  }

  /**
   * TierListItem findUniqueOrThrow
   */
  export type TierListItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemInclude<ExtArgs> | null
    /**
     * Filter, which TierListItem to fetch.
     */
    where: TierListItemWhereUniqueInput
  }

  /**
   * TierListItem findFirst
   */
  export type TierListItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemInclude<ExtArgs> | null
    /**
     * Filter, which TierListItem to fetch.
     */
    where?: TierListItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TierListItems to fetch.
     */
    orderBy?: TierListItemOrderByWithRelationInput | TierListItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TierListItems.
     */
    cursor?: TierListItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TierListItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TierListItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TierListItems.
     */
    distinct?: TierListItemScalarFieldEnum | TierListItemScalarFieldEnum[]
  }

  /**
   * TierListItem findFirstOrThrow
   */
  export type TierListItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemInclude<ExtArgs> | null
    /**
     * Filter, which TierListItem to fetch.
     */
    where?: TierListItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TierListItems to fetch.
     */
    orderBy?: TierListItemOrderByWithRelationInput | TierListItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TierListItems.
     */
    cursor?: TierListItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TierListItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TierListItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TierListItems.
     */
    distinct?: TierListItemScalarFieldEnum | TierListItemScalarFieldEnum[]
  }

  /**
   * TierListItem findMany
   */
  export type TierListItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemInclude<ExtArgs> | null
    /**
     * Filter, which TierListItems to fetch.
     */
    where?: TierListItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TierListItems to fetch.
     */
    orderBy?: TierListItemOrderByWithRelationInput | TierListItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TierListItems.
     */
    cursor?: TierListItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TierListItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TierListItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TierListItems.
     */
    distinct?: TierListItemScalarFieldEnum | TierListItemScalarFieldEnum[]
  }

  /**
   * TierListItem create
   */
  export type TierListItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemInclude<ExtArgs> | null
    /**
     * The data needed to create a TierListItem.
     */
    data: XOR<TierListItemCreateInput, TierListItemUncheckedCreateInput>
  }

  /**
   * TierListItem createMany
   */
  export type TierListItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TierListItems.
     */
    data: TierListItemCreateManyInput | TierListItemCreateManyInput[]
  }

  /**
   * TierListItem createManyAndReturn
   */
  export type TierListItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * The data used to create many TierListItems.
     */
    data: TierListItemCreateManyInput | TierListItemCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TierListItem update
   */
  export type TierListItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemInclude<ExtArgs> | null
    /**
     * The data needed to update a TierListItem.
     */
    data: XOR<TierListItemUpdateInput, TierListItemUncheckedUpdateInput>
    /**
     * Choose, which TierListItem to update.
     */
    where: TierListItemWhereUniqueInput
  }

  /**
   * TierListItem updateMany
   */
  export type TierListItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TierListItems.
     */
    data: XOR<TierListItemUpdateManyMutationInput, TierListItemUncheckedUpdateManyInput>
    /**
     * Filter which TierListItems to update
     */
    where?: TierListItemWhereInput
    /**
     * Limit how many TierListItems to update.
     */
    limit?: number
  }

  /**
   * TierListItem updateManyAndReturn
   */
  export type TierListItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * The data used to update TierListItems.
     */
    data: XOR<TierListItemUpdateManyMutationInput, TierListItemUncheckedUpdateManyInput>
    /**
     * Filter which TierListItems to update
     */
    where?: TierListItemWhereInput
    /**
     * Limit how many TierListItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TierListItem upsert
   */
  export type TierListItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemInclude<ExtArgs> | null
    /**
     * The filter to search for the TierListItem to update in case it exists.
     */
    where: TierListItemWhereUniqueInput
    /**
     * In case the TierListItem found by the `where` argument doesn't exist, create a new TierListItem with this data.
     */
    create: XOR<TierListItemCreateInput, TierListItemUncheckedCreateInput>
    /**
     * In case the TierListItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TierListItemUpdateInput, TierListItemUncheckedUpdateInput>
  }

  /**
   * TierListItem delete
   */
  export type TierListItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemInclude<ExtArgs> | null
    /**
     * Filter which TierListItem to delete.
     */
    where: TierListItemWhereUniqueInput
  }

  /**
   * TierListItem deleteMany
   */
  export type TierListItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TierListItems to delete
     */
    where?: TierListItemWhereInput
    /**
     * Limit how many TierListItems to delete.
     */
    limit?: number
  }

  /**
   * TierListItem.linkSuggestions
   */
  export type TierListItem$linkSuggestionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    where?: LinkSuggestionWhereInput
    orderBy?: LinkSuggestionOrderByWithRelationInput | LinkSuggestionOrderByWithRelationInput[]
    cursor?: LinkSuggestionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LinkSuggestionScalarFieldEnum | LinkSuggestionScalarFieldEnum[]
  }

  /**
   * TierListItem without action
   */
  export type TierListItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemInclude<ExtArgs> | null
  }


  /**
   * Model TierListVote
   */

  export type AggregateTierListVote = {
    _count: TierListVoteCountAggregateOutputType | null
    _avg: TierListVoteAvgAggregateOutputType | null
    _sum: TierListVoteSumAggregateOutputType | null
    _min: TierListVoteMinAggregateOutputType | null
    _max: TierListVoteMaxAggregateOutputType | null
  }

  export type TierListVoteAvgAggregateOutputType = {
    value: number | null
  }

  export type TierListVoteSumAggregateOutputType = {
    value: number | null
  }

  export type TierListVoteMinAggregateOutputType = {
    id: string | null
    tierListId: string | null
    userId: string | null
    value: number | null
    createdAt: Date | null
  }

  export type TierListVoteMaxAggregateOutputType = {
    id: string | null
    tierListId: string | null
    userId: string | null
    value: number | null
    createdAt: Date | null
  }

  export type TierListVoteCountAggregateOutputType = {
    id: number
    tierListId: number
    userId: number
    value: number
    createdAt: number
    _all: number
  }


  export type TierListVoteAvgAggregateInputType = {
    value?: true
  }

  export type TierListVoteSumAggregateInputType = {
    value?: true
  }

  export type TierListVoteMinAggregateInputType = {
    id?: true
    tierListId?: true
    userId?: true
    value?: true
    createdAt?: true
  }

  export type TierListVoteMaxAggregateInputType = {
    id?: true
    tierListId?: true
    userId?: true
    value?: true
    createdAt?: true
  }

  export type TierListVoteCountAggregateInputType = {
    id?: true
    tierListId?: true
    userId?: true
    value?: true
    createdAt?: true
    _all?: true
  }

  export type TierListVoteAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TierListVote to aggregate.
     */
    where?: TierListVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TierListVotes to fetch.
     */
    orderBy?: TierListVoteOrderByWithRelationInput | TierListVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TierListVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TierListVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TierListVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TierListVotes
    **/
    _count?: true | TierListVoteCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TierListVoteAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TierListVoteSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TierListVoteMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TierListVoteMaxAggregateInputType
  }

  export type GetTierListVoteAggregateType<T extends TierListVoteAggregateArgs> = {
        [P in keyof T & keyof AggregateTierListVote]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTierListVote[P]>
      : GetScalarType<T[P], AggregateTierListVote[P]>
  }




  export type TierListVoteGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TierListVoteWhereInput
    orderBy?: TierListVoteOrderByWithAggregationInput | TierListVoteOrderByWithAggregationInput[]
    by: TierListVoteScalarFieldEnum[] | TierListVoteScalarFieldEnum
    having?: TierListVoteScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TierListVoteCountAggregateInputType | true
    _avg?: TierListVoteAvgAggregateInputType
    _sum?: TierListVoteSumAggregateInputType
    _min?: TierListVoteMinAggregateInputType
    _max?: TierListVoteMaxAggregateInputType
  }

  export type TierListVoteGroupByOutputType = {
    id: string
    tierListId: string
    userId: string
    value: number
    createdAt: Date
    _count: TierListVoteCountAggregateOutputType | null
    _avg: TierListVoteAvgAggregateOutputType | null
    _sum: TierListVoteSumAggregateOutputType | null
    _min: TierListVoteMinAggregateOutputType | null
    _max: TierListVoteMaxAggregateOutputType | null
  }

  type GetTierListVoteGroupByPayload<T extends TierListVoteGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TierListVoteGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TierListVoteGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TierListVoteGroupByOutputType[P]>
            : GetScalarType<T[P], TierListVoteGroupByOutputType[P]>
        }
      >
    >


  export type TierListVoteSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tierListId?: boolean
    userId?: boolean
    value?: boolean
    createdAt?: boolean
    tierList?: boolean | TierListDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tierListVote"]>

  export type TierListVoteSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tierListId?: boolean
    userId?: boolean
    value?: boolean
    createdAt?: boolean
    tierList?: boolean | TierListDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tierListVote"]>

  export type TierListVoteSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tierListId?: boolean
    userId?: boolean
    value?: boolean
    createdAt?: boolean
    tierList?: boolean | TierListDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tierListVote"]>

  export type TierListVoteSelectScalar = {
    id?: boolean
    tierListId?: boolean
    userId?: boolean
    value?: boolean
    createdAt?: boolean
  }

  export type TierListVoteOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "tierListId" | "userId" | "value" | "createdAt", ExtArgs["result"]["tierListVote"]>
  export type TierListVoteInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tierList?: boolean | TierListDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TierListVoteIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tierList?: boolean | TierListDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type TierListVoteIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tierList?: boolean | TierListDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $TierListVotePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TierListVote"
    objects: {
      tierList: Prisma.$TierListPayload<ExtArgs>
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tierListId: string
      userId: string
      value: number
      createdAt: Date
    }, ExtArgs["result"]["tierListVote"]>
    composites: {}
  }

  type TierListVoteGetPayload<S extends boolean | null | undefined | TierListVoteDefaultArgs> = $Result.GetResult<Prisma.$TierListVotePayload, S>

  type TierListVoteCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TierListVoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TierListVoteCountAggregateInputType | true
    }

  export interface TierListVoteDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TierListVote'], meta: { name: 'TierListVote' } }
    /**
     * Find zero or one TierListVote that matches the filter.
     * @param {TierListVoteFindUniqueArgs} args - Arguments to find a TierListVote
     * @example
     * // Get one TierListVote
     * const tierListVote = await prisma.tierListVote.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TierListVoteFindUniqueArgs>(args: SelectSubset<T, TierListVoteFindUniqueArgs<ExtArgs>>): Prisma__TierListVoteClient<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TierListVote that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TierListVoteFindUniqueOrThrowArgs} args - Arguments to find a TierListVote
     * @example
     * // Get one TierListVote
     * const tierListVote = await prisma.tierListVote.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TierListVoteFindUniqueOrThrowArgs>(args: SelectSubset<T, TierListVoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TierListVoteClient<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TierListVote that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListVoteFindFirstArgs} args - Arguments to find a TierListVote
     * @example
     * // Get one TierListVote
     * const tierListVote = await prisma.tierListVote.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TierListVoteFindFirstArgs>(args?: SelectSubset<T, TierListVoteFindFirstArgs<ExtArgs>>): Prisma__TierListVoteClient<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TierListVote that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListVoteFindFirstOrThrowArgs} args - Arguments to find a TierListVote
     * @example
     * // Get one TierListVote
     * const tierListVote = await prisma.tierListVote.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TierListVoteFindFirstOrThrowArgs>(args?: SelectSubset<T, TierListVoteFindFirstOrThrowArgs<ExtArgs>>): Prisma__TierListVoteClient<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TierListVotes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListVoteFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TierListVotes
     * const tierListVotes = await prisma.tierListVote.findMany()
     * 
     * // Get first 10 TierListVotes
     * const tierListVotes = await prisma.tierListVote.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tierListVoteWithIdOnly = await prisma.tierListVote.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TierListVoteFindManyArgs>(args?: SelectSubset<T, TierListVoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TierListVote.
     * @param {TierListVoteCreateArgs} args - Arguments to create a TierListVote.
     * @example
     * // Create one TierListVote
     * const TierListVote = await prisma.tierListVote.create({
     *   data: {
     *     // ... data to create a TierListVote
     *   }
     * })
     * 
     */
    create<T extends TierListVoteCreateArgs>(args: SelectSubset<T, TierListVoteCreateArgs<ExtArgs>>): Prisma__TierListVoteClient<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TierListVotes.
     * @param {TierListVoteCreateManyArgs} args - Arguments to create many TierListVotes.
     * @example
     * // Create many TierListVotes
     * const tierListVote = await prisma.tierListVote.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TierListVoteCreateManyArgs>(args?: SelectSubset<T, TierListVoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TierListVotes and returns the data saved in the database.
     * @param {TierListVoteCreateManyAndReturnArgs} args - Arguments to create many TierListVotes.
     * @example
     * // Create many TierListVotes
     * const tierListVote = await prisma.tierListVote.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TierListVotes and only return the `id`
     * const tierListVoteWithIdOnly = await prisma.tierListVote.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TierListVoteCreateManyAndReturnArgs>(args?: SelectSubset<T, TierListVoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TierListVote.
     * @param {TierListVoteDeleteArgs} args - Arguments to delete one TierListVote.
     * @example
     * // Delete one TierListVote
     * const TierListVote = await prisma.tierListVote.delete({
     *   where: {
     *     // ... filter to delete one TierListVote
     *   }
     * })
     * 
     */
    delete<T extends TierListVoteDeleteArgs>(args: SelectSubset<T, TierListVoteDeleteArgs<ExtArgs>>): Prisma__TierListVoteClient<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TierListVote.
     * @param {TierListVoteUpdateArgs} args - Arguments to update one TierListVote.
     * @example
     * // Update one TierListVote
     * const tierListVote = await prisma.tierListVote.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TierListVoteUpdateArgs>(args: SelectSubset<T, TierListVoteUpdateArgs<ExtArgs>>): Prisma__TierListVoteClient<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TierListVotes.
     * @param {TierListVoteDeleteManyArgs} args - Arguments to filter TierListVotes to delete.
     * @example
     * // Delete a few TierListVotes
     * const { count } = await prisma.tierListVote.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TierListVoteDeleteManyArgs>(args?: SelectSubset<T, TierListVoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TierListVotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListVoteUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TierListVotes
     * const tierListVote = await prisma.tierListVote.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TierListVoteUpdateManyArgs>(args: SelectSubset<T, TierListVoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TierListVotes and returns the data updated in the database.
     * @param {TierListVoteUpdateManyAndReturnArgs} args - Arguments to update many TierListVotes.
     * @example
     * // Update many TierListVotes
     * const tierListVote = await prisma.tierListVote.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TierListVotes and only return the `id`
     * const tierListVoteWithIdOnly = await prisma.tierListVote.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TierListVoteUpdateManyAndReturnArgs>(args: SelectSubset<T, TierListVoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TierListVote.
     * @param {TierListVoteUpsertArgs} args - Arguments to update or create a TierListVote.
     * @example
     * // Update or create a TierListVote
     * const tierListVote = await prisma.tierListVote.upsert({
     *   create: {
     *     // ... data to create a TierListVote
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TierListVote we want to update
     *   }
     * })
     */
    upsert<T extends TierListVoteUpsertArgs>(args: SelectSubset<T, TierListVoteUpsertArgs<ExtArgs>>): Prisma__TierListVoteClient<$Result.GetResult<Prisma.$TierListVotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TierListVotes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListVoteCountArgs} args - Arguments to filter TierListVotes to count.
     * @example
     * // Count the number of TierListVotes
     * const count = await prisma.tierListVote.count({
     *   where: {
     *     // ... the filter for the TierListVotes we want to count
     *   }
     * })
    **/
    count<T extends TierListVoteCountArgs>(
      args?: Subset<T, TierListVoteCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TierListVoteCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TierListVote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListVoteAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TierListVoteAggregateArgs>(args: Subset<T, TierListVoteAggregateArgs>): Prisma.PrismaPromise<GetTierListVoteAggregateType<T>>

    /**
     * Group by TierListVote.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TierListVoteGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TierListVoteGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TierListVoteGroupByArgs['orderBy'] }
        : { orderBy?: TierListVoteGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TierListVoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTierListVoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TierListVote model
   */
  readonly fields: TierListVoteFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TierListVote.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TierListVoteClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tierList<T extends TierListDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TierListDefaultArgs<ExtArgs>>): Prisma__TierListClient<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TierListVote model
   */
  interface TierListVoteFieldRefs {
    readonly id: FieldRef<"TierListVote", 'String'>
    readonly tierListId: FieldRef<"TierListVote", 'String'>
    readonly userId: FieldRef<"TierListVote", 'String'>
    readonly value: FieldRef<"TierListVote", 'Int'>
    readonly createdAt: FieldRef<"TierListVote", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TierListVote findUnique
   */
  export type TierListVoteFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteInclude<ExtArgs> | null
    /**
     * Filter, which TierListVote to fetch.
     */
    where: TierListVoteWhereUniqueInput
  }

  /**
   * TierListVote findUniqueOrThrow
   */
  export type TierListVoteFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteInclude<ExtArgs> | null
    /**
     * Filter, which TierListVote to fetch.
     */
    where: TierListVoteWhereUniqueInput
  }

  /**
   * TierListVote findFirst
   */
  export type TierListVoteFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteInclude<ExtArgs> | null
    /**
     * Filter, which TierListVote to fetch.
     */
    where?: TierListVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TierListVotes to fetch.
     */
    orderBy?: TierListVoteOrderByWithRelationInput | TierListVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TierListVotes.
     */
    cursor?: TierListVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TierListVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TierListVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TierListVotes.
     */
    distinct?: TierListVoteScalarFieldEnum | TierListVoteScalarFieldEnum[]
  }

  /**
   * TierListVote findFirstOrThrow
   */
  export type TierListVoteFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteInclude<ExtArgs> | null
    /**
     * Filter, which TierListVote to fetch.
     */
    where?: TierListVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TierListVotes to fetch.
     */
    orderBy?: TierListVoteOrderByWithRelationInput | TierListVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TierListVotes.
     */
    cursor?: TierListVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TierListVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TierListVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TierListVotes.
     */
    distinct?: TierListVoteScalarFieldEnum | TierListVoteScalarFieldEnum[]
  }

  /**
   * TierListVote findMany
   */
  export type TierListVoteFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteInclude<ExtArgs> | null
    /**
     * Filter, which TierListVotes to fetch.
     */
    where?: TierListVoteWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TierListVotes to fetch.
     */
    orderBy?: TierListVoteOrderByWithRelationInput | TierListVoteOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TierListVotes.
     */
    cursor?: TierListVoteWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TierListVotes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TierListVotes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TierListVotes.
     */
    distinct?: TierListVoteScalarFieldEnum | TierListVoteScalarFieldEnum[]
  }

  /**
   * TierListVote create
   */
  export type TierListVoteCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteInclude<ExtArgs> | null
    /**
     * The data needed to create a TierListVote.
     */
    data: XOR<TierListVoteCreateInput, TierListVoteUncheckedCreateInput>
  }

  /**
   * TierListVote createMany
   */
  export type TierListVoteCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TierListVotes.
     */
    data: TierListVoteCreateManyInput | TierListVoteCreateManyInput[]
  }

  /**
   * TierListVote createManyAndReturn
   */
  export type TierListVoteCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * The data used to create many TierListVotes.
     */
    data: TierListVoteCreateManyInput | TierListVoteCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TierListVote update
   */
  export type TierListVoteUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteInclude<ExtArgs> | null
    /**
     * The data needed to update a TierListVote.
     */
    data: XOR<TierListVoteUpdateInput, TierListVoteUncheckedUpdateInput>
    /**
     * Choose, which TierListVote to update.
     */
    where: TierListVoteWhereUniqueInput
  }

  /**
   * TierListVote updateMany
   */
  export type TierListVoteUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TierListVotes.
     */
    data: XOR<TierListVoteUpdateManyMutationInput, TierListVoteUncheckedUpdateManyInput>
    /**
     * Filter which TierListVotes to update
     */
    where?: TierListVoteWhereInput
    /**
     * Limit how many TierListVotes to update.
     */
    limit?: number
  }

  /**
   * TierListVote updateManyAndReturn
   */
  export type TierListVoteUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * The data used to update TierListVotes.
     */
    data: XOR<TierListVoteUpdateManyMutationInput, TierListVoteUncheckedUpdateManyInput>
    /**
     * Filter which TierListVotes to update
     */
    where?: TierListVoteWhereInput
    /**
     * Limit how many TierListVotes to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TierListVote upsert
   */
  export type TierListVoteUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteInclude<ExtArgs> | null
    /**
     * The filter to search for the TierListVote to update in case it exists.
     */
    where: TierListVoteWhereUniqueInput
    /**
     * In case the TierListVote found by the `where` argument doesn't exist, create a new TierListVote with this data.
     */
    create: XOR<TierListVoteCreateInput, TierListVoteUncheckedCreateInput>
    /**
     * In case the TierListVote was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TierListVoteUpdateInput, TierListVoteUncheckedUpdateInput>
  }

  /**
   * TierListVote delete
   */
  export type TierListVoteDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteInclude<ExtArgs> | null
    /**
     * Filter which TierListVote to delete.
     */
    where: TierListVoteWhereUniqueInput
  }

  /**
   * TierListVote deleteMany
   */
  export type TierListVoteDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TierListVotes to delete
     */
    where?: TierListVoteWhereInput
    /**
     * Limit how many TierListVotes to delete.
     */
    limit?: number
  }

  /**
   * TierListVote without action
   */
  export type TierListVoteDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListVote
     */
    select?: TierListVoteSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListVote
     */
    omit?: TierListVoteOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListVoteInclude<ExtArgs> | null
  }


  /**
   * Model SiteConfig
   */

  export type AggregateSiteConfig = {
    _count: SiteConfigCountAggregateOutputType | null
    _avg: SiteConfigAvgAggregateOutputType | null
    _sum: SiteConfigSumAggregateOutputType | null
    _min: SiteConfigMinAggregateOutputType | null
    _max: SiteConfigMaxAggregateOutputType | null
  }

  export type SiteConfigAvgAggregateOutputType = {
    id: number | null
  }

  export type SiteConfigSumAggregateOutputType = {
    id: number | null
  }

  export type SiteConfigMinAggregateOutputType = {
    id: number | null
    liveTvEnabled: boolean | null
    updatedAt: Date | null
  }

  export type SiteConfigMaxAggregateOutputType = {
    id: number | null
    liveTvEnabled: boolean | null
    updatedAt: Date | null
  }

  export type SiteConfigCountAggregateOutputType = {
    id: number
    liveTvEnabled: number
    updatedAt: number
    _all: number
  }


  export type SiteConfigAvgAggregateInputType = {
    id?: true
  }

  export type SiteConfigSumAggregateInputType = {
    id?: true
  }

  export type SiteConfigMinAggregateInputType = {
    id?: true
    liveTvEnabled?: true
    updatedAt?: true
  }

  export type SiteConfigMaxAggregateInputType = {
    id?: true
    liveTvEnabled?: true
    updatedAt?: true
  }

  export type SiteConfigCountAggregateInputType = {
    id?: true
    liveTvEnabled?: true
    updatedAt?: true
    _all?: true
  }

  export type SiteConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SiteConfig to aggregate.
     */
    where?: SiteConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteConfigs to fetch.
     */
    orderBy?: SiteConfigOrderByWithRelationInput | SiteConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SiteConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SiteConfigs
    **/
    _count?: true | SiteConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SiteConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SiteConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SiteConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SiteConfigMaxAggregateInputType
  }

  export type GetSiteConfigAggregateType<T extends SiteConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateSiteConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSiteConfig[P]>
      : GetScalarType<T[P], AggregateSiteConfig[P]>
  }




  export type SiteConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SiteConfigWhereInput
    orderBy?: SiteConfigOrderByWithAggregationInput | SiteConfigOrderByWithAggregationInput[]
    by: SiteConfigScalarFieldEnum[] | SiteConfigScalarFieldEnum
    having?: SiteConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SiteConfigCountAggregateInputType | true
    _avg?: SiteConfigAvgAggregateInputType
    _sum?: SiteConfigSumAggregateInputType
    _min?: SiteConfigMinAggregateInputType
    _max?: SiteConfigMaxAggregateInputType
  }

  export type SiteConfigGroupByOutputType = {
    id: number
    liveTvEnabled: boolean
    updatedAt: Date
    _count: SiteConfigCountAggregateOutputType | null
    _avg: SiteConfigAvgAggregateOutputType | null
    _sum: SiteConfigSumAggregateOutputType | null
    _min: SiteConfigMinAggregateOutputType | null
    _max: SiteConfigMaxAggregateOutputType | null
  }

  type GetSiteConfigGroupByPayload<T extends SiteConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SiteConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SiteConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SiteConfigGroupByOutputType[P]>
            : GetScalarType<T[P], SiteConfigGroupByOutputType[P]>
        }
      >
    >


  export type SiteConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    liveTvEnabled?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["siteConfig"]>

  export type SiteConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    liveTvEnabled?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["siteConfig"]>

  export type SiteConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    liveTvEnabled?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["siteConfig"]>

  export type SiteConfigSelectScalar = {
    id?: boolean
    liveTvEnabled?: boolean
    updatedAt?: boolean
  }

  export type SiteConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "liveTvEnabled" | "updatedAt", ExtArgs["result"]["siteConfig"]>

  export type $SiteConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SiteConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      liveTvEnabled: boolean
      updatedAt: Date
    }, ExtArgs["result"]["siteConfig"]>
    composites: {}
  }

  type SiteConfigGetPayload<S extends boolean | null | undefined | SiteConfigDefaultArgs> = $Result.GetResult<Prisma.$SiteConfigPayload, S>

  type SiteConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SiteConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SiteConfigCountAggregateInputType | true
    }

  export interface SiteConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SiteConfig'], meta: { name: 'SiteConfig' } }
    /**
     * Find zero or one SiteConfig that matches the filter.
     * @param {SiteConfigFindUniqueArgs} args - Arguments to find a SiteConfig
     * @example
     * // Get one SiteConfig
     * const siteConfig = await prisma.siteConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SiteConfigFindUniqueArgs>(args: SelectSubset<T, SiteConfigFindUniqueArgs<ExtArgs>>): Prisma__SiteConfigClient<$Result.GetResult<Prisma.$SiteConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SiteConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SiteConfigFindUniqueOrThrowArgs} args - Arguments to find a SiteConfig
     * @example
     * // Get one SiteConfig
     * const siteConfig = await prisma.siteConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SiteConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, SiteConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SiteConfigClient<$Result.GetResult<Prisma.$SiteConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SiteConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteConfigFindFirstArgs} args - Arguments to find a SiteConfig
     * @example
     * // Get one SiteConfig
     * const siteConfig = await prisma.siteConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SiteConfigFindFirstArgs>(args?: SelectSubset<T, SiteConfigFindFirstArgs<ExtArgs>>): Prisma__SiteConfigClient<$Result.GetResult<Prisma.$SiteConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SiteConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteConfigFindFirstOrThrowArgs} args - Arguments to find a SiteConfig
     * @example
     * // Get one SiteConfig
     * const siteConfig = await prisma.siteConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SiteConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, SiteConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__SiteConfigClient<$Result.GetResult<Prisma.$SiteConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SiteConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SiteConfigs
     * const siteConfigs = await prisma.siteConfig.findMany()
     * 
     * // Get first 10 SiteConfigs
     * const siteConfigs = await prisma.siteConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const siteConfigWithIdOnly = await prisma.siteConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SiteConfigFindManyArgs>(args?: SelectSubset<T, SiteConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiteConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SiteConfig.
     * @param {SiteConfigCreateArgs} args - Arguments to create a SiteConfig.
     * @example
     * // Create one SiteConfig
     * const SiteConfig = await prisma.siteConfig.create({
     *   data: {
     *     // ... data to create a SiteConfig
     *   }
     * })
     * 
     */
    create<T extends SiteConfigCreateArgs>(args: SelectSubset<T, SiteConfigCreateArgs<ExtArgs>>): Prisma__SiteConfigClient<$Result.GetResult<Prisma.$SiteConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SiteConfigs.
     * @param {SiteConfigCreateManyArgs} args - Arguments to create many SiteConfigs.
     * @example
     * // Create many SiteConfigs
     * const siteConfig = await prisma.siteConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SiteConfigCreateManyArgs>(args?: SelectSubset<T, SiteConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SiteConfigs and returns the data saved in the database.
     * @param {SiteConfigCreateManyAndReturnArgs} args - Arguments to create many SiteConfigs.
     * @example
     * // Create many SiteConfigs
     * const siteConfig = await prisma.siteConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SiteConfigs and only return the `id`
     * const siteConfigWithIdOnly = await prisma.siteConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SiteConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, SiteConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiteConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SiteConfig.
     * @param {SiteConfigDeleteArgs} args - Arguments to delete one SiteConfig.
     * @example
     * // Delete one SiteConfig
     * const SiteConfig = await prisma.siteConfig.delete({
     *   where: {
     *     // ... filter to delete one SiteConfig
     *   }
     * })
     * 
     */
    delete<T extends SiteConfigDeleteArgs>(args: SelectSubset<T, SiteConfigDeleteArgs<ExtArgs>>): Prisma__SiteConfigClient<$Result.GetResult<Prisma.$SiteConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SiteConfig.
     * @param {SiteConfigUpdateArgs} args - Arguments to update one SiteConfig.
     * @example
     * // Update one SiteConfig
     * const siteConfig = await prisma.siteConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SiteConfigUpdateArgs>(args: SelectSubset<T, SiteConfigUpdateArgs<ExtArgs>>): Prisma__SiteConfigClient<$Result.GetResult<Prisma.$SiteConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SiteConfigs.
     * @param {SiteConfigDeleteManyArgs} args - Arguments to filter SiteConfigs to delete.
     * @example
     * // Delete a few SiteConfigs
     * const { count } = await prisma.siteConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SiteConfigDeleteManyArgs>(args?: SelectSubset<T, SiteConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SiteConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SiteConfigs
     * const siteConfig = await prisma.siteConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SiteConfigUpdateManyArgs>(args: SelectSubset<T, SiteConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SiteConfigs and returns the data updated in the database.
     * @param {SiteConfigUpdateManyAndReturnArgs} args - Arguments to update many SiteConfigs.
     * @example
     * // Update many SiteConfigs
     * const siteConfig = await prisma.siteConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SiteConfigs and only return the `id`
     * const siteConfigWithIdOnly = await prisma.siteConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SiteConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, SiteConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiteConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SiteConfig.
     * @param {SiteConfigUpsertArgs} args - Arguments to update or create a SiteConfig.
     * @example
     * // Update or create a SiteConfig
     * const siteConfig = await prisma.siteConfig.upsert({
     *   create: {
     *     // ... data to create a SiteConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SiteConfig we want to update
     *   }
     * })
     */
    upsert<T extends SiteConfigUpsertArgs>(args: SelectSubset<T, SiteConfigUpsertArgs<ExtArgs>>): Prisma__SiteConfigClient<$Result.GetResult<Prisma.$SiteConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SiteConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteConfigCountArgs} args - Arguments to filter SiteConfigs to count.
     * @example
     * // Count the number of SiteConfigs
     * const count = await prisma.siteConfig.count({
     *   where: {
     *     // ... the filter for the SiteConfigs we want to count
     *   }
     * })
    **/
    count<T extends SiteConfigCountArgs>(
      args?: Subset<T, SiteConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SiteConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SiteConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SiteConfigAggregateArgs>(args: Subset<T, SiteConfigAggregateArgs>): Prisma.PrismaPromise<GetSiteConfigAggregateType<T>>

    /**
     * Group by SiteConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SiteConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SiteConfigGroupByArgs['orderBy'] }
        : { orderBy?: SiteConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SiteConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSiteConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SiteConfig model
   */
  readonly fields: SiteConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SiteConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SiteConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SiteConfig model
   */
  interface SiteConfigFieldRefs {
    readonly id: FieldRef<"SiteConfig", 'Int'>
    readonly liveTvEnabled: FieldRef<"SiteConfig", 'Boolean'>
    readonly updatedAt: FieldRef<"SiteConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SiteConfig findUnique
   */
  export type SiteConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteConfig
     */
    select?: SiteConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteConfig
     */
    omit?: SiteConfigOmit<ExtArgs> | null
    /**
     * Filter, which SiteConfig to fetch.
     */
    where: SiteConfigWhereUniqueInput
  }

  /**
   * SiteConfig findUniqueOrThrow
   */
  export type SiteConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteConfig
     */
    select?: SiteConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteConfig
     */
    omit?: SiteConfigOmit<ExtArgs> | null
    /**
     * Filter, which SiteConfig to fetch.
     */
    where: SiteConfigWhereUniqueInput
  }

  /**
   * SiteConfig findFirst
   */
  export type SiteConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteConfig
     */
    select?: SiteConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteConfig
     */
    omit?: SiteConfigOmit<ExtArgs> | null
    /**
     * Filter, which SiteConfig to fetch.
     */
    where?: SiteConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteConfigs to fetch.
     */
    orderBy?: SiteConfigOrderByWithRelationInput | SiteConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SiteConfigs.
     */
    cursor?: SiteConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiteConfigs.
     */
    distinct?: SiteConfigScalarFieldEnum | SiteConfigScalarFieldEnum[]
  }

  /**
   * SiteConfig findFirstOrThrow
   */
  export type SiteConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteConfig
     */
    select?: SiteConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteConfig
     */
    omit?: SiteConfigOmit<ExtArgs> | null
    /**
     * Filter, which SiteConfig to fetch.
     */
    where?: SiteConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteConfigs to fetch.
     */
    orderBy?: SiteConfigOrderByWithRelationInput | SiteConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SiteConfigs.
     */
    cursor?: SiteConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiteConfigs.
     */
    distinct?: SiteConfigScalarFieldEnum | SiteConfigScalarFieldEnum[]
  }

  /**
   * SiteConfig findMany
   */
  export type SiteConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteConfig
     */
    select?: SiteConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteConfig
     */
    omit?: SiteConfigOmit<ExtArgs> | null
    /**
     * Filter, which SiteConfigs to fetch.
     */
    where?: SiteConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteConfigs to fetch.
     */
    orderBy?: SiteConfigOrderByWithRelationInput | SiteConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SiteConfigs.
     */
    cursor?: SiteConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiteConfigs.
     */
    distinct?: SiteConfigScalarFieldEnum | SiteConfigScalarFieldEnum[]
  }

  /**
   * SiteConfig create
   */
  export type SiteConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteConfig
     */
    select?: SiteConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteConfig
     */
    omit?: SiteConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a SiteConfig.
     */
    data: XOR<SiteConfigCreateInput, SiteConfigUncheckedCreateInput>
  }

  /**
   * SiteConfig createMany
   */
  export type SiteConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SiteConfigs.
     */
    data: SiteConfigCreateManyInput | SiteConfigCreateManyInput[]
  }

  /**
   * SiteConfig createManyAndReturn
   */
  export type SiteConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteConfig
     */
    select?: SiteConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SiteConfig
     */
    omit?: SiteConfigOmit<ExtArgs> | null
    /**
     * The data used to create many SiteConfigs.
     */
    data: SiteConfigCreateManyInput | SiteConfigCreateManyInput[]
  }

  /**
   * SiteConfig update
   */
  export type SiteConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteConfig
     */
    select?: SiteConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteConfig
     */
    omit?: SiteConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a SiteConfig.
     */
    data: XOR<SiteConfigUpdateInput, SiteConfigUncheckedUpdateInput>
    /**
     * Choose, which SiteConfig to update.
     */
    where: SiteConfigWhereUniqueInput
  }

  /**
   * SiteConfig updateMany
   */
  export type SiteConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SiteConfigs.
     */
    data: XOR<SiteConfigUpdateManyMutationInput, SiteConfigUncheckedUpdateManyInput>
    /**
     * Filter which SiteConfigs to update
     */
    where?: SiteConfigWhereInput
    /**
     * Limit how many SiteConfigs to update.
     */
    limit?: number
  }

  /**
   * SiteConfig updateManyAndReturn
   */
  export type SiteConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteConfig
     */
    select?: SiteConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SiteConfig
     */
    omit?: SiteConfigOmit<ExtArgs> | null
    /**
     * The data used to update SiteConfigs.
     */
    data: XOR<SiteConfigUpdateManyMutationInput, SiteConfigUncheckedUpdateManyInput>
    /**
     * Filter which SiteConfigs to update
     */
    where?: SiteConfigWhereInput
    /**
     * Limit how many SiteConfigs to update.
     */
    limit?: number
  }

  /**
   * SiteConfig upsert
   */
  export type SiteConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteConfig
     */
    select?: SiteConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteConfig
     */
    omit?: SiteConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the SiteConfig to update in case it exists.
     */
    where: SiteConfigWhereUniqueInput
    /**
     * In case the SiteConfig found by the `where` argument doesn't exist, create a new SiteConfig with this data.
     */
    create: XOR<SiteConfigCreateInput, SiteConfigUncheckedCreateInput>
    /**
     * In case the SiteConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SiteConfigUpdateInput, SiteConfigUncheckedUpdateInput>
  }

  /**
   * SiteConfig delete
   */
  export type SiteConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteConfig
     */
    select?: SiteConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteConfig
     */
    omit?: SiteConfigOmit<ExtArgs> | null
    /**
     * Filter which SiteConfig to delete.
     */
    where: SiteConfigWhereUniqueInput
  }

  /**
   * SiteConfig deleteMany
   */
  export type SiteConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SiteConfigs to delete
     */
    where?: SiteConfigWhereInput
    /**
     * Limit how many SiteConfigs to delete.
     */
    limit?: number
  }

  /**
   * SiteConfig without action
   */
  export type SiteConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteConfig
     */
    select?: SiteConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteConfig
     */
    omit?: SiteConfigOmit<ExtArgs> | null
  }


  /**
   * Model LinkSuggestion
   */

  export type AggregateLinkSuggestion = {
    _count: LinkSuggestionCountAggregateOutputType | null
    _min: LinkSuggestionMinAggregateOutputType | null
    _max: LinkSuggestionMaxAggregateOutputType | null
  }

  export type LinkSuggestionMinAggregateOutputType = {
    id: string | null
    kind: $Enums.LinkSuggestionKind | null
    tierListId: string | null
    tierListItemId: string | null
    url: string | null
    title: string | null
    note: string | null
    status: $Enums.SuggestionStatus | null
    submittedById: string | null
    reviewedById: string | null
    reviewedAt: Date | null
    createdAt: Date | null
  }

  export type LinkSuggestionMaxAggregateOutputType = {
    id: string | null
    kind: $Enums.LinkSuggestionKind | null
    tierListId: string | null
    tierListItemId: string | null
    url: string | null
    title: string | null
    note: string | null
    status: $Enums.SuggestionStatus | null
    submittedById: string | null
    reviewedById: string | null
    reviewedAt: Date | null
    createdAt: Date | null
  }

  export type LinkSuggestionCountAggregateOutputType = {
    id: number
    kind: number
    tierListId: number
    tierListItemId: number
    url: number
    title: number
    note: number
    status: number
    submittedById: number
    reviewedById: number
    reviewedAt: number
    createdAt: number
    _all: number
  }


  export type LinkSuggestionMinAggregateInputType = {
    id?: true
    kind?: true
    tierListId?: true
    tierListItemId?: true
    url?: true
    title?: true
    note?: true
    status?: true
    submittedById?: true
    reviewedById?: true
    reviewedAt?: true
    createdAt?: true
  }

  export type LinkSuggestionMaxAggregateInputType = {
    id?: true
    kind?: true
    tierListId?: true
    tierListItemId?: true
    url?: true
    title?: true
    note?: true
    status?: true
    submittedById?: true
    reviewedById?: true
    reviewedAt?: true
    createdAt?: true
  }

  export type LinkSuggestionCountAggregateInputType = {
    id?: true
    kind?: true
    tierListId?: true
    tierListItemId?: true
    url?: true
    title?: true
    note?: true
    status?: true
    submittedById?: true
    reviewedById?: true
    reviewedAt?: true
    createdAt?: true
    _all?: true
  }

  export type LinkSuggestionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LinkSuggestion to aggregate.
     */
    where?: LinkSuggestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkSuggestions to fetch.
     */
    orderBy?: LinkSuggestionOrderByWithRelationInput | LinkSuggestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LinkSuggestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkSuggestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkSuggestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LinkSuggestions
    **/
    _count?: true | LinkSuggestionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LinkSuggestionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LinkSuggestionMaxAggregateInputType
  }

  export type GetLinkSuggestionAggregateType<T extends LinkSuggestionAggregateArgs> = {
        [P in keyof T & keyof AggregateLinkSuggestion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLinkSuggestion[P]>
      : GetScalarType<T[P], AggregateLinkSuggestion[P]>
  }




  export type LinkSuggestionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinkSuggestionWhereInput
    orderBy?: LinkSuggestionOrderByWithAggregationInput | LinkSuggestionOrderByWithAggregationInput[]
    by: LinkSuggestionScalarFieldEnum[] | LinkSuggestionScalarFieldEnum
    having?: LinkSuggestionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LinkSuggestionCountAggregateInputType | true
    _min?: LinkSuggestionMinAggregateInputType
    _max?: LinkSuggestionMaxAggregateInputType
  }

  export type LinkSuggestionGroupByOutputType = {
    id: string
    kind: $Enums.LinkSuggestionKind
    tierListId: string | null
    tierListItemId: string | null
    url: string
    title: string | null
    note: string | null
    status: $Enums.SuggestionStatus
    submittedById: string
    reviewedById: string | null
    reviewedAt: Date | null
    createdAt: Date
    _count: LinkSuggestionCountAggregateOutputType | null
    _min: LinkSuggestionMinAggregateOutputType | null
    _max: LinkSuggestionMaxAggregateOutputType | null
  }

  type GetLinkSuggestionGroupByPayload<T extends LinkSuggestionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LinkSuggestionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LinkSuggestionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LinkSuggestionGroupByOutputType[P]>
            : GetScalarType<T[P], LinkSuggestionGroupByOutputType[P]>
        }
      >
    >


  export type LinkSuggestionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    tierListId?: boolean
    tierListItemId?: boolean
    url?: boolean
    title?: boolean
    note?: boolean
    status?: boolean
    submittedById?: boolean
    reviewedById?: boolean
    reviewedAt?: boolean
    createdAt?: boolean
    tierList?: boolean | LinkSuggestion$tierListArgs<ExtArgs>
    tierListItem?: boolean | LinkSuggestion$tierListItemArgs<ExtArgs>
    submittedBy?: boolean | UserDefaultArgs<ExtArgs>
    reviewedBy?: boolean | LinkSuggestion$reviewedByArgs<ExtArgs>
  }, ExtArgs["result"]["linkSuggestion"]>

  export type LinkSuggestionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    tierListId?: boolean
    tierListItemId?: boolean
    url?: boolean
    title?: boolean
    note?: boolean
    status?: boolean
    submittedById?: boolean
    reviewedById?: boolean
    reviewedAt?: boolean
    createdAt?: boolean
    tierList?: boolean | LinkSuggestion$tierListArgs<ExtArgs>
    tierListItem?: boolean | LinkSuggestion$tierListItemArgs<ExtArgs>
    submittedBy?: boolean | UserDefaultArgs<ExtArgs>
    reviewedBy?: boolean | LinkSuggestion$reviewedByArgs<ExtArgs>
  }, ExtArgs["result"]["linkSuggestion"]>

  export type LinkSuggestionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kind?: boolean
    tierListId?: boolean
    tierListItemId?: boolean
    url?: boolean
    title?: boolean
    note?: boolean
    status?: boolean
    submittedById?: boolean
    reviewedById?: boolean
    reviewedAt?: boolean
    createdAt?: boolean
    tierList?: boolean | LinkSuggestion$tierListArgs<ExtArgs>
    tierListItem?: boolean | LinkSuggestion$tierListItemArgs<ExtArgs>
    submittedBy?: boolean | UserDefaultArgs<ExtArgs>
    reviewedBy?: boolean | LinkSuggestion$reviewedByArgs<ExtArgs>
  }, ExtArgs["result"]["linkSuggestion"]>

  export type LinkSuggestionSelectScalar = {
    id?: boolean
    kind?: boolean
    tierListId?: boolean
    tierListItemId?: boolean
    url?: boolean
    title?: boolean
    note?: boolean
    status?: boolean
    submittedById?: boolean
    reviewedById?: boolean
    reviewedAt?: boolean
    createdAt?: boolean
  }

  export type LinkSuggestionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kind" | "tierListId" | "tierListItemId" | "url" | "title" | "note" | "status" | "submittedById" | "reviewedById" | "reviewedAt" | "createdAt", ExtArgs["result"]["linkSuggestion"]>
  export type LinkSuggestionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tierList?: boolean | LinkSuggestion$tierListArgs<ExtArgs>
    tierListItem?: boolean | LinkSuggestion$tierListItemArgs<ExtArgs>
    submittedBy?: boolean | UserDefaultArgs<ExtArgs>
    reviewedBy?: boolean | LinkSuggestion$reviewedByArgs<ExtArgs>
  }
  export type LinkSuggestionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tierList?: boolean | LinkSuggestion$tierListArgs<ExtArgs>
    tierListItem?: boolean | LinkSuggestion$tierListItemArgs<ExtArgs>
    submittedBy?: boolean | UserDefaultArgs<ExtArgs>
    reviewedBy?: boolean | LinkSuggestion$reviewedByArgs<ExtArgs>
  }
  export type LinkSuggestionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tierList?: boolean | LinkSuggestion$tierListArgs<ExtArgs>
    tierListItem?: boolean | LinkSuggestion$tierListItemArgs<ExtArgs>
    submittedBy?: boolean | UserDefaultArgs<ExtArgs>
    reviewedBy?: boolean | LinkSuggestion$reviewedByArgs<ExtArgs>
  }

  export type $LinkSuggestionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LinkSuggestion"
    objects: {
      tierList: Prisma.$TierListPayload<ExtArgs> | null
      tierListItem: Prisma.$TierListItemPayload<ExtArgs> | null
      submittedBy: Prisma.$UserPayload<ExtArgs>
      reviewedBy: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kind: $Enums.LinkSuggestionKind
      tierListId: string | null
      tierListItemId: string | null
      url: string
      title: string | null
      note: string | null
      status: $Enums.SuggestionStatus
      submittedById: string
      reviewedById: string | null
      reviewedAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["linkSuggestion"]>
    composites: {}
  }

  type LinkSuggestionGetPayload<S extends boolean | null | undefined | LinkSuggestionDefaultArgs> = $Result.GetResult<Prisma.$LinkSuggestionPayload, S>

  type LinkSuggestionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LinkSuggestionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LinkSuggestionCountAggregateInputType | true
    }

  export interface LinkSuggestionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LinkSuggestion'], meta: { name: 'LinkSuggestion' } }
    /**
     * Find zero or one LinkSuggestion that matches the filter.
     * @param {LinkSuggestionFindUniqueArgs} args - Arguments to find a LinkSuggestion
     * @example
     * // Get one LinkSuggestion
     * const linkSuggestion = await prisma.linkSuggestion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LinkSuggestionFindUniqueArgs>(args: SelectSubset<T, LinkSuggestionFindUniqueArgs<ExtArgs>>): Prisma__LinkSuggestionClient<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LinkSuggestion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LinkSuggestionFindUniqueOrThrowArgs} args - Arguments to find a LinkSuggestion
     * @example
     * // Get one LinkSuggestion
     * const linkSuggestion = await prisma.linkSuggestion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LinkSuggestionFindUniqueOrThrowArgs>(args: SelectSubset<T, LinkSuggestionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LinkSuggestionClient<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LinkSuggestion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkSuggestionFindFirstArgs} args - Arguments to find a LinkSuggestion
     * @example
     * // Get one LinkSuggestion
     * const linkSuggestion = await prisma.linkSuggestion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LinkSuggestionFindFirstArgs>(args?: SelectSubset<T, LinkSuggestionFindFirstArgs<ExtArgs>>): Prisma__LinkSuggestionClient<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LinkSuggestion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkSuggestionFindFirstOrThrowArgs} args - Arguments to find a LinkSuggestion
     * @example
     * // Get one LinkSuggestion
     * const linkSuggestion = await prisma.linkSuggestion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LinkSuggestionFindFirstOrThrowArgs>(args?: SelectSubset<T, LinkSuggestionFindFirstOrThrowArgs<ExtArgs>>): Prisma__LinkSuggestionClient<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LinkSuggestions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkSuggestionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LinkSuggestions
     * const linkSuggestions = await prisma.linkSuggestion.findMany()
     * 
     * // Get first 10 LinkSuggestions
     * const linkSuggestions = await prisma.linkSuggestion.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const linkSuggestionWithIdOnly = await prisma.linkSuggestion.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LinkSuggestionFindManyArgs>(args?: SelectSubset<T, LinkSuggestionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LinkSuggestion.
     * @param {LinkSuggestionCreateArgs} args - Arguments to create a LinkSuggestion.
     * @example
     * // Create one LinkSuggestion
     * const LinkSuggestion = await prisma.linkSuggestion.create({
     *   data: {
     *     // ... data to create a LinkSuggestion
     *   }
     * })
     * 
     */
    create<T extends LinkSuggestionCreateArgs>(args: SelectSubset<T, LinkSuggestionCreateArgs<ExtArgs>>): Prisma__LinkSuggestionClient<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LinkSuggestions.
     * @param {LinkSuggestionCreateManyArgs} args - Arguments to create many LinkSuggestions.
     * @example
     * // Create many LinkSuggestions
     * const linkSuggestion = await prisma.linkSuggestion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LinkSuggestionCreateManyArgs>(args?: SelectSubset<T, LinkSuggestionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LinkSuggestions and returns the data saved in the database.
     * @param {LinkSuggestionCreateManyAndReturnArgs} args - Arguments to create many LinkSuggestions.
     * @example
     * // Create many LinkSuggestions
     * const linkSuggestion = await prisma.linkSuggestion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LinkSuggestions and only return the `id`
     * const linkSuggestionWithIdOnly = await prisma.linkSuggestion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LinkSuggestionCreateManyAndReturnArgs>(args?: SelectSubset<T, LinkSuggestionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LinkSuggestion.
     * @param {LinkSuggestionDeleteArgs} args - Arguments to delete one LinkSuggestion.
     * @example
     * // Delete one LinkSuggestion
     * const LinkSuggestion = await prisma.linkSuggestion.delete({
     *   where: {
     *     // ... filter to delete one LinkSuggestion
     *   }
     * })
     * 
     */
    delete<T extends LinkSuggestionDeleteArgs>(args: SelectSubset<T, LinkSuggestionDeleteArgs<ExtArgs>>): Prisma__LinkSuggestionClient<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LinkSuggestion.
     * @param {LinkSuggestionUpdateArgs} args - Arguments to update one LinkSuggestion.
     * @example
     * // Update one LinkSuggestion
     * const linkSuggestion = await prisma.linkSuggestion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LinkSuggestionUpdateArgs>(args: SelectSubset<T, LinkSuggestionUpdateArgs<ExtArgs>>): Prisma__LinkSuggestionClient<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LinkSuggestions.
     * @param {LinkSuggestionDeleteManyArgs} args - Arguments to filter LinkSuggestions to delete.
     * @example
     * // Delete a few LinkSuggestions
     * const { count } = await prisma.linkSuggestion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LinkSuggestionDeleteManyArgs>(args?: SelectSubset<T, LinkSuggestionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LinkSuggestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkSuggestionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LinkSuggestions
     * const linkSuggestion = await prisma.linkSuggestion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LinkSuggestionUpdateManyArgs>(args: SelectSubset<T, LinkSuggestionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LinkSuggestions and returns the data updated in the database.
     * @param {LinkSuggestionUpdateManyAndReturnArgs} args - Arguments to update many LinkSuggestions.
     * @example
     * // Update many LinkSuggestions
     * const linkSuggestion = await prisma.linkSuggestion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LinkSuggestions and only return the `id`
     * const linkSuggestionWithIdOnly = await prisma.linkSuggestion.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LinkSuggestionUpdateManyAndReturnArgs>(args: SelectSubset<T, LinkSuggestionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LinkSuggestion.
     * @param {LinkSuggestionUpsertArgs} args - Arguments to update or create a LinkSuggestion.
     * @example
     * // Update or create a LinkSuggestion
     * const linkSuggestion = await prisma.linkSuggestion.upsert({
     *   create: {
     *     // ... data to create a LinkSuggestion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LinkSuggestion we want to update
     *   }
     * })
     */
    upsert<T extends LinkSuggestionUpsertArgs>(args: SelectSubset<T, LinkSuggestionUpsertArgs<ExtArgs>>): Prisma__LinkSuggestionClient<$Result.GetResult<Prisma.$LinkSuggestionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LinkSuggestions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkSuggestionCountArgs} args - Arguments to filter LinkSuggestions to count.
     * @example
     * // Count the number of LinkSuggestions
     * const count = await prisma.linkSuggestion.count({
     *   where: {
     *     // ... the filter for the LinkSuggestions we want to count
     *   }
     * })
    **/
    count<T extends LinkSuggestionCountArgs>(
      args?: Subset<T, LinkSuggestionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LinkSuggestionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LinkSuggestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkSuggestionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LinkSuggestionAggregateArgs>(args: Subset<T, LinkSuggestionAggregateArgs>): Prisma.PrismaPromise<GetLinkSuggestionAggregateType<T>>

    /**
     * Group by LinkSuggestion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkSuggestionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LinkSuggestionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LinkSuggestionGroupByArgs['orderBy'] }
        : { orderBy?: LinkSuggestionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LinkSuggestionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLinkSuggestionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LinkSuggestion model
   */
  readonly fields: LinkSuggestionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LinkSuggestion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LinkSuggestionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tierList<T extends LinkSuggestion$tierListArgs<ExtArgs> = {}>(args?: Subset<T, LinkSuggestion$tierListArgs<ExtArgs>>): Prisma__TierListClient<$Result.GetResult<Prisma.$TierListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    tierListItem<T extends LinkSuggestion$tierListItemArgs<ExtArgs> = {}>(args?: Subset<T, LinkSuggestion$tierListItemArgs<ExtArgs>>): Prisma__TierListItemClient<$Result.GetResult<Prisma.$TierListItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    submittedBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reviewedBy<T extends LinkSuggestion$reviewedByArgs<ExtArgs> = {}>(args?: Subset<T, LinkSuggestion$reviewedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LinkSuggestion model
   */
  interface LinkSuggestionFieldRefs {
    readonly id: FieldRef<"LinkSuggestion", 'String'>
    readonly kind: FieldRef<"LinkSuggestion", 'LinkSuggestionKind'>
    readonly tierListId: FieldRef<"LinkSuggestion", 'String'>
    readonly tierListItemId: FieldRef<"LinkSuggestion", 'String'>
    readonly url: FieldRef<"LinkSuggestion", 'String'>
    readonly title: FieldRef<"LinkSuggestion", 'String'>
    readonly note: FieldRef<"LinkSuggestion", 'String'>
    readonly status: FieldRef<"LinkSuggestion", 'SuggestionStatus'>
    readonly submittedById: FieldRef<"LinkSuggestion", 'String'>
    readonly reviewedById: FieldRef<"LinkSuggestion", 'String'>
    readonly reviewedAt: FieldRef<"LinkSuggestion", 'DateTime'>
    readonly createdAt: FieldRef<"LinkSuggestion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LinkSuggestion findUnique
   */
  export type LinkSuggestionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    /**
     * Filter, which LinkSuggestion to fetch.
     */
    where: LinkSuggestionWhereUniqueInput
  }

  /**
   * LinkSuggestion findUniqueOrThrow
   */
  export type LinkSuggestionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    /**
     * Filter, which LinkSuggestion to fetch.
     */
    where: LinkSuggestionWhereUniqueInput
  }

  /**
   * LinkSuggestion findFirst
   */
  export type LinkSuggestionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    /**
     * Filter, which LinkSuggestion to fetch.
     */
    where?: LinkSuggestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkSuggestions to fetch.
     */
    orderBy?: LinkSuggestionOrderByWithRelationInput | LinkSuggestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LinkSuggestions.
     */
    cursor?: LinkSuggestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkSuggestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkSuggestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LinkSuggestions.
     */
    distinct?: LinkSuggestionScalarFieldEnum | LinkSuggestionScalarFieldEnum[]
  }

  /**
   * LinkSuggestion findFirstOrThrow
   */
  export type LinkSuggestionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    /**
     * Filter, which LinkSuggestion to fetch.
     */
    where?: LinkSuggestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkSuggestions to fetch.
     */
    orderBy?: LinkSuggestionOrderByWithRelationInput | LinkSuggestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LinkSuggestions.
     */
    cursor?: LinkSuggestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkSuggestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkSuggestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LinkSuggestions.
     */
    distinct?: LinkSuggestionScalarFieldEnum | LinkSuggestionScalarFieldEnum[]
  }

  /**
   * LinkSuggestion findMany
   */
  export type LinkSuggestionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    /**
     * Filter, which LinkSuggestions to fetch.
     */
    where?: LinkSuggestionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkSuggestions to fetch.
     */
    orderBy?: LinkSuggestionOrderByWithRelationInput | LinkSuggestionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LinkSuggestions.
     */
    cursor?: LinkSuggestionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkSuggestions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkSuggestions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LinkSuggestions.
     */
    distinct?: LinkSuggestionScalarFieldEnum | LinkSuggestionScalarFieldEnum[]
  }

  /**
   * LinkSuggestion create
   */
  export type LinkSuggestionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    /**
     * The data needed to create a LinkSuggestion.
     */
    data: XOR<LinkSuggestionCreateInput, LinkSuggestionUncheckedCreateInput>
  }

  /**
   * LinkSuggestion createMany
   */
  export type LinkSuggestionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LinkSuggestions.
     */
    data: LinkSuggestionCreateManyInput | LinkSuggestionCreateManyInput[]
  }

  /**
   * LinkSuggestion createManyAndReturn
   */
  export type LinkSuggestionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * The data used to create many LinkSuggestions.
     */
    data: LinkSuggestionCreateManyInput | LinkSuggestionCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LinkSuggestion update
   */
  export type LinkSuggestionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    /**
     * The data needed to update a LinkSuggestion.
     */
    data: XOR<LinkSuggestionUpdateInput, LinkSuggestionUncheckedUpdateInput>
    /**
     * Choose, which LinkSuggestion to update.
     */
    where: LinkSuggestionWhereUniqueInput
  }

  /**
   * LinkSuggestion updateMany
   */
  export type LinkSuggestionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LinkSuggestions.
     */
    data: XOR<LinkSuggestionUpdateManyMutationInput, LinkSuggestionUncheckedUpdateManyInput>
    /**
     * Filter which LinkSuggestions to update
     */
    where?: LinkSuggestionWhereInput
    /**
     * Limit how many LinkSuggestions to update.
     */
    limit?: number
  }

  /**
   * LinkSuggestion updateManyAndReturn
   */
  export type LinkSuggestionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * The data used to update LinkSuggestions.
     */
    data: XOR<LinkSuggestionUpdateManyMutationInput, LinkSuggestionUncheckedUpdateManyInput>
    /**
     * Filter which LinkSuggestions to update
     */
    where?: LinkSuggestionWhereInput
    /**
     * Limit how many LinkSuggestions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LinkSuggestion upsert
   */
  export type LinkSuggestionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    /**
     * The filter to search for the LinkSuggestion to update in case it exists.
     */
    where: LinkSuggestionWhereUniqueInput
    /**
     * In case the LinkSuggestion found by the `where` argument doesn't exist, create a new LinkSuggestion with this data.
     */
    create: XOR<LinkSuggestionCreateInput, LinkSuggestionUncheckedCreateInput>
    /**
     * In case the LinkSuggestion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LinkSuggestionUpdateInput, LinkSuggestionUncheckedUpdateInput>
  }

  /**
   * LinkSuggestion delete
   */
  export type LinkSuggestionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
    /**
     * Filter which LinkSuggestion to delete.
     */
    where: LinkSuggestionWhereUniqueInput
  }

  /**
   * LinkSuggestion deleteMany
   */
  export type LinkSuggestionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LinkSuggestions to delete
     */
    where?: LinkSuggestionWhereInput
    /**
     * Limit how many LinkSuggestions to delete.
     */
    limit?: number
  }

  /**
   * LinkSuggestion.tierList
   */
  export type LinkSuggestion$tierListArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierList
     */
    select?: TierListSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierList
     */
    omit?: TierListOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListInclude<ExtArgs> | null
    where?: TierListWhereInput
  }

  /**
   * LinkSuggestion.tierListItem
   */
  export type LinkSuggestion$tierListItemArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TierListItem
     */
    select?: TierListItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TierListItem
     */
    omit?: TierListItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TierListItemInclude<ExtArgs> | null
    where?: TierListItemWhereInput
  }

  /**
   * LinkSuggestion.reviewedBy
   */
  export type LinkSuggestion$reviewedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * LinkSuggestion without action
   */
  export type LinkSuggestionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkSuggestion
     */
    select?: LinkSuggestionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkSuggestion
     */
    omit?: LinkSuggestionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkSuggestionInclude<ExtArgs> | null
  }


  /**
   * Model MusicPlaylist
   */

  export type AggregateMusicPlaylist = {
    _count: MusicPlaylistCountAggregateOutputType | null
    _min: MusicPlaylistMinAggregateOutputType | null
    _max: MusicPlaylistMaxAggregateOutputType | null
  }

  export type MusicPlaylistMinAggregateOutputType = {
    id: string | null
    label: string | null
    url: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MusicPlaylistMaxAggregateOutputType = {
    id: string | null
    label: string | null
    url: string | null
    createdById: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MusicPlaylistCountAggregateOutputType = {
    id: number
    label: number
    url: number
    createdById: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MusicPlaylistMinAggregateInputType = {
    id?: true
    label?: true
    url?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MusicPlaylistMaxAggregateInputType = {
    id?: true
    label?: true
    url?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MusicPlaylistCountAggregateInputType = {
    id?: true
    label?: true
    url?: true
    createdById?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MusicPlaylistAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MusicPlaylist to aggregate.
     */
    where?: MusicPlaylistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MusicPlaylists to fetch.
     */
    orderBy?: MusicPlaylistOrderByWithRelationInput | MusicPlaylistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MusicPlaylistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MusicPlaylists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MusicPlaylists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned MusicPlaylists
    **/
    _count?: true | MusicPlaylistCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MusicPlaylistMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MusicPlaylistMaxAggregateInputType
  }

  export type GetMusicPlaylistAggregateType<T extends MusicPlaylistAggregateArgs> = {
        [P in keyof T & keyof AggregateMusicPlaylist]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMusicPlaylist[P]>
      : GetScalarType<T[P], AggregateMusicPlaylist[P]>
  }




  export type MusicPlaylistGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MusicPlaylistWhereInput
    orderBy?: MusicPlaylistOrderByWithAggregationInput | MusicPlaylistOrderByWithAggregationInput[]
    by: MusicPlaylistScalarFieldEnum[] | MusicPlaylistScalarFieldEnum
    having?: MusicPlaylistScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MusicPlaylistCountAggregateInputType | true
    _min?: MusicPlaylistMinAggregateInputType
    _max?: MusicPlaylistMaxAggregateInputType
  }

  export type MusicPlaylistGroupByOutputType = {
    id: string
    label: string
    url: string
    createdById: string
    createdAt: Date
    updatedAt: Date
    _count: MusicPlaylistCountAggregateOutputType | null
    _min: MusicPlaylistMinAggregateOutputType | null
    _max: MusicPlaylistMaxAggregateOutputType | null
  }

  type GetMusicPlaylistGroupByPayload<T extends MusicPlaylistGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MusicPlaylistGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MusicPlaylistGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MusicPlaylistGroupByOutputType[P]>
            : GetScalarType<T[P], MusicPlaylistGroupByOutputType[P]>
        }
      >
    >


  export type MusicPlaylistSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    url?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["musicPlaylist"]>

  export type MusicPlaylistSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    url?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["musicPlaylist"]>

  export type MusicPlaylistSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    label?: boolean
    url?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["musicPlaylist"]>

  export type MusicPlaylistSelectScalar = {
    id?: boolean
    label?: boolean
    url?: boolean
    createdById?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MusicPlaylistOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "label" | "url" | "createdById" | "createdAt" | "updatedAt", ExtArgs["result"]["musicPlaylist"]>
  export type MusicPlaylistInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MusicPlaylistIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MusicPlaylistIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    createdBy?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MusicPlaylistPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "MusicPlaylist"
    objects: {
      createdBy: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      label: string
      url: string
      createdById: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["musicPlaylist"]>
    composites: {}
  }

  type MusicPlaylistGetPayload<S extends boolean | null | undefined | MusicPlaylistDefaultArgs> = $Result.GetResult<Prisma.$MusicPlaylistPayload, S>

  type MusicPlaylistCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MusicPlaylistFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MusicPlaylistCountAggregateInputType | true
    }

  export interface MusicPlaylistDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['MusicPlaylist'], meta: { name: 'MusicPlaylist' } }
    /**
     * Find zero or one MusicPlaylist that matches the filter.
     * @param {MusicPlaylistFindUniqueArgs} args - Arguments to find a MusicPlaylist
     * @example
     * // Get one MusicPlaylist
     * const musicPlaylist = await prisma.musicPlaylist.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MusicPlaylistFindUniqueArgs>(args: SelectSubset<T, MusicPlaylistFindUniqueArgs<ExtArgs>>): Prisma__MusicPlaylistClient<$Result.GetResult<Prisma.$MusicPlaylistPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one MusicPlaylist that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MusicPlaylistFindUniqueOrThrowArgs} args - Arguments to find a MusicPlaylist
     * @example
     * // Get one MusicPlaylist
     * const musicPlaylist = await prisma.musicPlaylist.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MusicPlaylistFindUniqueOrThrowArgs>(args: SelectSubset<T, MusicPlaylistFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MusicPlaylistClient<$Result.GetResult<Prisma.$MusicPlaylistPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MusicPlaylist that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicPlaylistFindFirstArgs} args - Arguments to find a MusicPlaylist
     * @example
     * // Get one MusicPlaylist
     * const musicPlaylist = await prisma.musicPlaylist.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MusicPlaylistFindFirstArgs>(args?: SelectSubset<T, MusicPlaylistFindFirstArgs<ExtArgs>>): Prisma__MusicPlaylistClient<$Result.GetResult<Prisma.$MusicPlaylistPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first MusicPlaylist that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicPlaylistFindFirstOrThrowArgs} args - Arguments to find a MusicPlaylist
     * @example
     * // Get one MusicPlaylist
     * const musicPlaylist = await prisma.musicPlaylist.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MusicPlaylistFindFirstOrThrowArgs>(args?: SelectSubset<T, MusicPlaylistFindFirstOrThrowArgs<ExtArgs>>): Prisma__MusicPlaylistClient<$Result.GetResult<Prisma.$MusicPlaylistPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more MusicPlaylists that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicPlaylistFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all MusicPlaylists
     * const musicPlaylists = await prisma.musicPlaylist.findMany()
     * 
     * // Get first 10 MusicPlaylists
     * const musicPlaylists = await prisma.musicPlaylist.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const musicPlaylistWithIdOnly = await prisma.musicPlaylist.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MusicPlaylistFindManyArgs>(args?: SelectSubset<T, MusicPlaylistFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MusicPlaylistPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a MusicPlaylist.
     * @param {MusicPlaylistCreateArgs} args - Arguments to create a MusicPlaylist.
     * @example
     * // Create one MusicPlaylist
     * const MusicPlaylist = await prisma.musicPlaylist.create({
     *   data: {
     *     // ... data to create a MusicPlaylist
     *   }
     * })
     * 
     */
    create<T extends MusicPlaylistCreateArgs>(args: SelectSubset<T, MusicPlaylistCreateArgs<ExtArgs>>): Prisma__MusicPlaylistClient<$Result.GetResult<Prisma.$MusicPlaylistPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many MusicPlaylists.
     * @param {MusicPlaylistCreateManyArgs} args - Arguments to create many MusicPlaylists.
     * @example
     * // Create many MusicPlaylists
     * const musicPlaylist = await prisma.musicPlaylist.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MusicPlaylistCreateManyArgs>(args?: SelectSubset<T, MusicPlaylistCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many MusicPlaylists and returns the data saved in the database.
     * @param {MusicPlaylistCreateManyAndReturnArgs} args - Arguments to create many MusicPlaylists.
     * @example
     * // Create many MusicPlaylists
     * const musicPlaylist = await prisma.musicPlaylist.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many MusicPlaylists and only return the `id`
     * const musicPlaylistWithIdOnly = await prisma.musicPlaylist.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MusicPlaylistCreateManyAndReturnArgs>(args?: SelectSubset<T, MusicPlaylistCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MusicPlaylistPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a MusicPlaylist.
     * @param {MusicPlaylistDeleteArgs} args - Arguments to delete one MusicPlaylist.
     * @example
     * // Delete one MusicPlaylist
     * const MusicPlaylist = await prisma.musicPlaylist.delete({
     *   where: {
     *     // ... filter to delete one MusicPlaylist
     *   }
     * })
     * 
     */
    delete<T extends MusicPlaylistDeleteArgs>(args: SelectSubset<T, MusicPlaylistDeleteArgs<ExtArgs>>): Prisma__MusicPlaylistClient<$Result.GetResult<Prisma.$MusicPlaylistPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one MusicPlaylist.
     * @param {MusicPlaylistUpdateArgs} args - Arguments to update one MusicPlaylist.
     * @example
     * // Update one MusicPlaylist
     * const musicPlaylist = await prisma.musicPlaylist.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MusicPlaylistUpdateArgs>(args: SelectSubset<T, MusicPlaylistUpdateArgs<ExtArgs>>): Prisma__MusicPlaylistClient<$Result.GetResult<Prisma.$MusicPlaylistPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more MusicPlaylists.
     * @param {MusicPlaylistDeleteManyArgs} args - Arguments to filter MusicPlaylists to delete.
     * @example
     * // Delete a few MusicPlaylists
     * const { count } = await prisma.musicPlaylist.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MusicPlaylistDeleteManyArgs>(args?: SelectSubset<T, MusicPlaylistDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MusicPlaylists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicPlaylistUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many MusicPlaylists
     * const musicPlaylist = await prisma.musicPlaylist.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MusicPlaylistUpdateManyArgs>(args: SelectSubset<T, MusicPlaylistUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more MusicPlaylists and returns the data updated in the database.
     * @param {MusicPlaylistUpdateManyAndReturnArgs} args - Arguments to update many MusicPlaylists.
     * @example
     * // Update many MusicPlaylists
     * const musicPlaylist = await prisma.musicPlaylist.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more MusicPlaylists and only return the `id`
     * const musicPlaylistWithIdOnly = await prisma.musicPlaylist.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MusicPlaylistUpdateManyAndReturnArgs>(args: SelectSubset<T, MusicPlaylistUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MusicPlaylistPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one MusicPlaylist.
     * @param {MusicPlaylistUpsertArgs} args - Arguments to update or create a MusicPlaylist.
     * @example
     * // Update or create a MusicPlaylist
     * const musicPlaylist = await prisma.musicPlaylist.upsert({
     *   create: {
     *     // ... data to create a MusicPlaylist
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the MusicPlaylist we want to update
     *   }
     * })
     */
    upsert<T extends MusicPlaylistUpsertArgs>(args: SelectSubset<T, MusicPlaylistUpsertArgs<ExtArgs>>): Prisma__MusicPlaylistClient<$Result.GetResult<Prisma.$MusicPlaylistPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of MusicPlaylists.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicPlaylistCountArgs} args - Arguments to filter MusicPlaylists to count.
     * @example
     * // Count the number of MusicPlaylists
     * const count = await prisma.musicPlaylist.count({
     *   where: {
     *     // ... the filter for the MusicPlaylists we want to count
     *   }
     * })
    **/
    count<T extends MusicPlaylistCountArgs>(
      args?: Subset<T, MusicPlaylistCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MusicPlaylistCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a MusicPlaylist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicPlaylistAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MusicPlaylistAggregateArgs>(args: Subset<T, MusicPlaylistAggregateArgs>): Prisma.PrismaPromise<GetMusicPlaylistAggregateType<T>>

    /**
     * Group by MusicPlaylist.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MusicPlaylistGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MusicPlaylistGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MusicPlaylistGroupByArgs['orderBy'] }
        : { orderBy?: MusicPlaylistGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MusicPlaylistGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMusicPlaylistGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the MusicPlaylist model
   */
  readonly fields: MusicPlaylistFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for MusicPlaylist.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MusicPlaylistClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    createdBy<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the MusicPlaylist model
   */
  interface MusicPlaylistFieldRefs {
    readonly id: FieldRef<"MusicPlaylist", 'String'>
    readonly label: FieldRef<"MusicPlaylist", 'String'>
    readonly url: FieldRef<"MusicPlaylist", 'String'>
    readonly createdById: FieldRef<"MusicPlaylist", 'String'>
    readonly createdAt: FieldRef<"MusicPlaylist", 'DateTime'>
    readonly updatedAt: FieldRef<"MusicPlaylist", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * MusicPlaylist findUnique
   */
  export type MusicPlaylistFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistInclude<ExtArgs> | null
    /**
     * Filter, which MusicPlaylist to fetch.
     */
    where: MusicPlaylistWhereUniqueInput
  }

  /**
   * MusicPlaylist findUniqueOrThrow
   */
  export type MusicPlaylistFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistInclude<ExtArgs> | null
    /**
     * Filter, which MusicPlaylist to fetch.
     */
    where: MusicPlaylistWhereUniqueInput
  }

  /**
   * MusicPlaylist findFirst
   */
  export type MusicPlaylistFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistInclude<ExtArgs> | null
    /**
     * Filter, which MusicPlaylist to fetch.
     */
    where?: MusicPlaylistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MusicPlaylists to fetch.
     */
    orderBy?: MusicPlaylistOrderByWithRelationInput | MusicPlaylistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MusicPlaylists.
     */
    cursor?: MusicPlaylistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MusicPlaylists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MusicPlaylists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MusicPlaylists.
     */
    distinct?: MusicPlaylistScalarFieldEnum | MusicPlaylistScalarFieldEnum[]
  }

  /**
   * MusicPlaylist findFirstOrThrow
   */
  export type MusicPlaylistFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistInclude<ExtArgs> | null
    /**
     * Filter, which MusicPlaylist to fetch.
     */
    where?: MusicPlaylistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MusicPlaylists to fetch.
     */
    orderBy?: MusicPlaylistOrderByWithRelationInput | MusicPlaylistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for MusicPlaylists.
     */
    cursor?: MusicPlaylistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MusicPlaylists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MusicPlaylists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MusicPlaylists.
     */
    distinct?: MusicPlaylistScalarFieldEnum | MusicPlaylistScalarFieldEnum[]
  }

  /**
   * MusicPlaylist findMany
   */
  export type MusicPlaylistFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistInclude<ExtArgs> | null
    /**
     * Filter, which MusicPlaylists to fetch.
     */
    where?: MusicPlaylistWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of MusicPlaylists to fetch.
     */
    orderBy?: MusicPlaylistOrderByWithRelationInput | MusicPlaylistOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing MusicPlaylists.
     */
    cursor?: MusicPlaylistWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` MusicPlaylists from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` MusicPlaylists.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of MusicPlaylists.
     */
    distinct?: MusicPlaylistScalarFieldEnum | MusicPlaylistScalarFieldEnum[]
  }

  /**
   * MusicPlaylist create
   */
  export type MusicPlaylistCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistInclude<ExtArgs> | null
    /**
     * The data needed to create a MusicPlaylist.
     */
    data: XOR<MusicPlaylistCreateInput, MusicPlaylistUncheckedCreateInput>
  }

  /**
   * MusicPlaylist createMany
   */
  export type MusicPlaylistCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many MusicPlaylists.
     */
    data: MusicPlaylistCreateManyInput | MusicPlaylistCreateManyInput[]
  }

  /**
   * MusicPlaylist createManyAndReturn
   */
  export type MusicPlaylistCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * The data used to create many MusicPlaylists.
     */
    data: MusicPlaylistCreateManyInput | MusicPlaylistCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * MusicPlaylist update
   */
  export type MusicPlaylistUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistInclude<ExtArgs> | null
    /**
     * The data needed to update a MusicPlaylist.
     */
    data: XOR<MusicPlaylistUpdateInput, MusicPlaylistUncheckedUpdateInput>
    /**
     * Choose, which MusicPlaylist to update.
     */
    where: MusicPlaylistWhereUniqueInput
  }

  /**
   * MusicPlaylist updateMany
   */
  export type MusicPlaylistUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update MusicPlaylists.
     */
    data: XOR<MusicPlaylistUpdateManyMutationInput, MusicPlaylistUncheckedUpdateManyInput>
    /**
     * Filter which MusicPlaylists to update
     */
    where?: MusicPlaylistWhereInput
    /**
     * Limit how many MusicPlaylists to update.
     */
    limit?: number
  }

  /**
   * MusicPlaylist updateManyAndReturn
   */
  export type MusicPlaylistUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * The data used to update MusicPlaylists.
     */
    data: XOR<MusicPlaylistUpdateManyMutationInput, MusicPlaylistUncheckedUpdateManyInput>
    /**
     * Filter which MusicPlaylists to update
     */
    where?: MusicPlaylistWhereInput
    /**
     * Limit how many MusicPlaylists to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * MusicPlaylist upsert
   */
  export type MusicPlaylistUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistInclude<ExtArgs> | null
    /**
     * The filter to search for the MusicPlaylist to update in case it exists.
     */
    where: MusicPlaylistWhereUniqueInput
    /**
     * In case the MusicPlaylist found by the `where` argument doesn't exist, create a new MusicPlaylist with this data.
     */
    create: XOR<MusicPlaylistCreateInput, MusicPlaylistUncheckedCreateInput>
    /**
     * In case the MusicPlaylist was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MusicPlaylistUpdateInput, MusicPlaylistUncheckedUpdateInput>
  }

  /**
   * MusicPlaylist delete
   */
  export type MusicPlaylistDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistInclude<ExtArgs> | null
    /**
     * Filter which MusicPlaylist to delete.
     */
    where: MusicPlaylistWhereUniqueInput
  }

  /**
   * MusicPlaylist deleteMany
   */
  export type MusicPlaylistDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which MusicPlaylists to delete
     */
    where?: MusicPlaylistWhereInput
    /**
     * Limit how many MusicPlaylists to delete.
     */
    limit?: number
  }

  /**
   * MusicPlaylist without action
   */
  export type MusicPlaylistDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MusicPlaylist
     */
    select?: MusicPlaylistSelect<ExtArgs> | null
    /**
     * Omit specific fields from the MusicPlaylist
     */
    omit?: MusicPlaylistOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MusicPlaylistInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    passwordHash: 'passwordHash',
    role: 'role',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TierListScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    anime: 'anime',
    category: 'category',
    resourceUrl: 'resourceUrl',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TierListScalarFieldEnum = (typeof TierListScalarFieldEnum)[keyof typeof TierListScalarFieldEnum]


  export const TierListItemScalarFieldEnum: {
    id: 'id',
    tierListId: 'tierListId',
    label: 'label',
    rank: 'rank',
    linkUrl: 'linkUrl',
    sortOrder: 'sortOrder',
    createdAt: 'createdAt'
  };

  export type TierListItemScalarFieldEnum = (typeof TierListItemScalarFieldEnum)[keyof typeof TierListItemScalarFieldEnum]


  export const TierListVoteScalarFieldEnum: {
    id: 'id',
    tierListId: 'tierListId',
    userId: 'userId',
    value: 'value',
    createdAt: 'createdAt'
  };

  export type TierListVoteScalarFieldEnum = (typeof TierListVoteScalarFieldEnum)[keyof typeof TierListVoteScalarFieldEnum]


  export const SiteConfigScalarFieldEnum: {
    id: 'id',
    liveTvEnabled: 'liveTvEnabled',
    updatedAt: 'updatedAt'
  };

  export type SiteConfigScalarFieldEnum = (typeof SiteConfigScalarFieldEnum)[keyof typeof SiteConfigScalarFieldEnum]


  export const LinkSuggestionScalarFieldEnum: {
    id: 'id',
    kind: 'kind',
    tierListId: 'tierListId',
    tierListItemId: 'tierListItemId',
    url: 'url',
    title: 'title',
    note: 'note',
    status: 'status',
    submittedById: 'submittedById',
    reviewedById: 'reviewedById',
    reviewedAt: 'reviewedAt',
    createdAt: 'createdAt'
  };

  export type LinkSuggestionScalarFieldEnum = (typeof LinkSuggestionScalarFieldEnum)[keyof typeof LinkSuggestionScalarFieldEnum]


  export const MusicPlaylistScalarFieldEnum: {
    id: 'id',
    label: 'label',
    url: 'url',
    createdById: 'createdById',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MusicPlaylistScalarFieldEnum = (typeof MusicPlaylistScalarFieldEnum)[keyof typeof MusicPlaylistScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'TierRank'
   */
  export type EnumTierRankFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TierRank'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'LinkSuggestionKind'
   */
  export type EnumLinkSuggestionKindFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LinkSuggestionKind'>
    


  /**
   * Reference to a field of type 'SuggestionStatus'
   */
  export type EnumSuggestionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SuggestionStatus'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    tierLists?: TierListListRelationFilter
    tierVotes?: TierListVoteListRelationFilter
    linkSuggestionsSubmitted?: LinkSuggestionListRelationFilter
    linkSuggestionsReviewed?: LinkSuggestionListRelationFilter
    musicPlaylistsCreated?: MusicPlaylistListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    tierLists?: TierListOrderByRelationAggregateInput
    tierVotes?: TierListVoteOrderByRelationAggregateInput
    linkSuggestionsSubmitted?: LinkSuggestionOrderByRelationAggregateInput
    linkSuggestionsReviewed?: LinkSuggestionOrderByRelationAggregateInput
    musicPlaylistsCreated?: MusicPlaylistOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    passwordHash?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    tierLists?: TierListListRelationFilter
    tierVotes?: TierListVoteListRelationFilter
    linkSuggestionsSubmitted?: LinkSuggestionListRelationFilter
    linkSuggestionsReviewed?: LinkSuggestionListRelationFilter
    musicPlaylistsCreated?: MusicPlaylistListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type TierListWhereInput = {
    AND?: TierListWhereInput | TierListWhereInput[]
    OR?: TierListWhereInput[]
    NOT?: TierListWhereInput | TierListWhereInput[]
    id?: StringFilter<"TierList"> | string
    title?: StringFilter<"TierList"> | string
    description?: StringNullableFilter<"TierList"> | string | null
    anime?: StringNullableFilter<"TierList"> | string | null
    category?: StringFilter<"TierList"> | string
    resourceUrl?: StringNullableFilter<"TierList"> | string | null
    createdById?: StringFilter<"TierList"> | string
    createdAt?: DateTimeFilter<"TierList"> | Date | string
    updatedAt?: DateTimeFilter<"TierList"> | Date | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    items?: TierListItemListRelationFilter
    votes?: TierListVoteListRelationFilter
    linkSuggestions?: LinkSuggestionListRelationFilter
  }

  export type TierListOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    anime?: SortOrderInput | SortOrder
    category?: SortOrder
    resourceUrl?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: UserOrderByWithRelationInput
    items?: TierListItemOrderByRelationAggregateInput
    votes?: TierListVoteOrderByRelationAggregateInput
    linkSuggestions?: LinkSuggestionOrderByRelationAggregateInput
  }

  export type TierListWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TierListWhereInput | TierListWhereInput[]
    OR?: TierListWhereInput[]
    NOT?: TierListWhereInput | TierListWhereInput[]
    title?: StringFilter<"TierList"> | string
    description?: StringNullableFilter<"TierList"> | string | null
    anime?: StringNullableFilter<"TierList"> | string | null
    category?: StringFilter<"TierList"> | string
    resourceUrl?: StringNullableFilter<"TierList"> | string | null
    createdById?: StringFilter<"TierList"> | string
    createdAt?: DateTimeFilter<"TierList"> | Date | string
    updatedAt?: DateTimeFilter<"TierList"> | Date | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    items?: TierListItemListRelationFilter
    votes?: TierListVoteListRelationFilter
    linkSuggestions?: LinkSuggestionListRelationFilter
  }, "id">

  export type TierListOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    anime?: SortOrderInput | SortOrder
    category?: SortOrder
    resourceUrl?: SortOrderInput | SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TierListCountOrderByAggregateInput
    _max?: TierListMaxOrderByAggregateInput
    _min?: TierListMinOrderByAggregateInput
  }

  export type TierListScalarWhereWithAggregatesInput = {
    AND?: TierListScalarWhereWithAggregatesInput | TierListScalarWhereWithAggregatesInput[]
    OR?: TierListScalarWhereWithAggregatesInput[]
    NOT?: TierListScalarWhereWithAggregatesInput | TierListScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TierList"> | string
    title?: StringWithAggregatesFilter<"TierList"> | string
    description?: StringNullableWithAggregatesFilter<"TierList"> | string | null
    anime?: StringNullableWithAggregatesFilter<"TierList"> | string | null
    category?: StringWithAggregatesFilter<"TierList"> | string
    resourceUrl?: StringNullableWithAggregatesFilter<"TierList"> | string | null
    createdById?: StringWithAggregatesFilter<"TierList"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TierList"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TierList"> | Date | string
  }

  export type TierListItemWhereInput = {
    AND?: TierListItemWhereInput | TierListItemWhereInput[]
    OR?: TierListItemWhereInput[]
    NOT?: TierListItemWhereInput | TierListItemWhereInput[]
    id?: StringFilter<"TierListItem"> | string
    tierListId?: StringFilter<"TierListItem"> | string
    label?: StringFilter<"TierListItem"> | string
    rank?: EnumTierRankFilter<"TierListItem"> | $Enums.TierRank
    linkUrl?: StringNullableFilter<"TierListItem"> | string | null
    sortOrder?: IntFilter<"TierListItem"> | number
    createdAt?: DateTimeFilter<"TierListItem"> | Date | string
    tierList?: XOR<TierListScalarRelationFilter, TierListWhereInput>
    linkSuggestions?: LinkSuggestionListRelationFilter
  }

  export type TierListItemOrderByWithRelationInput = {
    id?: SortOrder
    tierListId?: SortOrder
    label?: SortOrder
    rank?: SortOrder
    linkUrl?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    tierList?: TierListOrderByWithRelationInput
    linkSuggestions?: LinkSuggestionOrderByRelationAggregateInput
  }

  export type TierListItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TierListItemWhereInput | TierListItemWhereInput[]
    OR?: TierListItemWhereInput[]
    NOT?: TierListItemWhereInput | TierListItemWhereInput[]
    tierListId?: StringFilter<"TierListItem"> | string
    label?: StringFilter<"TierListItem"> | string
    rank?: EnumTierRankFilter<"TierListItem"> | $Enums.TierRank
    linkUrl?: StringNullableFilter<"TierListItem"> | string | null
    sortOrder?: IntFilter<"TierListItem"> | number
    createdAt?: DateTimeFilter<"TierListItem"> | Date | string
    tierList?: XOR<TierListScalarRelationFilter, TierListWhereInput>
    linkSuggestions?: LinkSuggestionListRelationFilter
  }, "id">

  export type TierListItemOrderByWithAggregationInput = {
    id?: SortOrder
    tierListId?: SortOrder
    label?: SortOrder
    rank?: SortOrder
    linkUrl?: SortOrderInput | SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
    _count?: TierListItemCountOrderByAggregateInput
    _avg?: TierListItemAvgOrderByAggregateInput
    _max?: TierListItemMaxOrderByAggregateInput
    _min?: TierListItemMinOrderByAggregateInput
    _sum?: TierListItemSumOrderByAggregateInput
  }

  export type TierListItemScalarWhereWithAggregatesInput = {
    AND?: TierListItemScalarWhereWithAggregatesInput | TierListItemScalarWhereWithAggregatesInput[]
    OR?: TierListItemScalarWhereWithAggregatesInput[]
    NOT?: TierListItemScalarWhereWithAggregatesInput | TierListItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TierListItem"> | string
    tierListId?: StringWithAggregatesFilter<"TierListItem"> | string
    label?: StringWithAggregatesFilter<"TierListItem"> | string
    rank?: EnumTierRankWithAggregatesFilter<"TierListItem"> | $Enums.TierRank
    linkUrl?: StringNullableWithAggregatesFilter<"TierListItem"> | string | null
    sortOrder?: IntWithAggregatesFilter<"TierListItem"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TierListItem"> | Date | string
  }

  export type TierListVoteWhereInput = {
    AND?: TierListVoteWhereInput | TierListVoteWhereInput[]
    OR?: TierListVoteWhereInput[]
    NOT?: TierListVoteWhereInput | TierListVoteWhereInput[]
    id?: StringFilter<"TierListVote"> | string
    tierListId?: StringFilter<"TierListVote"> | string
    userId?: StringFilter<"TierListVote"> | string
    value?: IntFilter<"TierListVote"> | number
    createdAt?: DateTimeFilter<"TierListVote"> | Date | string
    tierList?: XOR<TierListScalarRelationFilter, TierListWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type TierListVoteOrderByWithRelationInput = {
    id?: SortOrder
    tierListId?: SortOrder
    userId?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    tierList?: TierListOrderByWithRelationInput
    user?: UserOrderByWithRelationInput
  }

  export type TierListVoteWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tierListId_userId?: TierListVoteTierListIdUserIdCompoundUniqueInput
    AND?: TierListVoteWhereInput | TierListVoteWhereInput[]
    OR?: TierListVoteWhereInput[]
    NOT?: TierListVoteWhereInput | TierListVoteWhereInput[]
    tierListId?: StringFilter<"TierListVote"> | string
    userId?: StringFilter<"TierListVote"> | string
    value?: IntFilter<"TierListVote"> | number
    createdAt?: DateTimeFilter<"TierListVote"> | Date | string
    tierList?: XOR<TierListScalarRelationFilter, TierListWhereInput>
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "tierListId_userId">

  export type TierListVoteOrderByWithAggregationInput = {
    id?: SortOrder
    tierListId?: SortOrder
    userId?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
    _count?: TierListVoteCountOrderByAggregateInput
    _avg?: TierListVoteAvgOrderByAggregateInput
    _max?: TierListVoteMaxOrderByAggregateInput
    _min?: TierListVoteMinOrderByAggregateInput
    _sum?: TierListVoteSumOrderByAggregateInput
  }

  export type TierListVoteScalarWhereWithAggregatesInput = {
    AND?: TierListVoteScalarWhereWithAggregatesInput | TierListVoteScalarWhereWithAggregatesInput[]
    OR?: TierListVoteScalarWhereWithAggregatesInput[]
    NOT?: TierListVoteScalarWhereWithAggregatesInput | TierListVoteScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TierListVote"> | string
    tierListId?: StringWithAggregatesFilter<"TierListVote"> | string
    userId?: StringWithAggregatesFilter<"TierListVote"> | string
    value?: IntWithAggregatesFilter<"TierListVote"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TierListVote"> | Date | string
  }

  export type SiteConfigWhereInput = {
    AND?: SiteConfigWhereInput | SiteConfigWhereInput[]
    OR?: SiteConfigWhereInput[]
    NOT?: SiteConfigWhereInput | SiteConfigWhereInput[]
    id?: IntFilter<"SiteConfig"> | number
    liveTvEnabled?: BoolFilter<"SiteConfig"> | boolean
    updatedAt?: DateTimeFilter<"SiteConfig"> | Date | string
  }

  export type SiteConfigOrderByWithRelationInput = {
    id?: SortOrder
    liveTvEnabled?: SortOrder
    updatedAt?: SortOrder
  }

  export type SiteConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: SiteConfigWhereInput | SiteConfigWhereInput[]
    OR?: SiteConfigWhereInput[]
    NOT?: SiteConfigWhereInput | SiteConfigWhereInput[]
    liveTvEnabled?: BoolFilter<"SiteConfig"> | boolean
    updatedAt?: DateTimeFilter<"SiteConfig"> | Date | string
  }, "id">

  export type SiteConfigOrderByWithAggregationInput = {
    id?: SortOrder
    liveTvEnabled?: SortOrder
    updatedAt?: SortOrder
    _count?: SiteConfigCountOrderByAggregateInput
    _avg?: SiteConfigAvgOrderByAggregateInput
    _max?: SiteConfigMaxOrderByAggregateInput
    _min?: SiteConfigMinOrderByAggregateInput
    _sum?: SiteConfigSumOrderByAggregateInput
  }

  export type SiteConfigScalarWhereWithAggregatesInput = {
    AND?: SiteConfigScalarWhereWithAggregatesInput | SiteConfigScalarWhereWithAggregatesInput[]
    OR?: SiteConfigScalarWhereWithAggregatesInput[]
    NOT?: SiteConfigScalarWhereWithAggregatesInput | SiteConfigScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SiteConfig"> | number
    liveTvEnabled?: BoolWithAggregatesFilter<"SiteConfig"> | boolean
    updatedAt?: DateTimeWithAggregatesFilter<"SiteConfig"> | Date | string
  }

  export type LinkSuggestionWhereInput = {
    AND?: LinkSuggestionWhereInput | LinkSuggestionWhereInput[]
    OR?: LinkSuggestionWhereInput[]
    NOT?: LinkSuggestionWhereInput | LinkSuggestionWhereInput[]
    id?: StringFilter<"LinkSuggestion"> | string
    kind?: EnumLinkSuggestionKindFilter<"LinkSuggestion"> | $Enums.LinkSuggestionKind
    tierListId?: StringNullableFilter<"LinkSuggestion"> | string | null
    tierListItemId?: StringNullableFilter<"LinkSuggestion"> | string | null
    url?: StringFilter<"LinkSuggestion"> | string
    title?: StringNullableFilter<"LinkSuggestion"> | string | null
    note?: StringNullableFilter<"LinkSuggestion"> | string | null
    status?: EnumSuggestionStatusFilter<"LinkSuggestion"> | $Enums.SuggestionStatus
    submittedById?: StringFilter<"LinkSuggestion"> | string
    reviewedById?: StringNullableFilter<"LinkSuggestion"> | string | null
    reviewedAt?: DateTimeNullableFilter<"LinkSuggestion"> | Date | string | null
    createdAt?: DateTimeFilter<"LinkSuggestion"> | Date | string
    tierList?: XOR<TierListNullableScalarRelationFilter, TierListWhereInput> | null
    tierListItem?: XOR<TierListItemNullableScalarRelationFilter, TierListItemWhereInput> | null
    submittedBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    reviewedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type LinkSuggestionOrderByWithRelationInput = {
    id?: SortOrder
    kind?: SortOrder
    tierListId?: SortOrderInput | SortOrder
    tierListItemId?: SortOrderInput | SortOrder
    url?: SortOrder
    title?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    status?: SortOrder
    submittedById?: SortOrder
    reviewedById?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tierList?: TierListOrderByWithRelationInput
    tierListItem?: TierListItemOrderByWithRelationInput
    submittedBy?: UserOrderByWithRelationInput
    reviewedBy?: UserOrderByWithRelationInput
  }

  export type LinkSuggestionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LinkSuggestionWhereInput | LinkSuggestionWhereInput[]
    OR?: LinkSuggestionWhereInput[]
    NOT?: LinkSuggestionWhereInput | LinkSuggestionWhereInput[]
    kind?: EnumLinkSuggestionKindFilter<"LinkSuggestion"> | $Enums.LinkSuggestionKind
    tierListId?: StringNullableFilter<"LinkSuggestion"> | string | null
    tierListItemId?: StringNullableFilter<"LinkSuggestion"> | string | null
    url?: StringFilter<"LinkSuggestion"> | string
    title?: StringNullableFilter<"LinkSuggestion"> | string | null
    note?: StringNullableFilter<"LinkSuggestion"> | string | null
    status?: EnumSuggestionStatusFilter<"LinkSuggestion"> | $Enums.SuggestionStatus
    submittedById?: StringFilter<"LinkSuggestion"> | string
    reviewedById?: StringNullableFilter<"LinkSuggestion"> | string | null
    reviewedAt?: DateTimeNullableFilter<"LinkSuggestion"> | Date | string | null
    createdAt?: DateTimeFilter<"LinkSuggestion"> | Date | string
    tierList?: XOR<TierListNullableScalarRelationFilter, TierListWhereInput> | null
    tierListItem?: XOR<TierListItemNullableScalarRelationFilter, TierListItemWhereInput> | null
    submittedBy?: XOR<UserScalarRelationFilter, UserWhereInput>
    reviewedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type LinkSuggestionOrderByWithAggregationInput = {
    id?: SortOrder
    kind?: SortOrder
    tierListId?: SortOrderInput | SortOrder
    tierListItemId?: SortOrderInput | SortOrder
    url?: SortOrder
    title?: SortOrderInput | SortOrder
    note?: SortOrderInput | SortOrder
    status?: SortOrder
    submittedById?: SortOrder
    reviewedById?: SortOrderInput | SortOrder
    reviewedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LinkSuggestionCountOrderByAggregateInput
    _max?: LinkSuggestionMaxOrderByAggregateInput
    _min?: LinkSuggestionMinOrderByAggregateInput
  }

  export type LinkSuggestionScalarWhereWithAggregatesInput = {
    AND?: LinkSuggestionScalarWhereWithAggregatesInput | LinkSuggestionScalarWhereWithAggregatesInput[]
    OR?: LinkSuggestionScalarWhereWithAggregatesInput[]
    NOT?: LinkSuggestionScalarWhereWithAggregatesInput | LinkSuggestionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LinkSuggestion"> | string
    kind?: EnumLinkSuggestionKindWithAggregatesFilter<"LinkSuggestion"> | $Enums.LinkSuggestionKind
    tierListId?: StringNullableWithAggregatesFilter<"LinkSuggestion"> | string | null
    tierListItemId?: StringNullableWithAggregatesFilter<"LinkSuggestion"> | string | null
    url?: StringWithAggregatesFilter<"LinkSuggestion"> | string
    title?: StringNullableWithAggregatesFilter<"LinkSuggestion"> | string | null
    note?: StringNullableWithAggregatesFilter<"LinkSuggestion"> | string | null
    status?: EnumSuggestionStatusWithAggregatesFilter<"LinkSuggestion"> | $Enums.SuggestionStatus
    submittedById?: StringWithAggregatesFilter<"LinkSuggestion"> | string
    reviewedById?: StringNullableWithAggregatesFilter<"LinkSuggestion"> | string | null
    reviewedAt?: DateTimeNullableWithAggregatesFilter<"LinkSuggestion"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LinkSuggestion"> | Date | string
  }

  export type MusicPlaylistWhereInput = {
    AND?: MusicPlaylistWhereInput | MusicPlaylistWhereInput[]
    OR?: MusicPlaylistWhereInput[]
    NOT?: MusicPlaylistWhereInput | MusicPlaylistWhereInput[]
    id?: StringFilter<"MusicPlaylist"> | string
    label?: StringFilter<"MusicPlaylist"> | string
    url?: StringFilter<"MusicPlaylist"> | string
    createdById?: StringFilter<"MusicPlaylist"> | string
    createdAt?: DateTimeFilter<"MusicPlaylist"> | Date | string
    updatedAt?: DateTimeFilter<"MusicPlaylist"> | Date | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MusicPlaylistOrderByWithRelationInput = {
    id?: SortOrder
    label?: SortOrder
    url?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: UserOrderByWithRelationInput
  }

  export type MusicPlaylistWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MusicPlaylistWhereInput | MusicPlaylistWhereInput[]
    OR?: MusicPlaylistWhereInput[]
    NOT?: MusicPlaylistWhereInput | MusicPlaylistWhereInput[]
    label?: StringFilter<"MusicPlaylist"> | string
    url?: StringFilter<"MusicPlaylist"> | string
    createdById?: StringFilter<"MusicPlaylist"> | string
    createdAt?: DateTimeFilter<"MusicPlaylist"> | Date | string
    updatedAt?: DateTimeFilter<"MusicPlaylist"> | Date | string
    createdBy?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type MusicPlaylistOrderByWithAggregationInput = {
    id?: SortOrder
    label?: SortOrder
    url?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MusicPlaylistCountOrderByAggregateInput
    _max?: MusicPlaylistMaxOrderByAggregateInput
    _min?: MusicPlaylistMinOrderByAggregateInput
  }

  export type MusicPlaylistScalarWhereWithAggregatesInput = {
    AND?: MusicPlaylistScalarWhereWithAggregatesInput | MusicPlaylistScalarWhereWithAggregatesInput[]
    OR?: MusicPlaylistScalarWhereWithAggregatesInput[]
    NOT?: MusicPlaylistScalarWhereWithAggregatesInput | MusicPlaylistScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"MusicPlaylist"> | string
    label?: StringWithAggregatesFilter<"MusicPlaylist"> | string
    url?: StringWithAggregatesFilter<"MusicPlaylist"> | string
    createdById?: StringWithAggregatesFilter<"MusicPlaylist"> | string
    createdAt?: DateTimeWithAggregatesFilter<"MusicPlaylist"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"MusicPlaylist"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    tierLists?: TierListCreateNestedManyWithoutCreatedByInput
    tierVotes?: TierListVoteCreateNestedManyWithoutUserInput
    linkSuggestionsSubmitted?: LinkSuggestionCreateNestedManyWithoutSubmittedByInput
    linkSuggestionsReviewed?: LinkSuggestionCreateNestedManyWithoutReviewedByInput
    musicPlaylistsCreated?: MusicPlaylistCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    tierLists?: TierListUncheckedCreateNestedManyWithoutCreatedByInput
    tierVotes?: TierListVoteUncheckedCreateNestedManyWithoutUserInput
    linkSuggestionsSubmitted?: LinkSuggestionUncheckedCreateNestedManyWithoutSubmittedByInput
    linkSuggestionsReviewed?: LinkSuggestionUncheckedCreateNestedManyWithoutReviewedByInput
    musicPlaylistsCreated?: MusicPlaylistUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierLists?: TierListUpdateManyWithoutCreatedByNestedInput
    tierVotes?: TierListVoteUpdateManyWithoutUserNestedInput
    linkSuggestionsSubmitted?: LinkSuggestionUpdateManyWithoutSubmittedByNestedInput
    linkSuggestionsReviewed?: LinkSuggestionUpdateManyWithoutReviewedByNestedInput
    musicPlaylistsCreated?: MusicPlaylistUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierLists?: TierListUncheckedUpdateManyWithoutCreatedByNestedInput
    tierVotes?: TierListVoteUncheckedUpdateManyWithoutUserNestedInput
    linkSuggestionsSubmitted?: LinkSuggestionUncheckedUpdateManyWithoutSubmittedByNestedInput
    linkSuggestionsReviewed?: LinkSuggestionUncheckedUpdateManyWithoutReviewedByNestedInput
    musicPlaylistsCreated?: MusicPlaylistUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TierListCreateInput = {
    id?: string
    title: string
    description?: string | null
    anime?: string | null
    category: string
    resourceUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutTierListsInput
    items?: TierListItemCreateNestedManyWithoutTierListInput
    votes?: TierListVoteCreateNestedManyWithoutTierListInput
    linkSuggestions?: LinkSuggestionCreateNestedManyWithoutTierListInput
  }

  export type TierListUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    anime?: string | null
    category: string
    resourceUrl?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: TierListItemUncheckedCreateNestedManyWithoutTierListInput
    votes?: TierListVoteUncheckedCreateNestedManyWithoutTierListInput
    linkSuggestions?: LinkSuggestionUncheckedCreateNestedManyWithoutTierListInput
  }

  export type TierListUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutTierListsNestedInput
    items?: TierListItemUpdateManyWithoutTierListNestedInput
    votes?: TierListVoteUpdateManyWithoutTierListNestedInput
    linkSuggestions?: LinkSuggestionUpdateManyWithoutTierListNestedInput
  }

  export type TierListUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: TierListItemUncheckedUpdateManyWithoutTierListNestedInput
    votes?: TierListVoteUncheckedUpdateManyWithoutTierListNestedInput
    linkSuggestions?: LinkSuggestionUncheckedUpdateManyWithoutTierListNestedInput
  }

  export type TierListCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    anime?: string | null
    category: string
    resourceUrl?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TierListUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TierListUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TierListItemCreateInput = {
    id?: string
    label: string
    rank: $Enums.TierRank
    linkUrl?: string | null
    sortOrder?: number
    createdAt?: Date | string
    tierList: TierListCreateNestedOneWithoutItemsInput
    linkSuggestions?: LinkSuggestionCreateNestedManyWithoutTierListItemInput
  }

  export type TierListItemUncheckedCreateInput = {
    id?: string
    tierListId: string
    label: string
    rank: $Enums.TierRank
    linkUrl?: string | null
    sortOrder?: number
    createdAt?: Date | string
    linkSuggestions?: LinkSuggestionUncheckedCreateNestedManyWithoutTierListItemInput
  }

  export type TierListItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    rank?: EnumTierRankFieldUpdateOperationsInput | $Enums.TierRank
    linkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierList?: TierListUpdateOneRequiredWithoutItemsNestedInput
    linkSuggestions?: LinkSuggestionUpdateManyWithoutTierListItemNestedInput
  }

  export type TierListItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tierListId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    rank?: EnumTierRankFieldUpdateOperationsInput | $Enums.TierRank
    linkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    linkSuggestions?: LinkSuggestionUncheckedUpdateManyWithoutTierListItemNestedInput
  }

  export type TierListItemCreateManyInput = {
    id?: string
    tierListId: string
    label: string
    rank: $Enums.TierRank
    linkUrl?: string | null
    sortOrder?: number
    createdAt?: Date | string
  }

  export type TierListItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    rank?: EnumTierRankFieldUpdateOperationsInput | $Enums.TierRank
    linkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TierListItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tierListId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    rank?: EnumTierRankFieldUpdateOperationsInput | $Enums.TierRank
    linkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TierListVoteCreateInput = {
    id?: string
    value?: number
    createdAt?: Date | string
    tierList: TierListCreateNestedOneWithoutVotesInput
    user: UserCreateNestedOneWithoutTierVotesInput
  }

  export type TierListVoteUncheckedCreateInput = {
    id?: string
    tierListId: string
    userId: string
    value?: number
    createdAt?: Date | string
  }

  export type TierListVoteUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierList?: TierListUpdateOneRequiredWithoutVotesNestedInput
    user?: UserUpdateOneRequiredWithoutTierVotesNestedInput
  }

  export type TierListVoteUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tierListId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TierListVoteCreateManyInput = {
    id?: string
    tierListId: string
    userId: string
    value?: number
    createdAt?: Date | string
  }

  export type TierListVoteUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TierListVoteUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tierListId?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiteConfigCreateInput = {
    id: number
    liveTvEnabled?: boolean
    updatedAt?: Date | string
  }

  export type SiteConfigUncheckedCreateInput = {
    id: number
    liveTvEnabled?: boolean
    updatedAt?: Date | string
  }

  export type SiteConfigUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    liveTvEnabled?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiteConfigUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    liveTvEnabled?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiteConfigCreateManyInput = {
    id: number
    liveTvEnabled?: boolean
    updatedAt?: Date | string
  }

  export type SiteConfigUpdateManyMutationInput = {
    id?: IntFieldUpdateOperationsInput | number
    liveTvEnabled?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiteConfigUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    liveTvEnabled?: BoolFieldUpdateOperationsInput | boolean
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkSuggestionCreateInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    tierList?: TierListCreateNestedOneWithoutLinkSuggestionsInput
    tierListItem?: TierListItemCreateNestedOneWithoutLinkSuggestionsInput
    submittedBy: UserCreateNestedOneWithoutLinkSuggestionsSubmittedInput
    reviewedBy?: UserCreateNestedOneWithoutLinkSuggestionsReviewedInput
  }

  export type LinkSuggestionUncheckedCreateInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    tierListId?: string | null
    tierListItemId?: string | null
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    submittedById: string
    reviewedById?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LinkSuggestionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierList?: TierListUpdateOneWithoutLinkSuggestionsNestedInput
    tierListItem?: TierListItemUpdateOneWithoutLinkSuggestionsNestedInput
    submittedBy?: UserUpdateOneRequiredWithoutLinkSuggestionsSubmittedNestedInput
    reviewedBy?: UserUpdateOneWithoutLinkSuggestionsReviewedNestedInput
  }

  export type LinkSuggestionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    tierListId?: NullableStringFieldUpdateOperationsInput | string | null
    tierListItemId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    submittedById?: StringFieldUpdateOperationsInput | string
    reviewedById?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkSuggestionCreateManyInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    tierListId?: string | null
    tierListItemId?: string | null
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    submittedById: string
    reviewedById?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LinkSuggestionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkSuggestionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    tierListId?: NullableStringFieldUpdateOperationsInput | string | null
    tierListItemId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    submittedById?: StringFieldUpdateOperationsInput | string
    reviewedById?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MusicPlaylistCreateInput = {
    id?: string
    label: string
    url: string
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutMusicPlaylistsCreatedInput
  }

  export type MusicPlaylistUncheckedCreateInput = {
    id?: string
    label: string
    url: string
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MusicPlaylistUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutMusicPlaylistsCreatedNestedInput
  }

  export type MusicPlaylistUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MusicPlaylistCreateManyInput = {
    id?: string
    label: string
    url: string
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MusicPlaylistUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MusicPlaylistUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TierListListRelationFilter = {
    every?: TierListWhereInput
    some?: TierListWhereInput
    none?: TierListWhereInput
  }

  export type TierListVoteListRelationFilter = {
    every?: TierListVoteWhereInput
    some?: TierListVoteWhereInput
    none?: TierListVoteWhereInput
  }

  export type LinkSuggestionListRelationFilter = {
    every?: LinkSuggestionWhereInput
    some?: LinkSuggestionWhereInput
    none?: LinkSuggestionWhereInput
  }

  export type MusicPlaylistListRelationFilter = {
    every?: MusicPlaylistWhereInput
    some?: MusicPlaylistWhereInput
    none?: MusicPlaylistWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TierListOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TierListVoteOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LinkSuggestionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MusicPlaylistOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    passwordHash?: SortOrder
    role?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TierListItemListRelationFilter = {
    every?: TierListItemWhereInput
    some?: TierListItemWhereInput
    none?: TierListItemWhereInput
  }

  export type TierListItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TierListCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    anime?: SortOrder
    category?: SortOrder
    resourceUrl?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TierListMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    anime?: SortOrder
    category?: SortOrder
    resourceUrl?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TierListMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    anime?: SortOrder
    category?: SortOrder
    resourceUrl?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumTierRankFilter<$PrismaModel = never> = {
    equals?: $Enums.TierRank | EnumTierRankFieldRefInput<$PrismaModel>
    in?: $Enums.TierRank[]
    notIn?: $Enums.TierRank[]
    not?: NestedEnumTierRankFilter<$PrismaModel> | $Enums.TierRank
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type TierListScalarRelationFilter = {
    is?: TierListWhereInput
    isNot?: TierListWhereInput
  }

  export type TierListItemCountOrderByAggregateInput = {
    id?: SortOrder
    tierListId?: SortOrder
    label?: SortOrder
    rank?: SortOrder
    linkUrl?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
  }

  export type TierListItemAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type TierListItemMaxOrderByAggregateInput = {
    id?: SortOrder
    tierListId?: SortOrder
    label?: SortOrder
    rank?: SortOrder
    linkUrl?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
  }

  export type TierListItemMinOrderByAggregateInput = {
    id?: SortOrder
    tierListId?: SortOrder
    label?: SortOrder
    rank?: SortOrder
    linkUrl?: SortOrder
    sortOrder?: SortOrder
    createdAt?: SortOrder
  }

  export type TierListItemSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type EnumTierRankWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TierRank | EnumTierRankFieldRefInput<$PrismaModel>
    in?: $Enums.TierRank[]
    notIn?: $Enums.TierRank[]
    not?: NestedEnumTierRankWithAggregatesFilter<$PrismaModel> | $Enums.TierRank
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTierRankFilter<$PrismaModel>
    _max?: NestedEnumTierRankFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type TierListVoteTierListIdUserIdCompoundUniqueInput = {
    tierListId: string
    userId: string
  }

  export type TierListVoteCountOrderByAggregateInput = {
    id?: SortOrder
    tierListId?: SortOrder
    userId?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type TierListVoteAvgOrderByAggregateInput = {
    value?: SortOrder
  }

  export type TierListVoteMaxOrderByAggregateInput = {
    id?: SortOrder
    tierListId?: SortOrder
    userId?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type TierListVoteMinOrderByAggregateInput = {
    id?: SortOrder
    tierListId?: SortOrder
    userId?: SortOrder
    value?: SortOrder
    createdAt?: SortOrder
  }

  export type TierListVoteSumOrderByAggregateInput = {
    value?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SiteConfigCountOrderByAggregateInput = {
    id?: SortOrder
    liveTvEnabled?: SortOrder
    updatedAt?: SortOrder
  }

  export type SiteConfigAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SiteConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    liveTvEnabled?: SortOrder
    updatedAt?: SortOrder
  }

  export type SiteConfigMinOrderByAggregateInput = {
    id?: SortOrder
    liveTvEnabled?: SortOrder
    updatedAt?: SortOrder
  }

  export type SiteConfigSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumLinkSuggestionKindFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkSuggestionKind | EnumLinkSuggestionKindFieldRefInput<$PrismaModel>
    in?: $Enums.LinkSuggestionKind[]
    notIn?: $Enums.LinkSuggestionKind[]
    not?: NestedEnumLinkSuggestionKindFilter<$PrismaModel> | $Enums.LinkSuggestionKind
  }

  export type EnumSuggestionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SuggestionStatus | EnumSuggestionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SuggestionStatus[]
    notIn?: $Enums.SuggestionStatus[]
    not?: NestedEnumSuggestionStatusFilter<$PrismaModel> | $Enums.SuggestionStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TierListNullableScalarRelationFilter = {
    is?: TierListWhereInput | null
    isNot?: TierListWhereInput | null
  }

  export type TierListItemNullableScalarRelationFilter = {
    is?: TierListItemWhereInput | null
    isNot?: TierListItemWhereInput | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type LinkSuggestionCountOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    tierListId?: SortOrder
    tierListItemId?: SortOrder
    url?: SortOrder
    title?: SortOrder
    note?: SortOrder
    status?: SortOrder
    submittedById?: SortOrder
    reviewedById?: SortOrder
    reviewedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LinkSuggestionMaxOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    tierListId?: SortOrder
    tierListItemId?: SortOrder
    url?: SortOrder
    title?: SortOrder
    note?: SortOrder
    status?: SortOrder
    submittedById?: SortOrder
    reviewedById?: SortOrder
    reviewedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type LinkSuggestionMinOrderByAggregateInput = {
    id?: SortOrder
    kind?: SortOrder
    tierListId?: SortOrder
    tierListItemId?: SortOrder
    url?: SortOrder
    title?: SortOrder
    note?: SortOrder
    status?: SortOrder
    submittedById?: SortOrder
    reviewedById?: SortOrder
    reviewedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type EnumLinkSuggestionKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkSuggestionKind | EnumLinkSuggestionKindFieldRefInput<$PrismaModel>
    in?: $Enums.LinkSuggestionKind[]
    notIn?: $Enums.LinkSuggestionKind[]
    not?: NestedEnumLinkSuggestionKindWithAggregatesFilter<$PrismaModel> | $Enums.LinkSuggestionKind
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLinkSuggestionKindFilter<$PrismaModel>
    _max?: NestedEnumLinkSuggestionKindFilter<$PrismaModel>
  }

  export type EnumSuggestionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SuggestionStatus | EnumSuggestionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SuggestionStatus[]
    notIn?: $Enums.SuggestionStatus[]
    not?: NestedEnumSuggestionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SuggestionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSuggestionStatusFilter<$PrismaModel>
    _max?: NestedEnumSuggestionStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type MusicPlaylistCountOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    url?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MusicPlaylistMaxOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    url?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MusicPlaylistMinOrderByAggregateInput = {
    id?: SortOrder
    label?: SortOrder
    url?: SortOrder
    createdById?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TierListCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<TierListCreateWithoutCreatedByInput, TierListUncheckedCreateWithoutCreatedByInput> | TierListCreateWithoutCreatedByInput[] | TierListUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TierListCreateOrConnectWithoutCreatedByInput | TierListCreateOrConnectWithoutCreatedByInput[]
    createMany?: TierListCreateManyCreatedByInputEnvelope
    connect?: TierListWhereUniqueInput | TierListWhereUniqueInput[]
  }

  export type TierListVoteCreateNestedManyWithoutUserInput = {
    create?: XOR<TierListVoteCreateWithoutUserInput, TierListVoteUncheckedCreateWithoutUserInput> | TierListVoteCreateWithoutUserInput[] | TierListVoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TierListVoteCreateOrConnectWithoutUserInput | TierListVoteCreateOrConnectWithoutUserInput[]
    createMany?: TierListVoteCreateManyUserInputEnvelope
    connect?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
  }

  export type LinkSuggestionCreateNestedManyWithoutSubmittedByInput = {
    create?: XOR<LinkSuggestionCreateWithoutSubmittedByInput, LinkSuggestionUncheckedCreateWithoutSubmittedByInput> | LinkSuggestionCreateWithoutSubmittedByInput[] | LinkSuggestionUncheckedCreateWithoutSubmittedByInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutSubmittedByInput | LinkSuggestionCreateOrConnectWithoutSubmittedByInput[]
    createMany?: LinkSuggestionCreateManySubmittedByInputEnvelope
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
  }

  export type LinkSuggestionCreateNestedManyWithoutReviewedByInput = {
    create?: XOR<LinkSuggestionCreateWithoutReviewedByInput, LinkSuggestionUncheckedCreateWithoutReviewedByInput> | LinkSuggestionCreateWithoutReviewedByInput[] | LinkSuggestionUncheckedCreateWithoutReviewedByInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutReviewedByInput | LinkSuggestionCreateOrConnectWithoutReviewedByInput[]
    createMany?: LinkSuggestionCreateManyReviewedByInputEnvelope
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
  }

  export type MusicPlaylistCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<MusicPlaylistCreateWithoutCreatedByInput, MusicPlaylistUncheckedCreateWithoutCreatedByInput> | MusicPlaylistCreateWithoutCreatedByInput[] | MusicPlaylistUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: MusicPlaylistCreateOrConnectWithoutCreatedByInput | MusicPlaylistCreateOrConnectWithoutCreatedByInput[]
    createMany?: MusicPlaylistCreateManyCreatedByInputEnvelope
    connect?: MusicPlaylistWhereUniqueInput | MusicPlaylistWhereUniqueInput[]
  }

  export type TierListUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<TierListCreateWithoutCreatedByInput, TierListUncheckedCreateWithoutCreatedByInput> | TierListCreateWithoutCreatedByInput[] | TierListUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TierListCreateOrConnectWithoutCreatedByInput | TierListCreateOrConnectWithoutCreatedByInput[]
    createMany?: TierListCreateManyCreatedByInputEnvelope
    connect?: TierListWhereUniqueInput | TierListWhereUniqueInput[]
  }

  export type TierListVoteUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<TierListVoteCreateWithoutUserInput, TierListVoteUncheckedCreateWithoutUserInput> | TierListVoteCreateWithoutUserInput[] | TierListVoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TierListVoteCreateOrConnectWithoutUserInput | TierListVoteCreateOrConnectWithoutUserInput[]
    createMany?: TierListVoteCreateManyUserInputEnvelope
    connect?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
  }

  export type LinkSuggestionUncheckedCreateNestedManyWithoutSubmittedByInput = {
    create?: XOR<LinkSuggestionCreateWithoutSubmittedByInput, LinkSuggestionUncheckedCreateWithoutSubmittedByInput> | LinkSuggestionCreateWithoutSubmittedByInput[] | LinkSuggestionUncheckedCreateWithoutSubmittedByInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutSubmittedByInput | LinkSuggestionCreateOrConnectWithoutSubmittedByInput[]
    createMany?: LinkSuggestionCreateManySubmittedByInputEnvelope
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
  }

  export type LinkSuggestionUncheckedCreateNestedManyWithoutReviewedByInput = {
    create?: XOR<LinkSuggestionCreateWithoutReviewedByInput, LinkSuggestionUncheckedCreateWithoutReviewedByInput> | LinkSuggestionCreateWithoutReviewedByInput[] | LinkSuggestionUncheckedCreateWithoutReviewedByInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutReviewedByInput | LinkSuggestionCreateOrConnectWithoutReviewedByInput[]
    createMany?: LinkSuggestionCreateManyReviewedByInputEnvelope
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
  }

  export type MusicPlaylistUncheckedCreateNestedManyWithoutCreatedByInput = {
    create?: XOR<MusicPlaylistCreateWithoutCreatedByInput, MusicPlaylistUncheckedCreateWithoutCreatedByInput> | MusicPlaylistCreateWithoutCreatedByInput[] | MusicPlaylistUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: MusicPlaylistCreateOrConnectWithoutCreatedByInput | MusicPlaylistCreateOrConnectWithoutCreatedByInput[]
    createMany?: MusicPlaylistCreateManyCreatedByInputEnvelope
    connect?: MusicPlaylistWhereUniqueInput | MusicPlaylistWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TierListUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<TierListCreateWithoutCreatedByInput, TierListUncheckedCreateWithoutCreatedByInput> | TierListCreateWithoutCreatedByInput[] | TierListUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TierListCreateOrConnectWithoutCreatedByInput | TierListCreateOrConnectWithoutCreatedByInput[]
    upsert?: TierListUpsertWithWhereUniqueWithoutCreatedByInput | TierListUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: TierListCreateManyCreatedByInputEnvelope
    set?: TierListWhereUniqueInput | TierListWhereUniqueInput[]
    disconnect?: TierListWhereUniqueInput | TierListWhereUniqueInput[]
    delete?: TierListWhereUniqueInput | TierListWhereUniqueInput[]
    connect?: TierListWhereUniqueInput | TierListWhereUniqueInput[]
    update?: TierListUpdateWithWhereUniqueWithoutCreatedByInput | TierListUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: TierListUpdateManyWithWhereWithoutCreatedByInput | TierListUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: TierListScalarWhereInput | TierListScalarWhereInput[]
  }

  export type TierListVoteUpdateManyWithoutUserNestedInput = {
    create?: XOR<TierListVoteCreateWithoutUserInput, TierListVoteUncheckedCreateWithoutUserInput> | TierListVoteCreateWithoutUserInput[] | TierListVoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TierListVoteCreateOrConnectWithoutUserInput | TierListVoteCreateOrConnectWithoutUserInput[]
    upsert?: TierListVoteUpsertWithWhereUniqueWithoutUserInput | TierListVoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TierListVoteCreateManyUserInputEnvelope
    set?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    disconnect?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    delete?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    connect?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    update?: TierListVoteUpdateWithWhereUniqueWithoutUserInput | TierListVoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TierListVoteUpdateManyWithWhereWithoutUserInput | TierListVoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TierListVoteScalarWhereInput | TierListVoteScalarWhereInput[]
  }

  export type LinkSuggestionUpdateManyWithoutSubmittedByNestedInput = {
    create?: XOR<LinkSuggestionCreateWithoutSubmittedByInput, LinkSuggestionUncheckedCreateWithoutSubmittedByInput> | LinkSuggestionCreateWithoutSubmittedByInput[] | LinkSuggestionUncheckedCreateWithoutSubmittedByInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutSubmittedByInput | LinkSuggestionCreateOrConnectWithoutSubmittedByInput[]
    upsert?: LinkSuggestionUpsertWithWhereUniqueWithoutSubmittedByInput | LinkSuggestionUpsertWithWhereUniqueWithoutSubmittedByInput[]
    createMany?: LinkSuggestionCreateManySubmittedByInputEnvelope
    set?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    disconnect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    delete?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    update?: LinkSuggestionUpdateWithWhereUniqueWithoutSubmittedByInput | LinkSuggestionUpdateWithWhereUniqueWithoutSubmittedByInput[]
    updateMany?: LinkSuggestionUpdateManyWithWhereWithoutSubmittedByInput | LinkSuggestionUpdateManyWithWhereWithoutSubmittedByInput[]
    deleteMany?: LinkSuggestionScalarWhereInput | LinkSuggestionScalarWhereInput[]
  }

  export type LinkSuggestionUpdateManyWithoutReviewedByNestedInput = {
    create?: XOR<LinkSuggestionCreateWithoutReviewedByInput, LinkSuggestionUncheckedCreateWithoutReviewedByInput> | LinkSuggestionCreateWithoutReviewedByInput[] | LinkSuggestionUncheckedCreateWithoutReviewedByInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutReviewedByInput | LinkSuggestionCreateOrConnectWithoutReviewedByInput[]
    upsert?: LinkSuggestionUpsertWithWhereUniqueWithoutReviewedByInput | LinkSuggestionUpsertWithWhereUniqueWithoutReviewedByInput[]
    createMany?: LinkSuggestionCreateManyReviewedByInputEnvelope
    set?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    disconnect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    delete?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    update?: LinkSuggestionUpdateWithWhereUniqueWithoutReviewedByInput | LinkSuggestionUpdateWithWhereUniqueWithoutReviewedByInput[]
    updateMany?: LinkSuggestionUpdateManyWithWhereWithoutReviewedByInput | LinkSuggestionUpdateManyWithWhereWithoutReviewedByInput[]
    deleteMany?: LinkSuggestionScalarWhereInput | LinkSuggestionScalarWhereInput[]
  }

  export type MusicPlaylistUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<MusicPlaylistCreateWithoutCreatedByInput, MusicPlaylistUncheckedCreateWithoutCreatedByInput> | MusicPlaylistCreateWithoutCreatedByInput[] | MusicPlaylistUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: MusicPlaylistCreateOrConnectWithoutCreatedByInput | MusicPlaylistCreateOrConnectWithoutCreatedByInput[]
    upsert?: MusicPlaylistUpsertWithWhereUniqueWithoutCreatedByInput | MusicPlaylistUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: MusicPlaylistCreateManyCreatedByInputEnvelope
    set?: MusicPlaylistWhereUniqueInput | MusicPlaylistWhereUniqueInput[]
    disconnect?: MusicPlaylistWhereUniqueInput | MusicPlaylistWhereUniqueInput[]
    delete?: MusicPlaylistWhereUniqueInput | MusicPlaylistWhereUniqueInput[]
    connect?: MusicPlaylistWhereUniqueInput | MusicPlaylistWhereUniqueInput[]
    update?: MusicPlaylistUpdateWithWhereUniqueWithoutCreatedByInput | MusicPlaylistUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: MusicPlaylistUpdateManyWithWhereWithoutCreatedByInput | MusicPlaylistUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: MusicPlaylistScalarWhereInput | MusicPlaylistScalarWhereInput[]
  }

  export type TierListUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<TierListCreateWithoutCreatedByInput, TierListUncheckedCreateWithoutCreatedByInput> | TierListCreateWithoutCreatedByInput[] | TierListUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: TierListCreateOrConnectWithoutCreatedByInput | TierListCreateOrConnectWithoutCreatedByInput[]
    upsert?: TierListUpsertWithWhereUniqueWithoutCreatedByInput | TierListUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: TierListCreateManyCreatedByInputEnvelope
    set?: TierListWhereUniqueInput | TierListWhereUniqueInput[]
    disconnect?: TierListWhereUniqueInput | TierListWhereUniqueInput[]
    delete?: TierListWhereUniqueInput | TierListWhereUniqueInput[]
    connect?: TierListWhereUniqueInput | TierListWhereUniqueInput[]
    update?: TierListUpdateWithWhereUniqueWithoutCreatedByInput | TierListUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: TierListUpdateManyWithWhereWithoutCreatedByInput | TierListUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: TierListScalarWhereInput | TierListScalarWhereInput[]
  }

  export type TierListVoteUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<TierListVoteCreateWithoutUserInput, TierListVoteUncheckedCreateWithoutUserInput> | TierListVoteCreateWithoutUserInput[] | TierListVoteUncheckedCreateWithoutUserInput[]
    connectOrCreate?: TierListVoteCreateOrConnectWithoutUserInput | TierListVoteCreateOrConnectWithoutUserInput[]
    upsert?: TierListVoteUpsertWithWhereUniqueWithoutUserInput | TierListVoteUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: TierListVoteCreateManyUserInputEnvelope
    set?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    disconnect?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    delete?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    connect?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    update?: TierListVoteUpdateWithWhereUniqueWithoutUserInput | TierListVoteUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: TierListVoteUpdateManyWithWhereWithoutUserInput | TierListVoteUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: TierListVoteScalarWhereInput | TierListVoteScalarWhereInput[]
  }

  export type LinkSuggestionUncheckedUpdateManyWithoutSubmittedByNestedInput = {
    create?: XOR<LinkSuggestionCreateWithoutSubmittedByInput, LinkSuggestionUncheckedCreateWithoutSubmittedByInput> | LinkSuggestionCreateWithoutSubmittedByInput[] | LinkSuggestionUncheckedCreateWithoutSubmittedByInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutSubmittedByInput | LinkSuggestionCreateOrConnectWithoutSubmittedByInput[]
    upsert?: LinkSuggestionUpsertWithWhereUniqueWithoutSubmittedByInput | LinkSuggestionUpsertWithWhereUniqueWithoutSubmittedByInput[]
    createMany?: LinkSuggestionCreateManySubmittedByInputEnvelope
    set?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    disconnect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    delete?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    update?: LinkSuggestionUpdateWithWhereUniqueWithoutSubmittedByInput | LinkSuggestionUpdateWithWhereUniqueWithoutSubmittedByInput[]
    updateMany?: LinkSuggestionUpdateManyWithWhereWithoutSubmittedByInput | LinkSuggestionUpdateManyWithWhereWithoutSubmittedByInput[]
    deleteMany?: LinkSuggestionScalarWhereInput | LinkSuggestionScalarWhereInput[]
  }

  export type LinkSuggestionUncheckedUpdateManyWithoutReviewedByNestedInput = {
    create?: XOR<LinkSuggestionCreateWithoutReviewedByInput, LinkSuggestionUncheckedCreateWithoutReviewedByInput> | LinkSuggestionCreateWithoutReviewedByInput[] | LinkSuggestionUncheckedCreateWithoutReviewedByInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutReviewedByInput | LinkSuggestionCreateOrConnectWithoutReviewedByInput[]
    upsert?: LinkSuggestionUpsertWithWhereUniqueWithoutReviewedByInput | LinkSuggestionUpsertWithWhereUniqueWithoutReviewedByInput[]
    createMany?: LinkSuggestionCreateManyReviewedByInputEnvelope
    set?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    disconnect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    delete?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    update?: LinkSuggestionUpdateWithWhereUniqueWithoutReviewedByInput | LinkSuggestionUpdateWithWhereUniqueWithoutReviewedByInput[]
    updateMany?: LinkSuggestionUpdateManyWithWhereWithoutReviewedByInput | LinkSuggestionUpdateManyWithWhereWithoutReviewedByInput[]
    deleteMany?: LinkSuggestionScalarWhereInput | LinkSuggestionScalarWhereInput[]
  }

  export type MusicPlaylistUncheckedUpdateManyWithoutCreatedByNestedInput = {
    create?: XOR<MusicPlaylistCreateWithoutCreatedByInput, MusicPlaylistUncheckedCreateWithoutCreatedByInput> | MusicPlaylistCreateWithoutCreatedByInput[] | MusicPlaylistUncheckedCreateWithoutCreatedByInput[]
    connectOrCreate?: MusicPlaylistCreateOrConnectWithoutCreatedByInput | MusicPlaylistCreateOrConnectWithoutCreatedByInput[]
    upsert?: MusicPlaylistUpsertWithWhereUniqueWithoutCreatedByInput | MusicPlaylistUpsertWithWhereUniqueWithoutCreatedByInput[]
    createMany?: MusicPlaylistCreateManyCreatedByInputEnvelope
    set?: MusicPlaylistWhereUniqueInput | MusicPlaylistWhereUniqueInput[]
    disconnect?: MusicPlaylistWhereUniqueInput | MusicPlaylistWhereUniqueInput[]
    delete?: MusicPlaylistWhereUniqueInput | MusicPlaylistWhereUniqueInput[]
    connect?: MusicPlaylistWhereUniqueInput | MusicPlaylistWhereUniqueInput[]
    update?: MusicPlaylistUpdateWithWhereUniqueWithoutCreatedByInput | MusicPlaylistUpdateWithWhereUniqueWithoutCreatedByInput[]
    updateMany?: MusicPlaylistUpdateManyWithWhereWithoutCreatedByInput | MusicPlaylistUpdateManyWithWhereWithoutCreatedByInput[]
    deleteMany?: MusicPlaylistScalarWhereInput | MusicPlaylistScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutTierListsInput = {
    create?: XOR<UserCreateWithoutTierListsInput, UserUncheckedCreateWithoutTierListsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTierListsInput
    connect?: UserWhereUniqueInput
  }

  export type TierListItemCreateNestedManyWithoutTierListInput = {
    create?: XOR<TierListItemCreateWithoutTierListInput, TierListItemUncheckedCreateWithoutTierListInput> | TierListItemCreateWithoutTierListInput[] | TierListItemUncheckedCreateWithoutTierListInput[]
    connectOrCreate?: TierListItemCreateOrConnectWithoutTierListInput | TierListItemCreateOrConnectWithoutTierListInput[]
    createMany?: TierListItemCreateManyTierListInputEnvelope
    connect?: TierListItemWhereUniqueInput | TierListItemWhereUniqueInput[]
  }

  export type TierListVoteCreateNestedManyWithoutTierListInput = {
    create?: XOR<TierListVoteCreateWithoutTierListInput, TierListVoteUncheckedCreateWithoutTierListInput> | TierListVoteCreateWithoutTierListInput[] | TierListVoteUncheckedCreateWithoutTierListInput[]
    connectOrCreate?: TierListVoteCreateOrConnectWithoutTierListInput | TierListVoteCreateOrConnectWithoutTierListInput[]
    createMany?: TierListVoteCreateManyTierListInputEnvelope
    connect?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
  }

  export type LinkSuggestionCreateNestedManyWithoutTierListInput = {
    create?: XOR<LinkSuggestionCreateWithoutTierListInput, LinkSuggestionUncheckedCreateWithoutTierListInput> | LinkSuggestionCreateWithoutTierListInput[] | LinkSuggestionUncheckedCreateWithoutTierListInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutTierListInput | LinkSuggestionCreateOrConnectWithoutTierListInput[]
    createMany?: LinkSuggestionCreateManyTierListInputEnvelope
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
  }

  export type TierListItemUncheckedCreateNestedManyWithoutTierListInput = {
    create?: XOR<TierListItemCreateWithoutTierListInput, TierListItemUncheckedCreateWithoutTierListInput> | TierListItemCreateWithoutTierListInput[] | TierListItemUncheckedCreateWithoutTierListInput[]
    connectOrCreate?: TierListItemCreateOrConnectWithoutTierListInput | TierListItemCreateOrConnectWithoutTierListInput[]
    createMany?: TierListItemCreateManyTierListInputEnvelope
    connect?: TierListItemWhereUniqueInput | TierListItemWhereUniqueInput[]
  }

  export type TierListVoteUncheckedCreateNestedManyWithoutTierListInput = {
    create?: XOR<TierListVoteCreateWithoutTierListInput, TierListVoteUncheckedCreateWithoutTierListInput> | TierListVoteCreateWithoutTierListInput[] | TierListVoteUncheckedCreateWithoutTierListInput[]
    connectOrCreate?: TierListVoteCreateOrConnectWithoutTierListInput | TierListVoteCreateOrConnectWithoutTierListInput[]
    createMany?: TierListVoteCreateManyTierListInputEnvelope
    connect?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
  }

  export type LinkSuggestionUncheckedCreateNestedManyWithoutTierListInput = {
    create?: XOR<LinkSuggestionCreateWithoutTierListInput, LinkSuggestionUncheckedCreateWithoutTierListInput> | LinkSuggestionCreateWithoutTierListInput[] | LinkSuggestionUncheckedCreateWithoutTierListInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutTierListInput | LinkSuggestionCreateOrConnectWithoutTierListInput[]
    createMany?: LinkSuggestionCreateManyTierListInputEnvelope
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutTierListsNestedInput = {
    create?: XOR<UserCreateWithoutTierListsInput, UserUncheckedCreateWithoutTierListsInput>
    connectOrCreate?: UserCreateOrConnectWithoutTierListsInput
    upsert?: UserUpsertWithoutTierListsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTierListsInput, UserUpdateWithoutTierListsInput>, UserUncheckedUpdateWithoutTierListsInput>
  }

  export type TierListItemUpdateManyWithoutTierListNestedInput = {
    create?: XOR<TierListItemCreateWithoutTierListInput, TierListItemUncheckedCreateWithoutTierListInput> | TierListItemCreateWithoutTierListInput[] | TierListItemUncheckedCreateWithoutTierListInput[]
    connectOrCreate?: TierListItemCreateOrConnectWithoutTierListInput | TierListItemCreateOrConnectWithoutTierListInput[]
    upsert?: TierListItemUpsertWithWhereUniqueWithoutTierListInput | TierListItemUpsertWithWhereUniqueWithoutTierListInput[]
    createMany?: TierListItemCreateManyTierListInputEnvelope
    set?: TierListItemWhereUniqueInput | TierListItemWhereUniqueInput[]
    disconnect?: TierListItemWhereUniqueInput | TierListItemWhereUniqueInput[]
    delete?: TierListItemWhereUniqueInput | TierListItemWhereUniqueInput[]
    connect?: TierListItemWhereUniqueInput | TierListItemWhereUniqueInput[]
    update?: TierListItemUpdateWithWhereUniqueWithoutTierListInput | TierListItemUpdateWithWhereUniqueWithoutTierListInput[]
    updateMany?: TierListItemUpdateManyWithWhereWithoutTierListInput | TierListItemUpdateManyWithWhereWithoutTierListInput[]
    deleteMany?: TierListItemScalarWhereInput | TierListItemScalarWhereInput[]
  }

  export type TierListVoteUpdateManyWithoutTierListNestedInput = {
    create?: XOR<TierListVoteCreateWithoutTierListInput, TierListVoteUncheckedCreateWithoutTierListInput> | TierListVoteCreateWithoutTierListInput[] | TierListVoteUncheckedCreateWithoutTierListInput[]
    connectOrCreate?: TierListVoteCreateOrConnectWithoutTierListInput | TierListVoteCreateOrConnectWithoutTierListInput[]
    upsert?: TierListVoteUpsertWithWhereUniqueWithoutTierListInput | TierListVoteUpsertWithWhereUniqueWithoutTierListInput[]
    createMany?: TierListVoteCreateManyTierListInputEnvelope
    set?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    disconnect?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    delete?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    connect?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    update?: TierListVoteUpdateWithWhereUniqueWithoutTierListInput | TierListVoteUpdateWithWhereUniqueWithoutTierListInput[]
    updateMany?: TierListVoteUpdateManyWithWhereWithoutTierListInput | TierListVoteUpdateManyWithWhereWithoutTierListInput[]
    deleteMany?: TierListVoteScalarWhereInput | TierListVoteScalarWhereInput[]
  }

  export type LinkSuggestionUpdateManyWithoutTierListNestedInput = {
    create?: XOR<LinkSuggestionCreateWithoutTierListInput, LinkSuggestionUncheckedCreateWithoutTierListInput> | LinkSuggestionCreateWithoutTierListInput[] | LinkSuggestionUncheckedCreateWithoutTierListInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutTierListInput | LinkSuggestionCreateOrConnectWithoutTierListInput[]
    upsert?: LinkSuggestionUpsertWithWhereUniqueWithoutTierListInput | LinkSuggestionUpsertWithWhereUniqueWithoutTierListInput[]
    createMany?: LinkSuggestionCreateManyTierListInputEnvelope
    set?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    disconnect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    delete?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    update?: LinkSuggestionUpdateWithWhereUniqueWithoutTierListInput | LinkSuggestionUpdateWithWhereUniqueWithoutTierListInput[]
    updateMany?: LinkSuggestionUpdateManyWithWhereWithoutTierListInput | LinkSuggestionUpdateManyWithWhereWithoutTierListInput[]
    deleteMany?: LinkSuggestionScalarWhereInput | LinkSuggestionScalarWhereInput[]
  }

  export type TierListItemUncheckedUpdateManyWithoutTierListNestedInput = {
    create?: XOR<TierListItemCreateWithoutTierListInput, TierListItemUncheckedCreateWithoutTierListInput> | TierListItemCreateWithoutTierListInput[] | TierListItemUncheckedCreateWithoutTierListInput[]
    connectOrCreate?: TierListItemCreateOrConnectWithoutTierListInput | TierListItemCreateOrConnectWithoutTierListInput[]
    upsert?: TierListItemUpsertWithWhereUniqueWithoutTierListInput | TierListItemUpsertWithWhereUniqueWithoutTierListInput[]
    createMany?: TierListItemCreateManyTierListInputEnvelope
    set?: TierListItemWhereUniqueInput | TierListItemWhereUniqueInput[]
    disconnect?: TierListItemWhereUniqueInput | TierListItemWhereUniqueInput[]
    delete?: TierListItemWhereUniqueInput | TierListItemWhereUniqueInput[]
    connect?: TierListItemWhereUniqueInput | TierListItemWhereUniqueInput[]
    update?: TierListItemUpdateWithWhereUniqueWithoutTierListInput | TierListItemUpdateWithWhereUniqueWithoutTierListInput[]
    updateMany?: TierListItemUpdateManyWithWhereWithoutTierListInput | TierListItemUpdateManyWithWhereWithoutTierListInput[]
    deleteMany?: TierListItemScalarWhereInput | TierListItemScalarWhereInput[]
  }

  export type TierListVoteUncheckedUpdateManyWithoutTierListNestedInput = {
    create?: XOR<TierListVoteCreateWithoutTierListInput, TierListVoteUncheckedCreateWithoutTierListInput> | TierListVoteCreateWithoutTierListInput[] | TierListVoteUncheckedCreateWithoutTierListInput[]
    connectOrCreate?: TierListVoteCreateOrConnectWithoutTierListInput | TierListVoteCreateOrConnectWithoutTierListInput[]
    upsert?: TierListVoteUpsertWithWhereUniqueWithoutTierListInput | TierListVoteUpsertWithWhereUniqueWithoutTierListInput[]
    createMany?: TierListVoteCreateManyTierListInputEnvelope
    set?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    disconnect?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    delete?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    connect?: TierListVoteWhereUniqueInput | TierListVoteWhereUniqueInput[]
    update?: TierListVoteUpdateWithWhereUniqueWithoutTierListInput | TierListVoteUpdateWithWhereUniqueWithoutTierListInput[]
    updateMany?: TierListVoteUpdateManyWithWhereWithoutTierListInput | TierListVoteUpdateManyWithWhereWithoutTierListInput[]
    deleteMany?: TierListVoteScalarWhereInput | TierListVoteScalarWhereInput[]
  }

  export type LinkSuggestionUncheckedUpdateManyWithoutTierListNestedInput = {
    create?: XOR<LinkSuggestionCreateWithoutTierListInput, LinkSuggestionUncheckedCreateWithoutTierListInput> | LinkSuggestionCreateWithoutTierListInput[] | LinkSuggestionUncheckedCreateWithoutTierListInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutTierListInput | LinkSuggestionCreateOrConnectWithoutTierListInput[]
    upsert?: LinkSuggestionUpsertWithWhereUniqueWithoutTierListInput | LinkSuggestionUpsertWithWhereUniqueWithoutTierListInput[]
    createMany?: LinkSuggestionCreateManyTierListInputEnvelope
    set?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    disconnect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    delete?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    update?: LinkSuggestionUpdateWithWhereUniqueWithoutTierListInput | LinkSuggestionUpdateWithWhereUniqueWithoutTierListInput[]
    updateMany?: LinkSuggestionUpdateManyWithWhereWithoutTierListInput | LinkSuggestionUpdateManyWithWhereWithoutTierListInput[]
    deleteMany?: LinkSuggestionScalarWhereInput | LinkSuggestionScalarWhereInput[]
  }

  export type TierListCreateNestedOneWithoutItemsInput = {
    create?: XOR<TierListCreateWithoutItemsInput, TierListUncheckedCreateWithoutItemsInput>
    connectOrCreate?: TierListCreateOrConnectWithoutItemsInput
    connect?: TierListWhereUniqueInput
  }

  export type LinkSuggestionCreateNestedManyWithoutTierListItemInput = {
    create?: XOR<LinkSuggestionCreateWithoutTierListItemInput, LinkSuggestionUncheckedCreateWithoutTierListItemInput> | LinkSuggestionCreateWithoutTierListItemInput[] | LinkSuggestionUncheckedCreateWithoutTierListItemInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutTierListItemInput | LinkSuggestionCreateOrConnectWithoutTierListItemInput[]
    createMany?: LinkSuggestionCreateManyTierListItemInputEnvelope
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
  }

  export type LinkSuggestionUncheckedCreateNestedManyWithoutTierListItemInput = {
    create?: XOR<LinkSuggestionCreateWithoutTierListItemInput, LinkSuggestionUncheckedCreateWithoutTierListItemInput> | LinkSuggestionCreateWithoutTierListItemInput[] | LinkSuggestionUncheckedCreateWithoutTierListItemInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutTierListItemInput | LinkSuggestionCreateOrConnectWithoutTierListItemInput[]
    createMany?: LinkSuggestionCreateManyTierListItemInputEnvelope
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
  }

  export type EnumTierRankFieldUpdateOperationsInput = {
    set?: $Enums.TierRank
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TierListUpdateOneRequiredWithoutItemsNestedInput = {
    create?: XOR<TierListCreateWithoutItemsInput, TierListUncheckedCreateWithoutItemsInput>
    connectOrCreate?: TierListCreateOrConnectWithoutItemsInput
    upsert?: TierListUpsertWithoutItemsInput
    connect?: TierListWhereUniqueInput
    update?: XOR<XOR<TierListUpdateToOneWithWhereWithoutItemsInput, TierListUpdateWithoutItemsInput>, TierListUncheckedUpdateWithoutItemsInput>
  }

  export type LinkSuggestionUpdateManyWithoutTierListItemNestedInput = {
    create?: XOR<LinkSuggestionCreateWithoutTierListItemInput, LinkSuggestionUncheckedCreateWithoutTierListItemInput> | LinkSuggestionCreateWithoutTierListItemInput[] | LinkSuggestionUncheckedCreateWithoutTierListItemInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutTierListItemInput | LinkSuggestionCreateOrConnectWithoutTierListItemInput[]
    upsert?: LinkSuggestionUpsertWithWhereUniqueWithoutTierListItemInput | LinkSuggestionUpsertWithWhereUniqueWithoutTierListItemInput[]
    createMany?: LinkSuggestionCreateManyTierListItemInputEnvelope
    set?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    disconnect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    delete?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    update?: LinkSuggestionUpdateWithWhereUniqueWithoutTierListItemInput | LinkSuggestionUpdateWithWhereUniqueWithoutTierListItemInput[]
    updateMany?: LinkSuggestionUpdateManyWithWhereWithoutTierListItemInput | LinkSuggestionUpdateManyWithWhereWithoutTierListItemInput[]
    deleteMany?: LinkSuggestionScalarWhereInput | LinkSuggestionScalarWhereInput[]
  }

  export type LinkSuggestionUncheckedUpdateManyWithoutTierListItemNestedInput = {
    create?: XOR<LinkSuggestionCreateWithoutTierListItemInput, LinkSuggestionUncheckedCreateWithoutTierListItemInput> | LinkSuggestionCreateWithoutTierListItemInput[] | LinkSuggestionUncheckedCreateWithoutTierListItemInput[]
    connectOrCreate?: LinkSuggestionCreateOrConnectWithoutTierListItemInput | LinkSuggestionCreateOrConnectWithoutTierListItemInput[]
    upsert?: LinkSuggestionUpsertWithWhereUniqueWithoutTierListItemInput | LinkSuggestionUpsertWithWhereUniqueWithoutTierListItemInput[]
    createMany?: LinkSuggestionCreateManyTierListItemInputEnvelope
    set?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    disconnect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    delete?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    connect?: LinkSuggestionWhereUniqueInput | LinkSuggestionWhereUniqueInput[]
    update?: LinkSuggestionUpdateWithWhereUniqueWithoutTierListItemInput | LinkSuggestionUpdateWithWhereUniqueWithoutTierListItemInput[]
    updateMany?: LinkSuggestionUpdateManyWithWhereWithoutTierListItemInput | LinkSuggestionUpdateManyWithWhereWithoutTierListItemInput[]
    deleteMany?: LinkSuggestionScalarWhereInput | LinkSuggestionScalarWhereInput[]
  }

  export type TierListCreateNestedOneWithoutVotesInput = {
    create?: XOR<TierListCreateWithoutVotesInput, TierListUncheckedCreateWithoutVotesInput>
    connectOrCreate?: TierListCreateOrConnectWithoutVotesInput
    connect?: TierListWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutTierVotesInput = {
    create?: XOR<UserCreateWithoutTierVotesInput, UserUncheckedCreateWithoutTierVotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTierVotesInput
    connect?: UserWhereUniqueInput
  }

  export type TierListUpdateOneRequiredWithoutVotesNestedInput = {
    create?: XOR<TierListCreateWithoutVotesInput, TierListUncheckedCreateWithoutVotesInput>
    connectOrCreate?: TierListCreateOrConnectWithoutVotesInput
    upsert?: TierListUpsertWithoutVotesInput
    connect?: TierListWhereUniqueInput
    update?: XOR<XOR<TierListUpdateToOneWithWhereWithoutVotesInput, TierListUpdateWithoutVotesInput>, TierListUncheckedUpdateWithoutVotesInput>
  }

  export type UserUpdateOneRequiredWithoutTierVotesNestedInput = {
    create?: XOR<UserCreateWithoutTierVotesInput, UserUncheckedCreateWithoutTierVotesInput>
    connectOrCreate?: UserCreateOrConnectWithoutTierVotesInput
    upsert?: UserUpsertWithoutTierVotesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutTierVotesInput, UserUpdateWithoutTierVotesInput>, UserUncheckedUpdateWithoutTierVotesInput>
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type TierListCreateNestedOneWithoutLinkSuggestionsInput = {
    create?: XOR<TierListCreateWithoutLinkSuggestionsInput, TierListUncheckedCreateWithoutLinkSuggestionsInput>
    connectOrCreate?: TierListCreateOrConnectWithoutLinkSuggestionsInput
    connect?: TierListWhereUniqueInput
  }

  export type TierListItemCreateNestedOneWithoutLinkSuggestionsInput = {
    create?: XOR<TierListItemCreateWithoutLinkSuggestionsInput, TierListItemUncheckedCreateWithoutLinkSuggestionsInput>
    connectOrCreate?: TierListItemCreateOrConnectWithoutLinkSuggestionsInput
    connect?: TierListItemWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutLinkSuggestionsSubmittedInput = {
    create?: XOR<UserCreateWithoutLinkSuggestionsSubmittedInput, UserUncheckedCreateWithoutLinkSuggestionsSubmittedInput>
    connectOrCreate?: UserCreateOrConnectWithoutLinkSuggestionsSubmittedInput
    connect?: UserWhereUniqueInput
  }

  export type UserCreateNestedOneWithoutLinkSuggestionsReviewedInput = {
    create?: XOR<UserCreateWithoutLinkSuggestionsReviewedInput, UserUncheckedCreateWithoutLinkSuggestionsReviewedInput>
    connectOrCreate?: UserCreateOrConnectWithoutLinkSuggestionsReviewedInput
    connect?: UserWhereUniqueInput
  }

  export type EnumLinkSuggestionKindFieldUpdateOperationsInput = {
    set?: $Enums.LinkSuggestionKind
  }

  export type EnumSuggestionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SuggestionStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TierListUpdateOneWithoutLinkSuggestionsNestedInput = {
    create?: XOR<TierListCreateWithoutLinkSuggestionsInput, TierListUncheckedCreateWithoutLinkSuggestionsInput>
    connectOrCreate?: TierListCreateOrConnectWithoutLinkSuggestionsInput
    upsert?: TierListUpsertWithoutLinkSuggestionsInput
    disconnect?: TierListWhereInput | boolean
    delete?: TierListWhereInput | boolean
    connect?: TierListWhereUniqueInput
    update?: XOR<XOR<TierListUpdateToOneWithWhereWithoutLinkSuggestionsInput, TierListUpdateWithoutLinkSuggestionsInput>, TierListUncheckedUpdateWithoutLinkSuggestionsInput>
  }

  export type TierListItemUpdateOneWithoutLinkSuggestionsNestedInput = {
    create?: XOR<TierListItemCreateWithoutLinkSuggestionsInput, TierListItemUncheckedCreateWithoutLinkSuggestionsInput>
    connectOrCreate?: TierListItemCreateOrConnectWithoutLinkSuggestionsInput
    upsert?: TierListItemUpsertWithoutLinkSuggestionsInput
    disconnect?: TierListItemWhereInput | boolean
    delete?: TierListItemWhereInput | boolean
    connect?: TierListItemWhereUniqueInput
    update?: XOR<XOR<TierListItemUpdateToOneWithWhereWithoutLinkSuggestionsInput, TierListItemUpdateWithoutLinkSuggestionsInput>, TierListItemUncheckedUpdateWithoutLinkSuggestionsInput>
  }

  export type UserUpdateOneRequiredWithoutLinkSuggestionsSubmittedNestedInput = {
    create?: XOR<UserCreateWithoutLinkSuggestionsSubmittedInput, UserUncheckedCreateWithoutLinkSuggestionsSubmittedInput>
    connectOrCreate?: UserCreateOrConnectWithoutLinkSuggestionsSubmittedInput
    upsert?: UserUpsertWithoutLinkSuggestionsSubmittedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLinkSuggestionsSubmittedInput, UserUpdateWithoutLinkSuggestionsSubmittedInput>, UserUncheckedUpdateWithoutLinkSuggestionsSubmittedInput>
  }

  export type UserUpdateOneWithoutLinkSuggestionsReviewedNestedInput = {
    create?: XOR<UserCreateWithoutLinkSuggestionsReviewedInput, UserUncheckedCreateWithoutLinkSuggestionsReviewedInput>
    connectOrCreate?: UserCreateOrConnectWithoutLinkSuggestionsReviewedInput
    upsert?: UserUpsertWithoutLinkSuggestionsReviewedInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLinkSuggestionsReviewedInput, UserUpdateWithoutLinkSuggestionsReviewedInput>, UserUncheckedUpdateWithoutLinkSuggestionsReviewedInput>
  }

  export type UserCreateNestedOneWithoutMusicPlaylistsCreatedInput = {
    create?: XOR<UserCreateWithoutMusicPlaylistsCreatedInput, UserUncheckedCreateWithoutMusicPlaylistsCreatedInput>
    connectOrCreate?: UserCreateOrConnectWithoutMusicPlaylistsCreatedInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMusicPlaylistsCreatedNestedInput = {
    create?: XOR<UserCreateWithoutMusicPlaylistsCreatedInput, UserUncheckedCreateWithoutMusicPlaylistsCreatedInput>
    connectOrCreate?: UserCreateOrConnectWithoutMusicPlaylistsCreatedInput
    upsert?: UserUpsertWithoutMusicPlaylistsCreatedInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMusicPlaylistsCreatedInput, UserUpdateWithoutMusicPlaylistsCreatedInput>, UserUncheckedUpdateWithoutMusicPlaylistsCreatedInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumTierRankFilter<$PrismaModel = never> = {
    equals?: $Enums.TierRank | EnumTierRankFieldRefInput<$PrismaModel>
    in?: $Enums.TierRank[]
    notIn?: $Enums.TierRank[]
    not?: NestedEnumTierRankFilter<$PrismaModel> | $Enums.TierRank
  }

  export type NestedEnumTierRankWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TierRank | EnumTierRankFieldRefInput<$PrismaModel>
    in?: $Enums.TierRank[]
    notIn?: $Enums.TierRank[]
    not?: NestedEnumTierRankWithAggregatesFilter<$PrismaModel> | $Enums.TierRank
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTierRankFilter<$PrismaModel>
    _max?: NestedEnumTierRankFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumLinkSuggestionKindFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkSuggestionKind | EnumLinkSuggestionKindFieldRefInput<$PrismaModel>
    in?: $Enums.LinkSuggestionKind[]
    notIn?: $Enums.LinkSuggestionKind[]
    not?: NestedEnumLinkSuggestionKindFilter<$PrismaModel> | $Enums.LinkSuggestionKind
  }

  export type NestedEnumSuggestionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SuggestionStatus | EnumSuggestionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SuggestionStatus[]
    notIn?: $Enums.SuggestionStatus[]
    not?: NestedEnumSuggestionStatusFilter<$PrismaModel> | $Enums.SuggestionStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumLinkSuggestionKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkSuggestionKind | EnumLinkSuggestionKindFieldRefInput<$PrismaModel>
    in?: $Enums.LinkSuggestionKind[]
    notIn?: $Enums.LinkSuggestionKind[]
    not?: NestedEnumLinkSuggestionKindWithAggregatesFilter<$PrismaModel> | $Enums.LinkSuggestionKind
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLinkSuggestionKindFilter<$PrismaModel>
    _max?: NestedEnumLinkSuggestionKindFilter<$PrismaModel>
  }

  export type NestedEnumSuggestionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SuggestionStatus | EnumSuggestionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SuggestionStatus[]
    notIn?: $Enums.SuggestionStatus[]
    not?: NestedEnumSuggestionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SuggestionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSuggestionStatusFilter<$PrismaModel>
    _max?: NestedEnumSuggestionStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type TierListCreateWithoutCreatedByInput = {
    id?: string
    title: string
    description?: string | null
    anime?: string | null
    category: string
    resourceUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: TierListItemCreateNestedManyWithoutTierListInput
    votes?: TierListVoteCreateNestedManyWithoutTierListInput
    linkSuggestions?: LinkSuggestionCreateNestedManyWithoutTierListInput
  }

  export type TierListUncheckedCreateWithoutCreatedByInput = {
    id?: string
    title: string
    description?: string | null
    anime?: string | null
    category: string
    resourceUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: TierListItemUncheckedCreateNestedManyWithoutTierListInput
    votes?: TierListVoteUncheckedCreateNestedManyWithoutTierListInput
    linkSuggestions?: LinkSuggestionUncheckedCreateNestedManyWithoutTierListInput
  }

  export type TierListCreateOrConnectWithoutCreatedByInput = {
    where: TierListWhereUniqueInput
    create: XOR<TierListCreateWithoutCreatedByInput, TierListUncheckedCreateWithoutCreatedByInput>
  }

  export type TierListCreateManyCreatedByInputEnvelope = {
    data: TierListCreateManyCreatedByInput | TierListCreateManyCreatedByInput[]
  }

  export type TierListVoteCreateWithoutUserInput = {
    id?: string
    value?: number
    createdAt?: Date | string
    tierList: TierListCreateNestedOneWithoutVotesInput
  }

  export type TierListVoteUncheckedCreateWithoutUserInput = {
    id?: string
    tierListId: string
    value?: number
    createdAt?: Date | string
  }

  export type TierListVoteCreateOrConnectWithoutUserInput = {
    where: TierListVoteWhereUniqueInput
    create: XOR<TierListVoteCreateWithoutUserInput, TierListVoteUncheckedCreateWithoutUserInput>
  }

  export type TierListVoteCreateManyUserInputEnvelope = {
    data: TierListVoteCreateManyUserInput | TierListVoteCreateManyUserInput[]
  }

  export type LinkSuggestionCreateWithoutSubmittedByInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    tierList?: TierListCreateNestedOneWithoutLinkSuggestionsInput
    tierListItem?: TierListItemCreateNestedOneWithoutLinkSuggestionsInput
    reviewedBy?: UserCreateNestedOneWithoutLinkSuggestionsReviewedInput
  }

  export type LinkSuggestionUncheckedCreateWithoutSubmittedByInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    tierListId?: string | null
    tierListItemId?: string | null
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    reviewedById?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LinkSuggestionCreateOrConnectWithoutSubmittedByInput = {
    where: LinkSuggestionWhereUniqueInput
    create: XOR<LinkSuggestionCreateWithoutSubmittedByInput, LinkSuggestionUncheckedCreateWithoutSubmittedByInput>
  }

  export type LinkSuggestionCreateManySubmittedByInputEnvelope = {
    data: LinkSuggestionCreateManySubmittedByInput | LinkSuggestionCreateManySubmittedByInput[]
  }

  export type LinkSuggestionCreateWithoutReviewedByInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    tierList?: TierListCreateNestedOneWithoutLinkSuggestionsInput
    tierListItem?: TierListItemCreateNestedOneWithoutLinkSuggestionsInput
    submittedBy: UserCreateNestedOneWithoutLinkSuggestionsSubmittedInput
  }

  export type LinkSuggestionUncheckedCreateWithoutReviewedByInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    tierListId?: string | null
    tierListItemId?: string | null
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    submittedById: string
    reviewedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LinkSuggestionCreateOrConnectWithoutReviewedByInput = {
    where: LinkSuggestionWhereUniqueInput
    create: XOR<LinkSuggestionCreateWithoutReviewedByInput, LinkSuggestionUncheckedCreateWithoutReviewedByInput>
  }

  export type LinkSuggestionCreateManyReviewedByInputEnvelope = {
    data: LinkSuggestionCreateManyReviewedByInput | LinkSuggestionCreateManyReviewedByInput[]
  }

  export type MusicPlaylistCreateWithoutCreatedByInput = {
    id?: string
    label: string
    url: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MusicPlaylistUncheckedCreateWithoutCreatedByInput = {
    id?: string
    label: string
    url: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MusicPlaylistCreateOrConnectWithoutCreatedByInput = {
    where: MusicPlaylistWhereUniqueInput
    create: XOR<MusicPlaylistCreateWithoutCreatedByInput, MusicPlaylistUncheckedCreateWithoutCreatedByInput>
  }

  export type MusicPlaylistCreateManyCreatedByInputEnvelope = {
    data: MusicPlaylistCreateManyCreatedByInput | MusicPlaylistCreateManyCreatedByInput[]
  }

  export type TierListUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: TierListWhereUniqueInput
    update: XOR<TierListUpdateWithoutCreatedByInput, TierListUncheckedUpdateWithoutCreatedByInput>
    create: XOR<TierListCreateWithoutCreatedByInput, TierListUncheckedCreateWithoutCreatedByInput>
  }

  export type TierListUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: TierListWhereUniqueInput
    data: XOR<TierListUpdateWithoutCreatedByInput, TierListUncheckedUpdateWithoutCreatedByInput>
  }

  export type TierListUpdateManyWithWhereWithoutCreatedByInput = {
    where: TierListScalarWhereInput
    data: XOR<TierListUpdateManyMutationInput, TierListUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type TierListScalarWhereInput = {
    AND?: TierListScalarWhereInput | TierListScalarWhereInput[]
    OR?: TierListScalarWhereInput[]
    NOT?: TierListScalarWhereInput | TierListScalarWhereInput[]
    id?: StringFilter<"TierList"> | string
    title?: StringFilter<"TierList"> | string
    description?: StringNullableFilter<"TierList"> | string | null
    anime?: StringNullableFilter<"TierList"> | string | null
    category?: StringFilter<"TierList"> | string
    resourceUrl?: StringNullableFilter<"TierList"> | string | null
    createdById?: StringFilter<"TierList"> | string
    createdAt?: DateTimeFilter<"TierList"> | Date | string
    updatedAt?: DateTimeFilter<"TierList"> | Date | string
  }

  export type TierListVoteUpsertWithWhereUniqueWithoutUserInput = {
    where: TierListVoteWhereUniqueInput
    update: XOR<TierListVoteUpdateWithoutUserInput, TierListVoteUncheckedUpdateWithoutUserInput>
    create: XOR<TierListVoteCreateWithoutUserInput, TierListVoteUncheckedCreateWithoutUserInput>
  }

  export type TierListVoteUpdateWithWhereUniqueWithoutUserInput = {
    where: TierListVoteWhereUniqueInput
    data: XOR<TierListVoteUpdateWithoutUserInput, TierListVoteUncheckedUpdateWithoutUserInput>
  }

  export type TierListVoteUpdateManyWithWhereWithoutUserInput = {
    where: TierListVoteScalarWhereInput
    data: XOR<TierListVoteUpdateManyMutationInput, TierListVoteUncheckedUpdateManyWithoutUserInput>
  }

  export type TierListVoteScalarWhereInput = {
    AND?: TierListVoteScalarWhereInput | TierListVoteScalarWhereInput[]
    OR?: TierListVoteScalarWhereInput[]
    NOT?: TierListVoteScalarWhereInput | TierListVoteScalarWhereInput[]
    id?: StringFilter<"TierListVote"> | string
    tierListId?: StringFilter<"TierListVote"> | string
    userId?: StringFilter<"TierListVote"> | string
    value?: IntFilter<"TierListVote"> | number
    createdAt?: DateTimeFilter<"TierListVote"> | Date | string
  }

  export type LinkSuggestionUpsertWithWhereUniqueWithoutSubmittedByInput = {
    where: LinkSuggestionWhereUniqueInput
    update: XOR<LinkSuggestionUpdateWithoutSubmittedByInput, LinkSuggestionUncheckedUpdateWithoutSubmittedByInput>
    create: XOR<LinkSuggestionCreateWithoutSubmittedByInput, LinkSuggestionUncheckedCreateWithoutSubmittedByInput>
  }

  export type LinkSuggestionUpdateWithWhereUniqueWithoutSubmittedByInput = {
    where: LinkSuggestionWhereUniqueInput
    data: XOR<LinkSuggestionUpdateWithoutSubmittedByInput, LinkSuggestionUncheckedUpdateWithoutSubmittedByInput>
  }

  export type LinkSuggestionUpdateManyWithWhereWithoutSubmittedByInput = {
    where: LinkSuggestionScalarWhereInput
    data: XOR<LinkSuggestionUpdateManyMutationInput, LinkSuggestionUncheckedUpdateManyWithoutSubmittedByInput>
  }

  export type LinkSuggestionScalarWhereInput = {
    AND?: LinkSuggestionScalarWhereInput | LinkSuggestionScalarWhereInput[]
    OR?: LinkSuggestionScalarWhereInput[]
    NOT?: LinkSuggestionScalarWhereInput | LinkSuggestionScalarWhereInput[]
    id?: StringFilter<"LinkSuggestion"> | string
    kind?: EnumLinkSuggestionKindFilter<"LinkSuggestion"> | $Enums.LinkSuggestionKind
    tierListId?: StringNullableFilter<"LinkSuggestion"> | string | null
    tierListItemId?: StringNullableFilter<"LinkSuggestion"> | string | null
    url?: StringFilter<"LinkSuggestion"> | string
    title?: StringNullableFilter<"LinkSuggestion"> | string | null
    note?: StringNullableFilter<"LinkSuggestion"> | string | null
    status?: EnumSuggestionStatusFilter<"LinkSuggestion"> | $Enums.SuggestionStatus
    submittedById?: StringFilter<"LinkSuggestion"> | string
    reviewedById?: StringNullableFilter<"LinkSuggestion"> | string | null
    reviewedAt?: DateTimeNullableFilter<"LinkSuggestion"> | Date | string | null
    createdAt?: DateTimeFilter<"LinkSuggestion"> | Date | string
  }

  export type LinkSuggestionUpsertWithWhereUniqueWithoutReviewedByInput = {
    where: LinkSuggestionWhereUniqueInput
    update: XOR<LinkSuggestionUpdateWithoutReviewedByInput, LinkSuggestionUncheckedUpdateWithoutReviewedByInput>
    create: XOR<LinkSuggestionCreateWithoutReviewedByInput, LinkSuggestionUncheckedCreateWithoutReviewedByInput>
  }

  export type LinkSuggestionUpdateWithWhereUniqueWithoutReviewedByInput = {
    where: LinkSuggestionWhereUniqueInput
    data: XOR<LinkSuggestionUpdateWithoutReviewedByInput, LinkSuggestionUncheckedUpdateWithoutReviewedByInput>
  }

  export type LinkSuggestionUpdateManyWithWhereWithoutReviewedByInput = {
    where: LinkSuggestionScalarWhereInput
    data: XOR<LinkSuggestionUpdateManyMutationInput, LinkSuggestionUncheckedUpdateManyWithoutReviewedByInput>
  }

  export type MusicPlaylistUpsertWithWhereUniqueWithoutCreatedByInput = {
    where: MusicPlaylistWhereUniqueInput
    update: XOR<MusicPlaylistUpdateWithoutCreatedByInput, MusicPlaylistUncheckedUpdateWithoutCreatedByInput>
    create: XOR<MusicPlaylistCreateWithoutCreatedByInput, MusicPlaylistUncheckedCreateWithoutCreatedByInput>
  }

  export type MusicPlaylistUpdateWithWhereUniqueWithoutCreatedByInput = {
    where: MusicPlaylistWhereUniqueInput
    data: XOR<MusicPlaylistUpdateWithoutCreatedByInput, MusicPlaylistUncheckedUpdateWithoutCreatedByInput>
  }

  export type MusicPlaylistUpdateManyWithWhereWithoutCreatedByInput = {
    where: MusicPlaylistScalarWhereInput
    data: XOR<MusicPlaylistUpdateManyMutationInput, MusicPlaylistUncheckedUpdateManyWithoutCreatedByInput>
  }

  export type MusicPlaylistScalarWhereInput = {
    AND?: MusicPlaylistScalarWhereInput | MusicPlaylistScalarWhereInput[]
    OR?: MusicPlaylistScalarWhereInput[]
    NOT?: MusicPlaylistScalarWhereInput | MusicPlaylistScalarWhereInput[]
    id?: StringFilter<"MusicPlaylist"> | string
    label?: StringFilter<"MusicPlaylist"> | string
    url?: StringFilter<"MusicPlaylist"> | string
    createdById?: StringFilter<"MusicPlaylist"> | string
    createdAt?: DateTimeFilter<"MusicPlaylist"> | Date | string
    updatedAt?: DateTimeFilter<"MusicPlaylist"> | Date | string
  }

  export type UserCreateWithoutTierListsInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    tierVotes?: TierListVoteCreateNestedManyWithoutUserInput
    linkSuggestionsSubmitted?: LinkSuggestionCreateNestedManyWithoutSubmittedByInput
    linkSuggestionsReviewed?: LinkSuggestionCreateNestedManyWithoutReviewedByInput
    musicPlaylistsCreated?: MusicPlaylistCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutTierListsInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    tierVotes?: TierListVoteUncheckedCreateNestedManyWithoutUserInput
    linkSuggestionsSubmitted?: LinkSuggestionUncheckedCreateNestedManyWithoutSubmittedByInput
    linkSuggestionsReviewed?: LinkSuggestionUncheckedCreateNestedManyWithoutReviewedByInput
    musicPlaylistsCreated?: MusicPlaylistUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutTierListsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTierListsInput, UserUncheckedCreateWithoutTierListsInput>
  }

  export type TierListItemCreateWithoutTierListInput = {
    id?: string
    label: string
    rank: $Enums.TierRank
    linkUrl?: string | null
    sortOrder?: number
    createdAt?: Date | string
    linkSuggestions?: LinkSuggestionCreateNestedManyWithoutTierListItemInput
  }

  export type TierListItemUncheckedCreateWithoutTierListInput = {
    id?: string
    label: string
    rank: $Enums.TierRank
    linkUrl?: string | null
    sortOrder?: number
    createdAt?: Date | string
    linkSuggestions?: LinkSuggestionUncheckedCreateNestedManyWithoutTierListItemInput
  }

  export type TierListItemCreateOrConnectWithoutTierListInput = {
    where: TierListItemWhereUniqueInput
    create: XOR<TierListItemCreateWithoutTierListInput, TierListItemUncheckedCreateWithoutTierListInput>
  }

  export type TierListItemCreateManyTierListInputEnvelope = {
    data: TierListItemCreateManyTierListInput | TierListItemCreateManyTierListInput[]
  }

  export type TierListVoteCreateWithoutTierListInput = {
    id?: string
    value?: number
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutTierVotesInput
  }

  export type TierListVoteUncheckedCreateWithoutTierListInput = {
    id?: string
    userId: string
    value?: number
    createdAt?: Date | string
  }

  export type TierListVoteCreateOrConnectWithoutTierListInput = {
    where: TierListVoteWhereUniqueInput
    create: XOR<TierListVoteCreateWithoutTierListInput, TierListVoteUncheckedCreateWithoutTierListInput>
  }

  export type TierListVoteCreateManyTierListInputEnvelope = {
    data: TierListVoteCreateManyTierListInput | TierListVoteCreateManyTierListInput[]
  }

  export type LinkSuggestionCreateWithoutTierListInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    tierListItem?: TierListItemCreateNestedOneWithoutLinkSuggestionsInput
    submittedBy: UserCreateNestedOneWithoutLinkSuggestionsSubmittedInput
    reviewedBy?: UserCreateNestedOneWithoutLinkSuggestionsReviewedInput
  }

  export type LinkSuggestionUncheckedCreateWithoutTierListInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    tierListItemId?: string | null
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    submittedById: string
    reviewedById?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LinkSuggestionCreateOrConnectWithoutTierListInput = {
    where: LinkSuggestionWhereUniqueInput
    create: XOR<LinkSuggestionCreateWithoutTierListInput, LinkSuggestionUncheckedCreateWithoutTierListInput>
  }

  export type LinkSuggestionCreateManyTierListInputEnvelope = {
    data: LinkSuggestionCreateManyTierListInput | LinkSuggestionCreateManyTierListInput[]
  }

  export type UserUpsertWithoutTierListsInput = {
    update: XOR<UserUpdateWithoutTierListsInput, UserUncheckedUpdateWithoutTierListsInput>
    create: XOR<UserCreateWithoutTierListsInput, UserUncheckedCreateWithoutTierListsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTierListsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTierListsInput, UserUncheckedUpdateWithoutTierListsInput>
  }

  export type UserUpdateWithoutTierListsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierVotes?: TierListVoteUpdateManyWithoutUserNestedInput
    linkSuggestionsSubmitted?: LinkSuggestionUpdateManyWithoutSubmittedByNestedInput
    linkSuggestionsReviewed?: LinkSuggestionUpdateManyWithoutReviewedByNestedInput
    musicPlaylistsCreated?: MusicPlaylistUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutTierListsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierVotes?: TierListVoteUncheckedUpdateManyWithoutUserNestedInput
    linkSuggestionsSubmitted?: LinkSuggestionUncheckedUpdateManyWithoutSubmittedByNestedInput
    linkSuggestionsReviewed?: LinkSuggestionUncheckedUpdateManyWithoutReviewedByNestedInput
    musicPlaylistsCreated?: MusicPlaylistUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type TierListItemUpsertWithWhereUniqueWithoutTierListInput = {
    where: TierListItemWhereUniqueInput
    update: XOR<TierListItemUpdateWithoutTierListInput, TierListItemUncheckedUpdateWithoutTierListInput>
    create: XOR<TierListItemCreateWithoutTierListInput, TierListItemUncheckedCreateWithoutTierListInput>
  }

  export type TierListItemUpdateWithWhereUniqueWithoutTierListInput = {
    where: TierListItemWhereUniqueInput
    data: XOR<TierListItemUpdateWithoutTierListInput, TierListItemUncheckedUpdateWithoutTierListInput>
  }

  export type TierListItemUpdateManyWithWhereWithoutTierListInput = {
    where: TierListItemScalarWhereInput
    data: XOR<TierListItemUpdateManyMutationInput, TierListItemUncheckedUpdateManyWithoutTierListInput>
  }

  export type TierListItemScalarWhereInput = {
    AND?: TierListItemScalarWhereInput | TierListItemScalarWhereInput[]
    OR?: TierListItemScalarWhereInput[]
    NOT?: TierListItemScalarWhereInput | TierListItemScalarWhereInput[]
    id?: StringFilter<"TierListItem"> | string
    tierListId?: StringFilter<"TierListItem"> | string
    label?: StringFilter<"TierListItem"> | string
    rank?: EnumTierRankFilter<"TierListItem"> | $Enums.TierRank
    linkUrl?: StringNullableFilter<"TierListItem"> | string | null
    sortOrder?: IntFilter<"TierListItem"> | number
    createdAt?: DateTimeFilter<"TierListItem"> | Date | string
  }

  export type TierListVoteUpsertWithWhereUniqueWithoutTierListInput = {
    where: TierListVoteWhereUniqueInput
    update: XOR<TierListVoteUpdateWithoutTierListInput, TierListVoteUncheckedUpdateWithoutTierListInput>
    create: XOR<TierListVoteCreateWithoutTierListInput, TierListVoteUncheckedCreateWithoutTierListInput>
  }

  export type TierListVoteUpdateWithWhereUniqueWithoutTierListInput = {
    where: TierListVoteWhereUniqueInput
    data: XOR<TierListVoteUpdateWithoutTierListInput, TierListVoteUncheckedUpdateWithoutTierListInput>
  }

  export type TierListVoteUpdateManyWithWhereWithoutTierListInput = {
    where: TierListVoteScalarWhereInput
    data: XOR<TierListVoteUpdateManyMutationInput, TierListVoteUncheckedUpdateManyWithoutTierListInput>
  }

  export type LinkSuggestionUpsertWithWhereUniqueWithoutTierListInput = {
    where: LinkSuggestionWhereUniqueInput
    update: XOR<LinkSuggestionUpdateWithoutTierListInput, LinkSuggestionUncheckedUpdateWithoutTierListInput>
    create: XOR<LinkSuggestionCreateWithoutTierListInput, LinkSuggestionUncheckedCreateWithoutTierListInput>
  }

  export type LinkSuggestionUpdateWithWhereUniqueWithoutTierListInput = {
    where: LinkSuggestionWhereUniqueInput
    data: XOR<LinkSuggestionUpdateWithoutTierListInput, LinkSuggestionUncheckedUpdateWithoutTierListInput>
  }

  export type LinkSuggestionUpdateManyWithWhereWithoutTierListInput = {
    where: LinkSuggestionScalarWhereInput
    data: XOR<LinkSuggestionUpdateManyMutationInput, LinkSuggestionUncheckedUpdateManyWithoutTierListInput>
  }

  export type TierListCreateWithoutItemsInput = {
    id?: string
    title: string
    description?: string | null
    anime?: string | null
    category: string
    resourceUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutTierListsInput
    votes?: TierListVoteCreateNestedManyWithoutTierListInput
    linkSuggestions?: LinkSuggestionCreateNestedManyWithoutTierListInput
  }

  export type TierListUncheckedCreateWithoutItemsInput = {
    id?: string
    title: string
    description?: string | null
    anime?: string | null
    category: string
    resourceUrl?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    votes?: TierListVoteUncheckedCreateNestedManyWithoutTierListInput
    linkSuggestions?: LinkSuggestionUncheckedCreateNestedManyWithoutTierListInput
  }

  export type TierListCreateOrConnectWithoutItemsInput = {
    where: TierListWhereUniqueInput
    create: XOR<TierListCreateWithoutItemsInput, TierListUncheckedCreateWithoutItemsInput>
  }

  export type LinkSuggestionCreateWithoutTierListItemInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    reviewedAt?: Date | string | null
    createdAt?: Date | string
    tierList?: TierListCreateNestedOneWithoutLinkSuggestionsInput
    submittedBy: UserCreateNestedOneWithoutLinkSuggestionsSubmittedInput
    reviewedBy?: UserCreateNestedOneWithoutLinkSuggestionsReviewedInput
  }

  export type LinkSuggestionUncheckedCreateWithoutTierListItemInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    tierListId?: string | null
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    submittedById: string
    reviewedById?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LinkSuggestionCreateOrConnectWithoutTierListItemInput = {
    where: LinkSuggestionWhereUniqueInput
    create: XOR<LinkSuggestionCreateWithoutTierListItemInput, LinkSuggestionUncheckedCreateWithoutTierListItemInput>
  }

  export type LinkSuggestionCreateManyTierListItemInputEnvelope = {
    data: LinkSuggestionCreateManyTierListItemInput | LinkSuggestionCreateManyTierListItemInput[]
  }

  export type TierListUpsertWithoutItemsInput = {
    update: XOR<TierListUpdateWithoutItemsInput, TierListUncheckedUpdateWithoutItemsInput>
    create: XOR<TierListCreateWithoutItemsInput, TierListUncheckedCreateWithoutItemsInput>
    where?: TierListWhereInput
  }

  export type TierListUpdateToOneWithWhereWithoutItemsInput = {
    where?: TierListWhereInput
    data: XOR<TierListUpdateWithoutItemsInput, TierListUncheckedUpdateWithoutItemsInput>
  }

  export type TierListUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutTierListsNestedInput
    votes?: TierListVoteUpdateManyWithoutTierListNestedInput
    linkSuggestions?: LinkSuggestionUpdateManyWithoutTierListNestedInput
  }

  export type TierListUncheckedUpdateWithoutItemsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    votes?: TierListVoteUncheckedUpdateManyWithoutTierListNestedInput
    linkSuggestions?: LinkSuggestionUncheckedUpdateManyWithoutTierListNestedInput
  }

  export type LinkSuggestionUpsertWithWhereUniqueWithoutTierListItemInput = {
    where: LinkSuggestionWhereUniqueInput
    update: XOR<LinkSuggestionUpdateWithoutTierListItemInput, LinkSuggestionUncheckedUpdateWithoutTierListItemInput>
    create: XOR<LinkSuggestionCreateWithoutTierListItemInput, LinkSuggestionUncheckedCreateWithoutTierListItemInput>
  }

  export type LinkSuggestionUpdateWithWhereUniqueWithoutTierListItemInput = {
    where: LinkSuggestionWhereUniqueInput
    data: XOR<LinkSuggestionUpdateWithoutTierListItemInput, LinkSuggestionUncheckedUpdateWithoutTierListItemInput>
  }

  export type LinkSuggestionUpdateManyWithWhereWithoutTierListItemInput = {
    where: LinkSuggestionScalarWhereInput
    data: XOR<LinkSuggestionUpdateManyMutationInput, LinkSuggestionUncheckedUpdateManyWithoutTierListItemInput>
  }

  export type TierListCreateWithoutVotesInput = {
    id?: string
    title: string
    description?: string | null
    anime?: string | null
    category: string
    resourceUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutTierListsInput
    items?: TierListItemCreateNestedManyWithoutTierListInput
    linkSuggestions?: LinkSuggestionCreateNestedManyWithoutTierListInput
  }

  export type TierListUncheckedCreateWithoutVotesInput = {
    id?: string
    title: string
    description?: string | null
    anime?: string | null
    category: string
    resourceUrl?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: TierListItemUncheckedCreateNestedManyWithoutTierListInput
    linkSuggestions?: LinkSuggestionUncheckedCreateNestedManyWithoutTierListInput
  }

  export type TierListCreateOrConnectWithoutVotesInput = {
    where: TierListWhereUniqueInput
    create: XOR<TierListCreateWithoutVotesInput, TierListUncheckedCreateWithoutVotesInput>
  }

  export type UserCreateWithoutTierVotesInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    tierLists?: TierListCreateNestedManyWithoutCreatedByInput
    linkSuggestionsSubmitted?: LinkSuggestionCreateNestedManyWithoutSubmittedByInput
    linkSuggestionsReviewed?: LinkSuggestionCreateNestedManyWithoutReviewedByInput
    musicPlaylistsCreated?: MusicPlaylistCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutTierVotesInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    tierLists?: TierListUncheckedCreateNestedManyWithoutCreatedByInput
    linkSuggestionsSubmitted?: LinkSuggestionUncheckedCreateNestedManyWithoutSubmittedByInput
    linkSuggestionsReviewed?: LinkSuggestionUncheckedCreateNestedManyWithoutReviewedByInput
    musicPlaylistsCreated?: MusicPlaylistUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutTierVotesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutTierVotesInput, UserUncheckedCreateWithoutTierVotesInput>
  }

  export type TierListUpsertWithoutVotesInput = {
    update: XOR<TierListUpdateWithoutVotesInput, TierListUncheckedUpdateWithoutVotesInput>
    create: XOR<TierListCreateWithoutVotesInput, TierListUncheckedCreateWithoutVotesInput>
    where?: TierListWhereInput
  }

  export type TierListUpdateToOneWithWhereWithoutVotesInput = {
    where?: TierListWhereInput
    data: XOR<TierListUpdateWithoutVotesInput, TierListUncheckedUpdateWithoutVotesInput>
  }

  export type TierListUpdateWithoutVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutTierListsNestedInput
    items?: TierListItemUpdateManyWithoutTierListNestedInput
    linkSuggestions?: LinkSuggestionUpdateManyWithoutTierListNestedInput
  }

  export type TierListUncheckedUpdateWithoutVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: TierListItemUncheckedUpdateManyWithoutTierListNestedInput
    linkSuggestions?: LinkSuggestionUncheckedUpdateManyWithoutTierListNestedInput
  }

  export type UserUpsertWithoutTierVotesInput = {
    update: XOR<UserUpdateWithoutTierVotesInput, UserUncheckedUpdateWithoutTierVotesInput>
    create: XOR<UserCreateWithoutTierVotesInput, UserUncheckedCreateWithoutTierVotesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutTierVotesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutTierVotesInput, UserUncheckedUpdateWithoutTierVotesInput>
  }

  export type UserUpdateWithoutTierVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierLists?: TierListUpdateManyWithoutCreatedByNestedInput
    linkSuggestionsSubmitted?: LinkSuggestionUpdateManyWithoutSubmittedByNestedInput
    linkSuggestionsReviewed?: LinkSuggestionUpdateManyWithoutReviewedByNestedInput
    musicPlaylistsCreated?: MusicPlaylistUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutTierVotesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierLists?: TierListUncheckedUpdateManyWithoutCreatedByNestedInput
    linkSuggestionsSubmitted?: LinkSuggestionUncheckedUpdateManyWithoutSubmittedByNestedInput
    linkSuggestionsReviewed?: LinkSuggestionUncheckedUpdateManyWithoutReviewedByNestedInput
    musicPlaylistsCreated?: MusicPlaylistUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type TierListCreateWithoutLinkSuggestionsInput = {
    id?: string
    title: string
    description?: string | null
    anime?: string | null
    category: string
    resourceUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy: UserCreateNestedOneWithoutTierListsInput
    items?: TierListItemCreateNestedManyWithoutTierListInput
    votes?: TierListVoteCreateNestedManyWithoutTierListInput
  }

  export type TierListUncheckedCreateWithoutLinkSuggestionsInput = {
    id?: string
    title: string
    description?: string | null
    anime?: string | null
    category: string
    resourceUrl?: string | null
    createdById: string
    createdAt?: Date | string
    updatedAt?: Date | string
    items?: TierListItemUncheckedCreateNestedManyWithoutTierListInput
    votes?: TierListVoteUncheckedCreateNestedManyWithoutTierListInput
  }

  export type TierListCreateOrConnectWithoutLinkSuggestionsInput = {
    where: TierListWhereUniqueInput
    create: XOR<TierListCreateWithoutLinkSuggestionsInput, TierListUncheckedCreateWithoutLinkSuggestionsInput>
  }

  export type TierListItemCreateWithoutLinkSuggestionsInput = {
    id?: string
    label: string
    rank: $Enums.TierRank
    linkUrl?: string | null
    sortOrder?: number
    createdAt?: Date | string
    tierList: TierListCreateNestedOneWithoutItemsInput
  }

  export type TierListItemUncheckedCreateWithoutLinkSuggestionsInput = {
    id?: string
    tierListId: string
    label: string
    rank: $Enums.TierRank
    linkUrl?: string | null
    sortOrder?: number
    createdAt?: Date | string
  }

  export type TierListItemCreateOrConnectWithoutLinkSuggestionsInput = {
    where: TierListItemWhereUniqueInput
    create: XOR<TierListItemCreateWithoutLinkSuggestionsInput, TierListItemUncheckedCreateWithoutLinkSuggestionsInput>
  }

  export type UserCreateWithoutLinkSuggestionsSubmittedInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    tierLists?: TierListCreateNestedManyWithoutCreatedByInput
    tierVotes?: TierListVoteCreateNestedManyWithoutUserInput
    linkSuggestionsReviewed?: LinkSuggestionCreateNestedManyWithoutReviewedByInput
    musicPlaylistsCreated?: MusicPlaylistCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutLinkSuggestionsSubmittedInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    tierLists?: TierListUncheckedCreateNestedManyWithoutCreatedByInput
    tierVotes?: TierListVoteUncheckedCreateNestedManyWithoutUserInput
    linkSuggestionsReviewed?: LinkSuggestionUncheckedCreateNestedManyWithoutReviewedByInput
    musicPlaylistsCreated?: MusicPlaylistUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutLinkSuggestionsSubmittedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLinkSuggestionsSubmittedInput, UserUncheckedCreateWithoutLinkSuggestionsSubmittedInput>
  }

  export type UserCreateWithoutLinkSuggestionsReviewedInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    tierLists?: TierListCreateNestedManyWithoutCreatedByInput
    tierVotes?: TierListVoteCreateNestedManyWithoutUserInput
    linkSuggestionsSubmitted?: LinkSuggestionCreateNestedManyWithoutSubmittedByInput
    musicPlaylistsCreated?: MusicPlaylistCreateNestedManyWithoutCreatedByInput
  }

  export type UserUncheckedCreateWithoutLinkSuggestionsReviewedInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    tierLists?: TierListUncheckedCreateNestedManyWithoutCreatedByInput
    tierVotes?: TierListVoteUncheckedCreateNestedManyWithoutUserInput
    linkSuggestionsSubmitted?: LinkSuggestionUncheckedCreateNestedManyWithoutSubmittedByInput
    musicPlaylistsCreated?: MusicPlaylistUncheckedCreateNestedManyWithoutCreatedByInput
  }

  export type UserCreateOrConnectWithoutLinkSuggestionsReviewedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLinkSuggestionsReviewedInput, UserUncheckedCreateWithoutLinkSuggestionsReviewedInput>
  }

  export type TierListUpsertWithoutLinkSuggestionsInput = {
    update: XOR<TierListUpdateWithoutLinkSuggestionsInput, TierListUncheckedUpdateWithoutLinkSuggestionsInput>
    create: XOR<TierListCreateWithoutLinkSuggestionsInput, TierListUncheckedCreateWithoutLinkSuggestionsInput>
    where?: TierListWhereInput
  }

  export type TierListUpdateToOneWithWhereWithoutLinkSuggestionsInput = {
    where?: TierListWhereInput
    data: XOR<TierListUpdateWithoutLinkSuggestionsInput, TierListUncheckedUpdateWithoutLinkSuggestionsInput>
  }

  export type TierListUpdateWithoutLinkSuggestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: UserUpdateOneRequiredWithoutTierListsNestedInput
    items?: TierListItemUpdateManyWithoutTierListNestedInput
    votes?: TierListVoteUpdateManyWithoutTierListNestedInput
  }

  export type TierListUncheckedUpdateWithoutLinkSuggestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdById?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: TierListItemUncheckedUpdateManyWithoutTierListNestedInput
    votes?: TierListVoteUncheckedUpdateManyWithoutTierListNestedInput
  }

  export type TierListItemUpsertWithoutLinkSuggestionsInput = {
    update: XOR<TierListItemUpdateWithoutLinkSuggestionsInput, TierListItemUncheckedUpdateWithoutLinkSuggestionsInput>
    create: XOR<TierListItemCreateWithoutLinkSuggestionsInput, TierListItemUncheckedCreateWithoutLinkSuggestionsInput>
    where?: TierListItemWhereInput
  }

  export type TierListItemUpdateToOneWithWhereWithoutLinkSuggestionsInput = {
    where?: TierListItemWhereInput
    data: XOR<TierListItemUpdateWithoutLinkSuggestionsInput, TierListItemUncheckedUpdateWithoutLinkSuggestionsInput>
  }

  export type TierListItemUpdateWithoutLinkSuggestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    rank?: EnumTierRankFieldUpdateOperationsInput | $Enums.TierRank
    linkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierList?: TierListUpdateOneRequiredWithoutItemsNestedInput
  }

  export type TierListItemUncheckedUpdateWithoutLinkSuggestionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    tierListId?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    rank?: EnumTierRankFieldUpdateOperationsInput | $Enums.TierRank
    linkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUpsertWithoutLinkSuggestionsSubmittedInput = {
    update: XOR<UserUpdateWithoutLinkSuggestionsSubmittedInput, UserUncheckedUpdateWithoutLinkSuggestionsSubmittedInput>
    create: XOR<UserCreateWithoutLinkSuggestionsSubmittedInput, UserUncheckedCreateWithoutLinkSuggestionsSubmittedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLinkSuggestionsSubmittedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLinkSuggestionsSubmittedInput, UserUncheckedUpdateWithoutLinkSuggestionsSubmittedInput>
  }

  export type UserUpdateWithoutLinkSuggestionsSubmittedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierLists?: TierListUpdateManyWithoutCreatedByNestedInput
    tierVotes?: TierListVoteUpdateManyWithoutUserNestedInput
    linkSuggestionsReviewed?: LinkSuggestionUpdateManyWithoutReviewedByNestedInput
    musicPlaylistsCreated?: MusicPlaylistUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutLinkSuggestionsSubmittedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierLists?: TierListUncheckedUpdateManyWithoutCreatedByNestedInput
    tierVotes?: TierListVoteUncheckedUpdateManyWithoutUserNestedInput
    linkSuggestionsReviewed?: LinkSuggestionUncheckedUpdateManyWithoutReviewedByNestedInput
    musicPlaylistsCreated?: MusicPlaylistUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUpsertWithoutLinkSuggestionsReviewedInput = {
    update: XOR<UserUpdateWithoutLinkSuggestionsReviewedInput, UserUncheckedUpdateWithoutLinkSuggestionsReviewedInput>
    create: XOR<UserCreateWithoutLinkSuggestionsReviewedInput, UserUncheckedCreateWithoutLinkSuggestionsReviewedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLinkSuggestionsReviewedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLinkSuggestionsReviewedInput, UserUncheckedUpdateWithoutLinkSuggestionsReviewedInput>
  }

  export type UserUpdateWithoutLinkSuggestionsReviewedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierLists?: TierListUpdateManyWithoutCreatedByNestedInput
    tierVotes?: TierListVoteUpdateManyWithoutUserNestedInput
    linkSuggestionsSubmitted?: LinkSuggestionUpdateManyWithoutSubmittedByNestedInput
    musicPlaylistsCreated?: MusicPlaylistUpdateManyWithoutCreatedByNestedInput
  }

  export type UserUncheckedUpdateWithoutLinkSuggestionsReviewedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierLists?: TierListUncheckedUpdateManyWithoutCreatedByNestedInput
    tierVotes?: TierListVoteUncheckedUpdateManyWithoutUserNestedInput
    linkSuggestionsSubmitted?: LinkSuggestionUncheckedUpdateManyWithoutSubmittedByNestedInput
    musicPlaylistsCreated?: MusicPlaylistUncheckedUpdateManyWithoutCreatedByNestedInput
  }

  export type UserCreateWithoutMusicPlaylistsCreatedInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    tierLists?: TierListCreateNestedManyWithoutCreatedByInput
    tierVotes?: TierListVoteCreateNestedManyWithoutUserInput
    linkSuggestionsSubmitted?: LinkSuggestionCreateNestedManyWithoutSubmittedByInput
    linkSuggestionsReviewed?: LinkSuggestionCreateNestedManyWithoutReviewedByInput
  }

  export type UserUncheckedCreateWithoutMusicPlaylistsCreatedInput = {
    id?: string
    email: string
    name?: string | null
    passwordHash: string
    role?: $Enums.Role
    createdAt?: Date | string
    updatedAt?: Date | string
    tierLists?: TierListUncheckedCreateNestedManyWithoutCreatedByInput
    tierVotes?: TierListVoteUncheckedCreateNestedManyWithoutUserInput
    linkSuggestionsSubmitted?: LinkSuggestionUncheckedCreateNestedManyWithoutSubmittedByInput
    linkSuggestionsReviewed?: LinkSuggestionUncheckedCreateNestedManyWithoutReviewedByInput
  }

  export type UserCreateOrConnectWithoutMusicPlaylistsCreatedInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMusicPlaylistsCreatedInput, UserUncheckedCreateWithoutMusicPlaylistsCreatedInput>
  }

  export type UserUpsertWithoutMusicPlaylistsCreatedInput = {
    update: XOR<UserUpdateWithoutMusicPlaylistsCreatedInput, UserUncheckedUpdateWithoutMusicPlaylistsCreatedInput>
    create: XOR<UserCreateWithoutMusicPlaylistsCreatedInput, UserUncheckedCreateWithoutMusicPlaylistsCreatedInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMusicPlaylistsCreatedInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMusicPlaylistsCreatedInput, UserUncheckedUpdateWithoutMusicPlaylistsCreatedInput>
  }

  export type UserUpdateWithoutMusicPlaylistsCreatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierLists?: TierListUpdateManyWithoutCreatedByNestedInput
    tierVotes?: TierListVoteUpdateManyWithoutUserNestedInput
    linkSuggestionsSubmitted?: LinkSuggestionUpdateManyWithoutSubmittedByNestedInput
    linkSuggestionsReviewed?: LinkSuggestionUpdateManyWithoutReviewedByNestedInput
  }

  export type UserUncheckedUpdateWithoutMusicPlaylistsCreatedInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    passwordHash?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierLists?: TierListUncheckedUpdateManyWithoutCreatedByNestedInput
    tierVotes?: TierListVoteUncheckedUpdateManyWithoutUserNestedInput
    linkSuggestionsSubmitted?: LinkSuggestionUncheckedUpdateManyWithoutSubmittedByNestedInput
    linkSuggestionsReviewed?: LinkSuggestionUncheckedUpdateManyWithoutReviewedByNestedInput
  }

  export type TierListCreateManyCreatedByInput = {
    id?: string
    title: string
    description?: string | null
    anime?: string | null
    category: string
    resourceUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TierListVoteCreateManyUserInput = {
    id?: string
    tierListId: string
    value?: number
    createdAt?: Date | string
  }

  export type LinkSuggestionCreateManySubmittedByInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    tierListId?: string | null
    tierListItemId?: string | null
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    reviewedById?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LinkSuggestionCreateManyReviewedByInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    tierListId?: string | null
    tierListItemId?: string | null
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    submittedById: string
    reviewedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type MusicPlaylistCreateManyCreatedByInput = {
    id?: string
    label: string
    url: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TierListUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: TierListItemUpdateManyWithoutTierListNestedInput
    votes?: TierListVoteUpdateManyWithoutTierListNestedInput
    linkSuggestions?: LinkSuggestionUpdateManyWithoutTierListNestedInput
  }

  export type TierListUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    items?: TierListItemUncheckedUpdateManyWithoutTierListNestedInput
    votes?: TierListVoteUncheckedUpdateManyWithoutTierListNestedInput
    linkSuggestions?: LinkSuggestionUncheckedUpdateManyWithoutTierListNestedInput
  }

  export type TierListUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    anime?: NullableStringFieldUpdateOperationsInput | string | null
    category?: StringFieldUpdateOperationsInput | string
    resourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TierListVoteUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierList?: TierListUpdateOneRequiredWithoutVotesNestedInput
  }

  export type TierListVoteUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tierListId?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TierListVoteUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    tierListId?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkSuggestionUpdateWithoutSubmittedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierList?: TierListUpdateOneWithoutLinkSuggestionsNestedInput
    tierListItem?: TierListItemUpdateOneWithoutLinkSuggestionsNestedInput
    reviewedBy?: UserUpdateOneWithoutLinkSuggestionsReviewedNestedInput
  }

  export type LinkSuggestionUncheckedUpdateWithoutSubmittedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    tierListId?: NullableStringFieldUpdateOperationsInput | string | null
    tierListItemId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    reviewedById?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkSuggestionUncheckedUpdateManyWithoutSubmittedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    tierListId?: NullableStringFieldUpdateOperationsInput | string | null
    tierListItemId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    reviewedById?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkSuggestionUpdateWithoutReviewedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierList?: TierListUpdateOneWithoutLinkSuggestionsNestedInput
    tierListItem?: TierListItemUpdateOneWithoutLinkSuggestionsNestedInput
    submittedBy?: UserUpdateOneRequiredWithoutLinkSuggestionsSubmittedNestedInput
  }

  export type LinkSuggestionUncheckedUpdateWithoutReviewedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    tierListId?: NullableStringFieldUpdateOperationsInput | string | null
    tierListItemId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    submittedById?: StringFieldUpdateOperationsInput | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkSuggestionUncheckedUpdateManyWithoutReviewedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    tierListId?: NullableStringFieldUpdateOperationsInput | string | null
    tierListItemId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    submittedById?: StringFieldUpdateOperationsInput | string
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MusicPlaylistUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MusicPlaylistUncheckedUpdateWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MusicPlaylistUncheckedUpdateManyWithoutCreatedByInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TierListItemCreateManyTierListInput = {
    id?: string
    label: string
    rank: $Enums.TierRank
    linkUrl?: string | null
    sortOrder?: number
    createdAt?: Date | string
  }

  export type TierListVoteCreateManyTierListInput = {
    id?: string
    userId: string
    value?: number
    createdAt?: Date | string
  }

  export type LinkSuggestionCreateManyTierListInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    tierListItemId?: string | null
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    submittedById: string
    reviewedById?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type TierListItemUpdateWithoutTierListInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    rank?: EnumTierRankFieldUpdateOperationsInput | $Enums.TierRank
    linkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    linkSuggestions?: LinkSuggestionUpdateManyWithoutTierListItemNestedInput
  }

  export type TierListItemUncheckedUpdateWithoutTierListInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    rank?: EnumTierRankFieldUpdateOperationsInput | $Enums.TierRank
    linkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    linkSuggestions?: LinkSuggestionUncheckedUpdateManyWithoutTierListItemNestedInput
  }

  export type TierListItemUncheckedUpdateManyWithoutTierListInput = {
    id?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    rank?: EnumTierRankFieldUpdateOperationsInput | $Enums.TierRank
    linkUrl?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TierListVoteUpdateWithoutTierListInput = {
    id?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutTierVotesNestedInput
  }

  export type TierListVoteUncheckedUpdateWithoutTierListInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TierListVoteUncheckedUpdateManyWithoutTierListInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    value?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkSuggestionUpdateWithoutTierListInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierListItem?: TierListItemUpdateOneWithoutLinkSuggestionsNestedInput
    submittedBy?: UserUpdateOneRequiredWithoutLinkSuggestionsSubmittedNestedInput
    reviewedBy?: UserUpdateOneWithoutLinkSuggestionsReviewedNestedInput
  }

  export type LinkSuggestionUncheckedUpdateWithoutTierListInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    tierListItemId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    submittedById?: StringFieldUpdateOperationsInput | string
    reviewedById?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkSuggestionUncheckedUpdateManyWithoutTierListInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    tierListItemId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    submittedById?: StringFieldUpdateOperationsInput | string
    reviewedById?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkSuggestionCreateManyTierListItemInput = {
    id?: string
    kind?: $Enums.LinkSuggestionKind
    tierListId?: string | null
    url: string
    title?: string | null
    note?: string | null
    status?: $Enums.SuggestionStatus
    submittedById: string
    reviewedById?: string | null
    reviewedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type LinkSuggestionUpdateWithoutTierListItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tierList?: TierListUpdateOneWithoutLinkSuggestionsNestedInput
    submittedBy?: UserUpdateOneRequiredWithoutLinkSuggestionsSubmittedNestedInput
    reviewedBy?: UserUpdateOneWithoutLinkSuggestionsReviewedNestedInput
  }

  export type LinkSuggestionUncheckedUpdateWithoutTierListItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    tierListId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    submittedById?: StringFieldUpdateOperationsInput | string
    reviewedById?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkSuggestionUncheckedUpdateManyWithoutTierListItemInput = {
    id?: StringFieldUpdateOperationsInput | string
    kind?: EnumLinkSuggestionKindFieldUpdateOperationsInput | $Enums.LinkSuggestionKind
    tierListId?: NullableStringFieldUpdateOperationsInput | string | null
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    note?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumSuggestionStatusFieldUpdateOperationsInput | $Enums.SuggestionStatus
    submittedById?: StringFieldUpdateOperationsInput | string
    reviewedById?: NullableStringFieldUpdateOperationsInput | string | null
    reviewedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}