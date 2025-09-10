import { motion } from "framer-motion";

export default function ChatShimmerBox({ width = "200px", height = "20px" }) {
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
    >
      <motion.div
        style={{
          background:
            "linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%)",
          // "linear-gradient(90deg, #757fb2 25%, #a6aed2 50%, #757fb2 75%)",
          height,
          width,
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  );
}
