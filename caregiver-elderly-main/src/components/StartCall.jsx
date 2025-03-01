import { useVoice } from "@humeai/voice-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/buttons";
import { Phone } from "lucide-react";

export default function StartCall() {
  const { status, connect } = useVoice();


  return (
    <AnimatePresence>
      {status.value !== "connected" ? (
        <div >
          <motion.div
          
            initial="initial"
            animate="enter"
            exit="exit"
            variants={{
              initial: { opacity: 0 },
              enter: { opacity: 1 },
              exit: { opacity: 0 },
            }}
          >
            <AnimatePresence>
              <motion.div
                variants={{
                  initial: { scale: 0.5 },
                  enter: { scale: 1 },
                  exit: { scale: 0.5 },
                }}
              >
                <Button
                  className={"z-50 items-center gap-1.5"}
                  onClick={() => {
                    // onPress() 
                    connect()
                      .then(() => {})
                      .catch(() => {})
                      .finally(() => {});
                  }}
                >
                  <span>
                    <Phone
                      className={"size-4 opacity-50"}
                      strokeWidth={2}
                      stroke={"currentColor"}
                    />
                  </span>
                  <span>Start Call</span>
                </Button>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
