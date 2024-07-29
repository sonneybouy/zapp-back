import { gql } from 'apollo-server-express';

export const typeDefs = gql`
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