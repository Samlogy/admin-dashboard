import { BiMessageSquareDetail } from "react-icons/bi"
import { BsInfoCircle, BsListUl } from "react-icons/bs"
import { AiOutlineUserAdd, AiOutlineFileSearch, AiOutlineLineChart, AiFillHome, AiOutlineNumber } from "react-icons/ai"
import { BiAddToQueue } from "react-icons/bi"
import { RiMailAddFill } from "react-icons/ri"
import { FaUsers, FaProductHunt, FaRegNewspaper } from "react-icons/fa"

export const sideBarData = [
    {
      url: "/home",
      icon: <AiFillHome size="24" />,
      label: "Analytics",
      id: 0,
      subMenu: [
        {
          url: "/home",
          icon: AiOutlineNumber,
          label: "Statistics",
        },
        {
          url: "/home",
          icon: AiOutlineLineChart,
          label: "Charts",
        },
      ]
    },
    {
      url: "/users",
      icon: <FaUsers size="24" />,
      label: "Users Management",
      id: 1,
      subMenu: [
        {
          url: "/users",
          icon: BsListUl,
          label: "Users List",
        },
        {
          url: "/users",
          icon: AiOutlineUserAdd,
          label: "Create User",
        },
        {
          url: "/users",
          icon: AiOutlineFileSearch,
          label: "Search User",
        },
      ]
    },
    {
      url: "/products",
      icon: <FaProductHunt size="24" />,
      label: "Products Management",
      id: 2,
      subMenu: [
        {
          url: "/products",
          icon: BsListUl,
          label: "Produts List",
        },
        {
          url: "/products",
          icon: BiAddToQueue,
          label: "Create Product",
        },
        {
          url: "/products",
          icon: AiOutlineFileSearch,
          label: "Search Product",
        },
      ]
    },
    {
      url: "/newsletters",
      icon: <FaRegNewspaper size="24" />,
      label: "Newsletters",
      id: 3,
      subMenu: [
        {
          url: "/newsletter",
          icon: BsListUl,
          label: "Newsletter List",
        },
        {
          url: "/newsletter",
          icon: RiMailAddFill,
          label: "Write Newsletter",
        },
      ]
    },
    {
      url: "/contacts",
      icon: <BiMessageSquareDetail size="24" />,
      label: "Contacts",
      id: 4,
      subMenu: [
        {
          url: "/contacts",
          icon: BsListUl,
          label: "Contact List",
        },
        {
          url: "/contacts",
          icon: BiAddToQueue,
          label: "Create Contact",
        },
        {
          url: "/contacts",
          icon: AiOutlineFileSearch,
          label: "Search Contact",
        },
      ]
    },
    // {
    //   url: "/reports",
    //   icon: <BsInfoCircle size="24" />,
    //   label: "Reports"
    // },
];

export const menuData = [
  {
    title: "profile",
    items: ["My Profile"]
  },
  {
    title: "help",
    items: ["Tech Support"]
  }
];