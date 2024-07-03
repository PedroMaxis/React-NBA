import {Infos} from "../Components/Camisa"

import { Header } from "../Components/Header"
export const Camisas = ({ className, ...props }) => {
    return (
      <div
        className={
          "bg-[#ffffff] flex flex-col gap-px items-center justify-start h-[1024px] relative overflow-hidden " +
          className
        }
      >
        <Header></Header>
        <Infos></Infos>
      </div>
    );
  };