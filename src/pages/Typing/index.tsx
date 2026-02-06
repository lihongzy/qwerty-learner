import { useImmerReducer } from "use-immer";
import { TypingContext } from "./store";
import { typingReducer ,initialState} from "./store";
import { DonateCard } from "@/components/DonateCard";

const TypingPage = () => {
  const [state, dispatch] = useImmerReducer(
    typingReducer,
    structuredClone(initialState),
  );
  return (
    <TypingContext.Provider value={{ state: state, dispatch }}>
      {state.isFinished && <DonateCard />}
      <DonateCard />
      <div>This is the Typing page.</div>
    </TypingContext.Provider>
  );
};

export default TypingPage;
