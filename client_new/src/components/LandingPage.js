import React from "react";
import Custom, { Another } from "./Custom";
import BigButton from "./BigButton";

export default function LandingPage() {
  return (
    <div>
      <Custom
        text="Track Your Wishlisted Products"
        color={"rgb(255,70,55)"}
        txt="white"
      />
      <Custom
        text="Get Notified when price drops!"
        color="rgb(255,255,100)"
        txt="rgb(0,120,255)"
      />
      <Another text="Add items from any platform!" color="rgb(59,255,150)" txt="rgb(59,150,255)" />
      <Another text="FOR FREE!" color="rgb(59,150,255)" txt="rgb(59,255,150)" />
      <BigButton/>
      <div className="absolute top-0 translate-x-[480px] translate-y-[100px]">
        <h1 className="text-4xl font-bold italic underline">BARGAIN HUNTER</h1>
      </div>
    </div>
  );
}
