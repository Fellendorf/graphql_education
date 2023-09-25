import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLSchema,
  GraphQLList,
  GraphQLEnumType,
} from "graphql";
import { GraphQLDateTimeISO, GraphQLURL } from "graphql-scalars";
import { Car } from "../models/car.js";
import { Manufacturer } from "../models/manufacturer.js";

const { CarType, ManufacturerType, sortOrderType } = {
  CarType: new GraphQLObjectType({
    name: "Car",
    fields: () => ({
      id: { type: GraphQLID },
      model: { type: GraphQLString },
      year: { type: GraphQLInt },
      price: { type: GraphQLInt },
      description: { type: GraphQLString },
      image: { type: GraphQLURL },
      manufacturer: {
        type: ManufacturerType,
        resolve: ({ manufacturerId }) => Manufacturer.findById(manufacturerId),
      },
    }),
  }),
  ManufacturerType: new GraphQLObjectType({
    name: "Manufacturer",
    fields: () => ({
      id: { type: GraphQLID },
      name: { type: GraphQLString },
      foundationDate: { type: GraphQLDateTimeISO },
      description: { type: GraphQLString },
      founder: { type: GraphQLString },
      headQuarterLocation: { type: GraphQLString },
      cars: {
        type: new GraphQLList(CarType),
        resolve: ({ id }) => Car.find({ manufacturerId: id }),
      },
    }),
  }),
  sortOrderType: new GraphQLEnumType({
    name: "SortOrder",
    values: {
      ASC: { value: 1 },
      DESC: { value: -1 },
    },
  }),
};

const Query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    car: {
      type: CarType,
      args: { id: { type: GraphQLID } },
      resolve: (_, { id }) => Car.findById(id),
    },
    cars: {
      type: new GraphQLList(CarType),
      args: {
        limit: { type: GraphQLInt, defaultValue: 10 },
        skip: { type: GraphQLInt, defaultValue: 0 },
        sortOrder: { type: sortOrderType, defaultValue: sortOrderType.ASC },
        sortBy: { type: GraphQLString, defaultValue: "model" },
      },
      resolve: (_, { limit, skip, sortOrder, sortBy }) =>
        Car.find({})
          .limit(limit)
          .skip(skip)
          .sort({ [sortBy]: sortOrder }),
    },
    manufacturer: {
      type: ManufacturerType,
      args: { id: { type: GraphQLID } },
      resolve: (_, { id }) => Manufacturer.findById(id),
    },
    manufacturers: {
      type: new GraphQLList(ManufacturerType),
      args: {
        limit: { type: GraphQLInt, defaultValue: 10 },
        skip: { type: GraphQLInt, defaultValue: 0 },
        sortOrder: { type: sortOrderType, defaultValue: sortOrderType.ASC },
        sortBy: { type: GraphQLString, defaultValue: "name" },
      },
      resolve: (_, { limit, skip, sortOrder, sortBy }) =>
        Manufacturer.find({})
          .limit(limit)
          .skip(skip)
          .sort({ [sortBy]: sortOrder }),
    },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    addCar: {
      type: CarType,
      args: {
        model: { type: GraphQLString },
        year: { type: GraphQLInt },
        price: { type: GraphQLInt },
        description: { type: GraphQLString },
        image: { type: GraphQLURL },
        manufacturerName: { type: GraphQLString },
      },
      resolve: (
        _,
        { model, year, price, description, image, manufacturerName }
      ) => {
        return Manufacturer.findOne({ name: manufacturerName }, { id: 1 }).then(
          (manufacturer) => {
            if (!manufacturer) {
              throw new Error("Manufacturer is not found");
            }
            return new Car({
              model,
              year,
              price,
              description,
              image,
              manufacturerId: manufacturer.id,
            }).save();
          }
        );
      },
    },
  }),
});

export const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

