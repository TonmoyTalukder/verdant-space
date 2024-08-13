import { NavLink } from "react-router-dom";
import { TSidebarItem, TUserPath} from "../types";

export const sidebarItemsGenerator = (items: TUserPath[], role: string) => {
  const sidebarItems = items.reduce(
    (acc: TSidebarItem[], item) => {
    if (item.path && item.name) {
      // Check if the path already starts with '/role/', if so, use it as is
      const path = item.path.startsWith(`/${role}/`)
        ? item.path
        : `/${role}/${item.path}`;
        
      acc.push({
        key: item.name,
        label: <NavLink to={path}> {item.name} </NavLink>,
      });
    }

    if (item.children) {
      acc.push({
        key: item.name,
        label: item.name,
        children: item.children.map((child) => {
          // Again, check if the child path starts with '/role/'
          const childPath = child.path!.startsWith(`/${role}/`)
            ? child.path
            : `/${role}/${child.path}`;

          return {
            key: child.name,
            label: (
              <NavLink to={childPath!}> {child.name} </NavLink>
            ),
          };
        }),
      });
    }

    return acc;
  }, []);

  return sidebarItems;
};
