import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

type FadeInUpProps = HTMLMotionProps<"div"> & {
  delay?: number;
  duration?: number;
  y?: number;
  once?: boolean;
};

export function FadeInUp({
  children,
  delay = 0,
  duration = 0.5,
  y = 20,
  once = true,
  ...rest
}: FadeInUpProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children as React.ReactNode}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.2, 0.8, 0.2, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
