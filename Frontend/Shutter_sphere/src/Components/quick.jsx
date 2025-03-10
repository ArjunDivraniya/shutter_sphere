import React, { useRef } from 'react';
import { FaBell, FaComments, FaHeart, FaQuestionCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Quick = () => {
    const { t } = useTranslation();
    const quickActionsRef = useRef(null);

    return (
        <div>
            <motion.div
                ref={quickActionsRef}
                className="w-[100%] bg-gray-800 p-6 rounded-lg shadow-lg"
            >
                <h2 className="text-xl font-bold">{t("quickActions")}</h2>
                <div className="grid grid-cols-1 gap-4 mt-4">
                    {[
                        { icon: <FaBell />, label: t("notifications"), count: 4 },
                        { icon: <FaComments />, label: t("messages"), count: 3 },
                        { icon: <FaHeart />, label: t("wishlist"), count: 5 },
                        { icon: <FaQuestionCircle />, label: t("support"), count: 0 },
                    ].map((action, index) => (
                        <motion.button
                            key={index}
                            className="flex justify-between items-center bg-gray-700 px-4 py-2 rounded-lg hover:bg-yellow-500 transition duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <div className="flex items-center gap-2">
                                {action.icon} {action.label}
                            </div>
                            {action.count > 0 && (
                                <span className="bg-yellow-500 text-black px-2 py-1 rounded-full">
                                    {action.count}
                                </span>
                            )}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Quick;
