import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

type Props = {
  trigger: React.ReactNode;
  menuItems: {
    label: React.ReactNode;
    onClick: () => void;
  }[];
};

const DropDownMenuComponent = ({ trigger, menuItems }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none" asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {menuItems?.map((item, idx) => (
          <React.Fragment key={idx}>
            <DropdownMenuItem onClick={item?.onClick}>{item?.label}</DropdownMenuItem>
            {idx !== menuItems?.length - 1 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDownMenuComponent;
