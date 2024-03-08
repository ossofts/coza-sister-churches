import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { twMerge } from "tailwind-merge";

type Props = {
  tabs: {
    title: string;
    component: ReactNode;
  }[];
  extraClass?: string;
};

const TabsComponent = ({ tabs, extraClass }: Props) => {
  return (
    <Tabs
      defaultValue="0"
      className={twMerge("w-full mt-2 overflow-hidden", extraClass)}
    >
      <TabsList className={twMerge("flex justify-start")}>
        {tabs?.map((tabItem, idx) => (
          <TabsTrigger className="flex-1" key={idx} value={idx?.toString()}>
            {tabItem.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs?.map((content, idx) => (
        <TabsContent key={idx} className="px-2" value={idx?.toString()}>
          {content.component}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsComponent;
