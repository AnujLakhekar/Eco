import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {Loader as Loading} from "lucide-react" 

const Loader = () => {
  return (
    <div className="flex w-full h-[100vh] justify-center items-center">
      <span className="loading loading-spinner text-success"></span>
    </div>
  );
};

export default Loader;
