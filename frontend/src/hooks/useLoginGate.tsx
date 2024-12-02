import LoginModal from "@/components/login-modal/LoginModal";
import { selectAppState } from "@/features/map/appSlice";
import { useState } from "react";
import { useSelector } from "react-redux";

/**
 * Returns a modal placeholder and a function which accepts a callback that is
   called when the user is authenticated, or else a login modal is shown.
 */
export default function useLoginGate(): [
  React.ReactNode,
  (callback: () => void) => void,
] {
  const [modalVisible, setModalVisible] = useState(false);
  const appState = useSelector(selectAppState);
  const authenticated = appState.user;
  const modal = <LoginModal onClose={() => setModalVisible(false)} />;
  const gate = (callback: () => void) => {
    if (authenticated) {
      callback();
    } else {
      setModalVisible(true);
    }
  };
  return [modalVisible ? modal : null, gate];
}
