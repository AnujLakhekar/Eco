import { TreeDeciduous } from "lucide-react";

export const roleStyles = {
  admin: {
    gradient: "from-error to-error-focus",
    bg: "bg-error/20",
    text: "text-error",
    badge: "badge badge-error",
    border: "border border-error",
  },
  teacher: {
    gradient: "from-warning to-warning-focus",
    bg: "bg-warning/20",
    text: "text-warning",
    badge: "badge badge-warning",
    border: "border border-warning",
  },
  student: {
    gradient: "from-info to-info-focus",
    bg: "bg-info/20",
    text: "text-info",
    badge: "badge badge-info",
    border: "border border-info",
  },
  default: {
    gradient: "from-neutral to-neutral-focus",
    bg: "bg-neutral/20",
    text: "text-neutral",
    badge: "badge badge-neutral",
    border: "border border-neutral",
  },
};

export const challenges = [
  {
    name: "Plant a tree with video proof!",
    id: "plant_tree",
    label: "Get a badge called planter and 100 points",
    Icon: ":)",
    reward: {
      points: 100,
      badge: "Planter",
    },
    color: "0",
    link: "/tasks",
  },
  {
    name: "Save Water",
    id: "save_water",
    label: "Get a badge called SaveWarrior and 100 points",
    Icon: "",
    reward: {
      points: 70,
      badge: "SaveWarrior",
    },
    color: "0",
    link: "/tasks",
  },
  {
    name: "Save Electricity",
    id: "save_electricity",
    label: "Get a badge called SaveWarrior and 100 points",
    Icon: "",
    reward: {
      points: 70,
      badge: "Electricity",
    },
    color: "0",
    link: "/tasks",
  },
];


