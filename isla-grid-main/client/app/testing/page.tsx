"use client";

import {
  createUserContext,
  deleteUserContext,
  getUserContext,
  updateUserContext,
} from "@/lib/apiEndpoints/userContextsEndpoints";
import { CreateUserContextDTO, UserContext } from "@/types/userContextsType";
import React from "react";

const page = () => {
  const handleCreateContext = async () => {
    const userId = inputRef.current?.value as string;

    const acutalContext: CreateUserContextDTO = {
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
    };

    console.log("creating the context of user", userId);
    const result = await createUserContext("mock_auth_token", acutalContext);

    console.log(result);
  };

  const handleGetContext = async () => {
    const userId = inputRef.current?.value as string;

    console.log("getting the context of user", userId);
    const result = await getUserContext("mock_auth_token");

    console.log(result);
  };

  const handleDeleteContext = async () => {
    const userId = inputRef.current?.value as string;
    console.log("deleting the context of user", userId);
    const result = await deleteUserContext("mock_auth_token");

    console.log(result);
  };

  const handleUpdateContext = async () => {
    const userId = inputRef.current?.value as string;
    const newContextData: CreateUserContextDTO = {
      location: "another location after updateeeee",
      monthlyIncome: 1000,
      monthlyExpenses: 500,
      appliances: [
        {
          name: "appliance 1",
          usageIntensity: 100,
        },
      ],
    };

    console.log("updating the context of user", userId);
    const result = await updateUserContext("mock_auth_token", newContextData);

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
