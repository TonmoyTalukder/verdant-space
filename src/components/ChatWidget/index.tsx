import React, { useEffect, useRef, useState } from "react";
import { styles } from "./styles";
import ModalWindow from "./ModalWindow";
import { Button } from "antd";
import { GiChatBubble } from "react-icons/gi";

interface ChatWidgetProps {
  isFixed: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isFixed }) => {
  const isMobile = window.innerWidth <= 768;
  const [hovered, setHovered] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [widgetRef]);

  return (
    <div
      ref={widgetRef}
      style={{
        ...styles(isMobile).chatWidget,
        position: isFixed ? "fixed" : "absolute",
        bottom: isFixed ? "3%" : "0",
        right: isFixed ? "1.6%" : "1.6%",
        border: hovered ? "1px solid black" : "",
      }}
      onClick={() => setVisible(!visible)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ModalWindow visible={visible} isFixed={isFixed} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button type="text">
          <GiChatBubble size={25} color="white" />
        </Button>
      </div>
    </div>
  );
};

export default ChatWidget;
