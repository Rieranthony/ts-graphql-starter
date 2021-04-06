import CellResolver from "./cell/resolver";
import TodoResolver from "./cell/resolver";
import CollectionResolver from "./cellCollection/resolver";

// Important: Add all your module's resolver in this
export const resolvers: [Function, ...Function[]] = [
  CellResolver,
  CollectionResolver
  // UserResolver
  // AuthResolver
  // ...
];
