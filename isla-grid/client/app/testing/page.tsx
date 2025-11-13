"use client";

import {
  createContext,
  deleteContext,
  getContext,
  updateContext,
} from "@/features/contexts/endpoints";
import { Context } from "@/types/userContextsType";
import React from "react";

const page = () => {
  const handleCreateContext = async () => {
    const userId = inputRef.current?.value as string;

    const acutalContext: Context = {
      userId: userId,
      contextValue: {
        location: "test",
        monthlyIncome: 1000,
        monthlyExpenses: 500,
        appliances: [
          {
            name: "appliance 1",
            usageIntensity: 100,
          },
          {
            name: "appliance 2",
            usageIntensity: 100,
          },
        ],
      },
    };

    console.log("creating the context of user", userId);
    const result = await createContext("mock_auth_token", acutalContext);

    console.log(result);
  };

  const handleGetContext = async () => {
    const userId = inputRef.current?.value as string;

    console.log("getting the context of user", userId);
    const result = await getContext("mock_auth_token", userId);

    console.log(result);
  };

  const handleDeleteContext = async () => {
    const userId = inputRef.current?.value as string;
    console.log("deleting the context of user", userId);
    const result = await deleteContext("mock_auth_token", userId);

    console.log(result);
  };

  const handleUpdateContext = async () => {
    const userId = inputRef.current?.value as string;
    const newContextData: Context = {
      userId: userId,
      contextValue: {
        location: "another location after updateeeee",
        monthlyIncome: 1000,
        monthlyExpenses: 500,
        appliances: [
          {
            name: "appliance 1",
            usageIntensity: 100,
          },
        ],
      },
    };

    console.log("updating the context of user", userId);
    const result = await updateContext("mock_auth_token", newContextData);

    console.log(result);
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex flex-col gap-2 w-fit p-5">
        <div className="w-fit border">
          <input
            type="text"
            ref={inputRef}
            className="w-fit p-2 border min-w-xl"
            placeholder="enter user id of the owner of the context here"
          />
        </div>

        <button onClick={handleCreateContext} className="w-fit p-2 border">
          Create Context
        </button>
        <button onClick={handleGetContext} className="w-fit p-2 border">
          GET Context
        </button>
        <button onClick={handleUpdateContext} className="w-fit p-2 border">
          UPDATE Context
        </button>
        <button className="w-fit p-2 border" onClick={handleDeleteContext}>
          DELETE Context
        </button>
      </div>
    </>
  );
};

export default page;
