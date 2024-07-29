"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefs = void 0;
const apollo_server_express_1 = require("apollo-server-express");
exports.typeDefs = (0, apollo_server_express_1.gql) `
  type Inventory {
    id: Int!
    quantity: Int!
    sku: String!
    description: String
    store: String!
  }

  input InventoryCreateInput {
    quantity: Int!
    sku: String!
    description: String
    store: String!
  }

  type Query {
    inventories: [Inventory!]!
    inventory(id: Int!): Inventory
  }

  type Mutation {
    createInventory(quantity: Int!, sku: String!, description: String, store: String!): Inventory!
    updateInventory(id: Int!, quantity: Int, sku: String, description: String, store: String): Inventory!
    deleteInventory(id: Int!): Inventory
    bulkCreateInventory(items: [InventoryCreateInput!]!): Int!
  }
`;
