import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { Button, Image } from "antd";
import { useDispatch } from "react-redux";
import { setUserRole } from "../../../redux/features/users/authSlice";
import { IoChatbubblesOutline } from "react-icons/io5";
import { MdArrowOutward } from "react-icons/md";
import ReactCurvedText from "react-curved-text";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";

import "./Modal.css";

interface ModalWindowProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isFixed: boolean;
  modalRef: React.RefObject<HTMLDivElement>; // Pass modalRef for the outer div
}

const ModalWindow: React.FC<ModalWindowProps> = ({
  visible,
  setVisible,
  isFixed,
  modalRef,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdminHovered, setIsAdminHovered] = useState(false);
  const [isSupplyHovered, setIsSupplyHovered] = useState(false);
  const [isContactHovered, setIsContactHovered] = useState(false);
  const [isDivOneVisible, setIsDivOneVisible] = useState(true); // Visibility of first div

  const [userQuestions, setUserQuestions] = useState<string[]>([]); // Update to array of strings
  const [apolloAnswers, setApolloAnswers] = useState<string[]>([]); // Update to array of strings
  const [isAnswering, setIsAnswering] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const role = "admin";
    dispatch(setUserRole({ role, email: "felu@gmail.com" }));
    setVisible(false); // Close the modal after action
    navigate(role === "admin" ? "/admin" : "/user");
  };

  const handleSupply = async () => {
    setVisible(false); // Close the modal
    navigate("/supply");
  };

  const handleContact = async () => {
    setVisible(false); // Close the modal
    navigate("/contact");
  };

  const toggleVisibility = () => {
    setIsDivOneVisible(!isDivOneVisible); // Toggle between two divs
    handleRestart();
  };

  const isMobile = window.innerWidth <= 768;

  const handleInsideClick = (e: React.MouseEvent) => {
    // Prevent closing the modal when clicking inside it
    e.stopPropagation();
  };

  const questions = [
    {
      question: "What is VerdantSpace?",
      answer:
        "VerdantSpace is a platform that helps you to create and connect eco-friendly spaces.",
    },
    {
      question: "How do I get started?",
      answer:
        "Getting started is simple. Sign up, explore our products, and buy them to decorate green spaces around you.",
    },
    {
      question: "Can I contribute to VerdantSpace?",
      answer: "Yes! You can supply us with plants and seeds.",
    },
  ];

  // Ref to control chat scrolling
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const handleQuestionClick = (
    selectedQuestion: string,
    selectedAnswer: string,
  ) => {
    setUserQuestions((prevQuestions) => [...prevQuestions, selectedQuestion]); // Add question to the list
    setIsAnswering(true);

    setTimeout(() => {
      setApolloAnswers((prevAnswers) => [...prevAnswers, selectedAnswer]); // Add answer after a delay
      setIsAnswering(false);
    }, 1000);
  };

  const handleRestart = () => {
    setUserQuestions(["Who are you?"]);
    setApolloAnswers(["👋 Hey, I am Apollo! I am here to assist you."]);
  };

  // Function to scroll chat to bottom when new message is added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [userQuestions, apolloAnswers]);

  const getModalDimensions = () => {
    const screenWidth = window.innerWidth;

    if (screenWidth < 350) {
      // Mini Small (ms)
      return { width: "75vw", height: "65vh" };
    } else if (screenWidth >= 350 && screenWidth < 429) {
      // Extra Small (xs)
      return { width: "65vw", height: "57vh" };
    } else if (screenWidth >= 430 && screenWidth < 767) {
      // Small (sm)
      return { width: "55vw", height: "55vh" };
    } else if (screenWidth >= 768 && screenWidth < 991) {
      // Medium (md)
      return { width: "35vw", height: "50vh" };
    } else if (screenWidth >= 992 && screenWidth < 1000) {
      // Large (lg)
      return { width: "27vw", height: "65vh" };
    } else if (screenWidth >= 1001 && screenWidth < 1200) {
      // Large (lg)
      return { width: "27vw", height: "40vh" };
    } else {
      // Extra Large (xl)
      return { width: "17vw", height: "45vh" };
    }
  };

  const { width, height } = getModalDimensions();

  return (
    <div
      ref={modalRef} // Attach modalRef to the outermost div of the modal
      style={{
        ...styles(isMobile).modalWindow,
        position: isFixed ? "absolute" : "absolute",
        bottom: isFixed ? "8vh" : "5vh",
        right: isFixed ? "1.6%" : "1.6%",
        opacity: visible ? "1" : "0",
        visibility: visible ? "visible" : "hidden",
        transition: "opacity 0.3s ease, visibility 0.3s ease",
        height,
        width,
        // height: isMobile ? "65vh" : "45vh",
        // width: isMobile ? "40vw" : "17vw",
        overflow: "hidden",
      }}
      onClick={handleInsideClick} // Prevent modal from closing on click inside
    >
      {isDivOneVisible && (
        <div style={{ width: "100%", height: "100%" }}>
          {/* Modal Header */}
          <div
            className="modal-header"
            // style={{
            //   display: "flex",
            //   justifyContent: "center",
            //   height: "45%",
            //   backgroundColor: "linear-gradient(to right, #628753, #628753)",
            //   borderRadius: "0px 0px 10px 10px",
            // }}
          >
            <div style={{ textAlign: "center", color: "#fff" }}>
              <ReactCurvedText
                width={295} // Number, not a string
                height={80} // Number, not a string
                cx={150} // Number
                cy={140} // Number
                rx={100} // Number
                ry={100} // Number
                startOffset={65} // Number
                reversed={true}
                text="WELCOME TO"
                textProps={{ style: { fontSize: 30 } }}
                textPathProps={{ fill: "#ffffff" }}
                tspanProps={undefined} // Use `undefined` instead of `null`
                ellipseProps={undefined} // Use `undefined` instead of `null`
                svgProps={undefined} // Use `undefined` instead of `null`
              />
              <Image
                src="/verdantspaceWhite.svg"
                preview={false}
                style={{
                  width: "auto%",
                  height: "9vh",
                  objectFit: "cover",
                  objectPosition: "center",
                  transform: "scale(1.009)",
                  marginTop: "-5vh",
                }}
              />
              <h1 style={{ marginTop: "-1.5vh" }}>VerdantSpace</h1>
            </div>
          </div>

          {/* Modal Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "55%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "90%",
                height: "10vh",
                backgroundColor: "#cfe8cc",
                marginBottom: "2vh",
                marginTop: "-2vh",
                borderRadius: "5px",
              }}
            >
              <div style={{ margin: "5%", width: "100%" }}>
                <p
                  style={{
                    fontSize: "120%",
                    fontWeight: "500",
                    marginBottom: "0.5vh",
                  }}
                >
                  Learn More
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    opacity: "0.8",
                    width: "100%",
                    borderRadius: "5px",
                    backgroundColor: isHovered ? "#bdcbc1" : "#fff",
                    height: "5vh",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <IoChatbubblesOutline
                    style={{
                      fontSize: "30px",
                      margin: "0 0.5vw",
                    }}
                  />
                  <div onClick={toggleVisibility}>
                    <p style={{ fontSize: "75%", fontWeight: "500" }}>Apollo</p>
                    <p>👋 Hi! I'm your Assistant.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "start",
                margin: "0 5%",
                width: "90%",
                height: "100%",
              }}
            >
              <Button
                style={{
                  backgroundColor: isAdminHovered ? "#cfe8cc" : "#628753",
                  transition: "background-color 0.3s ease",
                  color: isAdminHovered ? "black" : "#fff",
                  marginBottom: "0.6vh",
                }}
                onClick={handleLogin} // Close modal on button click
                type="text"
                onMouseEnter={() => setIsAdminHovered(true)}
                onMouseLeave={() => setIsAdminHovered(false)}
              >
                Admin Login <MdArrowOutward />
              </Button>

              <Button
                style={{
                  backgroundColor: isSupplyHovered ? "#cfe8cc" : "#628753",
                  transition: "background-color 0.3s ease",
                  color: isSupplyHovered ? "black" : "#fff",
                  marginBottom: "0.6vh",
                }}
                onClick={handleSupply} // Close modal on button click
                type="text"
                onMouseEnter={() => setIsSupplyHovered(true)}
                onMouseLeave={() => setIsSupplyHovered(false)}
              >
                Supply Us <MdArrowOutward />
              </Button>

              <Button
                style={{
                  backgroundColor: isContactHovered ? "#cfe8cc" : "#628753",
                  transition: "background-color 0.3s ease",
                  color: isContactHovered ? "black" : "#fff",
                }}
                onClick={handleContact} // Close modal on button click
                type="text"
                onMouseEnter={() => setIsContactHovered(true)}
                onMouseLeave={() => setIsContactHovered(false)}
              >
                Contact Us <MdArrowOutward />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Second Div */}
      {!isDivOneVisible && (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#cfe8cc",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Apollo Chat Header */}
          <div
            style={{
              width: "100%",
              height: "5vh",
              backgroundColor: "#fff",
              alignContent: "center",
            }}
          >
            <div
              onClick={toggleVisibility}
              style={{
                display: "flex",
                cursor: "pointer",
                backgroundColor: "#fff",
                padding: "10px",
              }}
            >
              <MdKeyboardDoubleArrowLeft
                style={{ fontSize: "30px", margin: "0 0.5vw" }}
              />
              <p
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                }}
              >
                Apollo Assist
              </p>
            </div>
          </div>

          {/* Chat Content */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              position: "relative",
              // border: '1px solid red',
              marginTop: "0.6vh",
            }}
          >
            {userQuestions.map((question, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                {/* User Message (on the right side) */}
                <div
                  style={{
                    marginTop: "2vh",
                    marginLeft: "auto",
                    backgroundColor: "#000",
                    color: "#fff",
                    padding: "10px 15px",
                    maxWidth: "60%",
                    borderRadius: "15px 15px 0 15px",
                    animation: "bounceInRight 0.5s", // Bounce animation for user message
                  }}
                >
                  <p>{question}</p>
                </div>

                {/* Apollo's Answer (on the left side) */}
                {apolloAnswers[index] && (
                  <div
                    style={{
                      marginTop: "2vh",
                      backgroundColor: "#e0f7fa",
                      padding: "10px 15px",
                      maxWidth: "60%",
                      borderRadius: "15px 15px 15px 0",
                      animation: "bounceInLeft 0.5s", // Bounce animation for Apollo's response
                    }}
                  >
                    <p>{apolloAnswers[index]}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Scroll to bottom ref */}
            <div ref={chatEndRef} />
          </div>

          {/* Questions */}
          {!isAnswering && userQuestions.length === apolloAnswers.length && (
            <div
              style={{
                // backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "10px",
                marginTop: "auto",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              }}
            >
              {questions.map((q) => (
                <div
                  key={q.question}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#fff",
                    padding: "10px",
                    borderRadius: "10px",
                    marginBottom: "10px",
                    cursor: "pointer",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    transition: "background-color 0.3s",
                  }}
                  onClick={() => handleQuestionClick(q.question, q.answer)}
                >
                  <p style={{ margin: "0", flex: "1" }}>{q.question}</p>
                  <MdArrowOutward />
                </div>
              ))}

              {/* Restart button */}
              {/* {userQuestions.length === questions.length && !isAnswering && (
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={handleRestart}
                    style={{
                      backgroundColor: "#628753",
                      color: "#fff",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Ask Again
                  </button>
                </div>
              )} */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ModalWindow;
