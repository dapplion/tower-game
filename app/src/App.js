import React from "react";
import { DrizzleContext } from "drizzle-react";
import MyDrizzleApp from "./MyDrizzleApp";

export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, drizzleState, initialized } = drizzleContext;
  
      if (!initialized) {
        return "Loading...";
      }

      return (
        <MyDrizzleApp drizzle={drizzle} drizzleState={drizzleState} />
      );
    }}
  </DrizzleContext.Consumer>
)
