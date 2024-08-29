import React, { useEffect, useRef, useState } from "react";
import { styles } from "./styles";
import ModalWindow from "./ModalWindow";
import { Button } from "antd";
import { GiChatBubble } from "react-icons/gi";
import { IoClose } from "react-icons/io5";

interface ChatWidgetProps {
  isFixed: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isFixed }) => {
  const isMobile = window.innerWidth <= 768;
  const [hovered, setHovered] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside widget and modal
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node) &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setVisible(false); // Close the modal when clicked outside
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [widgetRef, modalRef]);

  return (
    <div
      ref={widgetRef}
      style={{
        ...styles(isMobile).chatWidget,
        position: isFixed ? "fixed" : "absolute",
        bottom: isFixed ? "3%" : "1%",
        right: isFixed ? "1.6%" : "1.6%",
        border: hovered ? "1px solid black" : "",
      }}
      onClick={() => setVisible(!visible)} // Toggle modal visibility
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ModalWindow
        visible={visible}
        setVisible={setVisible} // Pass setVisible to control visibility
        isFixed={isFixed}
        modalRef={modalRef} // Pass modalRef for click detection inside modal
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button type="text">
          {visible ? (
            <IoClose size={25} color="white" /> // Render close icon when visible
          ) : (
            <GiChatBubble size={25} color="white" /> // Render chat bubble icon when not visible
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatWidget;
